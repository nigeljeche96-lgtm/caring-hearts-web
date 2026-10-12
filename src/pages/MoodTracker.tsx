import { useSiteCopy } from "@/i18n/useSiteCopy";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Smile, Meh, Frown, CloudRain, Sun, Loader2, ArrowLeft, TrendingUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import PageHero from "@/components/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format, subDays, parseISO } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import aboutBg from "@/assets/about-bg.jpg";

const moodOptions = [
  { value: 1, label: "Awful", icon: CloudRain, color: "text-destructive", bg: "bg-destructive/10", ring: "ring-destructive/30" },
  { value: 2, label: "Bad", icon: Frown, color: "text-accent", bg: "bg-accent/10", ring: "ring-accent/30" },
  { value: 3, label: "Okay", icon: Meh, color: "text-muted-foreground", bg: "bg-muted", ring: "ring-border" },
  { value: 4, label: "Good", icon: Smile, color: "text-primary", bg: "bg-primary/10", ring: "ring-primary/30" },
  { value: 5, label: "Great", icon: Sun, color: "text-accent", bg: "bg-accent/10", ring: "ring-accent/30" },
];

interface MoodEntry {
  id: string;
  mood: number;
  note: string | null;
  entry_date: string;
  created_at: string;
}

const MoodTracker = () => {
  const tx = useSiteCopy();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [todayLogged, setTodayLogged] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
    const { data } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("entry_date", thirtyDaysAgo)
      .order("entry_date", { ascending: true });
    const moodData = (data as MoodEntry[]) || [];
    setEntries(moodData);
    setTodayLogged(moodData.some((e) => e.entry_date === today));
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user || selectedMood === null) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("mood_entries").insert({
        user_id: user.id,
        mood: selectedMood,
        note: note.trim() || null,
        entry_date: today,
      });
      if (error) throw error;
      toast.success(tx("Mood logged!"));
      setSelectedMood(null);
      setNote("");
      await fetchEntries();
    } catch (err: any) {
      toast.error(err.message || "Failed to log mood");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("mood_entries").delete().eq("id", id);
    if (error) toast.error(tx("Failed to delete"));
    else {
      toast.success(tx("Entry removed"));
      await fetchEntries();
    }
  };

  // Chart data
  const chartData = entries.map((e) => ({
    date: format(parseISO(e.entry_date), "MMM d"),
    mood: e.mood,
    label: moodOptions.find((m) => m.value === e.mood)?.label || "",
  }));

  const avgMood = entries.length > 0 ? (entries.reduce((s, e) => s + e.mood, 0) / entries.length).toFixed(1) : "—";
  const streak = (() => {
    let count = 0;
    for (let i = 0; i < 30; i++) {
      const d = format(subDays(new Date(), i), "yyyy-MM-dd");
      if (entries.some((e) => e.entry_date === d)) count++;
      else break;
    }
    return count;
  })();

  if (!user) return null;

  return (
    <div>
      <PageHero title={tx("Mood Tracker")} subtitle={tx("Log your daily mood and discover patterns in your wellbeing")} bgImage={aboutBg} />

      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> {tx("Back to Dashboard")} </Button>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-5 shadow-card border border-border text-center">
                  <p className="text-3xl font-bold text-primary">{avgMood}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tx("Avg Mood (30d)")}</p>
                </div>
                <div className="bg-card rounded-xl p-5 shadow-card border border-border text-center">
                  <p className="text-3xl font-bold text-accent">{streak}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tx("Day Streak")}</p>
                </div>
                <div className="bg-card rounded-xl p-5 shadow-card border border-border text-center">
                  <p className="text-3xl font-bold text-foreground">{entries.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tx("Total Entries")}</p>
                </div>
              </div>

              {/* Log Today */}
              {!todayLogged ? (
                <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
                  <h2 className="font-heading text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" /> {tx("How are you feeling today?")} </h2>
                  <p className="text-sm text-muted-foreground mb-5">{tx("Select your mood and optionally add a note")}</p>

                  <div className="flex justify-center gap-3 mb-5">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setSelectedMood(mood.value)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ring-2 ${
                          selectedMood === mood.value
                            ? `${mood.bg} ${mood.ring} scale-110`
                            : "ring-transparent hover:ring-border"
                        }`}
                      >
                        <mood.icon className={`w-8 h-8 ${mood.color}`} />
                        <span className={`text-xs font-medium ${selectedMood === mood.value ? mood.color : "text-muted-foreground"}`}>
                          {tx(mood.label)}
                        </span>
                      </button>
                    ))}
                  </div>

                  <Textarea
                    placeholder={tx("What's on your mind? (optional)")}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className="mb-4"
                    maxLength={500}
                  />

                  <Button
                    onClick={handleSubmit}
                    disabled={selectedMood === null || submitting}
                    className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} {tx("Log Mood")} </Button>
                </div>
              ) : (
                <div className="bg-card rounded-2xl p-6 shadow-card border border-border text-center">
                  <Sun className="w-10 h-10 text-accent mx-auto mb-2" />
                  <p className="font-heading font-bold text-foreground">{tx("Today's mood logged!")}</p>
                  <p className="text-sm text-muted-foreground">{tx("Come back tomorrow to keep your streak going")}</p>
                </div>
              )}

              {/* Trend Chart */}
              {chartData.length > 1 && (
                <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
                  <h2 className="font-heading text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" /> {tx("Mood Trend (Last 30 Days)")} </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                          tickFormatter={(v) => moodOptions.find((m) => m.value === v)?.label || ""} width={50} />
                        <Tooltip
                          contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 13 }}
                          formatter={(value: number) => [moodOptions.find((m) => m.value === value)?.label || value, "Mood"]}
                        />
                        <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Recent Entries */}
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
                <h2 className="font-heading text-lg font-bold text-foreground mb-5">{tx("Recent Entries")}</h2>
                {entries.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">{tx("No mood entries yet. Start logging above!")}</p>
                ) : (
                  <div className="space-y-3">
                    {[...entries].reverse().slice(0, 10).map((entry) => {
                      const mood = moodOptions.find((m) => m.value === entry.mood)!;
                      return (
                        <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                          <div className={`w-10 h-10 rounded-lg ${mood.bg} flex items-center justify-center flex-shrink-0`}>
                            <mood.icon className={`w-5 h-5 ${mood.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm text-foreground">{tx(mood.label)}</p>
                              <Badge variant="secondary" className="text-xs">
                                {format(parseISO(entry.entry_date), "MMM d")}
                              </Badge>
                            </div>
                            {entry.note && <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry.note}</p>}
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => handleDelete(entry.id)}>
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MoodTracker;
