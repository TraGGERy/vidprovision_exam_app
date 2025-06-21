'use client';

import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out animation after 1.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // Hide splash screen after animation completes (2.5 seconds total)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 bg-gradient-to-b from-gray-900 to-black flex items-center justify-center z-50 transition-opacity duration-1000 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl"></div>
          <svg 
            className="relative z-10" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 192 192" 
            fill="none"
          >
            <rect width="192" height="192" rx="42" fill="#000000"/>
            <path 
              d="M96 48C68.4 48 46 70.4 46 98C46 125.6 68.4 148 96 148C123.6 148 146 125.6 146 98C146 70.4 123.6 48 96 48ZM86 123V73L116 98L86 123Z" 
              fill="white"
              className="drop-shadow-lg"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">VidApp</h1>
        <div className="flex justify-center items-center space-x-1.5">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
}