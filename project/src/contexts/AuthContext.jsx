import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  // On initial load, check localStorage for a saved user session and token
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('SkillSnap_user');
      const savedToken = localStorage.getItem('SkillSnap_token');

      if (savedUser && savedToken) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setToken(savedToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      // If parsing fails, ensure the user is logged out
      localStorage.removeItem('SkillSnap_user');
      localStorage.removeItem('SkillSnap_token');
    } finally {
      setLoading(false); // Stop loading once checked
    }
  }, []);

  const login = (backendData) => {
    // Destructure the token from the rest of the user data
    const { token, ...userData } = backendData;

    // Store token and user data separately in localStorage
    localStorage.setItem('SkillSnap_token', token);
    localStorage.setItem('SkillSnap_user', JSON.stringify(userData));
    
    setToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remove user data and token from localStorage
    localStorage.removeItem('SkillSnap_user');
    localStorage.removeItem('SkillSnap_token');
    
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token, // Expose the token
    isAuthenticated,
    loading, // Expose loading state
    login,
    logout,
  };

  // Render children only when not in the initial loading state
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
