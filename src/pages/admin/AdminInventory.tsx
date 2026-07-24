import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Warehouse, Plus, Minus, History, AlertTriangle, Package } from "lucide-react";
import { inventoryApi, productsApi } from "../../lib/api";
import { PageLoader, ErrorMessage, Modal, Badge } from "../../components/ui";
import type { InventoryLog, Product } from "../../types";

const AdminInventory: React.FC = () => {
  const queryClient = useQueryClient();
  const [adjustItem, setAdjustItem] = useState<Product | null>(null);
  const [logsItem, setLogsItem] = useState<Product | null>(null);
  const [adjustForm, setAdjustForm] = useState({ change: 0, reason: "", note: "" });
  const [adjustError, setAdjustError] = useState("");

  // Use products list as the full inventory view
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["admin-products-inventory"],
    queryFn: () => productsApi.list(),
  });

  // Low-stock items from the dedicated endpoint
  const { data: lowStockItems } = useQuery({
    queryKey: ["admin-inventory-low"],
    queryFn: inventoryApi.list,
  });

  const { data: logs } = useQuery({
    queryKey: ["inventory-logs", logsItem?.id],
    queryFn: () => inventoryApi.logs(logsItem!.id),
    enabled: !!logsItem,
  });

  const adjustMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof adjustForm }) =>
      inventoryApi.adjust(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["admin-inventory-low"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setAdjustItem(null);
      setAdjustForm({ change: 0, reason: "", note: "" });
    },
    onError: () => setAdjustError("Failed to adjust inventory."),
  });

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    setAdjustError("");
    if (!adjustItem) return;
    adjustMutation.mutate({ id: adjustItem.id, data: adjustForm });
  };

  const inputCls =
    "w-full px-3 py-2.5 bg-white border border-[#dde3f0] rounded-lg text-sm text-[#0a1628] focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 transition-all placeholder:text-[#6b7a9e]";

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorMessage message="Failed to load inventory." />;

  const lowStockCount = lowStockItems?.length || 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1628] mb-1">Inventory</h1>
        <p className="text-[#6b7a9e] text-sm">
          Monitor and adjust product stock levels
        </p>
      </div>

      {/* Low stock alert */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 font-semibold text-sm">
              {lowStockCount} product{lowStockCount !== 1 ? "s" : ""} with low or no stock
            </p>
            <p className="text-amber-700 text-xs mt-0.5">
              {lowStockItems?.map((i) => i.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#dde3f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f0f3f9] bg-[#f8fafc]">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                  Threshold
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3f9]">
              {products?.map((item) => {
                const isLow = item.stock_quantity <= item.low_stock_threshold;
                const isOut = item.stock_quantity === 0;
                return (
                  <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#f0f3f9] overflow-hidden shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={15} className="text-[#6b7a9e]" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-[#0a1628] line-clamp-1">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-lg font-black ${
                          isOut
                            ? "text-red-600"
                            : isLow
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {item.stock_quantity}
                      </span>
                      <span className="text-xs text-[#6b7a9e] ml-1">units</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#6b7a9e]">
                      {item.low_stock_threshold} units
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={
                          isOut ? "danger" : isLow ? "warning" : "success"
                        }
                      >
                        {isOut
                          ? "Out of Stock"
                          : isLow
                          ? "Low Stock"
                          : "In Stock"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setAdjustItem(item);
                            setAdjustForm({ change: 0, reason: "", note: "" });
                            setAdjustError("");
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f3f9] text-[#3d4663] text-xs font-semibold rounded-lg hover:bg-[#dde3f0] transition-colors"
                        >
                          <Plus size={13} />
                          Adjust
                        </button>
                        <button
                          onClick={() => setLogsItem(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f3f9] text-[#3d4663] text-xs font-semibold rounded-lg hover:bg-[#dde3f0] transition-colors"
                        >
                          <History size={13} />
                          Logs
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      <Modal
        isOpen={adjustItem !== null}
        onClose={() => setAdjustItem(null)}
        title={`Adjust Stock: ${adjustItem?.name}`}
        size="sm"
      >
        <form onSubmit={handleAdjust} className="space-y-4">
          {adjustError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {adjustError}
            </div>
          )}
          <div className="bg-[#f8fafc] rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-[#6b7a9e]">Current Stock</span>
            <span className="text-2xl font-black text-[#0a1628]">
              {adjustItem?.stock_quantity} units
            </span>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
              Change Amount *
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setAdjustForm((p) => ({ ...p, change: p.change - 1 }))
                }
                className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors font-bold"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={adjustForm.change}
                onChange={(e) =>
                  setAdjustForm((p) => ({
                    ...p,
                    change: Number(e.target.value),
                  }))
                }
                required
                className={inputCls + " text-center font-bold text-lg"}
              />
              <button
                type="button"
                onClick={() =>
                  setAdjustForm((p) => ({ ...p, change: p.change + 1 }))
                }
                className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors font-bold"
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="text-xs text-[#6b7a9e] mt-1">
              Positive to add stock, negative to remove
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
              Reason
            </label>
            <input
              value={adjustForm.reason}
              onChange={(e) =>
                setAdjustForm((p) => ({ ...p, reason: e.target.value }))
              }
              placeholder="e.g. Restock, Damaged, Sale"
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
              Note
            </label>
            <textarea
              value={adjustForm.note}
              onChange={(e) =>
                setAdjustForm((p) => ({ ...p, note: e.target.value }))
              }
              rows={2}
              placeholder="Optional notes..."
              className={inputCls + " resize-none"}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAdjustItem(null)}
              className="flex-1 px-4 py-2.5 border border-[#dde3f0] text-[#3d4663] text-sm font-semibold rounded-lg hover:bg-[#f0f3f9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={adjustMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-[#152b55] text-white text-sm font-semibold rounded-lg hover:bg-[#0f2040] transition-colors disabled:opacity-60"
            >
              {adjustMutation.isPending ? "Saving..." : "Apply Adjustment"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Logs Modal */}
      <Modal
        isOpen={logsItem !== null}
        onClose={() => setLogsItem(null)}
        title={`Stock Logs: ${logsItem?.name}`}
        size="md"
      >
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {!logs?.length ? (
            <div className="text-center py-8 text-[#6b7a9e] text-sm">
              No stock adjustment logs found.
            </div>
          ) : (
            logs.map((log: InventoryLog) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 bg-[#f8fafc] rounded-xl"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    log.change > 0
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {log.change > 0 ? <Plus size={14} /> : <Minus size={14} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold text-sm ${
                        log.change > 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {log.change > 0 ? "+" : ""}
                      {log.change} units
                    </span>
                    <span className="text-xs text-[#6b7a9e]">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {log.reason && (
                    <p className="text-xs text-[#3d4663] mt-0.5">{log.reason}</p>
                  )}
                  {log.note && (
                    <p className="text-xs text-[#6b7a9e] mt-0.5">{log.note}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminInventory;
