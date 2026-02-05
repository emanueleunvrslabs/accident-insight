import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { article_url, article_title, article_snippet } = await req.json();

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

    // First, classify if this is a fatal road accident
    const classificationPrompt = `Sei un assistente specializzato nell'analisi di notizie italiane sugli incidenti stradali.

Analizza il seguente articolo e determina se si tratta di un incidente stradale mortale in Italia.

Titolo: ${article_title}
Testo: ${article_snippet || "Non disponibile"}

Rispondi SOLO con un oggetto JSON nel seguente formato:
{
  "is_fatal_road_accident": true/false,
  "confidence": 0.0-1.0,
  "reason": "breve spiegazione"
}

Criteri per classificare come incidente stradale mortale:
- Deve essere un incidente su strada (auto, moto, bici, pedone, camion)
- Deve esserci almeno un decesso confermato
- Deve essere avvenuto in Italia
- NON includere: incidenti sul lavoro, malori, suicidi, eventi non stradali`;

    const classifyResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Sei un classificatore di notizie. Rispondi sempre e solo in formato JSON valido." },
          { role: "user", content: classificationPrompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!classifyResponse.ok) {
      if (classifyResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (classifyResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${classifyResponse.status}`);
    }

    const classifyData = await classifyResponse.json();
    let classification;
    
    try {
      const content = classifyData.choices?.[0]?.message?.content || "";
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        classification = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (e) {
      console.error("Failed to parse classification:", e);
      classification = { is_fatal_road_accident: false, confidence: 0, reason: "Parse error" };
    }

    // Store in queue with classification result
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: queueError } = await supabase.from("article_queue").upsert({
      article_url,
      article_title,
      article_snippet,
      status: classification.is_fatal_road_accident ? "classified_positive" : "classified_negative",
    }, { onConflict: "article_url" });

    if (queueError) {
      console.error("Queue error:", queueError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        classification,
        should_extract: classification.is_fatal_road_accident && classification.confidence >= 0.7,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("classify-article error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
