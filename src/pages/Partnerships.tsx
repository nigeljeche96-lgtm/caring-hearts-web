import { useState } from "react";
import { Link } from "react-router-dom";

import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Building2, Users, Heart, Handshake, Sparkles, Shield, ArrowRight, CheckCircle, Loader2, Send, Award, Globe, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import philanthropyBg from "@/assets/philanthropy-bg.jpg";

const DONATE_URL = "https://paystack.shop/pay/87qgnu5n8o";

const corporateOptions = [
  "Corporate Sponsorship",
  "Strategic Collaboration",
  "Programme Funding",
  "Strategic Alliances (Licensing & Co-Branding)",
  "Workplace Giving & Employee Matching Gifts",
  "Cause-Related Marketing Campaigns",
  "Corporate Philanthropy",
  "Skills-Based Volunteering",
  "Employee Wellness Partnerships",
  "Other Partnership Opportunities",
];

const individualOptions = [
  { icon: Heart, title: "Monthly Giving Programme", desc: "Sustained support that funds ongoing mental health and community work." },
  { icon: Users, title: "Volunteer Opportunities", desc: "Lend your time and skills to programmes that change lives." },
  { icon: Globe, title: "Community Ambassador Programme", desc: "Champion our mission within your local community and networks." },
  { icon: TrendingUp, title: "Fundraising Champions", desc: "Lead campaigns that rally friends, family, and colleagues." },
  { icon: Sparkles, title: "Event Sponsorship", desc: "Underwrite events that build awareness and connection." },
  { icon: Award, title: "Legacy & Planned Giving", desc: "Create lasting impact through bequests and planned gifts." },
  { icon: Handshake, title: "Peer-to-Peer Fundraising", desc: "Build your own fundraising page in support of our cause." },
  { icon: Shield, title: "Skills-Based Volunteering", desc: "Contribute professional expertise to strengthen our operations." },
  { icon: Building2, title: "Advocacy & Awareness", desc: "Help shift the conversation around mental health." },
];

const membershipBenefits = [
  "Supporting sustainable mental health and community programmes",
  "Helping fund community outreach initiatives",
  "Early access to selected events",
  "Discounted event tickets where applicable",
  "Exclusive newsletters and impact reports",
  "Invitations to selected partner networking opportunities",
  "Recognition within the supporter community",
];

const donationAmounts = [100, 200, 400, 500, 800, 1000];

