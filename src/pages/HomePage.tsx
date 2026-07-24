import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  MessageCircle,
  Shield,
  Truck,
  Award,
  Phone,
  ChevronRight,
  CheckCircle,
  Star,
  Building2,
  Wrench,
} from "lucide-react";
import { productsApi } from "../lib/api";
import { formatCurrency, generateWhatsAppUrl, generateOrderMessage } from "../lib/utils";
import { PageLoader } from "../components/ui";
import type { Product } from "../types";

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection: React.FC = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "254700000000";
  const heroUrl =
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80&auto=format&fit=crop";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroUrl})` }}
      />
      <div className="absolute inset-0 bg-hero-overlay" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#2952a3]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#152b55]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-white/90 text-sm font-medium">
              Kenya's Premier Roofing Supplier
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.05]">
            Premium Roofing
            <br />
            <span className="text-gradient-gold">Solutions</span>
            <br />
            Built to Last
          </h1>

          <p className="text-lg sm:text-xl text-[#b8c1d9] mb-10 max-w-xl leading-relaxed">
            Quality Mabati products for modern homes and commercial buildings.
            Reliable delivery across Kenya with professional service.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0a1628] font-bold rounded-xl hover:bg-[#f0f3f9] transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-[0.98] text-base"
            >
              Explore Products
              <ArrowRight size={18} />
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello, I would like to order roofing materials. Please assist me.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-[0.98] text-base"
            >
              <MessageCircle size={18} />
              Order on WhatsApp
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-6 mt-12">
            {[
              { icon: <Shield size={16} />, label: "Quality Guaranteed" },
              { icon: <Truck size={16} />, label: "Nationwide Delivery" },
              { icon: <Award size={16} />, label: "10+ Years Experience" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-[#b8c1d9] text-sm"
              >
                <span className="text-[#25D366]">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-white text-xs tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

// ─── Stats Section ────────────────────────────────────────────────────────────
const StatsSection: React.FC = () => (
  <section className="bg-[#0a1628] py-14">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { value: "500+", label: "Products Available", icon: <Building2 size={20} /> },
          { value: "10K+", label: "Happy Customers", icon: <Star size={20} /> },
          { value: "47", label: "Counties Served", icon: <Truck size={20} /> },
          { value: "10+", label: "Years Experience", icon: <Award size={20} /> },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="flex justify-center mb-3 text-[#2952a3]">
              {stat.icon}
            </div>
            <div className="text-3xl lg:text-4xl font-black text-white mb-1">
              {stat.value}
            </div>
            <div className="text-[#6b7a9e] text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Featured Products ────────────────────────────────────────────────────────
const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productsApi.list(),
  });

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "254700000000";
  const featured = products?.slice(0, 3) || [];

  const fallbackImages = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop",
  ];

  return (
    <section className="py-24 bg-white" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 text-[#2952a3] text-sm font-semibold uppercase tracking-wider mb-4">
            <div className="w-8 h-px bg-[#2952a3]" />
            Our Products
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0a1628] mb-4">
            Premium Roofing
            <br />
            <span className="text-gradient-navy">Materials</span>
          </h2>
          <p className="text-[#6b7a9e] text-lg leading-relaxed">
            High-quality Mabati sheets engineered for Kenya's climate. Available
            in multiple gauges, colors, and profiles.
          </p>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="space-y-0">
            {(featured.length > 0 ? featured : []).map(
              (product: Product, idx: number) => {
                const isEven = idx % 2 === 0;
                const imgSrc =
                  product.image_url || fallbackImages[idx % fallbackImages.length];
                const waUrl = generateWhatsAppUrl(
                  whatsappNumber,
                  generateOrderMessage(
                    product.name,
                    product.color,
                    product.gauge,
                    product.length
                  )
                );

                return (
                  <div
                    key={product.id}
                    className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} min-h-[480px] overflow-hidden`}
                  >
                    {/* Image */}
                    <div className="relative lg:w-1/2 h-64 lg:h-auto overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      {product.discount_price && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                          SALE
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={`lg:w-1/2 bg-[#f8fafc] flex items-center ${isEven ? "lg:pl-16 lg:pr-12" : "lg:pr-16 lg:pl-12"} px-8 py-12`}
                    >
                      <div className="max-w-md">
                        {product.category && (
                          <div className="inline-flex items-center gap-2 text-[#2952a3] text-xs font-semibold uppercase tracking-wider mb-4">
                            <div className="w-6 h-px bg-[#2952a3]" />
                            {product.category.name}
                          </div>
                        )}
                        <h3 className="text-3xl font-black text-[#0a1628] mb-4 leading-tight">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-[#6b7a9e] mb-6 leading-relaxed">
                            {product.description}
                          </p>
                        )}

                        {/* Specs */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {product.gauge && (
                            <div className="bg-white rounded-lg p-3 border border-[#dde3f0]">
                              <div className="text-xs text-[#6b7a9e] uppercase tracking-wider mb-1">
                                Gauge
                              </div>
                              <div className="font-semibold text-[#0a1628]">
                                {product.gauge}
                              </div>
                            </div>
                          )}
                          {product.color && (
                            <div className="bg-white rounded-lg p-3 border border-[#dde3f0]">
                              <div className="text-xs text-[#6b7a9e] uppercase tracking-wider mb-1">
                                Color
                              </div>
                              <div className="font-semibold text-[#0a1628]">
                                {product.color}
                              </div>
                            </div>
                          )}
                          {product.length && (
                            <div className="bg-white rounded-lg p-3 border border-[#dde3f0]">
                              <div className="text-xs text-[#6b7a9e] uppercase tracking-wider mb-1">
                                Length
                              </div>
                              <div className="font-semibold text-[#0a1628]">
                                {product.length}m
                              </div>
                            </div>
                          )}
                          <div className="bg-white rounded-lg p-3 border border-[#dde3f0]">
                            <div className="text-xs text-[#6b7a9e] uppercase tracking-wider mb-1">
                              Stock
                            </div>
                            <div
                              className={`font-semibold ${product.stock_quantity > 0 ? "text-emerald-600" : "text-red-500"}`}
                            >
                              {product.stock_quantity > 0
                                ? "In Stock"
                                : "Out of Stock"}
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-8">
                          <span className="text-3xl font-black text-[#0a1628]">
                            {formatCurrency(product.price)}
                          </span>
                          {product.discount_price && (
                            <span className="text-lg text-[#6b7a9e] line-through">
                              {formatCurrency(product.discount_price)}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1ebe5d] transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            <MessageCircle size={18} />
                            Order on WhatsApp
                          </a>
                          <Link
                            to={`/products/${product.id}`}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#152b55] text-[#152b55] font-semibold rounded-xl hover:bg-[#152b55] hover:text-white transition-all duration-200"
                          >
                            View Details
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}

            {/* Fallback when no products */}
            {!isLoading && featured.length === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {[
                  {
                    title: "Corrugated Mabati Sheets",
                    desc: "Classic corrugated profile for residential and commercial roofing. Available in 28, 30, and 32 gauge.",
                    img: fallbackImages[0],
                    color: "Blue, Green, Red, Zink",
                  },
                  {
                    title: "Box Profile Sheets",
                    desc: "Modern box profile design offering superior strength and water resistance for all building types.",
                    img: fallbackImages[1],
                    color: "Charcoal, Brick Red, Forest Green",
                  },
                  {
                    title: "Versatile Tile Sheets",
                    desc: "Elegant tile-effect roofing that combines the beauty of tiles with the durability of steel.",
                    img: fallbackImages[2],
                    color: "Terracotta, Slate, Stone",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="relative h-96 overflow-hidden group">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a] via-[#050d1a]/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[#b8c1d9] text-sm mb-4">{item.desc}</p>
                      <Link
                        to="/products"
                        className="inline-flex items-center gap-1 text-[#25D366] text-sm font-semibold hover:gap-2 transition-all"
                      >
                        View Products <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#152b55] text-white font-semibold rounded-xl hover:bg-[#0f2040] transition-all duration-200 shadow-md hover:shadow-lg"
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
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-[#2952a3] text-sm font-semibold uppercase tracking-wider mb-4">
            <div className="w-8 h-px bg-[#2952a3]" />
            Why Choose Us
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Built on Trust,
            <br />
            <span className="text-gradient-gold">Quality & Service</span>
          </h2>
          <p className="text-[#6b7a9e] text-lg mb-10 leading-relaxed">
            For over a decade, Mabati Roofing has been the trusted partner for
            contractors, developers, and homeowners across Kenya.
          </p>

          <div className="space-y-5">
            {[
              {
                title: "Premium Quality Materials",
                desc: "All products meet Kenya Bureau of Standards specifications.",
              },
              {
                title: "Competitive Pricing",
                desc: "Direct from manufacturer pricing with no hidden costs.",
              },
              {
                title: "Fast Nationwide Delivery",
                desc: "Reliable delivery to all 47 counties within 48 hours.",
              },
              {
                title: "Expert Technical Support",
                desc: "Free consultation and installation guidance from our team.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#2952a3]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle size={14} className="text-[#2952a3]" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                  <p className="text-[#6b7a9e] text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden h-48">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&auto=format&fit=crop"
                  alt="Roofing"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-32">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80&auto=format&fit=crop"
                  alt="Construction"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="rounded-2xl overflow-hidden h-32">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop"
                  alt="Materials"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-48">
                <img
                  src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80&auto=format&fit=crop"
                  alt="Building"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Floating card */}
          <div className="absolute -bottom-4 -left-4 bg-[#152b55] rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center">
                <MessageCircle size={22} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">WhatsApp Orders</div>
                <div className="text-[#6b7a9e] text-xs">Instant response guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Services Section ─────────────────────────────────────────────────────────
const ServicesSection: React.FC = () => (
  <section className="py-24 bg-[#f8fafc]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-[#2952a3] text-sm font-semibold uppercase tracking-wider mb-4">
          <div className="w-8 h-px bg-[#2952a3]" />
          Our Services
          <div className="w-8 h-px bg-[#2952a3]" />
        </div>
        <h2 className="text-4xl font-black text-[#0a1628] mb-4">
          Complete Roofing Solutions
        </h2>
        <p className="text-[#6b7a9e] text-lg">
          From material supply to technical consultation, we cover every aspect
          of your roofing project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: <Building2 size={28} />,
            title: "Residential Roofing",
            desc: "Complete roofing solutions for homes, bungalows, and residential estates.",
          },
          {
            icon: <Wrench size={28} />,
            title: "Commercial Projects",
            desc: "Large-scale supply for warehouses, factories, and commercial buildings.",
          },
          {
            icon: <Truck size={28} />,
            title: "Delivery Services",
            desc: "Reliable delivery to your construction site anywhere in Kenya.",
          },
          {
            icon: <Shield size={28} />,
            title: "Quality Assurance",
            desc: "All products certified to Kenya Bureau of Standards specifications.",
          },
          {
            icon: <Award size={28} />,
            title: "Technical Consultation",
            desc: "Free expert advice on material selection and quantity estimation.",
          },
          {
            icon: <Phone size={28} />,
            title: "After-Sales Support",
            desc: "Dedicated support team available via WhatsApp and phone.",
          },
        ].map((service) => (
          <div
            key={service.title}
            className="bg-white rounded-2xl p-7 border border-[#dde3f0] hover:border-[#2952a3]/30 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="w-14 h-14 rounded-xl bg-[#f0f3f9] group-hover:bg-[#2952a3] flex items-center justify-center text-[#2952a3] group-hover:text-white transition-all duration-300 mb-5">
              {service.icon}
            </div>
            <h3 className="text-lg font-bold text-[#0a1628] mb-2">
              {service.title}
            </h3>
            <p className="text-[#6b7a9e] text-sm leading-relaxed">
              {service.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Contact Section ──────────────────────────────────────────────────────────
const ContactSection: React.FC = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "254700000000";

  return (
    <section className="py-24 bg-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[#2952a3] text-sm font-semibold uppercase tracking-wider mb-4">
              <div className="w-8 h-px bg-[#2952a3]" />
              Get In Touch
            </div>
            <h2 className="text-4xl font-black text-[#0a1628] mb-6">
              Ready to Order?
              <br />
              <span className="text-gradient-navy">Let's Talk</span>
            </h2>
            <p className="text-[#6b7a9e] text-lg mb-10">
              Contact us via WhatsApp for instant quotes and order processing.
              Our team responds within minutes.
            </p>

            <div className="space-y-4">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello, I would like to inquire about your roofing products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 bg-[#f0fff4] border border-[#25D366]/30 rounded-2xl hover:border-[#25D366] transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center text-white">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <div className="font-semibold text-[#0a1628]">
                    WhatsApp Us
                  </div>
                  <div className="text-[#6b7a9e] text-sm">
                    +254 700 000 000 · Instant response
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="ml-auto text-[#6b7a9e] group-hover:text-[#25D366] transition-colors"
                />
              </a>

              <a
                href="tel:+254700000000"
                className="flex items-center gap-4 p-5 bg-[#f0f3f9] border border-[#dde3f0] rounded-2xl hover:border-[#2952a3]/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#152b55] flex items-center justify-center text-white">
                  <Phone size={22} />
                </div>
                <div>
                  <div className="font-semibold text-[#0a1628]">Call Us</div>
                  <div className="text-[#6b7a9e] text-sm">
                    +254 700 000 000 · Mon–Sat 8am–6pm
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="ml-auto text-[#6b7a9e] group-hover:text-[#2952a3] transition-colors"
                />
              </a>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-96 lg:h-auto">
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop"
              alt="Contact"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/80 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="glass-card rounded-2xl p-6">
                <p className="text-white font-semibold text-lg mb-1">
                  Industrial Area, Nairobi
                </p>
                <p className="text-[#b8c1d9] text-sm">
                  Open Monday–Saturday · 8:00 AM – 6:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Main HomePage ────────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedProducts />
      <WhyChooseUs />
      <ServicesSection />
      <ContactSection />
    </>
  );
};

export default HomePage;
