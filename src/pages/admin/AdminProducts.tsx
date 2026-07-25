import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit2,
  Image,
  Layers3,
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
import type {
  Product,
  ProductCreate,
  ProductImageCreate,
  ProductUpdate,
  ProductVariationCreate,
  ProductVariationUpsert,
} from "../../types";

const formatPrice = (value: string | number | undefined) =>
  value !== undefined && value !== "" ? `KES ${Number(value).toLocaleString("en-KE")}` : "—";

const optionalText = (value?: string) => value?.trim() || undefined;
const nextDraftId = () => `variation-${Date.now()}-${Math.random().toString(36).slice(2)}`;

type VariationDraft = ProductVariationUpsert & { clientId: string };
type ProductFormState = Omit<ProductCreate, "variations"> & { variations: VariationDraft[] };

const blankVariation = (index: number, unit = "MTRS"): VariationDraft => ({
  clientId: nextDraftId(),
  name: "",
  sku: "",
  gauge: "",
  size_label: "",
  length: undefined,
  width: undefined,
  color: "",
  unit,
  price: 0,
  discount_price: undefined,
  specifications: {},
  sort_order: index,
  is_available: true,
  is_active: true,
});

const productVariationToDraft = (variation: Product["variations"][number]): VariationDraft => ({
  id: variation.id,
  clientId: nextDraftId(),
  name: variation.name || "",
  sku: variation.sku || "",
  gauge: variation.gauge || "",
  size_label: variation.size_label || "",
  length: variation.length,
  width: variation.width,
  color: variation.color || "",
  unit: variation.unit || "piece",
  price: Number(variation.price),
  discount_price: variation.discount_price ? Number(variation.discount_price) : undefined,
  specifications: variation.specifications || {},
  sort_order: variation.sort_order,
  is_available: variation.is_available,
  is_active: variation.is_active,
});

