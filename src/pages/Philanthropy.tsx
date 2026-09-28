import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Heart, Users, HandHeart, ArrowRight, Shield, Globe, Building, Star, Play, Home, Utensils } from "lucide-react";
import VoiceAgent from "@/components/VoiceAgent";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { useTranslation } from "react-i18next";
import philanthropyBg from "@/assets/philanthropy-bg.jpg";
import philanthropyHeroNew from "@/assets/philanthropy-hero-new.jpg";
import portfolioEdu1 from "@/assets/portfolio-edu-1.jpg";
import portfolioEdu2 from "@/assets/portfolio-edu-2.jpg";
import portfolioEdu3 from "@/assets/portfolio-edu-3.jpg";
import portfolioCom1 from "@/assets/portfolio-community-1.jpg";
import portfolioCom2 from "@/assets/portfolio-community-2.jpg";
import portfolioCom3 from "@/assets/portfolio-community-3.jpg";
import portfolioWell1 from "@/assets/portfolio-wellness-1.jpg";
import portfolioWell2 from "@/assets/portfolio-wellness-2.jpg";
import portfolioWell3 from "@/assets/portfolio-wellness-3.jpg";

const portfolioProjects = [
  { title: "Mental Health Education in Schools", cats: ["Education", "Mental Health"], desc: "Delivering mental health awareness workshops and peer counselling programs to learners and educators across South Africa.", image: portfolioEdu1 },
  { title: "Workplace Wellness Seminars", cats: ["Education", "Wellness"], desc: "Corporate mental health training programs empowering employees to manage stress, recognise burnout, and support colleagues.", image: portfolioEdu2 },
  { title: "Youth Mental Health Literacy", cats: ["Education", "Youth"], desc: "Interactive education sessions in community halls and educational spaces equipping young people with mental health knowledge.", image: portfolioEdu3 },
  { title: "Community Food Drive Initiative", cats: ["Community", "Food Security"], desc: "Distributing food parcels to over 5,000 families across underserved communities in Gauteng and KwaZulu-Natal.", image: portfolioCom1 },
  { title: "Winter Relief Campaign", cats: ["Community", "Charity"], desc: "Annual campaign providing warm blankets, clothing, and essentials to homeless individuals and vulnerable families.", image: portfolioCom2 },
  { title: "Rural Community Outreach", cats: ["Community", "Humanitarian"], desc: "Deploying volunteers to rural communities with food parcels, hygiene kits, and children's educational materials.", image: portfolioCom3 },
  { title: "Mental Health Awareness Golf Day", cats: ["Wellness", "Fundraising"], desc: "Annual fundraising golf day raising over R500,000 for youth mental health therapy and counselling services.", image: portfolioWell1 },
  { title: "Mindfulness & Wellbeing Programs", cats: ["Wellness", "Self-Care"], desc: "Community-based mindfulness workshops, meditation sessions, and holistic wellbeing programs for all ages.", image: portfolioWell2 },
  { title: "Annual Awards & Recognition Gala", cats: ["Wellness", "Community"], desc: "Celebrating outstanding volunteers, donors, and community heroes at our annual recognition ceremony.", image: portfolioWell3 },
];

const youtubeVideos = [
  { id: "ZgfcN2DHrz0", title: "Humanitarian Outreach" },
  { id: "MkCq-scDGqM", title: "Community Impact" },
  { id: "XoaGz-YXnRA", title: "Charity in Action" },
];

