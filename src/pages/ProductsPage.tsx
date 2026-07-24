import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  X,
  Grid3x3,
  List,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsApi, categoriesApi } from "../lib/api";
import { cn } from "../lib/utils";
import { useTheme } from "../contexts/ThemeContext";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254788873611";

type ViewMode = "grid" | "list";

interface Filters {
  search: string;
  category: string | null;
  gauge: string | null;
  color: string | null;
  priceRange: [number, number];
  inStock: boolean | null;
}

export default function ProductsPage() {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: null,
    gauge: null,
    color: null,
    priceRange: [0, 100000],
    inStock: null,
  });

  // Fetch data
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.getAll(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  // Extract unique values for filters
  const uniqueGauges = useMemo(
    () => [...new Set(products.map((p) => p.gauge).filter(Boolean))],
    [products]
  );
  const uniqueColors = useMemo(
    () => [...new Set(products.map((p) => p.color).filter(Boolean))],
    [products]
  );

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (
        filters.search &&
        !product.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Category
      if (filters.category && product.category_id !== parseInt(filters.category)) {
        return false;
      }

      // Gauge
      if (filters.gauge && product.gauge !== filters.gauge) {
        return false;
      }

      // Color
      if (filters.color && product.color !== filters.color) {
        return false;
      }

      // Price range
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      // In stock
      if (filters.inStock === true && product.stock === 0) {
        return false;
      }
      if (filters.inStock === false && product.stock > 0) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  return (
    <div className={cn(theme === "dark" ? "bg-[#050d1a]" : "bg-white")}>
      {/* Hero Section */}
      <section className={cn(
        "relative py-20 border-b",
        theme === "dark"
          ? "bg-gradient-to-r from-[#0a1628] via-[#152b55] to-[#2952a3] border-white/5"
          : "bg-gradient-to-r from-[#2952a3] via-[#1e3d7a] to-[#152b55]"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            Our Products
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Premium roofing materials for every project and budget
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={cn(
            "lg:col-span-1",
            mobileFilterOpen ? "block" : "hidden lg:block"
          )}>
            <div className={cn(
              "rounded-2xl p-6 sticky top-24 space-y-6",
              theme === "dark"
                ? "bg-[#0a1628] border border-white/10"
                : "bg-[#f8fafc] border border-[#dde3f0]"
            )}>
              {/* Close button for mobile */}
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="lg:hidden absolute top-4 right-4"
              >
                <X size={20} className={theme === "dark" ? "text-white" : "text-[#0a1628]"} />
              </button>

              <h3 className={cn(
                "text-lg font-bold",
                theme === "dark" ? "text-white" : "text-[#0a1628]"
              )}>
                Filters
              </h3>

              {/* Search */}
              <div>
                <label className={cn(
                  "text-sm font-semibold mb-2 block",
                  theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]"
                )}>
                  Search Products
                </label>
                <div className={cn(
                  "relative",
                  theme === "dark" ? "bg-white/10" : "bg-white"
                )}>
                  <Search size={16} className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2",
                    theme === "dark" ? "text-[#6b7a9e]" : "text-[#6b7a9e]"
                  )} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    className={cn(
                      "w-full pl-10 pr-4 py-2 rounded-lg text-sm border transition-colors",
                      theme === "dark"
                        ? "bg-white/10 border-white/10 text-white placeholder-[#6b7a9e] focus:border-white/20 focus:outline-none"
                        : "bg-white border-[#dde3f0] text-[#0a1628] placeholder-[#6b7a9e] focus:border-[#2952a3] focus:outline-none"
                    )}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className={cn(
                  "text-sm font-semibold mb-2 block",
                  theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]"
                )}>
                  Category
                </label>
                <select
                  value={filters.category || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      category: e.target.value ? e.target.value : null,
                    })
                  }
                  className={cn(
                    "w-full px-4 py-2 rounded-lg text-sm border transition-colors",
                    theme === "dark"
                      ? "bg-white/10 border-white/10 text-white focus:border-white/20 focus:outline-none"
                      : "bg-white border-[#dde3f0] text-[#0a1628] focus:border-[#2952a3] focus:outline-none"
                  )}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gauge */}
              {uniqueGauges.length > 0 && (
                <div>
                  <label className={cn(
                    "text-sm font-semibold mb-2 block",
                    theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]"
                  )}>
                    Gauge
                  </label>
                  <select
                    value={filters.gauge || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        gauge: e.target.value ? e.target.value : null,
                      })
                    }
                    className={cn(
                      "w-full px-4 py-2 rounded-lg text-sm border transition-colors",
                      theme === "dark"
                        ? "bg-white/10 border-white/10 text-white focus:border-white/20 focus:outline-none"
                        : "bg-white border-[#dde3f0] text-[#0a1628] focus:border-[#2952a3] focus:outline-none"
                    )}
                  >
                    <option value="">All Gauges</option>
                    {uniqueGauges.map((gauge) => (
                      <option key={gauge} value={gauge}>
                        {gauge}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Color */}
              {uniqueColors.length > 0 && (
                <div>
                  <label className={cn(
                    "text-sm font-semibold mb-2 block",
                    theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]"
                  )}>
                    Color
                  </label>
                  <select
                    value={filters.color || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        color: e.target.value ? e.target.value : null,
                      })
                    }
                    className={cn(
                      "w-full px-4 py-2 rounded-lg text-sm border transition-colors",
                      theme === "dark"
                        ? "bg-white/10 border-white/10 text-white focus:border-white/20 focus:outline-none"
                        : "bg-white border-[#dde3f0] text-[#0a1628] focus:border-[#2952a3] focus:outline-none"
                    )}
                  >
                    <option value="">All Colors</option>
                    {uniqueColors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Stock Status */}
              <div>
                <label className={cn(
                  "text-sm font-semibold mb-3 block",
                  theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]"
                )}>
                  Availability
                </label>
                <div className="space-y-2">
                  {[
                    { value: null, label: "All Products" },
                    { value: true, label: "In Stock Only" },
                    { value: false, label: "Out of Stock" },
                  ].map((option) => (
                    <label key={String(option.value)} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stock"
                        checked={filters.inStock === option.value}
                        onChange={() =>
                          setFilters({ ...filters, inStock: option.value })
                        }
                        className="w-4 h-4"
                      />
                      <span className={cn(
                        "text-sm",
                        theme === "dark" ? "text-[#b8c1d9]" : "text-[#6b7a9e]"
                      )}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(filters.search ||
                filters.category ||
                filters.gauge ||
                filters.color ||
                filters.inStock !== null) && (
                <button
                  onClick={() =>
                    setFilters({
                      search: "",
                      category: null,
                      gauge: null,
                      color: null,
                      priceRange: [0, 100000],
                      inStock: null,
                    })
                  }
                  className={cn(
                    "w-full py-2 rounded-lg text-sm font-semibold transition-colors",
                    theme === "dark"
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-[#f0f3f9] text-[#0a1628] hover:bg-[#e2e8f0]"
                  )}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className={cn(
                  "text-2xl font-bold",
                  theme === "dark" ? "text-white" : "text-[#0a1628]"
                )}>
                  {filteredProducts.length} Products
                </h2>
                <p className={cn(
                  "text-sm",
                  theme === "dark" ? "text-[#6b7a9e]" : "text-[#6b7a9e]"
                )}>
                  {filteredProducts.length === products.length
                    ? "Showing all products"
                    : `Filtered from ${products.length} total`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className={cn(
                  "flex items-center gap-2 p-1 rounded-lg",
                  theme === "dark" ? "bg-white/10" : "bg-[#f0f3f9]"
                )}>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded transition-colors",
                      viewMode === "grid"
                        ? theme === "dark"
                          ? "bg-white/20 text-white"
                          : "bg-white text-[#0a1628]"
                        : theme === "dark"
                          ? "text-[#6b7a9e]"
                          : "text-[#6b7a9e]"
                    )}
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded transition-colors",
                      viewMode === "list"
                        ? theme === "dark"
                          ? "bg-white/20 text-white"
                          : "bg-white text-[#0a1628]"
                        : theme === "dark"
                          ? "text-[#6b7a9e]"
                          : "text-[#6b7a9e]"
                    )}
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className={cn(
                    "lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                    theme === "dark"
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-[#f0f3f9] text-[#0a1628] hover:bg-[#e2e8f0]"
                  )}
                >
                  <Filter size={18} />
                  Filters
                </button>
              </div>
            </div>

            {/* Products Display */}
            {filteredProducts.length === 0 ? (
              <div className={cn(
                "text-center py-20 rounded-2xl border-2 border-dashed",
                theme === "dark"
                  ? "bg-white/5 border-white/10"
                  : "bg-[#f8fafc] border-[#dde3f0]"
              )}>
                <div className="text-4xl mb-4">🔍</div>
                <h3 className={cn(
                  "text-xl font-bold mb-2",
                  theme === "dark" ? "text-white" : "text-[#0a1628]"
                )}>
                  No Products Found
                </h3>
                <p className={cn(
                  "mb-6",
                  theme === "dark" ? "text-[#6b7a9e]" : "text-[#6b7a9e]"
                )}>
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      search: "",
                      category: null,
                      gauge: null,
                      color: null,
                      priceRange: [0, 100000],
                      inStock: null,
                    })
                  }
                  className={cn(
                    "px-6 py-2 rounded-lg font-semibold transition-colors",
                    theme === "dark"
                      ? "bg-[#2952a3] text-white hover:bg-[#1e3d7a]"
                      : "bg-[#2952a3] text-white hover:bg-[#1e3d7a]"
                  )}
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug || product.id}`}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl",
                      theme === "dark"
                        ? "bg-[#152b55] hover:bg-[#1e3a6e]"
                        : "bg-white hover:shadow-xl"
                    )}
                  >
                    {/* Product Image */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#2952a3] to-[#152b55]">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📦</div>
                            <div className="text-sm">No image</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={cn(
                      "p-6",
                      theme === "dark" ? "bg-[#152b55]" : "bg-white"
                    )}>
                      <h3 className={cn(
                        "font-bold text-lg mb-2 line-clamp-2",
                        theme === "dark" ? "text-white" : "text-[#0a1628]"
                      )}>
                        {product.name}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.gauge && (
                          <span className={cn(
                            "text-xs font-semibold px-3 py-1 rounded-full",
                            theme === "dark"
                              ? "bg-white/10 text-[#4d79ff]"
                              : "bg-[#2952a3]/10 text-[#2952a3]"
                          )}>
                            {product.gauge}
                          </span>
                        )}
                        {product.color && (
                          <span className={cn(
                            "text-xs font-semibold px-3 py-1 rounded-full",
                            theme === "dark"
                              ? "bg-white/10 text-[#f0c94a]"
                              : "bg-[#d4a017]/10 text-[#d4a017]"
                          )}>
                            {product.color}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          {product.price && (
                            <div className={cn(
                              "text-sm font-semibold",
                              theme === "dark" ? "text-[#8e9bbf]" : "text-[#6b7a9e]"
                            )}>
                              KES {product.price.toLocaleString()}
                            </div>
                          )}
                          {product.stock > 0 ? (
                            <div className="text-xs text-[#10b981] font-semibold mt-1">
                              In Stock
                            </div>
                          ) : (
                            <div className="text-xs text-[#ef4444] font-semibold mt-1">
                              Out of Stock
                            </div>
                          )}
                        </div>
                        <ArrowRight size={18} className={cn(
                          "transition-transform group-hover:translate-x-1",
                          theme === "dark" ? "text-[#4d79ff]" : "text-[#2952a3]"
                        )} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug || product.id}`}
                    className={cn(
                      "group flex gap-6 p-6 rounded-2xl transition-all duration-300 hover:shadow-xl",
                      theme === "dark"
                        ? "bg-[#0a1628] border border-white/10 hover:border-white/20"
                        : "bg-[#f8fafc] border border-[#dde3f0]"
                    )}
                  >
                    {/* Image */}
                    <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#2952a3] to-[#152b55]">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className={cn(
                          "font-bold text-lg mb-2",
                          theme === "dark" ? "text-white" : "text-[#0a1628]"
                        )}>
                          {product.name}
                        </h3>
                        <p className={cn(
                          "text-sm mb-3 line-clamp-2",
                          theme === "dark" ? "text-[#6b7a9e]" : "text-[#6b7a9e]"
                        )}>
                          {product.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.gauge && (
                            <span className={cn(
                              "text-xs font-semibold px-3 py-1 rounded-full",
                              theme === "dark"
                                ? "bg-white/10 text-[#4d79ff]"
                                : "bg-[#2952a3]/10 text-[#2952a3]"
                            )}>
                              {product.gauge}
                            </span>
                          )}
                          {product.color && (
                            <span className={cn(
                              "text-xs font-semibold px-3 py-1 rounded-full",
                              theme === "dark"
                                ? "bg-white/10 text-[#f0c94a]"
                                : "bg-[#d4a017]/10 text-[#d4a017]"
                            )}>
                              {product.color}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex flex-col items-end justify-between">
                      <div className="text-right">
                        {product.price && (
                          <div className={cn(
                            "text-lg font-bold",
                            theme === "dark" ? "text-white" : "text-[#0a1628]"
                          )}>
                            KES {product.price.toLocaleString()}
                          </div>
                        )}
                        {product.stock > 0 ? (
                          <div className="text-xs text-[#10b981] font-semibold mt-1">
                            In Stock
                          </div>
                        ) : (
                          <div className="text-xs text-[#ef4444] font-semibold mt-1">
                            Out of Stock
                          </div>
                        )}
                      </div>
                      <ArrowRight size={20} className={cn(
                        "transition-transform group-hover:translate-x-1",
                        theme === "dark" ? "text-[#4d79ff]" : "text-[#2952a3]"
                      )} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className={cn(
        "py-20 border-t mt-12",
        theme === "dark"
          ? "bg-gradient-to-r from-[#0a1628] via-[#152b55] to-[#2952a3] border-white/5"
          : "bg-gradient-to-r from-[#2952a3] via-[#1e3d7a] to-[#152b55]"
      )}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Can't Find What You Need?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Contact our experts for custom solutions and bulk orders
          </p>
          <a
            href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about custom roofing solutions.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#1ebe5d] transition-colors shadow-xl shadow-[#25D366]/30 text-lg"
          >
            <MessageCircle size={20} />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
