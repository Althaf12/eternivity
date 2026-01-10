const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const DEFAULT_AUTH_BASE = (typeof window !== 'undefined' && window.location && window.location.hostname.includes('localhost'))
  ? 'http://localhost:8080'
  : 'https://auth.eternivity.com';
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || DEFAULT_AUTH_BASE;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    auth: {
      // SSO endpoints on auth.eternivity.com
      baseUrl: AUTH_BASE_URL,
      me: `${AUTH_BASE_URL}/api/auth/me`,
      refresh: `${AUTH_BASE_URL}/api/auth/refresh`,
      logout: `${AUTH_BASE_URL}/api/auth/logout`,
      google: `${AUTH_BASE_URL}/api/auth/google`,
      setPassword: `${AUTH_BASE_URL}/api/auth/set-password`,
      // Login page URL (for redirect)
      loginPage: `${AUTH_BASE_URL}/login`,
      // Legacy endpoints (kept for reference, will not be used)
      register: `${API_BASE_URL}${import.meta.env.VITE_AUTH_REGISTER_URL || '/auth/register'}`,
      login: `${API_BASE_URL}${import.meta.env.VITE_AUTH_LOGIN_URL || '/auth/login'}`,
      passwordReset: `${API_BASE_URL}${import.meta.env.VITE_AUTH_PASSWORD_RESET_URL || '/auth/password-reset'}`,
    },
  },
  google: {
    clientId: GOOGLE_CLIENT_ID,
  },
  services: {
    expenseTracker: import.meta.env.VITE_EXPENSE_TRACKER_URL || 'https://expensetracker.eternivity.com',
  },
};
