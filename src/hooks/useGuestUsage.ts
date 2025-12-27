'use client';

import { useState, useEffect, useCallback } from 'react';

const GUEST_USAGE_KEY = 'guest_usage_count';
const MAX_GUEST_GENERATIONS = 3;

interface UseGuestUsageReturn {
  usageCount: number;
  remainingGenerations: number;
  canGenerate: boolean;
  isLimitReached: boolean;
  incrementUsage: () => void;
  resetUsage: () => void;
}

/**
 * Hook to track guest user generation usage via localStorage
 * Allows 3 free generations before requiring sign-in
 */
export function useGuestUsage(): UseGuestUsageReturn {
  const [usageCount, setUsageCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(GUEST_USAGE_KEY);
      const count = stored ? parseInt(stored, 10) : 0;
      setUsageCount(isNaN(count) ? 0 : count);
      setIsInitialized(true);
    }
  }, []);

  // Increment usage count
  const incrementUsage = useCallback(() => {
    if (typeof window !== 'undefined') {
      const newCount = usageCount + 1;
      localStorage.setItem(GUEST_USAGE_KEY, String(newCount));
      setUsageCount(newCount);
    }
  }, [usageCount]);

  // Reset usage count (useful for testing or after sign-in)
  const resetUsage = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GUEST_USAGE_KEY);
      setUsageCount(0);
    }
  }, []);

  const remainingGenerations = Math.max(0, MAX_GUEST_GENERATIONS - usageCount);
  const canGenerate = usageCount < MAX_GUEST_GENERATIONS;
  const isLimitReached = usageCount >= MAX_GUEST_GENERATIONS;

  return {
    usageCount,
    remainingGenerations,
    canGenerate,
    isLimitReached,
    incrementUsage,
    resetUsage,
  };
}

export { MAX_GUEST_GENERATIONS };
