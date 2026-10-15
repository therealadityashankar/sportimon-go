'use client';

import React from 'react';
import { usePWA } from './PWAContext';

export default function PWAInstallBanner() {
  const { canInstall, isInstalled, installApp, isIOS } = usePWA();

  if (isInstalled) {
    return (
      <div className="install-section">
        <div className="btn-install" style={{ cursor: 'default', opacity: 0.8 }}>
          <span>✓ Installed as PWA</span>
        </div>
      </div>
    );
  }

  return (
    <div className="install-section">
      <button id="install-pwa-button" className="btn-install" onClick={installApp}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>{isIOS ? 'Install on iOS (Share ➔ Add to Home)' : 'Install App'}</span>
      </button>
    </div>
  );
}
