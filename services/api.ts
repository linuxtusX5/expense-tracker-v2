import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL_API;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add auth token to requests
// api.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem("authToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Handle auth errors
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       await AsyncStorage.removeItem("authToken");
//       await AsyncStorage.removeItem("user");
//     }
//     return Promise.reject(error);
//   }
// );
api.interceptors.request.use(async (config) => {
  const isAuthRoute =
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/register");

  if (!isAuthRoute) {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface ExpenseData {
  amount: number;
  description: string;
  category: string;
  date: Date;
}

// Auth API
export const authAPI = {
  login: async (data: LoginData) => {
    const response = await api.post("/auth/login", JSON.stringify(data));
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post("/auth/register", JSON.stringify(data));
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Expenses API
export const expensesAPI = {
  getExpenses: async (params?: {
    category?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/expenses", { params });
    return response.data;
  },

  createExpense: async (data: ExpenseData) => {
    const response = await api.post("/expenses", data);
    return response.data;
  },

  updateExpense: async (id: string, data: Partial<ExpenseData>) => {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  },

  deleteExpense: async (id: string) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get("/expenses/analytics");
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  initCategories: async () => {
    const response = await api.post("/categories/init");
    return response.data;
  },
};

// Income API
export const incomeAPI = {
  getIncome: async () => {
    const response = await api.get("/income/");
    return response.data;
  },

  createIncome: async (data: { amount: number; source: string }) => {
    const response = await api.post("/income", data);
    return response.data;
  },
};

export default api;
