import React, { useEffect, useState } from "react";
import SEOHead from "../components/seo/SEOHead";
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
  Layers,
  ShoppingBag,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsApi, bannersApi, siteContentApi, galleryApi, getPrimaryImage } from "../lib/api";
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
          image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
          link_url: "/products",
          buttonText: "Shop Now",
        },
      ];

  const stats: Stat[] = getSiteContentValue("homepage_stats", [
    { icon: Hammer, value: "1000+", label: "Projects Completed" },
    { icon: Users, value: "500+", label: "Satisfied Clients" },
    { icon: MapPin, value: "Nairobi & Mombasa", label: "Our Locations" },
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
      ];

  const featuredProducts = products.filter(p => p.is_featured).slice(0, 6);
  // If no featured products, show first 6 products to ensure showcase
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  // Auto-rotate hero slides
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Premium Product Card Component - Image Focused
  const ProductCard = ({ product }: { product: Product }) => {
    const primaryImage = getPrimaryImage(product);
    const categoryName = product.category?.name || "Roofing Material";
    
    return (
      <div
        className={cn(
          "group relative overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl h-[450px]",
          theme === "dark" ? "bg-[#152b55]/40" : "bg-gray-50"
        )}
      >
        {/* Full Height Background Image */}
        <img
          src={primaryImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/40 via-transparent to-transparent opacity-40" />

        {/* Content Overlay */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <span className="inline-block px-3 py-1 rounded-full bg-[#d4a017] text-white text-[10px] font-bold uppercase tracking-widest mb-3">
              {categoryName}
            </span>
            <h3 className="text-2xl font-black text-white mb-2 leading-tight">
              {product.name}
            </h3>
            <p className="text-sm text-gray-300 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {product.description || "Premium quality roofing solution designed for maximum durability and aesthetic appeal."}
            </p>
          </div>

          <div className="flex items-center justify-between items-end border-t border-white/10 pt-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Starting From</p>
              <p className="text-xl font-black text-[#f0c94a]">
                KES {Number(product.price_from).toLocaleString()}
              </p>
            </div>
            <Link
              to={`/products/${product.slug || product.id}`}
              className="p-3 bg-white text-[#0a1628] rounded-full hover:bg-[#d4a017] hover:text-white transition-all duration-300 shadow-lg"
            >
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
    <SEOHead
      title="MRM Mabati Rolling Mills — Premium Roofing Materials in Kenya"
      description="Kenya's leading supplier of premium roofing materials. Box profile, corrugated, tile profile, and stone-coated mabati sheets. Quality roofing solutions for residential and commercial projects. Get a free quote today."
      canonicalUrl="/"
    />
    <div className={cn(theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
      {/* ═══════════════════════════════════════════════════════════════════
          PREMIUM HERO SECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-20 overflow-hidden">
        <div className="relative h-[600px] md:h-[700px] lg:h-[850px] w-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                index === activeSlide ? "opacity-100" : "opacity-0"
              )}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-100 group-active:scale-110"
                style={{
                  backgroundImage: `url('${slide.image_url}')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050d1a]/90 via-[#050d1a]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050d1a]/40" />

              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a017]/20 border border-[#d4a017]/40 text-[#f0c94a] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm animate-fade-in">
                      <Sparkles size={14} />
                      Kenya's Premier Roofing Partner
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[0.9] animate-slide-up">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-2xl animate-fade-in delay-200">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
                      <Link
                        to={slide.link_url || "/products"}
                        className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#d4a017] text-white font-black rounded-full hover:bg-[#b88a14] hover:shadow-2xl hover:shadow-[#d4a017]/40 transition-all duration-300 group text-lg"
                      >
                        Explore Products
                        <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
                      </Link>
                      <a
                        href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about your roofing products.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-full hover:bg-white hover:text-[#0a1628] transition-all duration-300 text-lg"
                      >
                        <MessageCircle size={20} />
                        Get a Quote
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Indicators */}
          <div className="absolute bottom-12 left-8 md:left-12 flex items-center gap-4 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  index === activeSlide ? "w-12 bg-[#d4a017]" : "w-6 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CATEGORIES SECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <section className={cn("py-12 border-b", theme === "dark" ? "bg-[#0a1628] border-white/5" : "bg-gray-50 border-gray-100")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              { name: "Box Profile", icon: Layers, slug: "box-profile" },
              { name: "Corrugated", icon: ImageIcon, slug: "corrugated" },
              { name: "Tile Profile", icon: Star, slug: "tile" },
              { name: "Stone Coated", icon: Sparkles, slug: "stone" },
              { name: "Accessories", icon: ShoppingBag, slug: "accessories" },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={`/products?search=${cat.slug}`}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 group",
                  theme === "dark" ? "bg-[#152b55]/40 hover:bg-[#d4a017]" : "bg-white hover:bg-[#2952a3] shadow-sm"
                )}
              >
                <cat.icon size={20} className={cn(
                  "transition-colors",
                  theme === "dark" ? "text-[#d4a017] group-hover:text-white" : "text-[#2952a3] group-hover:text-white"
                )} />
                <span className={cn(
                  "font-bold transition-colors",
                  theme === "dark" ? "text-white" : "text-[#0a1628] group-hover:text-white"
                )}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          IMMEDIATE PRODUCT SHOWCASE
          ═══════════════════════════════════════════════════════════════════ */}
      <section className={cn("py-24 relative overflow-hidden", theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#d4a017]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-[#2952a3]/5 blur-[100px] rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#2952a3]/10 text-[#2952a3] text-[10px] font-bold uppercase tracking-widest mb-4">
                <Layers size={14} />
                Our Roofing Systems
              </div>
              <h2 className={cn("text-4xl md:text-6xl font-black leading-tight", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                Premium Product Showcase
              </h2>
            </div>
            <Link
              to="/products"
              className={cn(
                "inline-flex items-center gap-2 font-black text-lg group",
                theme === "dark" ? "text-[#f0c94a]" : "text-[#2952a3]"
              )}
            >
              View Full Catalog
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No products found. Please check back later!</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TRUST & ASSURANCE - COMPACT
          ═══════════════════════════════════════════════════════════════════ */}
      <section className={cn("py-16 border-y", theme === "dark" ? "bg-[#0a1628] border-white/5" : "bg-gray-50 border-gray-100")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: Shield, label: "ISO Certified", value: "Quality Assured", color: "text-blue-500" },
              { icon: Truck, label: "Fast Delivery", value: "Across Kenya", color: "text-green-500" },
              { icon: Zap, label: "Expert Support", value: "24/7 Available", color: "text-yellow-500" },
              { icon: CheckCircle2, label: "Warranty", value: "Guaranteed Protection", color: "text-purple-500" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="mb-4 p-4 rounded-2xl bg-white shadow-sm group-hover:shadow-md transition-shadow">
                  <item.icon size={32} className={item.color} />
                </div>
                <h4 className={cn("text-xs font-black uppercase tracking-widest mb-1", theme === "dark" ? "text-gray-500" : "text-gray-400")}>
                  {item.label}
                </h4>
                <p className={cn("font-bold", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          WHY CHOOSE MRM - VISUAL FOCUS
          ═══════════════════════════════════════════════════════════════════ */}
      <section className={cn("py-24", theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1632759145351-1d592919f522?w=800&q=80"
                  alt="Modern Construction"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#d4a017] rounded-[30px] p-8 flex flex-col justify-center text-white shadow-2xl hidden md:flex">
                <p className="text-5xl font-black mb-2">20+</p>
                <p className="text-lg font-bold leading-tight">Years of Industry Excellence</p>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#d4a017]/10 text-[#d4a017] text-[10px] font-bold uppercase tracking-widest mb-6">
                <Award size={14} />
                The Industry Leader
              </div>
              <h2 className={cn("text-4xl md:text-5xl font-black mb-8 leading-tight", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                Setting the Standard in Roofing Technology
              </h2>
              <p className={cn("text-lg mb-10 leading-relaxed", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                MRM Mabati Rolling Mills is Kenya's leading supplier of premium roofing materials. We combine decades of experience with cutting-edge manufacturing to deliver roofs that last a lifetime.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[
                  "ISO Certified Process",
                  "Premium Raw Materials",
                  "Advanced Coating Tech",
                  "Nationwide Logistics",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#d4a017]" />
                    <span className={cn("font-bold", theme === "dark" ? "text-white" : "text-[#0a1628]")}>{text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/about"
                  className="px-8 py-4 bg-[#2952a3] text-white font-black rounded-xl hover:bg-[#1e3d7a] transition-all"
                >
                  Our Story
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  className="px-8 py-4 bg-[#25D366] text-white font-black rounded-xl hover:bg-[#1ebe5d] transition-all flex items-center gap-2"
                >
                  <MessageCircle size={20} />
                  Chat with Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          GALLERY - INSPIRATION
          ═══════════════════════════════════════════════════════════════════ */}
      <section className={cn("py-24", theme === "dark" ? "bg-[#0a1628]" : "bg-gray-50")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={cn("text-4xl md:text-5xl font-black mb-4", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
              Roofing Inspiration
            </h2>
            <p className={cn("text-lg max-w-2xl mx-auto", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Explore our recent projects and see how MRM transforms homes across Kenya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectItems.map((item, i) => (
              <Link
                key={item.id}
                to="/gallery"
                className={cn(
                  "group relative overflow-hidden rounded-3xl aspect-[4/3] shadow-lg",
                  i === 1 ? "md:scale-105 z-10" : ""
                )}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#f0c94a] mb-1">{item.category}</p>
                  <h3 className="text-xl font-black">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA - GET STARTED
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden bg-[#0a1628]">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1517057013111-01053b2156a6?w=1600&q=80"
            alt="Roofing Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[#0a1628]/90" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
            Ready to Transform Your Roof?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Get in touch with our experts today for a free consultation and a premium quote tailored to your project.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/contact"
              className="px-10 py-5 bg-white text-[#0a1628] font-black rounded-full hover:bg-[#f0c94a] transition-all text-lg"
            >
              Contact Us Now
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              className="px-10 py-5 bg-[#25D366] text-white font-black rounded-full hover:bg-[#1ebe5d] transition-all flex items-center gap-3 text-lg"
            >
              <MessageCircle size={24} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
