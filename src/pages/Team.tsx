import { useState } from "react";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import aboutBg from "@/assets/about-bg.jpg";
import teamPhoto from "@/assets/team-photo.jpg";
import sibusisoNdlovu from "@/assets/sibusiso-ndlovu.png";
import seluMsweli from "@/assets/selu-msweli.jpg";
import nicolaVlantis from "@/assets/nicola-vlantis.png";
import nigelJeche from "@/assets/nigel-jeche.png";
import tebohoNthoana from "@/assets/teboho-nthoana.jpg";
import kojoHudson from "@/assets/kojo-hudson.jpg";
import lungeloNtobongwana from "@/assets/lungelo-ntobongwana.jpg";
import thulisileButhelezi from "@/assets/thulisile-buthelezi.jpg";
import thabangMokaka from "@/assets/thabang-mokaka.jpg";
import celiweRahlagane from "@/assets/celiwe-rahlagane.jpg";
import florenceMaleka from "@/assets/florence-maleka.jpg";
import vukaKhumalo from "@/assets/vuka-khumalo.png";
import boitumeloSedupane from "@/assets/boitumelo-sedupane.jpg";
import beaulahRose from "@/assets/beaulah-rose.jpg";
import patriciaMoloiwa from "@/assets/patricia-moloiwa.png";
import letlotloMoleko from "@/assets/letlotlo-moleko.jpg";
import kumariSukhdeo from "@/assets/kumari-sukhdeo.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

interface TeamMember {
  name: string;
  role: string;
  image: string | null;
  bio?: string;
  linkedin?: string;
  instagram?: string;
}

