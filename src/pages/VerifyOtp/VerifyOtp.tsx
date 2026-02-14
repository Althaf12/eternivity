import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import styles from './VerifyOtp.module.css';

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, completeMfaLogin } = useAuth();

  const mfaToken = location.state?.mfaToken as string | undefined;
  const identifier = location.state?.identifier as string | undefined;
  const redirectUri = location.state?.redirectUri as string | undefined;

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount and clear navigation state to prevent stale data on back/forward
  useEffect(() => {
    inputRefs.current[0]?.focus();
    // Replace current history entry without state so back/forward won't replay stale mfaToken
    window.history.replaceState({}, '');
  }, []);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  // Redirect if no mfaToken (direct navigation)
  if (!mfaToken) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmpty = newOtp.findIndex((v) => !v);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await authService.verifyMfaLogin(mfaToken, otpCode);
      await completeMfaLogin();
      if (redirectUri) {
        window.location.href = redirectUri;
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP code');
      setOtp(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles['otp-page']}>
      <div className={styles['otp-card']}>
        <div className={styles['otp-icon']}>🔐</div>

        <div className={styles['otp-header']}>
          <h2>Two-Factor Authentication</h2>
          <p>Enter the 6-digit code from your Google Authenticator app</p>
          {identifier && (
            <p className={styles['otp-identifier']}>Signing in as <strong>{identifier}</strong></p>
          )}
        </div>

        <form className={styles['otp-form']} onSubmit={handleSubmit}>
          {error && <div className={styles['error-message']}>{error}</div>}

          <div className={styles['otp-inputs']} onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={styles['otp-input']}
                disabled={isLoading}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <button type="submit" className={styles['submit-btn']} disabled={isLoading || otp.join('').length !== 6}>
            {isLoading ? 'Verifying...' : 'Verify & Sign In'}
          </button>
        </form>

        <div className={styles['otp-footer']}>
          <button
            type="button"
            className={styles['back-link']}
            onClick={() => navigate('/login')}
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </section>
  );
}
