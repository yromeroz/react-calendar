// security/utils.ts
import { PostMessageData } from "@/contexts/auth-types";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from 'react';


export const validateOrigin = (origin: string): boolean => {
  const allowedOrigins = [
    'https://tu-dominio-jsp.com',
    'https://www.tu-dominio-jsp.com',
    'http://localhost:3000' // desarrollo
  ];
  
  return allowedOrigins.includes(origin);
};

export const safePostMessage = (
  message: PostMessageData, 
  targetOrigin: string
): void => {
  if (window.parent !== window) {
    window.parent.postMessage(message, targetOrigin);
  }
};

// Hook para verificar token
interface TokenValidation {
  isValid: boolean;
  isLoading: boolean;
}

export const useTokenValidation = (): TokenValidation => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { token } = useAuth();

  useEffect(() => {
    const verifyToken = async (): Promise<void> => {
      if (!token) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      try {
        // Aquí iría tu llamada API para verificar el token
        // const response = await api.get('/verify-token');
        // setIsValid(response.status === 200);
        setIsValid(true); // Simulación
      } catch (error) {
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return { isValid, isLoading };
};