import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles['site-footer']}>
      <div className={`container ${styles['footer-content']}`}>
        <nav className={styles['footer-links']}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/safe-usage">Safe Usage</Link>
        </nav>
        
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Eternivity<span className="tm">TM</span>. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
