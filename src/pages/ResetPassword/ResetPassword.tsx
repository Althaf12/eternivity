import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import styles from './ResetPassword.module.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const token = searchParams.get('token');

  // Countdown and redirect after success
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      window.location.href = 'https://eternivity.com';
    }
  }, [isSuccess, countdown]);

  const getPasswordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token, password);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <section className={`page container ${styles['reset-page']}`}>
        <div className={styles['reset-card']}>
          <div className={styles['card-header']}>
            <span>⚠️</span>
            <h2>Invalid Reset Link</h2>
          </div>
          <p className={styles['error-text']}>
            This password reset link is invalid or has expired. Please request a new password reset.
          </p>
          <button
            className={styles['submit-btn']}
            onClick={() => navigate('/')}
          >
            Go to Homepage
          </button>
        </div>
      </section>
    );
  }

  if (isSuccess) {
    return (
      <section className={`page container ${styles['reset-page']}`}>
        <div className={styles['reset-card']}>
          <div className={styles['success-icon']}>✓</div>
          <h2>Password Reset Successful!</h2>
          <p className={styles['success-text']}>
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <p className={styles['countdown-text']}>
            Redirecting to homepage in <strong>{countdown}</strong> seconds...
          </p>
          <button
            className={styles['submit-btn']}
            onClick={() => window.location.href = 'https://eternivity.com'}
          >
            Go to Homepage Now
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={`page container ${styles['reset-page']}`}>
      <div className={styles['reset-card']}>
        <div className={styles['card-header']}>
          <span>🔐</span>
          <h2>Reset Your Password</h2>
        </div>
        <p className={styles['subtitle']}>Enter your new password below.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles['error-message']}>{error}</div>}

          <div className={styles['form-group']}>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              autoComplete="new-password"
            />
            {password && (
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

          <div className={styles['form-group']}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className={styles['submit-btn']} disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </section>
  );
}
