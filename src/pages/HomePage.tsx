import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle,
  ChevronRight,
  MessageCircle,
  Package,
  Phone,
  Shield,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import {
  formatPriceRange,
  generateOrderMessage,
  generateWhatsAppUrl,
  getPrimaryImage,
  productsApi,
} from "../lib/api";
import type { Product } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254700000000";

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80&auto=format&fit=crop",
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero: React.FC = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a1628]">
    {/* Background image */}
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80&auto=format&fit=crop')",
      }}
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/80 to-transparent" />
    {/* Animated accent lines */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 right-0 w-px h-64 bg-gradient-to-b from-transparent via-[#2952a3]/40 to-transparent" />
      <div className="absolute top-1/2 right-16 w-px h-48 bg-gradient-to-b from-transparent via-[#2952a3]/20 to-transparent" />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="max-w-3xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2952a3]/20 border border-[#2952a3]/30 text-[#7da3e0] text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          Kenya's Premier Roofing Supplier
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
          Premium Roofing
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2952a3] to-[#7da3e0]">
            Solutions
          </span>
          <br />
          <span className="text-4xl sm:text-5xl lg:text-6xl text-[#b8c1d9]">
            For Modern Kenyan Homes
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-[#8e9bbf] leading-relaxed mb-10 max-w-xl">
          Quality Mabati products engineered for Kenya's climate. Professional
          delivery across all 47 counties. Trusted by thousands of homeowners
          and contractors.
        </p>

        <div className="flex flex-wrap gap-4 mb-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2952a3] text-white font-bold rounded-xl hover:bg-[#1e3d7a] transition-all shadow-lg shadow-[#2952a3]/30 text-base"
          >
            Explore Products
            <ArrowRight size={18} />
          </Link>
          <a
            href={generateWhatsAppUrl(
              WHATSAPP,
              "Hello! I would like to inquire about your roofing products and pricing."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1da851] transition-all shadow-lg shadow-[#25D366]/30 text-base"
          >
            <MessageCircle size={18} />
            Order on WhatsApp
          </a>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center gap-6">
          {[
            { icon: <Shield size={15} />, label: "Quality Guaranteed" },
            { icon: <Truck size={15} />, label: "Nationwide Delivery" },
            { icon: <Award size={15} />, label: "10+ Years Experience" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[#6b7a9e] text-sm">
              <span className="text-[#25D366]">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
      <span className="text-white text-xs tracking-widest uppercase">Scroll</span>
      <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
    </div>
  </section>
);

// ─── Stats ────────────────────────────────────────────────────────────────────
const Stats: React.FC = () => (
  <section className="bg-[#0a1628] py-14 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { value: "500+", label: "Products Available", icon: <Building2 size={20} /> },
          { value: "10K+", label: "Happy Customers", icon: <Star size={20} /> },
          { value: "47", label: "Counties Served", icon: <Truck size={20} /> },
          { value: "10+", label: "Years Experience", icon: <Award size={20} /> },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="flex justify-center mb-3 text-[#2952a3]">{stat.icon}</div>
            <div className="text-3xl lg:text-4xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-[#6b7a9e] text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    name: "Mabati Sheets",
    desc: "Box profile, corrugated, and versatile roofing sheets in multiple gauges",
    icon: "🏠",
    color: "from-blue-600 to-blue-800",
  },
  {
    name: "Gutters & Downpipes",
    desc: "Complete rainwater harvesting and drainage systems",
    icon: "🌧️",
    color: "from-slate-600 to-slate-800",
  },
  {
    name: "Ridge Caps",
    desc: "Matching ridge caps and hip tiles for a professional finish",
    icon: "🔺",
    color: "from-orange-600 to-orange-800",
  },
  {
    name: "Roofing Nails",
    desc: "Galvanized and color-coated nails for all roofing applications",
    icon: "🔩",
    color: "from-zinc-600 to-zinc-800",
  },
  {
    name: "Accessories",
    desc: "Flashings, screws, sealants, and all roofing accessories",
    icon: "🛠️",
    color: "from-green-600 to-green-800",
  },
  {
    name: "Stone Coated",
    desc: "Premium stone coated steel tiles for luxury roofing",
    icon: "💎",
    color: "from-purple-600 to-purple-800",
  },
];

const CategoriesSection: React.FC = () => (
  <section className="py-24 bg-[#f8fafc]" id="categories">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-[#2952a3] text-sm font-semibold uppercase tracking-wider mb-4">
          <div className="w-8 h-px bg-[#2952a3]" />
          Product Categories
          <div className="w-8 h-px bg-[#2952a3]" />
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-[#0a1628] mb-4">
          Everything You Need
          <br />
          <span className="text-[#2952a3]">For Your Roof</span>
        </h2>
        <p className="text-[#6b7a9e] text-lg max-w-2xl mx-auto">
          From roofing sheets to accessories, we supply everything required for a complete,
          professional roofing installation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            to="/products"
            className="group relative overflow-hidden rounded-2xl bg-white border border-[#dde3f0] hover:border-[#2952a3]/30 hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} opacity-5 rounded-full -translate-y-8 translate-x-8 group-hover:opacity-10 transition-opacity`} />
            <div className="text-4xl mb-4">{cat.icon}</div>
            <h3 className="text-lg font-bold text-[#0a1628] mb-2 group-hover:text-[#2952a3] transition-colors">
              {cat.name}
            </h3>
            <p className="text-[#6b7a9e] text-sm leading-relaxed">{cat.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-[#2952a3] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Browse Products <ChevronRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

// ─── Featured Products ────────────────────────────────────────────────────────
const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productsApi.featured(3),
  });

  const items = products || [];

  return (
    <section className="py-24 bg-white" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 text-[#2952a3] text-sm font-semibold uppercase tracking-wider mb-4">
            <div className="w-8 h-px bg-[#2952a3]" />
            Our Products
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0a1628] mb-4">
            Premium Roofing
            <br />
            <span className="text-[#2952a3]">Materials</span>
          </h2>
          <p className="text-[#6b7a9e] text-lg leading-relaxed">
            High-quality Mabati sheets engineered for Kenya's climate. Available in
            multiple gauges, colors, and profiles.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#f0f3f9] rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-0">
            {(items.length > 0 ? items : []).map((product: Product, idx: number) => {
              const isEven = idx % 2 === 0;
              const imgSrc = getPrimaryImage(product) || FALLBACK_IMGS[idx % FALLBACK_IMGS.length];
              const waUrl = generateWhatsAppUrl(
                WHATSAPP,
                generateOrderMessage(product.name, product.gauge, product.color)
              );

              return (
                <div
                  key={product.id}
                  className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} min-h-[480px] overflow-hidden`}
                >
                  {/* Image half */}
                  <div className="relative lg:w-1/2 min-h-[300px] lg:min-h-[480px] overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {product.is_featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-[#2952a3] text-white text-xs font-bold rounded-full">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content half */}
                  <div
                    className={`lg:w-1/2 flex items-center ${isEven ? "bg-[#f8fafc]" : "bg-[#0a1628]"}`}
                  >
                    <div className="p-10 lg:p-16 w-full">
                      {product.category && (
                        <div
                          className={`text-xs font-bold uppercase tracking-widest mb-4 ${isEven ? "text-[#2952a3]" : "text-[#7da3e0]"}`}
                        >
                          {product.category.name}
                        </div>
                      )}
                      <h3
                        className={`text-3xl lg:text-4xl font-black mb-4 ${isEven ? "text-[#0a1628]" : "text-white"}`}
                      >
                        {product.name}
                      </h3>
                      {product.description && (
                        <p
                          className={`text-base leading-relaxed mb-6 ${isEven ? "text-[#6b7a9e]" : "text-[#8e9bbf]"}`}
                        >
                          {product.description}
                        </p>
                      )}

                      {/* Specs */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {product.gauge && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${isEven ? "bg-[#e8edf8] text-[#2952a3]" : "bg-white/10 text-[#b8c1d9]"}`}
                          >
                            Gauge: {product.gauge}
                          </span>
                        )}
                        {product.color && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${isEven ? "bg-[#e8edf8] text-[#2952a3]" : "bg-white/10 text-[#b8c1d9]"}`}
                          >
                            Color: {product.color}
                          </span>
                        )}
                        {product.material && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${isEven ? "bg-[#e8edf8] text-[#2952a3]" : "bg-white/10 text-[#b8c1d9]"}`}
                          >
                            {product.material}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mb-8">
                        <div
                          className={`text-sm font-semibold mb-1 ${isEven ? "text-[#6b7a9e]" : "text-[#6b7a9e]"}`}
                        >
                          Starting from
                        </div>
                        <div
                          className={`text-2xl font-black ${isEven ? "text-[#0a1628]" : "text-white"}`}
                        >
                          {formatPriceRange(product)}
                        </div>
                        {product.price_to && (
                          <div className={`text-xs mt-1 ${isEven ? "text-[#6b7a9e]" : "text-[#6b7a9e]"}`}>
                            Price varies by size, gauge &amp; quantity
                          </div>
                        )}
                      </div>

                      {/* CTAs */}
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={`/products/${product.id}`}
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${isEven ? "bg-[#0a1628] text-white hover:bg-[#152b55]" : "bg-white text-[#0a1628] hover:bg-[#f0f3f9]"}`}
                        >
                          View Details
                          <ArrowRight size={15} />
                        </Link>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-semibold text-sm hover:bg-[#1da851] transition-all"
                        >
                          <MessageCircle size={15} />
                          Get Quote
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#0a1628] text-[#0a1628] font-bold rounded-xl hover:bg-[#0a1628] hover:text-white transition-all text-base"
          >
            View All Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── Why Choose Us ────────────────────────────────────────────────────────────
const WhyChooseUs: React.FC = () => (
  <section className="py-24 bg-[#0a1628]" id="about">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-[#7da3e0] text-sm font-semibold uppercase tracking-wider mb-6">
            <div className="w-8 h-px bg-[#2952a3]" />
            Why Choose Mabati Store
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
            The Trusted Name
            <br />
            <span className="text-[#7da3e0]">In Kenyan Roofing</span>
          </h2>
          <p className="text-[#8e9bbf] text-lg leading-relaxed mb-10">
            For over a decade, we have been supplying premium roofing materials to homeowners,
            contractors, and developers across Kenya. Our commitment to quality and service
            has made us the go-to supplier for serious builders.
          </p>
          <div className="space-y-4">
            {[
              "ISO-certified quality materials from leading manufacturers",
              "Competitive pricing with transparent price ranges",
              "Fast delivery to all 47 counties in Kenya",
              "Expert technical advice from our roofing specialists",
              "After-sales support and installation guidance",
            ].map((point) => (
              <div key={point} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-[#25D366] mt-0.5 shrink-0" />
                <span className="text-[#b8c1d9] text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: <Shield size={24} />, title: "Quality Assured", desc: "Every product meets international quality standards" },
            { icon: <Zap size={24} />, title: "Fast Delivery", desc: "Same-day dispatch for in-stock items" },
            { icon: <Package size={24} />, title: "Wide Range", desc: "500+ products across all roofing categories" },
            { icon: <Phone size={24} />, title: "Expert Support", desc: "WhatsApp support 7 days a week" },
          ].map((item) => (
            <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="text-[#2952a3] mb-3">{item.icon}</div>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-[#6b7a9e] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "James Mwangi",
    role: "Contractor, Nairobi",
    text: "I have been ordering from Mabati Store for 3 years. The quality is consistent and delivery is always on time. My clients are always happy.",
    rating: 5,
  },
  {
    name: "Grace Wanjiku",
    role: "Homeowner, Kiambu",
    text: "The WhatsApp ordering is so convenient. I got a quote within minutes and my roofing sheets were delivered the next day. Highly recommend!",
    rating: 5,
  },
  {
    name: "Peter Ochieng",
    role: "Developer, Kisumu",
    text: "Best prices I have found in Kenya for quality mabati. The price range system helps me budget accurately for my projects.",
    rating: 5,
  },
];

const Testimonials: React.FC = () => (
  <section className="py-24 bg-[#f8fafc]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-[#2952a3] text-sm font-semibold uppercase tracking-wider mb-4">
          <div className="w-8 h-px bg-[#2952a3]" />
          Customer Reviews
          <div className="w-8 h-px bg-[#2952a3]" />
        </div>
        <h2 className="text-4xl font-black text-[#0a1628]">
          What Our Customers Say
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="bg-white rounded-2xl border border-[#dde3f0] p-8 hover:shadow-lg transition-shadow">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-[#3d4663] text-sm leading-relaxed mb-6 italic">
              "{t.text}"
            </p>
            <div>
              <div className="font-bold text-[#0a1628] text-sm">{t.name}</div>
              <div className="text-[#6b7a9e] text-xs">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── CTA ──────────────────────────────────────────────────────────────────────
const CTA: React.FC = () => (
  <section className="py-24 bg-[#2952a3]">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
        Ready to Start Your Roofing Project?
      </h2>
      <p className="text-[#b8c9e8] text-lg mb-10">
        Get a free quote today. Our roofing experts are available on WhatsApp to help
        you choose the right products for your budget and climate.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <a
          href={generateWhatsAppUrl(
            WHATSAPP,
            "Hello! I need help choosing the right roofing materials for my project."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1da851] transition-all shadow-lg text-base"
        >
          <MessageCircle size={18} />
          Chat on WhatsApp
        </a>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2952a3] font-bold rounded-xl hover:bg-[#f0f3f9] transition-all text-base"
        >
          Browse Products
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  </section>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const HomePage: React.FC = () => (
  <div>
    <Hero />
    <Stats />
    <CategoriesSection />
    <FeaturedProducts />
    <WhyChooseUs />
    <Testimonials />
    <CTA />
  </div>
);

export default HomePage;
