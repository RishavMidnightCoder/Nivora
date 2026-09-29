import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

// Same-origin proxy defined in next.config.ts. Do NOT read this from an env var.
const baseURL = "/backend";

const apiInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<void> | null = null;

function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${baseURL}/users/refresh`, {}, { withCredentials: true })
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const httpStatus = error?.response?.status;
    const url = originalRequest?.url ?? "";

    const isAuthRoute =
      url.includes("/users/login") ||
      url.includes("/users/verify-otp") ||
      url.includes("/users/refresh");

    if (
      httpStatus === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        return apiInstance(originalRequest);
      } catch {
        window.dispatchEvent(new Event("app:logout"));
        return Promise.reject(error);
      }
    }

    if (httpStatus === 401 && (isAuthRoute || originalRequest?._retry)) {
      window.dispatchEvent(new Event("app:logout"));
      return Promise.reject(error);
    }

    const detail = (error?.response?.data as any)?.detail;

    let message: string;
    if (typeof detail === "string") {
      message = detail;
    } else if (Array.isArray(detail)) {
      message = detail.map((d) => d?.msg ?? "Invalid input").join(", ");
    } else {
      message = error?.message || "Something went wrong. Please try again.";
    }

    toast.error(message);
    return Promise.reject(error);
  },
);

export default apiInstance;
