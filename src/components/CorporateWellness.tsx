import { Sun, Flame, LifeBuoy, GraduationCap, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

const packages = [
  { key: "days", icon: Sun, title: "Employee Wellbeing Days", desc: "On-site or virtual days with talks, group sessions and one-on-one check-ins for your staff." },
  { key: "burnout", icon: Flame, title: "Burnout & Resilience Seminars", desc: "Practical seminars for managers and teams on stress, workload and recovery." },
  { key: "trauma", icon: LifeBuoy, title: "Trauma Debriefing", desc: "Support for teams after a serious incident, loss or crisis in the workplace." },
  { key: "training", icon: GraduationCap, title: "Mental Health Awareness Training", desc: "Help staff spot early warning signs and guide colleagues to the right support." },
];

const CorporateWellness = () => {
  const { t } = useTranslation();
  return (
    <section className="section-padding bg-muted">
      <div className="container mx-auto">
        <SectionHeading
          label={t("corpWellness.label", "For Companies")}
          title={t("corpWellness.title", "Workplace Wellness Packages")}
          description={t("corpWellness.desc", "Look after your people while supporting our community work. Every package is tailored to your team.")}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {packages.map((p) => (
            <div key={p.key} className="bg-card rounded-2xl p-6 shadow-soft border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <p.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{t(`corpWellness.${p.key}.title`, p.title)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(`corpWellness.${p.key}.desc`, p.desc)}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild size="lg" className="bg-hero-gradient text-primary-foreground hover:opacity-90">
            <a href="#corporate-form">{t("corpWellness.cta", "Request a wellness package")} <ArrowRight className="w-4 h-4 ml-2" /></a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CorporateWellness;
