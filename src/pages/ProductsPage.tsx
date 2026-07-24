import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  MessageCircle,
  ChevronRight,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { productsApi, categoriesApi } from "../lib/api";
import {
  formatCurrency,
  generateWhatsAppUrl,
  generateOrderMessage,
} from "../lib/utils";
import { PageLoader, EmptyState, Badge } from "../components/ui";
import type { Product } from "../types";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "254700000000";
  const waUrl = generateWhatsAppUrl(
    whatsappNumber,
    generateOrderMessage(
      product.name,
      product.color,
      product.gauge,
      product.length
    )
  );

  const fallbackImg =
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&auto=format&fit=crop";

  return (
    <div className="group bg-white rounded-2xl border border-[#dde3f0] overflow-hidden hover:border-[#2952a3]/30 hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-[#f0f3f9]">
        <img
          src={product.image_url || fallbackImg}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.discount_price && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              SALE
            </span>
          )}
          {product.stock_quantity === 0 && (
            <span className="bg-[#0a1628]/80 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick WhatsApp */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] text-white text-xs font-semibold rounded-lg shadow-lg hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle size={13} />
            Order Now
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {product.category && (
          <div className="text-xs text-[#2952a3] font-semibold uppercase tracking-wider mb-2">
            {product.category.name}
          </div>
        )}
        <h3 className="font-bold text-[#0a1628] mb-2 leading-tight line-clamp-2">
          {product.name}
        </h3>

        {/* Specs row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.gauge && (
            <Badge variant="outline" className="text-xs">
              {product.gauge} gauge
            </Badge>
          )}
          {product.color && (
            <Badge variant="outline" className="text-xs">
              {product.color}
            </Badge>
          )}
          {product.length && (
            <Badge variant="outline" className="text-xs">
              {product.length}m
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-black text-[#0a1628]">
            {formatCurrency(product.price)}
          </span>
          {product.discount_price && (
            <span className="text-sm text-[#6b7a9e] line-through">
              {formatCurrency(product.discount_price)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] text-white text-sm font-semibold rounded-lg hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle size={15} />
            WhatsApp
          </a>
          <Link
            to={`/products/${product.id}`}
            className="flex items-center justify-center px-3 py-2.5 border-2 border-[#dde3f0] text-[#3d4663] rounded-lg hover:border-[#152b55] hover:text-[#152b55] transition-colors"
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedGauge, setSelectedGauge] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list(),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
  });

  // Derive filter options from products
  const colors = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.color).filter(Boolean))] as string[];
  }, [products]);

  const gauges = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.gauge).filter(Boolean))] as string[];
  }, [products]);

  // Apply filters
  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        !selectedCategory || p.category_id === selectedCategory;
      const matchColor = !selectedColor || p.color === selectedColor;
      const matchGauge = !selectedGauge || p.gauge === selectedGauge;
      return matchSearch && matchCategory && matchColor && matchGauge;
    });
  }, [products, search, selectedCategory, selectedColor, selectedGauge]);

  const hasFilters =
    search || selectedCategory || selectedColor || selectedGauge;

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedColor("");
    setSelectedGauge("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Page header */}
      <div className="bg-[#0a1628] pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[#2952a3] text-sm font-semibold uppercase tracking-wider mb-4">
              <div className="w-8 h-px bg-[#2952a3]" />
              Product Catalogue
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Premium Mabati
              <br />
              <span className="text-gradient-gold">Roofing Products</span>
            </h1>
            <p className="text-[#6b7a9e] text-lg">
              Browse our complete range of quality roofing materials. Order
              directly via WhatsApp for instant service.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7a9e]"
            />
            <input
              type="text"
              placeholder="Search products by name, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#dde3f0] rounded-xl text-sm text-[#0a1628] placeholder:text-[#6b7a9e] focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7a9e] hover:text-[#0a1628]"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
              showFilters || hasFilters
                ? "bg-[#152b55] text-white border-[#152b55]"
                : "bg-white text-[#3d4663] border-[#dde3f0] hover:border-[#152b55]"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasFilters && (
              <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                {[selectedCategory, selectedColor, selectedGauge].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-[#dde3f0] p-6 mb-8 animate-fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-2 block">
                  Category
                </label>
                <select
                  value={selectedCategory || ""}
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="w-full px-3 py-2.5 bg-[#f8fafc] border border-[#dde3f0] rounded-lg text-sm text-[#0a1628] focus:outline-none focus:border-[#2952a3]"
                >
                  <option value="">All Categories</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-2 block">
                  Color
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#f8fafc] border border-[#dde3f0] rounded-lg text-sm text-[#0a1628] focus:outline-none focus:border-[#2952a3]"
                >
                  <option value="">All Colors</option>
                  {colors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-2 block">
                  Gauge
                </label>
                <select
                  value={selectedGauge}
                  onChange={(e) => setSelectedGauge(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#f8fafc] border border-[#dde3f0] rounded-lg text-sm text-[#0a1628] focus:outline-none focus:border-[#2952a3]"
                >
                  <option value="">All Gauges</option>
                  {gauges.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <X size={14} />
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#6b7a9e]">
            {productsLoading
              ? "Loading products..."
              : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-[#2952a3] hover:text-[#152b55] font-medium flex items-center gap-1"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        {/* Products grid */}
        {productsLoading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your search or filters to find what you're looking for."
            icon={<Filter size={28} />}
            action={
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 bg-[#152b55] text-white text-sm font-semibold rounded-lg hover:bg-[#0f2040] transition-colors"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
