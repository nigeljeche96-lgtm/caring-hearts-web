import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { Shield, FileText, Lock, Eye, Scale, UserCheck, BookOpen } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import aboutBg from "@/assets/about-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const policies = [
  {
    icon: Lock,
    title: "Cybersecurity Policy",
    desc: "Our commitment to protecting digital infrastructure, data integrity, and safeguarding all stakeholder information against cyber threats.",
  },
  {
    icon: Scale,
    title: "Ethics Policy",
    desc: "Guiding principles for ethical conduct, professional responsibility, and maintaining the highest standards of integrity across all operations.",
  },
  {
    icon: Eye,
    title: "Information Disclosure Policy",
    desc: "Transparent guidelines on how organisational information is disclosed, ensuring accountability while protecting sensitive data.",
  },
  {
    icon: FileText,
    title: "Permission & Licensing Policy",
    desc: "Policies governing the use of intellectual property, licensing agreements, and permissions for content and resource usage.",
  },
  {
    icon: UserCheck,
    title: "Prevention of Sexual Exploitation Policy",
    desc: "Zero-tolerance approach to sexual exploitation and abuse, with clear reporting mechanisms and protective measures for all beneficiaries.",
  },
  {
    icon: BookOpen,
    title: "Terms of Use",
    desc: "The terms and conditions governing the use of our website, services, and digital platforms.",
  },
  {
    icon: Shield,
    title: "POPIA Compliance",
    desc: "Our compliance with the Protection of Personal Information Act, ensuring your personal data is collected, processed, and stored lawfully.",
  },
];

