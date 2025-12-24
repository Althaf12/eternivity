import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';
import { config } from '../config';

const TOKEN_KEY = 'eternivity_auth_token';

export const authService = {
  // Store token in localStorage
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Register new user
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(config.api.auth.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(error.message || 'Registration failed');
    }

    const result: AuthResponse = await response.json();
    this.setToken(result.token);
    return result;
  },

  // Login user
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(config.api.auth.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Login failed');
    }

    const result: AuthResponse = await response.json();
    this.setToken(result.token);
    return result;
  },

  // Get current user info
  async getCurrentUser(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(config.api.auth.me, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.removeToken();
        throw new Error('Session expired');
      }
      throw new Error('Failed to get user info');
    }

    return response.json();
  },

  // Reset password
  async resetPassword(oldPassword: string, newPassword: string): Promise<void> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(config.api.auth.passwordReset, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Password reset failed' }));
      throw new Error(error.message || 'Password reset failed');
    }
  },

  // Logout user
  logout(): void {
    this.removeToken();
    this.clearAuthCookie();
  },

  // Set cookie for subdomain access
  setAuthCookie(user: User, token: string): void {
    const cookieData = JSON.stringify({
      token,
      userId: user.userId,
      username: user.username,
      email: user.email,
      services: user.services,
    });

    // Set cookie with domain for subdomain access
    // Using .eternivity.com allows access from subdomains
    const isProduction = window.location.hostname.includes('eternivity.com');
    const domain = isProduction ? '.eternivity.com' : '';
    // For production (real domains) mark Secure and use SameSite=None to allow cross-site contexts where necessary.
    // For local development keep SameSite=Lax and omit Secure so cookies work over HTTP.
    const cookieSameSite = isProduction ? 'SameSite=None;' : 'SameSite=Lax;';
    const cookieSecure = isProduction ? 'Secure;' : '';

    // Encode cookie data as base64 to handle special characters
    const encodedData = btoa(cookieData);

    document.cookie = `eternivity_auth=${encodedData}; path=/; ${domain ? `domain=${domain};` : ''} ${cookieSecure} ${cookieSameSite} max-age=86400`;
  },

  // Clear auth cookie
  clearAuthCookie(): void {
    const isProduction = window.location.hostname.includes('eternivity.com');
    const domain = isProduction ? '.eternivity.com' : '';
    
    document.cookie = `eternivity_auth=; path=/; ${domain ? `domain=${domain};` : ''} expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};
