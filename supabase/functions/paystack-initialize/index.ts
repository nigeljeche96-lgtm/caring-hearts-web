import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface Body {
  email?: string;
  amount?: number;
  currency?: string;
  frequency?: "once" | "monthly";
  name?: string;
}

const ALLOWED_CURRENCIES = ["ZAR", "USD", "GHS", "KES", "NGN"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const secret = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!secret) return json({ error: "Payment provider is not configured." }, 500);

    const body = (await req.json().catch(() => ({}))) as Body;
    const email = (body.email || "").trim();
    const amount = Number(body.amount);
    const currency = (body.currency || "ZAR").toUpperCase();
    const frequency = body.frequency === "monthly" ? "monthly" : "once";
    const name = (body.name || "").trim().slice(0, 120);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return json({ error: "A valid email address is required." }, 400);
    }
    if (!Number.isFinite(amount) || amount < 5 || amount > 1_000_000) {
      return json({ error: "Please enter an amount between 5 and 1 000 000." }, 400);
    }
    if (!ALLOWED_CURRENCIES.includes(currency)) {
      return json({ error: "This currency is not supported by our local provider." }, 400);
    }

    const subunits = Math.round(amount * 100);
    const origin = req.headers.get("origin") || "https://worldchangersmh.org";

    const payload: Record<string, unknown> = {
      email,
      amount: subunits,
      currency,
      callback_url: `${origin}/donation?status=success`,
      metadata: {
        donor_name: name || null,
        frequency,
        source: "website-donation-widget",
      },
    };

    // Recurring gifts need a Paystack plan.
    if (frequency === "monthly") {
      const planRes = await fetch("https://api.paystack.co/plan", {
        method: "POST",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Monthly donation ${currency} ${amount}`,
          amount: subunits,
          interval: "monthly",
          currency,
        }),
      });
      const planData = await planRes.json();
      if (!planRes.ok || !planData?.data?.plan_code) {
        console.error("Paystack plan error", planData);
        return json({ error: "Could not set up the monthly donation." }, 502);
      }
      payload.plan = planData.data.plan_code;
    }

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok || !data?.data?.authorization_url) {
      console.error("Paystack init error", data);
      return json({ error: data?.message || "Could not start the checkout." }, 502);
    }

    return json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error("paystack-initialize error", err);
    return json({ error: "Unexpected error starting the checkout." }, 500);
  }
});
