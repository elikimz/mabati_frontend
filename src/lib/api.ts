import axios from "axios";
import type {
  AuthTokens,
  Category,
  CategoryCreate,
  DashboardStats,
  InventoryAdjust,
  InventoryItem,
  InventoryLog,
  LoginCredentials,
  Order,
  OrderCreate,
  OrderStatus,
  Product,
  ProductCreate,
  ProductFilters,
  ProductImage,
  ProductImageCreate,
  ProductUpdate,
  RegisterData,
  SiteContentOut,
  SiteContentCreate,
  GalleryOut,
  GalleryCreate,
  GalleryUpdate,
  User,
} from "../types";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (creds: LoginCredentials): Promise<AuthTokens> => {
    const form = new URLSearchParams();
    form.append("username", creds.username);
    form.append("password", creds.password);
    const { data } = await apiClient.post<AuthTokens>("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data;
  },
  register: async (payload: RegisterData): Promise<User> => {
    const { data } = await apiClient.post<User>("/auth/register", payload);
    return data;
  },
  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const { data } = await apiClient.post<AuthTokens>("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return data;
  },
  me: async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/auth/me");
    return data;
  },
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  list: async (filters?: ProductFilters): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>("/products", {
      params: filters,
    });
    return data;
  },
  featured: async (limit = 8): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>("/products/featured", {
      params: { limit },
    });
    return data;
  },
  get: async (id: number): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },
  getBySlug: async (slug: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/slug/${slug}`);
    return data;
  },
  related: async (id: number, limit = 6): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>(`/products/${id}/related`, {
      params: { limit },
    });
    return data;
  },
  create: async (payload: ProductCreate): Promise<Product> => {
    const { data } = await apiClient.post<Product>("/admin/products", payload);
    return data;
  },
  update: async (id: number, payload: ProductUpdate): Promise<Product> => {
    const { data } = await apiClient.put<Product>(`/admin/products/${id}`, payload);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/products/${id}`);
  },
  addImage: async (productId: number, payload: ProductImageCreate): Promise<ProductImage> => {
    const { data } = await apiClient.post<ProductImage>(
      `/admin/products/${productId}/images`,
      payload
    );
    return data;
  },
  deleteImage: async (productId: number, imageId: number): Promise<void> => {
    await apiClient.delete(`/admin/products/${productId}/images/${imageId}`);
  },
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>("/categories");
    return data;
  },
  create: async (payload: CategoryCreate): Promise<Category> => {
    const { data } = await apiClient.post<Category>("/admin/categories", payload);
    return data;
  },
  update: async (id: number, payload: Partial<CategoryCreate>): Promise<Category> => {
    const { data } = await apiClient.put<Category>(`/admin/categories/${id}`, payload);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/categories/${id}`);
  },
};

// ─── Inventory ────────────────────────────────────────────────────────────────
export const inventoryApi = {
  list: async (): Promise<InventoryItem[]> => {
    const { data } = await apiClient.get<InventoryItem[]>("/admin/inventory");
    return data;
  },
  adjust: async (id: number, payload: InventoryAdjust): Promise<void> => {
    await apiClient.post(`/admin/inventory/${id}/adjust`, payload);
  },
  logs: async (id: number): Promise<InventoryLog[]> => {
    const { data } = await apiClient.get<InventoryLog[]>(`/admin/inventory/${id}/logs`);
    return data;
  },
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const ordersApi = {
  create: async (payload: OrderCreate): Promise<Order> => {
    const { data } = await apiClient.post<Order>("/orders", payload);
    return data;
  },
  myOrders: async (): Promise<Order[]> => {
    const { data } = await apiClient.get<Order[]>("/orders/my-orders");
    return data;
  },
  adminList: async (): Promise<Order[]> => {
    const { data } = await apiClient.get<Order[]>("/admin/orders");
    return data;
  },
  updateStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const { data } = await apiClient.put<Order>(`/admin/orders/${id}/status`, { status });
    return data;
  },
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = {
  stats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>("/admin/dashboard");
    return data;
  },
};

// ─── Banners ──────────────────────────────────────────────────────────────────
export const bannersApi = {
  list: async (location?: string, activeOnly = true): Promise<any[]> => {
    const { data } = await apiClient.get<any[]>("/banners", {
      params: { location, active_only: activeOnly },
    });
    return data;
  },
  create: async (payload: any): Promise<any> => {
    const { data } = await apiClient.post<any>("/admin/banners", payload);
    return data;
  },
  update: async (id: number, payload: any): Promise<any> => {
    const { data } = await apiClient.patch<any>(`/admin/banners/${id}`, payload);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/banners/${id}`);
  },
};

