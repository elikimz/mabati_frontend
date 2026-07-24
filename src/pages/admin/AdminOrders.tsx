import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Eye, ChevronDown } from "lucide-react";
import { ordersApi } from "../../lib/api";
import { formatCurrency, formatDate } from "../../lib/utils";
import {
  PageLoader,
  ErrorMessage,
  Modal,
  Badge,
  StatusBadge,
  EmptyState,
} from "../../components/ui";
import type { Order, OrderStatus } from "../../types";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "completed",
  "cancelled",
];

const AdminOrders: React.FC = () => {
  const queryClient = useQueryClient();
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: ordersApi.adminList,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  const filtered =
    statusFilter === "all"
      ? orders
      : orders?.filter((o) => o.status === statusFilter);

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorMessage message="Failed to load orders." />;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1628] mb-1">Orders</h1>
          <p className="text-[#6b7a9e] text-sm">
            {orders?.length || 0} total orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-[#dde3f0] rounded-xl text-sm text-[#0a1628] focus:outline-none focus:border-[#2952a3] transition-all"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {[
          {
            label: "All",
            value: orders?.length || 0,
            filter: "all",
            color: "bg-[#f0f3f9] text-[#3d4663]",
          },
          {
            label: "Pending",
            value: orders?.filter((o) => o.status === "pending").length || 0,
            filter: "pending",
            color: "bg-amber-50 text-amber-700",
          },
          {
            label: "Confirmed",
            value: orders?.filter((o) => o.status === "confirmed").length || 0,
            filter: "confirmed",
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "Completed",
            value: orders?.filter((o) => o.status === "completed").length || 0,
            filter: "completed",
            color: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Cancelled",
            value: orders?.filter((o) => o.status === "cancelled").length || 0,
            filter: "cancelled",
            color: "bg-red-50 text-red-700",
          },
        ].map((stat) => (
          <button
            key={stat.filter}
            onClick={() => setStatusFilter(stat.filter)}
            className={`p-4 rounded-xl text-left transition-all ${
              statusFilter === stat.filter
                ? "ring-2 ring-[#2952a3] " + stat.color
                : "bg-white border border-[#dde3f0] hover:border-[#2952a3]/30"
            }`}
          >
            <div className="text-2xl font-black text-[#0a1628]">
              {stat.value}
            </div>
            <div className="text-xs text-[#6b7a9e] mt-0.5">{stat.label}</div>
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-2xl border border-[#dde3f0] overflow-hidden">
        {!filtered?.length ? (
          <EmptyState
            title="No orders found"
            description="Orders will appear here when customers place them."
            icon={<ShoppingCart size={28} />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0f3f9] bg-[#f8fafc]">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Items
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3f9]">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#0a1628]">
                        #ORD-{String(order.id).padStart(4, "0")}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#3d4663]">
                      Customer #{order.customer_id}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#3d4663]">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-[#0a1628]">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4 text-sm text-[#6b7a9e]">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="p-2 rounded-lg text-[#6b7a9e] hover:bg-[#f0f3f9] hover:text-[#2952a3] transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateStatusMutation.mutate({
                                id: order.id,
                                status: e.target.value as OrderStatus,
                              })
                            }
                            className="appearance-none pl-3 pr-7 py-1.5 bg-[#f0f3f9] border border-[#dde3f0] rounded-lg text-xs font-medium text-[#3d4663] focus:outline-none focus:border-[#2952a3] cursor-pointer"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7a9e] pointer-events-none"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      <Modal
        isOpen={viewOrder !== null}
        onClose={() => setViewOrder(null)}
        title={`Order #ORD-${String(viewOrder?.id).padStart(4, "0")}`}
        size="md"
      >
        {viewOrder && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f8fafc] rounded-xl p-4">
                <div className="text-xs text-[#6b7a9e] uppercase tracking-wider mb-1">
                  Status
                </div>
                <StatusBadge status={viewOrder.status} />
              </div>
              <div className="bg-[#f8fafc] rounded-xl p-4">
                <div className="text-xs text-[#6b7a9e] uppercase tracking-wider mb-1">
                  Total
                </div>
                <div className="font-black text-[#0a1628]">
                  {formatCurrency(viewOrder.total_amount)}
                </div>
              </div>
              <div className="bg-[#f8fafc] rounded-xl p-4">
                <div className="text-xs text-[#6b7a9e] uppercase tracking-wider mb-1">
                  Customer ID
                </div>
                <div className="font-semibold text-[#0a1628]">
                  #{viewOrder.customer_id}
                </div>
              </div>
              <div className="bg-[#f8fafc] rounded-xl p-4">
                <div className="text-xs text-[#6b7a9e] uppercase tracking-wider mb-1">
                  Date
                </div>
                <div className="font-semibold text-[#0a1628] text-sm">
                  {formatDate(viewOrder.created_at)}
                </div>
              </div>
            </div>

            {viewOrder.shipping_address && (
              <div className="bg-[#f8fafc] rounded-xl p-4">
                <div className="text-xs text-[#6b7a9e] uppercase tracking-wider mb-1">
                  Shipping Address
                </div>
                <div className="text-sm text-[#0a1628]">
                  {viewOrder.shipping_address}
                </div>
              </div>
            )}

            {viewOrder.notes && (
              <div className="bg-[#f8fafc] rounded-xl p-4">
                <div className="text-xs text-[#6b7a9e] uppercase tracking-wider mb-1">
                  Notes
                </div>
                <div className="text-sm text-[#0a1628]">{viewOrder.notes}</div>
              </div>
            )}

            <div>
              <div className="text-xs text-[#6b7a9e] uppercase tracking-wider mb-3">
                Order Items ({viewOrder.items.length})
              </div>
              <div className="space-y-2">
                {viewOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl"
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#0a1628]">
                        Product #{item.product_id}
                      </div>
                      <div className="text-xs text-[#6b7a9e]">
                        Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-[#0a1628]">
                      {formatCurrency(
                        parseFloat(item.unit_price) * item.quantity
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#dde3f0]">
              <div className="text-xs text-[#6b7a9e] uppercase tracking-wider mb-2">
                Update Status
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      updateStatusMutation.mutate({
                        id: viewOrder.id,
                        status: s,
                      });
                      setViewOrder({ ...viewOrder, status: s });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      viewOrder.status === s
                        ? "bg-[#152b55] text-white"
                        : "bg-[#f0f3f9] text-[#3d4663] hover:bg-[#dde3f0]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;
