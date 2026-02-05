import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ITALIAN_REGIONS = [
  "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna",
  "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche",
  "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana",
  "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto"
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { article_url, article_title, article_snippet, source_name, published_at } = await req.json();

    if (!article_url || !article_title) {
      return new Response(
        JSON.stringify({ error: "article_url and article_title are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const extractionPrompt = `Sei un assistente legale specializzato nell'estrazione di informazioni da articoli su incidenti stradali mortali in Italia.

Analizza il seguente articolo ed estrai le informazioni strutturate.

Titolo: ${article_title}
Testo: ${article_snippet || "Non disponibile"}

Estrai le seguenti informazioni e restituisci SOLO un oggetto JSON valido:

{
  "event_date": "YYYY-MM-DD o null se non disponibile",
  "event_time": "HH:MM o null se non disponibile",
  "city": "nome città",
  "province": "sigla provincia (es: MI, RM, NA) o null",
  "region": "nome regione tra: ${ITALIAN_REGIONS.join(", ")}",
  "road_name": "nome strada/autostrada o null",
  "deceased_count": numero,
  "injured_count": numero o null,
  "accident_type": "auto-auto|auto-moto|auto-pedone|auto-bici|veicolo-singolo|camion|altro",
  "dynamics_description": "breve descrizione della dinamica (2-3 frasi, riscritta, non copiata)",
  "victim_details": [{"age_range": "es: 40-50", "role": "conducente|passeggero|pedone|ciclista|motociclista"}],
  "confidence_score": 0.0-1.0
}

IMPORTANTE:
- Se una data non è specificata, usa la data di oggi come stima
- Sii preciso con i numeri di vittime
- La descrizione deve essere originale, non copiata
- Non includere dati personali sensibili (nomi, indirizzi specifici)`;

    const extractResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Sei un estrattore di dati strutturati. Rispondi sempre e solo in formato JSON valido." },
          { role: "user", content: extractionPrompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!extractResponse.ok) {
      if (extractResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (extractResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${extractResponse.status}`);
    }

    const extractData = await extractResponse.json();
    let extracted;
    
    try {
      const content = extractData.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extracted = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (e) {
      console.error("Failed to parse extraction:", e);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Now generate the AI summary
    const summaryPrompt = `Genera un riassunto legale-professionale dell'incidente stradale descritto.

Dati estratti:
${JSON.stringify(extracted, null, 2)}

Scrivi un riassunto in italiano di 3-4 frasi che:
- Sia neutrale e fattuale
- Sia adatto per un contesto legale/assicurativo
- NON copi testo dall'articolo originale
- Includa data, luogo, tipo di incidente e conseguenze

Rispondi SOLO con il testo del riassunto, senza formattazione extra.`;

    const summaryResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Sei un assistente legale che scrive riassunti professionali in italiano." },
          { role: "user", content: summaryPrompt },
        ],
        temperature: 0.3,
      }),
    });

    let aiSummary = "";
    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      aiSummary = summaryData.choices?.[0]?.message?.content || "";
    }

    // Store in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for potential duplicates (same date, same city)
    const { data: existingIncidents } = await supabase
      .from("incidents")
      .select("id, city, event_date")
      .eq("event_date", extracted.event_date)
      .ilike("city", `%${extracted.city}%`)
      .limit(5);

    let incidentId: string;
    let isNewIncident = true;

    if (existingIncidents && existingIncidents.length > 0) {
      // Link to existing incident (deduplication)
      incidentId = existingIncidents[0].id;
      isNewIncident = false;
    } else {
      // Create new incident
      const { data: newIncident, error: incidentError } = await supabase
        .from("incidents")
        .insert({
          event_date: extracted.event_date || new Date().toISOString().split("T")[0],
          event_time: extracted.event_time,
          city: extracted.city,
          province: extracted.province,
          region: extracted.region,
          road_name: extracted.road_name,
          deceased_count: extracted.deceased_count || 1,
          injured_count: extracted.injured_count,
          accident_type: extracted.accident_type || "altro",
          dynamics_description: extracted.dynamics_description,
          victim_details: extracted.victim_details,
          ai_summary: aiSummary,
          confidence_score: extracted.confidence_score,
        })
        .select("id")
        .single();

      if (incidentError) {
        throw new Error(`Failed to create incident: ${incidentError.message}`);
      }
      incidentId = newIncident.id;
    }

    // Add source
    const { error: sourceError } = await supabase.from("incident_sources").insert({
      incident_id: incidentId,
      source_name: source_name || "Unknown",
      article_url,
      article_title,
      published_at,
      raw_snippet: article_snippet,
    });

    if (sourceError) {
      console.error("Source error:", sourceError);
    }

    // Update queue status
    await supabase
      .from("article_queue")
      .update({ status: "processed", processed_at: new Date().toISOString() })
      .eq("article_url", article_url);

    return new Response(
      JSON.stringify({
        success: true,
        incident_id: incidentId,
        is_new_incident: isNewIncident,
        extracted,
        ai_summary: aiSummary,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("extract-incident error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
