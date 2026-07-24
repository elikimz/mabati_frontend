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
  username: string; // email used as username per OAuth2PasswordRequestForm
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

// ─── Product ──────────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  price: string;
  discount_price?: string;
  color?: string;
  gauge?: string;
  length?: number;
  width?: number;
  profile?: string;
  stock_quantity: number;
  low_stock_threshold: number;
  image_url?: string;
  is_active: boolean;
  category_id: number;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  description?: string;
  brand?: string;
  price: number;
  discount_price?: number;
  color?: string;
  gauge?: string;
  length?: number;
  width?: number;
  profile?: string;
  stock_quantity?: number;
  low_stock_threshold?: number;
  image_url?: string;
  is_active?: boolean;
  category_id: number;
}

export interface ProductUpdate extends Partial<ProductCreate> {}

export interface ProductFilters {
  search?: string;
  category_id?: number;
  color?: string;
  gauge?: string;
  min_price?: number;
  max_price?: number;
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
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "completed"
  | "cancelled";

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