const boardMembers: TeamMember[] = [
  {
    name: "Nigel Jeche", role: "CEO & Founder", image: nigelJeche,
    bio: "Meet Nigel Jeche, a visionary leader and passionate advocate for mental health awareness. As the Founder of World Changers Mental Health Care Org, he has dedicated his life to breaking down stigmas and promoting holistic well-being. With a successful career as a Property Developer and Director of Elite Construction, Nigel brings a unique blend of business acumen and compassion to his work. A sought-after speaker, he inspires audiences with his insights on mental health, entrepreneurship, and personal growth.",
    linkedin: "https://www.linkedin.com/in/nigel-jeche-676b211a5",
    instagram: "https://www.instagram.com/nj_nigel",
  },
  {
    name: "Teboho Nthoana", role: "Chairperson", image: tebohoNthoana,
    bio: "Teboho Nthoana is a seasoned executive, investor, thought leader, policy advocate, and human rights champion currently serving as Board Chair of World Changers. With a strong background in business rescue, governance, and inclusive economic development, he has led transformative initiatives across Africa, Europe & USA. He is the CEO of Nono Capital and holds an MBA with advanced qualifications in law, finance, and business.",
    linkedin: "https://www.linkedin.com/in/teboho",
  },
  {
    name: "Kojo Hudson", role: "Vice Chairperson", image: kojoHudson,
    bio: "Kojo Hudson is an accomplished built environment professional dedicated to shaping resilient infrastructure and advancing sustainability. As Executive Director of Ohene Africa, he leads initiatives that integrate innovation, governance, and sustainable development. A Chartered Member of RICS and a registered Professional Construction Project Manager (PrCPM), he holds a BSc (Hons) in Quantity Surveying and is pursuing an MBA at Rhodes Business School.",
    linkedin: "https://www.linkedin.com/in/jojoh/",
    instagram: "https://www.instagram.com/Kojo_Hudson",
  },
  {
    name: "Lungelo Ntobongwana", role: "Board Member", image: lungeloNtobongwana,
    bio: "Lungelo has over 23 years of experience in senior leadership roles, including CEO, COO, and Managing Director across Chemicals, Automotive, Power Generation, Waste Management, Property Management and Quality Assurance industries. His motto is \"passion, purpose and impact reimagined\".",
    linkedin: "https://www.linkedin.com/in/lungelo-ntobongwana/",
  },
  {
    name: "Boitumelo Sedupane", role: "Board Member", image: boitumeloSedupane,
    bio: "Boitumelo Sedupane is a distinguished HR executive and board director, renowned for empowering people and fostering organisational well-being. With extensive experience at AngloGold Ashanti, Accenture, and BMW Group, she holds an Executive MBA from UCT and has completed executive programs at Wits Business School and the Global Network for Advanced Management.",
    linkedin: "https://www.linkedin.com/in/boitumelo-sedupane-emba-m-inst-d-b5b206217/",
  },
  {
    name: "Adv. Florence Maleka", role: "Board Member", image: florenceMaleka,
    bio: "Advocate Florence Maleka is an accomplished legal and governance professional with extensive experience in legal services, compliance, and investigations. She is the Director of Progressive Compliance Company, holds an LLB degree and a Management Advancement Programme (MAP) qualification, and is a member of the Centurion Society of Advocates.",
    linkedin: "https://www.linkedin.com/in/adv-florence-maleka-a903b677/",
  },
  {
    name: "Adv. Celiwe Rahlagane", role: "Board Member", image: celiweRahlagane,
    bio: "Adv. Celiwe Rahlagane is a seasoned governance and legal specialist with over 15 years of experience across public and private sectors. An Advocate of the High Court of South Africa, she holds an LLB from UNISA with postgraduate certificates in Corporate Governance and Financial Markets. A former Chairperson of the SAMRO Foundation Board.",
    linkedin: "https://www.linkedin.com/in/adv-celiwe-nkosi-rahlagane-29989727/",
  },
  {
    name: "Beaulah Rose", role: "Board Member", image: beaulahRose,
    bio: "Beaulah Rose is a seasoned Registered Counsellor committed to creating real change in the mental health space. A private practitioner and Case Manager with global reach in therapy and education, she has trained in multiple therapeutic modalities and built practices that promote excellence and long-term impact.",
    linkedin: "https://www.linkedin.com/in/beaulah-rose-62584996/",
  },
  {
    name: "Prof. Kumari Sukhdeo", role: "Board Member", image: kumariSukhdeo,
    bio: "Professor Kumari Sukhdeo is a Professor of Entrepreneurship, Management & Business Studies, and a distinguished International Business and Management Consultant. She holds an MBA from UKZN and is the first South African female to earn International Double Doctorates from Sheffield-Hallam University (UK) and Business School Amsterdam (Netherlands).",
    linkedin: "https://www.linkedin.com/in/drkumari-sukhdeo/",
  },
  {
    name: "Selu Msweli", role: "Board Member", image: seluMsweli,
    bio: "Selu Msweli is a respected business leader, education strategist, and board member driving leadership development, corporate education, and organisational transformation globally. As Head of Strategic Support at DaVinci Business School, he leads strategic growth and designs innovative leadership programmes for executives.",
    linkedin: "https://www.linkedin.com/in/selu-msweli-35906b94/",
    instagram: "https://www.instagram.com/selumsweli",
  },
  {
    name: "Sibusiso Ndlovu", role: "Board Member", image: sibusisoNdlovu,
  },
  {
    name: "Thabang Mokaka", role: "Board Member", image: thabangMokaka,
    bio: "Thabang Kutluisiso Mokaka is a distinguished Senior Management Service executive and academic. With a career spanning over 15 years across both public and private sectors — including executive roles in provincial government and leadership positions in academic institutions and digital innovation hubs — he brings comprehensive expertise in corporate governance, strategic innovation, and ICT governance.",
    linkedin: "https://www.linkedin.com/in/thabang-mokoka-mphilbs-pgdippm-b-techpm-ndpa-12454549/",
  },
];

