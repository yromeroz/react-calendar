// lib/axios.ts
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

//interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
//  _retry?: boolean;
//}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor para agregar el token a las requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('authToken') || 
                 sessionStorage.getItem('authToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas no autorizadas
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      
      // Opcional: enviar mensaje a la app padre
      if (window.parent !== window) {
        window.parent.postMessage(
          { type: 'SESSION_EXPIRED' } as const,
          'https://tu-dominio-jsp.com'
        );
      }
    }
    return Promise.reject(error);
  }
);

export default api;