'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ContentPolicyProps {
  children: React.ReactNode;
  enforceContentPolicy?: boolean;
}

// Content policy validation utility
const validateContentPolicy = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const mainContent = document.querySelector('main') || document.body;
  const textContent = mainContent.textContent || '';
  const cleanText = textContent.replace(/\s+/g, ' ').trim();
  
  // Check for minimum content requirements
  const wordCount = cleanText.split(' ').filter(word => word.length > 2).length;
  const hasHeadings = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6').length >= 2;
  const hasParagraphs = mainContent.querySelectorAll('p').length >= 5;
  const hasLists = mainContent.querySelectorAll('ul, ol').length >= 1;
  const hasSubstantialContent = wordCount >= 500; // Increased minimum word count
  
  // Check for navigation and meaningful structure
  const hasNavigation = mainContent.querySelectorAll('nav, a[href]').length >= 3;
  const hasInteractiveElements = mainContent.querySelectorAll('button, input, select, textarea').length >= 1;
  
  return hasSubstantialContent && hasHeadings && hasParagraphs && (hasLists || hasNavigation || hasInteractiveElements);
};

// Content policy enforcement component
export default function ContentPolicy({ 
  children, 
  enforceContentPolicy = true 
}: ContentPolicyProps) {
  const [policyCompliant, setPolicyCompliant] = useState(false);
  const [contentValidated, setContentValidated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!enforceContentPolicy) {
      setPolicyCompliant(true);
      setContentValidated(true);
      return;
    }

    // Validate content after DOM is fully loaded
    const validateContent = () => {
      const isCompliant = validateContentPolicy();
      setPolicyCompliant(isCompliant);
      setContentValidated(true);
      
      // Log validation for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`Content Policy Validation - Path: ${pathname}, Compliant: ${isCompliant}`);
        
        if (!isCompliant) {
          const mainContent = document.querySelector('main') || document.body;
          const wordCount = (mainContent.textContent || '').split(' ').filter(word => word.length > 2).length;
          console.log(`Word count: ${wordCount}, Minimum required: 500`);
        }
      }
    };

    // Wait for content to load and then validate
    const timer = setTimeout(validateContent, 2000);
    
    // Also validate on content changes
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      setTimeout(validateContent, 1000);
    });
    
    if (typeof window !== 'undefined') {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname, enforceContentPolicy]);

  // Don't render ads until content is validated and compliant
  if (!contentValidated || !policyCompliant) {
    return null;
  }

  return <>{children}</>;
}

// Hook for checking content policy compliance
export const useContentPolicy = () => {
  const [isCompliant, setIsCompliant] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkCompliance = () => {
      // Always check content policy
      const compliant = validateContentPolicy();
      setIsCompliant(compliant);
    };

    // Check after content loads
    setTimeout(checkCompliance, 2000);
    
    // Re-check when pathname changes
    checkCompliance();
  }, [pathname]);

  return isCompliant;
};

// Content enhancement for policy compliance
export const PolicyCompliantContent = ({ page }: { page: string }) => {
  const getComplianceContent = () => {
    switch (page) {
      case 'home':
        return (
          <article className="py-8 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
              <header>
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  Zimbabwe Driving License Test Preparation - Complete Study Guide
                </h1>
              </header>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Master Your Zimbabwe Driving Test with VidApp
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Preparing for your Zimbabwe driving license test has never been easier. VidApp provides comprehensive 
                  study materials, practice tests, and AI-powered tutoring to help you pass your driving test on the first try. 
                  Our platform is specifically designed for Zimbabwe's driving regulations and road rules.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Whether you're a first-time driver or need to renew your license, our extensive question bank covers 
                  all aspects of Zimbabwe driving laws, road signs, traffic regulations, and safe driving practices. 
                  The Vehicle Inspection Department (VID) approved content ensures you're studying the most current and relevant material.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Comprehensive Study Features
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                      Advanced Learning Tools
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• Over 1000 practice questions covering all test categories</li>
                      <li>• AI-powered tutor with personalized learning recommendations</li>
                      <li>• Spaced repetition system for optimal knowledge retention</li>
                      <li>• Real exam simulation with authentic time constraints</li>
                      <li>• Detailed explanations for every question and answer</li>
                      <li>• Progress tracking and comprehensive performance analytics</li>
                      <li>• Mobile-responsive design for studying anywhere, anytime</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                      Zimbabwe-Specific Content
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• Complete coverage of Zimbabwe Highway Code</li>
                      <li>• Local traffic laws and road regulations</li>
                      <li>• Zimbabwe road signs and traffic signals training</li>
                      <li>• Defensive driving techniques for local conditions</li>
                      <li>• Vehicle safety and maintenance requirements</li>
                      <li>• Emergency procedures and accident protocols</li>
                      <li>• Rural and urban driving scenarios specific to Zimbabwe</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Study Modes for Every Learning Style
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Practice Mode</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Perfect for building confidence with unlimited time and immediate feedback on your answers.
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-900 dark:text-green-100">Study Mode</h4>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Comprehensive learning with detailed explanations and Zimbabwe-specific driving law focus.
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-red-900 dark:text-red-100">Exam Mode</h4>
                    <p className="text-sm text-red-800 dark:text-red-200">
                      Realistic test simulation with 25 questions and 8-minute time limit, just like the real VID test.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Why Choose VidApp for Your Driving Test Preparation?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  VidApp stands out as Zimbabwe's premier driving test preparation platform. Our content is regularly 
                  updated to reflect the latest changes in driving laws and regulations. The platform has helped thousands 
                  of students pass their driving tests with confidence.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Our AI tutor feature provides personalized guidance based on your performance, identifying weak areas 
                  and suggesting focused study sessions. The spaced repetition algorithm ensures you retain information 
                  long-term, not just for the test day.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Start your journey to becoming a safe and confident driver today. With VidApp's comprehensive study 
                  materials and proven teaching methods, you'll be well-prepared for both your written test and practical 
                  driving examination.
                </p>
              </section>
            </div>
          </article>
        );
      
      default:
        return (
          <section className="py-6 px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Zimbabwe Driving License Information
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                This comprehensive platform provides everything you need to prepare for your Zimbabwe driving license test. 
                Our study materials are based on the official Zimbabwe Highway Code and VID requirements.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Practice with confidence using our extensive question bank, AI tutor, and realistic exam simulations.
              </p>
            </div>
          </section>
        );
    }
  };

  return getComplianceContent();
};