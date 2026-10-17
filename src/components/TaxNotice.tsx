import { Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Tax-deduction notice for donors; certificate requests are handled by email. */
const TaxNotice = ({ className = "" }: { className?: string }) => {
  const { t } = useTranslation();
  return (
    <div className={`flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm ${className}`}>
      <Receipt className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-foreground">{t("tax.title", "Your donation can reduce your tax")}</p>
        <p className="text-muted-foreground mt-1">
          {t("tax.body", "World Changers is a registered Public Benefit Organisation (PBO 930084594). To request a Section 18A tax certificate, email us with your name, the amount and your payment reference.")}{" "}
          <a href="mailto:info@worldchangersmh.org?subject=Section%2018A%20certificate%20request" className="text-primary font-medium hover:underline">
            info@worldchangersmh.org
          </a>
        </p>
      </div>
    </div>
  );
};

export default TaxNotice;
