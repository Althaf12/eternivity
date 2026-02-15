import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Profile from './pages/Profile/Profile'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import VerifyOtp from './pages/VerifyOtp/VerifyOtp'
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy'
import SafeUsage from './pages/SafeUsage/SafeUsage'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
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
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/safe-usage" element={<SafeUsage />} />
          </Routes>
        </main>
        <Footer />
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
