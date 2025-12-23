const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    auth: {
      register: `${API_BASE_URL}${import.meta.env.VITE_AUTH_REGISTER_URL || '/auth/register'}`,
      login: `${API_BASE_URL}${import.meta.env.VITE_AUTH_LOGIN_URL || '/auth/login'}`,
      me: `${API_BASE_URL}${import.meta.env.VITE_AUTH_ME_URL || '/auth/me'}`,
      passwordReset: `${API_BASE_URL}${import.meta.env.VITE_AUTH_PASSWORD_RESET_URL || '/auth/password-reset'}`,
    },
  },
  services: {
    expenseTracker: import.meta.env.VITE_EXPENSE_TRACKER_URL || 'https://expensetracker.eternivity.com',
  },
};
