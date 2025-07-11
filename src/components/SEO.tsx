'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

export default function SEO({
  title = 'VidApp - Zimbabwe Driving License Test Preparation',
  description = 'Prepare for your Zimbabwe driving license test with our comprehensive quiz app featuring practice tests, study mode, and AI tutor assistance.',
  keywords = 'Zimbabwe driving license, driving test preparation, driving quiz app, road rules Zimbabwe',
  // Update default OpenGraph image
  ogImage = '/screenshots/screenshot1.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
}: SEOProps) {
  const pathname = usePathname();
  const baseUrl = 'https://vidapp.vercel.app';
  const currentUrl = `${baseUrl}${pathname}`;

  return (
    <Head>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:site_name" content="VidApp" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
    </Head>
  );
}