import { useTranslation } from "react-i18next";
import nestle from "@/assets/donors/IMG_3121.JPG.asset.json";
import foodForLife from "@/assets/donors/IMG_3122.PNG.asset.json";
import spar from "@/assets/donors/IMG_3123.PNG.asset.json";
import unitedNations from "@/assets/donors/IMG_3125.JPG.asset.json";
import usaid from "@/assets/donors/IMG_3126.WEBP.asset.json";
import unicef from "@/assets/donors/IMG_3127.WEBP.asset.json";

const donors = [
  { name: "Nestlé", image: nestle.url },
  { name: "Food For Life", image: foodForLife.url },
  { name: "SPAR", image: spar.url },
  { name: "United Nations", image: unitedNations.url },
  { name: "USAID", image: usaid.url },
  { name: "UNICEF", image: unicef.url },
];

export default function TrustedDonors() {
  const { t } = useTranslation();
  return (
    <section className="py-10 sm:py-12 bg-card border-y border-border overflow-hidden" aria-label={t("donors.trustedBy", "Trusted by")}>
      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">{t("donors.trustedBy", "Trusted by")}</h2>
      <div className="donor-marquee">
        <div className="donor-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="donor-group" aria-hidden={copy === 1 ? true : undefined}>
              {donors.map((donor) => (
                <div key={donor.name} className="donor-logo">
                  <img src={donor.image} alt={copy === 0 ? donor.name : ""} loading="lazy" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}