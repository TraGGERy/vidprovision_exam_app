import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWAInstallContainer from "./pwa-install";
import AdSenseScript from "../components/AdSenseScript";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VidApp - Zimbabwe Driving License Test Preparation",
  description: "Prepare for your Zimbabwe driving license test with our comprehensive quiz app featuring practice tests, study mode, and AI tutor assistance. Available on Android and iOS.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VidApp - Zimbabwe Driving Test"
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true
  },
  keywords: "Zimbabwe driving license, driving test preparation, driving quiz app, road rules Zimbabwe, traffic signs, PWA, driving exam, learner's license",
  authors: [{ name: "Mees Ai" }],
  creator: "Mees Ai ",
  publisher: "VidApp",
  category: "Education",
  applicationName: "Permetly",
  openGraph: {
    type: "website",
    url: "https://permitly.wiki",
    title: "VidApp - Zimbabwe Driving License Test Preparation",
    description: "Prepare for your Zimbabwe driving license test with our comprehensive quiz app featuring practice tests, study mode, and AI tutor assistance.",
    siteName: "Permetly",
    images: [{
      // Replace OpenGraph image reference
      url: "/screenshots/screenshot1.png",
      width: 1200,
      height: 630,
      alt: "VidApp Screenshot"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "VidApp - Zimbabwe Driving License Test Preparation",
    description: "Prepare for your Zimbabwe driving license test with our comprehensive quiz app.",
    images: ["/screenshots/screenshot1.png"]
  },
  alternates: {
    canonical: "https://permitly.wiki"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7574084780651527" />
        {/* Google AdSense script - Loaded conditionally based on content validation */}
        <AdSenseScript />
        <meta name="application-name" content="Permetly - Zimbabwe Driving License Test Preparation" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VidApp" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icons/icon-2.png" />
        <link rel="shortcut icon" href="/icons/icon-2.png" />
        <link rel="icon" type="image/png" href="/icons/icon-2.png" />
        
        {/* Twitter Card data */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="language" content="en" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="geo.region" content="ZW" />
        <meta name="geo.placename" content="Zimbabwe" />
        <link rel="apple-touch-icon" href="/icons/icon-2.png" />
        <link rel="shortcut icon" href="/icons/icon-2.png" />
        <link rel="icon" type="image/png" href="/icons/icon-2.png" />
        <link rel="canonical" href="https://permitly.wiki" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "MobileApplication",
              "name": "VidApp - Zimbabwe Driving License Test Preparation",
              "operatingSystem": "Android, iOS",
              "applicationCategory": "EducationalApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "120"
              },
              "description": "Prepare for your Zimbabwe driving license test with our comprehensive quiz app featuring practice tests, study mode, and AI tutor assistance.",
              "screenshot": "https://permitly.wiki/screenshots/screenshot1.png",
              "softwareVersion": "1.0.0",
              "author": {
                "@type": "Organization",
                "name": "VidApp Team",
                "url": "https://permitly.wiki"
              },
              "potentialAction": {
                "@type": "UseAction",
                "target": "https://permitly.wiki"
              }
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "VidApp - Zimbabwe Driving License Test Preparation",
              "url": "https://permitly.wiki",
              "applicationCategory": "EducationApplication",
              "genre": "education",
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "softwareVersion": "1.0",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Prepare for your Zimbabwe driving license test with our comprehensive quiz app featuring practice tests, study mode, and AI tutor assistance."
            }
          `}
        </script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          {children}
          <PWAInstallContainer />
        </ClerkProvider>
      </body>
    </html>
  );
}
