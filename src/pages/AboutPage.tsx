import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle,
  Clock,
  Home,
  MessageCircle,
  Package,
  Phone,
  Shield,
  Star,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254788873611";
const PHONE = "0788873611";

const AboutPage: React.FC = () => {
  const services = [
    {
      icon: <Package size={24} />,
      title: "Roofing Material Supply",
      desc: "Comprehensive supply of all roofing materials including box profile sheets, corrugated mabati, tile profiles, gutters, ridge caps, flashings and roofing accessories.",
    },
    {
      icon: <Home size={24} />,
      title: "Residential Roofing Solutions",
      desc: "Premium roofing solutions tailored for homes — from simple bungalows to multi-storey residential buildings. We help you choose the right product for your home.",
    },
    {
      icon: <Building2 size={24} />,
      title: "Commercial Roofing Solutions",
      desc: "Heavy-duty roofing materials for warehouses, factories, shopping centres and large commercial developments. Bulk pricing available for contractors.",
    },
    {
      icon: <Wrench size={24} />,
      title: "Custom Roofing Advice",
      desc: "Bespoke roofing solutions for unique architectural designs. Our experts will advise on the best product, gauge and color combination for your project.",
    },
    {
      icon: <Truck size={24} />,
      title: "Delivery Services",
      desc: "Reliable delivery to your construction site anywhere in Kenya. We handle the logistics so you can focus on building. Delivery to all 47 counties.",
    },
    {
      icon: <Users size={24} />,
      title: "Roofing Consultation",
      desc: "Free expert advice on product selection, gauge recommendations, color choices and quantity estimation. Available via phone, WhatsApp or in-person.",
    },
  ];

  const values = [
    { icon: <Shield size={20} />, title: "Quality First", desc: "We never compromise on the quality of our products. Every sheet we sell meets international standards." },
    { icon: <Star size={20} />, title: "Customer Focus", desc: "Our customers are at the heart of everything we do. We go above and beyond to ensure satisfaction." },
    { icon: <CheckCircle size={20} />, title: "Integrity", desc: "We operate with complete transparency and honesty in all our business dealings." },
    { icon: <Award size={20} />, title: "Excellence", desc: "We continuously strive to improve our products, services and customer experience." },
  ];

  const stats = [
    { value: "15+", label: "Years in Business" },
    { value: "10,000+", label: "Happy Customers" },
    { value: "500+", label: "Products Available" },
    { value: "47", label: "Counties Served" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/90 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a017]/20 border border-[#d4a017]/40 text-[#f0c94a] text-xs font-bold uppercase tracking-widest mb-6">
              About Us
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              MRM Mabati Rolling Mills
            </h1>
            <p className="text-xl text-[#b8c1d9] leading-relaxed">
              Kenya's premier supplier of high-quality roofing solutions. We provide box profile sheets, corrugated mabati, tile profiles, gutters, ridge caps, flashings and roofing accessories to homeowners, contractors and developers across Kenya.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[#dde3f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#dde3f0]">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center py-10 px-6">
                <div className="text-4xl font-black text-[#2952a3] mb-1">{stat.value}</div>
                <div className="text-sm text-[#6b7a9e] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2952a3]/10 text-[#2952a3] text-xs font-bold uppercase tracking-widest mb-6">
                Our Story
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0a1628] leading-tight mb-6">
                Building Kenya's Roofing Industry for Over 15 Years
              </h2>
              <div className="space-y-4 text-[#3d4663] leading-relaxed">
                <p>
                  MRM Mabati Rolling Mills was founded with a single mission: to provide Kenyan homeowners, contractors and developers with access to the highest quality roofing materials at competitive prices.
                </p>
                <p>
                  Over the years, we have grown from a small roofing materials supplier to one of Kenya's most trusted names in the construction industry. Our commitment to quality, reliability and customer service has earned us the trust of thousands of customers across all 47 counties.
                </p>
                <p>
                  Today, we offer a comprehensive range of roofing products including box profile sheets, corrugated mabati, tile profiles, stone-coated sheets, gutters, ridge caps, flashings and all roofing accessories — everything you need to complete your roofing project under one roof.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-[#2952a3]/5 rounded-[2rem] rotate-2" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                  alt="MRM Mabati Rolling Mills"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-5 shadow-xl border border-[#dde3f0]">
                <div className="text-3xl font-black text-[#2952a3]">15+</div>
                <div className="text-sm text-[#6b7a9e] font-medium">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-28 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Mission */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2952a3]/10 text-[#2952a3] text-xs font-bold uppercase tracking-widest mb-6">
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#0a1628] leading-tight mb-6">
                Delivering Quality Roofing Solutions to Every Kenyan
              </h2>
              <p className="text-[#3d4663] text-lg leading-relaxed mb-8">
                Our mission is to make premium roofing materials accessible and affordable to every Kenyan — from the homeowner building their first house to the developer constructing a commercial complex. We achieve this by maintaining the highest quality standards while offering competitive pricing and exceptional customer service.
              </p>
              <div className="space-y-3">
                {[
                  "Provide the highest quality roofing materials",
                  "Offer competitive pricing with bulk discounts",
                  "Deliver exceptional customer service",
                  "Support Kenya's construction industry growth",
                  "Make roofing accessible to all income levels",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#2952a3] mt-0.5 shrink-0" />
                    <span className="text-[#3d4663]">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Values */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a017]/20 text-[#d4a017] text-xs font-bold uppercase tracking-widest mb-6">
                Our Values
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#0a1628] leading-tight mb-8">
                What We Stand For
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map((value) => (
                  <div key={value.title} className="p-6 bg-white rounded-2xl border border-[#dde3f0] hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-[#2952a3]/10 flex items-center justify-center text-[#2952a3] mb-4">
                      {value.icon}
                    </div>
                    <h3 className="font-bold text-[#0a1628] mb-2">{value.title}</h3>
                    <p className="text-[#6b7a9e] text-sm leading-relaxed">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2952a3]/10 text-[#2952a3] text-xs font-bold uppercase tracking-widest mb-4">
              What We Do
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a1628] leading-tight">
              Our Services
            </h2>
            <p className="text-[#6b7a9e] mt-3 text-lg max-w-2xl mx-auto">
              We offer a comprehensive range of services to support your roofing project from start to finish.
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

      {/* Team / Why Us */}
      <section className="py-28 bg-[#0a1628] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a017]/20 border border-[#d4a017]/40 text-[#f0c94a] text-xs font-bold uppercase tracking-widest mb-6">
            Why Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6 max-w-3xl mx-auto">
            The MRM Difference
          </h2>
          <p className="text-[#8e9bbf] text-lg leading-relaxed mb-16 max-w-2xl mx-auto">
            When you choose MRM Mabati Rolling Mills, you're not just buying roofing materials — you're partnering with a company that genuinely cares about the success of your project.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield size={28} />, title: "Certified Quality", desc: "All products meet international quality standards and are sourced from certified steel mills." },
              { icon: <Clock size={28} />, title: "Fast Delivery", desc: "We deliver to your site quickly. Same-day delivery available in Nairobi and surrounding areas." },
              { icon: <MessageCircle size={28} />, title: "WhatsApp Support", desc: "Get instant quotes, product photos and order updates directly on WhatsApp 24/7." },
              { icon: <Award size={28} />, title: "Best Prices", desc: "Competitive pricing on all products with special bulk discounts for contractors and developers." },
            ].map((item) => (
              <div key={item.title} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left">
                <div className="w-14 h-14 rounded-2xl bg-[#2952a3]/30 flex items-center justify-center text-[#4d79ff] mb-6">
                  {item.icon}
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">{item.title}</h3>
                <p className="text-[#6b7a9e] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#2952a3] to-[#152b55] rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl font-black text-white mb-2">Ready to Start Your Project?</h3>
              <p className="text-[#b8c1d9] text-lg">Contact us today for a free quote and expert roofing advice.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <a
                href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to get a quote for my roofing project.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-colors whitespace-nowrap"
              >
                <MessageCircle size={18} />
                WhatsApp Us
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#0a1628] font-bold rounded-xl hover:bg-[#f0f3f9] transition-colors whitespace-nowrap"
              >
                Contact Us
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
