'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-white font-bold text-xl">
              VidApp
            </h1>
            <span className="text-blue-300 text-sm ml-2 hidden sm:inline">
              Zimbabwe Driving Test Prep
            </span>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link 
              href="/content-policy" 
              className="text-blue-300 hover:text-white transition-colors text-sm font-medium"
            >
              Content Policy
            </Link>
            <Link 
              href="/blog" 
              className="text-blue-300 hover:text-white transition-colors text-sm font-medium"
            >
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}