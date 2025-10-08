import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1/";
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

// Read token from redux-persist store safely and attach to requests
function getPersistedToken() {
  try {
    const persisted = localStorage.getItem('persist:root');
    if (!persisted) return null;
    const root = JSON.parse(persisted);
    const userState = root.user ? JSON.parse(root.user) : null;
    const token = userState?.currentUser?.accessToken || null;
    return token;
  } catch (e) {
    return null;
  }
}

export const userRequest = axios.create({
  baseURL: BASE_URL,
});

userRequest.interceptors.request.use((config) => {
  const token = getPersistedToken();
  if (token) {
    // Backend verifyToken expects header 'token' with value 'Bearer <token>'
    config.headers.token = `Bearer ${token}`;
  }
  return config;
});

