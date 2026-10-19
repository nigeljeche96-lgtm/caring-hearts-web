import { useEffect, useState } from "react";
import { Star, ExternalLink, PenLine, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const REVIEW_URL = "https://g.page/r/CZQIn00x3aOtEAE/review";
const PROFILE_URL = "https://share.google/qNeeHdHEdPD4KbnDG";

type Review = { author: string; authorUri: string | null; photo: string | null; rating: number; text: string; when: string };
type Data = { rating: number | null; total: number; mapsUri: string | null; reviews: Review[] };

const GoogleLogo = () => (
  <svg viewBox="0 0 48 48" className="w-7 h-7" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const Stars = ({ n, size = "w-5 h-5" }: { n: number; size?: string }) => (
  <div className="flex gap-0.5" aria-label={`${n} / 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`${size} ${i < Math.round(n) ? "fill-accent text-accent" : "text-muted-foreground/40"}`} />
    ))}
  </div>
);

const GoogleReviews = () => {
  const tx = useSiteCopy();
  const [data, setData] = useState<Data | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    supabase.functions.invoke("google-reviews").then(({ data, error }) => {
      if (!error && data && Array.isArray(data.reviews)) setData(data as Data);
    });
  }, []);

  const reviews = data?.reviews ?? [];
  useEffect(() => {
    if (reviews.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % reviews.length), 7000);
    return () => clearInterval(t);
  }, [reviews.length]);

  const r = reviews[idx];
  const go = (d: number) => setIdx((i) => (i + d + reviews.length) % reviews.length);

  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-card border border-border rounded-2xl shadow-card p-6 sm:p-10 text-center">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-foreground mb-4">{tx("What Our Community Says")}</h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <GoogleLogo />
            <span className="font-heading text-lg font-semibold text-foreground">{tx("Google Reviews")}</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-6">
            {data?.rating != null && <span className="font-heading text-2xl font-bold text-foreground">{data.rating.toFixed(1)}</span>}
            <Stars n={data?.rating ?? 5} size="w-6 h-6" />
            {data?.total ? <span className="text-sm text-muted-foreground">({data.total})</span> : null}
          </div>

          {r ? (
            <div className="relative mb-6">
              <AnimatePresence mode="wait">
                <motion.figure key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="bg-muted/40 rounded-xl p-5 sm:p-6 text-left min-h-[180px]">
                  <div className="flex items-center gap-3 mb-3">
                    {r.photo ? <img src={r.photo} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full" loading="lazy" />
                      : <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{r.author[0]}</div>}
                    <div>
                      {r.authorUri ? <a href={r.authorUri} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline">{r.author}</a>
                        : <span className="font-semibold text-foreground">{r.author}</span>}
                      <div className="flex items-center gap-2"><Stars n={r.rating} size="w-4 h-4" /><span className="text-xs text-muted-foreground">{r.when}</span></div>
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground line-clamp-6">{r.text}</blockquote>
                </motion.figure>
              </AnimatePresence>
              {reviews.length > 1 && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  <Button size="icon" variant="outline" onClick={() => go(-1)} aria-label="Previous review"><ChevronLeft className="w-4 h-4" /></Button>
                  <div className="flex gap-1.5">
                    {reviews.map((_, i) => (
                      <button key={i} onClick={() => setIdx(i)} aria-label={`Review ${i + 1}`}
                        className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-2 bg-border"}`} />
                    ))}
                  </div>
                  <Button size="icon" variant="outline" onClick={() => go(1)} aria-label="Next review"><ChevronRight className="w-4 h-4" /></Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground mb-6">{tx("Read what people say about us on Google, or share your own experience with World Changers.")}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <a href={data?.mapsUri ?? PROFILE_URL} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-2" />{tx("Read our Google reviews")}</a>
            </Button>
            <Button asChild variant="outline" className="border-primary text-primary">
              <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer"><PenLine className="w-4 h-4 mr-2" />{tx("Write a review")}</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GoogleReviews;
