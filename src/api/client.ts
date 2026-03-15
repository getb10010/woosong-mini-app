import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Telegram initData header қосу
api.interceptors.request.use((config) => {
  const tg = (window as any).Telegram?.WebApp;
  if (tg?.initData) {
    config.headers["X-Init-Data"] = tg.initData;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized");
    }
    if (error.response?.status === 429) {
      console.error("Rate limited");
    }
    return Promise.reject(error);
  }
);

export default api;