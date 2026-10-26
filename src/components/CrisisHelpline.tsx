import { Phone, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

const lines = [
  { key: "suicide", label: "SADAG Suicide Crisis Line", number: "0800 567 567", href: "tel:0800567567" },
  { key: "sadag", label: "SADAG Mental Health Line", number: "011 234 4837", href: "tel:0112344837" },
  { key: "whatsapp", label: "SADAG WhatsApp (9am–5pm)", number: "076 882 2775", href: "https://wa.me/27768822775" },
  { key: "lifeline", label: "Lifeline South Africa", number: "0861 322 322", href: "tel:0861322322" },
  { key: "gbv", label: "GBV Command Centre", number: "0800 428 428", href: "tel:0800428428" },
  { key: "childline", label: "Childline SA", number: "116", href: "tel:116" },
  { key: "emergency", label: "National Emergency", number: "112", href: "tel:112" },
];

/** 24/7 South African crisis lines with a discreet quick-exit button. */
const CrisisHelpline = () => {
  const { t } = useTranslation();
  const quickExit = () => window.location.replace("https://www.google.com");

  return (
    <section className="bg-destructive text-destructive-foreground" aria-labelledby="crisis-title">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-destructive-foreground/15 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider opacity-90">{t("crisis.label", "Free · 24/7 · Confidential")}</p>
              <h2 id="crisis-title" className="font-heading text-lg md:text-xl font-bold leading-tight">
                {t("crisis.title", "Need help right now? Call a crisis line")}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={quickExit}
            className="self-start md:self-auto inline-flex items-center gap-2 rounded-lg border border-destructive-foreground/40 px-4 py-2 text-sm font-semibold hover:bg-destructive-foreground/15 transition-colors"
          >
            <LogOut className="w-4 h-4" /> {t("crisis.quickExit", "Quick exit")}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-sm">
          {lines.map((l) => (
            <a key={l.key} href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="bg-destructive-foreground/10 hover:bg-destructive-foreground/20 rounded-lg px-3 py-2 transition-colors">
              <div className="text-[11px] opacity-90 leading-tight">{t(`crisis.${l.key}`, l.label)}</div>
              <div className="font-bold">{l.number}</div>
            </a>
          ))}
        </div>
        <p className="text-xs opacity-90 mt-3">
          {t("crisis.note", "If you or someone near you is in immediate danger, call 112 now. Our booked sessions are not an emergency service.")}
        </p>
      </div>
    </section>
  );
};

export default CrisisHelpline;
