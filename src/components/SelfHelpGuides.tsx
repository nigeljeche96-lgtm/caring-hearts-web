import { Wind, BatteryLow, Flower2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeading from "@/components/SectionHeading";

const guides = [
  {
    key: "anxiety", icon: Wind, title: "Coping with anxiety",
    tips: [
      "Breathe in for 4 counts, hold for 4, breathe out for 6. Repeat five times.",
      "Name 5 things you can see, 4 you can hear and 3 you can touch to ground yourself.",
      "Limit caffeine and keep a regular sleep routine.",
    ],
  },
  {
    key: "burnout", icon: BatteryLow, title: "Preventing burnout",
    tips: [
      "Take short breaks away from screens during the working day.",
      "Set clear start and finish times, and protect your rest days.",
      "Talk to your manager or someone you trust before stress builds up.",
    ],
  },
  {
    key: "grief", icon: Flower2, title: "Living with grief",
    tips: [
      "There is no right way or timeline to grieve. Be patient with yourself.",
      "Keep simple routines: eat, sleep and move a little each day.",
      "Share memories with people who knew your loved one, or join a support group.",
    ],
  },
];

const SelfHelpGuides = () => {
  const { t } = useTranslation();
  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <SectionHeading
          label={t("guides.label", "Free Resources")}
          title={t("guides.title", "Self-Help Guides")}
          description={t("guides.desc", "Simple, practical steps you can start today. These guides do not replace professional care.")}
        />
        <div className="grid md:grid-cols-3 gap-6">
          {guides.map((g) => (
            <div key={g.key} className="bg-card rounded-2xl p-6 shadow-soft border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <g.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-3">{t(`guides.${g.key}.title`, g.title)}</h3>
              <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground leading-relaxed">
                {g.tips.map((tip, i) => (
                  <li key={i}>{t(`guides.${g.key}.tip${i + 1}`, tip)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelfHelpGuides;
