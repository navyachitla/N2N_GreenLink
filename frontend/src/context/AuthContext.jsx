import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('greenlink_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('greenlink_token');
    if (token) {
      authService.getCurrentUser()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('greenlink_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (usernameOrEmail, password) => {
    const res = await authService.login({ usernameOrEmail, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('greenlink_token', token);
    localStorage.setItem('greenlink_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('greenlink_token');
    localStorage.removeItem('greenlink_user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getCurrentUser();
      setUser(res.data);
      localStorage.setItem('greenlink_user', JSON.stringify(res.data));
    } catch (e) {
      console.error("Failed to refresh user details", e);
    }
  };

  const isAdmin = user && user.roles && user.roles.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, refreshUser, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
