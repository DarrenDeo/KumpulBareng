import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/** Axios instance utama untuk semua API calls */
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  withCredentials: true, // Wajib untuk HttpOnly Cookie auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: handle global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error
    if (!error.response) {
      toast.error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // 401 Unauthorized — redirect to login
    if (status === 401) {
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        toast.error(data?.message || 'Sesi Anda telah berakhir. Silakan login kembali.');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // 429 Rate limited
    if (status === 429) {
      toast.error(data?.message || 'Terlalu banyak permintaan. Coba lagi nanti.');
      return Promise.reject(error);
    }

    // Other errors — let the calling code handle them
    return Promise.reject(error);
  }
);

export default apiClient;
