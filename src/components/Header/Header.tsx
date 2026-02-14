import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Header.module.css'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <header className={styles['site-header']}>
      <div className={styles['header-inner']}>
        <Link to="/" className={styles['logo-link']} aria-label="Eternivity home">
          <img src="/logo/Picture3-no bg.png" alt="Eternivity logo" className={styles.logo} />
          <span className={styles.brand}>
            Eternivity<span className="tm">TM</span>
          </span>
        </Link>
        
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {!isAuthenticated ? (
          <div className={styles['auth-section']}>
            <Link 
              to="/login"
              className={`${styles['auth-btn']} ${styles['login-btn']}`}
            >
              Sign In
            </Link>
            <Link 
              to="/register"
              className={`${styles['auth-btn']} ${styles['register-btn']}`}
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className={styles['profile-section']} ref={dropdownRef}>
            <button
              className={styles['profile-btn']}
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="Profile menu"
              aria-expanded={showDropdown}
            >
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={`${user.username} profile`} className={styles['profile-img']} />
              ) : (
                user ? getInitials(user.username) : '?'
              )}
            </button>
            
            {showDropdown && (
              <div className={styles.dropdown}>
                <div className={styles['dropdown-header']}>
                  <p>{user?.username}</p>
                  <span>{user?.email}</span>
                </div>
                <Link 
                  to="/profile" 
                  className={styles['dropdown-item']}
                  onClick={() => setShowDropdown(false)}
                >
                  👤 Profile
                </Link>
                <button 
                  className={`${styles['dropdown-item']} ${styles.logout}`}
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
