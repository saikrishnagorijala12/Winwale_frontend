import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Deeply trims all string values in an object or array.
 */
const deepTrim = (data: any): any => {
  if (typeof data === "string") {
    return data.trim();
  }
  if (data !== null && typeof data === "object") {
    // Only handle plain objects and arrays to avoid breaking FormData or other special objects
    if (Array.isArray(data)) {
      return data.map((item) => deepTrim(item));
    }
    // Check if it's a plain object
    if (Object.getPrototypeOf(data) === Object.prototype) {
      const trimmed: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          trimmed[key] = deepTrim(data[key]);
        }
      }
      return trimmed;
    }
  }
  return data;
};

// -------------------- REQUEST --------------------
api.interceptors.request.use(async (config) => {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();

  if (idToken) {
    config.headers.Authorization = `Bearer ${idToken}`;
  }

  // Automatically trim payloads for POST, PUT, and PATCH requests
  if (
    config.data &&
    ["post", "put", "patch"].includes(config.method?.toLowerCase() || "")
  ) {
    config.data = deepTrim(config.data);
  }

  return config;
});

// -------------------- RESPONSE --------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network / CORS / timeout
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message =
      error.response.data?.detail ||
      error.response.data?.message;

    // Server errors
    if (status >= 500) {
      toast.error(message || "Server error. Please try again later.");
    }

    if (status === 401) {
      toast.error("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);

export default api;
