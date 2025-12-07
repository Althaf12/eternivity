import React from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  return (
    <section className={`page container ${styles.contact}`}>
      <h2>Contact Us</h2>
      <p>If you have questions about Eternivity™, reach out at <a href="mailto:hello@eternivity.com">hello@eternivity.com</a>.</p>
      <p>For support or service-specific inquiries, visit the relevant subdomain and use its contact method.</p>
    </section>
  )
}
