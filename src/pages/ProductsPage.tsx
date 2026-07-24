import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Filter,
  MessageCircle,
  Package,
  Search,
  SlidersHorizontal,
  X,
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

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254700000000";

const GAUGES = ["28G", "30G", "32G", "0.3mm", "0.4mm", "0.47mm", "0.55mm"];
const COLORS = ["Charcoal", "Red", "Green", "Blue", "Brown", "Silver", "White", "Black"];

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const imgSrc = getPrimaryImage(product);
  const waUrl = generateWhatsAppUrl(
    WHATSAPP,
    generateOrderMessage(product.name, product.gauge, product.color)
  );

  return (
    <div className="bg-white rounded-2xl border border-[#dde3f0] overflow-hidden hover:shadow-xl hover:border-[#2952a3]/20 transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#f0f3f9]">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.is_featured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-[#2952a3] text-white text-xs font-bold rounded-full">
            Featured
          </div>
        )}
        {!product.is_available || product.stock_quantity === 0 ? (
          <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            Out of Stock
          </div>
        ) : product.stock_quantity <= product.low_stock_threshold ? (
          <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
            Low Stock
          </div>
        ) : null}
        {/* Gallery count badge */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
            +{product.images.length - 1} photos
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {product.category && (
          <div className="text-xs font-semibold text-[#2952a3] uppercase tracking-wider mb-1">
            {product.category.name}
          </div>
        )}
        <h3 className="font-bold text-[#0a1628] text-base mb-2 line-clamp-2 group-hover:text-[#2952a3] transition-colors">
          {product.name}
        </h3>

        {/* Specs chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.gauge && (
            <span className="px-2 py-0.5 bg-[#f0f3f9] text-[#3d4663] text-xs rounded-full font-medium">
              {product.gauge}
            </span>
          )}
          {product.color && (
            <span className="px-2 py-0.5 bg-[#f0f3f9] text-[#3d4663] text-xs rounded-full font-medium">
              {product.color}
            </span>
          )}
          {product.material && (
            <span className="px-2 py-0.5 bg-[#f0f3f9] text-[#3d4663] text-xs rounded-full font-medium">
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
          {product.price_to && (
            <div className="text-xs text-[#6b7a9e]">Varies by size & quantity</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/products/${product.id}`}
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

  return (
    <div className="bg-white rounded-2xl border border-[#dde3f0] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#0a1628] flex items-center gap-2">
          <Filter size={16} />
          Filters
        </h3>
        {onClose && (
          <button onClick={onClose} className="text-[#6b7a9e] hover:text-[#0a1628]">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-2 block">
          Category
        </label>
        <select
          value={filters.category_id || ""}
          onChange={(e) => set("category_id", e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg text-sm text-[#0a1628] focus:outline-none focus:border-[#2952a3]"
        >
          <option value="">All Categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Gauge */}
      <div>
        <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-2 block">
          Gauge
        </label>
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
        <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-2 block">
          Color
        </label>
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
        <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-2 block">
          Price Range (KES)
        </label>
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
        <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-2 block">
          Availability
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.in_stock === true}
            onChange={(e) => set("in_stock", e.target.checked ? true : undefined)}
            className="w-4 h-4 rounded border-[#dde3f0] text-[#2952a3]"
          />
          <span className="text-sm text-[#3d4663]">In Stock Only</span>
        </label>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({})}
        className="w-full px-4 py-2.5 border border-[#dde3f0] text-[#6b7a9e] text-sm font-semibold rounded-xl hover:bg-[#f0f3f9] transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProductsPage: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", filters, search],
    queryFn: () => productsApi.list({ ...filters, search: search || undefined }),
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Page header */}
      <div className="bg-[#0a1628] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white mb-3">Our Products</h1>
          <p className="text-[#8e9bbf] text-lg">
            Browse our complete range of premium roofing materials
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search bar */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7a9e]" />
            <input
              type="text"
              placeholder="Search products, brands, materials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#dde3f0] rounded-xl text-sm focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-[#dde3f0] rounded-xl text-sm font-semibold text-[#3d4663] hover:bg-[#f0f3f9]"
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

          {/* Products grid */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[#6b7a9e]">
                {isLoading ? "Loading..." : `${products?.length || 0} products found`}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-[#dde3f0]" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Package size={48} className="text-[#dde3f0] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#0a1628] mb-2">No products found</h3>
                <p className="text-[#6b7a9e] text-sm mb-6">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => { setFilters({}); setSearch(""); }}
                  className="px-6 py-2.5 bg-[#2952a3] text-white rounded-xl text-sm font-semibold hover:bg-[#1e3d7a] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
