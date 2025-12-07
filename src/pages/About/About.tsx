import React from 'react'
import styles from './About.module.css'

export default function About() {
  return (
    <section className={`page container ${styles.about}`}>
      <h2>About Eternivity<span className="tm">TM</span></h2>
      <p>
        Eternivity™ is a lightweight platform for delivering single-purpose web services on dedicated subdomains.
        Each tool is independent, easy to host, and focused on doing one thing well.
      </p>
      <p>
        Our goal is to keep pages fast, accessible, and SEO-friendly. This landing site links to each service
        while keeping the main site minimal and efficient.
      </p>
    </section>
  )
}
