import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SEOHead from "../components/seo/SEOHead";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Package,
  Shield,
  Star,
  Truck,
  ZoomIn,
} from "lucide-react";
import {
  formatPriceRange,
  generateOrderMessage,
  generateWhatsAppUrl,
  getPrimaryImage,
  productsApi,
} from "../lib/api";
import { useTheme } from "../contexts/ThemeContext";
import type { Product, ProductVariation } from "../types";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254788873611";

const variationPrice = (variation: ProductVariation) =>
  Number(variation.effective_price || variation.discount_price || variation.price);

const formatVariationPrice = (variation: ProductVariation) =>
  `KES ${variationPrice(variation).toLocaleString("en-KE")}`;

const variationTitle = (variation: ProductVariation) =>
  variation.name || [variation.gauge && `Gauge ${variation.gauge}`, variation.size_label, variation.color]
    .filter(Boolean)
    .join(" · ") || "Standard option";

const variationSize = (variation: ProductVariation) =>
  variation.size_label || [variation.length && `${variation.length}m`, variation.width && `${variation.width}m wide`]
    .filter(Boolean)
    .join(" × ") || "Made to order";

// ─── Image Gallery ────────────────────────────────────────────────────────────
const ImageGallery: React.FC<{ product: Product }> = ({ product }) => {
  const allImages = [
    ...(product.images || []),
    ...(product.image_url && !product.images?.find((image) => image.image_url === product.image_url)
      ? [{ id: -1, product_id: product.id, image_url: product.image_url, is_primary: false, display_order: 99 }]
      : []),
  ];
  const fallback = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80";
  const images = allImages.length ? allImages : [{ id: -1, product_id: product.id, image_url: fallback, is_primary: true, display_order: 0 }];
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden bg-[#f0f3f9] aspect-[4/3] cursor-zoom-in" onClick={() => setZoomed(true)}>
        <img src={images[activeIndex]?.image_url || fallback} alt={product.name} className="w-full h-full object-cover" />
        <button type="button" className="absolute top-4 right-4 p-2 bg-white/80 rounded-xl text-[#0a1628] hover:bg-white" aria-label="Zoom image"><ZoomIn size={16} /></button>
        {images.length > 1 && <><button type="button" onClick={(event) => { event.stopPropagation(); setActiveIndex((index) => (index - 1 + images.length) % images.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-xl text-[#0a1628] hover:bg-white" aria-label="Previous image"><ChevronLeft size={18} /></button><button type="button" onClick={(event) => { event.stopPropagation(); setActiveIndex((index) => (index + 1) % images.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-xl text-[#0a1628] hover:bg-white" aria-label="Next image"><ChevronRight size={18} /></button></>}
        {images.length > 1 && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">{images.map((_, index) => <button type="button" key={index} onClick={(event) => { event.stopPropagation(); setActiveIndex(index); }} className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-white" : "bg-white/50"}`} aria-label={`Show image ${index + 1}`} />)}</div>}
      </div>
      {images.length > 1 && <div className="flex gap-3 overflow-x-auto pb-1">{images.map((image, index) => <button type="button" key={image.id} onClick={() => setActiveIndex(index)} className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${index === activeIndex ? "border-[#2952a3]" : "border-[#dde3f0] hover:border-[#2952a3]/50"}`}><img src={image.image_url} alt="" className="w-full h-full object-cover" /></button>)}</div>}
      {zoomed && <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setZoomed(false)}><img src={images[activeIndex]?.image_url || fallback} alt={product.name} className="max-w-full max-h-full object-contain rounded-xl" /><button type="button" className="absolute top-4 right-4 text-white text-2xl font-bold" onClick={() => setZoomed(false)} aria-label="Close image">×</button></div>}
    </div>
  );
};

