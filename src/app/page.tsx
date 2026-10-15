'use client';

import { useState, useEffect } from 'react';
import PWAInstallBanner from '@/components/PWAInstallBanner';
import { usePWA } from '@/components/PWAContext';

export default function Home() {
  const [count, setCount] = useState<number>(0);
  const [step, setStep] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { isOnline } = usePWA();

  // Load initial count from localStorage on client
  useEffect(() => {
    const saved = localStorage.getItem('counter_val');
    if (saved !== null) {
      setCount(parseInt(saved, 10) || 0);
    }
    setIsLoaded(true);
  }, []);

  // Save count changes to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('counter_val', count.toString());
    }
  }, [count, isLoaded]);

  // Keyboard accessibility (+, -, r)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '+' || e.key === '=') {
        setCount((prev) => prev + step);
      } else if (e.key === '-' || e.key === '_') {
        setCount((prev) => prev - step);
      } else if (e.key.toLowerCase() === 'r') {
        setCount(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step]);

  const increment = () => setCount((prev) => prev + step);
  const decrement = () => setCount((prev) => prev - step);
  const reset = () => setCount(0);

  return (
    <main className="container">
      {/* Top bar */}
      <header className="header">
        <div className="brand">
          <svg className="brand-icon" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="112" fill="#2563eb" />
            <circle cx="160" cy="256" r="68" fill="#ffffff" fillOpacity="0.2" />
            <rect x="120" y="246" width="80" height="20" rx="10" fill="#ffffff" />
            <circle cx="352" cy="256" r="68" fill="#ffffff" fillOpacity="0.2" />
            <rect x="312" y="246" width="80" height="20" rx="10" fill="#ffffff" />
            <rect x="342" y="216" width="20" height="80" rx="10" fill="#ffffff" />
          </svg>
          <span>Counter</span>
        </div>

        <div className="status-badge">
          <span className={`status-dot ${isOnline ? '' : 'offline'}`} />
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </header>

      {/* Main Counter Card */}
      <section className="counter-card" aria-label="Counter">
        <div className="counter-value" id="counter-value" aria-live="polite">
          {isLoaded ? count : 0}
        </div>

        <div className="action-buttons">
          <button
            id="decrement-btn"
            className="btn-circle decrement"
            onClick={decrement}
            aria-label="Decrease count"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <button
            id="increment-btn"
            className="btn-circle increment"
            onClick={increment}
            aria-label="Increase count"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div className="controls-row">
          <div className="step-selector">
            <span className="step-label">Step:</span>
            {[1, 5, 10].map((s) => (
              <button
                key={s}
                className={`step-btn ${step === s ? 'active' : ''}`}
                onClick={() => setStep(s)}
              >
                +{s}
              </button>
            ))}
          </div>

          <button id="reset-btn" className="btn-reset" onClick={reset} aria-label="Reset count">
            Reset
          </button>
        </div>
      </section>

      {/* Install Button */}
      <PWAInstallBanner />

      {/* Footer */}
      <footer className="footer">
        <p>Simple Installable PWA • Works Offline</p>
      </footer>
    </main>
  );
}
