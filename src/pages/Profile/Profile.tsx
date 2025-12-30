import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

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

  const handleResetPassword = () => {
    // Redirect to SSO password reset page
    authService.redirectToPasswordReset();
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
              onClick={handleResetPassword}
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
    </section>
  );
}
