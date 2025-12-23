import React from 'react'
import styles from './Home.module.css'
import logo from '/logo/Picture1-min.webp'
import { useAuth } from '../../context/AuthContext'
import { config } from '../../config'

export default function Home() {
  const { isAuthenticated, openAuthModal, user } = useAuth();

  const handleServiceClick = (e: React.MouseEvent<HTMLAnchorElement>, serviceUrl: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal('login');
    }
    // If authenticated, the link will work normally with cookie already set
  };

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles['hero-inner']}`}>
          <div className={styles['hero-image']}>
            <img src={logo} alt="Eternivity main" />
          </div>
          <div className={styles['hero-copy']}>
            <h1>Eternivity<span className="tm">TM</span></h1>
            <p className={styles.lead}>
              Small, focused web services hosted as subdomains — simple, fast, and modular.
            </p>
            <p className={styles.lead}>
              Build your digital toolkit with purpose-driven applications.
            </p>
            <div className={styles['hero-cta']}>
              {!isAuthenticated ? (
                <>
                  <button className="btn-primary" onClick={() => openAuthModal('register')}>
                    Get Started Free
                  </button>
                  <button className="btn-secondary" onClick={() => openAuthModal('login')}>
                    Sign In
                  </button>
                </>
              ) : (
                <span className={styles.badge}>
                  👋 Welcome back, {user?.username}!
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <div className={styles['features-grid']}>
            <div className={styles.feature} style={{ '--delay': 1 } as React.CSSProperties}>
              <span className={styles['feature-icon']}>⚡</span>
              <h4>Lightning Fast</h4>
              <p>Optimized for speed and performance across all devices</p>
            </div>
            <div className={styles.feature} style={{ '--delay': 2 } as React.CSSProperties}>
              <span className={styles['feature-icon']}>🔒</span>
              <h4>Privacy First</h4>
              <p>Your data stays secure with end-to-end encryption</p>
            </div>
            <div className={styles.feature} style={{ '--delay': 3 } as React.CSSProperties}>
              <span className={styles['feature-icon']}>🎯</span>
              <h4>Purpose Built</h4>
              <p>Each service does one thing exceptionally well</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.services}>
        <div className="container">
          <h2>Available Services</h2>
          <div className={styles.cards}>
            <article className={styles.card}>
              <div className={styles['card-icon']}>💰</div>
              <h3>ExpenseTracker</h3>
              <p>Personal expense tracking — simple, private, and fast. Track your spending habits and manage your budget effectively.</p>
              <a 
                className={styles.btn} 
                href={config.services.expenseTracker}
                onClick={(e) => handleServiceClick(e, config.services.expenseTracker)}
                target="_blank" 
                rel="noopener noreferrer"
              >
                Open ExpenseTracker
              </a>
            </article>
            
            <article className={styles.card}>
              <div className={styles['card-icon']}>📝</div>
              <h3>More Coming Soon</h3>
              <p>We're working on exciting new services. Stay tuned for task managers, note-taking apps, and more!</p>
              <span className={styles.badge}>🚀 Coming Soon</span>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
