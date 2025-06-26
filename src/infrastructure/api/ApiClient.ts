// ApiClient abstracts Axios for API calls
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.API_BASE ?? 'http://127.0.0.1:5051',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Enable cookies for CORS requests
})


export default api;