const variationLabel = (variation: VariationDraft) =>
  variation.name || [variation.gauge && `Gauge ${variation.gauge}`, variation.size_label, variation.color]
    .filter(Boolean)
    .join(" · ") || "Untitled option";

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dde3f0] sticky top-0 bg-white z-10">
          <h2 className="font-bold text-[#0a1628]">{title}</h2>
          <button onClick={onClose} className="text-[#6b7a9e] hover:text-[#0a1628]" aria-label="Close dialog">
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
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const addMutation = useMutation({
    mutationFn: (data: ProductImageCreate) => productsApi.addImage(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      setUrl("");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (imageId: number) => productsApi.deleteImage(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setUrl(await uploadToCloudinary(file));
    } catch {
      alert("Upload failed. Please paste an image URL instead.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      {images.length > 0 ? (
        <div>
          <h4 className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-3">Current Images ({images.length})</h4>
          <div className="grid grid-cols-3 gap-3">
            {images.map((image) => (
              <div key={image.id} className="relative group rounded-xl overflow-hidden border border-[#dde3f0] aspect-square">
                <img src={image.image_url} alt={image.alt_text || "Product"} className="w-full h-full object-cover" />
                {image.is_primary && <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#2952a3] text-white text-xs rounded-full font-semibold">Primary</span>}
                <button onClick={() => deleteMutation.mutate(image.id)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Delete image">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-[#6b7a9e] text-sm"><Image size={32} className="mx-auto mb-2 text-[#dde3f0]" />No images yet</div>
      )}

      <div className="border-t border-[#dde3f0] pt-5 space-y-3">
        <h4 className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">Add New Image</h4>
        <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-[#dde3f0] rounded-xl cursor-pointer hover:border-[#2952a3]/50 transition-colors text-sm text-[#6b7a9e]">
          <Upload size={16} />{uploading ? "Uploading..." : "Upload from device"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
        </label>
        <input type="url" placeholder="Or paste image URL" value={url} onChange={(event) => setUrl(event.target.value)} className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]" />
        {url && <div className="w-full h-32 rounded-xl overflow-hidden border border-[#dde3f0]"><img src={url} alt="Preview" className="w-full h-full object-cover" /></div>}
        <label className="flex items-center gap-2 cursor-pointer text-sm text-[#3d4663]"><input type="checkbox" checked={isPrimary} onChange={(event) => setIsPrimary(event.target.checked)} className="w-4 h-4 rounded" />Set as primary image</label>
        <button onClick={() => url.trim() && addMutation.mutate({ image_url: url.trim(), is_primary: isPrimary })} disabled={!url.trim() || addMutation.isPending} className="w-full py-2.5 bg-[#2952a3] text-white text-sm font-semibold rounded-xl hover:bg-[#1e3d7a] transition-colors disabled:opacity-50">
          {addMutation.isPending ? "Adding..." : "Add Image"}
        </button>
      </div>
      <button onClick={onClose} className="w-full py-2.5 border border-[#dde3f0] text-[#6b7a9e] text-sm font-semibold rounded-xl hover:bg-[#f0f3f9]">Done</button>
    </div>
  );
};

// ─── Product Form ─────────────────────────────────────────────────────────────
const ProductForm: React.FC<{
  initial?: Partial<ProductCreate> & { variations?: ProductVariationUpsert[] };
  categories: { id: number; name: string }[];
  onSubmit: (data: ProductCreate) => void;
  loading: boolean;
}> = ({ initial, categories, onSubmit, loading }) => {
  const [form, setForm] = useState<ProductFormState>({
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
    price_from: initial?.price_from ?? 0,
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
    category_id: initial?.category_id || categories[0]?.id || 0,
    variations: (initial?.variations || []).map((variation, index) => ({
      ...variation,
      clientId: nextDraftId(),
      unit: variation.unit || "piece",
      price: Number(variation.price),
      discount_price: variation.discount_price === undefined ? undefined : Number(variation.discount_price),
      specifications: variation.specifications || {},
      sort_order: variation.sort_order ?? index,
    })),
  });

  const set = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const addVariation = () => setForm((current) => ({
    ...current,
    variations: [...current.variations, blankVariation(current.variations.length, current.unit || "MTRS")],
  }));

  const updateVariation = <K extends keyof VariationDraft>(clientId: string, key: K, value: VariationDraft[K]) =>
    setForm((current) => ({
      ...current,
      variations: current.variations.map((variation) => variation.clientId === clientId ? { ...variation, [key]: value } : variation),
    }));

  const removeVariation = (clientId: string) =>
    setForm((current) => ({ ...current, variations: current.variations.filter((variation) => variation.clientId !== clientId) }));

  const updateSpecification = (clientId: string, oldKey: string, key: string, value: string) => {
    const variation = form.variations.find((item) => item.clientId === clientId);
    if (!variation) return;
    const specifications = { ...(variation.specifications || {}) };
    delete specifications[oldKey];
    if (key.trim()) specifications[key] = value;
    updateVariation(clientId, "specifications", specifications);
  };

  const addSpecification = (clientId: string) => {
    const variation = form.variations.find((item) => item.clientId === clientId);
    if (!variation) return;
    const base = "Specification";
    let key = base;
    let suffix = 2;
    while (Object.prototype.hasOwnProperty.call(variation.specifications || {}, key)) key = `${base} ${suffix++}`;
    updateVariation(clientId, "specifications", { ...(variation.specifications || {}), [key]: "" });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.category_id) {
      alert("Please choose a category.");
      return;
    }
    if (form.variations.length === 0 && (!form.price_from || form.price_from <= 0)) {
      alert("Enter a legacy price or add at least one priced variation.");
      return;
    }
    if (form.variations.some((variation) => !variation.price || variation.price <= 0)) {
      alert("Every variation must have a price greater than zero.");
      return;
    }

    const variations: ProductVariationCreate[] = form.variations.map(({ clientId, id, ...variation }) => ({
      ...variation,
      name: optionalText(variation.name),
      sku: optionalText(variation.sku),
      gauge: optionalText(variation.gauge),
      size_label: optionalText(variation.size_label),
      color: optionalText(variation.color),
      discount_price: variation.discount_price || undefined,
      specifications: Object.fromEntries(Object.entries(variation.specifications || {}).filter(([key, value]) => key.trim() && value.trim())),
    }));

    // The update endpoint accepts IDs to perform a nested upsert; retain them only
    // when editing an existing product.
    const variationIds = Object.fromEntries(form.variations.map((variation) => [variation.clientId, variation.id]));
    const upsertVariations: ProductVariationUpsert[] = variations.map((variation, index) => ({
      ...variation,
      id: variationIds[form.variations[index].clientId],
      sort_order: index,
    }));

    const payload: ProductCreate = {
      ...form,
      description: optionalText(form.description),
      brand: optionalText(form.brand),
      product_type: optionalText(form.product_type),
      material: optionalText(form.material),
      finish: optionalText(form.finish),
      profile: optionalText(form.profile),
      gauge: optionalText(form.gauge),
      color: optionalText(form.color),
      image_url: optionalText(form.image_url),
      price_from: form.variations.length ? undefined : form.price_from,
      price_to: form.variations.length ? undefined : form.price_to,
      discount_price: form.variations.length ? undefined : form.discount_price,
      variations: upsertVariations,
    };
    onSubmit(payload);
  };

  const fieldClass = "w-full px-3 py-2.5 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/10";
  const labelClass = "block text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><label className={labelClass}>Product Name *</label><input required value={form.name} onChange={(event) => set("name", event.target.value)} className={fieldClass} placeholder="e.g. Roman Tile Profile" /></div>
        <div><label className={labelClass}>Brand</label><input value={form.brand || ""} onChange={(event) => set("brand", event.target.value)} className={fieldClass} placeholder="e.g. Mabati Rolling Mills" /></div>
        <div><label className={labelClass}>Category *</label><select required value={form.category_id} onChange={(event) => set("category_id", Number(event.target.value))} className={fieldClass}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
        <div><label className={labelClass}>Product Type</label><input value={form.product_type || ""} onChange={(event) => set("product_type", event.target.value)} className={fieldClass} placeholder="e.g. Roofing sheet" /></div>
        <div><label className={labelClass}>Profile</label><input value={form.profile || ""} onChange={(event) => set("profile", event.target.value)} className={fieldClass} placeholder="e.g. Roman Tile" /></div>
        <div><label className={labelClass}>Material</label><input value={form.material || ""} onChange={(event) => set("material", event.target.value)} className={fieldClass} placeholder="e.g. Galvanized steel" /></div>
        <div><label className={labelClass}>Finish</label><input value={form.finish || ""} onChange={(event) => set("finish", event.target.value)} className={fieldClass} placeholder="e.g. Color coated" /></div>
      </div>

      <div><label className={labelClass}>Description</label><textarea rows={3} value={form.description || ""} onChange={(event) => set("description", event.target.value)} className={fieldClass} placeholder="Describe the product family and its benefits..." /></div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className={labelClass}>Default Gauge</label><input value={form.gauge || ""} onChange={(event) => set("gauge", event.target.value)} className={fieldClass} placeholder="Legacy/default" /></div>
        <div><label className={labelClass}>Default Color</label><input value={form.color || ""} onChange={(event) => set("color", event.target.value)} className={fieldClass} placeholder="Legacy/default" /></div>
        <div><label className={labelClass}>Default Length (m)</label><input type="number" min="0" step="0.1" value={form.length || ""} onChange={(event) => set("length", event.target.value ? Number(event.target.value) : undefined)} className={fieldClass} /></div>
        <div><label className={labelClass}>Default Width (m)</label><input type="number" min="0" step="0.01" value={form.width || ""} onChange={(event) => set("width", event.target.value ? Number(event.target.value) : undefined)} className={fieldClass} /></div>
      </div>

      <section className="rounded-2xl border border-[#cbd7f0] bg-[#f5f8ff] overflow-hidden">
        <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#dce5f6]">
          <div><div className="flex items-center gap-2 font-bold text-[#0a1628]"><Layers3 size={17} className="text-[#2952a3]" />Priced Variations</div><p className="text-xs text-[#6b7a9e] mt-1">Add each gauge, length, size, or specification once and manage its price independently.</p></div>
          <button type="button" onClick={addVariation} className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#2952a3] text-white text-xs font-bold rounded-lg hover:bg-[#1e3d7a]"><Plus size={15} />Add Variation</button>
        </div>

        {form.variations.length === 0 ? (
          <div className="p-5 text-sm text-[#6b7a9e]">No variations yet. The product will use the legacy single price below until you add an option.</div>
        ) : (
          <div className="divide-y divide-[#dce5f6]">
            {form.variations.map((variation, index) => (
              <div key={variation.clientId} className="p-4 space-y-4 bg-white/70">
                <div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-sm text-[#0a1628]">Option {index + 1}: {variationLabel(variation)}</p><p className="text-xs text-[#6b7a9e]">Each active option appears in the customer comparison table.</p></div><button type="button" onClick={() => removeVariation(variation.clientId)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"><Trash2 size={14} />Remove</button></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div><label className={labelClass}>Option Name</label><input value={variation.name || ""} onChange={(event) => updateVariation(variation.clientId, "name", event.target.value)} className={fieldClass} placeholder="e.g. 30 Gauge" /></div>
                  <div><label className={labelClass}>Gauge</label><input value={variation.gauge || ""} onChange={(event) => updateVariation(variation.clientId, "gauge", event.target.value)} className={fieldClass} placeholder="e.g. 30 Gauge" /></div>
                  <div><label className={labelClass}>Price (KES) *</label><input required type="number" min="0.01" step="0.01" value={variation.price || ""} onChange={(event) => updateVariation(variation.clientId, "price", Number(event.target.value))} className={fieldClass} /></div>
                  <div><label className={labelClass}>Unit *</label><select value={variation.unit} onChange={(event) => updateVariation(variation.clientId, "unit", event.target.value)} className={fieldClass}>{["MTRS", "piece", "sheet", "roll", "bag", "box", "meter", "kg"].map((unit) => <option key={unit} value={unit}>{unit}</option>)}</select></div>
                  <div><label className={labelClass}>Size / Length Label</label><input value={variation.size_label || ""} onChange={(event) => updateVariation(variation.clientId, "size_label", event.target.value)} className={fieldClass} placeholder="e.g. Cut to length" /></div>
                  <div><label className={labelClass}>Length (m)</label><input type="number" min="0" step="0.1" value={variation.length || ""} onChange={(event) => updateVariation(variation.clientId, "length", event.target.value ? Number(event.target.value) : undefined)} className={fieldClass} /></div>
                  <div><label className={labelClass}>Width (m)</label><input type="number" min="0" step="0.01" value={variation.width || ""} onChange={(event) => updateVariation(variation.clientId, "width", event.target.value ? Number(event.target.value) : undefined)} className={fieldClass} /></div>
                  <div><label className={labelClass}>Colour</label><input value={variation.color || ""} onChange={(event) => updateVariation(variation.clientId, "color", event.target.value)} className={fieldClass} placeholder="e.g. Charcoal" /></div>
                  <div><label className={labelClass}>SKU / Code</label><input value={variation.sku || ""} onChange={(event) => updateVariation(variation.clientId, "sku", event.target.value)} className={fieldClass} placeholder="Optional" /></div>
                  <div><label className={labelClass}>Offer Price (KES)</label><input type="number" min="0.01" step="0.01" value={variation.discount_price || ""} onChange={(event) => updateVariation(variation.clientId, "discount_price", event.target.value ? Number(event.target.value) : undefined)} className={fieldClass} placeholder="Optional" /></div>
                  <div className="flex items-end pb-2"><label className="flex items-center gap-2 cursor-pointer text-sm text-[#3d4663]"><input type="checkbox" checked={variation.is_available !== false} onChange={(event) => updateVariation(variation.clientId, "is_available", event.target.checked)} className="w-4 h-4 rounded" />Available to customers</label></div>
                  <div className="flex items-end pb-2"><label className="flex items-center gap-2 cursor-pointer text-sm text-[#3d4663]"><input type="checkbox" checked={variation.is_active !== false} onChange={(event) => updateVariation(variation.clientId, "is_active", event.target.checked)} className="w-4 h-4 rounded" />Active option</label></div>
                </div>
                <div><div className="flex items-center justify-between mb-2"><label className={labelClass}>Additional Specifications</label><button type="button" onClick={() => addSpecification(variation.clientId)} className="text-xs font-semibold text-[#2952a3] hover:text-[#1e3d7a]">+ Add specification</button></div>
                  {Object.entries(variation.specifications || {}).length === 0 ? <p className="text-xs text-[#6b7a9e]">Add details such as coating, ridge angle, diameter, or pack size.</p> : <div className="space-y-2">{Object.entries(variation.specifications || {}).map(([key, value]) => <div key={key} className="flex gap-2"><input value={key} onChange={(event) => updateSpecification(variation.clientId, key, event.target.value, value)} className={`${fieldClass} flex-1`} placeholder="Specification" /><input value={value} onChange={(event) => updateSpecification(variation.clientId, key, key, event.target.value)} className={`${fieldClass} flex-1`} placeholder="Value" /><button type="button" onClick={() => { const specifications = { ...(variation.specifications || {}) }; delete specifications[key]; updateVariation(variation.clientId, "specifications", specifications); }} className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg" aria-label="Remove specification"><X size={16} /></button></div>)}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {form.variations.length === 0 && <section className="bg-[#f8fafc] rounded-xl p-4 border border-[#dde3f0]"><h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-3">Legacy Single Price (KES)</h4><p className="text-xs text-[#6b7a9e] mb-3">Use this only for products that truly have one price. Add variations above to price gauges, sizes, or units independently.</p><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div><label className={labelClass}>Price *</label><input required type="number" min="0.01" step="0.01" value={form.price_from || ""} onChange={(event) => set("price_from", Number(event.target.value))} className={fieldClass} /></div><div><label className={labelClass}>Price To</label><input type="number" min="0" step="0.01" value={form.price_to || ""} onChange={(event) => set("price_to", event.target.value ? Number(event.target.value) : undefined)} className={fieldClass} placeholder="Optional" /></div><div><label className={labelClass}>Discount Price</label><input type="number" min="0" step="0.01" value={form.discount_price || ""} onChange={(event) => set("discount_price", event.target.value ? Number(event.target.value) : undefined)} className={fieldClass} placeholder="Optional" /></div></div></section>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className={labelClass}>Product Stock Qty</label><input type="number" min="0" value={form.stock_quantity ?? 0} onChange={(event) => set("stock_quantity", Number(event.target.value))} className={fieldClass} /></div>
        <div><label className={labelClass}>Min. Order</label><input type="number" min="1" value={form.minimum_order_quantity ?? 1} onChange={(event) => set("minimum_order_quantity", Number(event.target.value))} className={fieldClass} /></div>
        <div><label className={labelClass}>Low Stock Alert</label><input type="number" min="0" value={form.low_stock_threshold ?? 10} onChange={(event) => set("low_stock_threshold", Number(event.target.value))} className={fieldClass} /></div>
        <div><label className={labelClass}>Default Unit</label><select value={form.unit || "piece"} onChange={(event) => set("unit", event.target.value)} className={fieldClass}>{["piece", "sheet", "roll", "bag", "box", "meter", "kg"].map((unit) => <option key={unit} value={unit}>{unit}</option>)}</select></div>
      </div>

      <div><label className={labelClass}>Primary Image URL</label><input type="url" value={form.image_url || ""} onChange={(event) => set("image_url", event.target.value)} className={fieldClass} placeholder="https://..." />{form.image_url && <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-[#dde3f0]"><img src={form.image_url} alt="Preview" className="w-full h-full object-cover" /></div>}</div>

      <div className="flex flex-wrap gap-6">{[{ key: "is_featured", label: "Featured Product" }, { key: "is_available", label: "Available" }, { key: "is_active", label: "Active" }].map(({ key, label }) => <label key={key} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={Boolean(form[key as keyof ProductFormState])} onChange={(event) => set(key as keyof ProductFormState, event.target.checked as never)} className="w-4 h-4 rounded" /><span className="text-sm font-medium text-[#3d4663]">{label}</span></label>)}</div>

      <button type="submit" disabled={loading} className="w-full py-3 bg-[#2952a3] text-white font-bold rounded-xl hover:bg-[#1e3d7a] transition-colors disabled:opacity-60 text-sm">{loading ? "Saving..." : "Save Product"}</button>
    </form>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const AdminProducts: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [imageProduct, setImageProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery({ queryKey: ["products", { search }], queryFn: () => productsApi.list({ search: search || undefined }) });
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: categoriesApi.list });
  const refreshProducts = () => { queryClient.invalidateQueries({ queryKey: ["products"] }); queryClient.invalidateQueries({ queryKey: ["product"] }); };

  const createMutation = useMutation({ mutationFn: productsApi.create, onSuccess: () => { refreshProducts(); setShowModal(false); } });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: number; data: ProductUpdate }) => productsApi.update(id, data), onSuccess: () => { refreshProducts(); setShowModal(false); setEditProduct(null); } });
  const deleteMutation = useMutation({ mutationFn: productsApi.delete, onSuccess: () => { refreshProducts(); setDeleteId(null); } });

  const handleSubmit = (data: ProductCreate) => {
    if (editProduct) updateMutation.mutate({ id: editProduct.id, data });
    else createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-black text-[#0a1628]">Products</h1><p className="text-sm text-[#6b7a9e] mt-0.5">{products.length} products total</p></div><button onClick={() => { setEditProduct(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#2952a3] text-white text-sm font-bold rounded-xl hover:bg-[#1e3d7a]"><Plus size={16} />Add Product</button></div>
      <div className="relative"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7a9e]" /><input type="text" placeholder="Search products..." value={search} onChange={(event) => setSearch(event.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#dde3f0] rounded-xl text-sm focus:outline-none focus:border-[#2952a3]" /></div>

      <div className="bg-white rounded-2xl border border-[#dde3f0] overflow-hidden">
        {isLoading ? <div className="p-12 text-center text-[#6b7a9e]">Loading products...</div> : products.length === 0 ? <div className="p-12 text-center"><Package size={40} className="text-[#dde3f0] mx-auto mb-3" /><p className="text-[#6b7a9e] text-sm">No products found</p></div> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-[#f8fafc] border-b border-[#dde3f0]"><th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">Product</th><th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider hidden md:table-cell">Category</th><th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">Options & Price</th><th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider hidden sm:table-cell">Stock</th><th className="text-right px-4 py-3 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">Actions</th></tr></thead><tbody className="divide-y divide-[#f0f3f9]">{products.map((product) => <tr key={product.id} className="hover:bg-[#f8fafc]"><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl overflow-hidden bg-[#f0f3f9] shrink-0"><img src={getPrimaryImage(product)} alt={product.name} className="w-full h-full object-cover" /></div><div><div className="font-semibold text-[#0a1628] flex items-center gap-1.5">{product.name}{product.is_featured && <Star size={12} className="fill-amber-400 text-amber-400" />}</div><div className="text-xs text-[#6b7a9e]">{product.variations?.length ? `${product.variations.length} priced option${product.variations.length === 1 ? "" : "s"}` : "Legacy single-price product"}</div></div></div></td><td className="px-4 py-3 hidden md:table-cell"><span className="text-xs text-[#6b7a9e]">{product.category?.name || "—"}</span></td><td className="px-4 py-3"><div className="font-semibold text-[#0a1628] text-xs">{formatPrice(product.price_from)}{product.price_to && <span className="text-[#6b7a9e]"> – {formatPrice(product.price_to)}</span>}</div><div className="text-xs text-[#6b7a9e] mt-1">{product.variations?.[0]?.unit ? `per ${product.variations[0].unit}` : product.unit || ""}</div></td><td className="px-4 py-3 hidden sm:table-cell"><span className={`text-xs font-semibold ${product.stock_quantity === 0 ? "text-red-600" : product.stock_quantity <= product.low_stock_threshold ? "text-amber-600" : "text-emerald-600"}`}>{product.stock_quantity}</span></td><td className="px-4 py-3"><div className="flex items-center justify-end gap-1"><button onClick={() => setImageProduct(product)} className="p-2 rounded-lg text-[#6b7a9e] hover:bg-[#f0f3f9] hover:text-[#2952a3]" title="Manage images"><Image size={14} /></button><button onClick={() => { setEditProduct(product); setShowModal(true); }} className="p-2 rounded-lg text-[#6b7a9e] hover:bg-[#f0f3f9] hover:text-[#2952a3]" title="Edit product"><Edit2 size={14} /></button><button onClick={() => setDeleteId(product.id)} className="p-2 rounded-lg text-[#6b7a9e] hover:bg-red-50 hover:text-red-600" title="Delete product"><Trash2 size={14} /></button></div></td></tr>)}</tbody></table></div>}
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditProduct(null); }} title={editProduct ? "Edit Product" : "Add New Product"} size="2xl">
        <ProductForm
          initial={editProduct ? {
            name: editProduct.name, description: editProduct.description, brand: editProduct.brand, product_type: editProduct.product_type, material: editProduct.material, finish: editProduct.finish, profile: editProduct.profile, gauge: editProduct.gauge, color: editProduct.color, unit: editProduct.unit, price_from: Number(editProduct.price_from), price_to: editProduct.price_to ? Number(editProduct.price_to) : undefined, discount_price: editProduct.discount_price ? Number(editProduct.discount_price) : undefined, length: editProduct.length, width: editProduct.width, stock_quantity: editProduct.stock_quantity, minimum_order_quantity: editProduct.minimum_order_quantity, low_stock_threshold: editProduct.low_stock_threshold, is_featured: editProduct.is_featured, is_available: editProduct.is_available, is_active: editProduct.is_active, image_url: editProduct.image_url, category_id: editProduct.category_id, variations: editProduct.variations?.map(productVariationToDraft),
          } : undefined}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
          categories={categories}
        />
      </Modal>

      <Modal isOpen={imageProduct !== null} onClose={() => setImageProduct(null)} title={`Manage Images — ${imageProduct?.name || ""}`} size="lg">{imageProduct && <ImageManager productId={imageProduct.id} images={imageProduct.images || []} onClose={() => setImageProduct(null)} />}</Modal>
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Product" size="sm"><div className="text-center"><div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div><p className="text-[#3d4663] mb-6 text-sm">Are you sure you want to delete this product? Its variations will also be removed.</p><div className="flex gap-3"><button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-[#dde3f0] text-[#3d4663] text-sm font-semibold rounded-xl hover:bg-[#f0f3f9]">Cancel</button><button onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-60">{deleteMutation.isPending ? "Deleting..." : "Delete"}</button></div></div></Modal>
    </div>
  );
};

export default AdminProducts;
