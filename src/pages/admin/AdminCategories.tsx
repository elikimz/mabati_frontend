import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Tag } from "lucide-react";
import { categoriesApi } from "../../lib/api";
import { formatDate } from "../../lib/utils";
import { PageLoader, ErrorMessage, Modal, EmptyState } from "../../components/ui";
import type { Category, CategoryCreate } from "../../types";

const AdminCategories: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryCreate>({ name: "", description: "" });
  const [error, setError] = useState("");

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: categoriesApi.list,
  });

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowModal(false);
      setForm({ name: "", description: "" });
    },
    onError: () => setError("Failed to create category."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoryCreate> }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowModal(false);
      setEditCategory(null);
      setForm({ name: "", description: "" });
    },
    onError: () => setError("Failed to update category."),
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteId(null);
    },
  });

  const openAdd = () => {
    setEditCategory(null);
    setForm({ name: "", description: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditCategory(cat);
    setForm({ name: cat.name, description: cat.description || "" });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (editCategory) {
      updateMutation.mutate({ id: editCategory.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const inputCls =
    "w-full px-3 py-2.5 bg-white border border-[#dde3f0] rounded-lg text-sm text-[#0a1628] focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 transition-all placeholder:text-[#6b7a9e]";

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1628] mb-1">Categories</h1>
          <p className="text-[#6b7a9e] text-sm">
            {categories?.length || 0} categories
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#152b55] text-white text-sm font-semibold rounded-xl hover:bg-[#0f2040] transition-colors shadow-md"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#dde3f0] overflow-hidden">
        {!categories?.length ? (
          <EmptyState
            title="No categories yet"
            description="Create your first product category."
            icon={<Tag size={28} />}
            action={
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#152b55] text-white text-sm font-semibold rounded-xl hover:bg-[#0f2040] transition-colors"
              >
                <Plus size={15} />
                Add Category
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0f3f9] bg-[#f8fafc]">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Created
                  </th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3f9]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#f0f3f9] flex items-center justify-center">
                          <Tag size={15} className="text-[#2952a3]" />
                        </div>
                        <span className="text-sm font-semibold text-[#0a1628]">
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#6b7a9e] max-w-xs truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#6b7a9e]">
                      {formatDate(cat.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2 rounded-lg text-[#6b7a9e] hover:bg-[#f0f3f9] hover:text-[#2952a3] transition-colors"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(cat.id)}
                          className="p-2 rounded-lg text-[#6b7a9e] hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditCategory(null); }}
        title={editCategory ? "Edit Category" : "Add Category"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
              Category Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="e.g. Corrugated Sheets"
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
              Description
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              placeholder="Optional description..."
              className={inputCls + " resize-none"}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowModal(false); setEditCategory(null); }}
              className="flex-1 px-4 py-2.5 border border-[#dde3f0] text-[#3d4663] text-sm font-semibold rounded-lg hover:bg-[#f0f3f9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-[#152b55] text-white text-sm font-semibold rounded-lg hover:bg-[#0f2040] transition-colors disabled:opacity-60"
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Category"
        size="sm"
      >
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <p className="text-[#3d4663] mb-6">
            Delete this category? Products in this category may be affected.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 px-4 py-2.5 border border-[#dde3f0] text-[#3d4663] text-sm font-semibold rounded-lg hover:bg-[#f0f3f9] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCategories;
