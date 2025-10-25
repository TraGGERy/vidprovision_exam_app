'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSubscription, SubscriptionData } from '@/hooks/useSubscription';

interface SubscriptionContextType {
  subscriptionData: SubscriptionData | null;
  loading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  isUnlimited: boolean;
  isPremium: boolean;
  isLifetime: boolean;
  isFree: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const subscriptionHook = useSubscription();

  return (
    <SubscriptionContext.Provider value={subscriptionHook}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};