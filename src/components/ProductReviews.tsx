import { useSiteCopy } from "@/i18n/useSiteCopy";
import { useState, useEffect } from "react";
import { Star, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Review {
  id: string;
  product_handle: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ProductReviewsProps {
  productHandle: string;
}

const StarRating = ({
  rating,
  onRate,
  interactive = false,
  size = "w-5 h-5",
}: {
  rating: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
  size?: string;
}) => {
  const tx = useSiteCopy();
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`${size} transition-colors ${
              star <= (hovered || rating)
                ? "text-primary fill-primary"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const ProductReviews = ({ productHandle }: ProductReviewsProps) => {
  const tx = useSiteCopy();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_handle", productHandle)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productHandle]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length > 100) {
      toast.error(tx("Please enter a valid name (max 100 characters)"));
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error(tx("Please select a rating"));
      return;
    }
    if (!comment.trim() || comment.trim().length > 1000) {
      toast.error(tx("Please enter a comment (max 1000 characters)"));
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("product_reviews").insert({
        product_handle: productHandle,
        reviewer_name: name.trim(),
        rating,
        comment: comment.trim(),
      });

      if (error) throw error;

      toast.success(tx("Review submitted!"), {
        description: "Thank you for your feedback",
      });
      setName("");
      setRating(0);
      setComment("");
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(tx("Failed to submit review. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-16 flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-16"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground"> {tx("Customer Reviews")} </h2>
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">
              {reviews.length === 0
                ? tx("No reviews yet")
                : `${avgRating.toFixed(1)} out of 5 (${reviews.length} review${reviews.length !== 1 ? "s" : ""})`}
            </span>
          </div>
        </div>
        <Button
          variant={showForm ? "outline" : "default"}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? tx("Cancel") : tx("Write a Review")}
        </Button>
      </div>

      {/* Review Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block"> {tx("Your Name")} </label>
            <Input
              placeholder={tx("Enter your name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block"> {tx("Rating")} </label>
            <StarRating
              rating={rating}
              onRate={setRating}
              interactive
              size="w-7 h-7"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block"> {tx("Your Review")} </label>
            <Textarea
              placeholder={tx("Share your experience with this product...")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}{tx("/1000 characters")} </p>
          </div>
          <Button type="submit" disabled={submitting || rating === 0}>
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )} {tx("Submit Review")} </Button>
        </motion.form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-muted/30 border border-border rounded-xl p-8 text-center">
          <Star className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium"> {tx("Be the first to review this product")} </p>
          <p className="text-sm text-muted-foreground mt-1"> {tx("Share your experience with others")} </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {review.reviewer_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} size="w-4 h-4" />
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProductReviews;
