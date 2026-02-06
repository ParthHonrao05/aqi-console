/**
 * JWT Token utilities for checking expiry
 */

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired or invalid
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Get token expiry time in milliseconds
 * @param {string} token - JWT token
 * @returns {number|null} - Expiry time in milliseconds or null if invalid
 */
export const getTokenExpiry = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  return decoded.exp * 1000; // Convert to milliseconds
};

/**
 * Get time until token expiry in seconds
 * @param {string} token - JWT token
 * @returns {number|null} - Seconds until expiry or null if invalid/expired
 */
export const getTimeUntilExpiry = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = decoded.exp - currentTime;
  
  return timeUntilExpiry > 0 ? timeUntilExpiry : null;
};