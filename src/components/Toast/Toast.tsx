import React, { useEffect, useState } from 'react';
import styles from './Toast.module.css';

export interface ToastData {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const icons = {
    success: '✅',
    info: 'ℹ️',
    error: '❌',
  };

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <span className={styles['toast-icon']}>{icons[toast.type]}</span>
      <div className={styles['toast-content']}>
        <div className={styles['toast-title']}>{toast.title}</div>
        {toast.message && <div className={styles['toast-message']}>{toast.message}</div>}
      </div>
      <div className={styles['toast-progress']} />
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className={styles['toast-container']}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

// Confetti effect for login
interface ConfettiProps {
  show: boolean;
}

export function Confetti({ show }: ConfettiProps) {
  const [particles, setParticles] = useState<{ id: number; left: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    if (show) {
      const colors = ['#7c3aed', '#9333ea', '#c026d3', '#10b981', '#f59e0b', '#3b82f6'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || particles.length === 0) return null;

  return (
    <div className={styles['confetti-container']}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={styles.confetti}
          style={{
            left: `${particle.left}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
