import React, { useState, useEffect } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { config } from '../../config';
import styles from './AuthModal.module.css';

export default function AuthModal() {
  const { showAuthModal, authModalMode, closeAuthModal, login, register, googleLogin, openAuthModal } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (showAuthModal) {
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
      setForgotPasswordSuccess(false);
    }
  }, [showAuthModal, authModalMode]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    
    if (showAuthModal) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [showAuthModal, closeAuthModal]);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (authModalMode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters long');
          setIsLoading(false);
          return;
        }
        await register(username, email, password);
      } else {
        await login(username, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setError('');
    setShowForgotPassword(false);
    setForgotPasswordSuccess(false);
    openAuthModal(authModalMode === 'login' ? 'register' : 'login');
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

  const getPasswordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  // Google Sign-In handlers
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Google Sign-In failed: No credential received');
      return;
    }

    setError('');
    setIsGoogleLoading(true);

    try {
      await googleLogin(credentialResponse.credential);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google Sign-In failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In was cancelled or failed. Please try again.');
  };

  return (
    <div className={styles['modal-overlay']} onClick={closeAuthModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles['close-btn']} onClick={closeAuthModal} aria-label="Close">
          ×
        </button>
        
        {/* Forgot Password View */}
        {showForgotPassword ? (
          <>
            <div className={styles['modal-header']}>
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
                <button type="button" onClick={handleBackToLogin}>
                  Sign In
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className={styles['modal-header']}>
              <h2>{authModalMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p>
                {authModalMode === 'login'
                  ? 'Sign in to access your services'
                  : 'Join Eternivity™ today'}
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <div className={styles['error-message']}>{error}</div>}

              <div className={styles['form-group']}>
                <label htmlFor="username">
                  {authModalMode === 'login' ? 'Username or Email' : 'Username'}
                </label>
                <input
                  type="text"
                  id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={authModalMode === 'login' ? 'Enter username or email' : 'Enter your username'}
              required
              autoComplete={authModalMode === 'login' ? 'username email' : 'username'}
            />
          </div>

          {authModalMode === 'register' && (
            <div className={styles['form-group']}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>
          )}

          <div className={styles['form-group']}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete={authModalMode === 'login' ? 'current-password' : 'new-password'}
            />
            {authModalMode === 'login' && (
              <button
                type="button"
                className={styles['forgot-password-link']}
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </button>
            )}
            {authModalMode === 'register' && password && (
              <div className={styles['password-strength']}>
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`${styles['strength-bar']} ${
                      passwordStrength >= level
                        ? passwordStrength <= 1
                          ? styles.weak
                          : passwordStrength <= 2
                          ? styles.medium
                          : styles.strong
                        : ''
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {authModalMode === 'register' && (
            <div className={styles['form-group']}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
              />
            </div>
          )}

          <button type="submit" className={styles['submit-btn']} disabled={isLoading || isGoogleLoading}>
            {isLoading
              ? 'Please wait...'
              : authModalMode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        {/* Google Sign-In Section */}
        {config.google.clientId && (
          <>
            <div className={styles['divider']}>
              <span>OR</span>
            </div>
            
            <div className={styles['google-signin']}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text={authModalMode === 'login' ? 'signin_with' : 'signup_with'}
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
          <span>
            {authModalMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button type="button" onClick={switchMode}>
            {authModalMode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
