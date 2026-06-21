import axios, { AxiosError, type AxiosInstance } from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("rmx_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const message =
      (error.response?.data as any)?.message ||
      (error.response?.data as any)?.error ||
      error.message ||
      "Something went wrong";

    if (status === 401) {
      if (typeof window !== "undefined") {
        const isLoginRequest = error.config?.url?.includes("/login");
        if (!isLoginRequest) {
          localStorage.removeItem("rmx_token");
          localStorage.removeItem("rmx_role");
          localStorage.removeItem("rmx_username");
        }
        if (!isLoginRequest && !window.location.pathname.startsWith("/login")) {
          toast.error("Session expired. Please sign in again.");
          window.location.href = "/login";
        }
      }
    } else if (status && status >= 500) {
      toast.error("Server error. Please try again.");
    } else if (status === 403) {
      toast.error("You don't have permission to do that.");
    } else if (!error.response) {
      // network or offline
    } else {
      toast.error(typeof message === "string" ? message : "Request failed");
    }
    return Promise.reject(error);
  },
);

export type Role = "ROLE_ADMIN" | "ROLE_CONTENT_MANAGER" | "ROLE_STUDENT";
