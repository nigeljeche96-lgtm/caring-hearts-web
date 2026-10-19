import { useSiteCopy } from "@/i18n/useSiteCopy";
import GoogleReviews from "@/components/GoogleReviews";
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
  const tx = useSiteCopy();
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
      toast.success(tx("Campaign updated!"));
      setEditingCampaign(null);
      refetchCampaigns();
    }
  };

  const canEditCampaign = (c: any) => isAdmin || (user && c.user_id === user.id);

  return (
    <div>

      <SEO title={tx("Donate — World Changers Mental Health Care Organisation")} description={tx("Make a once-off or monthly donation supporting mental health care and community outreach. Secure local and international payment options.")} path="/donation" />
      <PageHero title={tx("Donation")} subtitle={t("campaigns.heroSubtitle")} bgImage={campaignBg} />

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
                <p><span className="font-semibold">{tx("Bank:")}</span> {tx("Standard Bank")}</p>
                <p><span className="font-semibold">{tx("Acc:")}</span> 10169316864</p>
                <p><span className="font-semibold">{tx("Branch:")}</span> 051001</p>
                <p><span className="font-semibold">{tx("SWIFT:")}</span> {tx("SBZA ZA JJ")}</p>
                <p className="text-xs text-muted-foreground mt-2">{tx("PBO: 930084594 · Tax deductible")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Donation checkout */}
      <section className="px-4 mb-12">
        <div className="container mx-auto">
          <SectionHeading label={tx("Donate")} title={tx("Make a Difference Today")} description={tx("Choose an amount, give once or monthly, and complete your donation securely with our payment partners.")} />
          <DonationWidget />
        </div>
      </section>

      <GoogleReviews />






    </div>
  );
};

export default Campaigns;
