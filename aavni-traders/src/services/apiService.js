import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "https://corpgiftgpt.demovoting.com/api",
});

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//     }
//     return Promise.reject(error);
//   }
// );

// API methods
export const fetchProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  // console.log("here", response);
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get("/categories");
  // console.log("here", response);

  return response.data;
};

export const fetchComboPacks = async () => {
  const response = await api.get("/combo-packs");
  // console.log("here", response);

  return response.data;
};

export default api;
