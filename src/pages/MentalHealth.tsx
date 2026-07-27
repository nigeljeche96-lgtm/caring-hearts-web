import { useState } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Brain, Shield, Users, Sparkles, HeartPulse, Leaf, Activity, Stethoscope, BookOpen, HandHeart, Presentation, CalendarDays, Clock, X, Mic, Play, Phone, Video, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import VoiceAgent from "@/components/VoiceAgent";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import mentalHealthBg from "@/assets/mental-health-bg.jpg";
import shelleyRoets from "@/assets/shelley-roets.png";
import bongiweMthembu from "@/assets/bongiwe-mthembu.png";
import nickyVlantis from "@/assets/nicky-vlantis.png";
import masegoMitchell from "@/assets/masego-mitchell.png";
import takalaniMulaudzi from "@/assets/takalani-mulaudzi.png";
import patienceThabede from "@/assets/patience-thabede.png";
import mimmyLedwabaAsset from "@/assets/mimmy-ledwaba.png.asset.json";
const mimmyLedwaba = mimmyLedwabaAsset.url;

const programs = [
  { icon: Brain, title: "Cognitive Behavioral Therapy", desc: "Evidence-based approach to treating anxiety, depression, and other mental health conditions through structured therapeutic sessions." },
  { icon: Shield, title: "Trauma & PTSD Recovery", desc: "Specialized programs using EMDR and trauma-focused therapy to help survivors reclaim their lives." },
  { icon: Users, title: "Family & Couples Counseling", desc: "Strengthening relationships through guided communication, conflict resolution, and emotional support." },
  { icon: Sparkles, title: "Mindfulness & Stress Relief", desc: "Meditation, breathing exercises, and mindfulness practices for daily mental wellness." },
  { icon: HeartPulse, title: "Substance Abuse Support", desc: "Holistic recovery programs addressing the root causes of addiction with compassion." },
  { icon: Leaf, title: "Youth & Adolescent Care", desc: "Age-appropriate interventions for children and teens navigating emotional and behavioral challenges." },
  { icon: Activity, title: "Crisis Intervention", desc: "24/7 emergency mental health support for individuals in acute distress or danger." },
  { icon: Stethoscope, title: "Psychiatric Evaluation", desc: "Comprehensive diagnostic assessments to identify conditions and create personalized treatment plans." },
  { icon: BookOpen, title: "Psychoeducation Workshops", desc: "Community-based educational programs to build awareness and reduce mental health stigma." },
  { icon: HandHeart, title: "Grief & Loss Counseling", desc: "Compassionate support helping individuals navigate bereavement and life transitions." },
  { icon: Presentation, title: "Conferencing", desc: "Professional conferencing for workspaces and educational institutions to foster collaboration and promote organizational wellbeing." },
  { icon: BookOpen, title: "Mental Health Seminars", desc: "Structured seminars for workspaces and educational institutions to promote mental wellbeing, resilience, and awareness in organizational settings." },
];

const APPOINTMENT_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const APPOINTMENT_TIMES = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

