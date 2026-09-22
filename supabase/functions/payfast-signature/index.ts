import { createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// PayFast requires values urlencoded with uppercase hex and spaces as '+'
const pfEncode = (value: string) =>
  encodeURIComponent(value.trim())
    .replace(/%20/g, "+")
    .replace(/%[0-9a-f]{2}/g, (m) => m.toUpperCase());

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const merchantId = Deno.env.get("PAYFAST_MERCHANT_ID");
    const merchantKey = Deno.env.get("PAYFAST_MERCHANT_KEY");
    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE") ?? "";
    if (!merchantId || !merchantKey) {
      return json({ error: "Payfast is not configured." }, 500);
    }

    const { amount, frequency, name, email, origin } = await req.json();
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 5 || value > 1_000_000) {
      return json({ error: "Please choose an amount between R5 and R1 000 000." }, 400);
    }
    const monthly = frequency === "monthly";
    const site = typeof origin === "string" && origin.startsWith("https://")
      ? origin
      : "https://worldchangersmh.org";

    // Order matters: the signature is built from the fields in this exact order.
    const fields: Array<[string, string]> = [
      ["merchant_id", merchantId],
      ["merchant_key", merchantKey],
      ["return_url", `${site}/donation?status=success`],
      ["cancel_url", `${site}/donation?status=cancelled`],
    ];
    if (typeof name === "string" && name.trim()) fields.push(["name_first", name.trim().slice(0, 80)]);
    if (typeof email === "string" && email.includes("@")) {
      fields.push(["email_address", email.trim().slice(0, 100)]);
    }
    fields.push(["amount", value.toFixed(2)]);
    fields.push(["item_name", "Donation - World Changers Mental Health Care Org"]);
    fields.push([
      "item_description",
      "Supporting mental health care and community programmes in Southern Africa",
    ]);
    if (monthly) {
      fields.push(["subscription_type", "1"]);
      fields.push(["recurring_amount", value.toFixed(2)]);
      fields.push(["frequency", "3"]);
      fields.push(["cycles", "0"]);
    }

    let base = fields.map(([k, v]) => `${k}=${pfEncode(v)}`).join("&");
    if (passphrase) base += `&passphrase=${pfEncode(passphrase)}`;
    const signature = createHash("md5").update(base).digest("hex");

    return json({
      action: "https://payment.payfast.io/eng/process",
      fields: Object.fromEntries([...fields, ["signature", signature]]),
    });
  } catch (err) {
    console.error("payfast-signature failed", err);
    return json({ error: "Payfast could not start the payment." }, 500);
  }
});
