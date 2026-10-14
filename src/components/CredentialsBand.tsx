import { Globe, ShieldCheck, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Founding/NPO/PBO credentials; one straight line that scrolls on phones, static row on larger screens. */
export default function CredentialsBand() {
  const { t } = useTranslation();
  const items = [
    { icon: Globe, value: "2017", label: t("about.credFounded", "Founded in South Africa") },
    { icon: ShieldCheck, value: "NPO 238-677", label: t("about.credNgo", "Registered non-profit organisation") },
    { icon: Award, value: "PBO 930084594", label: t("about.credPbo", "Public benefit organisation") },
  ];
  const renderItem = (c: (typeof items)[number], key: string) => (
    <div key={key} className="flex items-center gap-3 shrink-0 px-6 md:px-0">
      <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center shrink-0">
        <c.icon className="w-5 h-5 text-primary-foreground" />
      </div>
      <div className="whitespace-nowrap">
        <p className="font-heading text-lg md:text-2xl font-bold text-primary-foreground leading-tight">{c.value}</p>
        <p className="text-xs md:text-sm text-gold">{c.label}</p>
      </div>
    </div>
  );
  return (
    <>
      <div className="md:hidden py-5 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[0, 1, 2].map((g) => (
            <div key={g} className="flex" aria-hidden={g > 0}>
              {items.map((c) => renderItem(c, `${g}-${c.value}`))}
            </div>
          ))}
        </div>
      </div>
      <div className="hidden md:flex container mx-auto px-4 py-8 justify-around">
        {items.map((c) => renderItem(c, c.value))}
      </div>
    </>
  );
}
