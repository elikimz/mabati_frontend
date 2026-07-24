import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { productsApi, categoriesApi, uploadToCloudinary } from "../../lib/api";
import { formatCurrency } from "../../lib/utils";
import {
  PageLoader,
  ErrorMessage,
  Modal,
  Badge,
  EmptyState,
} from "../../components/ui";
import type { Product, ProductCreate } from "../../types";

const EMPTY_FORM: ProductCreate = {
  name: "",
  description: "",
  brand: "",
  price: 0,
  discount_price: undefined,
  color: "",
  gauge: "",
  length: undefined,
  width: undefined,
  profile: "",
  stock_quantity: 0,
  low_stock_threshold: 10,
  image_url: "",
  is_active: true,
  category_id: 0,
};

const ProductForm: React.FC<{
  initial?: Partial<ProductCreate>;
  onSubmit: (data: ProductCreate) => void;
  loading: boolean;
  categories: { id: number; name: string }[];
}> = ({ initial = {}, onSubmit, loading, categories }) => {
  const [form, setForm] = useState<ProductCreate>({ ...EMPTY_FORM, ...initial });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch {
      setUploadError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputCls =
    "w-full px-3 py-2.5 bg-white border border-[#dde3f0] rounded-lg text-sm text-[#0a1628] focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 transition-all placeholder:text-[#6b7a9e]";
  const labelCls = "text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Image upload */}
      <div>
        <label className={labelCls}>Product Image</label>
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-[#dde3f0] bg-[#f8fafc] flex items-center justify-center overflow-hidden shrink-0">
            {form.image_url ? (
              <img
                src={form.image_url}
                alt="Product"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon size={24} className="text-[#6b7a9e]" />
            )}
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-2 px-4 py-2.5 bg-[#f0f3f9] border border-[#dde3f0] rounded-lg text-sm font-medium text-[#3d4663] hover:bg-[#dde3f0] cursor-pointer transition-colors">
              <Upload size={15} />
              {uploading ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {uploadError && (
              <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}
            <p className="text-xs text-[#6b7a9e] mt-1">
              Uploaded to Cloudinary. Max 10MB.
            </p>
            {form.image_url && (
              <input
                type="text"
                value={form.image_url}
                readOnly
                className="mt-2 w-full px-3 py-1.5 bg-[#f8fafc] border border-[#dde3f0] rounded text-xs text-[#6b7a9e] truncate"
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelCls}>Product Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. 28 Gauge Corrugated Mabati Sheet"
            className={inputCls}
          />
        </div>

        <div className="col-span-2">
          <label className={labelCls}>Description</label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            rows={3}
            placeholder="Product description..."
            className={inputCls + " resize-none"}
          />
        </div>

        <div>
          <label className={labelCls}>Category *</label>
          <select
            name="category_id"
            value={form.category_id || ""}
            onChange={handleChange}
            required
            className={inputCls}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Brand</label>
          <input
            name="brand"
            value={form.brand || ""}
            onChange={handleChange}
            placeholder="e.g. Mabati Rolling Mills"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Price (KES) *</label>
          <input
            name="price"
            type="number"
            value={form.price || ""}
            onChange={handleChange}
            required
            min={0}
            step={0.01}
            placeholder="0.00"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Discount Price (KES)</label>
          <input
            name="discount_price"
            type="number"
            value={form.discount_price || ""}
            onChange={handleChange}
            min={0}
            step={0.01}
            placeholder="Optional"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Gauge</label>
          <input
            name="gauge"
            value={form.gauge || ""}
            onChange={handleChange}
            placeholder="e.g. 28, 30, 32"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Color</label>
          <input
            name="color"
            value={form.color || ""}
            onChange={handleChange}
            placeholder="e.g. Blue, Green, Red"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Length (m)</label>
          <input
            name="length"
            type="number"
            value={form.length || ""}
            onChange={handleChange}
            min={0}
            step={0.1}
            placeholder="e.g. 2.4"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Width (m)</label>
          <input
            name="width"
            type="number"
            value={form.width || ""}
            onChange={handleChange}
            min={0}
            step={0.01}
            placeholder="e.g. 0.86"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Profile</label>
          <input
            name="profile"
            value={form.profile || ""}
            onChange={handleChange}
            placeholder="e.g. Corrugated, Box, IBR"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Stock Quantity</label>
          <input
            name="stock_quantity"
            type="number"
            value={form.stock_quantity ?? 0}
            onChange={handleChange}
            min={0}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Low Stock Threshold</label>
          <input
            name="low_stock_threshold"
            type="number"
            value={form.low_stock_threshold ?? 10}
            onChange={handleChange}
            min={0}
            className={inputCls}
          />
        </div>

        <div className="col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={form.is_active ?? true}
            onChange={handleChange}
            className="w-4 h-4 rounded border-[#dde3f0] text-[#2952a3] focus:ring-[#2952a3]"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-[#0a1628]">
            Product is active and visible to customers
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-[#dde3f0]">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#152b55] text-white text-sm font-semibold rounded-lg hover:bg-[#0f2040] transition-colors disabled:opacity-60"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : null}
          Save Product
        </button>
      </div>
    </form>
  );
};

const AdminProducts: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => productsApi.list(),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductCreate }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowModal(false);
      setEditProduct(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteId(null);
    },
  });

  const filtered = products?.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.color?.toLowerCase().includes(search.toLowerCase()) ||
      p.gauge?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (data: ProductCreate) => {
    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorMessage message="Failed to load products." />;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1628] mb-1">Products</h1>
          <p className="text-[#6b7a9e] text-sm">
            {products?.length || 0} products in your catalogue
          </p>
        </div>
        <button
          onClick={() => {
            setEditProduct(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#152b55] text-white text-sm font-semibold rounded-xl hover:bg-[#0f2040] transition-colors shadow-md"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7a9e]" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm pl-10 pr-4 py-2.5 bg-white border border-[#dde3f0] rounded-xl text-sm text-[#0a1628] placeholder:text-[#6b7a9e] focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#dde3f0] overflow-hidden">
        {filtered?.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Add your first product to get started."
            icon={<Package size={28} />}
            action={
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#152b55] text-white text-sm font-semibold rounded-xl hover:bg-[#0f2040] transition-colors"
              >
                <Plus size={15} />
                Add Product
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0f3f9] bg-[#f8fafc]">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Stock
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
                {filtered?.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#f8fafc] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f0f3f9] overflow-hidden shrink-0">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-[#6b7a9e]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#0a1628] line-clamp-1">
                            {product.name}
                          </div>
                          <div className="text-xs text-[#6b7a9e]">
                            {[product.gauge && `${product.gauge}g`, product.color]
                              .filter(Boolean)
                              .join(" · ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#3d4663]">
                      {product.category?.name || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-[#0a1628]">
                        {formatCurrency(product.price)}
                      </div>
                      {product.discount_price && (
                        <div className="text-xs text-[#6b7a9e] line-through">
                          {formatCurrency(product.discount_price)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-semibold ${
                          product.stock_quantity === 0
                            ? "text-red-600"
                            : product.stock_quantity <= product.low_stock_threshold
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={product.is_active ? "success" : "danger"}>
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditProduct(product);
                            setShowModal(true);
                          }}
                          className="p-2 rounded-lg text-[#6b7a9e] hover:bg-[#f0f3f9] hover:text-[#2952a3] transition-colors"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
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
        onClose={() => {
          setShowModal(false);
          setEditProduct(null);
        }}
        title={editProduct ? "Edit Product" : "Add New Product"}
        size="xl"
      >
        <ProductForm
          initial={editProduct ? {
            name: editProduct.name,
            description: editProduct.description,
            brand: editProduct.brand,
            price: parseFloat(editProduct.price),
            discount_price: editProduct.discount_price ? parseFloat(editProduct.discount_price) : undefined,
            color: editProduct.color,
            gauge: editProduct.gauge,
            length: editProduct.length,
            width: editProduct.width,
            profile: editProduct.profile,
            stock_quantity: editProduct.stock_quantity,
            low_stock_threshold: editProduct.low_stock_threshold,
            image_url: editProduct.image_url,
            is_active: editProduct.is_active,
            category_id: editProduct.category_id,
          } : undefined}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
          categories={categories || []}
        />
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Product"
        size="sm"
      >
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <p className="text-[#3d4663] mb-6">
            Are you sure you want to delete this product? This action cannot be
            undone.
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

export default AdminProducts;
