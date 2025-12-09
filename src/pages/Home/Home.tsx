import React from 'react'
import styles from './Home.module.css'

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles['hero-inner']}`}>
          <div style={{flexBasis:320, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <img src="/src/resources/logo/Picture1-min.webp" alt="Eternivity main" style={{maxWidth:280, borderRadius:12}} />
          </div>
          <div className={styles['hero-copy']}>
            <br />
            <br />
            <br />
            <br />
            <h1>Eternivity<span className="tm">TM</span></h1>
            <p className={styles.lead}>Small, focused web services hosted as subdomains — simple, fast, and modular.</p>
          </div>
        </div>
      </section>

      <section className={styles.services}>
        <div className="container">
          <h2>Available Services</h2>
          <div className={styles.cards}>
            <article className={styles.card}>
              <h3>ExpenseTracker</h3>
              <p>Personal expense tracking — simple, private, and fast.</p>
              <a className={styles.btn} href="https://expensetracker.eternivity.com" target="_blank" rel="noopener noreferrer">Open ExpenseTracker</a>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