const marqueeItems = ["Humanitarian Aid", "Charity", "Food Drives", "Disaster Relief", "Shelter", "Donations"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Philanthropy = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: Building, value: "10", label: t("stats.yearsOperating") },
    { icon: Globe, value: "Southern Africa", label: t("stats.geographicReach") },
    { icon: HandHeart, value: "2,000+", label: t("stats.totalVolunteers") },
  ];

  const impactStats = [
    { value: "2,500+", label: t("philanthropy.familiesSupported") },
    { value: "270+", label: t("stats.activeVolunteers") },
    { value: "15,000+", label: t("philanthropy.mealsDistributed") },
    { value: "8,700+", label: t("philanthropy.worldwideDonors") },
  ];

  const features = [
    { icon: Shield, title: t("philanthropy.becomeVolunteer"), desc: t("philanthropy.becomeVolunteerDesc") },
    { icon: Home, title: t("philanthropy.shelterTitle"), desc: t("philanthropy.shelterDesc") },
    { icon: Utensils, title: t("philanthropy.foodTitle"), desc: t("philanthropy.foodDesc") },
    { icon: Heart, title: t("philanthropy.disasterTitle"), desc: t("philanthropy.disasterDesc") },
  ];

  return (
    <div>

      <SEO title="Philanthropy & Community Outreach — World Changers" description="Explore our humanitarian portfolio: education, community wellness and outreach projects making real impact across Southern Africa." path="/philanthropy" />
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img src={philanthropyBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-overlay-gradient" />
        <div className="absolute inset-0 bg-primary/30" />
        <div className="relative container mx-auto px-4 pt-20 pb-72 sm:pb-48 md:pb-32">
          <div className="max-w-3xl">
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" /> {t("philanthropy.heroTagline")}
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              {t("philanthropy.heroTitle")}
            </motion.h1>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 font-bold shadow-lg">
                <Link to="/become-volunteer">{t("common.becomeVolunteer")} <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8 font-bold shadow-lg">
                <Link to="/contact">{t("common.donateNow")} <Heart className="w-4 h-4 ml-2" /></Link>
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-0">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-accent/90 p-3 sm:p-6 text-center first:rounded-tl-xl last:rounded-tr-xl">
                  <div className="w-12 h-12 rounded-full bg-accent-foreground/20 flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <p className="font-heading text-2xl md:text-3xl font-bold text-accent-foreground">{stat.value}</p>
                  <p className="text-xs md:text-sm text-accent-foreground/80 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Get Inspired */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative">
              <img src={philanthropyHeroNew} alt="Community food distribution outreach" className="rounded-2xl shadow-elevated w-full object-cover aspect-[4/3]" />
              <div className="absolute -bottom-6 -right-6 bg-accent rounded-xl p-4 shadow-elevated hidden md:block">
                <p className="font-heading text-xl font-bold text-accent-foreground">90%</p>
                <p className="text-xs text-accent-foreground/80">{t("philanthropy.aidDelivered")}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">{t("philanthropy.getInspiredLabel")}</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-5">{t("philanthropy.getInspiredTitle")}</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">{t("philanthropy.joinHelpingTitle")}</h4>
                    <p className="text-sm text-muted-foreground">{t("philanthropy.joinHelpingDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Heart className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">{t("philanthropy.makeDonationsTitle")}</h4>
                    <p className="text-sm text-muted-foreground">{t("philanthropy.makeDonationsDesc")}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Button asChild className="bg-hero-gradient text-primary-foreground hover:opacity-90">
                  <Link to="/about">{t("common.exploreMore")} <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
                <VoiceAgent variant="icon" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative container mx-auto px-4">
          <p className="text-sm md:text-base text-primary-foreground/70 text-center mb-8">{t("stats.impactNote")}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {impactStats.map((stat, i) => (
              <motion.div key={stat.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <p className="font-heading text-3xl md:text-5xl font-bold text-accent">{stat.value}</p>
                <p className="text-sm md:text-base text-primary-foreground/80 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card rounded-xl p-6 shadow-soft hover:shadow-card transition-shadow group text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-hero-gradient transition-all">
                  <f.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                {f.title === t("philanthropy.becomeVolunteer") && (
                  <Button asChild size="sm" className="mt-4 bg-hero-gradient text-primary-foreground hover:opacity-90">
                    <Link to="/become-volunteer">Join Now <ArrowRight className="w-3 h-3 ml-1" /></Link>
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-6 bg-accent overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mx-8 font-heading text-xl font-bold text-accent-foreground flex items-center gap-3">
              <Star className="w-4 h-4" /> {item}
            </span>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section className="section-padding bg-muted">
        <div className="container mx-auto">
          <SectionHeading label={t("philanthropy.portfolioLabel")} title={t("philanthropy.portfolioTitle")} description={t("philanthropy.portfolioDesc")} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {portfolioProjects.map((project, i) => (
              <motion.div key={project.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card rounded-xl overflow-hidden shadow-soft border border-border group">
                <div className="aspect-video overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3 sm:p-5">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {project.cats.map((c) => (
                      <span key={c} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                   <h3 className="font-heading text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2 leading-tight">{project.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">{project.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Videos */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label={t("philanthropy.videosLabel")} title={t("philanthropy.videosTitle")} description={t("philanthropy.videosDesc")} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {youtubeVideos.map((video, i) => (
              <motion.div key={video.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="rounded-xl overflow-hidden shadow-soft border border-border bg-card">
                <div className="aspect-video">
                  <iframe src={`https://www.youtube.com/embed/${video.id}`} title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2"><Play className="w-3.5 h-3.5 text-primary" /> {video.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Heart className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-5">{t("philanthropy.ctaTitle")}</h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">{t("philanthropy.ctaDesc")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 font-bold shadow-lg">
                <Link to="/contact">{t("common.donateNow")} <Heart className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8 font-bold shadow-lg">
                <Link to="/become-volunteer">{t("common.becomeVolunteer")} <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Philanthropy;
