import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? <Component /> : <Navigate to="/angryChess/login" state={{ from: location }} />;
};

export default ProtectedRoute;
