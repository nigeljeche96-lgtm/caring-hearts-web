import { useSiteCopy } from "@/i18n/useSiteCopy";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Camera, Save, Loader2, Bell, Mail, MessageSquare, Calendar, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PageHero from "@/components/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import aboutBg from "@/assets/about-bg.jpg";

const ProfileSettings = () => {
  const tx = useSiteCopy();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifBookings, setNotifBookings] = useState(true);
  const [notifWellness, setNotifWellness] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, notification_email, notification_sms, notification_bookings, notification_wellness")
        .eq("id", user.id)
        .single();
      if (data) {
        setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url || user.user_metadata?.avatar_url || "");
        setNotifEmail(data.notification_email ?? true);
        setNotifSms(data.notification_sms ?? false);
        setNotifBookings(data.notification_bookings ?? true);
        setNotifWellness(data.notification_wellness ?? true);
      }
      setLoaded(true);
    };
    fetchProfile();
  }, [user, navigate]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { toast.error(tx("File must be under 2MB")); return; }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
      toast.success(tx("Avatar uploaded!"));
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({
        full_name: fullName,
        avatar_url: avatarUrl,
        notification_email: notifEmail,
        notification_sms: notifSms,
        notification_bookings: notifBookings,
        notification_wellness: notifWellness,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);
      if (error) throw error;

      await supabase.auth.updateUser({ data: { full_name: fullName, avatar_url: avatarUrl } });
      toast.success(tx("Profile updated!"));
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!user || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHero title={tx("Profile Settings")} subtitle={tx("Update your personal information and preferences")} bgImage={aboutBg} />

      <section className="section-padding">
        <div className="container mx-auto max-w-2xl">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> {tx("Back to Dashboard")} </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Avatar & Name */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <h2 className="font-heading text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> {tx("Personal Information")} </h2>
              <div className="flex items-center gap-6 mb-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/20">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-primary" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute inset-0 rounded-full bg-foreground/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {uploading ? <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" /> : <Camera className="w-5 h-5 text-primary-foreground" />}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{tx("Click avatar to change photo")}</p>
                  <p className="text-xs text-muted-foreground">{tx("Max 2MB, JPG or PNG")}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">{tx("Full Name")}</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={tx("Your name")} className="mt-1.5" />
                </div>
                <div>
                  <Label>{tx("Email")}</Label>
                  <Input value={user.email || ""} disabled className="mt-1.5 bg-muted" />
                  <p className="text-xs text-muted-foreground mt-1">{tx("Email cannot be changed here")}</p>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <h2 className="font-heading text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent" /> {tx("Notification Preferences")} </h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><Mail className="w-4 h-4 text-primary" /></div>
                    <div><p className="text-sm font-medium text-foreground">{tx("Email Notifications")}</p><p className="text-xs text-muted-foreground">{tx("Receive updates via email")}</p></div>
                  </div>
                  <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><MessageSquare className="w-4 h-4 text-primary" /></div>
                    <div><p className="text-sm font-medium text-foreground">{tx("SMS Notifications")}</p><p className="text-xs text-muted-foreground">{tx("Receive text message alerts")}</p></div>
                  </div>
                  <Switch checked={notifSms} onCheckedChange={setNotifSms} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center"><Calendar className="w-4 h-4 text-accent" /></div>
                    <div><p className="text-sm font-medium text-foreground">{tx("Booking Reminders")}</p><p className="text-xs text-muted-foreground">{tx("Get reminded about upcoming sessions")}</p></div>
                  </div>
                  <Switch checked={notifBookings} onCheckedChange={setNotifBookings} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center"><Heart className="w-4 h-4 text-accent" /></div>
                    <div><p className="text-sm font-medium text-foreground">{tx("Wellness Tips")}</p><p className="text-xs text-muted-foreground">{tx("Daily wellness suggestions & prompts")}</p></div>
                  </div>
                  <Switch checked={notifWellness} onCheckedChange={setNotifWellness} />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <Button onClick={handleSave} size="lg" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} {tx("Save Changes")} </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProfileSettings;
