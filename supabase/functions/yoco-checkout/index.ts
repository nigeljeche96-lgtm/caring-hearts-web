import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const secret = Deno.env.get("YOCO_SECRET_KEY");
    if (!secret) return json({ error: "Card payments are not configured yet." }, 500);

    const body = await req.json().catch(() => ({}));
    const amount = Number(body?.amount);
    const frequency = body?.frequency === "monthly" ? "monthly" : "once";
    const name = String(body?.name ?? "").trim().slice(0, 120);
    const email = String(body?.email ?? "").trim().slice(0, 254);
    const origin = typeof body?.origin === "string" && body.origin.startsWith("http")
      ? body.origin
      : "https://worldchangersmh.org";

    if (!Number.isFinite(amount) || amount < 5 || amount > 1_000_000) {
      return json({ error: "Please choose an amount between R5 and R1 000 000." }, 400);
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Please enter a valid email address." }, 400);
    }

    const res = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: "ZAR",
        successUrl: `${origin}/donation?status=success`,
        cancelUrl: `${origin}/donation?status=cancelled`,
        failureUrl: `${origin}/donation?status=failed`,
        metadata: {
          donor_name: name || "Anonymous",
          donor_email: email || "not provided",
          frequency,
          source: "website-donation-widget",
        },
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.redirectUrl) {
      console.error("Yoco checkout error", res.status, data);
      return json({ error: data?.message || "Could not start the checkout." }, 502);
    }

    return json({ redirectUrl: data.redirectUrl, id: data.id });
  } catch (err) {
    console.error("yoco-checkout failed", err);
    return json({ error: "Unexpected error starting the checkout." }, 500);
  }
});
