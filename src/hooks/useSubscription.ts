import { useState, useEffect, useCallback } from 'react';

export interface SubscriptionUsage {
  dailyLimit: number; // -1 for unlimited
  dailyAttempts: number;
  remainingAttempts: number;
  lastAttemptDate: string;
  totalAttempts: number;
}

export interface SubscriptionData {
  subscriptionType: 'free' | 'premium' | 'lifetime';
  subscriptionActive: boolean;
  canStartTest: boolean;
  usage: SubscriptionUsage;
}

export interface SubscriptionResponse {
  success: boolean;
  data: SubscriptionData;
  error?: string;
}

export const useSubscription = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/user/status');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: SubscriptionResponse = await response.json();
      
      if (result.success && result.data) {
        setSubscriptionData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch subscription status');
      }
    } catch (err) {
      console.error('Subscription fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription status');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  // Polling mechanism for real-time updates
  useEffect(() => {
    const interval = setInterval(fetchSubscriptionStatus, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [fetchSubscriptionStatus]);

  // Listen for payment success events
  useEffect(() => {
    const handlePaymentSuccess = () => {
      fetchSubscriptionStatus();
    };
    
    window.addEventListener('paymentSuccess', handlePaymentSuccess);
    return () => window.removeEventListener('paymentSuccess', handlePaymentSuccess);
  }, [fetchSubscriptionStatus]);

  // Helper functions
  const isUnlimited = subscriptionData?.subscriptionType !== 'free' && subscriptionData?.subscriptionActive;
  const isPremium = subscriptionData?.subscriptionType === 'premium' && subscriptionData?.subscriptionActive;
  const isLifetime = subscriptionData?.subscriptionType === 'lifetime' && subscriptionData?.subscriptionActive;
  const isFree = subscriptionData?.subscriptionType === 'free' || !subscriptionData?.subscriptionActive;

  return {
    subscriptionData,
    loading,
    error,
    refreshSubscription: fetchSubscriptionStatus,
    // Helper properties
    isUnlimited,
    isPremium,
    isLifetime,
    isFree,
  };
};