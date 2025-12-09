// API Configuration & HTTP Client

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const API_GATEWAY_URL = process.env.API_GATEWAY_URL ;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_GATEWAY_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export { apiClient, USE_MOCK_DATA };

// API endpoints configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/authenticate",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  MOVIES: {
    LIST: "/movies",
    DETAIL: (id: string) => `/movies/${id}`,
    SHOWTIMES: (id: string) => `/movies/${id}/showtimes`,
    CREATE: "/movie",
    UPDATE: (id: string) => `/movies/${id}`,
    DELETE: (id: string) => `/movies/${id}`,
  },
  BOOKING: {
    CREATE: "/bookings",
    LIST: "/bookings",
    DETAIL: (id: string) => `/bookings/${id}`,
    SEATS: (showtimeId: string) => `/bookings/showtimes/${showtimeId}/seats`,
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
  },
  PAYMENT: {
    CREATE: "/payments",
    DETAIL: (id: string) => `/payments/${id}`,
    CALLBACK: "/payments/callback",
  },
  USER: {
    PROFILE: "/users/profile",
    UPDATE: "/users/profile",
    BOOKINGS: "/users/bookings",
  },
};
