import axios from 'axios';
  const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    // Enable cookies for session-based auth
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },

  });
export default api;