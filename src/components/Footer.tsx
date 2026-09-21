import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import VoiceAgent from "@/components/VoiceAgent";

const socialLinks = [
  { label: "Instagram", url: "https://www.instagram.com/wc_mentalhealthcare", icon: "instagram" },
  { label: "Facebook", url: "https://www.facebook.com/worldchangers.organisation/", icon: "facebook" },
  { label: "X", url: "https://www.x.com/wcmentalhealth1", icon: "x" },
  { label: "LinkedIn", url: "https://www.linkedin.com/company/world-changers-mental-health-care-org", icon: "linkedin" },
  { label: "YouTube", url: "https://www.youtube.com/@worldchangersmentalhealthc3036", icon: "youtube" },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">World Changers MHC</h4>
            <p className="text-sm opacity-70 leading-relaxed mb-4">
              NGO REG: 238-677<br />
              PBO Number: 930084594<br /><br />
              Your donations are eligible for tax deduction.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">Organisation</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/" className="hover:opacity-100 hover:text-accent transition-all">{t("nav.home")}</Link></li>
              <li><Link to="/about" className="hover:opacity-100 hover:text-accent transition-all">{t("nav.about")}</Link></li>
              <li><Link to="/contact" className="hover:opacity-100 hover:text-accent transition-all">{t("nav.contact")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">Our Work</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/mental-health" className="hover:opacity-100 hover:text-accent transition-all">Mental Health Services</Link></li>
              <li><Link to="/philanthropy" className="hover:opacity-100 hover:text-accent transition-all">Programmes & Impact</Link></li>
              <li><Link to="/events" className="hover:opacity-100 hover:text-accent transition-all">{t("nav.events")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">Get Involved</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/become-volunteer" className="hover:opacity-100 hover:text-accent transition-all">{t("nav.becomeVolunteer")}</Link></li>
              <li><Link to="/donation" className="hover:opacity-100 hover:text-accent transition-all">{t("nav.donateNow")}</Link></li>
            </ul>
            <h4 className="font-heading text-base font-semibold mt-6 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/policies#privacy" className="hover:opacity-100 hover:text-accent transition-all">Privacy Policy</Link></li>
              <li><Link to="/policies#terms" className="hover:opacity-100 hover:text-accent transition-all">Terms &amp; Conditions</Link></li>
            </ul>

          </div>
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">{t("footer.contactInfo")}</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li>
                <VoiceAgent variant="icon" className="text-primary-foreground [&_span]:text-primary-foreground/70 [&_span]:hover:text-primary-foreground" />
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-accent" />
                <a href="mailto:info@worldchangersmh.org" className="hover:opacity-100 hover:text-accent transition-all">info@worldchangersmh.org</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
                <a href="https://maps.google.com/?q=114+George+Street,+Kenilworth,+Johannesburg,+2190" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 hover:text-accent transition-all">114 George Street, Kenilworth, Johannesburg, 2190</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs opacity-60">{t("footer.allRightsReserved")}</p>
            <div className="flex items-center gap-4">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">{s.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
