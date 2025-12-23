import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthModal.module.css';

export default function AuthModal() {
  const { showAuthModal, authModalMode, closeAuthModal, login, register, openAuthModal } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (showAuthModal) {
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
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
    openAuthModal(authModalMode === 'login' ? 'register' : 'login');
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

  return (
    <div className={styles['modal-overlay']} onClick={closeAuthModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles['close-btn']} onClick={closeAuthModal} aria-label="Close">
          ×
        </button>
        
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
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoComplete="username"
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

          <button type="submit" className={styles['submit-btn']} disabled={isLoading}>
            {isLoading
              ? 'Please wait...'
              : authModalMode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        <div className={styles['switch-mode']}>
          <span>
            {authModalMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button type="button" onClick={switchMode}>
            {authModalMode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
