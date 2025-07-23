'use client';

import { useEffect, useRef } from 'react';
import ContentPolicy from './ContentPolicy';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  className?: string;
  enforceContentPolicy?: boolean;
}

// AdSense ad component with compliance checking
export default function AdSenseAd({
  adSlot,
  adFormat = 'auto',
  adStyle = { display: 'block' },
  className = '',
  enforceContentPolicy = true
}: AdSenseAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load ads if window and adsbygoogle are available
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        // Push ad to AdSense queue
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  const AdComponent = () => (
    <div className={`adsense-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{
          ...adStyle,
          width: '100%',
          height: 'auto'
        }}
        data-ad-client="ca-pub-7574084780651527"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );

  // Wrap with content policy enforcement
  if (enforceContentPolicy) {
    return (
      <ContentPolicy enforceContentPolicy={true}>
        <AdComponent />
      </ContentPolicy>
    );
  }

  return <AdComponent />;
}

// Specific ad components for different placements
export const HeaderAd = () => (
  <AdSenseAd
    adSlot="1234567890" // Replace with actual ad slot
    adFormat="horizontal"
    className="header-ad mb-4"
    enforceContentPolicy={true}
  />
);

export const SidebarAd = () => (
  <AdSenseAd
    adSlot="1234567891" // Replace with actual ad slot
    adFormat="vertical"
    className="sidebar-ad"
    enforceContentPolicy={true}
  />
);

export const ContentAd = () => (
  <AdSenseAd
    adSlot="1234567892" // Replace with actual ad slot
    adFormat="rectangle"
    className="content-ad my-6"
    enforceContentPolicy={true}
  />
);

export const FooterAd = () => (
  <AdSenseAd
    adSlot="1234567893" // Replace with actual ad slot
    adFormat="horizontal"
    className="footer-ad mt-4"
    enforceContentPolicy={true}
  />
);

// AdSense configuration interface
interface AdSenseConfig {
  [key: string]: unknown;
}

// Declare global adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: AdSenseConfig[];
  }
}