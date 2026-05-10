import React from 'react'
import styles from './ExpenseTracker.module.css'

const features = [
  {
    icon: '🏠',
    title: 'Smart Dashboard',
    desc: 'Your financial snapshot at a glance — total balance, income, expenses, and upcoming bills, all on one screen with month-over-month trend indicators.',
  },
  {
    icon: '📊',
    title: 'Deep Analytics',
    desc: 'Visualize your spending with pie charts, bar graphs, and trend lines. Break down expenses by category and compare months side-by-side.',
  },
  {
    icon: '📅',
    title: 'Planned Expenses',
    desc: 'Set up recurring bills and track what\'s paid vs. pending each month. Drag-and-drop to prioritize, collapse by category, and reset with one click.',
  },
  {
    icon: '💹',
    title: 'Income Tracking',
    desc: 'Log every income source with full CRUD support. View income by month, year, or custom date range. Export anytime in Excel or PDF.',
  },
  {
    icon: '🔄',
    title: 'Adjustments & Refunds',
    desc: 'Track refunds, cashbacks, and reversals tied to specific expenses. Color-coded status badges make it easy to see what\'s pending or completed.',
  },
  {
    icon: '📈',
    title: 'Future Estimates',
    desc: 'Plan ahead with expense, income, and credit card estimates for next month. Category subtotals help you budget before the month even starts.',
  },
  {
    icon: '⬆️',
    title: 'Import Bank Statements',
    desc: 'Upload your HDFC bank statement PDF (password-protected supported) and let the app auto-import your expenses and income instantly.',
  },
  {
    icon: '📤',
    title: 'Flexible Exports',
    desc: 'Export expenses or income as Excel or PDF. Choose a custom date range, download to device, or send directly to your email.',
  },
]

const dashboardHighlights = [
  { icon: '💰', label: 'Total Balance', desc: 'Real-time bank balance with month-over-month growth indicator' },
  { icon: '📉', label: 'Net After Dues', desc: 'Balance minus all unpaid planned expenses — know your true available cash' },
  { icon: '📥', label: 'Monthly Income', desc: 'All income sources summed for the current month with trend comparison' },
  { icon: '🛒', label: 'Monthly Expenses', desc: 'Total spending this month with comparison against the previous period' },
]

const analyticsOptions = [
  { icon: '🍩', label: 'Expense by Category', desc: 'Donut chart breaking down where your money goes' },
  { icon: '📊', label: 'Monthly Bar Chart', desc: 'Side-by-side comparison of income vs expenses per month' },
  { icon: '📈', label: 'Trend Over Time', desc: 'Line chart tracking your financial trajectory across months' },
  { icon: '📋', label: 'Month Summary Table', desc: 'Tabular breakdown with net balance, adjustment totals, and counts' },
]

const globalUxFeatures = [
  { icon: '🔔', label: 'Live Notifications', desc: 'Toast alerts for every action — success, error, or in-progress' },
  { icon: '🌗', label: 'Light / Dark Theme', desc: 'Toggle between themes anytime; your preference is saved to your profile' },
  { icon: '🙈', label: 'Privacy Mode', desc: 'One click hides all monetary values across the entire app — great for public use' },
  { icon: '👥', label: 'Guest Mode', desc: 'Explore the full app with demo data, no sign-up required. Your data is cleared when the tab closes' },
  { icon: '📱', label: 'Fully Responsive', desc: 'Sidebar navigation and adaptive layout work seamlessly on any screen size' },
  { icon: '💱', label: 'Multi-Currency', desc: 'Choose from 10 currencies — INR, USD, EUR, GBP, AUD, CAD, SGD, AED, JPY, CNY' },
]

