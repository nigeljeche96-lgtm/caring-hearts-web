import { Star, ExternalLink, PenLine } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import { Button } from "@/components/ui/button";

const REVIEW_URL = "https://g.page/r/CZQIn00x3aOtEAE/review";
const PROFILE_URL = "https://share.google/qNeeHdHEdPD4KbnDG";

const GoogleLogo = () => (
  <svg viewBox="0 0 48 48" className="w-7 h-7" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const GoogleReviews = () => {
  const tx = useSiteCopy();
  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-card border border-border rounded-2xl shadow-card p-6 sm:p-10 text-center">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-foreground mb-4">{tx("What Our Community Says")}</h2>
          <div className="flex items-center justify-center gap-3 mb-3">
            <GoogleLogo />
            <span className="font-heading text-lg font-semibold text-foreground">{tx("Google Reviews")}</span>
          </div>
          <div className="flex justify-center gap-1 mb-4" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-6 h-6 fill-accent text-accent" />)}
          </div>
          <p className="text-muted-foreground mb-6">{tx("Read what people say about us on Google, or share your own experience with World Changers.")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-2" />{tx("Read our Google reviews")}</a>
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
