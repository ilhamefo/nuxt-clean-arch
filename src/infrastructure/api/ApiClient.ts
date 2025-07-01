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
    if (error.response) {

      const { status } = error.response;

      if (status === 401) {


        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            failedQueue.push({ resolve, reject });
          })
            .then((response) => {

              return api(originalRequest);
            })
            .catch(err => {
              Promise.reject(err instanceof Error ? err : new Error(String(err)))
            });
        }
        originalRequest._retry = true;

        isRefreshing = true;

        try {
          const { data, status } = await api.get('/auth/refresh-token');
          processQueue(null);
          return api(originalRequest);
        } catch (err: any) {
          processQueue(err);

          return Promise.reject(err instanceof Error ? err : new Error(String(err)));
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

export default api;
