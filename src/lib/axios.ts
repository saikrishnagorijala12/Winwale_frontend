import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const session = await fetchAuthSession();

  const idToken = session.tokens?.idToken?.toString();

  if (idToken) {
    config.headers.Authorization = `Bearer ${idToken}`;
  }

  return config;
});

export default api;
