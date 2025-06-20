'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the InstallPWA component with SSR disabled
const InstallPWA = dynamic(
  () => import('../components/InstallPWA'),
  { ssr: false }
);

export default function PWAInstallContainer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <InstallPWA />;
}