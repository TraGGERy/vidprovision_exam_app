import React from 'react';
import Link from 'next/link';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';

// Main subscription status component for detailed display
export const SubscriptionStatus: React.FC = () => {
  const { subscriptionData, loading, error, isUnlimited, isPremium, isLifetime, isFree } = useSubscriptionContext();

  if (loading) {
    return (
      <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-600 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-center">
        <p className="text-red-200 text-sm">Unable to load subscription status</p>
      </div>
    );
  }

  if (isUnlimited) {
    return (
      <div className="p-3 bg-green-900 border border-green-700 rounded-lg text-center">
        <div className="flex items-center justify-center mb-1">
          <span className="text-green-400 mr-2">✨</span>
          <h3 className="text-green-100 font-semibold">Unlimited Access</h3>
        </div>
        <p className="text-green-200 text-sm">
          {isLifetime ? 'Lifetime plan active' : 'Premium plan active'}
        </p>
      </div>
    );
  }

  // Free user display
  const dailyAttempts = subscriptionData?.usage?.dailyAttempts || 0;
  const maxAttempts = 3;
  
  return (
    <div className="p-3 bg-yellow-900 border border-yellow-700 rounded-lg text-center">
      <div className="flex items-center justify-center mb-1">
        <span className="text-yellow-400 mr-2">🆓</span>
        <h3 className="text-yellow-100 font-semibold">Free User Plan</h3>
      </div>
      <p className="text-yellow-200 text-sm mb-2">
        Daily attempts: {dailyAttempts}/{maxAttempts} used today
      </p>
      {dailyAttempts >= maxAttempts ? (
        <Link href="/payment">
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 rounded transition-colors">
            Upgrade for Unlimited
          </button>
        </Link>
      ) : (
        <p className="text-yellow-300 text-xs">
          {maxAttempts - dailyAttempts} attempts remaining today
        </p>
      )}
    </div>
  );
};

// Compact version for smaller spaces
export const CompactSubscriptionStatus: React.FC = () => {
  const { subscriptionData, loading, error, isUnlimited, isFree } = useSubscriptionContext();

  if (loading) {
    return (
      <div className="inline-flex items-center px-2 py-1 bg-gray-800 rounded text-xs">
        <div className="animate-pulse h-3 bg-gray-600 rounded w-16"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inline-flex items-center px-2 py-1 bg-red-800 rounded text-xs text-red-200">
        Status Error
      </div>
    );
  }

  if (isUnlimited) {
    return (
      <div className="inline-flex items-center px-2 py-1 bg-green-800 rounded text-xs text-green-200">
        <span className="mr-1">✨</span>
        Unlimited
      </div>
    );
  }

  const dailyAttempts = subscriptionData?.usage?.dailyAttempts || 0;
  return (
    <div className="inline-flex items-center px-2 py-1 bg-yellow-800 rounded text-xs text-yellow-200">
      <span className="mr-1">🆓</span>
      {dailyAttempts}/3 today
    </div>
  );
};

// Attempts counter component for specific use cases
export const AttemptsCounter: React.FC = () => {
  const { subscriptionData, loading, isUnlimited } = useSubscriptionContext();

  if (loading || isUnlimited) return null;

  const dailyAttempts = subscriptionData?.usage?.dailyAttempts || 0;
  const maxAttempts = 3;

  return (
    <div className="text-sm text-gray-400">
      Attempts today: {dailyAttempts}/{maxAttempts}
    </div>
  );
};