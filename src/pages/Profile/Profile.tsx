import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to home if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.resetPassword(currentPassword, newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        closePasswordModal();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Password reset failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage(null);
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
              {user ? getInitials(user.username) : '?'}
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
            <button
              className={`${styles['action-btn']} ${styles.primary}`}
              onClick={() => setShowPasswordModal(true)}
            >
              🔐 Reset Password
            </button>
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
              {subscriptions.map(([name, details]) => (
                <div key={name} className={styles['subscription-item']}>
                  <div className={styles['subscription-info']}>
                    <div className={styles['subscription-icon']}>📦</div>
                    <div className={styles['subscription-details']}>
                      <h5>{name}</h5>
                      <span>{typeof details === 'object' ? JSON.stringify(details) : String(details)}</span>
                    </div>
                  </div>
                  <span className={`${styles['subscription-status']} ${styles['status-active']}`}>
                    Active
                  </span>
                </div>
              ))}
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
      </div>

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className={styles['modal-overlay']} onClick={closePasswordModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Reset Password</h3>
            <p>Enter your current password and choose a new one</p>

            {message && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleResetPassword}>
              <div className={styles['form-group']}>
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className={styles['modal-actions']}>
                <button
                  type="button"
                  className={`${styles['action-btn']} ${styles.secondary}`}
                  onClick={closePasswordModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles['action-btn']} ${styles.primary}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
