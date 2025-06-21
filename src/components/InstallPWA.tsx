'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Define interfaces for Safari and IE specific properties
  interface SafariNavigator extends Navigator {
    standalone?: boolean;
  }
  
  interface IEWindow extends Window {
    MSStream?: unknown;
  }

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as SafariNavigator).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Check if device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as IEWindow).MSStream;
    setIsIOS(isIOSDevice);

    // Handle Android install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };

  const toggleIOSInstructions = () => {
    setShowIOSInstructions(!showIOSInstructions);
  };

  // Don't show anything if the app is already installed
  if (isInstalled) {
    return null;
  }

  // Show iOS instructions with Apple-inspired design
  if (isIOS) {
    return (
      <div className="fixed bottom-6 md:bottom-8 left-0 right-0 mx-auto w-max z-50 animate-slideUp">
        <button
          className="glass-morphism text-gray-800 dark:text-white px-4 py-2.5 md:px-5 md:py-3 rounded-full shadow-lg flex items-center space-x-2 hover:shadow-xl transition-all duration-300"
          onClick={toggleIOSInstructions}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="M12 2v8m0 0l-4-4m4 4l4-4" />
            <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
          </svg>
          <span className="font-medium">Install on iPhone</span>
        </button>
        
        {showIOSInstructions && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6 animate-fadeIn">
            <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scaleIn">
              <h3 className="text-lg md:text-xl font-medium mb-4 md:mb-5 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Install on iPhone/iPad</h3>
              <ol className="list-decimal pl-5 space-y-3 mb-5 md:mb-6 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                <li>Tap the <span className="font-medium text-gray-900 dark:text-white">Share</span> button in Safari <span className="inline-block ml-1">📤</span></li>
                <li>Scroll down and tap <span className="font-medium text-gray-900 dark:text-white">Add to Home Screen</span> <span className="inline-block ml-1">➕</span></li>
                <li>Tap <span className="font-medium text-gray-900 dark:text-white">Add</span> in the top right corner <span className="inline-block ml-1">✓</span></li>
              </ol>
              <div className="flex justify-end">
                <button 
                  onClick={toggleIOSInstructions}
                  className="px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:shadow-md hover:from-blue-400 hover:to-indigo-500 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show Android install button with Apple-inspired design
  if (supportsPWA) {
    return (
      <div className="fixed bottom-6 md:bottom-8 left-0 right-0 mx-auto w-max z-50 animate-slideUp">
        <button
          className="glass-morphism text-gray-800 dark:text-white px-4 py-2.5 md:px-5 md:py-3 rounded-full shadow-lg flex items-center space-x-2 hover:shadow-xl transition-all duration-300"
          onClick={onClick}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="M12 2v8m0 0l-4-4m4 4l4-4" />
            <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
          </svg>
          <span className="font-medium">Install App</span>
        </button>
      </div>
    );
  }

  return null;
}