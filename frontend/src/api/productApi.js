import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    }
    if (error.request) {
      console.error('Network Error:', error.message);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    }
    return Promise.reject({ message: error.message || 'An error occurred' });
  }
);

export const productApi = {
  getBestSellers: () => api.get('/products/bestsellers'),
  getFeatured: () => api.get('/products/featured'),
  getProducts: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    
    const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(url);
  },
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default api;