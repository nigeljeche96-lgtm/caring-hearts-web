import { useState } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Heart, ArrowRight, DollarSign, Target, BarChart3, Users, TrendingUp, Star, ExternalLink, Globe, MapPin, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import CreateCampaignDialog from "@/components/CreateCampaignDialog";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import campaignBg from "@/assets/campaign-bg.jpg";
import DonationWidget from "@/components/DonationWidget";


const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const fetchCampaigns = async () => {
  const { data, error } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

const fetchDonations = async () => {
  const { data, error } = await (supabase as any).from("public_campaign_donations").select("id, campaign_id, amount, created_at").order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  return data;
};

const Campaigns = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", goal_amount: "", paystack_link: "", image_url: "" });

  const { data: campaigns = [], refetch: refetchCampaigns } = useQuery({ queryKey: ["campaigns"], queryFn: fetchCampaigns });
  const { data: donations = [] } = useQuery({ queryKey: ["campaign-donations"], queryFn: fetchDonations });

  const totalRaised = campaigns.reduce((sum, c) => sum + Number(c.raised_amount), 0);
  const totalDonors = donations.length;
  const avgCompletion = campaigns.length
    ? Math.round(campaigns.reduce((sum, c) => sum + Math.min((Number(c.raised_amount) / Math.max(Number(c.goal_amount), 1)) * 100, 100), 0) / campaigns.length)
    : 0;
  const fullyFunded = campaigns.filter((c) => Number(c.raised_amount) >= Number(c.goal_amount)).length;

  const dashboardStats = [
    { icon: DollarSign, value: `R${totalRaised.toLocaleString()}`, label: t("campaigns.totalFundsRaised") },
    { icon: Target, value: String(campaigns.length), label: t("campaigns.activeCampaigns") },
    { icon: Users, value: String(totalDonors), label: t("campaigns.totalDonations") },
    { icon: TrendingUp, value: `${avgCompletion}%`, label: t("campaigns.avgCompletion") },
  ];

  const startEditing = (c: any) => {
    setEditingCampaign(c.id);
    setEditForm({
      title: c.title,
      description: c.description,
      goal_amount: String(c.goal_amount),
      paystack_link: c.paystack_link || "",
      image_url: c.image_url || "",
    });
  };

  const handleSaveEdit = async (campaignId: string) => {
    const { error } = await supabase.from("campaigns").update({
      title: editForm.title,
      description: editForm.description,
      goal_amount: parseFloat(editForm.goal_amount),
      paystack_link: editForm.paystack_link || null,
      image_url: editForm.image_url || null,
    }).eq("id", campaignId);
    if (error) {
      toast.error("Failed to update: " + error.message);
    } else {
      toast.success("Campaign updated!");
      setEditingCampaign(null);
      refetchCampaigns();
    }
  };

  const canEditCampaign = (c: any) => isAdmin || (user && c.user_id === user.id);

  return (
    <div>

      <SEO title="Donate — World Changers Mental Health Care Organisation" description="Make a once-off or monthly donation supporting mental health care and community outreach. Secure local and international payment options." path="/donation" />
      <PageHero title="Donation" subtitle={t("campaigns.heroSubtitle")} bgImage={campaignBg} />

      {/* Donate Online + Offline */}
      <section className="relative -mt-16 z-10 px-4 mb-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-card rounded-xl p-8 shadow-elevated border border-border text-center">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">{t("campaigns.donateOnline")}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t("campaigns.donateOnlineDesc")}</p>
              <Button size="lg" className="bg-hero-gradient text-primary-foreground hover:opacity-90 w-full"
                onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}>
                {t("common.donateNow")} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-8 shadow-elevated border border-border text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">{t("campaigns.offlineDonation")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("campaigns.offlineDonationDesc")}</p>
              <div className="text-left text-sm space-y-2">
                <p><span className="font-semibold">Bank:</span> Standard Bank</p>
                <p><span className="font-semibold">Acc:</span> 10169316864</p>
                <p><span className="font-semibold">Branch:</span> 051001</p>
                <p><span className="font-semibold">SWIFT:</span> SBZA ZA JJ</p>
                <p className="text-xs text-muted-foreground mt-2">PBO: 930084594 · Tax deductible</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Donation checkout */}
      <section className="px-4 mb-12">
        <div className="container mx-auto">
          <SectionHeading label="Donate" title="Make a Difference Today" description="Choose an amount, give once or monthly, and complete your donation securely with our payment partners." />
          <DonationWidget />
        </div>
      </section>


      {/* Dashboard Stats */}
      <section className="px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardStats.map((s, i) => (
              <motion.div key={s.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card rounded-xl p-6 shadow-elevated text-center border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Grid */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <SectionHeading label={t("campaigns.campaignGrid")} title={t("campaigns.campaignGridTitle")} description={t("campaigns.campaignGridDesc")} />
            {(isAdmin || user) && (
              <div className="mt-4 md:mt-0">
                <CreateCampaignDialog onCreated={() => refetchCampaigns()} />
              </div>
            )}
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-20">
              <Brain className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">{t("campaigns.noCampaigns")}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((c, i) => {
                const percent = Number(c.goal_amount) > 0 ? Math.round((Number(c.raised_amount) / Number(c.goal_amount)) * 100) : 0;
                const donateLink = c.paystack_link || "https://paystack.shop/pay/87qgnu5n8o";
                const isExpanded = expandedCampaign === c.id;
                const isEditing = editingCampaign === c.id;
                return (
                  <motion.div key={c.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                    className="bg-card rounded-xl overflow-hidden shadow-soft border border-border group hover:shadow-card transition-shadow">
                    <div className="aspect-video bg-primary/5 flex items-center justify-center relative overflow-hidden cursor-pointer"
                      onClick={() => setExpandedCampaign(isExpanded ? null : c.id)}>
                      {c.image_url ? (
                        <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
                      ) : (
                        <Brain className="w-16 h-16 text-primary/20" />
                      )}
                      <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">{percent}%</div>
                    </div>
                    <div className="p-5">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div><Label>Title</Label><Input value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} /></div>
                          <div><Label>Description</Label><Textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} rows={3} /></div>
                          <div><Label>Goal (ZAR)</Label><Input type="number" value={editForm.goal_amount} onChange={(e) => setEditForm({...editForm, goal_amount: e.target.value})} /></div>
                          <div><Label>Paystack Link</Label><Input value={editForm.paystack_link} onChange={(e) => setEditForm({...editForm, paystack_link: e.target.value})} /></div>
                          <div><Label>Image URL</Label><Input value={editForm.image_url} onChange={(e) => setEditForm({...editForm, image_url: e.target.value})} /></div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSaveEdit(c.id)} className="bg-hero-gradient text-primary-foreground">Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingCampaign(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-2 cursor-pointer"
                              onClick={() => setExpandedCampaign(isExpanded ? null : c.id)}>{c.title}</h3>
                            {canEditCampaign(c) && (
                              <button onClick={() => startEditing(c)} aria-label="Edit campaign" className="text-muted-foreground hover:text-primary transition-colors ml-2 shrink-0">
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className={`text-sm text-muted-foreground mb-4 ${isExpanded ? "" : "line-clamp-2"}`}>{c.description}</p>
                          {isExpanded && (
                            <div className="mb-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground space-y-1">
                              <p><span className="font-semibold text-foreground">Created:</span> {new Date(c.created_at).toLocaleDateString()}</p>
                              <p><span className="font-semibold text-foreground">Status:</span> {c.status}</p>
                              <p><span className="font-semibold text-foreground">Donations:</span> {c.donation_count}</p>
                            </div>
                          )}
                          <button onClick={() => setExpandedCampaign(isExpanded ? null : c.id)}
                            className="text-xs text-primary flex items-center gap-1 mb-3 hover:underline">
                            {isExpanded ? <>Show less <ChevronUp className="w-3 h-3" /></> : <>View details <ChevronDown className="w-3 h-3" /></>}
                          </button>
                          <div className="w-full bg-muted rounded-full h-2.5 mb-3">
                            <div className="bg-accent h-2.5 rounded-full transition-all" style={{ width: `${Math.min(percent, 100)}%` }} />
                          </div>
                          <div className="flex justify-between text-sm mb-4">
                            <span className="text-muted-foreground">{t("campaigns.raised")}: <span className="text-primary font-semibold">R{Number(c.raised_amount).toLocaleString()}</span></span>
                            <span className="text-muted-foreground">{t("campaigns.goal")}: R{Number(c.goal_amount).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{c.donation_count} {t("campaigns.donations")}</span>
                            <Button asChild size="sm" className="bg-hero-gradient text-primary-foreground hover:opacity-90">
                              <a href={donateLink} target="_blank" rel="noopener noreferrer">
                                {t("common.donateNow")} <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Campaign Analytics */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">{t("campaigns.campaignAnalytics")}</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mt-3">{t("campaigns.realTimeDashboard")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <BarChart3 className="w-10 h-10 text-accent mx-auto mb-3" />
              <p className="font-heading text-3xl font-bold text-primary-foreground">R{totalRaised.toLocaleString()}</p>
              <p className="text-sm text-primary-foreground/70 mt-1">{t("campaigns.totalRaisedAll")}</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Heart className="w-10 h-10 text-accent mx-auto mb-3" />
              <p className="font-heading text-3xl font-bold text-primary-foreground">{totalDonors}</p>
              <p className="text-sm text-primary-foreground/70 mt-1">{t("campaigns.totalDonationsReceived")}</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Star className="w-10 h-10 text-accent mx-auto mb-3" />
              <p className="font-heading text-3xl font-bold text-primary-foreground">{fullyFunded}</p>
              <p className="text-sm text-primary-foreground/70 mt-1">{t("campaigns.fullyFunded")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label={t("campaigns.howItWorks")} title={t("campaigns.donationJourney")} description={t("campaigns.donationJourneyDesc")} />
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: t("campaigns.step1Title"), desc: t("campaigns.step1Desc") },
              { step: "02", title: t("campaigns.step2Title"), desc: t("campaigns.step2Desc") },
              { step: "03", title: t("campaigns.step3Title"), desc: t("campaigns.step3Desc") },
              { step: "04", title: t("campaigns.step4Title"), desc: t("campaigns.step4Desc") },
            ].map((item, i) => (
              <motion.div key={item.step} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <span className="font-heading text-2xl font-bold text-accent">{item.step}</span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offline Donation */}
      <section className="section-padding bg-muted">
        <div className="container mx-auto">
          <SectionHeading label={t("campaigns.bankTransfer")} title={t("campaigns.offlineDonationTitle")} description={t("campaigns.offlineDonationLongDesc")} />
          <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-card p-8 border border-border">
            <div className="space-y-4 text-sm text-foreground">
              {[
                ["Account Name", "WORLD CHANGERS MENTAL HEALTH CARE ORGANISATION"],
                ["Bank Name", "Standard Bank"],
                ["Account Number", "10169316864"],
                ["Branch Code", "051001"],
                ["SWIFT Address", "SBZA ZA JJ"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-border pb-3">
                  <span className="font-semibold">{label}</span>
                  <span className="text-right">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-accent/10 rounded-xl text-center">
              <p className="text-sm text-foreground">{t("campaigns.taxDeductible")}</p>
              <p className="text-lg font-heading font-bold text-primary mt-2">PBO NUMBER: 930084594</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-accent-foreground mb-4">{t("campaigns.ctaTitle")}</h2>
          <p className="text-accent-foreground/80 max-w-xl mx-auto mb-8">{t("campaigns.ctaDesc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/contact">{t("campaigns.startCampaign")} <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground/10">
              <Link to="/volunteers">{t("common.becomeVolunteer")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Campaigns;
