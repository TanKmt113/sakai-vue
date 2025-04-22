// api/http.js
import axios from "axios";
const api = import.meta.env.VITE_APP_API;


const http = axios.create({
  baseURL: api,
  timeout: 150000,
});

http.interceptors.request.use(
  (config) => {
    // config.headers.Authorization = authHeader()?.Authorization;
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (error.status==401) window.location.href = "/login";

    if(error.status==403) window.location.href='/auth/access';

    return Promise.reject(error);
  }
);

export default http;