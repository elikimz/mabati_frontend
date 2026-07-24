import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tag,
  Warehouse,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Image,
  Bell,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../stores/authStore";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Landing Page", href: "/admin/landing", icon: Image },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#1e2d4a]">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2952a3] to-[#152b55] flex items-center justify-center shadow-md">
            <span className="text-white font-black text-base">M</span>
          </div>
          <div>
            <span className="text-white font-bold text-base leading-none block">
              Mabati
            </span>
            <span className="text-[#4e5a7a] text-[10px] font-medium tracking-widest uppercase">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-[#2952a3] text-white shadow-md"
                    : "text-[#8e9bbf] hover:bg-[#1e2d4a] hover:text-white"
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-[#4e5a7a] group-hover:text-white"
                  )}
                />
                {item.label}
                {isActive && (
                  <ChevronRight size={14} className="ml-auto opacity-60" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-[#1e2d4a]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1e2d4a] mb-2">
          <div className="w-8 h-8 rounded-full bg-[#2952a3] flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold truncate">
              {user?.name}
            </div>
            <div className="text-[#4e5a7a] text-xs capitalize">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8e9bbf] hover:bg-[#1e2d4a] hover:text-red-400 transition-all w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0a1628] shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-[#0a1628] h-full shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-[#dde3f0] px-4 sm:px-6 h-16 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#6b7a9e] hover:bg-[#f0f3f9] transition-colors"
            >
              <Menu size={20} />
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-[#6b7a9e]">
              <span>Admin</span>
              <ChevronRight size={14} />
              <span className="text-[#0a1628] font-medium capitalize">
                {location.pathname.split("/").pop() || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-[#6b7a9e] hover:bg-[#f0f3f9] relative transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2952a3] bg-[#f0f3f9] rounded-lg hover:bg-[#dde3f0] transition-colors"
            >
              View Site
              <ChevronRight size={12} />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
