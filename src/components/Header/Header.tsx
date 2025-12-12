import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles['site-header']}>
      <div className={`container ${styles['header-inner']}`}>
        <Link to="/" aria-label="Eternivity home">
          <img src="/logo/Picture3-no bg.png" alt="Eternivity logo" className={styles.logo} />
        </Link>
        <Link to="/" className={styles.brand} aria-label="Eternivity home">
          Eternivity<span className="tm">TM</span>
        </Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
