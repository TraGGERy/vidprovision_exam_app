'use client';

import Script from "next/script";

export default function AdSenseScript() {
  return (
    <Script
      id="adsense-script"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7574084780651527"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        // Initialize AdSense after script loads
        if (typeof window !== 'undefined') {
          window.adsbygoogle = window.adsbygoogle || [];
        }
      }}
    />
  );
}