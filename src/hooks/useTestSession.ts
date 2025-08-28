import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';

interface TestLimits {
  canStart: boolean;
  testsToday: number;
  remainingTests: number;
  subscriptionType: string;
}

interface TestSession {
  id: number;
  startTime: string;
  userId: number;
}

interface TestResult {
  sessionId: number;
  durationMinutes: number;
  withinLimit: boolean;
  maxDurationMinutes: number;
}

interface UseTestSessionReturn {
  // State
  isLoading: boolean;
  error: string | null;
  testLimits: TestLimits | null;
  activeSession: TestSession | null;
  lastResult: TestResult | null;
  
  // Actions
  checkTestLimits: () => Promise<void>;
  startTest: () => Promise<TestSession | null>;
  endTest: (sessionId: number) => Promise<TestResult | null>;
  clearError: () => void;
}

/**
 * Custom hook for managing test sessions and checking user limits
 * Integrates with the database through API routes
 */
export function useTestSession(): UseTestSessionReturn {
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testLimits, setTestLimits] = useState<TestLimits | null>(null);
  const [activeSession, setActiveSession] = useState<TestSession | null>(null);
  const [lastResult, setLastResult] = useState<TestResult | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkTestLimits = useCallback(async () => {
    if (!isSignedIn) {
      setError('Please sign in to check test limits');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/test-db', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check test limits');
      }

      const data = await response.json();
      setTestLimits(data.data.testLimits);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error checking test limits:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  const startTest = useCallback(async (): Promise<TestSession | null> => {
    if (!isSignedIn) {
      setError('Please sign in to start a test');
      return null;
    }

    if (activeSession) {
      setError('A test session is already active');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/test-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'start' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start test session');
      }

      const data = await response.json();
      const session = data.session;
      setActiveSession(session);
      
      // Refresh test limits after starting a session
      await checkTestLimits();
      
      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error starting test session:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, activeSession, checkTestLimits]);

  const endTest = useCallback(async (sessionId: number): Promise<TestResult | null> => {
    if (!isSignedIn) {
      setError('Please sign in to end a test');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/test-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'end',
          sessionId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to end test session');
      }

      const data = await response.json();
      const result = data.result;
      
      setLastResult(result);
      setActiveSession(null); // Clear active session
      
      // Refresh test limits after ending a session
      await checkTestLimits();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error ending test session:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, checkTestLimits]);

  return {
    // State
    isLoading,
    error,
    testLimits,
    activeSession,
    lastResult,
    
    // Actions
    checkTestLimits,
    startTest,
    endTest,
    clearError,
  };
}