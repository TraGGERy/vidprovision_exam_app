'use client';

import Link from 'next/link';
import { PolicyCompliantContent } from '../../components/ContentPolicy';

export default function ContentPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      {/* Header Navigation */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="text-white font-bold text-xl hover:text-blue-300 transition-colors flex items-center"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to VidApp
            </Link>
            <h1 className="text-white text-lg font-semibold">Content Policy & Guidelines</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Content Policy & Educational Guidelines
            </h1>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              Learn about our commitment to providing quality educational content for Zimbabwe driving license preparation
            </p>
          </div>

          {/* Content Policy Information */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Our Content Standards</h2>
            <div className="space-y-4 text-blue-100">
              <p>
                VidApp is committed to providing comprehensive, accurate, and valuable educational content 
                for Zimbabwe driving license preparation. Our content policy ensures that all materials 
                meet high educational standards and provide genuine value to our users.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Content Quality Requirements</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Minimum 500 words of substantial educational content per page</li>
                <li>Clear headings and structured information hierarchy</li>
                <li>Comprehensive paragraphs with detailed explanations</li>
                <li>Interactive elements and navigation aids</li>
                <li>Zimbabwe-specific driving regulations and road rules</li>
                <li>Regular content updates and accuracy verification</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Educational Focus Areas</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Zimbabwe Traffic Act and road regulations</li>
                <li>Road signs and traffic signals specific to Zimbabwe</li>
                <li>Safe driving practices for local conditions</li>
                <li>Vehicle maintenance and safety requirements</li>
                <li>Defensive driving techniques</li>
                <li>Emergency procedures and accident prevention</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">User Experience Standards</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Mobile-responsive design for all devices</li>
                <li>Fast loading times and optimized performance</li>
                <li>Accessible content for users with disabilities</li>
                <li>Clear navigation and user-friendly interface</li>
                <li>Progressive Web App (PWA) functionality</li>
                <li>Offline access to essential content</li>
              </ul>
            </div>
          </div>

          {/* Enhanced Educational Content */}
          <PolicyCompliantContent page="content-policy" />

          {/* Additional Information */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Compliance & Standards</h2>
            <div className="space-y-4 text-blue-100">
              <p>
                Our content policy ensures compliance with educational standards and advertising guidelines. 
                We maintain a careful balance between providing valuable educational content and supporting 
                our platform through appropriate advertising partnerships.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Advertising Standards</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Ads are clearly distinguished from educational content</li>
                <li>Content-to-advertising ratio maintains educational focus</li>
                <li>No misleading or inappropriate advertisements</li>
                <li>User experience remains the top priority</li>
                <li>Compliance with Google AdSense policies</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Privacy & Data Protection</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>User data protection and privacy compliance</li>
                <li>Transparent data collection practices</li>
                <li>Secure storage and handling of user information</li>
                <li>GDPR and local privacy law compliance</li>
                <li>User control over personal data</li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Start Learning Now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}