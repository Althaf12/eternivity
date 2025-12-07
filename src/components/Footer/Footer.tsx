import React from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles['site-footer']}>
      <div className="container">
        <p>© {new Date().getFullYear()} Eternivity<span className="tm">TM</span>. All rights reserved.</p>
      </div>
    </footer>
  )
}
