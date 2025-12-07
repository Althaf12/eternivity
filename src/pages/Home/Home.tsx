import React from 'react'
import styles from './Home.module.css'

export default function Home() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles['hero-inner']}`}>
        <div className={styles['hero-copy']}>
          <h1>Eternivity<span className="tm">TM</span></h1>
          <p className={styles.lead}>Small, focused web services hosted as subdomains — simple, fast, and modular.</p>
        </div>

        <aside className={styles.cards}>
          <article className={styles.card}>
            <h3>ExpenseTracker</h3>
            <p>Personal expense tracking — simple, private, and fast.</p>
            <a className={styles.btn} href="https://expensetracker.eternivity.com" target="_blank" rel="noopener noreferrer">Open ExpenseTracker</a>
          </article>
        </aside>
      </div>
    </section>
  )
}
