import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';
import styles from './Login.module.css';

export default function Login() {
  const { isAuthenticated, login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(identifier, password);

      if (result && result.status === 'MFA_REQUIRED') {
        // Redirect to OTP verification page
        navigate('/verify-otp', { state: { mfaToken: result.tempToken, identifier } });
      }
      // If SUCCESS, AuthContext handles navigation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Google Sign-In failed: No credential received');
      return;
    }

    setError('');
    setIsGoogleLoading(true);

    try {
      const result = await googleLogin(credentialResponse.credential);

      if (result && result.status === 'MFA_REQUIRED') {
        navigate('/verify-otp', { state: { mfaToken: result.tempToken, identifier: 'Google account' } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google Sign-In failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In was cancelled or failed. Please try again.');
  };

  const validateEmail = (emailToValidate: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailToValidate);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(forgotPasswordEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const { authService } = await import('../../services/authService');
      await authService.forgotPassword(forgotPasswordEmail);
      setForgotPasswordSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setForgotPasswordSuccess(false);
    setError('');
  };

  // Forgot password view
  if (showForgotPassword) {
    return (
      <section className={styles['auth-page']}>
        <div className={styles['auth-card']}>
          <div className={styles['auth-header']}>
            <h2>Reset Password</h2>
            <p>
              {forgotPasswordSuccess
                ? 'Check your email for reset instructions'
                : 'Enter your email to receive a reset link'}
            </p>
          </div>

          {forgotPasswordSuccess ? (
            <div className={styles['success-message']}>
              <p>We've sent a password reset link to <strong>{forgotPasswordEmail}</strong></p>
              <p>Please check your inbox and follow the instructions to reset your password.</p>
              <button
                type="button"
                className={styles['submit-btn']}
                onClick={handleBackToLogin}
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleForgotPassword}>
              {error && <div className={styles['error-message']}>{error}</div>}

              <div className={styles['form-group']}>
                <label htmlFor="forgotEmail">Email Address</label>
                <input
                  type="email"
                  id="forgotEmail"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  autoComplete="email"
                />
              </div>

              <button type="submit" className={styles['submit-btn']} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {!forgotPasswordSuccess && (
            <div className={styles['switch-mode']}>
              <span>Remember your password?</span>
              <button
                type="button"
                onClick={handleBackToLogin}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', marginLeft: 4 }}
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={styles['auth-page']}>
      <div className={styles['auth-card']}>
        <div className={styles['auth-header']}>
          <h2>Welcome Back</h2>
          <p>Sign in to access your services</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles['error-message']}>{error}</div>}

          <div className={styles['form-group']}>
            <label htmlFor="identifier">Username or Email</label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter username or email"
              required
              autoComplete="username email"
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles['forgot-password-link']}
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className={styles['submit-btn']} disabled={isLoading || isGoogleLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Google Sign-In */}
        {config.google.clientId && (
          <>
            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <div className={styles['google-signin']}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="100%"
              />
              {isGoogleLoading && (
                <p className={styles['google-loading']}>Signing in with Google...</p>
              )}
            </div>
          </>
        )}

        <div className={styles['switch-mode']}>
          <span>Don't have an account?</span>
          <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </section>
  );
}
