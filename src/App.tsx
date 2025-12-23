import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Profile from './pages/Profile/Profile'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import AuthModal from './components/AuthModal/AuthModal'
import { ToastContainer, Confetti } from './components/Toast/Toast'

function AppContent() {
  const { toasts, removeToast, showConfetti } = useAuth();
  
  return (
    <>
      <div className="app-root">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
        <AuthModal />
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Confetti show={showConfetti} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
