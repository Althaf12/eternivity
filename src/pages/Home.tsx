import React from 'react'

export default function Home() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1>Eternivity<span className="tm">TM</span></h1>
          <p className="lead">Small, focused web services hosted as subdomains — simple, fast, and modular.</p>
        </div>

        <aside className="cards">
          <article className="card">
            <h3>ExpenseTracker</h3>
            <p>Personal expense tracking — simple, private, and fast.</p>
            <a className="btn" href="https://expensetracker.eternivity.com" target="_blank" rel="noopener noreferrer">Open ExpenseTracker</a>
          </article>
        </aside>
      </div>
    </section>
  )
}
