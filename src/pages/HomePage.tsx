import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Truck,
  Shield,
  Zap,
  Star,
  MessageCircle,
  Phone,
  ChevronDown,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsApi, bannersApi } from "../lib/api";
import { cn } from "../lib/utils";
import { useTheme } from "../contexts/ThemeContext";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254788873611";

export default function HomePage() {
  const { theme } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);

  // Fetch banners and products
  const { data: banners = [] } = useQuery({
    queryKey: ["banners"],
    queryFn: () => bannersApi.list(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list(),
  });

  const bestSellers = products.slice(0, 6);

  // Auto-rotate hero slides
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const heroSlides = banners.length > 0
    ? banners
    : [
        {
          id: 1,
          title: "Premium Roofing Materials",
          description: "High-quality mabati sheets for your construction needs",
          image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=600&fit=crop",
          buttonText: "Shop Now",
          buttonLink: "/products",
        },
      ];

  return (
    <div className={cn(theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
      {/* Hero Slider - Image-First */}
      <section className="relative pt-20 overflow-hidden">
        <div className="relative h-[600px] md:h-[700px] lg:h-[800px] w-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                index === activeSlide ? "opacity-100" : "opacity-0"
              )}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${slide.image}')`,
                }}
              />

              {/* Overlay */}
              <div className={cn(
                "absolute inset-0",
                theme === "dark"
                  ? "bg-gradient-to-r from-[#050d1a]/95 via-[#050d1a]/70 to-transparent"
                  : "bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/60 to-transparent"
              )} />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a017]/20 border border-[#d4a017]/40 text-[#f0c94a] text-xs font-bold uppercase tracking-widest mb-6">
                      Premium Roofing Solutions
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-[#b8c1d9] mb-8 leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to={slide.buttonLink || "/products"}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2952a3] text-white font-bold rounded-2xl hover:bg-[#1e3d7a] transition-colors shadow-xl shadow-[#2952a3]/30 text-lg"
                      >
                        {slide.buttonText || "Explore Products"}
                        <ArrowRight size={20} />
                      </Link>
                      <a
                        href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about your roofing products.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#1ebe5d] transition-colors shadow-xl shadow-[#25D366]/30 text-lg"
                      >
                        <MessageCircle size={20} />
                        Get Quote
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === activeSlide
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-white/50">
            <ChevronDown size={16} className="animate-bounce" />
          </div>
        </div>
      </section>

      {/* Trust Bar - Minimal */}
      <section className={cn(
        "py-12 border-b",
        theme === "dark"
          ? "bg-[#0a1628] border-white/5"
          : "bg-[#f8fafc] border-[#dde3f0]"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, label: "ISO Certified", value: "Quality Assured" },
              { icon: Truck, label: "Fast Delivery", value: "Across Kenya" },
              { icon: Zap, label: "Expert Support", value: "24/7 Available" },
              { icon: CheckCircle2, label: "Trusted by", value: "10,000+ Clients" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <item.icon size={24} className="text-[#2952a3]" />
                </div>
                <div>
                  <div className={cn("text-xs font-bold uppercase tracking-wider", theme === "dark" ? "text-[#8e9bbf]" : "text-[#6b7a9e]")}>
                    {item.label}
                  </div>
                  <div className={cn("text-sm font-semibold", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Solutions - Image-First */}
      <section className={cn("py-20", theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className={cn("text-4xl md:text-5xl font-black mb-4", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
              Featured Roofing Solutions
            </h2>
            <p className={cn("text-lg", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
              Professional-grade materials for every project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Box Profile Sheets",
                description: "Premium corrugated roofing with superior durability",
                image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop",
                color: "from-blue-600 to-blue-900",
              },
              {
                title: "Tile Profile Sheets",
                description: "Elegant aesthetic with industrial strength",
                image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop",
                color: "from-slate-600 to-slate-900",
              },
              {
                title: "Stone Coated Sheets",
                description: "Weather-resistant with natural stone texture",
                image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop",
                color: "from-amber-600 to-amber-900",
              },
              {
                title: "Gutters & Downpipes",
                description: "Complete drainage system solutions",
                image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop",
                color: "from-green-600 to-green-900",
              },
            ].map((solution, i) => (
              <div
                key={i}
                className={cn(
                  "group relative overflow-hidden rounded-3xl h-80 cursor-pointer transition-transform duration-300 hover:scale-105",
                  theme === "dark" ? "shadow-2xl" : "shadow-xl"
                )}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${solution.image}')` }}
                />

                {/* Overlay */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t",
                  `${solution.color}`
                )} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <h3 className="text-2xl font-black mb-2">{solution.title}</h3>
                  <p className="text-white/90 mb-4">{solution.description}</p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all"
                  >
                    View Products <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers - Full Width Showcase */}
      <section className={cn(
        "py-20 border-t",
        theme === "dark"
          ? "bg-[#0a1628] border-white/5"
          : "bg-[#f8fafc] border-[#dde3f0]"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className={cn("text-4xl md:text-5xl font-black mb-4", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
              Best Sellers
            </h2>
            <p className={cn("text-lg", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
              Most trusted by construction professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestSellers.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug || product.id}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl",
                  theme === "dark"
                    ? "bg-[#152b55] hover:bg-[#1e3a6e]"
                    : "bg-white hover:shadow-xl"
                )}
              >
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#2952a3] to-[#152b55]">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={typeof product.images[0] === "string" ? product.images[0] : (product.images[0] as any)?.url || ""}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📦</div>
                        <div className="text-sm">No image</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Overlay */}
                <div className={cn(
                  "p-6",
                  theme === "dark" ? "bg-[#152b55]" : "bg-white"
                )}>
                  <h3 className={cn(
                    "font-bold text-lg mb-2 line-clamp-2",
                    theme === "dark" ? "text-white" : "text-[#0a1628]"
                  )}>
                    {product.name}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.gauge && (
                      <span className={cn(
                        "text-xs font-semibold px-3 py-1 rounded-full",
                        theme === "dark"
                          ? "bg-white/10 text-[#4d79ff]"
                          : "bg-[#2952a3]/10 text-[#2952a3]"
                      )}>
                        {product.gauge} Gauge
                      </span>
                    )}
                    {product.color && (
                      <span className={cn(
                        "text-xs font-semibold px-3 py-1 rounded-full",
                        theme === "dark"
                          ? "bg-white/10 text-[#f0c94a]"
                          : "bg-[#d4a017]/10 text-[#d4a017]"
                      )}>
                        {product.color}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {product.price && (
                        <div className={cn(
                          "text-sm font-semibold",
                          theme === "dark" ? "text-[#8e9bbf]" : "text-[#6b7a9e]"
                        )}>
                          From KES {product.price.toLocaleString()}
                        </div>
                      )}
                      {product.stock > 0 ? (
                        <div className="text-xs text-[#10b981] font-semibold mt-1">
                          In Stock
                        </div>
                      ) : (
                        <div className="text-xs text-[#ef4444] font-semibold mt-1">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    <ArrowRight size={18} className={cn(
                      "transition-transform group-hover:translate-x-1",
                      theme === "dark" ? "text-[#4d79ff]" : "text-[#2952a3]"
                    )} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#2952a3] text-white font-bold rounded-2xl hover:bg-[#1e3d7a] transition-colors shadow-lg"
            >
              View All Products <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose MRM - Minimal */}
      <section className={cn("py-20", theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className={cn("text-4xl md:text-5xl font-black mb-4", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
              Why Choose MRM Mabati
            </h2>
            <p className={cn("text-lg", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
              Industry-leading quality and service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Premium Quality", description: "ISO certified materials with rigorous quality control" },
              { title: "Fast Delivery", description: "Quick turnaround across all regions of Kenya" },
              { title: "Expert Consultation", description: "Free technical advice from roofing specialists" },
              { title: "Competitive Pricing", description: "Best value for professional-grade materials" },
              { title: "Warranty Support", description: "Full warranty and after-sales support" },
              { title: "Bulk Discounts", description: "Special rates for contractors and developers" },
            ].map((item, i) => (
              <div key={i} className={cn(
                "p-8 rounded-2xl transition-all duration-300 hover:shadow-xl",
                theme === "dark"
                  ? "bg-[#0a1628] border border-white/10 hover:border-white/20"
                  : "bg-[#f8fafc] border border-[#dde3f0]"
              )}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2952a3] to-[#152b55] flex items-center justify-center mb-4">
                  <CheckCircle2 size={24} className="text-white" />
                </div>
                <h3 className={cn("font-bold text-lg mb-2", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                  {item.title}
                </h3>
                <p className={cn("text-sm leading-relaxed", theme === "dark" ? "text-[#6b7a9e]" : "text-[#6b7a9e]")}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={cn(
        "py-20 border-t",
        theme === "dark"
          ? "bg-gradient-to-r from-[#0a1628] via-[#152b55] to-[#2952a3] border-white/5"
          : "bg-gradient-to-r from-[#2952a3] via-[#1e3d7a] to-[#152b55]"
      )}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get expert advice and a free quote from our roofing specialists
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to get a quote for my roofing project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#1ebe5d] transition-colors shadow-xl shadow-[#25D366]/30 text-lg"
            >
              <MessageCircle size={20} />
              Get Quote on WhatsApp
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white font-bold rounded-2xl border border-white/30 hover:bg-white/30 transition-colors text-lg"
            >
              <Phone size={20} />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
