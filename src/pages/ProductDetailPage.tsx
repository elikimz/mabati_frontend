import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  Package,
  Ruler,
  Palette,
  Gauge,
  Tag,
  Building2,
  ChevronRight,
} from "lucide-react";
import { productsApi } from "../lib/api";
import {
  formatCurrency,
  generateWhatsAppUrl,
  generateOrderMessage,
} from "../lib/utils";
import { PageLoader, ErrorMessage, Badge } from "../components/ui";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "254700000000";

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.get(Number(id)),
    enabled: !!id,
  });

  const { data: allProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list(),
  });

  if (isLoading) return <PageLoader />;
  if (error || !product)
    return (
      <div className="pt-24">
        <ErrorMessage message="Product not found." />
      </div>
    );

  const waUrl = generateWhatsAppUrl(
    whatsappNumber,
    generateOrderMessage(
      product.name,
      product.color,
      product.gauge,
      product.length
    )
  );

  const fallbackImg =
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop";

  const related = allProducts
    ?.filter(
      (p) =>
        p.id !== product.id && p.category_id === product.category_id
    )
    .slice(0, 3);

  const specs = [
    product.gauge && {
      icon: <Gauge size={16} />,
      label: "Gauge",
      value: product.gauge,
    },
    product.color && {
      icon: <Palette size={16} />,
      label: "Color",
      value: product.color,
    },
    product.length && {
      icon: <Ruler size={16} />,
      label: "Length",
      value: `${product.length}m`,
    },
    product.width && {
      icon: <Ruler size={16} />,
      label: "Width",
      value: `${product.width}m`,
    },
    product.profile && {
      icon: <Building2 size={16} />,
      label: "Profile",
      value: product.profile,
    },
    product.brand && {
      icon: <Tag size={16} />,
      label: "Brand",
      value: product.brand,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#0a1628] pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#6b7a9e]">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-[#6b7a9e] hover:text-[#0a1628] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        {/* Main product section */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden bg-[#f0f3f9] aspect-[4/3]">
              <img
                src={product.image_url || fallbackImg}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating stock badge */}
            <div
              className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                product.stock_quantity > 0
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {product.stock_quantity > 0
                ? `${product.stock_quantity} in stock`
                : "Out of Stock"}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            {product.category && (
              <div className="inline-flex items-center gap-2 text-[#2952a3] text-sm font-semibold uppercase tracking-wider mb-4">
                <div className="w-6 h-px bg-[#2952a3]" />
                {product.category.name}
              </div>
            )}

            <h1 className="text-3xl lg:text-4xl font-black text-[#0a1628] mb-4 leading-tight">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-[#6b7a9e] text-lg mb-8 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-[#dde3f0]">
              <span className="text-4xl font-black text-[#0a1628]">
                {formatCurrency(product.price)}
              </span>
              {product.discount_price && (
                <div className="flex flex-col">
                  <span className="text-xl text-[#6b7a9e] line-through">
                    {formatCurrency(product.discount_price)}
                  </span>
                  <span className="text-sm text-red-500 font-medium">
                    Save{" "}
                    {formatCurrency(
                      parseFloat(product.discount_price) -
                        parseFloat(product.price)
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Specifications */}
            {specs.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[#6b7a9e] uppercase tracking-wider mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[#dde3f0]"
                    >
                      <span className="text-[#2952a3]">{spec.icon}</span>
                      <div>
                        <div className="text-xs text-[#6b7a9e] uppercase tracking-wider">
                          {spec.label}
                        </div>
                        <div className="font-semibold text-[#0a1628] text-sm">
                          {spec.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mb-8">
              {[
                "Kenya Bureau of Standards certified",
                "Corrosion resistant coating",
                "Available for immediate delivery",
                "Bulk order discounts available",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 py-2">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  <span className="text-sm text-[#3d4663]">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-all duration-200 shadow-lg hover:shadow-xl text-base"
              >
                <MessageCircle size={20} />
                Order Through WhatsApp
              </a>
              <Link
                to="/products"
                className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#dde3f0] text-[#3d4663] font-semibold rounded-xl hover:border-[#152b55] hover:text-[#152b55] transition-all duration-200"
              >
                <Package size={18} />
                Browse More
              </Link>
            </div>

            {/* WhatsApp message preview */}
            <div className="mt-6 p-4 bg-[#f0fff4] border border-[#25D366]/30 rounded-xl">
              <p className="text-xs text-[#6b7a9e] font-medium mb-2 uppercase tracking-wider">
                Your WhatsApp message will include:
              </p>
              <pre className="text-xs text-[#3d4663] whitespace-pre-wrap font-sans leading-relaxed">
                {generateOrderMessage(
                  product.name,
                  product.color,
                  product.gauge,
                  product.length
                )}
              </pre>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related && related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-[#0a1628]">
                Related Products
              </h2>
              <Link
                to="/products"
                className="text-sm text-[#2952a3] hover:text-[#152b55] font-medium flex items-center gap-1"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => {
                const rWaUrl = generateWhatsAppUrl(
                  whatsappNumber,
                  generateOrderMessage(p.name, p.color, p.gauge, p.length)
                );
                return (
                  <div
                    key={p.id}
                    className="group bg-white rounded-2xl border border-[#dde3f0] overflow-hidden hover:border-[#2952a3]/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="h-44 overflow-hidden bg-[#f0f3f9]">
                      <img
                        src={
                          p.image_url ||
                          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&auto=format&fit=crop"
                        }
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-[#0a1628] mb-2 line-clamp-1">
                        {p.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[#0a1628]">
                          {formatCurrency(p.price)}
                        </span>
                        <div className="flex gap-2">
                          <a
                            href={rWaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-[#25D366] text-white text-xs font-semibold rounded-lg hover:bg-[#1ebe5d] transition-colors"
                          >
                            <MessageCircle size={13} />
                          </a>
                          <Link
                            to={`/products/${p.id}`}
                            className="px-3 py-1.5 border border-[#dde3f0] text-[#3d4663] text-xs font-semibold rounded-lg hover:border-[#152b55] hover:text-[#152b55] transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
