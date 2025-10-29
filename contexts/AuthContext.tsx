// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthProviderProps, PostMessageData, AuthTokenMessage } from './auth-types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verificar el origen del mensaje por seguridad
      const allowedOrigins = [
        'https://tu-dominio-jsp.com',
        'http://localhost:3000' // para desarrollo
      ];
      
      if (!allowedOrigins.includes(event.origin)) return;
      
      const data = event.data as PostMessageData;
      
      if (data.type === 'AUTH_TOKEN') {
        const authData = data as AuthTokenMessage;
        const receivedToken = authData.token;
        setToken(receivedToken);
        setIsAuthenticated(true);
        
        // Opcional: Guardar en sessionStorage
        sessionStorage.setItem('authToken', receivedToken);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Verificar si ya existe un token en sessionStorage
    const storedToken = sessionStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const logout = (): void => {
    setToken(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('authToken');
  };

  const value: AuthContextType = {
    token,
    isAuthenticated,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};