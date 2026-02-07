import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Clients from './pages/admin/Clients';
import Devices from './pages/admin/Devices';
import ClientDevices from './pages/client/ClientDevices';
import Admins from './pages/admin/Admins';
import AqiDashboard from './pages/admin/AqiDashboard';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes */}
      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <Clients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/devices"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <Devices />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admins"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <Admins />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/admin/devices/:deviceId/aqi"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AqiDashboard />
          </ProtectedRoute>
        }
      />

      
      {/* Client Routes */}
      <Route
        path="/client/devices"
        element={
          <ProtectedRoute requiredRole="CLIENT">
            <ClientDevices />
          </ProtectedRoute>
        }
      />
      
      {/* Default redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.role === 'ADMIN' ? (
              <Navigate to="/admin/clients" replace />
            ) : (
              <Navigate to="/client/devices" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      {/* Catch all */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? (user?.role === 'ADMIN' ? '/admin/clients' : '/client/devices') : '/login'}
            replace
          />
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;