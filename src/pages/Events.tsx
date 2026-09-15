import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Calendar, MapPin, Bell, Mail, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { useTranslation } from "react-i18next";
import eventsHero from "@/assets/events-hero.jpg";

type EventItem = {
  title: string;
  monthLabel: string;
  year: string;
  dateNote: string;
  location: string;
  category: string;
  registerUrl?: string;
};

const events: EventItem[] = [
  { title: "Mental Health Awareness Golf Day", monthLabel: "NOV", year: "2026", dateNote: "Friday, 20 November 2026", location: "Eye of Africa Golf Estate", category: "Fundraising", registerUrl: "https://form.jotform.com/World_Changers_Org/golf-tournament" },
  { title: "Prestige Gala Dinner (Inspired by Met Gala)", monthLabel: "DEC", year: "2026", dateNote: "Saturday, 12 December 2026", location: "Johannesburg", category: "Fundraising" },
  { title: "Thrive Fest – Wellness Festival", monthLabel: "FEB", year: "2027", dateNote: "February 2027 – date to be confirmed", location: "Cape Town", category: "Wellness" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const Events = () => {
  const { t } = useTranslation();

  return (
    <div>
      <SEO title="Events & Workshops — World Changers MHCO" description="Upcoming mental health awareness, wellness and fundraising events. Tickets coming soon." path="/events" />
      <PageHero title={t("events.heroTitle")} subtitle={t("events.heroSubtitle")} bgImage={eventsHero} />

      {/* Events List */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label={t("events.eventsLabel")} title={t("events.eventsTitle")} description="Save the date for our upcoming events. Ticket details will be shared soon." />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <motion.div key={event.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card rounded-xl shadow-soft border border-border overflow-hidden flex flex-col group hover:shadow-card transition-shadow">
                <div className="w-full bg-primary flex items-center justify-center text-primary-foreground p-5 gap-4">
                  <div className="text-center">
                    <span className="block text-xs uppercase font-semibold opacity-80">{event.monthLabel}</span>
                    <span className="block font-heading text-3xl font-bold">{event.year}</span>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                    {event.registerUrl ? <><Ticket className="w-3 h-3" /> Registration Open</> : <><Bell className="w-3 h-3" /> Coming Soon</>}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-medium text-accent">{event.category}</span>
                  <h3 className="font-heading text-lg font-semibold text-foreground mt-1">{event.title}</h3>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {event.dateNote}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                  </div>
                  {event.registerUrl ? (
                    <>
                      <p className="text-xs text-muted-foreground mt-4 italic">
                        Individual – R3 000 · Four-Ball – R10 000. Includes 18 holes + cart access, lunch &amp; drinks, contests and prize-giving dinner.
                      </p>
                      <Button asChild size="sm" className="mt-4 bg-hero-gradient text-primary-foreground hover:opacity-90">
                        <a href={event.registerUrl} target="_blank" rel="noopener noreferrer">Register &amp; Buy Tickets</a>
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground mt-4 italic">
                        Ticket sales are not yet open. Visitors will be notified once tickets become available.
                      </p>
                      <Button size="sm" disabled className="mt-4 bg-muted text-muted-foreground cursor-not-allowed">
                        Tickets Coming Soon
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <Mail className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Be the first to know</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">Get in touch and we'll notify you as soon as ticket sales open for our upcoming events.</p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <a href="/contact">Notify Me</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Events;
