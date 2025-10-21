// PublicPortal/src/requestMethods.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1/";

// Helper function to get persisted token
function getPersistedToken() {
  try {
    const persisted = localStorage.getItem('persist:root');
    if (!persisted) return null;
    
    const root = JSON.parse(persisted);
    const userState = root.user ? JSON.parse(root.user) : null;
    const token = userState?.currentUser?.accessToken || null;
    
    return token;
  } catch (e) {
    console.error('Error getting persisted token:', e);
    return null;
  }
}

// Public request instance (no auth required)
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

// Authenticated request instance
export const userRequest = axios.create({
  baseURL: BASE_URL,
});

// ✅ Request interceptor to add token
userRequest.interceptors.request.use(
  (config) => {
    const token = getPersistedToken();
    if (token) {
      config.headers.token = `Bearer ${token}`;
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔑 Request with token:', !!token, config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response interceptor for error handling
userRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.error('Authentication error - redirecting to login');
      localStorage.removeItem('persist:root');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default { publicRequest, userRequest };