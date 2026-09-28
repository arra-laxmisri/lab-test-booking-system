import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; phone: string; password: string; confirmPassword?: string; address?: string }) => Promise<void>;
  logout: () => void;
  updateUser: (user: IUser) => void;
  refreshUser: () => Promise<void>;
  setAuthData: (token: string, user: IUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('medilab_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const setAuthData = (newToken: string, newUser: IUser) => {
    localStorage.setItem('medilab_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('medilab_token');
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      setUser(res.user);
    } catch (err) {
      console.warn('Session expired or invalid token:', err);
      localStorage.removeItem('medilab_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.auth.login(credentials);
    localStorage.setItem('medilab_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (userData: { name: string; email: string; phone: string; password: string; confirmPassword?: string; address?: string }) => {
    const res = await api.auth.register(userData);
    localStorage.setItem('medilab_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('medilab_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated: IUser) => {
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        setAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
