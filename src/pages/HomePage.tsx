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

  const ProductShowcase = ({ product, reverse = false }: { product: Product; reverse?: boolean }) => (
    <div
      className={cn(
        "relative flex flex-col lg:flex-row items-center justify-center min-h-[600px] overflow-hidden group",
        reverse ? "lg:flex-row-reverse" : "",
        theme === "dark" ? "bg-[#0a1628]" : "bg-white"
      )}
    >
      <div className="absolute inset-0 z-0">
        <img
          src={product.images[0]?.image_url || product.image_url || "https://via.placeholder.com/1920x1080?text=Product+Image"}
          alt={product.name}
          className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className={cn(
          "absolute inset-0",
          theme === "dark" ? "bg-gradient-to-t from-[#0a1628] via-transparent to-[#0a1628]/50" : "bg-gradient-to-t from-white via-transparent to-white/50"
        )} />
      </div>

      <div className={cn(
        "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12",
        reverse ? "lg:justify-end" : "lg:justify-start"
      )}>
        <div className={cn(
          "lg:w-1/2 text-center lg:text-left",
          reverse ? "lg:pr-12" : "lg:pl-12"
        )}>
          <h2 className={cn(
            "text-4xl md:text-5xl font-black mb-4 leading-tight",
            theme === "dark" ? "text-white" : "text-[#0a1628]"
          )}>
            {product.name}
          </h2>
          <p className={cn(
            "text-lg md:text-xl mb-6",
            theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]"
          )}>
            {product.description || "Discover premium roofing solutions designed for durability and aesthetic appeal."}
          </p>
          <div className={cn(
            "text-2xl font-bold mb-6",
            theme === "dark" ? "text-[#f0c94a]" : "text-[#d4a017]"
          )}>
            From KES {Number(product.price_from).toLocaleString()}
            {product.price_to && ` – ${Number(product.price_to).toLocaleString()}`}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to={`/products/${product.slug || product.id}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2952a3] text-white font-bold rounded-xl hover:bg-[#1e3d7a] transition-colors shadow-lg shadow-[#2952a3]/30 text-lg"
            >
              View Details
              <ArrowRight size={20} />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about your product: ${product.name}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-colors shadow-lg shadow-[#25D366]/30 text-lg"
            >
              <MessageCircle size={20} />
              Request Quote
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn(theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
      {/* Hero Slider */}
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
                  backgroundImage: `url('${slide.image_url}')`,
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
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to={slide.link_url || "/products"}
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
          {heroSlides.length > 1 && (
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
          )}

          {/* Scroll indicator */}
          <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-white/50">
            <ChevronDown size={16} className="animate-bounce" />
          </div>
        </div>

        {/* Stats Bar */}
        <div className={cn(
          "relative z-10 py-8",
          theme === "dark" ? "bg-[#0a1628]" : "bg-[#f8fafc]"
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <stat.icon size={36} className="text-[#2952a3] mb-2" />
                  <div className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                    {stat.value}
                  </div>
                  <div className={cn("text-sm uppercase tracking-wider", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
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

      {/* Featured Roofing Systems (Products) - Showroom Style */}
      {featuredProducts.length > 0 && (
        <section className={cn("py-20", theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className={cn("text-4xl md:text-5xl font-black mb-4", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                Featured Roofing Systems
              </h2>
              <p className={cn("text-lg", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
                Professional-grade materials for every project
              </p>
            </div>

            <div className="space-y-24">
              {featuredProducts.map((product, index) => (
                <ProductShowcase key={product.id} product={product} reverse={index % 2 !== 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Roofing Inspiration Gallery */}
      <section className={cn("py-20", theme === "dark" ? "bg-[#0a1628]" : "bg-[#f8fafc]")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className={cn("text-4xl md:text-5xl font-black mb-4", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
              Roofing Inspiration Gallery
            </h2>
            <p className={cn("text-lg", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
              See our premium roofing solutions in action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectItems.map((item) => (
              <div key={item.id} className="relative aspect-video rounded-2xl overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-bold text-xl mb-1">{item.title}</h3>
                  {item.category && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#2952a3]/80 text-white uppercase tracking-wider">
                      {item.category}
                    </span>
                  )}
                  <p className="text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description || "View project details"}
                  </p>
                </div>
                <Link to="/gallery" className="absolute inset-0 z-10" aria-label={`View ${item.title} project`} />
              </div>
            ))}
          </div>
          {projectItems.length === 0 && (
            <div className="col-span-full py-20 text-center bg-[#f8fafc] rounded-3xl border-2 border-dashed border-[#dde3f0]">
              <ImageIcon size={48} className="mx-auto text-[#dde3f0] mb-4" />
              <p className="text-[#6b7a9e] font-medium">No gallery images found. Add some from the admin panel!</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className={cn("py-20", theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className={cn("text-4xl md:text-5xl font-black mb-4", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
              What Our Clients Say
            </h2>
            <p className={cn("text-lg", theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]")}>
              Trusted by homeowners and businesses across Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className={cn(
                "p-8 rounded-2xl shadow-lg",
                theme === "dark" ? "bg-[#152b55]" : "bg-[#f8fafc]"
              )}>
                <p className={cn("text-xl italic mb-6 leading-relaxed", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#2952a3]"
                  />
                  <div>
                    <div className={cn("font-bold", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
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

      {/* Call to Action */}
      <section className={cn("py-20", theme === "dark" ? "bg-[#0a1628]" : "bg-[#2952a3]")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Ready for a Durable Roof?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Contact us today for a free consultation and quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2952a3] font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg shadow-white/20 text-lg"
            >
              <Phone size={20} />
              Contact Us
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to get a free consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-colors shadow-lg shadow-[#25D366]/30 text-lg"
            >
              <MessageCircle size={20} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
