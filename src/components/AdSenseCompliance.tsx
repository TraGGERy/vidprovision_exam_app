'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface AdSenseComplianceProps {
  children: React.ReactNode;
  requiresSubstantialContent?: boolean;
}

// Content validation utility
const validatePageContent = (element: HTMLElement): boolean => {
  const textContent = element.textContent || '';
  const cleanText = textContent.replace(/\s+/g, ' ').trim();
  
  // Check for minimum content length (at least 300 words)
  const wordCount = cleanText.split(' ').filter(word => word.length > 0).length;
  
  // Check for substantial content elements
  const hasHeadings = element.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0;
  const hasParagraphs = element.querySelectorAll('p').length >= 3;
  
  return wordCount >= 300 && hasHeadings && hasParagraphs;
};

// Check if page has sufficient content for ads
const hasSubstantialContent = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const mainContent = document.querySelector('main') || document.body;
  return validatePageContent(mainContent);
};

// AdSense compliance wrapper component
export default function AdSenseCompliance({ 
  children, 
  requiresSubstantialContent = true 
}: AdSenseComplianceProps) {
  const [canShowAds, setCanShowAds] = useState(false);
  const [contentValidated, setContentValidated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Validate content after component mounts and content loads
    const validateContent = () => {
      if (!requiresSubstantialContent) {
        setCanShowAds(true);
        setContentValidated(true);
        return;
      }

      // Wait for content to load
      setTimeout(() => {
        const hasContent = hasSubstantialContent();
        setCanShowAds(hasContent);
        setContentValidated(true);
        
        // Log validation result for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log(`AdSense Content Validation - Path: ${pathname}, Can Show Ads: ${hasContent}`);
        }
      }, 1000);
    };

    validateContent();
  }, [pathname, requiresSubstantialContent]);

  // Don't render ads until content is validated
  if (!contentValidated) {
    return <>{children}</>;
  }

  // Only render ad components if content validation passes
  return (
    <>
      {canShowAds ? children : null}
    </>
  );
}

// Hook for checking if ads can be displayed
export const useAdSenseCompliance = () => {
  const [canShowAds, setCanShowAds] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkCompliance = () => {
      // Always allow ads on main content pages
      const allowedPaths = ['/', '/blog', '/quiz', '/study'];
      const isAllowedPath = allowedPaths.some(path => pathname?.startsWith(path) ?? false);
      
      if (isAllowedPath && hasSubstantialContent()) {
        setCanShowAds(true);
      } else {
        setCanShowAds(false);
      }
    };

    // Check after content loads
    setTimeout(checkCompliance, 1000);
  }, [pathname]);

  return canShowAds;
};

// Content enhancement component for pages that need more content
export const ContentEnhancer = ({ page }: { page: string }) => {
  const getEnhancedContent = () => {
    switch (page) {
      case 'home':
        return (
          <section className="py-8 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Complete Zimbabwe Driving License Preparation
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    Why Choose VidApp?
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Comprehensive question bank with 1000+ practice questions</li>
                    <li>• AI-powered tutor for personalized learning</li>
                    <li>• Spaced repetition system for better retention</li>
                    <li>• Real exam simulation with time limits</li>
                    <li>• Detailed explanations for every question</li>
                    <li>• Progress tracking and performance analytics</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    Study Features
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Multiple study modes (Practice, Exam, Review)</li>
                    <li>• Zimbabwe-specific traffic laws and regulations</li>
                    <li>• Road signs and traffic signals training</li>
                    <li>• Defensive driving techniques</li>
                    <li>• Vehicle safety and maintenance tips</li>
                    <li>• Mobile-friendly progressive web app</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        );
      
      case 'quiz':
        return (
          <section className="py-6 px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Quiz Instructions and Tips
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                  Before You Start:
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Read each question carefully before selecting an answer</li>
                  <li>• Use the AI tutor if you need help understanding concepts</li>
                  <li>• Take your time in practice mode to learn thoroughly</li>
                  <li>• Review explanations for both correct and incorrect answers</li>
                </ul>
              </div>
            </div>
          </section>
        );
      
      default:
        return null;
    }
  };

  return getEnhancedContent();
};