const Partnerships = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(500);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "", contact_person: "", email: "", phone: "", website: "",
    partnership_type: "", partnership_details: "", expected_outcomes: "",
  });

  const updateField = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleCorporateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const composedMessage =
        `Partnership Enquiry from ${form.company_name}\n\n` +
        `Company: ${form.company_name}\n` +
        `Contact Person: ${form.contact_person}\n` +
        `Email: ${form.email}\n` +
        `Phone: ${form.phone}\n` +
        `Website: ${form.website || "—"}\n` +
        `Partnership Type: ${form.partnership_type}\n\n` +
        `Proposed Partnership Details:\n${form.partnership_details}\n\n` +
        `Expected Outcomes:\n${form.expected_outcomes}`;

      const payload = {
        full_name: `${form.contact_person} (${form.company_name})`.slice(0, 100),
        email: form.email.trim(),
        subject: `Corporate Partnership Enquiry — ${form.partnership_type}`.slice(0, 200),
        message: composedMessage,
      };

      const { error } = await supabase.from("contact_messages").insert(payload);
      if (error) throw error;
      setSubmitted(true);
      toast.success("Partnership enquiry submitted successfully");
      supabase.functions.invoke("send-contact-notification", { body: payload }).catch(console.warn);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const activeAmount = selectedAmount === "custom" ? Number(customAmount) || 0 : selectedAmount;

  return (
    <div>
      <SEO
        title="Partner With Us — World Changers MHCO"
        description="Join us in creating lasting social impact through corporate and individual partnerships. Fund programmes, volunteer, or become a recurring supporter."
        path="/partnerships"
      />
      <PageHero
        title="Partner With Us"
        subtitle="Join us in creating lasting social impact through meaningful partnerships."
        bgImage={philanthropyBg}
      />

      {/* Intro */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Whether you are a business, foundation, community organisation, or individual supporter, your partnership helps us expand access to mental health services,
            community development programmes, education initiatives, and sustainable social change. Together, we can build healthier, stronger, and more empowered communities.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-hero-gradient text-primary-foreground hover:opacity-90">
              <a href="#corporate-form">Become a Partner <ArrowRight className="w-4 h-4 ml-2" /></a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <a href="#individual">Support as an Individual</a>
            </Button>
          </div>
        </div>
      </section>

      {/* CORPORATE SECTION */}
      <section className="section-padding bg-muted">
        <div className="container mx-auto">
          <SectionHeading
            label="For Organisations"
            title="Corporate & Business Partnerships"
            description="Build a partnership that aligns with your values and creates measurable social impact."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3 mb-12">
            {corporateOptions.map((opt, i) => (
              <motion.div
                key={opt}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-xl p-4 shadow-soft border border-border flex items-start gap-2"
              >
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-foreground">{opt}</span>
              </motion.div>
            ))}
          </div>

          <div id="corporate-form" className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Corporate Partnership Enquiry</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Submissions are sent directly to{" "}
                <a href="mailto:info@worldchangersmh.org" className="text-primary underline">info@worldchangersmh.org</a>.
              </p>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-heading text-2xl font-bold text-foreground mb-2">Enquiry Received</h4>
                  <p className="text-muted-foreground">Thank you. Our partnerships team will be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleCorporateSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Company Name *</label>
                      <Input required value={form.company_name} onChange={(e) => updateField("company_name", e.target.value)} maxLength={150} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Contact Person *</label>
                      <Input required value={form.contact_person} onChange={(e) => updateField("contact_person", e.target.value)} maxLength={100} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address *</label>
                      <Input type="email" required value={form.email} onChange={(e) => updateField("email", e.target.value)} maxLength={255} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number *</label>
                      <Input type="tel" required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} maxLength={30} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Website</label>
                    <Input type="url" placeholder="https://" value={form.website} onChange={(e) => updateField("website", e.target.value)} maxLength={255} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Partnership Type *</label>
                    <select
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={form.partnership_type}
                      onChange={(e) => updateField("partnership_type", e.target.value)}
                    >
                      <option value="">Select a partnership type</option>
                      {corporateOptions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Proposed Partnership Details *</label>
                    <Textarea required rows={4} maxLength={3000} value={form.partnership_details} onChange={(e) => updateField("partnership_details", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Expected Outcomes *</label>
                    <Textarea required rows={3} maxLength={2000} value={form.expected_outcomes} onChange={(e) => updateField("expected_outcomes", e.target.value)} />
                  </div>
                  <Button type="submit" size="lg" disabled={loading} className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90">
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : <>Submit Enquiry <ArrowRight className="w-4 h-4 ml-2" /></>}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* INDIVIDUAL SECTION */}
      <section id="individual" className="section-padding">
        <div className="container mx-auto">
          <SectionHeading
            label="For Individuals"
            title="Individual Partnerships"
            description="Every contribution — of time, voice, or resource — strengthens our communities."
          />

          {/* Membership */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div>
                <h3 className="font-heading text-2xl font-bold text-foreground">Membership & Partner Subscription</h3>
              </div>
              <p className="text-muted-foreground mb-5">
                Support our mission through a recurring monthly contribution and become part of our community of changemakers.
              </p>
              <ul className="space-y-2 mb-6">
                {membershipBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {b}
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/donation">Become a Monthly Partner <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><Heart className="w-6 h-6 text-primary" /></div>
                <h3 className="font-heading text-2xl font-bold text-foreground">One-Time Donation</h3>
              </div>
              <p className="text-muted-foreground">
                Make a single, meaningful gift. Donations help expand services, support vulnerable communities, and strengthen the long-term
                sustainability of our organisation and its programmes.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Choose your amount below — every contribution counts.
              </p>
            </motion.div>
          </div>

          {/* Donation Interface */}
          <div className="max-w-3xl mx-auto bg-card rounded-3xl p-6 sm:p-10 shadow-elevated border border-border">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" /> Secure Payment · Paystack
              </span>
              <h3 className="font-heading text-3xl font-bold text-foreground mt-3">Make a Donation</h3>
              <p className="text-muted-foreground mt-2">Choose an amount and your preferred frequency.</p>
            </div>

            {/* Frequency toggle */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-muted rounded-full p-1">
                {(["once", "monthly"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f)}
                    className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                      frequency === f ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f === "once" ? "One-Time" : "Monthly"}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {donationAmounts.map((amt) => {
                const active = selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                    className={`rounded-2xl border-2 py-6 px-4 text-center transition-all ${
                      active
                        ? "border-primary bg-primary/5 shadow-soft scale-[1.02]"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    <p className={`font-heading text-2xl font-bold ${active ? "text-primary" : "text-foreground"}`}>R{amt.toLocaleString()}</p>
                    {amt === 500 && <p className="text-[10px] uppercase tracking-wider text-accent mt-1">Most Popular</p>}
                  </button>
                );
              })}
            </div>

            {/* Custom amount */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-1.5 block">Custom Amount (ZAR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R</span>
                <Input
                  type="number"
                  min={1}
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount("custom"); }}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted rounded-xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Your contribution</p>
                <p className="font-heading text-2xl font-bold text-foreground">
                  R{activeAmount.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/ {frequency === "monthly" ? "month" : "once"}</span>
                </p>
              </div>
              <Shield className="w-8 h-8 text-primary/40" />
            </div>

            <Button asChild size="lg" disabled={activeAmount <= 0} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base">
              <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                Continue to Secure Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              You will be redirected to Paystack to complete your donation safely.
            </p>
          </div>

          {/* Individual partnership options */}
          <div className="mt-20">
            <SectionHeading label="More Ways To Help" title="Additional Individual Partnership Options" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {individualOptions.map((o, i) => (
                <motion.div
                  key={o.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl p-6 shadow-soft border border-border hover:shadow-card transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <o.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-heading text-lg font-semibold text-foreground mb-2">{o.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{o.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partnerships;
