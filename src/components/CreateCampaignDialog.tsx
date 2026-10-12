import { useSiteCopy } from "@/i18n/useSiteCopy";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Props {
  onCreated: () => void;
}

const CreateCampaignDialog = ({ onCreated }: Props) => {
  const tx = useSiteCopy();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal_amount: "",
    paystack_link: "",
    image_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(tx("Please log in to create a campaign"));
      return;
    }
    if (!form.title || !form.description || !form.goal_amount) {
      toast.error(tx("Please fill in all required fields"));
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("campaigns").insert({
      title: form.title,
      description: form.description,
      goal_amount: parseFloat(form.goal_amount),
      paystack_link: form.paystack_link || null,
      image_url: form.image_url || null,
      user_id: user.id,
    });
    setLoading(false);

    if (error) {
      toast.error("Failed to create campaign: " + error.message);
    } else {
      toast.success(tx("Campaign created successfully!"));
      setForm({ title: "", description: "", goal_amount: "", paystack_link: "", image_url: "" });
      setOpen(false);
      onCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-hero-gradient text-primary-foreground hover:opacity-90">
          <Plus className="w-5 h-5 mr-2" /> {tx("Create Campaign")} </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">{tx("Create a New Campaign")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="title">{tx("Campaign Title *")}</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={tx("e.g. Help Youth Mental Health")} required />
          </div>
          <div>
            <Label htmlFor="description">{tx("Description *")}</Label>
            <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={tx("Describe your campaign...")} rows={3} required />
          </div>
          <div>
            <Label htmlFor="goal">{tx("Goal Amount (ZAR) *")}</Label>
            <Input id="goal" type="number" min="1" step="0.01" value={form.goal_amount} onChange={(e) => setForm({ ...form, goal_amount: e.target.value })} placeholder="e.g. 50000" required />
          </div>
          <div>
            <Label htmlFor="paystack">{tx("Paystack Payment Link")}</Label>
            <Input id="paystack" value={form.paystack_link} onChange={(e) => setForm({ ...form, paystack_link: e.target.value })} placeholder="https://paystack.com/pay/..." />
          </div>
          <div>
            <Label htmlFor="image">{tx("Image URL (optional)")}</Label>
            <Input id="image" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90">
            {loading ? tx("Creating...") : tx("Create Campaign")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignDialog;
