import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Users, Clock, Award, ArrowRight, Shield, Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import philanthropyBg from "@/assets/philanthropy-bg.jpg";
import { useState } from "react";

const benefits = [
  { icon: Heart, title: "Make a Real Impact", desc: "Help transform lives in communities that need it most." },
  { icon: Users, title: "Join a Community", desc: "Connect with like-minded people passionate about mental health." },
  { icon: Clock, title: "Flexible Hours", desc: "Volunteer on your schedule — weekdays, weekends, or virtually." },
  { icon: Award, title: "Gain Experience", desc: "Build valuable skills and receive certification for your work." },
];

const features = [
  { icon: Shield, title: "Become A Volunteer", desc: "There are many ways you can help us in creating a world with better mental health care for all." },
  { icon: Heart, title: "Shelter For Homeless", desc: "Providing safe spaces and mental health support for the homeless and displaced communities." },
  { icon: Sparkles, title: "Make World Happier", desc: "Our programs bring joy and healing to thousands of people around the globe every year." },
  { icon: Brain, title: "Give Healthy Life", desc: "Through quality mental health care, we help people reclaim healthy, fulfilling lives." },
];

const Volunteers = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <PageHero title="Become a Volunteer" subtitle="Join us in creating a world where mental health care is accessible to all" bgImage={philanthropyBg} />

      {/* Why Volunteer */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label="Why Volunteer" title="Be Part of the Change" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 text-center shadow-soft">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-muted">
        <div className="container mx-auto">
          <SectionHeading label="What We Do" title="Our Impact Areas" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 text-center shadow-soft group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-hero-gradient transition-all">
                  <f.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Form */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <SectionHeading label="Join Us" title="Apply to Volunteer" description="Fill out the form below and our team will be in touch." />
            {submitted ? (
              <div className="bg-card rounded-2xl p-12 shadow-card text-center">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground">Your application has been received. We'll contact you shortly.</p>
              </div>
            ) : (
              <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="bg-card rounded-2xl p-8 shadow-card space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                    <Input placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                    <Input type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Why do you want to volunteer?</label>
                  <Textarea placeholder="Tell us about your motivation..." rows={4} required />
                </div>
                <Button type="submit" size="lg" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90">
                  Submit Application <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Volunteers;
