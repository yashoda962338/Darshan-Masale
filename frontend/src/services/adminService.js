// frontend/src/services/adminService.js - COMPLETE
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const adminService = {
  // ============================================
  // DASHBOARD
  // ============================================
  getDashboard: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard' };
    }
  },

  // ============================================
  // PRODUCTS
  // ============================================
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/admin/products', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },
  getProduct: async (id) => {
    try {
      const response = await api.get(`/admin/products/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product' };
    }
  },
  createProduct: async (data) => {
    try {
      const response = await api.post('/admin/products', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create product' };
    }
  },
  updateProduct: async (id, data) => {
    try {
      const response = await api.put(`/admin/products/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product' };
    }
  },
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/admin/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete product' };
    }
  },

  // ============================================
  // CATEGORIES
  // ============================================
  getCategories: async (params = {}) => {
    try {
      const response = await api.get('/admin/categories', { params });
      return response.data.data?.categories || [];
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  },
  createCategory: async (data) => {
    try {
      const response = await api.post('/admin/categories', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create category' };
    }
  },
  updateCategory: async (id, data) => {
    try {
      const response = await api.put(`/admin/categories/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update category' };
    }
  },
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/admin/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete category' };
    }
  },

  // ============================================
  // ORDERS
  // ============================================
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/admin/orders', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },
  getOrder: async (id) => {
    try {
      const response = await api.get(`/admin/orders/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch order' };
    }
  },
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.put(`/admin/orders/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  },

  // ============================================
  // CUSTOMERS
  // ============================================
  getCustomers: async (params = {}) => {
    try {
      const response = await api.get('/admin/customers', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch customers' };
    }
  },
  getCustomer: async (id) => {
    try {
      const response = await api.get(`/admin/customers/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch customer' };
    }
  },
  blockCustomer: async (id) => {
    try {
      const response = await api.put(`/admin/customers/${id}/block`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to block customer' };
    }
  },
  unblockCustomer: async (id) => {
    try {
      const response = await api.put(`/admin/customers/${id}/unblock`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to unblock customer' };
    }
  },
  deleteCustomer: async (id) => {
    try {
      const response = await api.delete(`/admin/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete customer' };
    }
  },

  // ============================================
  // COUPONS
  // ============================================
  getCoupons: async () => {
    try {
      const response = await api.get('/admin/coupons');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch coupons' };
    }
  },
  createCoupon: async (data) => {
    try {
      const response = await api.post('/admin/coupons', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create coupon' };
    }
  },
  updateCoupon: async (id, data) => {
    try {
      const response = await api.put(`/admin/coupons/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update coupon' };
    }
  },
  deleteCoupon: async (id) => {
    try {
      const response = await api.delete(`/admin/coupons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete coupon' };
    }
  },

  // ============================================
  // GALLERY (ADMIN - Requires Auth)
  // ============================================
  getGallery: async () => {
    try {
      const response = await api.get('/admin/gallery');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch gallery' };
    }
  },
  createGalleryImage: async (data) => {
    try {
      const response = await api.post('/admin/gallery', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add gallery image' };
    }
  },
  deleteGalleryImage: async (id) => {
    try {
      const response = await api.delete(`/admin/gallery/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete gallery image' };
    }
  },

  // ============================================
  // REVIEWS
  // ============================================
  getReviews: async (params = {}) => {
    try {
      const response = await api.get('/admin/reviews', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch reviews' };
    }
  },
  updateReviewStatus: async (id, isApproved) => {
    try {
      const response = await api.put(`/admin/reviews/${id}`, { isApproved });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update review' };
    }
  },
  deleteReview: async (id) => {
    try {
      const response = await api.delete(`/admin/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete review' };
    }
  },

  // ============================================
  // HERO BANNERS
  // ============================================
  getBanners: async () => {
    try {
      const response = await api.get('/admin/banners');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch banners' };
    }
  },
  createBanner: async (data) => {
    try {
      const response = await api.post('/admin/banners', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create banner' };
    }
  },
  updateBanner: async (id, data) => {
    try {
      const response = await api.put(`/admin/banners/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update banner' };
    }
  },
  deleteBanner: async (id) => {
    try {
      const response = await api.delete(`/admin/banners/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete banner' };
    }
  },

  // ============================================
  // REPORTS & ANALYTICS
  // ============================================
  getSalesReport: async (params = {}) => {
    try {
      const response = await api.get('/admin/reports/sales', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch sales report' };
    }
  },
  getProductReport: async () => {
    try {
      const response = await api.get('/admin/reports/products');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product report' };
    }
  },
  getAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/admin/analytics', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch analytics' };
    }
  },

  // ============================================
  // USERS (Super Admin Only)
  // ============================================
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },
  updateUserRole: async (id, role) => {
    try {
      const response = await api.put(`/admin/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user role' };
    }
  },

  // ============================================
  // IMAGE UPLOAD
  // ============================================
  uploadImage: async (file, folder = 'product') => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/upload/${folder}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      
      const data = await response.json();
      if (!data.success) throw data;
      return data.data;
    } catch (error) {
      throw error || { message: 'Failed to upload image' };
    }
  },
  deleteImage: async (folder, filename) => {
    try {
      const response = await api.delete(`/admin/upload/${folder}/${filename}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete image' };
    }
  },

  // Add to adminService.js - Settings methods
// ============================================
// SETTINGS
// ============================================
getSettings: async () => {
  try {
    const response = await api.get('/admin/settings');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch settings' };
  }
},
updateSettings: async (data) => {
  try {
    const response = await api.put('/admin/settings', data);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update settings' };
  }
},

  // ============================================
  // ALIASES FOR CONSISTENCY
  // ============================================
  getGalleryImages: async () => {
    return adminService.getGallery();
  },
  getHeroBanners: async () => {
    return adminService.getBanners();
  },
  createHeroBanner: async (data) => {
    return adminService.createBanner(data);
  },
  updateHeroBanner: async (id, data) => {
    return adminService.updateBanner(id, data);
  },
  deleteHeroBanner: async (id) => {
    return adminService.deleteBanner(id);
  }
};

export default adminService;