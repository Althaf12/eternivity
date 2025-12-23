import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '../types/auth';
import { authService } from '../services/authService';
import { ToastData } from '../components/Toast/Toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  showAuthModal: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode: 'login' | 'register') => void;
  closeAuthModal: () => void;
  toasts: ToastData[];
  removeToast: (id: string) => void;
  showConfetti: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshUser = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      // Set cookie for subdomain access
      const token = authService.getToken();
      if (token) {
        authService.setAuthCookie(userData, token);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      authService.removeToken();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    const userData = await authService.getCurrentUser();
    setUser(userData);
    authService.setAuthCookie(userData, response.token);
    setShowAuthModal(false);
    
    // Show success animation
    setShowConfetti(true);
    addToast({
      type: 'success',
      title: `Welcome back, ${userData.username}!`,
      message: 'You have successfully logged in',
    });
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await authService.register({ username, email, password });
    const userData = await authService.getCurrentUser();
    setUser(userData);
    authService.setAuthCookie(userData, response.token);
    setShowAuthModal(false);
    
    // Show success animation
    setShowConfetti(true);
    addToast({
      type: 'success',
      title: `Welcome to Eternivity, ${userData.username}!`,
      message: 'Your account has been created successfully',
    });
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const logout = () => {
    const username = user?.username;
    authService.logout();
    setUser(null);
    
    // Show logout notification
    addToast({
      type: 'info',
      title: 'Logged out successfully',
      message: username ? `Goodbye, ${username}! See you soon` : 'You have been logged out',
    });
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        showAuthModal,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        toasts,
        removeToast,
        showConfetti,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
