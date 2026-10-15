'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAContextType {
  canInstall: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isIOS: boolean;
  swRegistered: boolean;
  installApp: () => Promise<boolean>;
  showInstallGuide: boolean;
  setShowInstallGuide: (show: boolean) => void;
}

const PWAContext = createContext<PWAContextType>({
  canInstall: false,
  isInstalled: false,
  isOnline: true,
  isIOS: false,
  swRegistered: false,
  installApp: async () => false,
  showInstallGuide: false,
  setShowInstallGuide: () => {},
});

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    // 1. Check online status
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // 2. Check if running in standalone PWA mode
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      if (isStandaloneMedia || isIOSStandalone) {
        setIsInstalled(true);
      }

      // 3. Detect iOS device
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isAppleDevice);

      // 4. Capture beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setDeferredPrompt(null);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      // 5. Register Service Worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            setSwRegistered(true);
            console.log('Sportimon Service Worker active with scope:', reg.scope);
          })
          .catch((err) => {
            console.error('Service Worker registration failed:', err);
          });
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const installApp = async (): Promise<boolean> => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } else {
      // Trigger instruction guide for platforms without direct prompt
      setShowInstallGuide(true);
      return false;
    }
  };

  return (
    <PWAContext.Provider
      value={{
        canInstall: !!deferredPrompt || (!isInstalled && !isIOS),
        isInstalled,
        isOnline,
        isIOS,
        swRegistered,
        installApp,
        showInstallGuide,
        setShowInstallGuide,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export const usePWA = () => useContext(PWAContext);
