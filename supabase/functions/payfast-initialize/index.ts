import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const PAYFAST_PROCESS = "https://payment.payfast.io/eng/process";
const RECEIVER = "20490969";
const ITEM_NAME = "WORLD CHANGERS MENTAL HEALTH CARE ORG";
const ITEM_DESC =
  "We can create a better tomorrow. Every donation supports our programs. Let us change the world together.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = await req.json().catch(() => ({}));
    const amount = Number(body.amount);
    const frequency = body.frequency === "monthly" ? "monthly" : "once";
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";

    if (!Number.isFinite(amount) || amount < 5 || amount > 1_000_000) {
      return json({ error: "Please enter an amount between R5 and R1 000 000." }, 400);
    }

    const origin = req.headers.get("origin") || "https://worldchangersmh.org";
    const form = new URLSearchParams({
      cmd: "_paynow",
      receiver: RECEIVER,
      amount: amount.toFixed(2),
      item_name: ITEM_NAME,
      item_description: ITEM_DESC,
      return_url: `${origin}/donation?status=success`,
      cancel_url: `${origin}/donation?status=cancelled`,
    });
    if (email) form.set("email_address", email);
    if (name) form.set("name_first", name);
    if (frequency === "monthly") {
      form.set("subscription_type", "1");
      form.set("recurring_amount", amount.toFixed(2));
      form.set("frequency", "3");
      form.set("cycles", "0");
    }

    const res = await fetch(PAYFAST_PROCESS, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      redirect: "manual",
    });

    const location = res.headers.get("location");
    if (!location) {
      console.error("Payfast did not return a payment page", res.status, await res.text());
      return json({ error: "Payfast could not start the payment." }, 502);
    }

    return json({ redirect_url: location });
  } catch (err) {
    console.error("payfast-initialize error", err);
    return json({ error: "Unexpected error starting the Payfast payment." }, 500);
  }
});
