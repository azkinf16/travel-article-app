import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "../store/authStore";

const api: AxiosInstance = axios.create({
  baseURL: "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include Bearer token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (data: {
  email: string;
  username: string;
  password: string;
}) => {
  const response = await api.post("/auth/local/register", data);
  return response.data;
};

export const login = async (data: { identifier: string; password: string }) => {
  const response = await api.post("/auth/local", data);
  return response.data;
};

export const getArticles = async (params: {
  page?: number;
  pageSize?: number;
  title?: string;
  category?: string;
}) => {
  const response = await api.get("/articles", {
    params: {
      "pagination[page]": params.page,
      "pagination[pageSize]": params.pageSize,
      "filters[title][$eqi]": params.title,
      "filters[category][name][$eqi]": params.category,
      populate: "*",
    },
  });
  return response.data;
};

export const getArticleById = async (documentId: string) => {
  const response = await api.get(`/articles/${documentId}`, {
    params: {
      populate: "*",
    },
  });
  return response.data;
};

export const createArticle = async (data: {
  title: string;
  description: string;
  cover_image_url: string;
  category: number;
}) => {
  const response = await api.post("/articles", { data });
  return response.data;
};

export const updateArticle = async (
  documentId: string,
  data: {
    title: string;
    description: string;
    cover_image_url: string;
    category: number;
  }
) => {
  const response = await api.put(`/articles/${documentId}`, { data });
  return response.data;
};

export const deleteArticle = async (documentId: string) => {
  const response = await api.delete(`/articles/${documentId}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("files", file);
  const response = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export default api;
