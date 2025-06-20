'use client';

import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" fill="none">
            <rect width="192" height="192" rx="32" fill="#000000"/>
            <path d="M96 48C68.4 48 46 70.4 46 98C46 125.6 68.4 148 96 148C123.6 148 146 125.6 146 98C146 70.4 123.6 48 96 48ZM86 123V73L116 98L86 123Z" fill="white"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">VidApp</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}