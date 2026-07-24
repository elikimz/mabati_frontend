import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
} from "lucide-react";
import { dashboardApi } from "../../lib/api";
import { formatCurrency, formatDate } from "../../lib/utils";
import { PageLoader, ErrorMessage, Badge } from "../../components/ui";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  change?: string;
  positive?: boolean;
}> = ({ title, value, icon, color, bgColor, change, positive }) => (
  <div className="bg-white rounded-2xl border border-[#dde3f0] p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
        <span className={color}>{icon}</span>
      </div>
      {change && (
        <div
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            positive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {positive ? (
            <ArrowUpRight size={12} />
          ) : (
            <ArrowDownRight size={12} />
          )}
          {change}
        </div>
      )}
    </div>
    <div className="text-3xl font-black text-[#0a1628] mb-1">{value}</div>
    <div className="text-sm text-[#6b7a9e]">{title}</div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: dashboardApi.stats,
    refetchInterval: 60000,
  });

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <ErrorMessage
        message="Failed to load dashboard data."
        onRetry={refetch}
      />
    );
  if (!stats) return null;

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1628] mb-1">Dashboard</h1>
        <p className="text-[#6b7a9e] text-sm">
          Welcome back. Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Products"
          value={stats.total_products}
          icon={<Package size={22} />}
          color="text-[#2952a3]"
          bgColor="bg-blue-50"
          change="+12%"
          positive
        />
        <StatCard
          title="Total Orders"
          value={stats.total_orders}
          icon={<ShoppingCart size={22} />}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          change="+8%"
          positive
        />
        <StatCard
          title="Customers"
          value={stats.total_customers}
          icon={<Users size={22} />}
          color="text-purple-600"
          bgColor="bg-purple-50"
          change="+5%"
          positive
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.sales_summary.total_revenue)}
          icon={<TrendingUp size={22} />}
          color="text-amber-600"
          bgColor="bg-amber-50"
          change="+15%"
          positive
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-[#dde3f0] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <ShoppingCart size={18} className="text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#0a1628]">
                {stats.sales_summary.pending_orders}
              </div>
              <div className="text-xs text-[#6b7a9e]">Pending Orders</div>
            </div>
          </div>
          <div className="w-full bg-[#f0f3f9] rounded-full h-1.5">
            <div
              className="bg-amber-400 h-1.5 rounded-full"
              style={{
                width: `${Math.min(
                  (stats.sales_summary.pending_orders / Math.max(stats.total_orders, 1)) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#dde3f0] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <ShoppingCart size={18} className="text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#0a1628]">
                {stats.sales_summary.completed_orders}
              </div>
              <div className="text-xs text-[#6b7a9e]">Completed Orders</div>
            </div>
          </div>
          <div className="w-full bg-[#f0f3f9] rounded-full h-1.5">
            <div
              className="bg-emerald-400 h-1.5 rounded-full"
              style={{
                width: `${Math.min(
                  (stats.sales_summary.completed_orders / Math.max(stats.total_orders, 1)) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#dde3f0] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0f3f9] flex items-center justify-center">
              <Tag size={18} className="text-[#2952a3]" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#0a1628]">
                {stats.total_categories}
              </div>
              <div className="text-xs text-[#6b7a9e]">Categories</div>
            </div>
          </div>
          <div className="w-full bg-[#f0f3f9] rounded-full h-1.5">
            <div className="bg-[#2952a3] h-1.5 rounded-full w-3/4" />
          </div>
        </div>
      </div>

      {/* Low stock alerts */}
      {stats.low_stock_products.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#dde3f0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#dde3f0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <AlertTriangle size={18} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-[#0a1628] text-sm">
                  Low Stock Alerts
                </h3>
                <p className="text-xs text-[#6b7a9e]">
                  {stats.low_stock_products.length} product
                  {stats.low_stock_products.length !== 1 ? "s" : ""} need
                  restocking
                </p>
              </div>
            </div>
            <Badge variant="warning">
              {stats.low_stock_products.length} alerts
            </Badge>
          </div>
          <div className="divide-y divide-[#f0f3f9]">
            {stats.low_stock_products.map((item) => (
              <div
                key={item.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-[#f8fafc] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f0f3f9] flex items-center justify-center">
                    <Package size={14} className="text-[#6b7a9e]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0a1628]">
                      {item.name}
                    </div>
                    <div className="text-xs text-[#6b7a9e]">
                      Threshold: {item.low_stock_threshold} units
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold ${
                        item.stock_quantity === 0
                          ? "text-red-600"
                          : "text-amber-600"
                      }`}
                    >
                      {item.stock_quantity} units
                    </div>
                    <div className="text-xs text-[#6b7a9e]">remaining</div>
                  </div>
                  <Badge
                    variant={
                      item.stock_quantity === 0 ? "danger" : "warning"
                    }
                  >
                    {item.stock_quantity === 0 ? "Out of Stock" : "Low Stock"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