export default function ExpenseTracker() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.heroIcon}>💸</span>
          <h1 className={styles.heroTitle}>Expense Tracker</h1>
          <p className={styles.heroSubtitle}>
            Take full control of your personal finances — track every rupee in and out, plan ahead,
            analyze trends, and stay on top of your financial health without the complexity of traditional tools.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.badge}>🔒 Secure SSO Login</span>
            <span className={styles.badge}>👤 Guest Mode Available</span>
            <span className={styles.badge}>📤 Excel &amp; PDF Exports</span>
            <span className={styles.badge}>💱 10 Currencies</span>
          </div>
          <a
            href="https://expenses.eternivity.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.heroCta}
          >
            Open Expense Tracker →
          </a>
        </div>
      </section>

      {/* Dashboard KPIs */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🏠</span>
            <h2>Dashboard — Your Financial Hub</h2>
            <p>
              The dashboard is the first thing you see when you log in. It gives you a complete snapshot of
              your current month without clicking anything extra. Four key metrics sit at the top so you
              always know exactly where you stand.
            </p>
          </div>
          <div className={styles.kpiGrid}>
            {dashboardHighlights.map((kpi) => (
              <div className={styles.kpiCard} key={kpi.label}>
                <span className={styles.kpiIcon}>{kpi.icon}</span>
                <h4>{kpi.label}</h4>
                <p>{kpi.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.dashboardExtras}>
            <div className={styles.extraItem}>
              <span>✅</span>
              <div>
                <strong>Planned Expense Tracker</strong>
                <p>See all recurring bills grouped by category. Check them off as you pay, drag to reorder by priority, and watch the progress bar fill up across the month.</p>
              </div>
            </div>
            <div className={styles.extraItem}>
              <span>🏷️</span>
              <div>
                <strong>Spend by Category</strong>
                <p>A visual bar chart + table showing exactly how much you've spent in each category this month. Filter by name or amount to zero in on what matters.</p>
              </div>
            </div>
            <div className={styles.extraItem}>
              <span>📋</span>
              <div>
                <strong>Current Month Expense List</strong>
                <p>The full expense log for the month — sortable, filterable, paginated (20 per page), and showing any refunds or cashbacks applied to each entry.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className={`${styles.section} ${styles.altSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>⚡</span>
            <h2>Everything You Need</h2>
            <p>
              From recording a coffee purchase to importing an entire month's bank statement — Expense Tracker
              covers the full spectrum of personal finance management.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((f) => (
              <div className={styles.featureCard} key={f.title}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>📊</span>
            <h2>Analytics That Actually Help</h2>
            <p>
              Stop guessing where your money went. The analytics page gives you interactive charts and clear
              summaries across any time range you choose — this month, last quarter, the whole year, or a
              completely custom range.
            </p>
          </div>
          <div className={styles.analyticsGrid}>
            {analyticsOptions.map((a) => (
              <div className={styles.analyticsCard} key={a.label}>
                <span>{a.icon}</span>
                <div>
                  <strong>{a.label}</strong>
                  <p>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.timeRangeRow}>
            <span className={styles.timeChip}>This Month</span>
            <span className={styles.timeChip}>Last Month</span>
            <span className={styles.timeChip}>Last 3 Months</span>
            <span className={styles.timeChip}>Last 6 Months</span>
            <span className={styles.timeChip}>This Year</span>
            <span className={styles.timeChipHighlight}>Custom Range</span>
          </div>
        </div>
      </section>

      {/* Auth & Security */}
      <section className={`${styles.section} ${styles.altSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🔐</span>
            <h2>Security-First Authentication</h2>
            <p>
              You don't need to worry about token management or session handling. Expense Tracker uses
              Eternivity's central SSO so your session is always protected by secure HttpOnly cookies —
              nothing sensitive is ever stored in the browser.
            </p>
          </div>
          <div className={styles.authGrid}>
            <div className={styles.authCard}>
              <span>🔑</span>
              <h4>Username &amp; Password</h4>
              <p>Classic, familiar sign-in with your Eternivity account credentials.</p>
            </div>
            <div className={styles.authCard}>
              <span>🔵</span>
              <h4>Google Sign-In</h4>
              <p>One-click OAuth login via your Google account — no extra password to remember.</p>
            </div>
            <div className={styles.authCard}>
              <span>♻️</span>
              <h4>Auto Session Refresh</h4>
              <p>Sessions refresh silently in the background. If recovery fails, you're redirected to login — no data lost.</p>
            </div>
            <div className={styles.authCard}>
              <span>👤</span>
              <h4>Guest Mode</h4>
              <p>Use the entire app with demo data, no account needed. Everything is wiped when the browser tab closes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global UX */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✨</span>
            <h2>Built for Real-World Use</h2>
            <p>
              Every UX detail has been thought through — from skeleton loaders while data fetches to a
              single toggle that hides all your money values the moment someone peeks at your screen.
            </p>
          </div>
          <div className={styles.uxGrid}>
            {globalUxFeatures.map((u) => (
              <div className={styles.uxCard} key={u.label}>
                <span className={styles.uxIcon}>{u.icon}</span>
                <h4>{u.label}</h4>
                <p>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaInner}`}>
          <h2>Ready to take control of your finances?</h2>
          <p>No spreadsheets. No clutter. Just clean, focused expense tracking.</p>
          <a
            href="https://expenses.eternivity.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            Get Started Free →
          </a>
        </div>
      </section>
    </div>
  )
}
