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

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 mb-6 drop-shadow-2xl">
          {/* Replace SVG with icon-2.png */}
          <img src="/icons/icon-2.png" alt="VidApp Logo" className="w-full h-full rounded-xl drop-shadow-lg" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">VidApp</h1>
        <div className="flex justify-center items-center space-x-1.5 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>        
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>        
        </div>
      </div>
      <p className="text-xs text-gray-400 absolute bottom-6">powered by Mees Ai</p>
    </div>
  );
}