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
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
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
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      
      // Show welcome message if user just logged in (detected via redirect)
      // Check if we came from a redirect (URL contains auth-related params or referrer is auth domain)
      const urlParams = new URLSearchParams(window.location.search);
      const isFromAuth = urlParams.has('auth_success') || 
                         document.referrer.includes('auth.eternivity.com');
      
      if (isFromAuth && !hasShownWelcome) {
        setHasShownWelcome(true);
        setShowConfetti(true);
        addToast({
          type: 'success',
          title: `Welcome back, ${userData.username}!`,
          message: 'You have successfully logged in',
        });
        setTimeout(() => setShowConfetti(false), 3000);
        
        // Clean up URL params
        if (urlParams.has('auth_success')) {
          urlParams.delete('auth_success');
          const newUrl = urlParams.toString() 
            ? `${window.location.pathname}?${urlParams.toString()}`
            : window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      }
    } catch (error) {
      // User is not authenticated - this is expected on first load
      // Don't redirect automatically, let the UI handle it
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [addToast, hasShownWelcome]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /**
   * Login with username and password
   */
  const login = async (username: string, password: string) => {
    await authService.login(username, password);
    const userData = await authService.getCurrentUser();
    setUser(userData);
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

  /**
   * Register new user
   */
  const register = async (username: string, email: string, password: string) => {
    await authService.register(username, email, password);
    const userData = await authService.getCurrentUser();
    setUser(userData);
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

  /**
   * Login with Google OAuth
   */
  const googleLogin = async (credential: string) => {
    // googleLogin returns user data directly (includes profileImageUrl from Google)
    const userData = await authService.googleLogin(credential);
    setUser(userData);
    setShowAuthModal(false);
    
    // Show success animation
    setShowConfetti(true);
    addToast({
      type: 'success',
      title: `Welcome, ${userData.username}!`,
      message: 'Signed in with Google successfully',
    });
    setTimeout(() => setShowConfetti(false), 3000);
  };

  /**
   * Logout via SSO - clears cookies
   */
  const logout = async () => {
    const username = user?.username;
    
    await authService.logout();
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
        googleLogin,
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
