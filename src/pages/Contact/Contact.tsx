import React from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  return (
    <section className={`page container ${styles.contact}`}>
      <h2>Contact Us</h2>
      <p>
        Have questions about Eternivity™ or need help with our services? 
        We're here to help and would love to hear from you.
      </p>
      <p>
        For support or service-specific inquiries, visit the relevant subdomain and use its contact method.
      </p>
      
      <div className={styles['contact-card']}>
        <div className={styles['contact-icon']}>✉️</div>
        <div className={styles['contact-info']}>
          <h4>Email Us</h4>
          <p>
            <a href="mailto:contact@eternivity.com">contact@eternivity.com</a>
          </p>
        </div>
      </div>
      
      <div className={styles['contact-card']}>
        <div className={styles['contact-icon']}>💬</div>
        <div className={styles['contact-info']}>
          <h4>Community Support</h4>
          <p>Join our community for discussions and peer support</p>
        </div>
      </div>
    </section>
  )
}