const executiveLeadership: TeamMember[] = [
  {
    name: "Nicola M. Vlantis", role: "Stakeholder Manager", image: nicolaVlantis,
  },
  {
    name: "Thulisile P. Buthelezi", role: "Secretary", image: thulisileButhelezi,
    bio: "Thulisile serves as Secretary at World Changers Mental Health Care Organisation, supporting the mission to promote mental wellness and community transformation. She holds a National Diploma in Human Resources Management with extensive experience across private, public, and NGO sectors, and is the founder of Faith Hope Love Kingdom Minded Leaders.",
    linkedin: "https://www.linkedin.com/in/thulisile-patience-buthelezi-36a23bb8/",
  },
  {
    name: "Patricia Moloiwa", role: "Chief Marketing Officer", image: patriciaMoloiwa,
    bio: "With over ten years in broadcasting, advertising sales, and operations, Patricia is the founder of PBGC Consulting's Digital Division. She is currently pursuing a Bachelor of Commerce in Information Technology Management, blending technical expertise, business acumen, and entrepreneurial skill to drive measurable results and community impact.",
    linkedin: "https://www.linkedin.com/in/lerato-manaka-1071a327",
  },
  {
    name: "Letlotlo K. Moleko", role: "Digital Marketing Officer", image: letlotloMoleko,
    bio: "Letlotlo Kenneth Moleko is a visionary entrepreneur, author, and social impact leader. As Founder and CEO of CEO Lifestyle, Protege Brands, UpGR8 Group, and the nonprofit Lead Movement, he merges digital media, brand strategy, and social innovation to unlock opportunities for young people across South Africa. He holds a Master's degree in Business.",
    linkedin: "https://www.linkedin.com/in/kenneth-letlotlo-moleko-1ab0b345/",
  },
  {
    name: "Dr. Talifhani Khubana", role: "Chief Financial Officer", image: null,
  },
  {
    name: "Vuka Khumalo", role: "Internal Auditor", image: vukaKhumalo,
    bio: "A seasoned Accountant and Auditor with a BCom in Financial Management and BCompt in Accounting Science, Vuka brings over 18 years of experience across accounting, auditing, insurance, banking, non-profit, government, and mining. He is currently pursuing the ACCA UK postgraduate accounting qualification.",
    linkedin: "https://www.linkedin.com/in/vuka-kumalo-07741072/",
  },
];

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497"/>
        <stop offset="5%" stopColor="#fdf497"/>
        <stop offset="45%" stopColor="#fd5949"/>
        <stop offset="60%" stopColor="#d6249f"/>
        <stop offset="90%" stopColor="#285AEB"/>
      </radialGradient>
    </defs>
    <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TeamSection = ({ title: sectionTitle, members, onClickMember }: { title: string; members: TeamMember[]; onClickMember: (m: TeamMember) => void }) => (
  <div className="mb-16">
    <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">{sectionTitle}</h3>
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {members.map((m, i) => (
        <motion.div key={m.name + i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="bg-card rounded-2xl overflow-hidden shadow-card group text-center cursor-pointer hover:shadow-elevated transition-shadow"
          onClick={() => onClickMember(m)}>
          <div className="aspect-[3/4] overflow-hidden bg-muted flex items-center justify-center">
            {m.image ? (
              <img src={m.image} alt={m.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <svg className="w-20 h-20 text-muted-foreground/40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            )}
          </div>
          <div className="p-3 sm:p-5">
            <h4 className="font-heading text-sm sm:text-lg font-semibold text-foreground leading-tight">{m.name}</h4>
            <p className="text-xs sm:text-sm text-primary mt-1">{m.role}</p>
            {(m.linkedin || m.instagram) && (
              <div className="flex items-center justify-center gap-3 mt-3">
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:scale-110 transition-transform">
                    <LinkedInIcon />
                  </a>
                )}
                {m.instagram && (
                  <a href={m.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:scale-110 transition-transform">
                    <InstagramIcon />
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const Team = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div>
      <SEO title="Our Team & Leadership — World Changers MHCO" description="Meet the Board and Executive Leadership driving World Changers Mental Health Care Organisation across Southern Africa." path="/team" />
      <PageHero title="Our Team" subtitle="The dedicated people behind our mission" bgImage={aboutBg} />

      <section className="px-4 -mt-10 relative z-10">
        <div className="container mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-elevated">
            <img src={teamPhoto} alt="World Changers Team" className="w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label="Leadership" title="Meet Our Team" description="Passionate professionals committed to making a difference." />
          <TeamSection title="Board Members" members={boardMembers} onClickMember={setSelectedMember} />
          <TeamSection title="Executive Leadership" members={executiveLeadership} onClickMember={setSelectedMember} />
        </div>
      </section>

      <AnimatePresence>
        {selectedMember && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}>
            <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 text-white/80 hover:text-white z-10"><X className="w-8 h-8" /></button>
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {selectedMember.image && (
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="max-w-full max-h-[50vh] object-contain rounded-lg mx-auto"
                />
              )}
              <div className="text-center mt-4">
                <p className="text-white font-heading text-xl font-bold">{selectedMember.name}</p>
                <p className="text-white/90 text-sm">{selectedMember.role}</p>
                {(selectedMember.linkedin || selectedMember.instagram) && (
                  <div className="flex items-center justify-center gap-4 mt-3">
                    {selectedMember.linkedin && (
                      <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform flex items-center gap-1.5 text-sm text-white/90">
                        <LinkedInIcon /> <span>LinkedIn</span>
                      </a>
                    )}
                    {selectedMember.instagram && (
                      <a href={selectedMember.instagram} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform flex items-center gap-1.5 text-sm text-white/90">
                        <InstagramIcon /> <span>Instagram</span>
                      </a>
                    )}
                  </div>
                )}
                {selectedMember.bio && (
                  <p className="text-white/90 text-sm mt-4 leading-relaxed text-left px-4">{selectedMember.bio}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Team;
