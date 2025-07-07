import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.API_BASE ?? 'http://127.0.0.1:5051',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
}

api.interceptors.request.use(config => {
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      return handle401Error(originalRequest, error);
    }
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

async function handle401Error(originalRequest: any, error: any) {
  if (isRefreshing) {
    return new Promise(function (resolve, reject) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      failedQueue.push({ resolve, reject });
    })
      .then(() => api(originalRequest))
      .catch(err => Promise.reject(err instanceof Error ? err : new Error(String(err))));
  }
  originalRequest._retry = true;
  isRefreshing = true;
  try {
    const { status } = await api.get('/auth/refresh-token');
    if (status !== 200) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(new Error('Failed to refresh token'));
    }
    processQueue(null);
    return api(originalRequest);
  } catch (err: any) {
    processQueue(err);
    return Promise.reject(err instanceof Error ? err : new Error(String(err)));
  } finally {
    isRefreshing = false;
  }
}

export default api;
