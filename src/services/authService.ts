import { User, LoginResponse, MfaSetupResponse, MfaStatusResponse } from '../types/auth';
import { config } from '../config';

// Track if a token refresh is in progress to avoid multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Centralized SSO Auth Service
 * 
 * This service relies on HttpOnly cookies set by auth.eternivity.com.
 * No JWTs are stored or read manually in the browser.
 * All authentication state is managed via cookies sent automatically with requests.
 */
export const authService = {
  /**
   * Login with username/email and password
   * Posts credentials to centralized SSO
   */
  async login(identifier: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${config.api.auth.baseUrl}/api/auth/login`, {
      method: 'POST',
      credentials: 'include', // REQUIRED for cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    // Backend may return { status: 'MFA_REQUIRED', tempToken: '...' }
    return data as LoginResponse;
  },

  /**
   * Register new user
   * Posts registration data to centralized SSO
   */
  async register(username: string, email: string, password: string): Promise<void> {
    const response = await fetch(`${config.api.auth.baseUrl}/api/auth/register`, {
      method: 'POST',
      credentials: 'include', // REQUIRED for cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(error.message || 'Registration failed');
    }

    // SSO sets HttpOnly cookies - no need to handle tokens manually
  },

  /**
   * Login with Google OAuth
   * Sends Google credential token to backend for verification
   */
  async googleLogin(credential: string): Promise<LoginResponse> {
    const response = await fetch(config.api.auth.google, {
      method: 'POST',
      credentials: 'include', // REQUIRED for cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Google authentication failed' }));
      // Provide user-friendly error messages
      if (error.message?.includes('not configured')) {
        throw new Error('Google Sign-In is not available at this time');
      }
      if (error.message?.includes('Email not provided')) {
        throw new Error('Please allow email access to sign in with Google');
      }
      if (error.message?.includes('not verified')) {
        throw new Error('Please verify your Google email before signing in');
      }
      throw new Error(error.message || 'Google authentication failed');
    }

    const data = await response.json();
    return data as LoginResponse;
  },

  /**
   * Redirect to SSO password reset page
   */
  redirectToPasswordReset(): void {
    const redirectUri = window.location.href;
    window.location.href = `${config.api.auth.baseUrl}/reset-password?redirect_uri=${encodeURIComponent(redirectUri)}`;
  },

  /**
   * Request password reset email
   * Sends a reset token to the user's email
   */
  async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${config.api.auth.baseUrl}/api/auth/forgot-password`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to send reset email' }));
      throw new Error(error.message || 'Failed to send reset email');
    }
  },

  /**
   * Reset password using token from email
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${config.api.auth.baseUrl}/api/auth/reset-password`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reset password' }));
      throw new Error(error.message || 'Failed to reset password');
    }
  },

  /**
   * Get current user info from SSO
   * Relies on HttpOnly cookies for authentication
   */
  async getCurrentUser(): Promise<User> {
    const response = await fetch(config.api.auth.me, {
      method: 'GET',
      credentials: 'include', // Important: include cookies for cross-origin requests
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to get user info');
    }

    return response.json();
  },

  /**
   * Set password for users who signed up via OAuth (no password set)
   */
  async setPassword(password: string, confirmPassword: string): Promise<void> {
    const response = await fetch(config.api.auth.setPassword, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, confirmPassword }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to set password' }));
      throw new Error(error.message || 'Failed to set password');
    }
  },

  /**
   * Attempt to refresh the authentication token
   * Returns true if refresh was successful, false otherwise
   */
  async refreshToken(): Promise<boolean> {
    // If already refreshing, return the existing promise
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const response = await fetch(config.api.auth.refresh, {
          method: 'POST',
          credentials: 'include', // Include cookies for refresh token
          headers: {
            'Content-Type': 'application/json',
          },
        });

        return response.ok;
      } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },

  /**
   * Logout user via SSO
   * Calls the centralized logout endpoint which clears cookies
   */
  async logout(): Promise<void> {
    try {
      await fetch(config.api.auth.logout, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    }
    // SSO server handles clearing HttpOnly cookies
    // The calling code (AuthContext) can handle any UI redirects
  },

  /**
   * Get MFA status for the current user
   */
  async getMfaStatus(): Promise<MfaStatusResponse> {
    const response = await fetch(config.api.auth.mfaStatus, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to get MFA status' }));
      throw new Error(error.message || 'Failed to get MFA status');
    }

    return response.json();
  },

  /**
   * MFA Setup - Request QR code for Google Authenticator
   */
  async setupMfa(): Promise<MfaSetupResponse> {
    const response = await fetch(config.api.auth.mfaSetup, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to setup MFA' }));
      throw new Error(error.message || 'Failed to setup MFA');
    }

    return response.json();
  },

  /**
   * Enable MFA - Verify OTP and activate MFA
   * Requires the secret from setup and the 6-digit code
   */
  async enableMfa(secret: string, code: string): Promise<void> {
    const response = await fetch(config.api.auth.mfaEnable, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ secret, code }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Invalid OTP code' }));
      throw new Error(error.message || 'Invalid OTP code');
    }
  },

  /**
   * Verify OTP during login (MFA challenge)
   * Uses the tempToken from login response
   */
  async verifyMfaLogin(tempToken: string, code: string): Promise<void> {
    const response = await fetch(config.api.auth.mfaVerify, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tempToken, code }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Invalid OTP code' }));
      throw new Error(error.message || 'Invalid OTP code');
    }
  },

  /**
   * Disable MFA for the current user
   * Requires a valid 6-digit code for confirmation
   */
  async disableMfa(code: string): Promise<void> {
    const response = await fetch(config.api.auth.mfaDisable, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to disable MFA' }));
      throw new Error(error.message || 'Failed to disable MFA');
    }
  },

  /**
   * Check authentication status by attempting to get current user
   * Returns user if authenticated, null otherwise
   */
  async checkAuth(): Promise<User | null> {
    try {
      return await this.getCurrentUser();
    } catch (error) {
      return null;
    }
  },

  /**
   * Create a fetch wrapper with automatic 401 handling
   * Attempts to refresh token once on 401, then retries the request
   */
  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const fetchOptions: RequestInit = {
      ...options,
      credentials: 'include', // Always include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    let response = await fetch(url, fetchOptions);

    // If 401, attempt to refresh token and retry once
    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      
      if (refreshed) {
        // Retry the original request
        response = await fetch(url, fetchOptions);
      } else {
        // Refresh failed - throw error and let caller handle it
        throw new Error('Session expired. Please log in again.');
      }
    }

    return response;
  },
};
