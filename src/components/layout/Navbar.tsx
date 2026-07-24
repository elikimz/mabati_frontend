import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Phone,
  Sun,
  User,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../stores/authStore";
import { useTheme } from "../../contexts/ThemeContext";

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
  const { theme, toggleTheme } = useTheme();

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
          : theme === "dark"
            ? "bg-[#050d1a]/97 backdrop-blur-xl shadow-xl shadow-black/20 border-b border-white/5"
            : "bg-white/97 backdrop-blur-xl shadow-lg border-b border-[#dde3f0]"
      )}
    >
      {/* Top utility bar */}
      {!isTransparent && (
        <div className={cn(
          "hidden lg:block border-b",
          theme === "dark"
            ? "bg-[#0a1628] border-white/5"
            : "bg-[#f8fafc] border-[#dde3f0]"
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
            <div className={cn("flex items-center gap-6 text-xs", theme === "dark" ? "text-[#6b7a9e]" : "text-[#6b7a9e]")}>
              <span>Kenya's Premier Roofing Materials Supplier</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <a href={`tel:+254${PHONE.replace(/^0/, "")}`} className={cn("flex items-center gap-1.5 transition-colors", theme === "dark" ? "text-[#6b7a9e] hover:text-white" : "text-[#6b7a9e] hover:text-[#0a1628]")}>
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
              <div className={cn("font-black text-base leading-none tracking-tight", theme === "dark" ? "text-white" : "text-[#0a1628]")}>
                MRM Mabati
              </div>
              <div className={cn("text-[10px] font-semibold tracking-[0.15em] uppercase mt-0.5", theme === "dark" ? "text-[#8e9bbf]" : "text-[#6b7a9e]")}>
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
                      ? theme === "dark"
                        ? "text-white bg-white/10"
                        : "text-[#0a1628] bg-[#2952a3]/10"
                      : theme === "dark"
                        ? "text-[#b8c1d9] hover:text-white hover:bg-white/8"
                        : "text-[#6b7a9e] hover:text-[#0a1628] hover:bg-[#f0f3f9]"
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

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl transition-colors",
                theme === "dark"
                  ? "bg-white/10 text-[#f0c94a] hover:bg-white/20"
                  : "bg-[#f0f3f9] text-[#d4a017] hover:bg-[#e2e8f0]"
              )}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-colors border",
                    theme === "dark"
                      ? "bg-white/10 hover:bg-white/20 text-white border-white/10"
                      : "bg-[#f0f3f9] hover:bg-[#e2e8f0] text-[#0a1628] border-[#dde3f0]"
                  )}
                >
                  <div className="w-7 h-7 rounded-full bg-[#2952a3] flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate text-sm font-medium">{user.name.split(" ")[0]}</span>
                  <ChevronDown size={14} className={cn("transition-transform", userMenuOpen && "rotate-180")} />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className={cn(
                      "absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl border py-2 z-50 overflow-hidden",
                      theme === "dark"
                        ? "bg-[#0a1628] border-white/10"
                        : "bg-white border-[#dde3f0]"
                    )}>
                      <div className={cn("px-4 py-3 border-b mb-1", theme === "dark" ? "border-white/10" : "border-[#f0f3f9]")}>
                        <div className={cn("text-sm font-bold truncate", theme === "dark" ? "text-white" : "text-[#0a1628]")}>{user.name}</div>
                        <div className={cn("text-xs capitalize", theme === "dark" ? "text-[#6b7a9e]" : "text-[#6b7a9e]")}>{user.role}</div>
                      </div>
                      {(user.role === "admin" || user.role === "staff") && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors",
                            theme === "dark"
                              ? "text-[#4d79ff] hover:bg-white/10"
                              : "text-[#0a1628] hover:bg-[#f0f3f9]"
                          )}
                        >
                          <LayoutDashboard size={15} />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/my-orders"
                        onClick={() => setUserMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors",
                          theme === "dark"
                            ? "text-[#4d79ff] hover:bg-white/10"
                            : "text-[#0a1628] hover:bg-[#f0f3f9]"
                        )}
                      >
                        <User size={15} />
                        My Orders
                      </Link>
                      <div className={cn("border-t mt-1 pt-1", theme === "dark" ? "border-white/10" : "border-[#f0f3f9]")}>
                        <button
                          onClick={handleLogout}
                          className={cn(
                            "flex items-center gap-2.5 px-4 py-2.5 text-sm w-full transition-colors",
                            theme === "dark"
                              ? "text-red-400 hover:bg-white/10"
                              : "text-red-600 hover:bg-red-50"
                          )}
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
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors",
                    theme === "dark"
                      ? "text-[#b8c1d9] hover:text-white"
                      : "text-[#6b7a9e] hover:text-[#0a1628]"
                  )}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={cn(
                    "px-4 py-2 text-sm font-semibold rounded-xl transition-colors",
                    theme === "dark"
                      ? "text-[#0a1628] bg-white hover:bg-[#f0f3f9]"
                      : "text-white bg-[#2952a3] hover:bg-[#1e3d7a]"
                  )}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "lg:hidden p-2 rounded-xl transition-colors",
              theme === "dark"
                ? "text-white hover:bg-white/10"
                : "text-[#0a1628] hover:bg-[#f0f3f9]"
            )}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className={cn(
          "lg:hidden border-t shadow-2xl",
          theme === "dark"
            ? "bg-[#0a1628] border-white/10"
            : "bg-white border-[#dde3f0]"
        )}>
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
                      ? theme === "dark"
                        ? "text-white bg-white/10 font-semibold"
                        : "text-[#0a1628] bg-[#2952a3]/10 font-semibold"
                      : theme === "dark"
                        ? "text-[#b8c1d9] hover:text-white hover:bg-white/10"
                        : "text-[#6b7a9e] hover:text-[#0a1628] hover:bg-[#f0f3f9]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className={cn("pt-4 border-t mt-4 space-y-2", theme === "dark" ? "border-white/10" : "border-[#dde3f0]")}>
              <a
                href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about your products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white text-sm font-bold rounded-xl"
              >
                <MessageCircle size={16} />
                Order on WhatsApp
              </a>

              <button
                onClick={toggleTheme}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                  theme === "dark"
                    ? "bg-white/10 text-[#f0c94a] hover:bg-white/20"
                    : "bg-[#f0f3f9] text-[#d4a017] hover:bg-[#e2e8f0]"
                )}
              >
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>

              {isAuthenticated && user ? (
                <>
                  {(user.role === "admin" || user.role === "staff") && (
                    <Link
                      to="/admin"
                      className={cn(
                        "block px-4 py-3 text-sm font-semibold rounded-xl text-center",
                        theme === "dark"
                          ? "text-white bg-[#2952a3]"
                          : "text-white bg-[#2952a3]"
                      )}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/my-orders"
                    className={cn(
                      "block px-4 py-3 text-sm font-medium rounded-xl text-center transition-colors",
                      theme === "dark"
                        ? "text-[#b8c1d9] hover:bg-white/10"
                        : "text-[#6b7a9e] hover:bg-[#f0f3f9]"
                    )}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={cn(
                      "block w-full px-4 py-3 text-sm font-medium rounded-xl text-left transition-colors",
                      theme === "dark"
                        ? "text-red-400 hover:bg-white/10"
                        : "text-red-600 hover:bg-red-50"
                    )}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={cn(
                      "block px-4 py-3 text-sm font-medium rounded-xl text-center transition-colors",
                      theme === "dark"
                        ? "text-white hover:bg-white/10"
                        : "text-[#0a1628] hover:bg-[#f0f3f9]"
                    )}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className={cn(
                      "block px-4 py-3 text-sm font-semibold rounded-xl text-center",
                      theme === "dark"
                        ? "text-[#0a1628] bg-white"
                        : "text-white bg-[#2952a3]"
                    )}
                  >
                    Register
                  </Link>
                </>
              )}
              <a
                href={`tel:+254${PHONE.replace(/^0/, "")}`}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 text-sm transition-colors",
                  theme === "dark"
                    ? "text-[#8e9bbf] hover:text-white"
                    : "text-[#6b7a9e] hover:text-[#0a1628]"
                )}
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
