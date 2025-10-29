// components/ProtectedRoute.tsx
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ProtectedRouteProps } from '../contexts/auth-types';

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // Solicitar token a la aplicación padre
      if (window.parent !== window) {
        window.parent.postMessage(
          { type: 'REQUEST_AUTH_TOKEN' } as const,
          'https://tu-dominio-jsp.com'
        );
        
        // Timeout para redireccionar si no responde
        const timeout = setTimeout(() => {
          router.push('/unauthorized');
        }, 5000);
        
        return () => clearTimeout(timeout);
      } else {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  return <>{children}</>;
}