// ─── Variation Comparison ─────────────────────────────────────────────────────
const VariationComparison: React.FC<{
  variations: ProductVariation[];
  selectedVariation: ProductVariation | null;
  onSelect: (variationId: number) => void;
}> = ({ variations, selectedVariation, onSelect }) => {
  if (!variations.length) return null;

  return (
    <section className="mb-6 rounded-2xl border border-[#cfdaf0] overflow-hidden bg-white shadow-sm">
      <div className="px-5 py-4 bg-[#f4f7fc] border-b border-[#dce5f6]">
        <h2 className="font-black text-[#0a1628]">Available Options</h2>
        <p className="text-xs text-[#6b7a9e] mt-1">Compare gauge, size, and price, then select the option you want quoted.</p>
      </div>
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#eef2f8] text-left text-xs uppercase tracking-wide text-[#6b7a9e]"><th className="px-4 py-3 font-semibold">Option</th><th className="px-4 py-3 font-semibold">Size / Details</th><th className="px-4 py-3 font-semibold">Price</th><th className="px-4 py-3 font-semibold">Unit</th><th className="px-4 py-3"><span className="sr-only">Select</span></th></tr></thead>
          <tbody className="divide-y divide-[#eef2f8]">{variations.map((variation) => {
            const selected = selectedVariation?.id === variation.id;
            const details = Object.entries(variation.specifications || {}).slice(0, 2);
            return <tr key={variation.id} className={selected ? "bg-[#eef4ff]" : "hover:bg-[#fafcff]"}><td className="px-4 py-4"><div className="font-bold text-[#0a1628]">{variationTitle(variation)}</div>{variation.sku && <div className="text-xs text-[#6b7a9e] mt-0.5">Code: {variation.sku}</div>}</td><td className="px-4 py-4 text-[#3d4663]"><div>{variationSize(variation)}</div>{details.length > 0 && <div className="text-xs text-[#6b7a9e] mt-1">{details.map(([key, value]) => `${key}: ${value}`).join(" · ")}</div>}</td><td className="px-4 py-4"><div className="font-black text-[#0a1628]">{formatVariationPrice(variation)}</div>{variation.discount_price && <div className="text-xs text-emerald-700 font-semibold">Special price</div>}</td><td className="px-4 py-4 text-[#3d4663]">Per {variation.unit}</td><td className="px-4 py-4 text-right"><button type="button" onClick={() => onSelect(variation.id)} className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold ${selected ? "bg-[#2952a3] text-white" : "border border-[#b8c7e6] text-[#2952a3] hover:bg-[#eef4ff]"}`}>{selected && <Check size={13} />}{selected ? "Selected" : "Select"}</button></td></tr>;
          })}</tbody>
        </table>
      </div>
      <div className="sm:hidden divide-y divide-[#eef2f8]">{variations.map((variation) => {
        const selected = selectedVariation?.id === variation.id;
        return <button type="button" key={variation.id} onClick={() => onSelect(variation.id)} className={`block w-full p-4 text-left ${selected ? "bg-[#eef4ff] ring-1 ring-inset ring-[#2952a3]" : "bg-white"}`}><div className="flex justify-between gap-3"><div><div className="font-bold text-[#0a1628]">{variationTitle(variation)}</div><div className="text-xs text-[#6b7a9e] mt-1">{variationSize(variation)} · Per {variation.unit}</div></div><div className="text-right"><div className="font-black text-[#0a1628]">{formatVariationPrice(variation)}</div><div className="mt-1 text-xs font-semibold text-[#2952a3]">{selected ? "Selected" : "Tap to select"}</div></div></div></button>;
      })}</div>
    </section>
  );
};

// ─── WhatsApp Quote Form ──────────────────────────────────────────────────────
const WhatsAppOrderForm: React.FC<{ product: Product; selectedVariation: ProductVariation | null }> = ({ product, selectedVariation }) => {
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("");
  const [legacyGauge, setLegacyGauge] = useState(product.gauge || "");
  const [legacyColor, setLegacyColor] = useState(product.color || "");

  const message = generateOrderMessage(
    product.name,
    selectedVariation?.gauge || legacyGauge,
    selectedVariation?.color || legacyColor,
    quantity,
    location,
    selectedVariation ? {
      label: variationTitle(selectedVariation),
      sizeLabel: variationSize(selectedVariation),
      unit: selectedVariation.unit,
      price: variationPrice(selectedVariation),
      specifications: selectedVariation.specifications,
    } : undefined,
  );

  return (
    <div className="bg-[#f8fafc] rounded-2xl border border-[#dde3f0] p-6">
      <h3 className="font-bold text-[#0a1628] mb-1 flex items-center gap-2"><MessageCircle size={18} className="text-[#25D366]" />Request a Quote via WhatsApp</h3>
      <p className="text-xs text-[#6b7a9e] mb-4">Your selected option and its displayed price will be included in the request.</p>
      {selectedVariation ? <div className="mb-4 p-3 rounded-xl bg-white border border-[#dce5f6]"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a9e]">Selected option</p><p className="font-bold text-[#0a1628] mt-1">{variationTitle(selectedVariation)}</p><p className="text-xs text-[#6b7a9e] mt-1">{variationSize(selectedVariation)} · Per {selectedVariation.unit}</p></div><p className="font-black text-[#2952a3] whitespace-nowrap">{formatVariationPrice(selectedVariation)}</p></div></div> : <div className="space-y-3 mb-4"><div><label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1 block">Gauge</label><input type="text" value={legacyGauge} onChange={(event) => setLegacyGauge(event.target.value)} placeholder="e.g. 28G, 30G" className="w-full px-3 py-2.5 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]" /></div><div><label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1 block">Color</label><input type="text" value={legacyColor} onChange={(event) => setLegacyColor(event.target.value)} placeholder="e.g. Charcoal, Red" className="w-full px-3 py-2.5 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]" /></div></div>}
      <div className="space-y-3 mb-5"><div><label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1 block">Quantity</label><input type="number" min={product.minimum_order_quantity || 1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="w-full px-3 py-2.5 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]" />{product.minimum_order_quantity > 1 && <p className="text-xs text-[#6b7a9e] mt-1">Minimum order: {product.minimum_order_quantity} {selectedVariation?.unit || product.unit || "pieces"}</p>}</div><div><label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1 block">Delivery Location</label><input type="text" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Nairobi, Kiambu" className="w-full px-3 py-2.5 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]" /></div></div>
      <a href={generateWhatsAppUrl(WHATSAPP, message)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1da851] text-base"><MessageCircle size={18} />Send Inquiry on WhatsApp</a>
    </div>
  );
};

const RelatedProducts: React.FC<{ productId: number }> = ({ productId }) => {
  const { data: related } = useQuery({ queryKey: ["products", productId, "related"], queryFn: () => productsApi.related(productId, 4) });
  if (!related?.length) return null;
  return <section className="mt-16 pt-12 border-t border-[#dde3f0]"><h2 className="text-2xl font-black text-[#0a1628] mb-8">Similar Products</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{related.map((item) => <Link key={item.id} to={`/products/${item.slug || item.id}`} className="bg-white rounded-2xl border border-[#dde3f0] overflow-hidden hover:shadow-lg hover:border-[#2952a3]/20 transition-all group"><div className="h-40 overflow-hidden bg-[#f0f3f9]"><img src={getPrimaryImage(item)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div><div className="p-4"><h3 className="font-bold text-[#0a1628] text-sm mb-1 line-clamp-2 group-hover:text-[#2952a3]">{item.name}</h3><div className="text-sm font-black text-[#2952a3]">{formatPriceRange(item)}</div></div></Link>)}</div></section>;
};

const ProductDetailPage: React.FC = () => {
  useTheme();
  const { id } = useParams<{ id: string }>();
  const [selectedVariationId, setSelectedVariationId] = useState<number | null>(null);
  const numericId = id ? /^\d+$/.test(id) : false;
  const { data: product, isLoading, error } = useQuery({ queryKey: ["product", id], queryFn: () => { if (!id) throw new Error("No product identifier provided"); return numericId ? productsApi.get(Number(id)) : productsApi.getBySlug(id); }, enabled: Boolean(id), retry: 1 });

  if (isLoading) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><div className="text-center"><div className="w-12 h-12 border-4 border-[#2952a3] border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-[#6b7a9e]">Loading product...</p></div></div>;
  if (error || !product) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><div className="text-center"><Package size={48} className="text-[#dde3f0] mx-auto mb-4" /><h2 className="text-xl font-bold text-[#0a1628] mb-2">Product Not Found</h2><Link to="/products" className="text-[#2952a3] text-sm hover:underline">Back to Products</Link></div></div>;

  const availableVariations = (product.variations || []).filter((variation) => variation.is_active && variation.is_available);
  const selectedVariation = availableVariations.find((variation) => variation.id === selectedVariationId) || availableVariations[0] || null;
  const stockStatus = product.stock_quantity === 0 ? { label: "Out of Stock", color: "text-red-600 bg-red-50" } : product.stock_quantity <= product.low_stock_threshold ? { label: "Low Stock", color: "text-amber-600 bg-amber-50" } : { label: "In Stock", color: "text-emerald-600 bg-emerald-50" };
  const productSpecs = [
    { label: "Brand", value: product.brand }, { label: "Type", value: product.product_type }, { label: "Material", value: product.material }, { label: "Finish", value: product.finish }, { label: "Profile", value: product.profile },
    { label: "Gauge", value: availableVariations.length ? undefined : product.gauge }, { label: "Length", value: availableVariations.length ? undefined : product.length ? `${product.length}m` : undefined }, { label: "Width", value: availableVariations.length ? undefined : product.width ? `${product.width}m` : undefined }, { label: "Color", value: availableVariations.length ? undefined : product.color }, { label: "Unit", value: availableVariations.length ? undefined : product.unit }, { label: "Min. Order", value: product.minimum_order_quantity > 1 ? `${product.minimum_order_quantity} ${product.unit || "pcs"}` : undefined },
  ].filter((item) => item.value);

  const canonicalUrl = `/products/${product.slug || product.id}`;
  const ogImage = getPrimaryImage(product);

  // Build Product JSON-LD structured data
  const productJsonLd = {
    "@type": "Product",
    "name": product.name,
    "description": product.description || `${product.name} - Premium roofing material from MRM Mabati Rolling Mills`,
    "brand": { "@type": "Brand", "name": product.brand || "MRM Mabati Rolling Mills" },
    "category": product.category?.name || "Roofing Materials",
    "image": ogImage,
    "sku": selectedVariation?.sku || product.variations?.[0]?.sku || undefined,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "KES",
      "price": String(Number(product.price_from || 0)),
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://mrmkenya.online/products/${product.slug || product.id}`,
      "seller": {
        "@type": "Organization",
        "name": "MRM Mabati Rolling Mills",
      },
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "200",
    },
  };

  return <div className="min-h-screen bg-[#f8fafc]"><SEOHead title={product.name} description={product.description || `Buy ${product.name} — Premium roofing material from Kenya's leading supplier. Price from KES ${Number(product.price_from || 0).toLocaleString()}. Get a free quote today.`} canonicalUrl={canonicalUrl} ogImage={ogImage} ogType="product" jsonLd={productJsonLd} /><div className="bg-white border-b border-[#dde3f0]"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"><div className="flex items-center gap-2 text-sm text-[#6b7a9e]"><Link to="/" className="hover:text-[#0a1628]">Home</Link><ChevronRight size={14} /><Link to="/products" className="hover:text-[#0a1628]">Products</Link><ChevronRight size={14} /><span className="text-[#0a1628] font-medium truncate max-w-xs">{product.name}</span></div></div></div><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"><Link to="/products" className="inline-flex items-center gap-2 text-[#6b7a9e] hover:text-[#0a1628] text-sm mb-8"><ArrowLeft size={16} />Back to Products</Link><div className="grid grid-cols-1 lg:grid-cols-2 gap-12"><ImageGallery product={product} /><div>{product.category && <div className="text-xs font-bold text-[#2952a3] uppercase tracking-widest mb-3">{product.category.name}</div>}<h1 className="text-3xl lg:text-4xl font-black text-[#0a1628] mb-4">{product.name}</h1><div className="flex items-center gap-3 mb-6"><span className={`px-3 py-1 rounded-full text-xs font-bold ${stockStatus.color}`}>{stockStatus.label}</span>{product.is_featured && <span className="px-3 py-1 rounded-full text-xs font-bold text-[#2952a3] bg-[#e8edf8]">Featured Product</span>}</div><div className="bg-[#f0f3f9] rounded-2xl p-5 mb-6"><div className="text-sm text-[#6b7a9e] mb-1">{availableVariations.length ? `From ${availableVariations.length} available option${availableVariations.length === 1 ? "" : "s"}` : product.price_to ? "Price Range" : "Starting from"}</div><div className="text-3xl font-black text-[#0a1628] mb-1">{formatPriceRange(product)}</div>{selectedVariation && <p className="text-xs text-[#2952a3] font-semibold">Selected option: {formatVariationPrice(selectedVariation)} per {selectedVariation.unit}</p>}{availableVariations.length > 1 && <p className="text-xs text-[#6b7a9e] mt-2">Prices are shown by option below; select your gauge or size before requesting a quote.</p>}</div>{product.description && <p className="text-[#6b7a9e] leading-relaxed mb-6">{product.description}</p>}{productSpecs.length > 0 && <div className="mb-6"><h3 className="font-bold text-[#0a1628] mb-3">Product Specifications</h3><div className="grid grid-cols-2 gap-2">{productSpecs.map((spec) => <div key={spec.label} className="flex justify-between items-center py-2 border-b border-[#f0f3f9]"><span className="text-xs font-semibold text-[#6b7a9e]">{spec.label}</span><span className="text-xs font-bold text-[#0a1628]">{spec.value}</span></div>)}</div></div>}<div className="flex flex-wrap gap-3 mb-8">{[{ icon: <Shield size={14} />, label: "Quality Guaranteed" }, { icon: <Truck size={14} />, label: "Fast Delivery" }, { icon: <Star size={14} />, label: "Trusted Supplier" }].map((badge) => <div key={badge.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f3f9] rounded-full text-xs font-semibold text-[#3d4663]"><span className="text-[#2952a3]">{badge.icon}</span>{badge.label}</div>)}</div><WhatsAppOrderForm product={product} selectedVariation={selectedVariation} /></div></div><div className="mt-10 max-w-3xl"><VariationComparison variations={availableVariations} selectedVariation={selectedVariation} onSelect={setSelectedVariationId} /></div><RelatedProducts productId={product.id} /></div></div>;
};

export default ProductDetailPage;
