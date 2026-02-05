import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Combined function that classifies and extracts in one call
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Step 1: Classify the article
    const classifyResponse = await fetch(`${supabaseUrl}/functions/v1/classify-article`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ article_url, article_title, article_snippet }),
    });

    if (!classifyResponse.ok) {
      const errorText = await classifyResponse.text();
      throw new Error(`Classification failed: ${errorText}`);
    }

    const classifyResult = await classifyResponse.json();

    if (!classifyResult.should_extract) {
      return new Response(
        JSON.stringify({
          success: true,
          processed: false,
          reason: "Not classified as fatal road accident",
          classification: classifyResult.classification,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Extract incident data
    const extractResponse = await fetch(`${supabaseUrl}/functions/v1/extract-incident`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ article_url, article_title, article_snippet, source_name, published_at }),
    });

    if (!extractResponse.ok) {
      const errorText = await extractResponse.text();
      throw new Error(`Extraction failed: ${errorText}`);
    }

    const extractResult = await extractResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        processed: true,
        classification: classifyResult.classification,
        incident_id: extractResult.incident_id,
        is_new_incident: extractResult.is_new_incident,
        ai_summary: extractResult.ai_summary,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("process-article error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
