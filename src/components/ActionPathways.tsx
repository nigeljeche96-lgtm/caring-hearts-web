import { Link } from "react-router-dom";
import { HeartHandshake, Heart, HandHeart, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Three clear next steps that match the main search intents (get help, give, volunteer). */
const ActionPathways = () => {
  const { t } = useTranslation();
  const doors = [
    { icon: HeartHandshake, to: "/mental-health", title: t("pathways.helpTitle", "Get free counselling"), desc: t("pathways.helpDesc", "Book a confidential session with a qualified professional, by appointment."), cta: t("pathways.helpCta", "Book a session") },
    { icon: Heart, to: "/donation", title: t("pathways.giveTitle", "Fund mental health care"), desc: t("pathways.giveDesc", "Your gift helps families and communities reach care. Section 18A tax receipts available."), cta: t("pathways.giveCta", "Donate now") },
    { icon: HandHeart, to: "/become-volunteer", title: t("pathways.volTitle", "Volunteer with us"), desc: t("pathways.volDesc", "Give your time and skills to outreach, events and community programmes."), cta: t("pathways.volCta", "Apply to volunteer") },
  ];
  return (
    <section className="section-padding" aria-labelledby="pathways-title">
      <div className="container mx-auto">
        <h2 id="pathways-title" className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
          {t("pathways.title", "How can we help you today?")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {doors.map((d) => (
            <Link key={d.to} to={d.to} className="group bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-card transition-shadow flex flex-col">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-hero-gradient transition-all">
                <d.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{d.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{d.desc}</p>
              <span className="mt-5 inline-flex items-center font-semibold text-primary">
                {d.cta} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActionPathways;
