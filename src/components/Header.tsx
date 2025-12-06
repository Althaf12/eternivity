import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">Eternivity<span className="tm">TM</span></Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
