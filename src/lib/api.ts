import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api",
  headers: {
    "Content-Type": "application/json",
  },
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

export default api;
