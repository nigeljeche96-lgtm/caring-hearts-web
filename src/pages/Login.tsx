import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2,
  Calendar, Heart, ShoppingBag, BookOpen, Clock, Star,
  Phone, Gift, TrendingUp, LogOut, ChevronRight, CalendarX,
  Settings, Smile, X, RefreshCw, Trash2, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PageHero from "@/components/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { format, parseISO, addDays, isAfter } from "date-fns";
import SEO from "@/components/SEO";
import aboutBg from "@/assets/about-bg.jpg";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";



interface Booking {
  id: string;
  session_type: string;
  provider_name: string;
  session_date: string;
  session_time: string;
  session_mode: string;
  status: string;
}

const wellnessTips = [
  { icon: Smile, title: "Log Your Mood", desc: "Track how you feel each day", path: "/mood-tracker" },
  { icon: BookOpen, title: "Journal Prompt", desc: "Write about 3 things you're grateful for", path: "/mood-tracker" },
  { icon: TrendingUp, title: "View Trends", desc: "See your mood patterns over time", path: "/mood-tracker" },
];

const quickActions = [
  { icon: Calendar, label: "Book Session", desc: "Schedule therapy", path: "/mental-health" },
  { icon: Smile, label: "Mood Tracker", desc: "Log your mood", path: "/mood-tracker" },
  { icon: ShoppingBag, label: "Shop", desc: "Browse merch", path: "/shop" },
  { icon: Gift, label: "Donate", desc: "Support our cause", path: "/philanthropy" },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const availableTimes = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const cartItems = useCartStore((s) => s.items);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null);
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      setBookingsLoading(true);
      const { data } = await supabase
        .from("bookings")
        .select("id, session_type, provider_name, session_date, session_time, session_mode, status")
        .eq("user_id", user.id)
        .gte("session_date", new Date().toISOString().split("T")[0])
        .order("session_date", { ascending: true })
        .limit(5);
      setBookings((data as Booking[]) || []);
      setBookingsLoading(false);
    };
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async () => {
    if (!cancelBooking) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.from("bookings").delete().eq("id", cancelBooking.id);
      if (error) throw error;
      setBookings((prev) => prev.filter((b) => b.id !== cancelBooking.id));
      toast.success("Session cancelled successfully");
      setCancelBooking(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel session");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleBooking = async () => {
    if (!rescheduleBooking || !rescheduleDate || !rescheduleTime) return;
    setActionLoading(true);
    try {
      const newDate = format(rescheduleDate, "yyyy-MM-dd");
      const { error } = await supabase.from("bookings").update({
        session_date: newDate,
        session_time: rescheduleTime,
      }).eq("id", rescheduleBooking.id);
      if (error) throw error;
      setBookings((prev) => prev.map((b) => b.id === rescheduleBooking.id ? { ...b, session_date: newDate, session_time: rescheduleTime } : b));
      toast.success("Session rescheduled successfully");
      setRescheduleBooking(null);
      setRescheduleDate(undefined);
      setRescheduleTime("");
    } catch (err: any) {
      toast.error(err.message || "Failed to reschedule session");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message || `Failed to sign in with ${provider}`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to sign in with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || "there";
  const greeting = new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 17 ? "Good Afternoon" : "Good Evening";

  if (user) {
    return (
      <>
      <div>
        <PageHero title={`${greeting}, ${displayName}!`} subtitle="Your personal wellness dashboard" bgImage={aboutBg} />

        <section className="section-padding">
          <div className="container mx-auto max-w-6xl">
            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">

              {/* Profile Card + Quick Actions Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <motion.div variants={fadeUp} className="bg-card rounded-2xl p-6 shadow-card border border-border">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20">
                      {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading text-lg font-bold text-foreground truncate">{displayName}</h3>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">Member</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate("/profile-settings")}>
                      <Settings className="w-4 h-4 mr-1" /> Settings
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate("/shop")}>
                      <ShoppingBag className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={signOut}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={fadeUp} className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickActions.map((action) => (
                    <Link key={action.label} to={action.path}
                      className="bg-card rounded-xl p-4 shadow-card border border-border hover:border-primary/30 hover:shadow-elevated transition-all group text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                        <action.icon className="w-5 h-5 text-primary" />
                      </div>
                      <p className="font-heading font-bold text-sm text-foreground">{action.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                    </Link>
                  ))}
                </motion.div>
              </div>

              {/* Upcoming Sessions */}
              <motion.div variants={fadeUp} className="bg-card rounded-2xl p-6 shadow-card border border-border">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" /> Upcoming Sessions
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Your scheduled therapy & wellness appointments</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/mental-health">Book New <ChevronRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                </div>
                <div className="space-y-3">
                  {bookingsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarX className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">No upcoming sessions</p>
                      <Button asChild variant="outline" size="sm" className="mt-3">
                        <Link to="/mental-health">Book Your First Session</Link>
                      </Button>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <motion.div key={booking.id} variants={fadeUp}
                        className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                        <div className={`w-1.5 h-14 rounded-full flex-shrink-0 ${booking.session_mode === "Virtual" ? "bg-primary" : "bg-accent"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">{booking.session_type}</p>
                          <p className="text-xs text-muted-foreground">with {booking.provider_name}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-medium text-foreground">
                            {format(parseISO(booking.session_date), "MMM d, yyyy")}
                          </p>
                          <div className="flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{booking.session_time}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => { setRescheduleBooking(booking); setRescheduleDate(parseISO(booking.session_date)); setRescheduleTime(booking.session_time); }}
                            title="Reschedule">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setCancelBooking(booking)}
                            title="Cancel">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Sessions are managed through our <Link to="/mental-health" className="text-primary hover:underline">Mental Health portal</Link>
                </p>
              </motion.div>

              {/* Wellness & Suggestions Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Wellness — Mood Tracker */}
                <motion.div variants={fadeUp} className="bg-card rounded-2xl p-6 shadow-card border border-border">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                      <Star className="w-5 h-5 text-accent" /> Your Wellness Journey
                    </h2>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/mood-tracker">Open Tracker <ChevronRight className="w-4 h-4 ml-1" /></Link>
                    </Button>
                  </div>
                  <div className="space-y-5">
                    {wellnessTips.map((tip, i) => (
                      <Link to={tip.path} key={i} className="space-y-2 block hover:opacity-80 transition-opacity">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <tip.icon className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground">{tip.title}</p>
                            <p className="text-xs text-muted-foreground">{tip.desc}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>

                {/* Explore & Suggestions */}
                <motion.div variants={fadeUp} className="bg-card rounded-2xl p-6 shadow-card border border-border">
                  <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2 mb-5">
                    <BookOpen className="w-5 h-5 text-primary" /> Recommended For You
                  </h2>
                  <div className="space-y-3">
                    <Link to="/news" className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><BookOpen className="w-5 h-5 text-primary" /></div>
                      <div className="flex-1"><p className="font-medium text-sm text-foreground">Latest Articles</p><p className="text-xs text-muted-foreground">New insights on mental wellness</p></div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                    <Link to="/events" className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><Calendar className="w-5 h-5 text-accent" /></div>
                      <div className="flex-1"><p className="font-medium text-sm text-foreground">Upcoming Events</p><p className="text-xs text-muted-foreground">Workshops, seminars & community</p></div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                    <Link to="/shop" className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-primary" /></div>
                      <div className="flex-1"><p className="font-medium text-sm text-foreground">Merch Store</p><p className="text-xs text-muted-foreground">Support the cause with branded gear</p></div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                    <Link to="/become-volunteer" className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><Heart className="w-5 h-5 text-accent" /></div>
                      <div className="flex-1"><p className="font-medium text-sm text-foreground">Volunteer</p><p className="text-xs text-muted-foreground">Make an impact in your community</p></div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  </div>
                </motion.div>
              </div>

            </motion.div>
          </div>
        </section>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={!!cancelBooking} onOpenChange={() => setCancelBooking(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" /> Cancel Session
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your <strong>{cancelBooking?.session_type}</strong> session
              with <strong>{cancelBooking?.provider_name}</strong> on{" "}
              <strong>{cancelBooking ? format(parseISO(cancelBooking.session_date), "MMM d, yyyy") : ""}</strong> at{" "}
              <strong>{cancelBooking?.session_time}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCancelBooking(null)} disabled={actionLoading}>
              Keep Session
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Trash2 className="w-4 h-4 mr-1" />}
              Cancel Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={!!rescheduleBooking} onOpenChange={() => { setRescheduleBooking(null); setRescheduleDate(undefined); setRescheduleTime(""); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" /> Reschedule Session
            </DialogTitle>
            <DialogDescription>
              Choose a new date and time for your <strong>{rescheduleBooking?.session_type}</strong> session
              with <strong>{rescheduleBooking?.provider_name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">New Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !rescheduleDate && "text-muted-foreground")}>
                    <Calendar className="w-4 h-4 mr-2" />
                    {rescheduleDate ? format(rescheduleDate, "MMM d, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker mode="single" selected={rescheduleDate} onSelect={setRescheduleDate}
                    disabled={(date) => date < addDays(new Date(), 1)}
                    initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">New Time</label>
              <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setRescheduleBooking(null); setRescheduleDate(undefined); setRescheduleTime(""); }} disabled={actionLoading}>
              Cancel
            </Button>
            <Button onClick={handleRescheduleBooking} disabled={actionLoading || !rescheduleDate || !rescheduleTime}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
    );
  }

  return (
    <div>
      <PageHero title={isSignUp ? "Create Account" : "Log In"} subtitle="Access your profile and manage your activities" bgImage={aboutBg} />

      <section className="section-padding">
        <div className="container mx-auto">
          <div className="max-w-md mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-8 shadow-card">

              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6">
                <Button onClick={() => handleOAuth("google")} variant="outline" className="w-full" disabled={loading}>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </Button>
                <Button onClick={() => handleOAuth("apple")} variant="outline" className="w-full" disabled={loading}>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  Continue with Apple
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with email</span></div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-5">
                <div className="text-center mb-4">
                  <h2 className="font-heading text-2xl font-bold text-foreground">{isSignUp ? "Sign Up" : "Sign In"}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isSignUp ? "Create your free account" : "Welcome back to World Changers"}
                  </p>
                </div>

                {isSignUp && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="John Doe" className="pl-10" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="you@example.com" className="pl-10" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="password" placeholder="••••••••" className="pl-10" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{isSignUp ? "Create Account" : "Sign In"} <LogOut className="w-4 h-4 ml-2" /></>}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium hover:underline">
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
