import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isTokenExpired } from '../utils/jwt';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Check if token is expired even if context says authenticated
  const token = localStorage.getItem('token');
  const tokenExpired = token ? isTokenExpired(token) : true;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Token expired or not authenticated
  if (!isAuthenticated || tokenExpired || !user) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ from: location.pathname, expired: tokenExpired }}
      />
    );
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    // Log unauthorized access attempt
    console.warn(`Unauthorized access attempt: User role ${user.role} attempted to access ${requiredRole} route`);
    
    // Redirect to appropriate dashboard based on role
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/clients" replace />;
    } else if (user.role === 'CLIENT') {
      return <Navigate to="/client/devices" replace />;
    } else {
      // Unknown role, logout and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;