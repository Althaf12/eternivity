import React from 'react'
import styles from './PrivacyPolicy.module.css'

export default function PrivacyPolicy() {
  return (
    <section className={`page container ${styles.policy}`}>
      <h2>Privacy Policy</h2>
      <p className={styles.lastUpdated}>Last updated: February 15, 2026</p>

      <div className={`${styles.policySection} ${styles.highlight}`}>
        <h3><span>📋</span> Overview</h3>
        <p>
          Eternivity™ provides web-based services that may handle personal, financial, and other
          sensitive information. This policy explains what data we collect, how we use it, and
          what rights you have. We keep things simple and transparent — no fine print tricks.
        </p>
      </div>

      <div className={styles.policySection}>
        <h3><span>📦</span> What We Collect</h3>
        <p>We only collect data that is necessary to provide our services. This may include:</p>
        <ul>
          <li><strong>Account information</strong> — your username, email address, and encrypted password.</li>
          <li><strong>Profile details</strong> — any optional information you choose to add to your account.</li>
          <li><strong>Financial data</strong> — transaction records, expense entries, or billing information you enter into our services. We do not store full credit card numbers on our servers.</li>
          <li><strong>Authentication data</strong> — login tokens, MFA secrets (encrypted), and session identifiers.</li>
          <li><strong>Usage data</strong> — pages visited, features used, and basic device/browser information to help us improve our services.</li>
          <li><strong>Communication data</strong> — messages you send us through the contact form or support channels.</li>
        </ul>
      </div>

      <div className={styles.policySection}>
        <h3><span>🔐</span> How We Protect Your Data</h3>
        <ul>
          <li>Passwords are hashed using strong, industry-standard algorithms. We never store them in plain text.</li>
          <li>All connections use HTTPS/TLS encryption in transit.</li>
          <li>Sensitive data is encrypted at rest on our servers.</li>
          <li>Authentication uses secure HttpOnly cookies that cannot be accessed by scripts.</li>
          <li>We support two-factor authentication (MFA) for an extra layer of account protection.</li>
          <li>We perform regular security reviews and apply patches promptly.</li>
        </ul>
      </div>

      <div className={styles.policySection}>
        <h3><span>🎯</span> How We Use Your Data</h3>
        <p>Your data is used strictly to:</p>
        <ul>
          <li>Provide, run, and improve the services you signed up for.</li>
          <li>Authenticate your identity and keep your account secure.</li>
          <li>Send you important account-related notifications (password resets, security alerts).</li>
          <li>Respond to your support requests or feedback.</li>
          <li>Detect and prevent fraud, abuse, or unauthorized access.</li>
        </ul>
        <p>We <strong>do not</strong> sell, rent, or trade your personal data to third parties for advertising or marketing purposes.</p>
      </div>

      <div className={styles.policySection}>
        <h3><span>🍪</span> Cookies</h3>
        <p>
          We use essential cookies to keep you signed in and to maintain your session. These are
          strictly functional — we do not use tracking cookies or third-party advertising cookies.
        </p>
        <p>
          If you use Google Sign-In, Google may set its own cookies as part of the authentication
          process. Please refer to Google's privacy policy for details on their cookie usage.
        </p>
      </div>

      <div className={styles.policySection}>
        <h3><span>🤝</span> Third-Party Services</h3>
        <p>We may use the following third-party services:</p>
        <ul>
          <li><strong>Google OAuth</strong> — for optional Sign-In with Google. We receive only your basic profile info (name, email) and do not access your Google data beyond that.</li>
          <li><strong>Payment processors</strong> — if applicable, payments are handled by PCI-compliant third parties. We never see or store your full card details.</li>
        </ul>
        <p>Each third party has its own privacy policy. We only share the minimum data needed for them to function.</p>
      </div>

      <div className={styles.policySection}>
        <h3><span>⏳</span> Data Retention</h3>
        <ul>
          <li>Your account data is kept for as long as your account is active.</li>
          <li>If you delete your account, we will remove your personal data within 30 days, except where we are legally required to keep it.</li>
          <li>Anonymized usage statistics may be retained indefinitely as they cannot identify you.</li>
          <li>Backup copies may persist for up to 90 days after deletion as part of our disaster recovery process.</li>
        </ul>
      </div>

      <div className={styles.policySection}>
        <h3><span>⚖️</span> Your Rights</h3>
        <p>You have the right to:</p>
        <ul>
          <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
          <li><strong>Correct</strong> — update or fix any inaccurate information in your account.</li>
          <li><strong>Delete</strong> — request deletion of your account and associated data.</li>
          <li><strong>Export</strong> — request your data in a portable format.</li>
          <li><strong>Withdraw consent</strong> — opt out of optional data processing at any time.</li>
        </ul>
        <p>To exercise any of these rights, contact us at <a href="mailto:privacy@eternivity.com">privacy@eternivity.com</a>.</p>
      </div>

      <div className={styles.policySection}>
        <h3><span>🚨</span> Data Breaches</h3>
        <p>
          In the unlikely event of a data breach that affects your personal information, we will:
        </p>
        <ul>
          <li>Notify affected users by email within 72 hours of confirming the breach.</li>
          <li>Report the breach to relevant authorities as required by law.</li>
          <li>Take immediate steps to contain and fix the vulnerability.</li>
          <li>Provide clear guidance on what you should do (e.g., change your password, enable MFA).</li>
        </ul>
        <p>
          <strong>Limitation:</strong> While we take every reasonable step to protect your data,
          no system is 100% secure. We cannot guarantee absolute security, and we are not liable
          for damages resulting from unauthorized access that occurs despite our security measures
          being in place.
        </p>
      </div>

      <div className={styles.policySection}>
        <h3><span>👶</span> Children's Privacy</h3>
        <p>
          Our services are not intended for users under the age of 16. We do not knowingly collect
          data from children. If we discover that a child has created an account, we will delete it
          and all associated data promptly.
        </p>
      </div>

      <div className={styles.policySection}>
        <h3><span>📝</span> Changes to This Policy</h3>
        <p>
          We may update this privacy policy from time to time. When we make significant changes,
          we will notify you through a banner on our site or via email. Continued use of our
          services after changes are posted means you accept the updated policy.
        </p>
      </div>

      <p className={styles.contactNote}>
        Questions about this policy? Reach out at{' '}
        <a href="mailto:privacy@eternivity.com">privacy@eternivity.com</a>
      </p>
    </section>
  )
}
