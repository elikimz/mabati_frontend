import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Truck,
  Award,
  ChevronRight,
  Star,
  MessageCircle,
  Package,
  Phone,
  CheckCircle,
  Building2,
  Home,
  Wrench,
  Layers,
  Droplets,
  ChevronDown,
} from "lucide-react";
import { bannersApi, productsApi, formatPriceRange, getPrimaryImage } from "../lib/api";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254788873611";
const PHONE = "0788873611";

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection: React.FC = () => {
  const { data: heroBanners } = useQuery({
    queryKey: ["banners", "hero"],
    queryFn: () => bannersApi.list("hero"),
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = heroBanners && heroBanners.length > 0
    ? heroBanners.map((b: any) => ({
        title: b.title,
        subtitle: b.subtitle,
        image: b.image_url,
        link: b.link_url || "/products",
      }))
    : [
        {
          title: "Premium Roofing Solutions Built to Last",
          subtitle: "Kenya's most trusted supplier of high-quality mabati sheets, gutters, ridge caps and roofing accessories for homes and commercial buildings.",
          image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80&auto=format&fit=crop",
          link: "/products",
        },
        {
          title: "Industrial Strength. Timeless Quality.",
          subtitle: "Box profile, corrugated, tile profile and stone-coated roofing sheets engineered for the African climate.",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80&auto=format&fit=crop",
          link: "/products",
        },
        {
          title: "Build With Confidence",
          subtitle: "From residential homes to large commercial projects — MRM Mabati Rolling Mills delivers quality you can rely on.",
          image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=80&auto=format&fit=crop",
          link: "/products",
        },
      ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative h-screen min-h-[700px] max-h-[900px] flex items-center overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}
        >
          <img src={s.image} alt="MRM Mabati" className="w-full h-full object-cover scale-105" />
        </div>
      ))}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050d1a]/95 via-[#0a1628]/80 to-[#0a1628]/30" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050d1a]/60 via-transparent to-transparent" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a017]/20 border border-[#d4a017]/40 text-[#f0c94a] text-xs font-bold uppercase tracking-widest mb-8">
            <Star size={12} className="fill-[#f0c94a]" />
            Kenya's Most Trusted Roofing Brand
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
            {slide.title}
          </h1>
          <p className="text-xl text-[#b8c1d9] mb-10 leading-relaxed max-w-2xl">
            {slide.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#2952a3] text-white font-bold rounded-2xl hover:bg-[#1e3d7a] transition-all shadow-2xl shadow-[#2952a3]/40 group text-base"
            >
              <Package size={20} />
              View Products
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about your roofing products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#1ebe5d] transition-all shadow-2xl shadow-[#25D366]/30 text-base"
            >
              <MessageCircle size={20} />
              Order via WhatsApp
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-base"
            >
              Request Quote
            </Link>
          </div>
          <div className="flex flex-wrap gap-8">
            {[
              { value: "500+", label: "Products" },
              { value: "10K+", label: "Happy Customers" },
              { value: "15+", label: "Years Experience" },
              { value: "24/7", label: "WhatsApp Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-[#8e9bbf] font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all ${i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2 text-white/50">
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
};

// ─── Trust Bar ────────────────────────────────────────────────────────────────
const TrustBar: React.FC = () => (
  <section className="bg-[#0a1628] border-b border-white/10 py-5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {[
          { icon: <ShieldCheck size={18} />, text: "Quality Guaranteed" },
          { icon: <Truck size={18} />, text: "Nationwide Delivery" },
          { icon: <Award size={18} />, text: "ISO Certified Materials" },
          { icon: <Clock size={18} />, text: "Fast Turnaround" },
          { icon: <Phone size={18} />, text: "Expert Consultation" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-[#8e9bbf] text-sm font-medium">
            <span className="text-[#d4a017]">{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Featured Roofing Solutions ───────────────────────────────────────────────
const RoofingSolutions: React.FC = () => {
  const { data: featuredBanners } = useQuery({
    queryKey: ["banners", "featured"],
    queryFn: () => bannersApi.list("featured"),
  });

  const solutions = featuredBanners && featuredBanners.length > 0
    ? featuredBanners.map((b: any, i: number) => ({
        icon: [<Layers size={28} />, <Home size={28} />, <Building2 size={28} />, <Droplets size={28} />][i % 4],
        title: b.title,
        desc: b.subtitle,
        image: b.image_url,
        link: b.link_url || "/products",
      }))
    : [
        {
          icon: <Layers size={28} />,
          title: "Box Profile Sheets",
          desc: "Strong, modern box profile mabati for contemporary homes and commercial buildings. Available in 28G and 30G.",
          image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
          link: "/products",
        },
        {
          icon: <Home size={28} />,
          title: "Corrugated Mabati",
          desc: "Classic corrugated iron sheets — durable, affordable and widely used across Kenya for residential roofing.",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
          link: "/products",
        },
        {
          icon: <Building2 size={28} />,
          title: "Tile Profile Sheets",
          desc: "Premium tile-effect roofing sheets that give your building the look of clay tiles at a fraction of the cost.",
          image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
          link: "/products",
        },
        {
          icon: <Droplets size={28} />,
          title: "Gutters & Accessories",
          desc: "Complete your roofing system with our range of gutters, ridge caps, flashings and roofing accessories.",
          image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
          link: "/products",
        },
      ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2952a3]/10 text-[#2952a3] text-xs font-bold uppercase tracking-widest mb-4">
            Our Solutions
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0a1628] leading-tight mb-4">
            Featured Roofing Solutions
          </h2>
          <p className="text-lg text-[#6b7a9e] leading-relaxed">
            From residential homes to large commercial projects, we have the right roofing solution for every need and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.slice(0, 4).map((sol, i) => (
            <Link
              key={sol.title}
              to={sol.link}
              className={`group relative overflow-hidden rounded-3xl ${i === 0 ? "md:row-span-2" : ""}`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? "h-full min-h-[400px]" : "h-64"}`}>
                <img
                  src={sol.image}
                  alt={sol.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/90 via-[#050d1a]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="w-12 h-12 rounded-xl bg-[#d4a017]/20 border border-[#d4a017]/40 flex items-center justify-center text-[#f0c94a] mb-4">
                    {sol.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">{sol.title}</h3>
                  <p className="text-[#b8c1d9] text-sm leading-relaxed mb-4">{sol.desc}</p>
                  <div className="inline-flex items-center gap-2 text-[#d4a017] font-bold text-sm group-hover:gap-3 transition-all">
                    Explore Range <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Best Sellers ─────────────────────────────────────────────────────────────
const BestSellers: React.FC = () => {
  const { data: featuredProducts } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productsApi.featured(8),
  });

  return (
    <section className="py-28 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2952a3]/10 text-[#2952a3] text-xs font-bold uppercase tracking-widest mb-4">
              Top Picks
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a1628] leading-tight">
              Best Sellers
            </h2>
            <p className="text-[#6b7a9e] mt-2 text-lg">Top-rated roofing materials this month</p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-[#0a1628] text-white font-bold rounded-xl hover:bg-[#152b55] transition-colors text-sm"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {!featuredProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-[#dde3f0]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug || product.id}`}
                className="group bg-white rounded-3xl border border-[#dde3f0] overflow-hidden hover:shadow-2xl hover:shadow-[#2952a3]/10 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f0f3f9]">
                  <img
                    src={getPrimaryImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {product.is_featured && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#d4a017] text-white text-xs font-bold rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold text-[#2952a3] uppercase tracking-wider mb-1">
                    {product.category?.name}
                  </div>
                  <h4 className="font-bold text-[#0a1628] group-hover:text-[#2952a3] transition-colors mb-2 line-clamp-2">
                    {product.name}
                  </h4>
                  {product.gauge && (
                    <span className="inline-block px-2 py-0.5 bg-[#f0f3f9] text-[#3d4663] text-xs rounded-full font-medium mb-3">
                      {product.gauge}
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-base font-black text-[#0a1628]">
                      {formatPriceRange(product)}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#2952a3]/10 flex items-center justify-center text-[#2952a3] group-hover:bg-[#2952a3] group-hover:text-white transition-colors">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0a1628] text-white font-bold rounded-xl hover:bg-[#152b55] transition-colors"
          >
            View All Products <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── Product Categories ───────────────────────────────────────────────────────
const ProductCategories: React.FC = () => {
  const categories = [
    { name: "Box Profile", icon: "🏗️", desc: "Modern & durable", link: "/products?search=box+profile" },
    { name: "Corrugated", icon: "🏠", desc: "Classic & affordable", link: "/products?search=corrugated" },
    { name: "Tile Profile", icon: "🏛️", desc: "Elegant appearance", link: "/products?search=tile" },
    { name: "Stone Coated", icon: "💎", desc: "Premium finish", link: "/products?search=stone" },
    { name: "Gutters", icon: "💧", desc: "Complete drainage", link: "/products?search=gutter" },
    { name: "Ridge Caps", icon: "⛺", desc: "Perfect finishing", link: "/products?search=ridge" },
    { name: "Flashings", icon: "🔩", desc: "Watertight seals", link: "/products?search=flashing" },
    { name: "Accessories", icon: "🔧", desc: "All fittings", link: "/products?search=accessories" },
  ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2952a3]/10 text-[#2952a3] text-xs font-bold uppercase tracking-widest mb-4">
            Browse by Category
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0a1628] leading-tight">
            Product Categories
          </h2>
          <p className="text-[#6b7a9e] mt-3 text-lg max-w-xl mx-auto">
            Find exactly what you need from our comprehensive range of roofing products
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group flex flex-col items-center p-5 bg-[#f8fafc] rounded-2xl border border-[#dde3f0] hover:bg-[#2952a3] hover:border-[#2952a3] transition-all duration-300 text-center"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <div className="text-sm font-bold text-[#0a1628] group-hover:text-white transition-colors">{cat.name}</div>
              <div className="text-xs text-[#6b7a9e] group-hover:text-white/70 transition-colors mt-0.5">{cat.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Why Choose MRM ───────────────────────────────────────────────────────────
const WhyChooseMRM: React.FC = () => {
  const reasons = [
    { icon: <ShieldCheck size={24} />, title: "Quality Guaranteed", desc: "All our products meet international quality standards. We source only from certified steel mills." },
    { icon: <Award size={24} />, title: "15+ Years Experience", desc: "Over a decade of serving Kenyan homeowners, contractors and developers with premium roofing solutions." },
    { icon: <Truck size={24} />, title: "Nationwide Delivery", desc: "We deliver to all major towns across Kenya. Fast, reliable and safe delivery to your construction site." },
    { icon: <Wrench size={24} />, title: "Expert Consultation", desc: "Our roofing specialists will help you choose the right product, gauge and color for your project." },
    { icon: <MessageCircle size={24} />, title: "WhatsApp Ordering", desc: "Order directly on WhatsApp. Get instant quotes, product photos and delivery estimates in minutes." },
    { icon: <CheckCircle size={24} />, title: "Competitive Pricing", desc: "We offer the best prices in the market without compromising on quality. Bulk discounts available." },
  ];

  return (
    <section className="py-28 bg-[#0a1628] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a017]/20 border border-[#d4a017]/40 text-[#f0c94a] text-xs font-bold uppercase tracking-widest mb-6">
              Why MRM
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Why Choose MRM Mabati Rolling Mills?
            </h2>
            <p className="text-[#8e9bbf] text-lg leading-relaxed mb-8">
              We are Kenya's premier roofing materials supplier, committed to delivering quality products and exceptional service on every order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#d4a017] text-[#050d1a] font-bold rounded-xl hover:bg-[#e5b52a] transition-colors"
              >
                About Our Company <ArrowRight size={16} />
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP}?text=Hello MRM, I would like to learn more about your products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                <MessageCircle size={16} /> Chat With Us
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((reason) => (
              <div key={reason.title} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-[#2952a3]/30 flex items-center justify-center text-[#4d79ff] mb-4 group-hover:bg-[#2952a3] group-hover:text-white transition-colors">
                  {reason.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{reason.title}</h3>
                <p className="text-[#6b7a9e] text-sm leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Our Services ─────────────────────────────────────────────────────────────
const OurServices: React.FC = () => {
  const services = [
    { title: "Roofing Material Supply", desc: "Comprehensive supply of all roofing materials including sheets, gutters, ridge caps, flashings and accessories.", icon: <Package size={24} /> },
    { title: "Residential Roofing", desc: "Premium roofing solutions tailored for homes — from simple bungalows to multi-storey residential buildings.", icon: <Home size={24} /> },
    { title: "Commercial Roofing", desc: "Heavy-duty roofing materials for warehouses, factories, shopping centres and commercial developments.", icon: <Building2 size={24} /> },
    { title: "Roofing Consultation", desc: "Free expert advice on product selection, gauge recommendations, color choices and quantity estimation.", icon: <Wrench size={24} /> },
    { title: "Delivery Services", desc: "Reliable delivery to your construction site anywhere in Kenya. We handle the logistics so you can focus on building.", icon: <Truck size={24} /> },
    { title: "Custom Roofing Advice", desc: "Bespoke roofing solutions for unique architectural designs and special project requirements.", icon: <Award size={24} /> },
  ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2952a3]/10 text-[#2952a3] text-xs font-bold uppercase tracking-widest mb-4">
            What We Offer
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0a1628] leading-tight">Our Services</h2>
          <p className="text-[#6b7a9e] mt-3 text-lg max-w-2xl mx-auto">
            Beyond just selling roofing materials, we provide end-to-end support to ensure your project succeeds.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.title} className="group p-8 rounded-3xl border border-[#dde3f0] hover:border-[#2952a3]/30 hover:shadow-xl hover:shadow-[#2952a3]/5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#2952a3]/10 flex items-center justify-center text-[#2952a3] mb-6 group-hover:bg-[#2952a3] group-hover:text-white transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0a1628] mb-3">{service.title}</h3>
              <p className="text-[#6b7a9e] leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Customer Trust Section ───────────────────────────────────────────────────
const CustomerTrust: React.FC = () => {
  const testimonials = [
    { name: "James Mwangi", role: "Homeowner, Nairobi", text: "MRM Mabati delivered exactly what they promised — high-quality box profile sheets on time and at a great price. My roof looks amazing!", rating: 5 },
    { name: "Sarah Kamau", role: "Contractor, Kiambu", text: "I've been buying from MRM for 3 years now. Their products are consistently good and the WhatsApp ordering makes it so easy to get quotes.", rating: 5 },
    { name: "Peter Odhiambo", role: "Developer, Kisumu", text: "Used MRM for a 50-unit residential project. Competitive bulk pricing, quality materials, and reliable delivery. Highly recommended!", rating: 5 },
  ];

  return (
    <section className="py-28 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2952a3]/10 text-[#2952a3] text-xs font-bold uppercase tracking-widest mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0a1628] leading-tight">What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-3xl p-8 border border-[#dde3f0] hover:shadow-xl transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#d4a017] text-[#d4a017]" />
                ))}
              </div>
              <p className="text-[#3d4663] leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2952a3] flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[#0a1628] text-sm">{t.name}</div>
                  <div className="text-xs text-[#6b7a9e]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "10,000+", label: "Happy Customers" },
            { value: "500+", label: "Products Available" },
            { value: "47", label: "Counties Served" },
            { value: "4.9/5", label: "Average Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-white rounded-2xl border border-[#dde3f0]">
              <div className="text-3xl font-black text-[#2952a3] mb-1">{stat.value}</div>
              <div className="text-sm text-[#6b7a9e] font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Contact Section ──────────────────────────────────────────────────────────
const ContactSection: React.FC = () => (
  <section className="py-28 bg-white" id="contact">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-[3rem] overflow-hidden bg-[#0a1628]">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 p-10 md:p-16 lg:p-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a017]/20 border border-[#d4a017]/40 text-[#f0c94a] text-xs font-bold uppercase tracking-widest mb-6">
                Get In Touch
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                Ready to Start Your Roofing Project?
              </h2>
              <p className="text-[#8e9bbf] text-lg leading-relaxed mb-8">
                Contact our roofing experts today for a free consultation, product recommendations and competitive pricing.
              </p>
              <div className="space-y-4">
                <a
                  href={`tel:+254${PHONE.replace(/^0/, "")}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#2952a3] flex items-center justify-center text-white">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[#8e9bbf] font-medium mb-0.5">Call Us</div>
                    <div className="text-white font-bold">{PHONE}</div>
                  </div>
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to get a quote.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center text-white">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[#8e9bbf] font-medium mb-0.5">WhatsApp</div>
                    <div className="text-white font-bold">Order & Enquire on WhatsApp</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8">
              <h3 className="text-xl font-black text-[#0a1628] mb-6">Request a Quote</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border border-[#dde3f0] text-sm focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20" />
                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl border border-[#dde3f0] text-sm focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20" />
                <textarea rows={3} placeholder="Tell us about your roofing project..." className="w-full px-4 py-3 rounded-xl border border-[#dde3f0] text-sm focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 resize-none" />
                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to request a quote.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-6 py-4 bg-[#2952a3] text-white font-bold rounded-xl hover:bg-[#1e3d7a] transition-colors"
                >
                  Send via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const HomePage: React.FC = () => (
  <div className="flex flex-col">
    <HeroSection />
    <TrustBar />
    <RoofingSolutions />
    <BestSellers />
    <ProductCategories />
    <WhyChooseMRM />
    <OurServices />
    <CustomerTrust />
    <ContactSection />
  </div>
);

export default HomePage;