// ─── Site Content ─────────────────────────────────────────────────────────────
export const siteContentApi = {
  list: async (): Promise<SiteContentOut[]> => {
    const { data } = await apiClient.get<SiteContentOut[]>("/site-content");
    return data;
  },
  get: async (key: string): Promise<SiteContentOut> => {
    const { data } = await apiClient.get<SiteContentOut>(`/site-content/${key}`);
    return data;
  },
  createOrUpdate: async (payload: SiteContentCreate): Promise<SiteContentOut> => {
    const { data } = await apiClient.post<SiteContentOut>("/site-content", payload);
    return data;
  },
  delete: async (key: string): Promise<void> => {
    await apiClient.delete(`/site-content/${key}`);
  },
};

// ─── Gallery ──────────────────────────────────────────────────────────────────
export const galleryApi = {
  list: async (activeOnly = true): Promise<GalleryOut[]> => {
    const { data } = await apiClient.get<GalleryOut[]>("/gallery", {
      params: { active_only: activeOnly },
    });
    return data;
  },
  create: async (payload: GalleryCreate): Promise<GalleryOut> => {
    const { data } = await apiClient.post<GalleryOut>("/gallery", payload);
    return data;
  },
  update: async (id: number, payload: GalleryUpdate): Promise<GalleryOut> => {
    const { data } = await apiClient.patch<GalleryOut>(`/gallery/${id}`, payload);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/gallery/${id}`);
  },
};

// ─── Cloudinary ───────────────────────────────────────────────────────────────
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "doste1wr0";
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "task_images";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData
  );
  return data.secure_url as string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const formatPriceRange = (product: Product): string => {
  const from = parseFloat(product.price_from).toLocaleString("en-KE");
  if (product.price_to) {
    const to = parseFloat(product.price_to).toLocaleString("en-KE");
    return `KES ${from} – ${to}`;
  }
  return `KES ${from}`;
};

export const getPrimaryImage = (product: Product): string => {
  const primary = product.images?.find((img) => img.is_primary);
  return (
    primary?.image_url ||
    product.images?.[0]?.image_url ||
    product.image_url ||
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
  );
};

export const generateWhatsAppUrl = (phone: string, message: string): string => {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

export interface QuoteVariationDetails {
  label?: string;
  sizeLabel?: string;
  unit?: string;
  price?: string | number;
  specifications?: Record<string, string>;
}

export const generateOrderMessage = (
  productName: string,
  gauge?: string,
  color?: string,
  quantity?: number,
  location?: string,
  variation?: QuoteVariationDetails
): string => {
  const price = variation?.price !== undefined
    ? `KES ${Number(variation.price).toLocaleString("en-KE")}${variation.unit ? ` per ${variation.unit}` : ""}`
    : "Please advise";
  const specificationLines = Object.entries(variation?.specifications || {})
    .filter(([key, value]) => key && value)
    .map(([key, value]) => `*${key}:* ${value}`)
    .join("\n");

  return `Hello! I would like a quotation for:

*Product:* ${productName}
${variation?.label ? `*Selected Option:* ${variation.label}\n` : ""}*Gauge:* ${gauge || "Please advise"}
${variation?.sizeLabel ? `*Size / Length:* ${variation.sizeLabel}\n` : ""}*Color:* ${color || "Please advise"}
*Listed Price:* ${price}
*Quantity:* ${quantity || 1} ${variation?.unit || (quantity && quantity > 1 ? "pieces" : "piece")}
*Delivery Location:* ${location || "To be confirmed"}
${specificationLines ? `\n${specificationLines}` : ""}

Please confirm availability and send me your best final quote. Thank you!`;
};
