import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Award, ArrowRight, Users, Globe, Brain, HandHeart, Shield, Megaphone } from "lucide-react";
import CountUp from "@/components/CountUp";
import VoiceAgent from "@/components/VoiceAgent";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { useTranslation } from "react-i18next";
import aboutBg from "@/assets/about-bg.jpg";
import teamPhoto from "@/assets/team-photo.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const About = () => {
  const { t } = useTranslation();

  const values = [
    { icon: Heart, title: t("about.compassion"), desc: t("about.compassionDesc") },
    { icon: Target, title: t("about.excellence"), desc: t("about.excellenceDesc") },
    { icon: Award, title: t("about.integrityVal"), desc: t("about.integrityValDesc") },
    { icon: Eye, title: t("about.inclusivityVal"), desc: t("about.inclusivityValDesc") },
  ];

  const impactStats = [
    { value: "10", label: t("stats.yearsOperating") },
    { value: "Southern Africa", label: t("stats.geographicReach") },
    { value: "2,000+", label: t("stats.totalVolunteers") },
    { value: "270+", label: t("stats.activeVolunteers") },
  ];

  const whatWeDo = [
    { icon: Brain, title: t("about.mentalHealthServices"), desc: t("about.mentalHealthServicesDesc") },
    { icon: HandHeart, title: t("about.humanitarianAid"), desc: t("about.humanitarianAidDesc") },
    { icon: Globe, title: t("about.communityOutreach"), desc: t("about.communityOutreachDesc") },
    { icon: Megaphone, title: t("about.humanRightsAdvocacy"), desc: t("about.humanRightsAdvocacyDesc") },
    { icon: Shield, title: t("about.substanceAbusePrevention"), desc: t("about.substanceAbusePreventionDesc") },
    { icon: Users, title: t("about.skillsDevelopment"), desc: t("about.skillsDevelopmentDesc") },
  ];

  return (
    <div>

      <SEO title="About Us — World Changers MHCO" description="Learn about World Changers Mental Health Care Organisation — our story, mission, values and the team transforming mental health across Southern Africa." path="/about" />
      <PageHero title={t("nav.about")} subtitle={t("about.whoWeAreTitle")} bgImage={aboutBg} />

      {/* Who We Are */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative">
              <img src={teamPhoto} alt="Our team in action" className="rounded-2xl shadow-elevated w-full object-cover aspect-[4/3]" />
              <div className="absolute -bottom-6 -right-6 bg-primary rounded-xl p-4 shadow-elevated hidden md:block">
                <p className="font-heading text-xl font-bold text-accent-foreground">{t("about.since2017")}</p>
                <p className="text-xs text-primary-foreground/80">{t("about.servingVulnerable")}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">{t("about.whoWeAreLabel")}</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-5">
                {t("about.whoWeAreTitle")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{t("about.whoWeAreDesc1")}</p>
              <p className="text-muted-foreground leading-relaxed mb-6">{t("about.whoWeAreDesc2")}</p>
              <div className="flex flex-wrap gap-4 items-center">
                <Button asChild className="bg-hero-gradient text-primary-foreground hover:opacity-90">
                  <Link to="/contact">{t("common.getInTouch")} <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
                <VoiceAgent variant="icon" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section-padding bg-muted">
        <div className="container mx-auto">
          <SectionHeading label={t("about.whatWeDoLabel")} title={t("about.whatWeDoTitle")} description={t("about.whatWeDoDesc")} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeDo.map((item, i) => (
              <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card rounded-xl p-6 shadow-soft border border-border">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-card border-l-4 border-primary">
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">{t("about.missionLabel")}</span>
              <h3 className="font-heading text-2xl font-bold text-foreground mt-3 mb-4">{t("about.missionTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("about.missionDesc")}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-card border-l-4 border-accent">
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">{t("about.visionLabel")}</span>
              <h3 className="font-heading text-2xl font-bold text-foreground mt-3 mb-4">{t("about.visionTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("about.visionDesc")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {impactStats.map((stat, i) => (
              <motion.div key={stat.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <CountUp value={stat.value} className="font-heading text-3xl md:text-5xl font-bold text-gold" />
                <p className="text-sm md:text-base text-primary-foreground/80 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label={t("about.valuesLabel")} title={t("about.valuesTitle")} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card rounded-xl p-6 text-center shadow-soft">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
