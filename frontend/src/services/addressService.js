import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const addressService = {

  getAddresses: async () => {
    const res = await api.get("/users/addresses");
    return res.data.data || [];
  },

  addAddress: async (data) => {
    const res = await api.post("/users/addresses", data);
    return res.data.data;
  },

  updateAddress: async (id, data) => {
    const res = await api.put(`/users/addresses/${id}`, data);
    return res.data.data;
  },

  deleteAddress: async (id) => {
    const res = await api.delete(`/users/addresses/${id}`);
    return res.data;
  }

};

export default addressService;