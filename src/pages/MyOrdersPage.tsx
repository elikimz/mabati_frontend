import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";
import { ordersApi } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/utils";
import { PageLoader, ErrorMessage, StatusBadge, EmptyState } from "../components/ui";
import { Link } from "react-router-dom";

const MyOrdersPage: React.FC = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["my-orders"],
    queryFn: ordersApi.myOrders,
  });

  if (isLoading) return <div className="pt-24"><PageLoader /></div>;
  if (error) return <div className="pt-24"><ErrorMessage message="Failed to load your orders." /></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="bg-[#0a1628] pt-28 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-white mb-2">My Orders</h1>
          <p className="text-[#6b7a9e]">Track and manage your orders</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!orders?.length ? (
          <EmptyState
            title="No orders yet"
            description="Browse our products and place your first order via WhatsApp."
            icon={<ShoppingCart size={28} />}
            action={
              <Link
                to="/products"
                className="px-5 py-2.5 bg-[#152b55] text-white text-sm font-semibold rounded-xl hover:bg-[#0f2040] transition-colors"
              >
                Browse Products
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#dde3f0] p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-[#0a1628]">
                      Order #ORD-{String(order.id).padStart(4, "0")}
                    </h3>
                    <p className="text-sm text-[#6b7a9e]">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#6b7a9e]">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </p>
                  <span className="text-lg font-black text-[#0a1628]">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
