import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, cargando } = useAuth();

  if (cargando) return null;

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}
