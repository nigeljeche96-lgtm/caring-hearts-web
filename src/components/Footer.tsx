import { useSiteCopy } from "@/i18n/useSiteCopy";
import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import VoiceAgent from "@/components/VoiceAgent";
import GlobeMark from "@/components/GlobeMark";

const socialLinks = [
  { label: "Instagram", url: "https://www.instagram.com/wc_mentalhealthcare", icon: "instagram" },
  { label: "Facebook", url: "https://www.facebook.com/worldchangers.organisation/", icon: "facebook" },
  { label: "X", url: "https://www.x.com/wcmentalhealth1", icon: "x" },
  { label: "LinkedIn", url: "https://www.linkedin.com/company/world-changers-mental-health-care-org", icon: "linkedin" },
  { label: "YouTube", url: "https://www.youtube.com/@worldchangersmentalhealthc3036", icon: "youtube" },
];

const Footer = () => {
  const tx = useSiteCopy();
  const { t } = useTranslation();

  return (
    <footer className="relative overflow-hidden bg-navy-dark text-primary-foreground">
      <GlobeMark sizeClass="w-[240px] md:w-[340px]" positionClass="right-4 md:right-10 top-8" opacityClass="opacity-[0.14] md:opacity-[0.18]" />
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10">
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-heading text-base font-semibold mb-4">{tx("World Changers MHC")}</h4>
            <p className="text-sm opacity-70 leading-relaxed mb-4"> {tx("NGO REG: 238-677")}<br /> {tx("PBO Number: 930084594")}<br /><br /> {tx("Your donations are eligible for tax deduction.")} </p>
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">{tx("Organisation")}</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/" className="hover:opacity-100 hover:text-gold transition-all">{t("nav.home")}</Link></li>
              <li><Link to="/about" className="hover:opacity-100 hover:text-gold transition-all">{t("nav.about")}</Link></li>
              <li><Link to="/contact" className="hover:opacity-100 hover:text-gold transition-all">{t("nav.contact")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">{tx("Our Work")}</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/mental-health" className="hover:opacity-100 hover:text-gold transition-all">{tx("Mental Health Services")}</Link></li>
              <li><Link to="/philanthropy" className="hover:opacity-100 hover:text-gold transition-all">{tx("Programmes & Impact")}</Link></li>
              <li><Link to="/events" className="hover:opacity-100 hover:text-gold transition-all">{t("nav.events")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">{tx("Get Involved")}</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/become-volunteer" className="hover:opacity-100 hover:text-gold transition-all">{t("nav.becomeVolunteer")}</Link></li>
              <li><Link to="/donation" className="hover:opacity-100 hover:text-gold transition-all">{t("nav.donateNow")}</Link></li>
            </ul>
            <h4 className="font-heading text-base font-semibold mt-6 mb-4">{tx("Legal")}</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/policies#privacy" className="hover:opacity-100 hover:text-gold transition-all">{tx("Privacy Policy")}</Link></li>
              <li><Link to="/policies#terms" className="hover:opacity-100 hover:text-gold transition-all">{tx("Terms & Conditions")}</Link></li>
              <li><button type="button" onClick={() => window.dispatchEvent(new Event("wc:open-cookie-settings"))} className="hover:opacity-100 hover:text-gold transition-all">{tx("Cookie settings")}</button></li>
            </ul>

          </div>
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-heading text-base font-semibold mb-4">{t("footer.contactInfo")}</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li>
                <VoiceAgent variant="icon" className="text-primary-foreground [&_span]:text-primary-foreground/70 [&_span]:hover:text-primary-foreground" />
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-accent" />
                <a href="mailto:info@worldchangersmh.org" className="hover:opacity-100 hover:text-gold transition-all">info@worldchangersmh.org</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
                <a href="https://maps.google.com/?q=114+George+Street,+Kenilworth,+Johannesburg,+2190" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 hover:text-gold transition-all">{tx("114 George Street, Kenilworth, Johannesburg, 2190")}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs opacity-60">{t("footer.allRightsReserved")}</p>
            <div className="flex items-center gap-4">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm opacity-70 hover:opacity-100 hover:text-gold transition-all">{tx(s.label)}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