const professionals = [
  {
    name: "Nicky Vlantis", role: "Licensed Counsellor", specialty: "Anxiety & Depression", image: shelleyRoets,
    email: "nicky@worldchangersmh.org",
    bio: "Nicky Vlantis is a qualified Counsellor with over six years of experience supporting learners, young professionals, and individuals facing personal and emotional challenges. She holds a BSc in Nutrition from the University of Natal and has completed counselling and life coaching training through Lifeline and Trifocus Academy, specialising in anxiety, depression, bereavement, addiction, eating disorders, and personal development using person-centred and cognitive behavioural approaches.",
    days: APPOINTMENT_DAYS, times: APPOINTMENT_TIMES,
  },
  {
    name: "Takalani Mulaudzi", role: "Licensed Counsellor", specialty: "Anxiety & Depression", image: masegoMitchell,
    email: "rmulaudzi796@gmail.com",
    bio: "Ms Takalani Mulaudzi is a qualified Social Worker and Employee Assistance Programme (EAP) Specialist with over 15 years of experience in psychosocial support, counselling, and workplace wellbeing. She holds a Bachelor of Social Work, a BA Honours in Psychology, an Advanced EAP Certificate, and is currently pursuing a Master's degree in Psychology at the University of South Africa (UNISA), with a focus on employee wellbeing and mental health support.",
    days: APPOINTMENT_DAYS, times: APPOINTMENT_TIMES,
  },
  {
    name: "Shelley Roets", role: "Licensed Counsellor", specialty: "Anxiety & Depression", image: nickyVlantis,
    email: "scroets@gmail.com",
    bio: "Shelley Roets is a Mental Health Counsellor dedicated to helping individuals navigate life's challenges while building resilience, confidence, and emotional wellbeing. She specialises in supporting clients experiencing anxiety, stress, grief, relationship difficulties, and major life transitions through a compassionate, client-centred approach.",
    days: APPOINTMENT_DAYS, times: APPOINTMENT_TIMES,
  },
  {
    name: "Patience Thabede", role: "Licensed Counsellor", specialty: "Anxiety & Depression", image: bongiweMthembu,
    email: "nzimande20@gmail.com",
    bio: "Patience Thabede is a registered Social Worker and Mental Health Practitioner with over 10 years of experience in trauma-informed psychosocial care. She holds a BA in Social Work from the University of KwaZulu-Natal, a Master's degree in Social Development and Policy from the University of Pretoria, and an International Diploma in Humanitarian Assistance from Fordham University, specialising in evidence-based counselling, crisis intervention, and mental health support.",
    days: APPOINTMENT_DAYS, times: APPOINTMENT_TIMES,
  },
  {
    name: "Masego Mitchell", role: "Licensed Counsellor", specialty: "Anxiety & Depression", image: patienceThabede,
    email: "khabibmitchell02@gmail.com",
    bio: "Masego Mitchell is a qualified Social Worker with four years of experience providing counselling, psychosocial support, and mental health advocacy services. She is passionate about empowering individuals and communities to build resilience and improve wellbeing, and is currently pursuing postgraduate studies in Clinical Social Work.",
    days: APPOINTMENT_DAYS, times: APPOINTMENT_TIMES,
  },
  {
    name: "Bongiwe Nomshado Mthembu", role: "Licensed Social Worker", specialty: "Anxiety & Depression", image: takalaniMulaudzi,
    email: "mthembubongiwe9@gmail.com",
    bio: "Bongiwe Nomshado Mthembu is a qualified Social Worker with extensive experience in child protection, family support, and statutory social work services. She holds a Bachelor of Arts Honours in Social Work from the University of Johannesburg and a Master's Degree in Occupational Social Work from the University of the Witwatersrand, specialising in psychosocial assessments, family mediation, and child welfare interventions.",
    days: APPOINTMENT_DAYS, times: APPOINTMENT_TIMES,
  },
];

const sessionTypes = ["Individual Counseling", "Couples Counseling", "Family Counseling", "Grief & Loss Counseling"];

