import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/users',  
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const instance = axios.create({
  baseURL: 'http://localhost:5000',  // Địa chỉ backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lấy token từ localStorage và cấu hình Authorization cho tất cả các yêu cầu
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default api;
