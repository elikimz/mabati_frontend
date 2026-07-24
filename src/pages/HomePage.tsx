import React from "react";
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
  MessageSquare,
  Package,
} from "lucide-react";
import { bannersApi, productsApi, formatPriceRange, getPrimaryImage } from "../lib/api";

const HomePage: React.FC = () => {
  // Fetch dynamic banners
  const { data: heroBanners } = useQuery({
    queryKey: ["banners", "hero"],
    queryFn: () => bannersApi.list("hero"),
  });

  const { data: featuredBanners } = useQuery({
    queryKey: ["banners", "featured"],
    queryFn: () => bannersApi.list("featured"),
  });

  const { data: featuredProducts } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productsApi.featured(4),
  });

  // Fallback hero data if no banners are added yet
  const activeHero = heroBanners?.[0] || {
    title: "Premium Roofing Solutions Built to Last",
    subtitle: "Quality Mabati products for modern homes and commercial buildings. Durable, stylish, and affordable.",
    image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80&auto=format&fit=crop",
    link_url: "/products"
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeHero.image_url}
            alt="Premium Roofing"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2952a3]/20 border border-[#2952a3]/30 text-[#4d79ff] text-xs font-bold uppercase tracking-wider mb-6">
              <Star size={12} className="fill-[#4d79ff]" />
              Kenya's Most Trusted Roofing Brand
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
              {activeHero.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl">
              {activeHero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={activeHero.link_url || "/products"}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2952a3] text-white font-bold rounded-2xl hover:bg-[#1e3d7a] transition-all shadow-xl shadow-[#2952a3]/30 group"
              >
                Explore Products
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-[#dde3f0] py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Products", value: "500+", icon: <Package className="text-[#2952a3]" /> },
              { label: "Happy Customers", value: "10K+", icon: <Star className="text-amber-400 fill-amber-400" /> },
              { label: "Counties Covered", value: "47", icon: <Truck className="text-emerald-500" /> },
              { label: "Years Experience", value: "10+", icon: <Award className="text-[#2952a3]" /> },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#f0f3f9] flex items-center justify-center group-hover:bg-[#2952a3] group-hover:text-white transition-all">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-black text-[#0a1628]">{stat.value}</div>
                  <div className="text-sm text-[#6b7a9e] font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Featured Section (Iron Sheets Showcase) */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#0a1628] mb-4">
              Our Premium Iron Sheets
            </h2>
            <p className="text-[#6b7a9e] text-lg">
              Explore our wide range of high-quality roofing materials designed for durability and aesthetic appeal.
            </p>
          </div>

          <div className="space-y-24">
            {(featuredBanners && featuredBanners.length > 0 ? featuredBanners : [
              {
                title: "Box Profile Sheets",
                subtitle: "Modern and sleek design, perfect for contemporary homes and industrial buildings. Available in various gauges and colors.",
                image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
                link_url: "/products"
              },
              {
                title: "Versatile Roofing",
                subtitle: "The perfect blend of traditional tile appearance and modern metal durability. Lightweight yet incredibly strong.",
                image_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
                link_url: "/products"
              }
            ]).map((banner: any, i: number) => (
              <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
                <div className="w-full lg:w-1/2">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-[#2952a3]/5 rounded-[2rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-6">
                  <h3 className="text-3xl md:text-4xl font-black text-[#0a1628]">
                    {banner.title}
                  </h3>
                  <p className="text-lg text-[#6b7a9e] leading-relaxed">
                    {banner.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Link
                      to={banner.link_url || "/products"}
                      className="inline-flex items-center gap-2 text-[#2952a3] font-bold hover:gap-3 transition-all group"
                    >
                      View Product Details
                      <ChevronRight size={20} className="text-[#2952a3]" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[#0a1628] mb-2">
                Best Sellers
              </h2>
              <p className="text-[#6b7a9e]">Top-rated roofing materials this month</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-2 text-[#2952a3] font-bold hover:underline">
              View All Products
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts?.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug || product.id}`}
                className="group bg-white rounded-3xl border border-[#dde3f0] p-4 hover:shadow-2xl hover:shadow-[#2952a3]/10 hover:-translate-y-1 transition-all"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-[#f8fafc] mb-4">
                  <img
                    src={getPrimaryImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#2952a3] uppercase tracking-wider">
                    {product.category?.name}
                  </div>
                  <h4 className="font-bold text-[#0a1628] group-hover:text-[#2952a3] transition-colors">
                    {product.name}
                  </h4>
                  <div className="text-sm font-black text-[#0a1628]">
                    {formatPriceRange(product)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[3rem] overflow-hidden bg-[#0a1628] p-8 md:p-16 lg:p-24 text-center">
            <div className="absolute inset-0 z-0 opacity-20">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
                alt="Background"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Ready to Protect Your Home?
              </h2>
              <p className="text-xl text-gray-400 mb-10">
                Contact our roofing experts today for a free consultation and professional quotation.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#2952a3] text-white font-bold rounded-2xl hover:bg-[#1e3d7a] transition-all shadow-xl shadow-[#2952a3]/30"
                >
                  <MessageSquare size={20} />
                  Chat with an Expert
                </Link>
                <div className="text-white font-medium">
                  Or call us: <span className="text-[#4d79ff]">+254 700 000 000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
