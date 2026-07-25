import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Truck,
  Shield,
  Zap,
  MessageCircle,
  Phone,
  ChevronDown,
  Hammer,
  Users,
  MapPin,
  Award,
  Image as ImageIcon,
  Star,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsApi, bannersApi, siteContentApi, galleryApi } from "../lib/api";
import { cn } from "../lib/utils";
import { useTheme } from "../contexts/ThemeContext";
import type { Product, GalleryOut } from "../types";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254788873611";

interface Stat {
  icon: React.ElementType;
  value: string;
  label: string;
}

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  image: string;
}

interface ProjectItem {
  id: number;
  image_url: string;
  title: string;
  description?: string;
  category?: string;
}

export default function HomePage() {
  const { theme } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);

  // Fetch banners, products, and site content
  const { data: banners = [] } = useQuery({
    queryKey: ["banners"],
    queryFn: () => bannersApi.list("hero"),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list(),
  });

  const { data: siteContent = [] } = useQuery({
    queryKey: ["siteContent"],
    queryFn: () => siteContentApi.list(),
  });

  const { data: gallery = [] } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => galleryApi.list(true),
  });

  const getSiteContentValue = (key: string, defaultValue: any = null) => {
    return siteContent.find(item => item.key === key)?.value || defaultValue;
  };

  const heroSlides = banners.length > 0
    ? banners
    : [
        {
          id: 1,
          title: "Premium Roofing Materials",
          subtitle: "High-quality mabati sheets for your construction needs",
          image_url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=600&fit=crop",
          link_url: "/products",
          buttonText: "Shop Now",
        },
      ];

  const stats: Stat[] = getSiteContentValue("homepage_stats", [
    { icon: Hammer, value: "1000+", label: "Projects Completed" },
    { icon: Users, value: "500+", label: "Satisfied Clients" },
    { icon: MapPin, value: "10+", label: "Counties Served" },
    { icon: Award, value: "20+", label: "Years Experience" },
  ]);

  const testimonials: Testimonial[] = getSiteContentValue("homepage_testimonials", [
    {
      quote: "MRM Mabati provided excellent quality roofing for our new home. The service was professional and the delivery was prompt.",
      author: "Jane Doe",
      title: "Homeowner, Nairobi",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      quote: "Their stone-coated tiles transformed our commercial building. Highly recommend their durable and aesthetic solutions.",
      author: "John Smith",
      title: "Developer, Mombasa",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ]);

  const projectItems: ProjectItem[] = gallery.length > 0 
    ? gallery.map(item => ({
        id: item.id,
        image_url: item.image_url,
        title: item.title,
        description: item.description,
        category: item.category
      }))
    : [
        { id: 1, image_url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop", title: "Modern Residential Project", category: "Residential" },
        { id: 2, image_url: "https://images.unsplash.com/photo-1517057013111-01053b2156a6?w=800&h=600&fit=crop", title: "Commercial Building Roofing", category: "Commercial" },
        { id: 3, image_url: "https://images.unsplash.com/photo-1542382257-809e69602741?w=800&h=600&fit=crop", title: "Industrial Warehouse Solution", category: "Industrial" },
        { id: 4, image_url: "https://images.unsplash.com/photo-1523987355523-c7b0b2871d37?w=800&h=600&fit=crop", title: "Elegant Tile Profile Installation", category: "Residential" },
      ];

  const featuredProducts = products.filter(p => p.is_featured).slice(0, 6);

  // Auto-rotate hero slides
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Premium Featured Product Card Component
  const FeaturedProductCard = ({ product, index }: { product: Product; index: number }) => {
    const primaryImage = product.images?.[0]?.image_url || product.image_url || "https://via.placeholder.com/600x400?text=Product";
    const categoryName = product.category?.name || "Roofing Material";
    
    return (
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl",
          index % 2 === 0 ? "lg:col-span-1" : "lg:col-span-1",
          theme === "dark" ? "bg-[#152b55]/40" : "bg-white/80"
        )}
      >
        {/* Image Container with Overlay */}
        <div className="relative h-80 overflow-hidden bg-gradient-to-br from-[#2952a3]/20 to-[#d4a017]/10">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Premium Gradient Overlay */}
          <div className={cn(
            "absolute inset-0 transition-all duration-500",
            theme === "dark"
              ? "bg-gradient-to-t from-[#050d1a] via-[#050d1a]/40 to-transparent group-hover:from-[#050d1a]/80"
              : "bg-gradient-to-t from-white via-white/20 to-transparent group-hover:from-[#0a1628]/60"
          )} />

          {/* Category Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#2952a3]/90 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} />
              {categoryName}
            </span>
          </div>

          {/* Featured Badge */}
          {product.is_featured && (
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#d4a017]/90 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                <Star size={12} fill="currentColor" />
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="relative z-10 p-6 lg:p-8">
          <h3 className={cn(
            "text-xl lg:text-2xl font-black mb-2 line-clamp-2 transition-colors duration-300",
            theme === "dark" ? "text-white group-hover:text-[#f0c94a]" : "text-[#0a1628] group-hover:text-[#2952a3]"
          )}>
            {product.name}
          </h3>

          <p className={cn(
            "text-sm mb-4 line-clamp-2",
            theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]"
          )}>
            {product.description || "Premium quality roofing solution designed for durability and aesthetic appeal."}
          </p>

          {/* Price Section */}
          <div className="mb-6 pb-6 border-b border-white/10">
            <div className={cn(
              "text-2xl font-black",
              theme === "dark" ? "text-[#f0c94a]" : "text-[#d4a017]"
            )}>
              From KES {Number(product.price_from).toLocaleString()}
              {product.price_to && (
                <span className={cn("text-sm font-semibold ml-2", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
                  to {Number(product.price_to).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              to={`/products/${product.slug || product.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2952a3] to-[#1e3d7a] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#2952a3]/40 transition-all duration-300 group/btn text-sm"
            >
              View Details
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about: ${product.name}. Price from: KES ${Number(product.price_from).toLocaleString()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-all duration-300 group/btn text-sm"
            >
              <MessageCircle size={16} />
              Get Quote
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
      {/* ═══════════════════════════════════════════════════════════════════
          PREMIUM HERO SECTION
          ═══════════════════════════════════════════════════════════════════ */}
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
              {/* Background Image with Premium Effects */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${slide.image_url}')`,
                }}
              />

              {/* Multi-layer Premium Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#050d1a]/95 via-[#050d1a]/70 to-[#050d1a]/40" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050d1a]/60" />

              {/* Animated Accent Lines */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-50" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-3xl animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a017]/20 border border-[#d4a017]/40 text-[#f0c94a] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                      <Sparkles size={14} />
                      Premium Roofing Solutions
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-[#b8c1d9] mb-8 leading-relaxed max-w-2xl">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to={slide.link_url || "/products"}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2952a3] to-[#1e3d7a] text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-[#2952a3]/40 transition-all duration-300 group text-lg"
                      >
                        {slide.buttonText || "Explore Products"}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <a
                        href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about your roofing products.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#1ebe5d] transition-all duration-300 shadow-lg shadow-[#25D366]/30 text-lg"
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
          {heroSlides.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 backdrop-blur-sm",
                    index === activeSlide
                      ? "w-8 bg-[#d4a017]"
                      : "w-2 bg-white/40 hover:bg-white/60"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-white/50">
            <ChevronDown size={16} className="animate-bounce" />
          </div>
        </div>

        {/* Premium Stats Bar */}
        <div className={cn(
          "relative z-10 py-12 backdrop-blur-sm",
          theme === "dark" ? "bg-[#0a1628]/80 border-b border-white/5" : "bg-[#f8fafc]/80 border-b border-[#dde3f0]"
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, i) => (
                <div key={i} className="group">
                  <stat.icon size={40} className="text-[#2952a3] mb-3 mx-auto group-hover:text-[#d4a017] transition-colors" />
                  <div className={cn("text-3xl font-black", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                    {stat.value}
                  </div>
                  <div className={cn("text-sm uppercase tracking-wider font-semibold mt-2", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TRUST & ASSURANCE SECTION
          ═══════════════════════════════════════════════════════════════════ */}
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
              <div key={i} className="flex items-center gap-3 group">
                <div className="flex-shrink-0 p-3 rounded-lg bg-[#2952a3]/10 group-hover:bg-[#d4a017]/10 transition-colors">
                  <item.icon size={24} className="text-[#2952a3] group-hover:text-[#d4a017] transition-colors" />
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

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURED PRODUCTS SECTION - Premium Image-Focused Layout
          ═══════════════════════════════════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className={cn("py-24", theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-20 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2952a3]/10 border border-[#2952a3]/20 text-[#2952a3] text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles size={14} />
                Our Collection
              </div>
              <h2 className={cn("text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                Featured Roofing Systems
              </h2>
              <p className={cn("text-lg md:text-xl max-w-2xl mx-auto", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
                Premium-grade materials engineered for durability, aesthetics, and performance. Discover our most popular roofing solutions.
              </p>
            </div>

            {/* Premium Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {featuredProducts.map((product, index) => (
                <FeaturedProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* View All CTA */}
            <div className="mt-16 text-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2952a3] to-[#1e3d7a] text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-[#2952a3]/40 transition-all duration-300 group text-lg"
              >
                View All Products
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          WHY CHOOSE MRM SECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <section className={cn("py-24", theme === "dark" ? "bg-[#0a1628]" : "bg-[#f8fafc]")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a017]/10 border border-[#d4a017]/20 text-[#d4a017] text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles size={14} />
                Why Choose Us
              </div>
              <h2 className={cn("text-4xl md:text-5xl font-black mb-6 leading-tight", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                Premium Quality, Trusted Service
              </h2>
              <p className={cn("text-lg mb-8 leading-relaxed", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
                MRM Mabati Rolling Mills is Kenya's leading supplier of premium roofing materials. With over 20 years of industry experience, we deliver excellence in every product and service.
              </p>

              <div className="space-y-4">
                {[
                  "ISO Certified manufacturing process",
                  "Premium stone-coated and corrugated materials",
                  "Fast nationwide delivery network",
                  "Expert technical support and consultation",
                  "Competitive pricing without compromising quality",
                  "Warranty coverage on all products",
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 size={20} className="text-[#2952a3]" />
                    </div>
                    <span className={cn("text-lg font-semibold", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2952a3] text-white font-bold rounded-xl hover:bg-[#1e3d7a] transition-colors text-lg"
                >
                  Learn More
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to know more about your company and services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-colors text-lg"
                >
                  <MessageCircle size={20} />
                  Chat with Us
                </a>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Award, title: "20+ Years", desc: "Industry Experience" },
                { icon: Users, title: "10,000+", desc: "Happy Customers" },
                { icon: Truck, title: "Fast", desc: "Nationwide Delivery" },
                { icon: Shield, title: "ISO", desc: "Certified Quality" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-6 rounded-2xl text-center group hover:shadow-lg transition-all duration-300",
                    theme === "dark" ? "bg-[#152b55]/50 hover:bg-[#152b55]" : "bg-white hover:shadow-xl"
                  )}
                >
                  <feature.icon size={36} className="text-[#2952a3] mx-auto mb-3 group-hover:text-[#d4a017] transition-colors" />
                  <h3 className={cn("font-black text-xl mb-1", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                    {feature.title}
                  </h3>
                  <p className={cn("text-sm", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CUSTOMER PROJECTS & INSPIRATION GALLERY
          ═══════════════════════════════════════════════════════════════════ */}
      <section className={cn("py-24", theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2952a3]/10 border border-[#2952a3]/20 text-[#2952a3] text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles size={14} />
              Our Work
            </div>
            <h2 className={cn("text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
              Customer Projects & Inspiration
            </h2>
            <p className={cn("text-lg md:text-xl max-w-2xl mx-auto", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
              See our premium roofing solutions in action across Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectItems.map((item) => (
              <Link
                key={item.id}
                to="/gallery"
                className="group relative aspect-video rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={cn(
                  "absolute inset-0 transition-all duration-500",
                  theme === "dark"
                    ? "bg-gradient-to-t from-[#050d1a] via-[#050d1a]/30 to-transparent group-hover:from-[#050d1a]/90"
                    : "bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90"
                )} />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-[#d4a017] transition-colors">{item.title}</h3>
                  {item.category && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#2952a3]/80 text-white uppercase tracking-wider inline-block">
                      {item.category}
                    </span>
                  )}
                  <p className="text-sm mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description || "View project details"}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {projectItems.length === 0 && (
            <div className={cn(
              "py-20 text-center rounded-3xl border-2 border-dashed",
              theme === "dark" ? "bg-[#152b55]/20 border-[#2952a3]/20" : "bg-[#f8fafc] border-[#dde3f0]"
            )}>
              <ImageIcon size={48} className={cn("mx-auto mb-4", theme === "dark" ? "text-[#2952a3]/40" : "text-[#dde3f0]")} />
              <p className={cn("font-medium", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>No gallery images found. Add some from the admin panel!</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIALS SECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <section className={cn("py-24", theme === "dark" ? "bg-[#0a1628]" : "bg-[#f8fafc]")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a017]/10 border border-[#d4a017]/20 text-[#d4a017] text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles size={14} />
              Client Testimonials
            </div>
            <h2 className={cn("text-4xl md:text-5xl font-black mb-4 leading-tight", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
              What Our Clients Say
            </h2>
            <p className={cn("text-lg", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
              Trusted by homeowners and businesses across Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className={cn(
                "p-8 lg:p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group",
                theme === "dark" ? "bg-[#152b55]/60 hover:bg-[#152b55]" : "bg-white hover:shadow-2xl"
              )}>
                <div className="flex items-start gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={18} fill="#d4a017" className="text-[#d4a017]" />
                  ))}
                </div>
                <p className={cn("text-lg italic mb-6 leading-relaxed", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#2952a3]"
                  />
                  <div>
                    <div className={cn("font-bold text-lg", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                      {testimonial.author}
                    </div>
                    <div className={cn("text-sm", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PREMIUM CALL-TO-ACTION SECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <section className={cn(
        "py-24 relative overflow-hidden",
        theme === "dark" ? "bg-gradient-to-r from-[#0a1628] via-[#152b55] to-[#0a1628]" : "bg-gradient-to-r from-[#2952a3] via-[#1e3d7a] to-[#2952a3]"
      )}>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4a017]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2952a3]/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <Sparkles size={14} />
            Ready to Get Started?
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Transform Your Roof Today
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Contact us today for a free consultation and premium quote. Our expert team is ready to help you find the perfect roofing solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2952a3] font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-white/20 text-lg group"
            >
              <Phone size={20} />
              Contact Us
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to get a free consultation and quote for my roofing project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-all duration-300 shadow-lg shadow-[#25D366]/40 text-lg group"
            >
              <MessageCircle size={20} />
              WhatsApp Us
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
