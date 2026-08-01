import React, { useState } from "react";
import SEOHead from "../components/seo/SEOHead";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  CheckCircle,
} from "lucide-react";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254788873611";
const PHONE = "0788873611";

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello MRM Mabati Rolling Mills!

*Name:* ${form.name}
*Phone:* ${form.phone}
*Email:* ${form.email || "Not provided"}
*Subject:* ${form.subject || "General Enquiry"}

*Message:*
${form.message}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
    setSubmitted(true);
  };

  const workingHours = [
    { day: "Monday – Friday", hours: "8:00 AM – 6:00 PM" },
    { day: "Saturday", hours: "8:00 AM – 4:00 PM" },
    { day: "Sunday", hours: "10:00 AM – 2:00 PM" },
  ];

  const contactMethods = [
    {
      icon: <Phone size={24} />,
      title: "Call Us",
      value: PHONE,
      sub: "Mon–Sat, 8AM–6PM",
      href: `tel:+254${PHONE.replace(/^0/, "")}`,
      color: "bg-[#2952a3]",
      bg: "bg-[#2952a3]/10",
      text: "text-[#2952a3]",
    },
    {
      icon: <MessageCircle size={24} />,
      title: "WhatsApp",
      value: "Order & Enquire",
      sub: "Available 24/7",
      href: `https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about your products.`,
      color: "bg-[#25D366]",
      bg: "bg-[#25D366]/10",
      text: "text-[#25D366]",
    },
    {
      icon: <Mail size={24} />,
      title: "Email",
      value: "info@mrmmabati.co.ke",
      sub: "Response within 24hrs",
      href: "mailto:info@mrmmabati.co.ke",
      color: "bg-[#d4a017]",
      bg: "bg-[#d4a017]/10",
      text: "text-[#d4a017]",
    },
    {
      icon: <MapPin size={24} />,
      title: "Location",
      value: "Nairobi, Kenya",
      sub: "Nationwide delivery",
      href: "https://maps.google.com/?q=Nairobi,Kenya",
      color: "bg-[#ef4444]",
      bg: "bg-red-50",
      text: "text-red-500",
    },
  ];

  return (
    <>
    <SEOHead
      title="Contact MRM Mabati Rolling Mills — Get a Free Roofing Quote"
      description="Contact MRM Mabati Rolling Mills for a free quote on premium roofing materials. WhatsApp us, call us, or visit our offices in Nairobi. Fast delivery across all 47 counties in Kenya."
      canonicalUrl="/contact"
      jsonLd={{
        "@type": "ContactPage",
        "mainEntity": {
          "@type": "RoofingContractor",
          "name": "MRM Mabati Rolling Mills",
          "telephone": "+254788873611",
          "address": { "@type": "PostalAddress", "addressLocality": "Nairobi", "addressCountry": "KE" },
        },
      }}
    />
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#0a1628] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/90 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a017]/20 border border-[#d4a017]/40 text-[#f0c94a] text-xs font-bold uppercase tracking-widest mb-6">
            Contact Us
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-[#b8c1d9] max-w-2xl leading-relaxed">
            Have a question about our products? Need a quote for your roofing project? We're here to help. Contact us via phone, WhatsApp or the form below.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group p-6 rounded-2xl border border-[#dde3f0] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
              >
                <div className={`w-14 h-14 rounded-2xl ${method.bg} flex items-center justify-center ${method.text} mb-5 group-hover:scale-110 transition-transform`}>
                  {method.icon}
                </div>
                <div className="text-xs font-bold text-[#6b7a9e] uppercase tracking-wider mb-1">{method.title}</div>
                <div className="font-bold text-[#0a1628] text-base mb-1">{method.value}</div>
                <div className="text-xs text-[#6b7a9e]">{method.sub}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Feature Banner */}
      <section className="py-8 bg-[#f8fafc] border-y border-[#dde3f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-[#25D366]/10 rounded-2xl border border-[#25D366]/30">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#25D366] flex items-center justify-center text-white">
                <MessageCircle size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0a1628] mb-1">WhatsApp Ordering — Our Easiest Way to Order</h3>
                <p className="text-[#3d4663] text-sm">
                  View a product → Click WhatsApp → Send your enquiry directly. Get instant quotes and order confirmation.
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about your roofing products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-colors whitespace-nowrap text-base shadow-lg shadow-[#25D366]/30"
            >
              <MessageCircle size={20} />
              Start WhatsApp Chat
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2952a3]/10 text-[#2952a3] text-xs font-bold uppercase tracking-widest mb-6">
                Send a Message
              </div>
              <h2 className="text-3xl font-black text-[#0a1628] mb-2">Request a Quote</h2>
              <p className="text-[#6b7a9e] mb-8">Fill in the form below and we'll send your enquiry directly to our WhatsApp for the fastest response.</p>

              {submitted ? (
                <div className="p-10 bg-[#f0fdf4] rounded-3xl border border-[#25D366]/30 text-center">
                  <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0a1628] mb-2">Message Sent!</h3>
                  <p className="text-[#3d4663] mb-6">Your enquiry has been sent to our WhatsApp. We'll respond as soon as possible.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", subject: "", message: "" }); }}
                    className="px-6 py-3 bg-[#2952a3] text-white font-bold rounded-xl hover:bg-[#1e3d7a] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWhatsApp} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-[#6b7a9e] uppercase tracking-wider mb-2 block">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. John Kamau"
                        className="w-full px-4 py-3 rounded-xl border border-[#dde3f0] text-sm focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6b7a9e] uppercase tracking-wider mb-2 block">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="e.g. 0712 345 678"
                        className="w-full px-4 py-3 rounded-xl border border-[#dde3f0] text-sm focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-[#6b7a9e] uppercase tracking-wider mb-2 block">Email Address</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-[#dde3f0] text-sm focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6b7a9e] uppercase tracking-wider mb-2 block">Subject</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#dde3f0] text-sm focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 bg-white"
                      >
                        <option value="">Select subject</option>
                        <option value="Product Enquiry">Product Enquiry</option>
                        <option value="Price Quote">Price Quote</option>
                        <option value="Bulk Order">Bulk Order</option>
                        <option value="Delivery Information">Delivery Information</option>
                        <option value="Technical Advice">Technical Advice</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#6b7a9e] uppercase tracking-wider mb-2 block">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your roofing project — product type, quantity, delivery location, etc."
                      className="w-full px-4 py-3 rounded-xl border border-[#dde3f0] text-sm focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-all shadow-lg shadow-[#25D366]/30 text-base"
                  >
                    <Send size={18} />
                    Send via WhatsApp
                  </button>
                  <p className="text-xs text-[#6b7a9e] text-center">
                    Your message will be sent directly to our WhatsApp for the fastest response.
                  </p>
                </form>
              )}
            </div>

            {/* Info panel */}
            <div className="space-y-6">
              {/* Working Hours */}
              <div className="bg-[#f8fafc] rounded-2xl p-6 border border-[#dde3f0]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#2952a3]/10 flex items-center justify-center text-[#2952a3]">
                    <Clock size={20} />
                  </div>
                  <h3 className="font-bold text-[#0a1628]">Working Hours</h3>
                </div>
                <div className="space-y-3">
                  {workingHours.map((wh) => (
                    <div key={wh.day} className="flex justify-between items-center py-2 border-b border-[#dde3f0] last:border-0">
                      <span className="text-sm text-[#3d4663] font-medium">{wh.day}</span>
                      <span className="text-sm font-bold text-[#0a1628]">{wh.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-[#25D366]/10 rounded-xl border border-[#25D366]/20">
                  <p className="text-xs text-[#3d4663] font-medium">
                    <span className="text-[#25D366] font-bold">WhatsApp available 24/7</span> — Send us a message anytime and we'll respond during business hours.
                  </p>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-[#0a1628] rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  <a
                    href={`tel:+254${PHONE.replace(/^0/, "")}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Phone size={16} className="text-[#4d79ff]" />
                    <span className="text-white text-sm font-medium">{PHONE}</span>
                  </a>
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 transition-colors"
                  >
                    <MessageCircle size={16} className="text-[#25D366]" />
                    <span className="text-white text-sm font-medium">WhatsApp Us</span>
                  </a>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl p-6 border border-[#dde3f0]">
                <h3 className="font-bold text-[#0a1628] mb-4">Common Questions</h3>
                <div className="space-y-4">
                  {[
                    { q: "Do you offer delivery?", a: "Yes, we deliver to all 47 counties in Kenya." },
                    { q: "Can I order in bulk?", a: "Yes, we offer bulk discounts for large orders." },
                    { q: "What gauges are available?", a: "We stock 28G, 30G, 32G and more." },
                  ].map((faq) => (
                    <div key={faq.q}>
                      <div className="text-sm font-bold text-[#0a1628] mb-1">{faq.q}</div>
                      <div className="text-xs text-[#6b7a9e]">{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        </div>
    </>
  );
};
export default ContactPage;
