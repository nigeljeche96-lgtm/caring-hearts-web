import { useState } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, Send, Newspaper, Loader2 } from "lucide-react";
import VoiceAgent from "@/components/VoiceAgent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PageHero from "@/components/PageHero";
import { useTranslation } from "react-i18next";
import aboutBg from "@/assets/about-bg.jpg";

const Contact = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", subject: "", message: "" });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const contactInfo = [
    { icon: Mail, label: t("contact.email"), value: "info@worldchangersmh.org", href: "mailto:info@worldchangersmh.org" },
    { icon: MapPin, label: t("contact.address"), value: "114 George Street, Kenilworth, Johannesburg, 2190", href: "https://maps.google.com/?q=114+George+Street,+Kenilworth,+Johannesburg,+2190" },
    { icon: Clock, label: t("contact.hours"), value: "Mon – Fri: 8AM – 6PM", href: undefined },
  ];

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        full_name: form.full_name.trim(), email: form.email.trim(), subject: form.subject.trim(), message: form.message.trim(),
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success(t("contact.messageSent"));
      supabase.functions.invoke("send-contact-notification", { body: form }).catch(console.warn);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to send message. Please try again.");
    } finally { setLoading(false); }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterLoading(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email: newsletterEmail.trim(),
      });
      if (error) {
        if (error.code === '23505') {
          toast.info("You're already subscribed!");
        } else {
          throw error;
        }
      }
      setNewsletterSubmitted(true);
      toast.success("Successfully subscribed!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div>

      <SEO title="Contact World Changers MHCO" description="Get in touch with World Changers Mental Health Care Organisation in Kenilworth, South Africa. Email, address and contact form." path="/contact" jsonLd={{"@context":"https://schema.org","@type":"LocalBusiness","name":"World Changers Mental Health Care Organisation","email":"info@worldchangersmh.org","url":"https://worldchangersmh.org/contact","address":{"@type":"PostalAddress","streetAddress":"114 George Street","addressLocality":"Kenilworth","addressCountry":"ZA"},"openingHours":"Mo-Fr 09:00-17:00"}} />
      <PageHero title={t("contact.heroTitle")} subtitle={t("contact.heroSubtitle")} bgImage={aboutBg} />

      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="sr-only">{t("contact.getInTouch")}</h2>
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-heading text-2xl font-bold text-foreground">{t("contact.getInTouch")}</h3>
              <p className="text-muted-foreground">{t("contact.getInTouchDesc")}</p>
              <div className="space-y-4">
                {contactInfo.map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <c.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.label}</p>
                      {c.href ? (
                        <a href={c.href} target={c.label === t("contact.address") ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm text-primary hover:underline">{c.value}</a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <VoiceAgent variant="icon" />
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-3 bg-card rounded-2xl p-8 shadow-card">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><Send className="w-8 h-8 text-primary" /></div>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">{t("contact.messageSent")}</h3>
                  <p className="text-muted-foreground">{t("contact.messageSentDesc")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contact.fullName")}</label>
                      <Input placeholder="John Doe" required value={form.full_name} onChange={(e) => updateField("full_name", e.target.value)} maxLength={100} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contact.emailLabel")}</label>
                      <Input type="email" placeholder="john@example.com" required value={form.email} onChange={(e) => updateField("email", e.target.value)} maxLength={255} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contact.subject")}</label>
                    <Input placeholder="How can we help?" required value={form.subject} onChange={(e) => updateField("subject", e.target.value)} maxLength={200} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contact.message")}</label>
                    <Textarea placeholder="Tell us more..." rows={5} required value={form.message} onChange={(e) => updateField("message", e.target.value)} maxLength={2000} />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90" disabled={loading}>
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : <>{t("common.sendMessage")} <Send className="w-4 h-4 ml-2" /></>}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-muted">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"><Newspaper className="w-8 h-8 text-primary" /></div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">{t("contact.newsletterTitle")}</h2>
            <p className="text-muted-foreground mb-8">{t("contact.newsletterDesc")}</p>
            {newsletterSubmitted ? (
              <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
                <p className="text-primary font-semibold">{t("contact.thankYouSubscribe")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("contact.nextNewsletter")}</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input type="email" placeholder={t("contact.enterEmail")} required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} className="flex-1" />
                <Button type="submit" className="bg-hero-gradient text-primary-foreground hover:opacity-90 px-8" disabled={newsletterLoading}>
                  {newsletterLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{t("common.subscribe")} <Mail className="w-4 h-4 ml-2" /></>}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-0">
        <div className="container mx-auto px-4 mb-10">
          <div className="text-center">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">{t("contact.ourLocation")}</span>
            <h2 className="font-heading text-3xl font-bold text-foreground mt-2">{t("contact.findUsMap")}</h2>
          </div>
        </div>
        <div className="w-full h-[450px]">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.4!2d28.0456!3d-26.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s114+George+Street%2C+Kenilworth%2C+Johannesburg%2C+2190!5e0!3m2!1sen!2sza!4v1700000000000!5m2!1sen!2sza"
            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="World Changers MHC Location" />
        </div>
      </section>
    </div>
  );
};

export default Contact;
