import { useSiteCopy } from "@/i18n/useSiteCopy";
import SEO from "@/components/SEO";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Loader2, Heart, Truck, Shield, RotateCcw, Star, ChevronDown } from "lucide-react";
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

const CATEGORIES = [
  { label: "All", query: "" },
  { label: "T-Shirts", query: "product_type:T-Shirts OR title:Tee OR title:T-Shirt" },
  { label: "Journals", query: "product_type:Journals OR title:Journal" },
  { label: "Workbooks", query: "product_type:Workbooks OR title:Workbook" },
  { label: "Affirmation Cards", query: "product_type:Affirmation Cards OR title:Affirmation" },
  { label: "Mugs", query: "product_type:Mugs OR title:Mug" },
  { label: "Stickers", query: "product_type:Stickers OR title:Sticker" },
  { label: "Wristbands", query: "product_type:Wristbands OR title:Wristband" },
  { label: "Keychains", query: "product_type:Keychains OR title:Keychain" },
  { label: "Books", query: "product_type:Books OR title:Book" },
  { label: "Caps", query: "product_type:Caps OR title:Cap OR title:Beanie" },
  { label: "Tote Bags", query: "product_type:Tote Bags OR title:Tote" },
  { label: "Puzzles", query: "product_type:Puzzles OR title:Puzzle" },
  { label: "Candles", query: "product_type:Candles OR title:Candle" },
  { label: "Phone Cases", query: "product_type:Phone Cases OR title:Phone Case" },
  { label: "Posters", query: "product_type:Posters OR title:Wall Art OR title:Poster" },
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
        if (category?.query) variables.query = category.query;
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

  return (
    <div className="bg-background min-h-screen">
      <SEO title={tx("Shop — Branded Apparel & Merch — World Changers MHCO")} description={tx("Buy World Changers branded clothing and accessories. Every purchase supports our mental health and outreach work.")} path="/shop" />
      {/* Slim Hero Banner */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img src={philanthropyBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary-foreground">{t("shop.heroTitle")}</h1>
          <p className="text-sm text-primary-foreground/80 mt-1">{t("shop.heroSubtitle")}</p>
        </div>
      </div>

      {/* Trust Bar + Currency */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-3 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-primary" /> {t("shop.charityLabel")}</span>
            <span className="hidden sm:flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-primary" /> {t("shop.freeShipping")}</span>
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

      {/* Category Filter - horizontal scroll */}
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

      {/* Product Grid */}
      <div className="container mx-auto px-2 sm:px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t("shop.noProducts")} "{tx(activeCategory)}"</p>
            <p className="text-xs text-muted-foreground mt-1">{t("shop.checkBackSoon")}</p>
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
                            ? "text-yellow-500 fill-yellow-500"
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