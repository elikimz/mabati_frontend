import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Phone, Shield } from "lucide-react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../contexts/ThemeContext";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254788873611";
const PHONE = "0788873611";

export const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer aria-label="Site footer" className={cn(theme === "dark" ? "bg-[#050d1a] text-white" : "bg-white text-[#0a1628]")}>
      {/* CTA Strip */}
      <div className={cn(
        "py-14",
        theme === "dark"
          ? "bg-gradient-to-r from-[#0a1628] via-[#152b55] to-[#2952a3]"
          : "bg-gradient-to-r from-[#2952a3] via-[#1e3d7a] to-[#152b55]"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest mb-4",
              theme === "dark"
                ? "bg-[#d4a017]/20 border-[#d4a017]/40 text-[#f0c94a]"
                : "bg-white/20 border-white/40 text-white"
            )}>
              Get Started Today
            </div>
            <h3 className="text-3xl font-black text-white mb-2 leading-tight">
              Ready to Start Your Roofing Project?
            </h3>
            <p className={cn("text-lg", theme === "dark" ? "text-[#b8c1d9]" : "text-white/90")}>
              Get a free quote and expert advice from our roofing specialists.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to get a quote for my roofing project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-7 py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#1ebe5d] transition-colors shadow-xl shadow-[#25D366]/25 whitespace-nowrap text-base"
            >
              <MessageCircle size={20} />
              Order on WhatsApp
            </a>
            <Link
              to="/contact"
              className={cn(
                "flex items-center justify-center gap-2 px-7 py-4 font-bold rounded-2xl border whitespace-nowrap text-base transition-colors",
                theme === "dark"
                  ? "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30"
              )}
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16", theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2952a3] to-[#152b55] flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl leading-none">M</span>
              </div>
              <div>
                <div className={cn("font-black text-base leading-none", theme === "dark" ? "text-white" : "text-[#0a1628]")}>MRM Mabati</div>
                <div className={cn("text-[10px] font-semibold tracking-[0.15em] uppercase mt-0.5", theme === "dark" ? "text-[#6b7a9e]" : "text-[#6b7a9e]")}>Rolling Mills</div>
              </div>
            </div>
            <p className={cn("text-sm leading-relaxed mb-6", theme === "dark" ? "text-[#6b7a9e]" : "text-[#6b7a9e]")}>
              Kenya's premier roofing materials supplier. High-quality mabati sheets, gutters, ridge caps and roofing accessories for homes and commercial buildings.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center hover:bg-[#1ebe5d] transition-colors">
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-full"
                >
                  <MessageCircle size={15} className="text-white" />
                </a>
              </div>
            </div>
            <div className={cn("flex items-center gap-2 text-xs", theme === "dark" ? "text-[#4e5a7a]" : "text-[#6b7a9e]")}>
              <Shield size={12} className="text-[#2952a3]" />
              <span>ISO Certified Quality Materials</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={cn("font-bold mb-5 text-xs uppercase tracking-widest", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "All Products", href: "/products" },
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "Sign In", href: "/login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={cn(
                      "text-sm transition-colors flex items-center gap-2 group",
                      theme === "dark"
                        ? "text-[#6b7a9e] hover:text-white"
                        : "text-[#6b7a9e] hover:text-[#0a1628]"
                    )}
                  >
                    <span className={cn("w-1 h-1 rounded-full transition-colors", theme === "dark" ? "bg-[#2952a3] group-hover:bg-[#4d79ff]" : "bg-[#2952a3] group-hover:bg-[#1e3d7a]")} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className={cn("font-bold mb-5 text-xs uppercase tracking-widest", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
              Our Products
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Box Profile Sheets", href: "/products?search=box+profile" },
                { label: "Corrugated Mabati", href: "/products?search=corrugated" },
                { label: "Tile Profile Sheets", href: "/products?search=tile" },
                { label: "Stone Coated Sheets", href: "/products?search=stone" },
                { label: "Gutters & Downpipes", href: "/products?search=gutter" },
                { label: "Ridge Caps", href: "/products?search=ridge" },
                { label: "Flashings", href: "/products?search=flashing" },
                { label: "Roofing Accessories", href: "/products?search=accessories" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className={cn(
                      "text-sm transition-colors flex items-center gap-2 group",
                      theme === "dark"
                        ? "text-[#6b7a9e] hover:text-white"
                        : "text-[#6b7a9e] hover:text-[#0a1628]"
                    )}
                  >
                    <span className={cn("w-1 h-1 rounded-full transition-colors", theme === "dark" ? "bg-[#2952a3] group-hover:bg-[#4d79ff]" : "bg-[#2952a3] group-hover:bg-[#1e3d7a]")} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={cn("font-bold mb-5 text-xs uppercase tracking-widest", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#2952a3] mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className={cn("text-sm leading-relaxed", theme === "dark" ? "text-[#6b7a9e]" : "text-[#6b7a9e]")}>
                    Nairobi Mabati Shop
                  </span>
                  <span className={cn("text-sm leading-relaxed", theme === "dark" ? "text-[#6b7a9e]" : "text-[#6b7a9e]")}>
                    Mombasa Safal Group
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#2952a3] shrink-0" />
                <a
                  href={`tel:+254${PHONE.replace(/^0/, "")}`}
                  className={cn(
                    "text-sm transition-colors",
                    theme === "dark"
                      ? "text-[#6b7a9e] hover:text-white"
                      : "text-[#6b7a9e] hover:text-[#0a1628]"
                  )}
                >
                  {PHONE}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={16} className="text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-sm transition-colors",
                    theme === "dark"
                      ? "text-[#6b7a9e] hover:text-white"
                      : "text-[#6b7a9e] hover:text-[#0a1628]"
                  )}
                >
                  WhatsApp: {PHONE}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#2952a3] shrink-0" />
                <a
                  href="mailto:info@mrmkenya.online"
                  className={cn(
                    "text-sm transition-colors",
                    theme === "dark"
                      ? "text-[#6b7a9e] hover:text-white"
                      : "text-[#6b7a9e] hover:text-[#0a1628]"
                  )}
                >
                  info@mrmkenya.online
                </a>
              </li>
            </ul>

            {/* Working hours */}
            <div className={cn(
              "mt-6 p-4 rounded-xl",
              theme === "dark"
                ? "bg-white/5 border border-white/10"
                : "bg-[#f8fafc] border border-[#dde3f0]"
            )}>
              <div className={cn("text-xs font-bold uppercase tracking-wider mb-3", theme === "dark" ? "text-white" : "text-[#0a1628]")}>Working Hours</div>
              <div className={cn("space-y-1.5 text-xs", theme === "dark" ? "text-[#6b7a9e]" : "text-[#6b7a9e]")}>
                <div className="flex justify-between"><span>Mon – Fri</span><span className={theme === "dark" ? "text-white" : "text-[#0a1628]"}>8AM – 6PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className={theme === "dark" ? "text-white" : "text-[#0a1628]"}>8AM – 4PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className={theme === "dark" ? "text-white" : "text-[#0a1628]"}>10AM – 2PM</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={cn(
        "border-t",
        theme === "dark"
          ? "bg-[#050d1a] border-white/5"
          : "bg-white border-[#dde3f0]"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={cn("text-xs", theme === "dark" ? "text-[#4e5a7a]" : "text-[#6b7a9e]")}>
            © {new Date().getFullYear()} MRM Mabati Rolling Mills. All rights reserved.
          </p>
          <p className={cn("text-xs", theme === "dark" ? "text-[#4e5a7a]" : "text-[#6b7a9e]")}>
            Premium Roofing Solutions Across Kenya
          </p>
        </div>
      </div>
    </footer>
  );
};
