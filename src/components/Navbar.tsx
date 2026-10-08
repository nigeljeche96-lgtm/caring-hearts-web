import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
import { languages } from "@/i18n";
import logoWhite from "@/assets/logo-white.png.asset.json";

const DONATE_URL = "/donation";

type NavChild = { label: string; path?: string; href?: string };
type NavLink = { label: string; path?: string; children?: NavChild[] };

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const navLinks: NavLink[] = [
    { label: t("nav.home"), path: "/" },
    {
      label: t("nav.about"),
      children: [
        { label: "About Us", path: "/about" },
        { label: "Our Team", path: "/team" },
      ],
    },
    {
      label: "Our Work",
      children: [
        { label: "Mental Health Services", path: "/mental-health" },
        { label: "Programmes & Impact", path: "/philanthropy" },
        { label: "Portfolio", path: "/portfolio" },
        { label: t("nav.events"), path: "/events" },
      ],
    },
    {
      label: "Media",
      children: [
        { label: "News", path: "/news" },
        { label: "Gallery", path: "/gallery" },
      ],
    },
    {
      label: "Get Involved",
      children: [
        { label: t("nav.becomeVolunteer"), path: "/become-volunteer" },
        { label: "Donation", path: "/donation" },
        { label: "Partnerships", path: "/partnerships" },
      ],
    },
    { label: "FAQ", path: "/faq" },
    { label: t("nav.contact"), path: "/contact" },
  ];

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <header className="sticky top-0 z-50 bg-navy border-b border-gold/50">
      <div className="container mx-auto flex items-center justify-between h-28 md:h-32 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img alt="World Changers" className="h-10 sm:h-14 md:h-20 w-auto" src={logoWhite.url} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative" onMouseEnter={() => setOpenDropdown(link.label)} onMouseLeave={() => setOpenDropdown(null)}>
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-primary-foreground hover:text-gold transition-colors rounded-lg">
                  {link.label} <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {openDropdown === link.label && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-card rounded-lg shadow-elevated border border-border py-2">
                      {link.children.map((child) =>
                        child.href ? (
                          <a key={child.label} href={child.href} target="_blank" rel="noopener noreferrer"
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">
                            {child.label}
                          </a>
                        ) : (
                          <Link key={child.path} to={child.path!} className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">
                            {child.label}
                          </Link>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link key={link.path} to={link.path!}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${location.pathname === link.path ? "text-gold bg-primary-foreground/10" : "text-primary-foreground hover:text-gold"}`}>
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative hidden sm:block" onMouseEnter={() => setLangOpen(true)} onMouseLeave={() => setLangOpen(false)}>
            <button className="flex items-center gap-1 p-2 text-primary-foreground hover:text-gold transition-colors" title="Language">
              <Globe className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-medium">{currentLang.flag}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full right-0 mt-1 w-44 bg-card rounded-lg shadow-elevated border border-border py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                        i18n.language === lang.code ? "text-primary bg-primary/10 font-medium" : "text-foreground hover:bg-muted hover:text-primary"
                      }`}
                    >
                      <span>{lang.flag}</span> {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button asChild variant="outline" className="inline-flex h-9 px-3 text-[14px] md:h-10 md:px-4 md:text-sm bg-transparent border-2 border-teal-light text-primary-foreground hover:bg-teal-light/20 hover:text-primary-foreground ml-1 md:ml-2">
            <Link to="/mental-health">Get Help</Link>
          </Button>
          <Button asChild className="inline-flex h-9 px-3 text-[17px] md:h-11 md:px-5 md:text-[19px] font-bold bg-donate text-donate-foreground hover:bg-donate/90">
            <Link to={DONATE_URL}>{t("nav.donateNow")}</Link>
          </Button>


          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 text-primary-foreground" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col py-6 px-4 gap-1 h-full overflow-y-auto">
                <div className="mb-4">
                  <img alt="World Changers" className="h-20 w-auto mix-blend-multiply" src="/lovable-uploads/23ca8ce6-94a0-490f-b830-aa186f641c8c.png" />
                </div>

                {/* Mobile Language Selector */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => i18n.changeLanguage(lang.code)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                        i18n.language === lang.code ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {lang.flag} {lang.label}
                    </button>
                  ))}
                </div>

                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.label}>
                      <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">{link.label}</p>
                      {link.children.map((child) =>
                        child.href ? (
                          <a key={child.label} href={child.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}
                            className="block px-6 py-2.5 text-sm rounded-lg text-foreground hover:text-primary hover:bg-muted transition-colors">
                            {child.label}
                          </a>
                        ) : (
                          <Link key={child.path} to={child.path!} onClick={() => setMobileOpen(false)}
                            className={`block px-6 py-2.5 text-sm rounded-lg transition-colors ${location.pathname === child.path ? "text-primary bg-primary/10 font-medium" : "text-foreground hover:text-primary hover:bg-muted"}`}>
                            {child.label}
                          </Link>
                        )
                      )}
                    </div>
                  ) : (
                    <Link key={link.path} to={link.path!} onClick={() => setMobileOpen(false)}
                      className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${location.pathname === link.path ? "text-primary bg-primary/10" : "text-foreground hover:text-primary hover:bg-muted"}`}>
                      {link.label}
                    </Link>
                  )
                )}
                <Button asChild variant="outline" className="mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Link to="/mental-health" onClick={() => setMobileOpen(false)}>Get Help</Link>
                </Button>
                <Button asChild className="mt-2 text-[19px] font-bold bg-donate text-donate-foreground hover:bg-donate/90">
                  <Link to={DONATE_URL} onClick={() => setMobileOpen(false)}>{t("nav.donateNow")}</Link>
                </Button>

              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
