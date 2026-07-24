import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
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
import type { Product } from "../types";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254788873611";

// ─── Image Gallery ────────────────────────────────────────────────────────────
const ImageGallery: React.FC<{ product: Product }> = ({ product }) => {
  const allImages = [
    ...(product.images || []),
    ...(product.image_url && !product.images?.find((i) => i.image_url === product.image_url)
      ? [{ id: -1, product_id: product.id, image_url: product.image_url, is_primary: false, display_order: 99 }]
      : []),
  ];

  const fallback = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80";
  const images = allImages.length > 0 ? allImages : [{ id: -1, product_id: product.id, image_url: fallback, is_primary: true, display_order: 0 }];

  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const prev = () => setActiveIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIdx((i) => (i + 1) % images.length);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-[#f0f3f9] aspect-[4/3] cursor-zoom-in" onClick={() => setZoomed(true)}>
        <img
          src={images[activeIdx]?.image_url || fallback}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-xl text-[#0a1628] hover:bg-white transition-colors">
          <ZoomIn size={16} />
        </button>
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-xl text-[#0a1628] hover:bg-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-xl text-[#0a1628] hover:bg-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }}
              className={`w-2 h-2 rounded-full transition-colors ${i === activeIdx ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                i === activeIdx ? "border-[#2952a3]" : "border-[#dde3f0] hover:border-[#2952a3]/50"
              }`}
            >
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <img
            src={images[activeIdx]?.image_url || fallback}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
          <button className="absolute top-4 right-4 text-white text-2xl font-bold" onClick={() => setZoomed(false)}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

// ─── WhatsApp Order Form ──────────────────────────────────────────────────────
const WhatsAppOrderForm: React.FC<{ product: Product }> = ({ product }) => {
  const [form, setForm] = useState({
    gauge: product.gauge || "",
    color: product.color || "",
    quantity: 1,
    location: "",
  });

  const message = generateOrderMessage(
    product.name,
    form.gauge,
    form.color,
    form.quantity,
    form.location
  );
  const waUrl = generateWhatsAppUrl(WHATSAPP, message);

  return (
    <div className="bg-[#f8fafc] rounded-2xl border border-[#dde3f0] p-6">
      <h3 className="font-bold text-[#0a1628] mb-4 flex items-center gap-2">
        <MessageCircle size={18} className="text-[#25D366]" />
        Request a Quote via WhatsApp
      </h3>

      <div className="space-y-3 mb-5">
        <div>
          <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1 block">
            Gauge
          </label>
          <input
            type="text"
            value={form.gauge}
            onChange={(e) => setForm({ ...form, gauge: e.target.value })}
            placeholder="e.g. 28G, 30G"
            className="w-full px-3 py-2.5 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1 block">
            Color
          </label>
          <input
            type="text"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            placeholder="e.g. Charcoal, Red"
            className="w-full px-3 py-2.5 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1 block">
            Quantity
          </label>
          <input
            type="number"
            min={product.minimum_order_quantity || 1}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            className="w-full px-3 py-2.5 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]"
          />
          {product.minimum_order_quantity > 1 && (
            <p className="text-xs text-[#6b7a9e] mt-1">
              Minimum order: {product.minimum_order_quantity} {product.unit || "pieces"}
            </p>
          )}
        </div>
        <div>
          <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1 block">
            Delivery Location
          </label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Nairobi, Kiambu"
            className="w-full px-3 py-2.5 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]"
          />
        </div>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1da851] transition-colors text-base"
      >
        <MessageCircle size={18} />
        Send Inquiry on WhatsApp
      </a>
    </div>
  );
};

// ─── Related Products ─────────────────────────────────────────────────────────
const RelatedProducts: React.FC<{ productId: number }> = ({ productId }) => {
  const { data: related } = useQuery({
    queryKey: ["products", productId, "related"],
    queryFn: () => productsApi.related(productId, 4),
  });

  if (!related || related.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-[#dde3f0]">
      <h2 className="text-2xl font-black text-[#0a1628] mb-8">Similar Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.slug || product.id}`}
            className="bg-white rounded-2xl border border-[#dde3f0] overflow-hidden hover:shadow-lg hover:border-[#2952a3]/20 transition-all group"
          >
            <div className="h-40 overflow-hidden bg-[#f0f3f9]">
              <img
                src={getPrimaryImage(product)}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#0a1628] text-sm mb-1 line-clamp-2 group-hover:text-[#2952a3] transition-colors">
                {product.name}
              </h3>
              <div className="text-sm font-black text-[#2952a3]">{formatPriceRange(product)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Determine if the param is a numeric ID or a slug string
  const isNumericId = id ? /^\d+$/.test(id) : false;

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => {
      if (!id) throw new Error("No product identifier provided");
      return isNumericId ? productsApi.get(Number(id)) : productsApi.getBySlug(id);
    },
    enabled: !!id,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2952a3] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6b7a9e]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="text-[#dde3f0] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">Product Not Found</h2>
          <Link to="/products" className="text-[#2952a3] text-sm hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus =
    product.stock_quantity === 0
      ? { label: "Out of Stock", color: "text-red-600 bg-red-50" }
      : product.stock_quantity <= product.low_stock_threshold
      ? { label: "Low Stock", color: "text-amber-600 bg-amber-50" }
      : { label: "In Stock", color: "text-emerald-600 bg-emerald-50" };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#dde3f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-[#6b7a9e]">
            <Link to="/" className="hover:text-[#0a1628] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-[#0a1628] transition-colors">Products</Link>
            <ChevronRight size={14} />
            <span className="text-[#0a1628] font-medium truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-[#6b7a9e] hover:text-[#0a1628] text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <ImageGallery product={product} />

          {/* Right: Product Info */}
          <div>
            {product.category && (
              <div className="text-xs font-bold text-[#2952a3] uppercase tracking-widest mb-3">
                {product.category.name}
              </div>
            )}
            <h1 className="text-3xl lg:text-4xl font-black text-[#0a1628] mb-4">
              {product.name}
            </h1>

            {/* Stock badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${stockStatus.color}`}>
                {stockStatus.label}
              </span>
              {product.is_featured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold text-[#2952a3] bg-[#e8edf8]">
                  Featured Product
                </span>
              )}
            </div>

            {/* Price */}
            <div className="bg-[#f0f3f9] rounded-2xl p-5 mb-6">
              <div className="text-sm text-[#6b7a9e] mb-1">
                {product.price_to ? "Price Range" : "Starting from"}
              </div>
              <div className="text-3xl font-black text-[#0a1628] mb-1">
                {formatPriceRange(product)}
              </div>
              {product.price_to && (
                <p className="text-xs text-[#6b7a9e]">
                  Final price depends on size, gauge, color, and order quantity.
                  Contact us for an exact quote.
                </p>
              )}
              {product.discount_price && (
                <div className="mt-2 text-sm text-emerald-600 font-semibold">
                  Special offer available — ask on WhatsApp
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[#6b7a9e] leading-relaxed mb-6">{product.description}</p>
            )}

            {/* Specifications */}
            <div className="mb-6">
              <h3 className="font-bold text-[#0a1628] mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Brand", value: product.brand },
                  { label: "Type", value: product.product_type },
                  { label: "Material", value: product.material },
                  { label: "Finish", value: product.finish },
                  { label: "Profile", value: product.profile },
                  { label: "Gauge", value: product.gauge },
                  { label: "Length", value: product.length ? `${product.length}m` : undefined },
                  { label: "Width", value: product.width ? `${product.width}m` : undefined },
                  { label: "Color", value: product.color },
                  { label: "Unit", value: product.unit },
                  { label: "Min. Order", value: product.minimum_order_quantity > 1 ? `${product.minimum_order_quantity} ${product.unit || "pcs"}` : undefined },
                ]
                  .filter((s) => s.value)
                  .map((spec) => (
                    <div key={spec.label} className="flex justify-between items-center py-2 border-b border-[#f0f3f9]">
                      <span className="text-xs font-semibold text-[#6b7a9e]">{spec.label}</span>
                      <span className="text-xs font-bold text-[#0a1628]">{spec.value}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: <Shield size={14} />, label: "Quality Guaranteed" },
                { icon: <Truck size={14} />, label: "Fast Delivery" },
                { icon: <Star size={14} />, label: "Trusted Supplier" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f3f9] rounded-full text-xs font-semibold text-[#3d4663]">
                  <span className="text-[#2952a3]">{b.icon}</span>
                  {b.label}
                </div>
              ))}
            </div>

            {/* WhatsApp order form */}
            <WhatsAppOrderForm product={product} />
          </div>
        </div>

        {/* Related products */}
        <RelatedProducts productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
