'use client';

import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Sparkles, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAX_GUEST_GENERATIONS } from '@/hooks/useGuestUsage';

interface GuestUsageBannerProps {
  remainingGenerations: number;
  isLimitReached: boolean;
  className?: string;
}

/**
 * Banner showing guest users their remaining free generations
 * Displays a sign-in CTA when limit is reached
 */
export function GuestUsageBanner({
  remainingGenerations,
  isLimitReached,
  className,
}: GuestUsageBannerProps) {
  if (isLimitReached) {
    return (
      <div
        className={cn(
          'p-4 rounded-xl',
          'bg-linear-to-r from-pink-500/10 to-purple-500/10',
          'border border-pink-500/30',
          className
        )}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-pink-400">
            <Lock className="h-5 w-5" />
            <span className="font-medium">Đã hết lượt miễn phí!</span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-zinc-400">
              Đăng nhập để tạo không giới hạn kịch bản và lưu vào thư viện.
            </p>
          </div>
          <SignInButton mode="modal">
            <Button
              size="sm"
              className={cn(
                'bg-linear-to-r from-pink-500 to-purple-500',
                'hover:from-pink-600 hover:to-purple-600',
                'text-white font-medium shadow-lg shadow-pink-500/20'
              )}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Đăng nhập miễn phí
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-3 rounded-xl',
        'bg-zinc-900/50 border border-zinc-800',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_GUEST_GENERATIONS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  i < remainingGenerations
                    ? 'bg-green-400'
                    : 'bg-zinc-700'
                )}
              />
            ))}
          </div>
          <span className="text-sm text-zinc-400">
            Còn <span className="text-green-400 font-medium">{remainingGenerations}</span> lượt miễn phí
          </span>
        </div>
        <SignInButton mode="modal">
          <button className="text-xs text-pink-400 hover:text-pink-300 transition-colors underline-offset-4 hover:underline">
            Đăng nhập để không giới hạn →
          </button>
        </SignInButton>
      </div>
    </div>
  );
}
