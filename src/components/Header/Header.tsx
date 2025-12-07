import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles['site-header']}>
      <div className={`container ${styles['header-inner']}`}>
        <Link to="/" className={styles.brand}>Eternivity<span className="tm">TM</span></Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
