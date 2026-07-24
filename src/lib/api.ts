import axios from "axios";
import type {
  AuthTokens,
  Category,
  CategoryCreate,
  DashboardStats,
  InventoryAdjust,
  InventoryItem,
  InventoryLog,
  Order,
  OrderCreate,
  OrderStatus,
  Product,
  ProductCreate,
  ProductFilters,
  ProductUpdate,
  RegisterData,
  User,
} from "../types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Token management ─────────────────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const { data } = await axios.post<AuthTokens>(
            `${BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return apiClient(original);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string): Promise<AuthTokens> => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
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
  get: async (id: number): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },
  create: async (payload: ProductCreate): Promise<Product> => {
    const { data } = await apiClient.post<Product>("/admin/products", payload);
    return data;
  },
  update: async (id: number, payload: ProductUpdate): Promise<Product> => {
    const { data } = await apiClient.put<Product>(
      `/admin/products/${id}`,
      payload
    );
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/products/${id}`);
  },
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>("/categories");
    return data;
  },
  create: async (payload: CategoryCreate): Promise<Category> => {
    const { data } = await apiClient.post<Category>(
      "/admin/categories",
      payload
    );
    return data;
  },
  update: async (
    id: number,
    payload: Partial<CategoryCreate>
  ): Promise<Category> => {
    const { data } = await apiClient.put<Category>(
      `/admin/categories/${id}`,
      payload
    );
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
    const { data } = await apiClient.get<InventoryLog[]>(
      `/admin/inventory/${id}/logs`
    );
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
    const { data } = await apiClient.put<Order>(
      `/admin/orders/${id}/status`,
      { status }
    );
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

// ─── Cloudinary ───────────────────────────────────────────────────────────────
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData
  );
  return data.secure_url as string;
};
