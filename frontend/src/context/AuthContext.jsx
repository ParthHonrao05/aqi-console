import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, usersAPI } from '../services/api';
import { isTokenExpired, getTimeUntilExpiry } from '../utils/jwt';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  // Check token validity and refresh user data
  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      setLoading(false);
      return;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      logout();
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Verify token is still valid with backend
      try {
        const response = await usersAPI.getCurrentUser();
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setError(null);
      } catch (err) {
        // Token might be invalid on server side
        logout();
        throw err;
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  // Periodically check token expiry
  useEffect(() => {
    if (!user) return;

    const checkTokenExpiry = () => {
      const token = localStorage.getItem('token');
      if (token && isTokenExpired(token)) {
        logout();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
    };

    // Check immediately
    checkTokenExpiry();

    // Check every 60 seconds
    const interval = setInterval(checkTokenExpiry, 60000);

    // Also check based on token expiry time
    const token = localStorage.getItem('token');
    if (token) {
      const timeUntilExpiry = getTimeUntilExpiry(token);
      if (timeUntilExpiry && timeUntilExpiry > 0) {
        // Set a timeout to check 1 minute before expiry
        const checkBeforeExpiry = Math.max(timeUntilExpiry - 60, 60) * 1000;
        const timeout = setTimeout(() => {
          checkTokenExpiry();
          // After checking, continue with interval
        }, checkBeforeExpiry);

        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }
    }

    return () => clearInterval(interval);
  }, [user, logout]);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);
      const { token, user: userData } = response.data;

      // Validate token before storing
      if (!token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setError(null);

      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please check your credentials.';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isClient: user?.role === 'CLIENT',
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};