const youtubeVideos = [
  { id: "ItqioUkMwNo", title: "Mental Health Awareness" },
  { id: "Ikzz2LWJytg", title: "Community Wellbeing" },
  { id: "Gg5fwSKUNqM", title: "Healing Through Care" },
  { id: "-NMrS9pg1ZY", title: "Mental Health Short" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

const MentalHealth = () => {
  const { t } = useTranslation();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [expandedBio, setExpandedBio] = useState<string | null>(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingReason, setBookingReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const selectedProfessional = professionals.find((p) => p.name === selectedProvider);
  const availableDays = selectedProfessional?.days || [];
  const availableTimes = selectedProfessional?.times || [];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !sessionType || !selectedProvider) return;
    setSubmitting(true);
    try {
      const bookingData = {
        user_id: user?.id || null,
        full_name: bookingName,
        email: bookingEmail,
        phone: bookingPhone,
        provider_name: selectedProvider,
        session_type: sessionType,
        session_date: format(date, "yyyy-MM-dd"),
        session_time: time,
        reason: bookingReason || null,
        status: "upcoming",
        session_mode: "Virtual",
      };
      const { error } = await supabase.from("bookings").insert(bookingData);
      if (error) throw error;
      setBookingSubmitted(true);
      toast.success("Booking confirmed!");

      // Send confirmation email (fire-and-forget)
      supabase.functions.invoke("send-booking-confirmation", {
        body: {
          full_name: bookingData.full_name,
          email: bookingData.email,
          provider_name: bookingData.provider_name,
          provider_email: selectedProfessional?.email,
          session_type: bookingData.session_type,
          session_date: bookingData.session_date,
          session_time: bookingData.session_time,
          session_mode: bookingData.session_mode,
          phone: bookingData.phone,
          reason: bookingData.reason,
        },
      }).then(({ error: emailErr }) => {
        if (emailErr) console.error("Email send failed:", emailErr);
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to book session");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>

      <SEO title="Mental Health Care Programs & Booking — World Changers" description="Book counseling, therapy and wellness programs with our qualified mental health providers. Confidential care across Southern Africa." path="/mental-health" />
      <PageHero title={t("mentalHealth.heroTitle")} subtitle={t("mentalHealth.heroSubtitle")} bgImage={mentalHealthBg} />

      {/* Booking headline */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl md:text-4xl font-bold leading-tight mb-6">
              {t("mentalHealth.bookingHeadline")}
            </h2>
            <Button onClick={() => setBookingOpen(true)} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <CalendarDays className="w-5 h-5 mr-2" /> {t("mentalHealth.openBooking")}
            </Button>
          </div>
        </div>
      </section>

      {/* SADAG 24/7 Emergency Contact */}
      <section className="bg-destructive text-destructive-foreground">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider opacity-90">{t("mentalHealth.emergencyLabel")}</p>
                <h2 className="font-heading text-lg md:text-xl font-bold leading-tight">{t("mentalHealth.emergencyTitle")}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 flex-1 text-sm">
              <a href="tel:0800567567" className="bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors">
                <div className="text-[11px] opacity-90">{t("mentalHealth.emergencySuicide")}</div>
                <div className="font-bold">0800 567 567</div>
              </a>
              <a href="tel:0112344837" className="bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors">
                <div className="text-[11px] opacity-90">{t("mentalHealth.emergencyMH")}</div>
                <div className="font-bold">011 234 4837</div>
              </a>
              <a href="sms:31393" className="bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors">
                <div className="text-[11px] opacity-90">{t("mentalHealth.emergencySMS")}</div>
                <div className="font-bold">31393 / 32312</div>
              </a>
              <a href="https://wa.me/27768822775" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors">
                <div className="text-[11px] opacity-90">WhatsApp (9am–5pm)</div>
                <div className="font-bold">076 882 2775</div>
              </a>
            </div>
          </div>
          <p className="text-xs opacity-90 mt-3 text-center md:text-left">{t("mentalHealth.emergencyNote")}</p>
        </div>
      </section>

      {/* Call Now + Book Session - Side by Side */}
      <section className="section-padding bg-card">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Call Now */}
            <div className="flex flex-col items-center text-center bg-muted rounded-2xl p-8 border border-border">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">{t("mentalHealth.callNow")}</h2>
              <p className="text-muted-foreground flex-1">{t("mentalHealth.callNowDesc")}</p>
              <div className="mt-6">
                <VoiceAgent variant="button" />
              </div>
            </div>

            {/* Book Session */}
            <div className="flex flex-col items-center text-center bg-muted rounded-2xl p-8 border border-border">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <CalendarDays className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">{t("mentalHealth.bookSession")}</h2>
              <p className="text-muted-foreground flex-1">{t("mentalHealth.bookSessionDesc")}</p>
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mt-4 mb-4">
                <Video className="w-3.5 h-3.5" /> {t("mentalHealth.virtualNote")}
              </div>
              <Button onClick={() => setBookingOpen(true)} size="lg" className="bg-hero-gradient text-primary-foreground hover:opacity-90">
                <CalendarDays className="w-5 h-5 mr-2" /> {t("mentalHealth.openBooking")}
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Booking Calendar Modal */}
      {bookingOpen && (
        <section className="section-padding bg-muted">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto bg-card rounded-2xl p-8 shadow-card border border-border relative">
              <button onClick={() => { setBookingOpen(false); setBookingSubmitted(false); }} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>

              {bookingSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CalendarDays className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
                  <p className="text-muted-foreground">Your 60-minute virtual {sessionType} session with {selectedProvider} is scheduled for {date && format(date, "PPP")} at {time}.</p>
                  <p className="text-sm text-muted-foreground mt-2">A confirmation has been sent to info@worldchangersmh.org.</p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                    <a
                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Virtual ${sessionType} — ${selectedProvider}`)}&dates=${date ? format(date, "yyyyMMdd") : ""}T${time.replace(":", "")}00/${date ? format(date, "yyyyMMdd") : ""}T${(() => { const [h, m] = time.split(":").map(Number); return `${String(h + 1).padStart(2, "0")}${String(m).padStart(2, "0")}`; })()}00&details=${encodeURIComponent(`Virtual session with ${selectedProvider}\nType: ${sessionType}\nMode: Virtual`)}&location=Virtual`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                    >
                      <CalendarDays className="w-4 h-4" /> Add to Google Calendar <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <Button onClick={() => { setBookingSubmitted(false); setDate(undefined); setTime(""); setSessionType(""); setSelectedProvider(""); setBookingName(""); setBookingEmail(""); setBookingPhone(""); setBookingReason(""); }}
                      variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      Book Another Session
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">Schedule Your Virtual Session</h3>
                  <p className="text-sm text-muted-foreground mb-2">All sessions are 60 minutes and conducted virtually. Select your preferred provider to see their availability.</p>
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                    <Video className="w-3.5 h-3.5" /> Session Mode: Virtual
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                      <Input placeholder="Your name" required value={bookingName} onChange={(e) => setBookingName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                      <Input type="email" placeholder="your@email.com" required value={bookingEmail} onChange={(e) => setBookingEmail(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                    <Input type="tel" placeholder="+27 XX XXX XXXX" required value={bookingPhone} onChange={(e) => setBookingPhone(e.target.value)} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Preferred Provider</label>
                    <Select value={selectedProvider} onValueChange={(val) => { setSelectedProvider(val); setDate(undefined); setTime(""); }}>
                      <SelectTrigger><SelectValue placeholder="Select a provider" /></SelectTrigger>
                      <SelectContent>
                        {professionals.map((p) => (
                          <SelectItem key={p.name} value={p.name}>{p.name} — {p.specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Session Type</label>
                    <Select value={sessionType} onValueChange={setSessionType} required>
                      <SelectTrigger><SelectValue placeholder="Select session type" /></SelectTrigger>
                      <SelectContent>
                        {sessionTypes.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedProvider && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          Preferred Date <span className="text-xs text-muted-foreground">({selectedProfessional?.days.join(", ")})</span>
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                              <CalendarDays className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single" selected={date} onSelect={setDate}
                              disabled={(d) => {
                                if (d < new Date()) return true;
                                const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()];
                                return !availableDays.includes(dayName);
                              }}
                              initialFocus className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Preferred Time</label>
                        <div className="grid grid-cols-4 gap-2">
                          {availableTimes.map((slot) => (
                            <button key={slot} type="button" onClick={() => setTime(slot)}
                              className={cn(
                                "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                                time === slot ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:border-primary"
                              )}>
                              <Clock className="w-3 h-3 inline mr-1" />{slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Brief Reason for Visit</label>
                    <Textarea placeholder="Please briefly describe the reason for your visit..." rows={3} value={bookingReason} onChange={(e) => setBookingReason(e.target.value)} />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90"
                    disabled={!date || !time || !sessionType || !selectedProvider || submitting}>
                    {submitting ? "Booking..." : "Confirm Booking"}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Professionals */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label="Our Professionals" title="Meet the Experts Who Care" description="Review our providers below and choose your preferred professional when booking." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((p, i) => (
              <motion.div key={p.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card rounded-2xl overflow-hidden shadow-card border border-border group">
                <div className="flex items-start gap-4 p-5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                    ) : (
                      <svg className="w-10 h-10 text-muted-foreground/40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-base font-semibold text-foreground">{p.name}</h3>
                    <p className="text-primary text-sm font-medium mt-0.5">{p.role}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{p.specialty}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium text-foreground">Available:</span> By Appointment only
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <p className={cn("text-sm text-muted-foreground leading-relaxed", expandedBio !== p.name && "line-clamp-3")}>
                    {p.bio}
                  </p>
                  <button onClick={() => setExpandedBio(expandedBio === p.name ? null : p.name)}
                    className="text-xs text-primary font-medium mt-2 hover:underline">
                    {expandedBio === p.name ? "Show Less" : "Read Full Bio"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label={t("mentalHealth.programsLabel")} title={t("mentalHealth.programsTitle")} description={t("mentalHealth.programsDesc")} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p, i) => (
              <motion.div key={p.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card rounded-xl p-6 shadow-soft hover:shadow-card transition-all border border-border group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-hero-gradient transition-all">
                  <p.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Videos */}
      <section className="section-padding bg-muted">
        <div className="container mx-auto">
          <SectionHeading label="Watch & Learn" title="Mental Health Videos" description="Educational videos on mental health awareness and wellbeing." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {youtubeVideos.map((video, i) => (
              <motion.div key={video.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="rounded-xl overflow-hidden shadow-soft border border-border bg-card">
                <div className="aspect-video">
                  <iframe src={`https://www.youtube.com/embed/${video.id}`} title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen className="w-full h-full" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2"><Play className="w-3.5 h-3.5 text-primary" /> {video.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MentalHealth;
