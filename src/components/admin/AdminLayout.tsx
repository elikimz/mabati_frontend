import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  Warehouse,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/products", label: "Products", icon: <Package size={18} /> },
  { href: "/admin/categories", label: "Categories", icon: <Tag size={18} /> },
  { href: "/admin/inventory", label: "Inventory", icon: <Warehouse size={18} /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
  { href: "/admin/users", label: "Users", icon: <Users size={18} /> },
  { href: "/admin/landing", label: "Homepage", icon: <Home size={18} /> },
  { href: "/admin/site-content", label: "Site Content", icon: <ImageIcon size={18} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
];



const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (href: string) =>
    href === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-[#2952a3] flex items-center justify-center shrink-0">
          <BarChart3 size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-black text-sm leading-none">Mabati</div>
            <div className="text-[#6b7a9e] text-xs">Admin Panel</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#2952a3] text-white shadow-lg shadow-[#2952a3]/30"
                  : "text-[#8e9bbf] hover:bg-white/10 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#2952a3] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-white text-xs font-semibold truncate">{user.name}</div>
              <div className="text-[#6b7a9e] text-xs truncate">{user.role}</div>
            </div>
          </div>
        )}
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#8e9bbf] hover:bg-white/10 hover:text-white transition-all mb-1 ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "View Site" : undefined}
        >
          <Home size={18} className="shrink-0" />
          {!collapsed && <span>View Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f0f3f9] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#0a1628] transition-all duration-300 shrink-0 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-full w-5 h-10 bg-[#0a1628] rounded-r-lg flex items-center justify-center text-[#6b7a9e] hover:text-white transition-colors z-10"
          style={{ left: collapsed ? "4rem" : "15rem" }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-[#0a1628] h-full flex flex-col shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-[#6b7a9e] hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-[#dde3f0] px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-[#6b7a9e] hover:bg-[#f0f3f9]"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-[#0a1628]">
              {NAV_ITEMS.find((n) => isActive(n.href))?.label || "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2952a3] flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-[#0a1628]">
                  {user.name.split(" ")[0]}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
