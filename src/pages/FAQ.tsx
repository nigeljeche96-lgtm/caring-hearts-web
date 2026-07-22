import PageHero from "@/components/PageHero";
import SEO from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import aboutBg from "@/assets/about-bg.jpg";

const FAQ = () => {
  const { t } = useTranslation();

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
    { q: t("faq.q7"), a: t("faq.a7") },
    { q: t("faq.q8"), a: t("faq.a8") },
    { q: t("faq.q9"), a: t("faq.a9") },
    { q: t("faq.q10"), a: t("faq.a10") },
    { q: t("faq.q11"), a: t("faq.a11") },
    { q: t("faq.q12"), a: t("faq.a12") },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div>

      <SEO title="Frequently Asked Questions — World Changers MHCO" description="Answers to common questions about World Changers programs, donations, volunteering and mental health services." path="/faq" jsonLd={faqJsonLd} />
      <PageHero title={t("faq.heroTitle")} subtitle={t("faq.heroSubtitle")} bgImage={aboutBg} />
      <section className="section-padding">
        <div className="container mx-auto max-w-3xl">
          <SectionHeading label={t("faq.questionsLabel")} title={t("faq.questionsTitle")} />
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border border-border px-6 shadow-soft">
                <AccordionTrigger className="text-left font-heading text-base font-semibold text-foreground hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
