// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "staff" | "customer";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
export interface LoginCredentials {
  username: string;
  password: string;
}
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "staff" | "customer";
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
export interface CategoryCreate {
  name: string;
  description?: string;
}

// ─── Product Image ────────────────────────────────────────────────────────────
export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  alt_text?: string;
}
export interface ProductImageCreate {
  image_url: string;
  is_primary?: boolean;
  display_order?: number;
  alt_text?: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  brand?: string;
  product_type?: string;
  material?: string;
  finish?: string;
  profile?: string;
  gauge?: string;
  length?: number;
  width?: number;
  color?: string;
  unit?: string;
  price_from: string;
  price_to?: string;
  discount_price?: string;
  stock_quantity: number;
  minimum_order_quantity: number;
  low_stock_threshold: number;
  is_featured: boolean;
  is_available: boolean;
  is_active: boolean;
  image_url?: string;
  images: ProductImage[];
  category_id: number;
  category?: Category;
  created_at: string;
  updated_at: string;
}
export interface ProductCreate {
  name: string;
  slug?: string;
  description?: string;
  brand?: string;
  product_type?: string;
  material?: string;
  finish?: string;
  profile?: string;
  gauge?: string;
  length?: number;
  width?: number;
  color?: string;
  unit?: string;
  price_from: number;
  price_to?: number;
  discount_price?: number;
  stock_quantity?: number;
  minimum_order_quantity?: number;
  low_stock_threshold?: number;
  is_featured?: boolean;
  is_available?: boolean;
  is_active?: boolean;
  image_url?: string;
  images?: ProductImageCreate[];
  category_id: number;
}
export interface ProductUpdate extends Partial<Omit<ProductCreate, "images">> {}

// ─── Site Content ─────────────────────────────────────────────────────────────
export interface SiteContentOut {
  id: number;
  key: string;
  value: any;
  description?: string;
  updated_at: string;
}

export interface SiteContentCreate {
  key: string;
  value: any;
  description?: string;
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export interface GalleryOut {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryCreate {
  title: string;
  description?: string;
  image_url: string;
  display_order?: number;
  is_active?: boolean;
  category?: string;
}

export interface GalleryUpdate extends Partial<GalleryCreate> {}

export interface ProductFilters {
  search?: string;
  category_id?: number;
  color?: string;
  gauge?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_featured?: boolean;
  product_type?: string;
}

// ─── Inventory ────────────────────────────────────────────────────────────────
export interface InventoryItem {
  id: number;
  name: string;
  stock_quantity: number;
  low_stock_threshold: number;
}
export interface InventoryLog {
  id: number;
  product_id: number;
  change: number;
  reason?: string;
  note?: string;
  performed_by?: number;
  created_at: string;
}
export interface InventoryAdjust {
  change: number;
  reason?: string;
  note?: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export type OrderStatus = "pending" | "confirmed" | "processing" | "completed" | "cancelled";
export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
}
export interface Order {
  id: number;
  customer_id: number;
  status: OrderStatus;
  total_amount: string;
  shipping_address?: string;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}
export interface OrderCreate {
  items: { product_id: number; quantity: number }[];
  shipping_address?: string;
  notes?: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface SalesSummary {
  total_revenue: string;
  completed_orders: number;
  pending_orders: number;
  cancelled_orders: number;
}
export interface DashboardStats {
  total_products: number;
  total_categories: number;
  total_customers: number;
  total_orders: number;
  sales_summary: SalesSummary;
  low_stock_products: InventoryItem[];
}
