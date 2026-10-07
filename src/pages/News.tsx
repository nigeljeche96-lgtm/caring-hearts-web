import { useState } from "react";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ArrowRight, Clock, Tag, X } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import heroBg from "@/assets/hero-bg.jpg";
import aboutBg from "@/assets/about-bg.jpg";
import philanthropyBg from "@/assets/philanthropy-bg.jpg";
import mentalHealthBg from "@/assets/mental-health-bg.jpg";
import campaignBg from "@/assets/campaign-bg.jpg";
import volunteerHero from "@/assets/volunteer-hero.jpg";
import portfolioCom1 from "@/assets/portfolio-community-1.jpg";
import portfolioCom2 from "@/assets/portfolio-community-2.jpg";
import portfolioCom3 from "@/assets/portfolio-community-3.jpg";
import portfolioEdu1 from "@/assets/portfolio-edu-1.jpg";
import portfolioWell1 from "@/assets/portfolio-wellness-1.jpg";
import portfolioWell2 from "@/assets/portfolio-wellness-2.jpg";

const articles = [
  {
    title: "South Africa Unites to Break Mental Health Stigma",
    date: "10 Oct 2025", category: "Mental Health", image: mentalHealthBg,
    excerpt: "SADAG's nationwide 'Together for Mental Health' campaign marks World Mental Health Day, revealing 1 in 3 South Africans will experience mental illness — yet 9 out of 10 go untreated.",
    readTime: "5 min",
    fullContent: "South Africa faces a growing mental health crisis, with the South African Depression and Anxiety Group (SADAG) reporting that approximately 1 in 3 South Africans will experience a mental health condition in their lifetime. Yet, shockingly, 9 out of 10 people who need treatment do not receive it due to stigma, lack of resources, and limited access to care.\n\nThe 'Together for Mental Health' campaign launched on World Mental Health Day aims to break down these barriers through community engagement, educational workshops, and grassroots advocacy. The campaign has already reached over 500,000 people through social media, community events, and partnerships with schools and workplaces.\n\nKey initiatives include free mental health screenings at community centres, training for educators to identify early signs of distress in learners, and the establishment of peer support groups in underserved communities. The campaign also advocates for increased government funding for mental health services and the integration of mental health care into primary health care facilities.\n\nWorld Changers Mental Health Care Org is proud to be a partner in this initiative, contributing trained counsellors, resources, and community outreach programs to support the national effort.",
  },
  {
    title: "Soweto Marches Together for Mental Health Awareness",
    date: "04 Nov 2025", category: "Community", image: portfolioCom1,
    excerpt: "SADAG closed Mental Health Awareness Month with a powerful march at Chris Hani Baragwanath Hospital, calling on the community to stand together for change.",
    readTime: "4 min",
    fullContent: "In a powerful show of solidarity, hundreds of community members, healthcare workers, and mental health advocates gathered at Chris Hani Baragwanath Hospital in Soweto for a march marking the close of Mental Health Awareness Month.\n\nThe march, organised by SADAG in partnership with local organisations including World Changers MHC Org, featured speakers who shared personal stories of recovery, healthcare professionals who highlighted the urgent need for accessible mental health services, and community leaders who pledged their commitment to destigmatising mental illness.\n\nParticipants carried banners with messages of hope and solidarity, chanting slogans that echoed through the streets of Soweto. The event also included free mental health screenings, information booths, and resource distribution for community members seeking support.\n\nThe march highlighted the disproportionate impact of mental health conditions on marginalised communities, where access to care is often limited by poverty, distance from health facilities, and cultural stigma. Organisers called for the government to allocate more resources to community-based mental health services.",
  },
  {
    title: "Halfway House Clinic Champions Mental Health with Community Event",
    date: "26 Oct 2025", category: "Outreach", image: portfolioCom2,
    excerpt: "Over 200 community members converged for a vibrant Mental Health Awareness Day themed 'Mental Health Matters', hosted by the Johannesburg Metro District.",
    readTime: "3 min",
    fullContent: "The Halfway House Clinic, in partnership with the Johannesburg Metro District Health Services, hosted a vibrant Mental Health Awareness Day that brought together over 200 community members, healthcare providers, and local organisations.\n\nThe event featured interactive workshops on stress management, depression awareness, and substance abuse prevention. Attendees had access to free mental health screenings, one-on-one consultations with counsellors, and educational materials in multiple languages.\n\nA highlight of the event was the 'Mental Health Matters' panel discussion, where community members shared their experiences with mental health challenges and recovery, breaking down the stigma that often prevents people from seeking help.\n\nLocal schools, churches, and community organisations participated in the event, demonstrating the growing recognition that mental health is a community-wide concern that requires collective action and support.",
  },
  {
    title: "How Community Food Drives Are Transforming Lives",
    date: "15 Sep 2025", category: "Humanitarian", image: portfolioCom3,
    excerpt: "Our food distribution program has reached over 5,000 families across Gauteng and KwaZulu-Natal, providing nutritious meals and essential supplies.",
    readTime: "4 min",
    fullContent: "World Changers MHC Org's community food drive initiative has made a significant impact on food security in some of South Africa's most underserved communities. Since its inception, the program has reached over 5,000 families across Gauteng and KwaZulu-Natal provinces.\n\nThe program goes beyond simple food distribution — it includes nutrition education, community garden projects, and partnerships with local farmers to ensure sustainable food access. Each food parcel is carefully assembled to include nutritious staples, fresh vegetables when available, and hygiene products.\n\nVolunteers from across the country have contributed thousands of hours to sorting, packing, and distributing food parcels, often travelling to remote rural areas where food insecurity is most severe. The program also provides psychosocial support, recognising the strong link between food insecurity and mental health challenges.\n\nRecent partnerships with corporate sponsors have allowed the program to expand its reach, with plans to establish permanent community food banks in five additional townships by the end of the year.",
  },
  {
    title: "Mental Health Education in Schools: Breaking the Cycle",
    date: "22 Aug 2025", category: "Education", image: portfolioEdu1,
    excerpt: "New peer counselling programs in schools are empowering learners to recognise signs of distress and seek help early, reducing dropout rates by 15%.",
    readTime: "6 min",
    fullContent: "A groundbreaking peer counselling program implemented in schools across South Africa is showing remarkable results in improving mental health outcomes for learners. The program, developed in partnership with educational psychologists and school administrators, trains selected students to provide basic emotional support and referral services to their peers.\n\nEarly data shows a 15% reduction in dropout rates at participating schools, along with significant improvements in academic performance and school attendance. Students who have accessed peer counselling services report feeling more supported, less isolated, and better equipped to manage stress and emotional challenges.\n\nThe program includes comprehensive training for peer counsellors, supervision by qualified mental health professionals, and regular evaluation to ensure quality and effectiveness. Schools that have implemented the program also report a more positive school climate, with reduced bullying and improved relationships between students and teachers.\n\nWorld Changers MHC Org has been instrumental in providing training materials, professional supervision, and ongoing support to schools participating in the program. Plans are underway to expand the initiative to 100 additional schools across the country.",
  },
  {
    title: "Golf Day Raises R500,000 for Youth Mental Health Programs",
    date: "18 Jul 2025", category: "Fundraising", image: portfolioWell1,
    excerpt: "The annual Mental Health Awareness Golf Day brought together corporate sponsors and community leaders, raising funds for youth therapy and counselling services.",
    readTime: "3 min",
    fullContent: "The annual Mental Health Awareness Golf Day proved to be a tremendous success, raising over R500,000 for youth mental health therapy and counselling services. The event, held at a prestigious golf course in Johannesburg, brought together corporate leaders, community champions, and mental health advocates for a day of sport and philanthropy.\n\nFunds raised will directly support the expansion of youth counselling services, including the establishment of two new youth-friendly clinics in underserved areas, training for school counsellors, and the development of digital mental health resources for young people.\n\nThe event featured a silent auction, networking opportunities, and presentations from young people who have benefited from mental health services funded by previous Golf Day events. Their stories of recovery and resilience inspired attendees and reinforced the importance of investing in youth mental health.\n\nCorporate sponsors included leading companies in banking, telecommunications, and mining, demonstrating the growing corporate commitment to mental health as a social responsibility priority.",
  },
  {
    title: "The Rise of Workplace Wellness Programs in SA",
    date: "05 Jul 2025", category: "Wellness", image: aboutBg,
    excerpt: "Corporate South Africa is investing in employee wellbeing with on-site counsellors, mental health days, and stress management workshops showing 30% improvement in productivity.",
    readTime: "5 min",
    fullContent: "A growing number of South African companies are recognising the critical link between employee mental health and organisational performance. Recent data shows that companies with comprehensive workplace wellness programs are seeing up to 30% improvements in productivity, alongside significant reductions in absenteeism and staff turnover.\n\nThese programs typically include on-site counselling services, mental health days, stress management workshops, and Employee Assistance Programs (EAPs) that provide confidential support for employees facing personal or work-related challenges.\n\nWorld Changers MHC Org has been at the forefront of this movement, providing workplace wellness consulting, training, and direct counselling services to a growing number of corporate clients. Our workplace programs are designed to be culturally sensitive and tailored to the specific needs of each organisation.\n\nKey findings from our workplace programs include: reduced workplace conflict, improved team dynamics, better manager-employee relationships, and increased employee engagement and job satisfaction. Companies that invest in mental health report a return of R4 for every R1 spent on workplace wellness initiatives.",
  },
  {
    title: "Winter Blanket Drive Reaches 3,000 Homeless Individuals",
    date: "20 Jun 2025", category: "Charity", image: philanthropyBg,
    excerpt: "Volunteers braved the cold to distribute blankets, warm clothing, and hot meals to homeless communities across Johannesburg, Pretoria, and Cape Town.",
    readTime: "4 min",
    fullContent: "As winter temperatures plunged across South Africa, World Changers MHC Org's annual Winter Blanket Drive mobilised hundreds of volunteers to provide warmth and comfort to homeless communities in Johannesburg, Pretoria, and Cape Town.\n\nThe drive, now in its fifth year, distributed over 3,000 blankets, along with warm clothing, hot meals, and hygiene packs. Volunteers also provided information about shelter services, healthcare access, and mental health support available to homeless individuals.\n\nThis year's drive placed special emphasis on the mental health needs of homeless populations, with trained counsellors accompanying distribution teams to provide on-the-spot emotional support and referrals for ongoing care. Many homeless individuals face significant mental health challenges, including depression, trauma, and substance use disorders, yet rarely have access to appropriate services.\n\nThe drive was supported by donations from individuals, churches, schools, and corporate sponsors, demonstrating the power of community solidarity in addressing homelessness and its associated challenges.",
  },
  {
    title: "Mindfulness and Traditional Healing: A South African Approach",
    date: "12 Jun 2025", category: "Mindfulness", image: portfolioWell2,
    excerpt: "Integrating indigenous healing practices with evidence-based mindfulness therapy is showing remarkable results in trauma recovery among rural communities.",
    readTime: "7 min",
    fullContent: "A pioneering program that integrates traditional African healing practices with evidence-based mindfulness therapy is showing remarkable results in trauma recovery among rural South African communities.\n\nThe program, developed by World Changers MHC Org in consultation with traditional healers, psychologists, and community leaders, recognises the important role that cultural beliefs and practices play in mental health and healing.\n\nKey elements of the program include guided meditation sessions that incorporate African rhythms and nature sounds, traditional storytelling as a therapeutic tool, community healing circles that blend indigenous practices with modern group therapy techniques, and the use of traditional herbal remedies alongside evidence-based psychological interventions.\n\nEarly results are encouraging, with participants reporting significant reductions in symptoms of trauma, depression, and anxiety. The program has been particularly effective in communities where Western-style therapy has historically been met with suspicion or resistance.\n\nResearchers are now conducting formal studies to evaluate the program's effectiveness, with the goal of developing a replicable model that can be implemented in rural communities across sub-Saharan Africa.",
  },
  {
    title: "New Crisis Hotline Saves Over 1,200 Lives in First Year",
    date: "01 May 2025", category: "Crisis Support", image: campaignBg,
    excerpt: "The 24/7 mental health crisis line launched by World Changers has handled over 45,000 calls, with trained counsellors providing immediate support and referrals.",
    readTime: "5 min",
    fullContent: "World Changers MHC Org's 24/7 mental health crisis hotline has been a lifeline for thousands of South Africans in its first year of operation. The hotline has handled over 45,000 calls, with trained counsellors providing immediate emotional support, crisis intervention, and referrals for ongoing care.\n\nThe hotline operates in all 11 official South African languages, ensuring accessibility for communities across the country. Counsellors are trained in crisis intervention, suicide prevention, and trauma support, and have access to a comprehensive referral network of mental health professionals, hospitals, and social services.\n\nIn its first year, the hotline has been credited with saving over 1,200 lives through immediate intervention during suicidal crises. Follow-up data shows that 78% of callers who were referred to ongoing services successfully accessed those services within two weeks of their initial call.\n\nThe hotline has also revealed important trends in mental health needs across the country, including the high prevalence of gender-based violence-related trauma, youth mental health crises, and the impact of economic hardship on mental wellbeing.",
  },
  {
    title: "Youth Art Therapy Program Expands to 5 New Provinces",
    date: "15 Apr 2025", category: "Youth", image: volunteerHero,
    excerpt: "Creative expression through art therapy is helping at-risk youth process trauma and build resilience, with the program now serving over 2,000 young people.",
    readTime: "4 min",
    fullContent: "World Changers MHC Org's Youth Art Therapy Program has expanded to five new provinces, bringing the total to seven provinces served across South Africa. The program, which uses creative expression as a therapeutic tool, now serves over 2,000 young people aged 10-24.\n\nThe program offers a variety of creative modalities, including visual arts, music therapy, drama, dance, and creative writing. Trained art therapists work with young people in schools, community centres, and residential care facilities to help them process trauma, express emotions, and build resilience.\n\nParticipants in the program have shown significant improvements in emotional regulation, self-esteem, and social skills. Many have also shown improvements in academic performance and reduced involvement in risky behaviours.\n\nThe expansion was made possible through partnerships with provincial departments of education and social development, corporate sponsors, and international development organisations. Plans for 2026 include extending the program to the remaining two provinces and developing an online component for young people in remote areas.",
  },
  {
    title: "Disaster Relief: Rapid Response to KZN Flooding",
    date: "28 Mar 2025", category: "Disaster Relief", image: heroBg,
    excerpt: "Our humanitarian response team deployed within 24 hours, providing emergency shelter, food, and psychological support to over 800 affected families.",
    readTime: "6 min",
    fullContent: "When devastating floods struck KwaZulu-Natal, World Changers MHC Org's humanitarian response team was on the ground within 24 hours, providing emergency assistance to affected communities.\n\nThe response team, comprising social workers, counsellors, logistics coordinators, and volunteer emergency responders, provided a comprehensive range of services including emergency shelter, food parcels, clean water, clothing, and essential hygiene supplies to over 800 families.\n\nCritically, the response also included psychological first aid and ongoing mental health support for flood survivors, many of whom experienced significant trauma from the disaster. Counsellors worked in evacuation centres, providing individual and group support, and identifying individuals who needed referral for more intensive mental health services.\n\nThe response highlighted the importance of integrating mental health support into disaster relief operations — an approach that World Changers has championed and that is increasingly being adopted by humanitarian organisations globally.\n\nIn the weeks following the initial response, the organisation established semi-permanent support centres in the most affected communities, providing ongoing counselling, community rebuilding activities, and advocacy for the mental health needs of disaster survivors.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const News = () => {
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);

  return (
    <div>

      <SEO title="News & Articles — World Changers MHCO" description="Latest articles, announcements and stories from World Changers Mental Health Care Organisation." path="/news" />
      <PageHero title="News & Articles" subtitle="Mental health resources, humanitarian stories, and community outreach updates" bgImage={heroBg} />

      {/* Featured Article */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label="Featured" title="Latest Headlines" />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-8 mb-16 cursor-pointer" onClick={() => setSelectedArticle(articles[0])}>
            <div className="aspect-video rounded-2xl overflow-hidden">
              <img src={articles[0].image} alt={articles[0].title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">{articles[0].category}</span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">{articles[0].title}</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">{articles[0].excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {articles[0].date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {articles[0].readTime} read</span>
              </div>
              <span className="text-sm font-medium text-accent flex items-center gap-1 hover:gap-2 transition-all">
                Read Full Article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Articles */}
      <section className="section-padding bg-muted pt-0">
        <div className="container mx-auto">
          <SectionHeading label="Blog & News" title="All Articles" description="Stay informed about mental health, humanitarian efforts, and community outreach across South Africa." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(1).map((a, i) => (
              <motion.article key={a.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card rounded-xl overflow-hidden shadow-soft border border-border group cursor-pointer hover:shadow-card transition-shadow"
                onClick={() => setSelectedArticle(a)}>
                <div className="aspect-video overflow-hidden relative">
                  <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-lg">
                    {a.date}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1 text-primary font-medium"><Tag className="w-3 h-3" /> {a.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.readTime}</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-2">{a.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{a.excerpt}</p>
                  <span className="text-sm font-medium text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read more<span className="sr-only">: {a.title}</span> <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70" onClick={() => setSelectedArticle(null)} />
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="fixed inset-4 md:inset-10 lg:inset-20 z-50 bg-card rounded-2xl shadow-elevated overflow-y-auto">
              <button aria-label="Close article" onClick={() => setSelectedArticle(null)} className="sticky top-4 float-right mr-4 mt-4 z-10 bg-muted rounded-full p-2 hover:bg-muted/80">
                <X className="w-5 h-5 text-foreground" />
              </button>
              <div className="aspect-video w-full overflow-hidden">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:p-10 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold">{selectedArticle.category}</span>
                  <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {selectedArticle.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedArticle.readTime} read</span>
                </div>
                <h1 className="font-heading text-2xl md:text-4xl font-bold text-foreground mb-6">{selectedArticle.title}</h1>
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                  {selectedArticle.fullContent.split("\n\n").map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;
