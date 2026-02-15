import React from 'react'
import styles from './SafeUsage.module.css'

export default function SafeUsage() {
  return (
    <section className={`page container ${styles.safeUsage}`}>
      <h2>Safe Usage Policy</h2>
      <p className={styles.subtitle}>
        Eternivity™ hosts services that handle personal and financial data. To keep everyone safe,
        we expect all users to follow the guidelines below. Breaking these rules may result in
        account suspension or termination without notice.
      </p>

      <div className={styles.usageSection}>
        <h3><span>✅</span> Acceptable Use</h3>
        <p>You may use our services to:</p>
        <ul>
          <li>Manage your personal finances, expenses, and budgets through our tools.</li>
          <li>Store and organize your own data for lawful personal or business purposes.</li>
          <li>Access your account from your own devices using your own credentials.</li>
          <li>Share access with others only through features we explicitly provide (e.g., shared accounts, if available).</li>
        </ul>
      </div>

      <div className={`${styles.usageSection} ${styles.warning}`}>
        <h3><span>🚫</span> Prohibited Activities</h3>
        <p>The following actions are strictly forbidden. You must <strong>not</strong>:</p>
        <ul>
          <li>Use our services for any illegal activity, including money laundering, fraud, or tax evasion.</li>
          <li>Enter false, misleading, or fraudulent financial data with intent to deceive.</li>
          <li>Attempt to access another user's account, data, or session without their permission.</li>
          <li>Share your login credentials with others or let someone else use your account.</li>
          <li>Use automated tools, bots, or scripts to scrape data or abuse our APIs beyond fair usage.</li>
          <li>Try to hack, exploit, or test vulnerabilities in our systems without written permission.</li>
          <li>Upload malware, viruses, or any harmful code to our platform.</li>
          <li>Use our services to harass, threaten, or harm other users.</li>
          <li>Resell, redistribute, or commercially exploit our services without a written agreement.</li>
          <li>Circumvent any security measures, rate limits, or access controls we put in place.</li>
        </ul>
      </div>

      <div className={styles.usageSection}>
        <h3><span>💰</span> Financial Data Responsibility</h3>
        <p>Because our services may involve sensitive financial information:</p>
        <ul>
          <li>You are solely responsible for the accuracy of the financial data you enter.</li>
          <li>Our tools are for personal tracking and organization — they are <strong>not</strong> a substitute for professional financial, tax, or legal advice.</li>
          <li>We do not verify the accuracy of your entries or guarantee any financial outcomes based on our tools.</li>
          <li>Do not store third-party financial information (e.g., someone else's bank details) unless you have their explicit consent.</li>
          <li>If you use our services for business purposes, you are responsible for complying with all applicable financial regulations in your jurisdiction.</li>
        </ul>
      </div>

      <div className={`${styles.usageSection} ${styles.tip}`}>
        <h3><span>🛡️</span> Keeping Your Account Safe</h3>
        <p>We strongly recommend the following steps to protect yourself:</p>
        <ol>
          <li><strong>Enable two-factor authentication (MFA)</strong> in your profile settings. This adds a second layer of security using Google Authenticator.</li>
          <li><strong>Use a strong, unique password</strong> that you don't use on other websites. At least 12 characters with a mix of letters, numbers, and symbols is ideal.</li>
          <li><strong>Never share your password or MFA recovery codes</strong> with anyone, including people claiming to be from Eternivity support.</li>
          <li><strong>Log out when using shared or public devices.</strong> Our sessions use secure cookies, but it's still good practice.</li>
          <li><strong>Review your account activity regularly</strong> and report anything suspicious to us immediately.</li>
          <li><strong>Keep your email address up to date</strong> so we can reach you for security alerts and password resets.</li>
        </ol>
      </div>

      <div className={styles.usageSection}>
        <h3><span>⚠️</span> Fair Usage Limits</h3>
        <p>To keep our services running smoothly for everyone:</p>
        <ul>
          <li>Do not make an excessive number of API requests in a short time. We may apply rate limiting to protect our infrastructure.</li>
          <li>Do not store files or data that are unrelated to the purpose of the service you're using.</li>
          <li>Free accounts are for personal use. If you need higher limits or commercial access, contact us.</li>
        </ul>
      </div>

      <div className={styles.usageSection}>
        <h3><span>🔒</span> What We Do on Our End</h3>
        <p>We take the following measures to protect your account and data:</p>
        <ul>
          <li>All data is transmitted over encrypted HTTPS connections.</li>
          <li>Passwords are securely hashed — we can never see your actual password.</li>
          <li>Sessions use HttpOnly cookies that are inaccessible to browser scripts.</li>
          <li>We monitor for suspicious activity, brute-force attacks, and unauthorized access attempts.</li>
          <li>We log security events for investigation purposes. These logs are access-restricted and retained for a limited period.</li>
        </ul>
      </div>

      <div className={`${styles.usageSection} ${styles.warning}`}>
        <h3><span>⛔</span> Consequences of Violations</h3>
        <p>If you violate this policy, we may take one or more of the following actions:</p>
        <ul>
          <li><strong>Warning</strong> — for minor or first-time violations, we may issue a warning via email.</li>
          <li><strong>Temporary suspension</strong> — your account may be locked while we investigate.</li>
          <li><strong>Permanent termination</strong> — serious or repeated violations will result in permanent account closure.</li>
          <li><strong>Data deletion</strong> — upon termination, your data may be permanently deleted.</li>
          <li><strong>Legal action</strong> — in cases involving illegal activity, we may report the matter to law enforcement and cooperate fully with investigations.</li>
        </ul>
        <p>
          We reserve the right to take any of these actions at our sole discretion, without prior notice
          if the situation is urgent or involves potential harm to other users or our systems.
        </p>
      </div>

      <div className={styles.usageSection}>
        <h3><span>🤷</span> Limitation of Liability</h3>
        <p>
          Eternivity™ services are provided <strong>"as is"</strong> without warranties of any kind. While we do
          our best to keep things secure and running, we cannot guarantee uninterrupted service or
          complete protection against all threats. Specifically:
        </p>
        <ul>
          <li>We are not responsible for losses caused by your failure to keep your credentials safe.</li>
          <li>We are not liable for financial decisions you make based on data in our tools.</li>
          <li>We are not liable for data loss due to events beyond our reasonable control (natural disasters, third-party failures, etc.).</li>
          <li>Our total liability to you, for any reason, shall not exceed the amount you paid for our services in the 12 months before the claim.</li>
        </ul>
      </div>

      <div className={styles.usageSection}>
        <h3><span>📬</span> Reporting Issues</h3>
        <p>If you notice anything wrong — a security issue, suspicious activity on your account, or someone misusing our platform — please let us know right away:</p>
        <ul>
          <li><strong>Security issues:</strong> <a href="mailto:security@eternivity.com">security@eternivity.com</a></li>
          <li><strong>Abuse reports:</strong> <a href="mailto:abuse@eternivity.com">abuse@eternivity.com</a></li>
          <li><strong>General support:</strong> <a href="mailto:contact@eternivity.com">contact@eternivity.com</a></li>
        </ul>
        <p>We take every report seriously and will respond as quickly as we can.</p>
      </div>

      <p className={styles.contactNote}>
        By using Eternivity™ services, you agree to follow this Safe Usage Policy.<br />
        If you have questions, contact us at{' '}
        <a href="mailto:contact@eternivity.com">contact@eternivity.com</a>
      </p>
    </section>
  )
}
