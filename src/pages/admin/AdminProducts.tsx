import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Edit2,
  Image,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  categoriesApi,
  getPrimaryImage,
  productsApi,
  uploadToCloudinary,
} from "../../lib/api";
import type { Product, ProductCreate, ProductImageCreate } from "../../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatPrice = (v: string | undefined) =>
  v ? `KES ${parseFloat(v).toLocaleString("en-KE")}` : "—";

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "lg" | "xl" | "2xl";
}> = ({ isOpen, onClose, title, children, size = "lg" }) => {
  if (!isOpen) return null;
  const widths = { sm: "max-w-sm", lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${widths[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dde3f0]">
          <h2 className="font-bold text-[#0a1628]">{title}</h2>
          <button onClick={onClose} className="text-[#6b7a9e] hover:text-[#0a1628]">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ─── Image Manager ────────────────────────────────────────────────────────────
const ImageManager: React.FC<{
  productId: number;
  images: Product["images"];
  onClose: () => void;
}> = ({ productId, images, onClose }) => {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const addMutation = useMutation({
    mutationFn: (data: ProductImageCreate) => productsApi.addImage(productId, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); setUrl(""); },
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId: number) => productsApi.deleteImage(productId, imageId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadedUrl = await uploadToCloudinary(file);
      setUrl(uploadedUrl);
    } catch {
      alert("Upload failed. Please paste a URL instead.");
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = () => {
    if (!url.trim()) return;
    addMutation.mutate({ image_url: url.trim(), is_primary: isPrimary });
  };

  return (
    <div className="space-y-5">
      {/* Existing images */}
      {images && images.length > 0 ? (
        <div>
          <h4 className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-3">
            Current Images ({images.length})
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-[#dde3f0] aspect-square">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                {img.is_primary && (
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#2952a3] text-white text-xs rounded-full font-semibold">
                    Primary
                  </div>
                )}
                <button
                  onClick={() => deleteMutation.mutate(img.id)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-[#6b7a9e] text-sm">
          <Image size={32} className="mx-auto mb-2 text-[#dde3f0]" />
          No images yet
        </div>
      )}

      {/* Add new image */}
      <div className="border-t border-[#dde3f0] pt-5">
        <h4 className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-3">
          Add New Image
        </h4>
        <div className="space-y-3">
          <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-[#dde3f0] rounded-xl cursor-pointer hover:border-[#2952a3]/50 transition-colors text-sm text-[#6b7a9e]">
            <Upload size={16} />
            {uploading ? "Uploading..." : "Upload from device"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Or paste image URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]"
            />
          </div>
          {url && (
            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#dde3f0]">
              <img src={url} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-[#3d4663]">Set as primary image</span>
          </label>
          <button
            onClick={handleAdd}
            disabled={!url.trim() || addMutation.isPending}
            className="w-full py-2.5 bg-[#2952a3] text-white text-sm font-semibold rounded-xl hover:bg-[#1e3d7a] transition-colors disabled:opacity-50"
          >
            {addMutation.isPending ? "Adding..." : "Add Image"}
          </button>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-2.5 border border-[#dde3f0] text-[#6b7a9e] text-sm font-semibold rounded-xl hover:bg-[#f0f3f9] transition-colors"
      >
        Done
      </button>
    </div>
  );
};

// ─── Product Form ─────────────────────────────────────────────────────────────
const ProductForm: React.FC<{
  initial?: Partial<ProductCreate>;
  categories: { id: number; name: string }[];
  onSubmit: (data: ProductCreate) => void;
  loading: boolean;
}> = ({ initial, categories, onSubmit, loading }) => {
  const [form, setForm] = useState<ProductCreate>({
    name: initial?.name || "",
    description: initial?.description || "",
    brand: initial?.brand || "",
    product_type: initial?.product_type || "",
    material: initial?.material || "",
    finish: initial?.finish || "",
    profile: initial?.profile || "",
    gauge: initial?.gauge || "",
    color: initial?.color || "",
    unit: initial?.unit || "piece",
    price_from: initial?.price_from || 0,
    price_to: initial?.price_to,
    discount_price: initial?.discount_price,
    length: initial?.length,
    width: initial?.width,
    stock_quantity: initial?.stock_quantity ?? 0,
    minimum_order_quantity: initial?.minimum_order_quantity ?? 1,
    low_stock_threshold: initial?.low_stock_threshold ?? 10,
    is_featured: initial?.is_featured ?? false,
    is_available: initial?.is_available ?? true,
    is_active: initial?.is_active ?? true,
    image_url: initial?.image_url || "",
    category_id: initial?.category_id || (categories[0]?.id ?? 0),
  });

  const set = (key: keyof ProductCreate, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const fieldClass = "w-full px-3 py-2.5 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/10";
  const labelClass = "block text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Product Name *</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={fieldClass} placeholder="e.g. Box Profile Mabati Sheet" />
        </div>
        <div>
          <label className={labelClass}>Brand</label>
          <input value={form.brand || ""} onChange={(e) => set("brand", e.target.value)} className={fieldClass} placeholder="e.g. Mabati Rolling Mills" />
        </div>
        <div>
          <label className={labelClass}>Category *</label>
          <select required value={form.category_id} onChange={(e) => set("category_id", Number(e.target.value))} className={fieldClass}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Product Type</label>
          <input value={form.product_type || ""} onChange={(e) => set("product_type", e.target.value)} className={fieldClass} placeholder="e.g. Corrugated, Box Profile" />
        </div>
        <div>
          <label className={labelClass}>Material</label>
          <input value={form.material || ""} onChange={(e) => set("material", e.target.value)} className={fieldClass} placeholder="e.g. Galvanized Steel" />
        </div>
        <div>
          <label className={labelClass}>Finish</label>
          <input value={form.finish || ""} onChange={(e) => set("finish", e.target.value)} className={fieldClass} placeholder="e.g. Color Coated" />
        </div>
        <div>
          <label className={labelClass}>Profile</label>
          <input value={form.profile || ""} onChange={(e) => set("profile", e.target.value)} className={fieldClass} placeholder="e.g. Box Profile" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea rows={3} value={form.description || ""} onChange={(e) => set("description", e.target.value)} className={fieldClass} placeholder="Product description..." />
      </div>

      {/* Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className={labelClass}>Gauge</label>
          <input value={form.gauge || ""} onChange={(e) => set("gauge", e.target.value)} className={fieldClass} placeholder="e.g. 28G" />
        </div>
        <div>
          <label className={labelClass}>Color</label>
          <input value={form.color || ""} onChange={(e) => set("color", e.target.value)} className={fieldClass} placeholder="e.g. Charcoal" />
        </div>
        <div>
          <label className={labelClass}>Length (m)</label>
          <input type="number" step="0.1" value={form.length || ""} onChange={(e) => set("length", e.target.value ? Number(e.target.value) : undefined)} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Width (m)</label>
          <input type="number" step="0.01" value={form.width || ""} onChange={(e) => set("width", e.target.value ? Number(e.target.value) : undefined)} className={fieldClass} />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#dde3f0]">
        <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-3">Pricing (KES)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Price From *</label>
            <input required type="number" min="0" step="0.01" value={form.price_from} onChange={(e) => set("price_from", Number(e.target.value))} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Price To</label>
            <input type="number" min="0" step="0.01" value={form.price_to || ""} onChange={(e) => set("price_to", e.target.value ? Number(e.target.value) : undefined)} className={fieldClass} placeholder="Optional" />
          </div>
          <div>
            <label className={labelClass}>Discount Price</label>
            <input type="number" min="0" step="0.01" value={form.discount_price || ""} onChange={(e) => set("discount_price", e.target.value ? Number(e.target.value) : undefined)} className={fieldClass} placeholder="Optional" />
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className={labelClass}>Stock Qty</label>
          <input type="number" min="0" value={form.stock_quantity} onChange={(e) => set("stock_quantity", Number(e.target.value))} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Min. Order</label>
          <input type="number" min="1" value={form.minimum_order_quantity} onChange={(e) => set("minimum_order_quantity", Number(e.target.value))} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Low Stock Alert</label>
          <input type="number" min="0" value={form.low_stock_threshold} onChange={(e) => set("low_stock_threshold", Number(e.target.value))} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Unit</label>
          <select value={form.unit || "piece"} onChange={(e) => set("unit", e.target.value)} className={fieldClass}>
            {["piece", "sheet", "roll", "bag", "box", "meter", "kg"].map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className={labelClass}>Primary Image URL</label>
        <input type="url" value={form.image_url || ""} onChange={(e) => set("image_url", e.target.value)} className={fieldClass} placeholder="https://..." />
        {form.image_url && (
          <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-[#dde3f0]">
            <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        {[
          { key: "is_featured", label: "Featured Product" },
          { key: "is_available", label: "Available" },
          { key: "is_active", label: "Active" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(form[key as keyof ProductCreate])}
              onChange={(e) => set(key as keyof ProductCreate, e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-[#3d4663]">{label}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#2952a3] text-white font-bold rounded-xl hover:bg-[#1e3d7a] transition-colors disabled:opacity-60 text-sm"
      >
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const AdminProducts: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [imageProduct, setImageProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", { search }],
    queryFn: () => productsApi.list({ search: search || undefined }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.list,
  });

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); setShowModal(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => productsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); setShowModal(false); setEditProduct(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); setDeleteId(null); },
  });

  const handleSubmit = (data: ProductCreate) => {
    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filtered = products?.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0a1628]">Products</h1>
          <p className="text-sm text-[#6b7a9e] mt-0.5">{filtered.length} products total</p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2952a3] text-white text-sm font-bold rounded-xl hover:bg-[#1e3d7a] transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7a9e]" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#dde3f0] rounded-xl text-sm focus:outline-none focus:border-[#2952a3]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#dde3f0] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[#6b7a9e]">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={40} className="text-[#dde3f0] mx-auto mb-3" />
            <p className="text-[#6b7a9e] text-sm">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#dde3f0]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">Price Range</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider hidden sm:table-cell">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider hidden lg:table-cell">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3f9]">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#f0f3f9] shrink-0">
                          <img
                            src={getPrimaryImage(product)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-[#0a1628] flex items-center gap-1.5">
                            {product.name}
                            {product.is_featured && (
                              <Star size={12} className="fill-amber-400 text-amber-400" />
                            )}
                          </div>
                          {product.gauge && (
                            <div className="text-xs text-[#6b7a9e]">Gauge: {product.gauge}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-[#6b7a9e]">{product.category?.name || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#0a1628] text-xs">
                        {formatPrice(product.price_from)}
                        {product.price_to && (
                          <span className="text-[#6b7a9e]"> – {formatPrice(product.price_to)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-semibold ${
                        product.stock_quantity === 0 ? "text-red-600" :
                        product.stock_quantity <= product.low_stock_threshold ? "text-amber-600" :
                        "text-emerald-600"
                      }`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${product.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                        {!product.is_available && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setImageProduct(product)}
                          className="p-2 rounded-lg text-[#6b7a9e] hover:bg-[#f0f3f9] hover:text-[#2952a3] transition-colors"
                          title="Manage Images"
                        >
                          <Image size={14} />
                        </button>
                        <button
                          onClick={() => { setEditProduct(product); setShowModal(true); }}
                          className="p-2 rounded-lg text-[#6b7a9e] hover:bg-[#f0f3f9] hover:text-[#2952a3] transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 rounded-lg text-[#6b7a9e] hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
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
        onClose={() => { setShowModal(false); setEditProduct(null); }}
        title={editProduct ? "Edit Product" : "Add New Product"}
        size="2xl"
      >
        <ProductForm
          initial={editProduct ? {
            name: editProduct.name,
            description: editProduct.description,
            brand: editProduct.brand,
            product_type: editProduct.product_type,
            material: editProduct.material,
            finish: editProduct.finish,
            profile: editProduct.profile,
            gauge: editProduct.gauge,
            color: editProduct.color,
            unit: editProduct.unit,
            price_from: parseFloat(editProduct.price_from),
            price_to: editProduct.price_to ? parseFloat(editProduct.price_to) : undefined,
            discount_price: editProduct.discount_price ? parseFloat(editProduct.discount_price) : undefined,
            length: editProduct.length,
            width: editProduct.width,
            stock_quantity: editProduct.stock_quantity,
            minimum_order_quantity: editProduct.minimum_order_quantity,
            low_stock_threshold: editProduct.low_stock_threshold,
            is_featured: editProduct.is_featured,
            is_available: editProduct.is_available,
            is_active: editProduct.is_active,
            image_url: editProduct.image_url,
            category_id: editProduct.category_id,
          } : undefined}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
          categories={categories || []}
        />
      </Modal>

      {/* Image Manager Modal */}
      <Modal
        isOpen={imageProduct !== null}
        onClose={() => setImageProduct(null)}
        title={`Manage Images — ${imageProduct?.name || ""}`}
        size="lg"
      >
        {imageProduct && (
          <ImageManager
            productId={imageProduct.id}
            images={imageProduct.images || []}
            onClose={() => setImageProduct(null)}
          />
        )}
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
          <p className="text-[#3d4663] mb-6 text-sm">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 px-4 py-2.5 border border-[#dde3f0] text-[#3d4663] text-sm font-semibold rounded-xl hover:bg-[#f0f3f9] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
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
