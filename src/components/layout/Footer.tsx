import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export const Footer: React.FC = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "254700000000";

  return (
    <footer className="bg-[#050d1a] text-white">
      {/* CTA Strip */}
      <div className="bg-gradient-to-r from-[#152b55] to-[#2952a3] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              Ready to Start Your Project?
            </h3>
            <p className="text-[#b8c1d9]">
              Get a free quote and expert advice from our roofing specialists.
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsappNumber}?text=Hello, I would like to get a quote for roofing materials.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1ebe5d] transition-colors shadow-lg whitespace-nowrap"
          >
            <MessageCircle size={20} />
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2952a3] to-[#152b55] flex items-center justify-center">
                <span className="text-white font-black text-lg">M</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg leading-none block">
                  Mabati
                </span>
                <span className="text-[#6b7a9e] text-xs font-medium tracking-widest uppercase">
                  Roofing
                </span>
              </div>
            </div>
            <p className="text-[#6b7a9e] text-sm leading-relaxed mb-6">
              Kenya's premier roofing materials supplier. Quality Mabati sheets
              for modern homes and commercial buildings.
            </p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#25D366] flex items-center justify-center hover:bg-[#1ebe5d] transition-colors"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "About Us", href: "/#about" },
                { label: "Contact", href: "/#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[#6b7a9e] hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Our Products
            </h4>
            <ul className="space-y-3">
              {[
                "Corrugated Mabati",
                "Box Profile Sheets",
                "Versatile Tiles",
                "IBR Sheets",
                "Accessories",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/products"
                    className="text-[#6b7a9e] hover:text-white text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#2952a3] mt-0.5 shrink-0" />
                <span className="text-[#6b7a9e] text-sm">
                  Industrial Area, Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#2952a3] shrink-0" />
                <a
                  href="tel:+254700000000"
                  className="text-[#6b7a9e] hover:text-white text-sm transition-colors"
                >
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#2952a3] shrink-0" />
                <a
                  href="mailto:info@mabatiroofing.co.ke"
                  className="text-[#6b7a9e] hover:text-white text-sm transition-colors"
                >
                  info@mabatiroofing.co.ke
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#4e5a7a] text-xs">
            © {new Date().getFullYear()} Mabati Roofing. All rights reserved.
          </p>
          <p className="text-[#4e5a7a] text-xs">
            Premium Roofing Solutions for Kenya
          </p>
        </div>
      </div>
    </footer>
  );
};
