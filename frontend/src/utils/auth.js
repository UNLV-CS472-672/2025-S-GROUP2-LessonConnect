// Authentication utility functions

/**
 * Check if the user is logged in by verifying the existence of an auth token
 * @returns {boolean} True if user has a valid auth token
 */
export const isLoggedIn = () => {
  const token = localStorage.getItem('accessToken');
  return !!token; // Convert to boolean
};

/**
 * Get the current user's authentication token
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Set the authentication token in localStorage
 * @param {string} token - The JWT token to store
 */
export const setAuthToken = (token) => {
  localStorage.setItem('accessToken', token);
};

/**
 * Clear the authentication token from localStorage (logout)
 */
export const clearAuthToken = () => {
  localStorage.removeItem('accessToken');
};

/**
 * Login user with provided credentials
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} Login result with token and success status
 */
export const loginUser = async (username, password) => {
  try {
    const response = await fetch('/users/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Store the tokens
    setAuthToken(data.accessToken);
    
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    return { success: true, token: data.accessToken };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Logout the current user
 */
export const logoutUser = () => {
  clearAuthToken();
  localStorage.removeItem('refreshToken');
  // Additional cleanup if needed
};

/**
 * Refresh the authentication token using the refresh token
 * @returns {Promise<boolean>} Success status of the token refresh
 */
export const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    return false;
  }
  
  try {
    const response = await fetch('/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    setAuthToken(data.access);
    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
}; 