import React from 'react'
import styles from './PasswordVault.module.css'

export default function PasswordVault() {
  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>🔐</span>
        </div>

        <h1 className={styles.title}>Password Vault</h1>

        <p className={styles.subtitle}>
          A secure, private place to store and manage all your passwords — coming soon to Eternivity.
        </p>

        <div className={styles.statusBadge}>
          🚧 Under Development
        </div>

        <p className={styles.description}>
          We're building something thoughtful here. Password Vault will let you store, organize, and retrieve
          credentials across all your services — encrypted end-to-end, no third-party access, ever.
        </p>

        <div className={styles.previewGrid}>
          <div className={styles.previewCard}>
            <span>🔒</span>
            <h4>End-to-End Encryption</h4>
            <p>Your passwords are encrypted before they leave your device. Only you hold the key.</p>
          </div>
          <div className={styles.previewCard}>
            <span>🗂️</span>
            <h4>Organized &amp; Searchable</h4>
            <p>Group passwords by category. Find what you need in seconds with instant search.</p>
          </div>
          <div className={styles.previewCard}>
            <span>🔗</span>
            <h4>SSO Integration</h4>
            <p>Seamlessly linked to your Eternivity account — one secure login for everything.</p>
          </div>
          <div className={styles.previewCard}>
            <span>📋</span>
            <h4>One-Click Copy</h4>
            <p>Copy any credential instantly. Auto-clears your clipboard after 30 seconds for safety.</p>
          </div>
        </div>

        <div className={styles.updateNote}>
          <span>📢</span>
          <p>
            This page will be updated once the service is live. Stay tuned — we'll announce when Password Vault
            is ready for use.
          </p>
        </div>
      </div>
    </div>
  )
}
