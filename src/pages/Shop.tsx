import { useSiteCopy } from "@/i18n/useSiteCopy";
import SEO from "@/components/SEO";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Loader2, Heart, Truck, Shield, RotateCcw, Star, ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";
import { useTranslation } from "react-i18next";
import philanthropyBg from "@/assets/philanthropy-bg.jpg";

/** Shows merchandise and eBooks. eBooks = Shopify product type "eBook"; eBook categories match Shopify tags. */
const EBOOK_QUERY = "product_type:eBook";
const CATEGORIES = [
  { label: "All", query: "" },
  { label: "eBooks & Guides", query: EBOOK_QUERY },
  { label: "Merchandise & Apparel", query: `NOT ${EBOOK_QUERY}` },
  { label: "Children's Mental Wellness", query: "tag:childrens-mental-wellness" },
  { label: "Teen Mental Wellness", query: "tag:teen-mental-wellness" },
  { label: "Adult Mental Wellness", query: "tag:adult-mental-wellness" },
  { label: "Anxiety, Stress and Burnout", query: "tag:anxiety-stress-burnout" },
  { label: "Self-Esteem & Personal Growth", query: "tag:self-esteem-personal-growth" },
  { label: "Men's Mental Health", query: "tag:mens-mental-health" },
  { label: "Women's Mental Health", query: "tag:womens-mental-health" },
  { label: "Parents and Caregivers", query: "tag:parents-caregivers" },
  { label: "Relationships & Family", query: "tag:relationships-family" },
  { label: "Trauma, Grief and Healing", query: "tag:trauma-grief-healing" },
  { label: "Workbooks & Journals", query: "tag:workbooks-journals" },
  { label: "Schools & Community", query: "tag:schools-community" },
  { label: "Faith and Mental Wellness", query: "tag:faith-mental-wellness" },
  { label: "Free Resources", query: "tag:free-resources" },
];

