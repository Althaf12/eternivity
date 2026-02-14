import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout, refreshUser } = useAuth();
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setPasswordError, setSetPasswordError] = useState('');
  const [setPasswordSuccess, setSetPasswordSuccess] = useState('');
  const [isSettingPassword, setIsSettingPassword] = useState(false);

  // MFA state
  const [mfaStep, setMfaStep] = useState<'idle' | 'loading' | 'qr' | 'success' | 'disable'>('idle');
  const [mfaQrImage, setMfaQrImage] = useState('');
  const [mfaSecret, setMfaSecret] = useState('');
  const [mfaOtp, setMfaOtp] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <section className={`page container ${styles['profile-page']}`}>
        <p>Loading...</p>
      </section>
    );
  }

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  // Check if user needs to set password (OAuth user without password)
  const needsPasswordSetup = user && !user.hasPassword && !user.authProviders?.includes('LOCAL');

  const handleResetPassword = () => {
    // Redirect to SSO password reset page
    authService.redirectToPasswordReset();
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetPasswordError('');
    setSetPasswordSuccess('');

    if (password.length < 8) {
      setSetPasswordError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setSetPasswordError('Passwords do not match');
      return;
    }

    setIsSettingPassword(true);
    try {
      await authService.setPassword(password, confirmPassword);
      setSetPasswordSuccess('Password set successfully! You can now log in with your email and password.');
      setPassword('');
      setConfirmPassword('');
      // Refresh user data to update hasPassword
      await refreshUser();
      // Close modal after a delay
      setTimeout(() => {
        setShowSetPasswordModal(false);
        setSetPasswordSuccess('');
      }, 2000);
    } catch (err) {
      setSetPasswordError(err instanceof Error ? err.message : 'Failed to set password');
    } finally {
      setIsSettingPassword(false);
    }
  };

  const openSetPasswordModal = () => {
    setPassword('');
    setConfirmPassword('');
    setSetPasswordError('');
    setSetPasswordSuccess('');
    setShowSetPasswordModal(true);
  };

  // ---- MFA Handlers ----
  const handleEnableMfa = async () => {
    setMfaStep('loading');
    setMfaError('');
    try {
      const data = await authService.setupMfa();
      setMfaQrImage(data.qrCodeImage);
      setMfaSecret(data.secret);
      setMfaStep('qr');
    } catch (err) {
      setMfaError(err instanceof Error ? err.message : 'Failed to setup MFA');
      setMfaStep('idle');
    }
  };

  const handleVerifyMfaSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaOtp.length !== 6) {
      setMfaError('Please enter a 6-digit code');
      return;
    }
    setMfaError('');
    setMfaLoading(true);
    try {
      await authService.enableMfa(mfaSecret, mfaOtp);
      setMfaStep('success');
      setMfaOtp('');
      await refreshUser();
    } catch (err) {
      setMfaError(err instanceof Error ? err.message : 'Invalid OTP code');
    } finally {
      setMfaLoading(false);
    }
  };

  const handleDisableMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaOtp.length !== 6) {
      setMfaError('Please enter a 6-digit code');
      return;
    }
    setMfaError('');
    setMfaLoading(true);
    try {
      await authService.disableMfa(mfaOtp);
      setMfaStep('idle');
      setMfaOtp('');
      setMfaError('');
      await refreshUser();
    } catch (err) {
      setMfaError(err instanceof Error ? err.message : 'Failed to disable MFA');
    } finally {
      setMfaLoading(false);
    }
  };

  const resetMfaState = () => {
    setMfaStep('idle');
    setMfaQrImage('');
    setMfaSecret('');
    setMfaOtp('');
    setMfaError('');
  };

  // Get subscription list from user services
  const subscriptions = user?.services ? Object.entries(user.services) : [];

  return (
    <section className={`page container ${styles['profile-page']}`}>
      <h2>My Profile</h2>
      <p>Manage your account settings and subscriptions</p>

      <div className={styles['profile-grid']}>
        {/* Left Column - User Info */}
        <div className={styles['profile-card']}>
          <div className={styles['avatar-section']}>
            <div className={styles['avatar-large']}>
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={`${user.username} profile`} />
              ) : (
                user ? getInitials(user.username) : '?'
              )}
            </div>
            <div className={styles['user-info']}>
              <h4>{user?.username}</h4>
              <p>{user?.email}</p>
            </div>
          </div>

          <div className={styles['card-header']}>
            <span>📋</span>
            <h3>Account Details</h3>
          </div>

          <div className={styles['info-row']}>
            <label>Username</label>
            <span>{user?.username}</span>
          </div>
          <div className={styles['info-row']}>
            <label>Email</label>
            <span>{user?.email}</span>
          </div>

          <div className={styles.actions}>
            {needsPasswordSetup ? (
              <button
                className={`${styles['action-btn']} ${styles.primary}`}
                onClick={openSetPasswordModal}
              >
                🔐 Set Password
              </button>
            ) : (
              <button
                className={`${styles['action-btn']} ${styles.primary}`}
                onClick={handleResetPassword}
              >
                🔐 Reset Password
              </button>
            )}
            <button
              className={`${styles['action-btn']} ${styles.danger}`}
              onClick={logout}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Right Column - Subscriptions */}
        <div className={styles['profile-card']}>
          <div className={styles['card-header']}>
            <span>⭐</span>
            <h3>My Subscriptions</h3>
          </div>

          {subscriptions.length > 0 ? (
            <div className={styles['subscriptions-list']}>
              {subscriptions.map(([name, details]) => {
                // normalize details to an object
                const detailObj = typeof details === 'object' && details !== null
                  ? details
                  : (() => {
                      try {
                        return JSON.parse(String(details));
                      } catch {
                        return { raw: String(details) };
                      }
                    })();

                const plan = (detailObj && (detailObj.plan || detailObj.tier || detailObj.planName)) || 'free';
                const status = (detailObj && (detailObj.status || detailObj.state || detailObj.stateName)) || (detailObj && detailObj.raw ? 'Active' : 'Unknown');
                const isActive = String(status).toLowerCase() === 'active';

                // Extract expiry date from common backend fields and format it
                const expiryRaw = detailObj && (
                  detailObj.expiryDate || detailObj.expiresAt || detailObj.expires_on || detailObj.expiration || detailObj.expires || detailObj.expiry
                );
                let expiryDisplay: string | null = null;
                if (expiryRaw) {
                  const parsed = new Date(String(expiryRaw));
                  expiryDisplay = isNaN(parsed.getTime()) ? String(expiryRaw) : parsed.toLocaleDateString();
                }

                return (
                  <div key={name} className={styles['subscription-item']}>
                    <div className={styles['subscription-info']}>
                      <div className={styles['subscription-icon']}>📦</div>
                      <div className={styles['subscription-details']}>
                        <h5>{name}</h5>
                        <div className={styles['subscription-meta']}>
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span className={styles['subscription-plan']}>Plan: {String(plan)}</span>
                            {expiryDisplay && (
                              <span className={styles['subscription-expiry']}>Expires: {expiryDisplay}</span>
                            )}
                          </div>

                          {detailObj && detailObj.raw && (
                            <small className={styles['subscription-raw']}>{String(detailObj.raw)}</small>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`${styles['subscription-status']} ${isActive ? styles['status-active'] : styles['status-inactive']}`}
                      aria-label={`Subscription status: ${status}`}
                    >
                      {String(status)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles['no-subscriptions']}>
              <span>📭</span>
              <p>No active subscriptions yet</p>
              <p style={{ fontSize: '0.85rem' }}>
                Explore our services and subscribe to unlock premium features!
              </p>
            </div>
          )}
        </div>

        {/* MFA / Two-Factor Authentication */}
        <div className={styles['profile-card']}>
          <div className={styles['card-header']}>
            <span>🛡️</span>
            <h3>Two-Factor Authentication</h3>
          </div>

          {user?.mfaEnabled ? (
            /* MFA is currently enabled */
            <div className={styles['mfa-section']}>
              <div className={styles['mfa-status-badge']}>
                <span className={styles['mfa-status-dot']} />
                MFA is enabled
              </div>
              <p className={styles['mfa-desc']}>
                Your account is protected with Google Authenticator.
              </p>

              {mfaStep === 'disable' ? (
                <form onSubmit={handleDisableMfa} className={styles['mfa-form']}>
                  {mfaError && (
                    <div className={`${styles.message} ${styles.error}`}>{mfaError}</div>
                  )}
                  <div className={styles['form-group']}>
                    <label htmlFor="disableOtp">Enter OTP to confirm</label>
                    <input
                      type="text"
                      id="disableOtp"
                      inputMode="numeric"
                      maxLength={6}
                      value={mfaOtp}
                      onChange={(e) => setMfaOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-digit code"
                      required
                      disabled={mfaLoading}
                    />
                  </div>
                  <div className={styles['mfa-actions']}>
                    <button
                      type="button"
                      className={`${styles['action-btn']} ${styles.secondary}`}
                      onClick={() => { setMfaStep('idle'); setMfaOtp(''); setMfaError(''); }}
                      disabled={mfaLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`${styles['action-btn']} ${styles.danger}`}
                      disabled={mfaLoading}
                    >
                      {mfaLoading ? 'Disabling...' : 'Disable MFA'}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className={`${styles['action-btn']} ${styles.danger}`}
                  onClick={() => { setMfaStep('disable'); setMfaOtp(''); setMfaError(''); }}
                >
                  🔓 Disable MFA
                </button>
              )}
            </div>
          ) : (
            /* MFA is not enabled */
            <div className={styles['mfa-section']}>
              {mfaStep === 'idle' && (
                <>
                  <p className={styles['mfa-desc']}>
                    Add an extra layer of security to your account using Google Authenticator.
                  </p>
                  <button
                    className={`${styles['action-btn']} ${styles.primary}`}
                    onClick={handleEnableMfa}
                  >
                    🛡️ Enable MFA
                  </button>
                </>
              )}

              {mfaStep === 'loading' && (
                <div className={styles['mfa-loading']}>
                  <p>Setting up MFA...</p>
                </div>
              )}

              {mfaStep === 'qr' && (
                <div className={styles['mfa-setup']}>
                  <p className={styles['mfa-desc']}>
                    Scan this QR code with Google Authenticator, then enter the 6-digit code below.
                  </p>
                  <div className={styles['mfa-qr']}>
                    <img src={mfaQrImage} alt="MFA QR Code" />
                  </div>
                  {mfaSecret && (
                    <div className={styles['mfa-secret']}>
                      <label>Manual entry key:</label>
                      <code>{mfaSecret}</code>
                    </div>
                  )}
                  <form onSubmit={handleVerifyMfaSetup} className={styles['mfa-form']}>
                    {mfaError && (
                      <div className={`${styles.message} ${styles.error}`}>{mfaError}</div>
                    )}
                    <div className={styles['form-group']}>
                      <label htmlFor="setupOtp">Verification Code</label>
                      <input
                        type="text"
                        id="setupOtp"
                        inputMode="numeric"
                        maxLength={6}
                        value={mfaOtp}
                        onChange={(e) => setMfaOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit code"
                        required
                        disabled={mfaLoading}
                      />
                    </div>
                    <div className={styles['mfa-actions']}>
                      <button
                        type="button"
                        className={`${styles['action-btn']} ${styles.secondary}`}
                        onClick={resetMfaState}
                        disabled={mfaLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`${styles['action-btn']} ${styles.primary}`}
                        disabled={mfaLoading}
                      >
                        {mfaLoading ? 'Verifying...' : 'Verify & Enable'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {mfaStep === 'success' && (
                <div className={styles['mfa-success']}>
                  <span>✅</span>
                  <h4>MFA Enabled</h4>
                  <p>Two-factor authentication has been successfully enabled on your account.</p>
                  <button
                    className={`${styles['action-btn']} ${styles.primary}`}
                    onClick={resetMfaState}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Set Password Modal */}
      {showSetPasswordModal && (
        <div className={styles['modal-overlay']} onClick={() => setShowSetPasswordModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Set Your Password</h3>
            <p>Create a password to enable email/password login alongside your Google account.</p>
            
            <form onSubmit={handleSetPassword}>
              {setPasswordError && (
                <div className={`${styles.message} ${styles.error}`}>{setPasswordError}</div>
              )}
              {setPasswordSuccess && (
                <div className={`${styles.message} ${styles.success}`}>{setPasswordSuccess}</div>
              )}

              <div className={styles['form-group']}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  required
                  minLength={8}
                  disabled={isSettingPassword}
                />
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="confirmNewPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  minLength={8}
                  disabled={isSettingPassword}
                />
              </div>

              <div className={styles['modal-actions']}>
                <button
                  type="button"
                  className={`${styles['action-btn']} ${styles.secondary}`}
                  onClick={() => setShowSetPasswordModal(false)}
                  disabled={isSettingPassword}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles['action-btn']} ${styles.primary}`}
                  disabled={isSettingPassword}
                >
                  {isSettingPassword ? 'Setting...' : 'Set Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
