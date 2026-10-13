import { useSiteCopy } from "@/i18n/useSiteCopy";
import { useState } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import OutreachVideos from "@/components/OutreachVideos";
import aboutBg from "@/assets/about-bg.jpg";
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
  { title: "Mental Health Seminars in Tertiary or Universities", cats: ["Education", "Mental Health"], desc: "Delivering comprehensive mental health awareness workshops and peer support programs tailored for university students and educators.", image: portfolioEdu1 },
  { title: "Campus Wellness & Stress Management", cats: ["Education", "Wellness"], desc: "Specialized training programs empowering tertiary students and faculty to manage academic pressure, prevent burnout, and support their peers.", image: portfolioEdu2 },
  { title: "Student Mental Health Literacy", cats: ["Education", "Youth"], desc: "Interactive educational sessions hosted on university campuses, equipping young adults with vital mental health knowledge and coping strategies.", image: portfolioEdu3 },
  { title: "Community Food Drive Initiative", cats: ["Community", "Food Security"], desc: "Distributing food parcels to over 5,000 families across underserved communities in Gauteng and KwaZulu-Natal.", image: portfolioCom1 },
  { title: "Winter Relief Campaign", cats: ["Community", "Charity"], desc: "Annual campaign providing warm blankets, clothing, and essentials to homeless individuals and vulnerable families.", image: portfolioCom2 },
  { title: "Community Outreach", cats: ["Community", "Humanitarian"], desc: "Deploying volunteers to rural communities with food parcels, hygiene kits, and children's educational materials.", image: portfolioCom3 },
  { title: "Mental Health Awareness Golf Day", cats: ["Wellness", "Fundraising"], desc: "Using the power of sport to break the stigma around men's mental health. Our annual golf day creates a safe space for men to open up, be vulnerable, and have honest conversations about their emotional wellbeing.", image: portfolioWell1 },
  { title: "Mindfulness & Wellbeing Programs", cats: ["Wellness", "Self-Care"], desc: "Partner with us to host a Mental Health Golf Day for your organisation. A unique team-building experience that promotes open dialogue, mindfulness, and emotional wellness.", image: portfolioWell2 },
  { title: "Annual Awards & Recognition Gala", cats: ["Wellness", "Community"], desc: "Celebrating outstanding volunteers, donors, and community heroes at our annual recognition ceremony.", image: portfolioWell3 },
];

const filters = ["All", "Education", "Community", "Wellness"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const Portfolio = () => {
  const tx = useSiteCopy();
  const [activeFilter, setActiveFilter] = useState("All");
  const filtered = activeFilter === "All" ? portfolioProjects : portfolioProjects.filter((p) => p.cats.some((c) => c === activeFilter));

  return (
    <div>

      <SEO title={tx("Project Portfolio — World Changers MHCO")} description={tx("Browse our portfolio of mental health, education, community and wellness projects delivered across Southern Africa.")} path="/portfolio" />
      <PageHero title={tx("Our Portfolio")} subtitle={tx("Successful projects and case studies from our global mission")} bgImage={aboutBg} />

      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label={tx("Case Studies")} title={tx("Successful Projects")} description={tx("See the impact of our programs across the globe.")} />

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === f ? "bg-primary text-primary-foreground" : "border border-border hover:bg-primary hover:text-primary-foreground"}`}>
                {tx(f)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((project, i) => (
              <motion.div key={project.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card rounded-xl overflow-hidden shadow-soft border border-border group">
                <div className="aspect-video overflow-hidden">
                  <img src={project.image} alt={tx(project.title)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3 sm:p-5">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {project.cats.map((c) => (
                      <span key={c} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tx(c)}</span>
                    ))}
                  </div>
                  <h3 className="font-heading text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2 leading-tight">{tx(project.title)}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">{tx(project.desc)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild className="bg-hero-gradient text-primary-foreground hover:opacity-90">
              <Link to="/contact">{tx("Start A Project")} <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>
      <OutreachVideos />
    </div>
  );
};

export default Portfolio;
