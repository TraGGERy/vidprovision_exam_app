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

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Check if device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
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

  // Show iOS instructions
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-0 right-0 mx-auto w-max z-50">
        <button
          className="bg-black text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
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
          >
            <path d="M12 2v8m0 0l-4-4m4 4l4-4" />
            <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
          </svg>
          <span>Install on iPhone</span>
        </button>
        
        {showIOSInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Install on iPhone/iPad</h3>
              <ol className="list-decimal pl-5 space-y-2 mb-4">
                <li>Tap the <strong>Share</strong> button in Safari</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
                <li>Tap <strong>Add</strong> in the top right corner</li>
              </ol>
              <div className="flex justify-end">
                <button 
                  onClick={toggleIOSInstructions}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
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

  // Show Android install button
  if (supportsPWA) {
    return (
      <div className="fixed bottom-4 left-0 right-0 mx-auto w-max z-50">
        <button
          className="bg-black text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
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
          >
            <path d="M12 2v8m0 0l-4-4m4 4l4-4" />
            <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
          </svg>
          <span>Install App</span>
        </button>
      </div>
    );
  }

  return null;
}