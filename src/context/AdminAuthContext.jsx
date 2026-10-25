import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('prs_admin_token');
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getCurrentAdmin();
      if (res.success && res.admin) {
        setAdmin(res.admin);
      } else {
        setAdmin(null);
        localStorage.removeItem('prs_admin_token');
      }
    } catch {
      setAdmin(null);
      localStorage.removeItem('prs_admin_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('prs_admin_token', res.token);
      setAdmin(res.admin);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.warn('Logout API error:', e);
    } finally {
      localStorage.removeItem('prs_admin_token');
      setAdmin(null);
    }
  };

  const updateProfile = async (data) => {
    const res = await api.updateAdminProfile(data);
    if (res.success && res.admin) {
      setAdmin(res.admin);
    }
    return res;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
        updateProfile,
        refreshAuth: checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
