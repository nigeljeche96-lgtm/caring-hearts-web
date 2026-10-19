import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Fixed place (World Changers Mental Health Care Organisation). No client input is
// forwarded to Google, and results are cached to keep Places usage bounded.
const PLACE_ID = "ChIJPzHZAPMUlR4RlAifTTHdo60";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";
const CACHE_MS = 6 * 60 * 60 * 1000;

let cache: { at: number; body: string } | null = null;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const headers = { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" };

  if (cache && Date.now() - cache.at < CACHE_MS) return new Response(cache.body, { headers });

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");
  if (!LOVABLE_API_KEY || !GOOGLE_MAPS_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing Google Maps credentials" }), { status: 500, headers });
  }

  const res = await fetch(`${GATEWAY_URL}/places/v1/places/${PLACE_ID}`, {
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GOOGLE_MAPS_API_KEY,
      "X-Goog-FieldMask": "displayName,rating,userRatingCount,googleMapsUri,reviews",
    },
  });
  if (!res.ok) {
    const details = await res.text();
    console.error(`Places request failed [${res.status}]: ${details}`);
    if (cache) return new Response(cache.body, { headers });
    return new Response(JSON.stringify({ error: "Provider request failed", status: res.status, details }), { status: res.status, headers });
  }
  const p = await res.json();
  const body = JSON.stringify({
    rating: p.rating ?? null,
    total: p.userRatingCount ?? 0,
    mapsUri: p.googleMapsUri ?? null,
    reviews: (p.reviews ?? []).map((r: any) => ({
      author: r.authorAttribution?.displayName ?? "Google user",
      authorUri: r.authorAttribution?.uri ?? null,
      photo: r.authorAttribution?.photoUri ?? null,
      rating: r.rating ?? 5,
      text: r.originalText?.text ?? r.text?.text ?? "",
      when: r.relativePublishTimeDescription ?? "",
    })).filter((r: any) => r.text),
  });
  cache = { at: Date.now(), body };
  return new Response(body, { headers });
});
