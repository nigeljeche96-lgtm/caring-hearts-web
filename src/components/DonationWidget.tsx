import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Globe, ShieldCheck, ArrowRight, ChevronDown, ExternalLink, Lock, Landmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const DONORBOX_SLUG = "international-payments";
const DONORBOX_URL = `https://donorbox.org/${DONORBOX_SLUG}`;



const PRESETS = [100, 250, 500, 1000, 2500, 5000];

const CURRENCIES = [
  { code: "ZAR", label: "South African Rand", symbol: "R" },
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$" },
  { code: "CAD", label: "Canadian Dollar", symbol: "C$" },
];

const DonationWidget = () => {
  const [amount, setAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [currency, setCurrency] = useState("ZAR");
  const [intlOpen, setIntlOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [payfastLoading, setPayfastLoading] = useState(false);

  const selected = customAmount ? Number(customAmount) || 0 : amount ?? 0;
  const currencyMeta = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];
  const isInternational = currency !== "ZAR";

  const donorboxSrc =
    `https://donorbox.org/embed/${DONORBOX_SLUG}` +
    `?default_interval=${frequency === "monthly" ? "m" : "o"}` +
    (selected > 0 ? `&amount=${selected}` : "") +
    `&currency=${currency.toLowerCase()}&hide_donation_meter=true`;

  const startPaystack = async () => {
    if (selected < 5) {
      toast.error("Please choose an amount of at least R5.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address so we can send your receipt.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("paystack-initialize", {
        body: { email, name, amount: selected, currency, frequency },
      });
      if (error || !data?.authorization_url) {
        throw new Error(data?.error || error?.message || "Checkout could not be started.");
      }
      window.location.href = data.authorization_url as string;
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Checkout could not be started. Please try again.");
      setLoading(false);
    }
  };

  const startPayfast = async () => {
    if (selected < 5) {
      toast.error("Please choose an amount of at least R5.");
      return;
    }
    setPayfastLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("payfast-signature", {
        body: { amount: selected, frequency, name, email, origin: window.location.origin },
      });
      if (error || !data?.fields || !data?.action) {
        throw new Error(data?.error || error?.message || "Payfast could not be opened.");
      }

      const form = document.createElement("form");
      form.method = "post";
      form.action = data.action as string;
      form.target = "_top";
      form.style.display = "none";
      Object.entries(data.fields as Record<string, string>).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Payfast could not be opened. Please try again.");
      setPayfastLoading(false);
    }
  };

  return (
    <div id="donate" className="scroll-mt-28">
      <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-elevated border border-border overflow-hidden">
        {/* Frequency */}
        <div className="p-6 md:p-8 border-b border-border">
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl mb-6" role="group" aria-label="Donation frequency">
            {(["once", "monthly"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                aria-pressed={frequency === f}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  frequency === f ? "bg-card text-primary shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "once" ? "Give Once" : "Give Monthly"}
              </button>
            ))}
          </div>

          {/* Currency */}
          <div className="mb-6">
            <Label htmlFor="donation-currency" className="text-sm font-semibold">Currency</Label>
            <select
              id="donation-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-2 w-full h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} — {c.label}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              South African Rand donations are processed by Paystack or Payfast. All other currencies are processed by our international donation partner, which applies its own conversion at checkout.
            </p>
          </div>

          {/* Amounts */}
          <fieldset>
            <legend className="text-sm font-semibold text-foreground mb-3">Choose an amount</legend>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {PRESETS.map((p) => {
                const active = !customAmount && amount === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => { setAmount(p); setCustomAmount(""); }}
                    aria-pressed={active}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                      active
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-background text-foreground hover:border-accent/60"
                    }`}
                  >
                    {currencyMeta.symbol}{p.toLocaleString()}
                  </button>
                );
              })}
            </div>
            <div className="mt-3">
              <Label htmlFor="custom-amount" className="text-sm">Or enter your own amount</Label>
              <Input
                id="custom-amount"
                inputMode="numeric"
                placeholder={`${currencyMeta.symbol} Other amount`}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                className="mt-2 h-11"
              />
            </div>
          </fieldset>

          {/* Donor details (local checkout) */}
          {!isInternational && (
            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              <div>
                <Label htmlFor="donor-name" className="text-sm">Your name (optional)</Label>
                <Input id="donor-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2 h-11" placeholder="Full name" />
              </div>
              <div>
                <Label htmlFor="donor-email" className="text-sm">Email for your receipt</Label>
                <Input id="donor-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-11" placeholder="you@example.com" />
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="px-6 md:px-8 py-5 bg-muted/60 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Your donation</p>
            <p className="font-heading text-2xl font-bold text-foreground">
              {currencyMeta.symbol}{selected.toLocaleString()}{" "}
              <span className="text-sm font-medium text-muted-foreground">
                {frequency === "monthly" ? "every month" : "once-off"} · {currency}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-4 h-4 text-primary" />
            Payment is completed securely with our payment provider
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 md:p-8 space-y-4">
          {!isInternational ? (
            <>
              <Button
                type="button"
                size="lg"
                disabled={selected <= 0 || loading}
                onClick={startPaystack}
                className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparing secure checkout…</>
                ) : (
                  <>Continue securely with Paystack <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or pay with</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                size="lg"
                variant="outline"
                disabled={selected <= 0 || payfastLoading}
                onClick={startPayfast}
                className="w-full border-primary/40 text-primary hover:bg-primary/5"
              >
                {payfastLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Opening Payfast…</>
                ) : (
                  <>Donate with Payfast <ExternalLink className="w-4 h-4 ml-2" /></>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                You will confirm your {frequency === "monthly" ? "monthly" : "once-off"} amount on the provider's secure checkout page. We never collect or store your card details on this website.
              </p>
            </>
          ) : (
            <>
              <Button
                type="button"
                size="lg"
                onClick={() => setIntlOpen((v) => !v)}
                aria-expanded={intlOpen}
                aria-controls="international-panel"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Globe className="w-4 h-4 mr-2" />
                {intlOpen ? "Hide international checkout" : "Continue with international payment"}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${intlOpen ? "rotate-180" : ""}`} />
              </Button>

              <AnimatePresence initial={false}>
                {intlOpen && (
                  <motion.div
                    id="international-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border border-border bg-background p-3">
                      <iframe
                        key={donorboxSrc}
                        src={donorboxSrc}
                        title="International donation checkout"
                        name="donorbox"
                        allow="payment"
                        className="w-full min-h-[680px] rounded-lg border-0"
                      />
                      <p className="text-xs text-muted-foreground mt-3 text-center">
                        Having trouble?{" "}
                        <a href={DONORBOX_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                          Open the international donation page in a new tab <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* Trust */}
      <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4 mt-6">
        {[
          { icon: ShieldCheck, title: "Secure checkout", desc: "Card details are handled only by our regulated payment providers." },
          { icon: Landmark, title: "Registered organisation", desc: "NPO 238-677 · PBO 930084594 — donations are tax deductible in South Africa." },
          { icon: Heart, title: "Direct to our work", desc: "Gifts support our mental health care and community outreach programmes." },
        ].map((item) => (
          <div key={item.title} className="bg-card rounded-xl border border-border p-5">
            <item.icon className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-heading text-sm font-semibold text-foreground">{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationWidget;
