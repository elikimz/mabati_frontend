import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Phone,
  User,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../stores/authStore";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254788873611";
const PHONE = "0788873611";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserMenuOpen(false);
  };

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isTransparent
          ? "bg-transparent"
          : "bg-[#0a1628]/97 backdrop-blur-xl shadow-xl shadow-black/20"
      )}
    >
      {/* Top utility bar — only show when not transparent */}
      {!isTransparent && (
        <div className="hidden lg:block bg-[#050d1a] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
            <div className="flex items-center gap-6 text-xs text-[#6b7a9e]">
              <span>Kenya's Premier Roofing Materials Supplier</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#6b7a9e]">
              <a href={`tel:+254${PHONE.replace(/^0/, "")}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone size={11} />
                {PHONE}
              </a>
              <a
                href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about your products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#25D366] hover:text-[#1ebe5d] transition-colors font-medium"
              >
                <MessageCircle size={11} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#2952a3] to-[#152b55] flex items-center justify-center shadow-lg group-hover:shadow-[#2952a3]/50 transition-shadow overflow-hidden">
              <span className="text-white font-black text-xl leading-none">M</span>
            </div>
            <div className="leading-tight">
              <div className="text-white font-black text-base leading-none tracking-tight">
                MRM Mabati
              </div>
              <div className="text-[#8e9bbf] text-[10px] font-semibold tracking-[0.15em] uppercase mt-0.5">
                Rolling Mills
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = link.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    active
                      ? "text-white bg-white/10"
                      : "text-[#b8c1d9] hover:text-white hover:bg-white/8"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about your products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-sm font-bold rounded-xl hover:bg-[#1ebe5d] transition-colors shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle size={15} />
              Order Now
            </a>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/10"
                >
                  <div className="w-7 h-7 rounded-full bg-[#2952a3] flex items-center justify-center text-xs font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                  <ChevronDown size={14} className={cn("transition-transform", userMenuOpen && "rotate-180")} />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-[#dde3f0] py-2 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#f0f3f9] mb-1">
                        <div className="text-sm font-bold text-[#0a1628] truncate">{user.name}</div>
                        <div className="text-xs text-[#6b7a9e] capitalize">{user.role}</div>
                      </div>
                      {(user.role === "admin" || user.role === "staff") && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0a1628] hover:bg-[#f0f3f9] transition-colors"
                        >
                          <LayoutDashboard size={15} className="text-[#2952a3]" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/my-orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0a1628] hover:bg-[#f0f3f9] transition-colors"
                      >
                        <User size={15} className="text-[#2952a3]" />
                        My Orders
                      </Link>
                      <div className="border-t border-[#f0f3f9] mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#b8c1d9] hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-[#0a1628] bg-white rounded-xl hover:bg-[#f0f3f9] transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0a1628] border-t border-white/10 shadow-2xl">
          <div className="px-4 py-5 space-y-1">
            {navLinks.map((link) => {
              const active = link.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "block px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                    active
                      ? "text-white bg-white/10 font-semibold"
                      : "text-[#b8c1d9] hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
              <a
                href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about your products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white text-sm font-bold rounded-xl"
              >
                <MessageCircle size={16} />
                Order on WhatsApp
              </a>
              {isAuthenticated && user ? (
                <>
                  {(user.role === "admin" || user.role === "staff") && (
                    <Link
                      to="/admin"
                      className="block px-4 py-3 text-sm font-semibold text-white bg-[#2952a3] rounded-xl text-center"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/my-orders"
                    className="block px-4 py-3 text-sm font-medium text-[#b8c1d9] hover:bg-white/10 rounded-xl text-center"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-white/10 rounded-xl text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded-xl text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 text-sm font-semibold text-[#0a1628] bg-white rounded-xl text-center"
                  >
                    Register
                  </Link>
                </>
              )}
              <a
                href={`tel:+254${PHONE.replace(/^0/, "")}`}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-[#8e9bbf] hover:text-white transition-colors"
              >
                <Phone size={15} />
                {PHONE}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
