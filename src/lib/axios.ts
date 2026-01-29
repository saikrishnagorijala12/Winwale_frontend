import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------- REQUEST --------------------
api.interceptors.request.use(async (config) => {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();

  if (idToken) {
    config.headers.Authorization = `Bearer ${idToken}`;
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
