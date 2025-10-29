// pages/dashboard.tsx
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { NextPage } from 'next';

const Dashboard: NextPage = () => {
  const { token, isAuthenticated } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Usuario autenticado: {isAuthenticated ? 'Sí' : 'No'}</p>
        <p>Token: {token ? `${token.substring(0, 20)}...` : 'No disponible'}</p>
        {/* Tu contenido protegido aquí */}
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;