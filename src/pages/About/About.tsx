import React from 'react'
import styles from './About.module.css'

export default function About() {
  return (
    <section className={`page container ${styles.about}`}>
      <h2>About Eternivity<span className="tm">TM</span></h2>
      <p>
        Eternivity™ is a lightweight platform for delivering single-purpose web services on dedicated subdomains.
        Each tool is independent, easy to host, and focused on doing one thing exceptionally well.
      </p>
      <p>
        Our goal is to provide reliable, efficient services while maintaining user privacy. We strive to
        keep pages fast, accessible, and user-friendly. This landing site links to each service, providing
        a unified experience across all our offerings.
      </p>
      
      <div className={styles['feature-list']}>
        <div className={styles['feature-item']}>
          <span>🚀</span>
          <h4>Lightning Fast</h4>
          <p>Optimized performance with minimal load times across all services.</p>
        </div>
        <div className={styles['feature-item']}>
          <span>🔒</span>
          <h4>Privacy First</h4>
          <p>Your data stays yours. We prioritize security and privacy.</p>
        </div>
        <div className={styles['feature-item']}>
          <span>🎯</span>
          <h4>Purpose Built</h4>
          <p>Each service does one thing and does it exceptionally well.</p>
        </div>
        <div className={styles['feature-item']}>
          <span>🌐</span>
          <h4>Always Available</h4>
          <p>Reliable uptime with services hosted on dedicated subdomains.</p>
        </div>
      </div>
    </section>
  )
}
