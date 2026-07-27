import axios from "axios";
import { auth } from "../config/firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await auth?.currentUser?.getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      (error.code === "ECONNABORTED" ? "The request timed out" : "Something went wrong");
    return Promise.reject(Object.assign(error, { friendlyMessage: message }));
  },
);

export default api;