const Shop = () => {
  const tx = useSiteCopy();
  const { t } = useTranslation();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [reviewStats, setReviewStats] = useState<Record<string, { avg: number; count: number }>>({});
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const navigate = useNavigate();
  const { selectedCurrency, currencies: currencyList, changeCurrency, formatPrice } = useCurrency();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const category = CATEGORIES.find(c => c.label === activeCategory);
        const variables: Record<string, unknown> = { first: 50 };
        const q = category?.query ?? "";
        if (q) variables.query = q.startsWith("tag:") ? `${EBOOK_QUERY} AND (${q})` : q;
        const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, variables);
        if (data?.data?.products?.edges) {
          setProducts(data.data.products.edges);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [activeCategory]);

  useEffect(() => {
    async function fetchReviewStats() {
      try {
        const { data, error } = await supabase
          .from("product_reviews")
          .select("product_handle, rating");
        if (error) throw error;
        const stats: Record<string, { avg: number; count: number }> = {};
        if (data) {
          for (const r of data) {
            if (!stats[r.product_handle]) stats[r.product_handle] = { avg: 0, count: 0 };
            stats[r.product_handle].count++;
            stats[r.product_handle].avg += r.rating;
          }
          for (const key in stats) {
            stats[key].avg = stats[key].avg / stats[key].count;
          }
        }
        setReviewStats(stats);
      } catch (error) {
        console.error("Failed to fetch review stats:", error);
      }
    }
    fetchReviewStats();
  }, []);

  const getSelectedVariant = (product: ShopifyProduct) => {
    const selectedId = selectedVariants[product.node.id];
    if (selectedId) {
      return product.node.variants.edges.find(v => v.node.id === selectedId)?.node;
    }
    return product.node.variants.edges[0]?.node;
  };

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = getSelectedVariant(product);
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(tx("Added to cart"), { description: `${product.node.title} - ${variant.title}` });
  };

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifyLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: notifyEmail.trim().toLowerCase() });
      if (error) {
        if (error.code === "23505") {
          setNotifyMsg(t("shop.notifyDuplicate"));
        } else {
          throw error;
        }
      } else {
        setNotifyMsg(t("shop.notifySuccess"));
      }
      setNotifyDone(true);
    } catch (err) {
      console.error(err);
      toast.error(tx("Failed to subscribe. Please try again."));
    } finally {
      setNotifyLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <SEO title={tx("Shop Merchandise & eBooks — World Changers MHCO")} description={tx("Shop World Changers merchandise and instant-download mental wellness eBooks, guides and workbooks.")} path="/shop" />
      {/* Slim Hero Banner */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img src={philanthropyBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          {isEmpty && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 text-primary-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-2">
              <Bell className="w-3.5 h-3.5" /> {t("shop.comingSoonBadge")}
            </span>
          )}
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary-foreground">{tx("Shop Merchandise & eBooks")}</h1>
          <p className="text-sm text-primary-foreground/80 mt-1">{isEmpty ? t("shop.comingSoonHeroNote") : tx("Wear the mission and grow with practical tools for healthier minds.")}</p>
        </div>
      </div>

      {/* Trust Bar + Currency */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-3 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-primary" /> {t("shop.charityLabel")}</span>
            <span className="hidden sm:flex items-center gap-1"><Download className="w-3.5 h-3.5 text-primary" /> {tx("eBooks: instant download, no shipping")}</span>
            <span className="hidden lg:flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-primary" /> {tx("Shipping on merchandise only")}</span>
            <span className="hidden md:flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-primary" /> {t("shop.secureCheckout")}</span>
            <span className="hidden md:flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5 text-primary" /> {t("shop.returns")}</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground hover:border-primary transition-colors"
            >
              {selectedCurrency.symbol} {selectedCurrency.code} <ChevronDown className="w-3 h-3" />
            </button>
            {currencyOpen && (
              <div className="absolute top-full mt-1 right-0 w-48 bg-card rounded-lg shadow-elevated border border-border py-1 z-50 max-h-64 overflow-y-auto">
                {currencyList.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => { changeCurrency(c); setCurrencyOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      selectedCurrency.code === c.code ? "text-primary bg-primary/10 font-medium" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {c.symbol} {tx(c.label)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Cart */}
      <div className="fixed bottom-6 right-6 z-40">
        <CartDrawer />
      </div>

      {/* Category Filter - horizontal scroll (hidden while the shop is still empty) */}
      {!isEmpty && (
      <div className="border-b border-border bg-background sticky top-0 z-30">
        <div className="container mx-auto px-2 py-2 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`px-3 py-1.5 text-xs rounded-full border whitespace-nowrap transition-colors font-medium ${
                  activeCategory === cat.label
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {tx(cat.label)}
              </button>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Product Grid */}
      <div className="container mx-auto px-2 sm:px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="max-w-3xl mx-auto py-10 sm:py-14">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 text-center shadow-card">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                <Bell className="w-3.5 h-3.5" /> {t("shop.comingSoonBadge")}
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mt-4">{t("shop.comingSoonTitle")}</h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">{t("shop.comingSoonBody")}</p>

              <div className="grid sm:grid-cols-2 gap-3 mt-6 text-left">
                <div className="flex gap-3 rounded-xl border border-border bg-background p-4">
                  <BookOpen className="w-5 h-5 shrink-0 text-primary" />
                  <p className="text-sm text-foreground">{t("shop.comingSoonEbooks")}</p>
                </div>
                <div className="flex gap-3 rounded-xl border border-border bg-background p-4">
                  <Package className="w-5 h-5 shrink-0 text-primary" />
                  <p className="text-sm text-foreground">{t("shop.comingSoonMerch")}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground mt-5">{t("shop.comingSoonFunds")}</p>

              <div className="mt-8 border-t border-border pt-6">
                <h3 className="font-heading text-base font-semibold text-foreground">{t("shop.notifyTitle")}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("shop.notifyDesc")}</p>
                {notifyDone ? (
                  <p className="mt-4 inline-flex items-center gap-2 text-sm text-primary">
                    <CheckCircle2 className="w-4 h-4" /> {notifyMsg}
                  </p>
                ) : (
                  <form onSubmit={handleNotify} className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <input
                      type="email"
                      required
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder={t("shop.notifyPlaceholder")}
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <Button
                      type="submit"
                      disabled={notifyLoading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {notifyLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <><Bell className="w-4 h-4 mr-1.5" /> {t("shop.notifyButton")}</>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">{t("shop.comingSoonNote")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
            {products.map((p, i) => {
              const variant = getSelectedVariant(p);
              const image = p.node.images.edges[0]?.node;
              const stats = reviewStats[p.node.handle];
              return (
                <motion.div
                  key={p.node.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-card rounded-lg overflow-hidden border border-border group hover:shadow-card transition-shadow"
                >
                  {/* Product Image */}
                  <div
                    className="aspect-square bg-muted overflow-hidden cursor-pointer relative"
                    onClick={() => navigate(`/product/${p.node.handle}`)}
                  >
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || p.node.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-muted-foreground/20" />
                      </div>
                    )}
                    {p.node.productType?.toLowerCase() === "ebook" && (
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                        <Download className="w-3 h-3" /> {tx("Instant download")}
                      </div>
                    )}
                    {/* Multiple images indicator */}
                    {p.node.images.edges.length > 1 && (
                      <div className="absolute bottom-1.5 right-1.5 bg-foreground/60 text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full">
                        {p.node.images.edges.length} {tx("imgs")} </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-2 sm:p-3">
                    <h3
                      className="text-xs sm:text-sm font-medium text-foreground leading-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/product/${p.node.handle}`)}
                    >
                      {tx(p.node.title)}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-2.5 h-2.5 ${
                          stats && star <= Math.round(stats.avg)
                            ? "text-primary fill-primary"
                            : "text-muted-foreground/20"
                        }`} />
                      ))}
                      {stats && <span className="text-[10px] text-muted-foreground ml-0.5">{stats.count}</span>}
                    </div>

                    {/* Size selector */}
                    {p.node.options.length > 0 && p.node.options[0].values.length > 1 && (
                      <div className="mt-1.5">
                        <div className="flex flex-wrap gap-0.5">
                          {p.node.variants.edges.slice(0, 5).map((v) => (
                            <button
                              key={v.node.id}
                              onClick={() => setSelectedVariants(prev => ({ ...prev, [p.node.id]: v.node.id }))}
                              className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors ${
                                (selectedVariants[p.node.id] === v.node.id || (!selectedVariants[p.node.id] && v.node.id === p.node.variants.edges[0]?.node.id))
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border text-muted-foreground hover:border-primary"
                              }`}
                            >
                              {tx(v.node.title)}
                            </button>
                          ))}
                          {p.node.variants.edges.length > 5 && (
                            <span className="text-[10px] text-muted-foreground self-center ml-0.5">+{p.node.variants.edges.length - 5}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Price + Add to Cart */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm sm:text-base font-bold text-primary">
                        {formatPrice(parseFloat(variant?.price.amount || "0"))}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(p)}
                        disabled={isLoading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-7 px-2 text-[10px] sm:text-xs"
                      >
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><ShoppingBag className="w-3 h-3 mr-0.5" /> {tx("Add")}</>}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;