const Policies = () => (
  <div>
    <SEO
      title="Privacy Policy, Terms & Governance — World Changers MHCO"
      description="Read the privacy policy, terms and conditions, and governance commitments of World Changers Mental Health Care Organisation."
      path="/policies"
    />
    <PageHero title="Policies, Privacy & Terms" subtitle="Transparency, compliance, and governance" bgImage={aboutBg} />

    {/* Policies Grid */}
    <section className="section-padding">
      <div className="container mx-auto">
        <SectionHeading label="Governance" title="Our Policies" description="We are committed to the highest standards of transparency, ethics, and compliance." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((p, i) => (
            <motion.div key={p.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-card rounded-xl p-6 shadow-soft hover:shadow-card transition-shadow border border-border">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <p.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Privacy Policy */}
    <section id="privacy" className="section-padding bg-muted scroll-mt-28">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-card border border-border p-6 md:p-10">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Privacy Policy</h2>
          <p className="text-sm text-muted-foreground mb-8">
            This policy explains how World Changers Mental Health Care Organisation ("WCMHCO", "we", "us") collects and uses personal
            information through this website, in line with the Protection of Personal Information Act, 2013 (POPIA).
          </p>

          <div className="space-y-6 text-sm text-foreground leading-relaxed">
            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">1. Who we are</h3>
              <p className="text-muted-foreground">
                World Changers Mental Health Care Organisation, 114 George Street, Kenilworth, Johannesburg, 2190, South Africa.
                For any privacy question or request, email{" "}
                <a href="mailto:info@worldchangersmh.org" className="text-primary hover:underline">info@worldchangersmh.org</a>.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">2. Information we collect</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">Contact and enquiry details</strong> — your name, email address, phone number and message when you use our contact form.</li>
                <li><strong className="text-foreground">Counselling booking details</strong> — your name, contact details, preferred professional, preferred date and the information you choose to share in your booking request.</li>
                <li><strong className="text-foreground">Volunteer and partnership applications</strong> — the details you submit in those forms.</li>
                <li><strong className="text-foreground">Newsletter subscriptions</strong> — your email address and name where provided.</li>
                <li><strong className="text-foreground">Website usage data</strong> — pages viewed, device and browser type, and similar analytics information.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                We do not collect or store card numbers, CVV codes or banking passwords on this website. Donations are completed on the secure
                checkout pages of our payment providers.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">3. How we use your information</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>To respond to your enquiry or arrange a counselling appointment with the professional you selected.</li>
                <li>To process volunteer, partnership and event applications.</li>
                <li>To send newsletters and organisational updates where you have subscribed.</li>
                <li>To administer donations, issue acknowledgements and meet our record-keeping obligations.</li>
                <li>To understand how the website is used so that we can improve it.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">4. Sensitive information and counselling requests</h3>
              <p className="text-muted-foreground">
                Booking requests may include health-related information. This information is treated as confidential, shared only with the
                mental health professional handling your request and the staff who support that process, and used only to arrange and deliver
                your session. Please do not use website forms to report an emergency.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">5. Sharing your information</h3>
              <p className="text-muted-foreground">
                We do not sell your personal information. We share it only with the service providers that operate parts of this website and
                our communications — our hosting and database provider, our email delivery provider, our payment providers (Paystack and our
                international donation partner) and website analytics (Google Analytics) — and where the law requires disclosure.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">6. Cookies and analytics</h3>
              <p className="text-muted-foreground">
                This website uses cookies and similar technologies to keep the site working and to measure traffic through Google Analytics.
                You can block or delete cookies in your browser settings; some parts of the site may then not work as intended.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">7. Retention and security</h3>
              <p className="text-muted-foreground">
                We keep personal information only as long as needed for the purpose it was collected or as required by law, and we apply
                access controls and encryption in transit to protect it. No online transmission can be guaranteed to be completely secure.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">8. Your rights</h3>
              <p className="text-muted-foreground">
                Under POPIA you may request access to the personal information we hold about you, ask us to correct or delete it, object to
                processing, and withdraw consent to marketing at any time. Email{" "}
                <a href="mailto:info@worldchangersmh.org" className="text-primary hover:underline">info@worldchangersmh.org</a> and we will
                respond within a reasonable period. You may also lodge a complaint with the South African Information Regulator.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">9. Children</h3>
              <p className="text-muted-foreground">
                Where a service involves a person under 18, we require the consent of a parent or legal guardian before processing their
                personal information.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">10. Changes to this policy</h3>
              <p className="text-muted-foreground">
                We may update this policy from time to time. The version published on this page is the current version.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Terms */}
    <section id="terms" className="section-padding scroll-mt-28">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-card border border-border p-6 md:p-10">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Terms &amp; Conditions</h2>
          <p className="text-sm text-muted-foreground mb-8">
            These terms govern your use of the WCMHCO website and the services offered through it. By using the website you accept them.
          </p>

          <div className="space-y-6 text-sm text-foreground leading-relaxed">
            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">1. Website usage</h3>
              <p className="text-muted-foreground">
                You agree to use this website lawfully and not to interfere with its operation, attempt unauthorised access, or submit
                false, misleading or harmful information through our forms. If you are under 18, please use this website with the
                knowledge and consent of a parent or legal guardian.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">2. Our services</h3>
              <p className="text-muted-foreground">
                Through this website we share mental health awareness information, offer counselling session requests with registered
                professionals, and run community outreach, volunteering, events and fundraising activities. Information published here is
                for general awareness and does not replace professional diagnosis, treatment or advice.
              </p>
              <p className="text-muted-foreground mt-2">
                This website is not monitored around the clock and must not be used to report an emergency. If you or someone else is in
                immediate danger, contact your local emergency services without delay.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">3. Bookings and appointments</h3>
              <p className="text-muted-foreground">
                A booking made on this website is a request, not a confirmed appointment. Sessions are offered by arrangement with the
                professional you select and are subject to their availability. Your session is confirmed only once that professional
                responds to you directly. Please let us know as early as possible if you need to reschedule or cancel, and be aware that
                the professional you consult remains responsible for the clinical care they provide.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">4. Communications</h3>
              <p className="text-muted-foreground">
                When you submit a booking, contact, volunteer or partnership form, you agree that we may reply to you by email or phone
                about that request. Newsletters and organisational updates are only sent where you have subscribed, and you may
                unsubscribe at any time. Our online assistant and voice assistant give general guidance only and do not provide
                counselling, diagnosis or crisis support.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">5. Donations and shop orders</h3>
              <p className="text-muted-foreground">
                Donations and merchandise payments are processed by our payment providers on their own secure platforms and are subject to
                their terms. Unless a donation is given to a specific published appeal, it is applied to our general charitable work. If a
                payment is made in error, contact us and we will assist with the provider's refund process where possible.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">6. Limitations</h3>
              <p className="text-muted-foreground">
                We take reasonable care to keep this website accurate and available, but we do not warrant uninterrupted access or
                error-free content. To the extent permitted by South African law, we are not liable for any loss or damage arising from
                your use of this website, from reliance on information published here, or from any interruption to the website or the
                third-party services it links to.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">7. Third-party resources</h3>
              <p className="text-muted-foreground">
                Our website links to and embeds external services such as payment providers, registration and booking forms, maps,
                analytics, social media pages and helpline resources. Those services are operated independently and are governed by their
                own terms and privacy policies. We are not responsible for their content, availability or practices.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">8. Intellectual property</h3>
              <p className="text-muted-foreground">
                The content, logos, photographs, articles and designs on this website belong to WCMHCO or are used with permission. You may
                view and share this material for personal, non-commercial purposes with credit to us, but it may not be copied, adapted or
                used commercially without our written consent.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">9. Changes to these terms</h3>
              <p className="text-muted-foreground">
                We may update these terms from time to time. The version published on this page is the current version, and your continued
                use of the website means you accept it.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">10. Governing law and contact details</h3>
              <p className="text-muted-foreground">
                These terms are governed by the laws of the Republic of South Africa. For any question about them, contact World Changers
                Mental Health Care Organisation, 114 George Street, Kenilworth, Johannesburg, 2190, South Africa, or email{" "}
                <a href="mailto:info@worldchangersmh.org" className="text-primary hover:underline">info@worldchangersmh.org</a>.
              </p>
            </div>
          </div>


          <p className="text-xs text-muted-foreground mt-8 border-t border-border pt-4">
            Governance records, registration certificates and financial reports are available on request by emailing{" "}
            <a href="mailto:info@worldchangersmh.org" className="text-primary hover:underline">info@worldchangersmh.org</a>.
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default Policies;
