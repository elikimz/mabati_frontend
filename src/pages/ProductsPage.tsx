import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Filter,
  MessageCircle,
  Package,
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  Grid3X3,
  List,
  ArrowRight,
} from "lucide-react";
import {
  categoriesApi,
  formatPriceRange,
  generateOrderMessage,
  generateWhatsAppUrl,
  getPrimaryImage,
  productsApi,
} from "../lib/api";
import type { Product, ProductFilters } from "../types";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254788873611";

const GAUGES = ["28G", "30G", "32G", "0.3mm", "0.4mm", "0.47mm", "0.55mm"];
const COLORS = ["Charcoal", "Red", "Green", "Blue", "Brown", "Silver", "White", "Black"];

// ─── Premium Product Card (Grid) ──────────────────────────────────────────────
const ProductCardGrid: React.FC<{ product: Product }> = ({ product }) => {
  const imgSrc = getPrimaryImage(product);
  const waUrl = generateWhatsAppUrl(
    WHATSAPP,
    `Hello MRM Mabati Rolling Mills, I would like to enquire about ${product.name}.`
  );
  const isOutOfStock = !product.is_available || product.stock_quantity === 0;
  const isLowStock = !isOutOfStock && product.stock_quantity <= product.low_stock_threshold;

  return (
    <div className="group bg-white rounded-3xl border border-[#dde3f0] overflow-hidden hover:shadow-2xl hover:shadow-[#2952a3]/8 hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden bg-[#f0f3f9]" style={{ aspectRatio: "4/3" }}>
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_featured && (
            <span className="px-2.5 py-1 bg-[#d4a017] text-white text-xs font-bold rounded-full shadow-lg">
              Featured
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
              Out of Stock
            </span>
          )}
          {isLowStock && (
            <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
              Low Stock
            </span>
          )}
        </div>
        {/* Image count */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm">
            +{product.images.length - 1} photos
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Link
            to={`/products/${product.slug || product.id}`}
            className="px-5 py-2 bg-white text-[#0a1628] text-sm font-bold rounded-xl hover:bg-[#f0f3f9] transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {product.category && (
          <div className="text-xs font-bold text-[#2952a3] uppercase tracking-wider mb-1">
            {product.category.name}
          </div>
        )}
        <h3 className="font-bold text-[#0a1628] text-base mb-2 line-clamp-2 group-hover:text-[#2952a3] transition-colors">
          {product.name}
        </h3>

        {/* Specs chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.gauge && (
            <span className="px-2 py-0.5 bg-[#f0f3f9] text-[#3d4663] text-xs rounded-full font-medium border border-[#dde3f0]">
              {product.gauge}
            </span>
          )}
          {product.color && (
            <span className="px-2 py-0.5 bg-[#f0f3f9] text-[#3d4663] text-xs rounded-full font-medium border border-[#dde3f0]">
              {product.color}
            </span>
          )}
          {product.material && (
            <span className="px-2 py-0.5 bg-[#f0f3f9] text-[#3d4663] text-xs rounded-full font-medium border border-[#dde3f0]">
              {product.material}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-xs text-[#6b7a9e] mb-0.5">
            {product.price_to ? "Price range" : "Starting from"}
          </div>
          <div className="text-lg font-black text-[#0a1628]">
            {formatPriceRange(product)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/products/${product.slug || product.id}`}
            className="flex-1 text-center px-3 py-2.5 bg-[#0a1628] text-white text-sm font-semibold rounded-xl hover:bg-[#152b55] transition-colors"
          >
            View Details
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 bg-[#25D366] text-white rounded-xl hover:bg-[#1da851] transition-colors shrink-0"
            title="Order on WhatsApp"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Product Card (List) ──────────────────────────────────────────────────────
const ProductCardList: React.FC<{ product: Product }> = ({ product }) => {
  const imgSrc = getPrimaryImage(product);
  const waUrl = generateWhatsAppUrl(
    WHATSAPP,
    `Hello MRM Mabati Rolling Mills, I would like to enquire about ${product.name}.`
  );

  return (
    <div className="group bg-white rounded-2xl border border-[#dde3f0] overflow-hidden hover:shadow-xl hover:shadow-[#2952a3]/5 transition-all duration-300 flex">
      <div className="w-40 sm:w-52 shrink-0 overflow-hidden bg-[#f0f3f9]">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {product.category && (
            <div className="text-xs font-bold text-[#2952a3] uppercase tracking-wider mb-1">
              {product.category.name}
            </div>
          )}
          <h3 className="font-bold text-[#0a1628] text-lg mb-2 group-hover:text-[#2952a3] transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-[#6b7a9e] text-sm leading-relaxed mb-3 line-clamp-2">{product.description}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.gauge && <span className="px-2 py-0.5 bg-[#f0f3f9] text-[#3d4663] text-xs rounded-full font-medium border border-[#dde3f0]">{product.gauge}</span>}
            {product.color && <span className="px-2 py-0.5 bg-[#f0f3f9] text-[#3d4663] text-xs rounded-full font-medium border border-[#dde3f0]">{product.color}</span>}
            {product.material && <span className="px-2 py-0.5 bg-[#f0f3f9] text-[#3d4663] text-xs rounded-full font-medium border border-[#dde3f0]">{product.material}</span>}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-[#6b7a9e]">{product.price_to ? "Price range" : "Starting from"}</div>
            <div className="text-xl font-black text-[#0a1628]">{formatPriceRange(product)}</div>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/products/${product.slug || product.id}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0a1628] text-white text-sm font-semibold rounded-xl hover:bg-[#152b55] transition-colors"
            >
              Details <ChevronRight size={14} />
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 bg-[#25D366] text-white rounded-xl hover:bg-[#1da851] transition-colors"
            >
              <MessageCircle size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Filters Sidebar ──────────────────────────────────────────────────────────
interface FiltersProps {
  filters: ProductFilters;
  onChange: (f: ProductFilters) => void;
  onClose?: () => void;
}

const FiltersSidebar: React.FC<FiltersProps> = ({ filters, onChange, onClose }) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.list,
  });

  const set = (key: keyof ProductFilters, value: unknown) =>
    onChange({ ...filters, [key]: value || undefined });

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-[#dde3f0] p-6 space-y-6 sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#0a1628] flex items-center gap-2">
          <Filter size={16} />
          Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-[#2952a3] text-white text-xs rounded-full flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </h3>
        {onClose && (
          <button onClick={onClose} className="text-[#6b7a9e] hover:text-[#0a1628]">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-bold text-[#6b7a9e] uppercase tracking-wider mb-3 block">Category</label>
        <div className="space-y-1">
          <button
            onClick={() => set("category_id", undefined)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.category_id ? "bg-[#2952a3] text-white font-semibold" : "text-[#3d4663] hover:bg-[#f0f3f9]"}`}
          >
            All Categories
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => set("category_id", filters.category_id === c.id ? undefined : c.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category_id === c.id ? "bg-[#2952a3] text-white font-semibold" : "text-[#3d4663] hover:bg-[#f0f3f9]"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Gauge */}
      <div>
        <label className="text-xs font-bold text-[#6b7a9e] uppercase tracking-wider mb-3 block">Gauge</label>
        <div className="flex flex-wrap gap-2">
          {GAUGES.map((g) => (
            <button
              key={g}
              onClick={() => set("gauge", filters.gauge === g ? undefined : g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                filters.gauge === g
                  ? "bg-[#2952a3] text-white border-[#2952a3]"
                  : "bg-white text-[#3d4663] border-[#dde3f0] hover:border-[#2952a3]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="text-xs font-bold text-[#6b7a9e] uppercase tracking-wider mb-3 block">Color</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => set("color", filters.color === c ? undefined : c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                filters.color === c
                  ? "bg-[#2952a3] text-white border-[#2952a3]"
                  : "bg-white text-[#3d4663] border-[#dde3f0] hover:border-[#2952a3]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="text-xs font-bold text-[#6b7a9e] uppercase tracking-wider mb-3 block">Price Range (KES)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price || ""}
            onChange={(e) => set("min_price", e.target.value ? Number(e.target.value) : undefined)}
            className="flex-1 px-3 py-2 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price || ""}
            onChange={(e) => set("max_price", e.target.value ? Number(e.target.value) : undefined)}
            className="flex-1 px-3 py-2 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]"
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="text-xs font-bold text-[#6b7a9e] uppercase tracking-wider mb-3 block">Availability</label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.in_stock === true}
            onChange={(e) => set("in_stock", e.target.checked ? true : undefined)}
            className="w-4 h-4 rounded border-[#dde3f0] text-[#2952a3] accent-[#2952a3]"
          />
          <span className="text-sm text-[#3d4663] font-medium">In Stock Only</span>
        </label>
      </div>

      {/* Reset */}
      {activeCount > 0 && (
        <button
          onClick={() => onChange({})}
          className="w-full px-4 py-2.5 border border-[#dde3f0] text-[#6b7a9e] text-sm font-semibold rounded-xl hover:bg-[#f0f3f9] transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>({});
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", filters, search],
    queryFn: () => productsApi.list({ ...filters, search: search || undefined }),
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Premium Page Header */}
      <div className="bg-[#0a1628] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/90 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2952a3]/30 text-[#4d79ff] text-xs font-bold uppercase tracking-widest mb-4">
            Our Products
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
            Premium Roofing Materials
          </h1>
          <p className="text-[#8e9bbf] text-lg max-w-xl">
            Browse our complete range of high-quality mabati sheets, gutters, ridge caps and roofing accessories.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { label: "500+ Products", icon: <Package size={14} /> },
              { label: "All Gauges Available", icon: <ChevronRight size={14} /> },
              { label: "WhatsApp Ordering", icon: <MessageCircle size={14} /> },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/10">
                <span className="text-[#d4a017]">{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + Controls bar */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7a9e]" />
            <input
              type="text"
              placeholder="Search products, brands, materials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#dde3f0] rounded-xl text-sm focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 shadow-sm"
            />
          </div>
          {/* View mode toggle */}
          <div className="hidden sm:flex items-center bg-white border border-[#dde3f0] rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 transition-colors ${viewMode === "grid" ? "bg-[#2952a3] text-white" : "text-[#6b7a9e] hover:bg-[#f0f3f9]"}`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 transition-colors ${viewMode === "list" ? "bg-[#2952a3] text-white" : "text-[#6b7a9e] hover:bg-[#f0f3f9]"}`}
            >
              <List size={18} />
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-[#dde3f0] rounded-xl text-sm font-semibold text-[#3d4663] hover:bg-[#f0f3f9] shadow-sm"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FiltersSidebar filters={filters} onChange={setFilters} />
          </aside>

          {/* Mobile filters drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto p-4 shadow-2xl">
                <FiltersSidebar filters={filters} onChange={setFilters} onClose={() => setShowFilters(false)} />
              </div>
            </div>
          )}

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[#6b7a9e]">
                {isLoading ? "Loading..." : (
                  <span>
                    <span className="font-bold text-[#0a1628]">{products?.length || 0}</span> products found
                  </span>
                )}
              </p>
              {Object.values(filters).some(Boolean) && (
                <button
                  onClick={() => setFilters({})}
                  className="text-xs text-[#2952a3] font-semibold hover:underline flex items-center gap-1"
                >
                  <X size={12} /> Clear filters
                </button>
              )}
            </div>

            {isLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={`bg-white rounded-2xl animate-pulse border border-[#dde3f0] ${viewMode === "grid" ? "h-80" : "h-36"}`} />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCardGrid key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <ProductCardList key={product.id} product={product} />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-[#dde3f0]">
                <div className="w-20 h-20 bg-[#f0f3f9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={36} className="text-[#dde3f0]" />
                </div>
                <h3 className="text-xl font-bold text-[#0a1628] mb-2">No products found</h3>
                <p className="text-[#6b7a9e] text-sm mb-6 max-w-sm mx-auto">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => { setFilters({}); setSearch(""); }}
                  className="px-6 py-3 bg-[#2952a3] text-white rounded-xl text-sm font-semibold hover:bg-[#1e3d7a] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* WhatsApp CTA */}
            {products && products.length > 0 && (
              <div className="mt-12 p-8 bg-[#0a1628] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">Can't find what you need?</h3>
                  <p className="text-[#8e9bbf] text-sm">Contact us on WhatsApp and we'll help you find the right product.</p>
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I need help finding a roofing product.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-colors whitespace-nowrap"
                >
                  <MessageCircle size={18} />
                  Chat on WhatsApp
                  <ArrowRight size={16} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
