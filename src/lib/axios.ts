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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: "Network error. Please check your connection.",
      });
    }

    const status = error.response.status;

    const message =
      error.response.data?.detail ||
      error.response.data?.message ||
      "Something went wrong.";

    return Promise.reject({
      status,
      message,
    });
  },
);

export default api;
