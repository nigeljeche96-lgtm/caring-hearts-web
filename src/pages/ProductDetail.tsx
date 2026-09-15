import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { storefrontApiRequest, STOREFRONT_PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { toast } from "sonner";
import ProductReviews from "@/components/ProductReviews";

const ProductDetail = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle });
        if (data?.data?.productByHandle) {
          setProduct(data.data.productByHandle);
          setSelectedVariantId(data.data.productByHandle.variants.edges[0]?.node.id || null);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
        <p className="text-lg text-muted-foreground">Product not found</p>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  const selectedVariant = product.variants.edges.find((v: any) => v.node.id === selectedVariantId)?.node;
  const images = product.images.edges;
  const currentImage = images[selectedImageIndex]?.node;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: `${product.title} - ${selectedVariant.title}` });
  };

  const plainDescription: string = (product.description || `Shop ${product.title} from World Changers Mental Health Care Organisation. Every purchase supports mental health care and community outreach.`)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);
  const productPrice = selectedVariant?.price || product.priceRange?.minVariantPrice;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <SEO
        title={`${product.title} — World Changers MHCO Shop`}
        description={plainDescription}
        path={`/product/${handle}`}
        image={currentImage?.url}
        ogType="product"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: plainDescription,
          image: images.map((i: any) => i.node.url),
          brand: { "@type": "Brand", name: "World Changers Mental Health Care Organisation" },
          offers: productPrice
            ? {
                "@type": "Offer",
                price: productPrice.amount,
                priceCurrency: productPrice.currencyCode,
                availability: "https://schema.org/InStock",
                url: `https://worldchangersmh.org/product/${handle}`,
              }
            : undefined,
        }}
      />
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate('/shop')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Button>

        <div className="fixed bottom-6 right-6 z-40">
          <CartDrawer />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-muted rounded-xl overflow-hidden relative">
              {currentImage ? (
                <img src={currentImage.url} alt={currentImage.altText || product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-muted-foreground/20" />
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-foreground/50 text-primary-foreground rounded-full p-1.5 hover:bg-foreground/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-foreground/50 text-primary-foreground rounded-full p-1.5 hover:bg-foreground/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_: any, idx: number) => (
                      <button key={idx} onClick={() => setSelectedImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${idx === selectedImageIndex ? "bg-primary" : "bg-primary-foreground/50"}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {images.map((img: any, idx: number) => (
                  <button key={idx} onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${idx === selectedImageIndex ? "border-primary" : "border-transparent"}`}>
                    <img src={img.node.url} alt={img.node.altText || `View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1 className="font-heading text-3xl font-bold text-foreground">{product.title}</h1>
            <p className="text-muted-foreground mt-3 leading-relaxed">{product.description}</p>

            {/* Variant selector */}
            {product.options.length > 0 && product.options[0].values.length > 1 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-foreground mb-2">{product.options[0].name}</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((v: any) => (
                    <button
                      key={v.node.id}
                      onClick={() => setSelectedVariantId(v.node.id)}
                      className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                        selectedVariantId === v.node.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {v.node.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <span className="text-2xl font-bold text-primary">
                {selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount || "0").toFixed(2)}
              </span>
            </div>

            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={isLoading || !selectedVariant}
              className="mt-6 w-full md:w-auto"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Cart"}
            </Button>
          </div>
        </motion.div>

        {/* Reviews */}
        {handle && <ProductReviews productHandle={handle} />}
      </div>
    </div>
  );
};

export default ProductDetail;
