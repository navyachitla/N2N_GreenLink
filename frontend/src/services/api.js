import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for injecting JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('greenlink_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('greenlink_token');
      localStorage.removeItem('greenlink_user');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

export const userService = {
  getUserProfile: (id) => api.get(`/users/${id}`),
  updateUserProfile: (id, data) => api.put(`/users/${id}`, data),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
};

export const productService = {
  getApprovedProducts: (categoryId, search) => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (search) params.append('search', search);
    return api.get(`/products?${params.toString()}`);
  },
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  getMyListings: () => api.get('/products/my-listings'),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  addProductReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData),
  getReviews: (id) => api.get(`/products/${id}/reviews`),
};

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getSellerOrders: () => api.get('/orders/seller-orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
};

export const wasteService = {
  submitWaste: (data) => api.post('/waste', data),
  getMyWasteSubmissions: () => api.get('/waste/my-submissions'),
  getWasteById: (id) => api.get(`/waste/${id}`),
};

export const serviceService = {
  getActiveServices: (category, query) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('query', query);
    return api.get(`/services?${params.toString()}`);
  },
  getServiceById: (id) => api.get(`/services/${id}`),
  createService: (data) => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
};

export const learningService = {
  getAllResources: (category, query) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('query', query);
    return api.get(`/learning?${params.toString()}`);
  },
  getResourceById: (id) => api.get(`/learning/${id}`),
  createResource: (data) => api.post('/admin/learning', data),
  updateResource: (id, data) => api.put(`/admin/learning/${id}`, data),
  deleteResource: (id) => api.delete(`/admin/learning/${id}`),
};

export const carbonService = {
  calculateFootprint: (data) => api.post('/carbon/calculate', data),
  getCarbonHistory: () => api.get('/carbon/history'),
  getLatestFootprint: () => api.get('/carbon/latest'),
};

export const rewardService = {
  getMyRewards: () => api.get('/rewards'),
};

export const communityService = {
  getAllPosts: (category) => api.get(`/community/posts${category ? `?category=${category}` : ''}`),
  getPostById: (id) => api.get(`/community/posts/${id}`),
  createPost: (data) => api.post('/community/posts', data),
  updatePost: (id, data) => api.put(`/community/posts/${id}`, data),
  deletePost: (id) => api.delete(`/community/posts/${id}`),
  addComment: (id, data) => api.post(`/community/posts/${id}/comments`, data),
  likePost: (id) => api.post(`/community/posts/${id}/like`),
};

export const eventService = {
  getAllEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  registerForEvent: (id) => api.post(`/events/${id}/register`),
  cancelRegistration: (id) => api.delete(`/events/${id}/register`),
  getMyEvents: () => api.get('/events/my-events'),
  createEvent: (data) => api.post('/admin/events', data),
  updateEvent: (id, data) => api.put(`/admin/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/status`),
  getAllProducts: () => api.get('/admin/products'),
  getPendingProducts: () => api.get('/admin/products/pending'),
  approveOrRejectProduct: (id, status, rejectionReason) => 
    api.put(`/admin/products/${id}/approval`, { status, rejectionReason }),
  getAllOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status?status=${status}`),
  getAllWaste: () => api.get('/admin/waste'),
  updateWasteStatus: (id, status, adminNotes) => 
    api.put(`/admin/waste/${id}/status`, { status, adminNotes }),
  createService: (data) => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
  createLearning: (data) => api.post('/admin/learning', data),
  updateLearning: (id, data) => api.put(`/admin/learning/${id}`, data),
  deleteLearning: (id) => api.delete(`/admin/learning/${id}`),
  createEvent: (data) => api.post('/admin/events', data),
  updateEvent: (id, data) => api.put(`/admin/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
};

export const uploadService = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
