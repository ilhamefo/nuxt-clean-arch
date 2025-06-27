// ApiClient abstracts Axios for API calls
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.API_BASE ?? 'http://127.0.0.1:5051',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Enable cookies for CORS requests
})
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific response errors
      const { status, data } = error.response;
      if (status === 401) {

        // do refresh token logic here


      }
    }
    return Promise.reject(error);
  }
);

export default api;
