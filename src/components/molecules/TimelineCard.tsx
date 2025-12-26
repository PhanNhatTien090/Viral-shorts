'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check, Zap, MessageSquare, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TimelineCardProps {
  timeLabel: string;
  titleLabel: string;
  children: ReactNode;
  variant?: 'hook' | 'body' | 'cta';
  isFirst?: boolean;
  isLast?: boolean;
  onCopy?: () => void;
  className?: string;
}

export function TimelineCard({
  timeLabel,
  titleLabel,
  children,
  variant = 'body',
  isFirst = false,
  isLast = false,
  onCopy,
  className,
}: TimelineCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    switch (variant) {
      case 'hook':
        return <Zap className="h-4 w-4" />;
      case 'cta':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const getGlowClass = () => {
    if (variant === 'hook') {
      return 'shadow-[0_0_40px_rgba(239,68,68,0.2)] border-red-500/50 hover:border-red-500/70';
    }
    if (variant === 'cta') {
      return 'border-green-500/30 hover:border-green-500/50';
    }
    return 'border-zinc-700/50 hover:border-zinc-600/50';
  };

  return (
    <div className={cn('relative flex gap-4', className)}>
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        {/* Top line */}
        {!isFirst && (
          <div className="w-0.5 h-4 bg-linear-to-b from-zinc-700 to-zinc-600" />
        )}
        
        {/* Node */}
        <div
          className={cn(
            'relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
            variant === 'hook'
              ? 'bg-linear-to-br from-pink-500 to-purple-600 border-pink-500/50 shadow-lg shadow-pink-500/20'
              : variant === 'cta'
              ? 'bg-linear-to-br from-purple-500 to-blue-600 border-purple-500/50'
              : 'bg-zinc-800 border-zinc-600'
          )}
        >
          <span className="text-white">{getIcon()}</span>
        </div>
        
        {/* Bottom line */}
        {!isLast && (
          <div className="w-0.5 flex-1 min-h-8 bg-linear-to-b from-zinc-600 to-zinc-700" />
        )}
      </div>

      {/* Card content */}
      <div className="flex-1 pb-6">
        {/* Time & Title Label */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
              variant === 'hook'
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : variant === 'cta'
                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
            )}
          >
            {variant === 'hook' && '🔥 '}
            {variant === 'cta' && '📣 '}
            {variant === 'body' && '📝 '}
            {timeLabel}
          </span>
          <span className="text-sm font-medium text-zinc-400">{titleLabel}</span>
        </div>

        {/* Glassmorphism Card */}
        <div
          className={cn(
            'relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-300',
            'bg-zinc-900/60 bg-opacity-10',
            getGlowClass()
          )}
        >
          {/* Content */}
          <div className={cn(
            'text-zinc-200 leading-relaxed',
            variant === 'hook' ? 'text-xl font-semibold' : 'text-base'
          )}>
            {children}
          </div>

          {/* Copy button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 text-zinc-500 hover:text-white hover:bg-zinc-800"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Skeleton version for loading state
export function TimelineCardSkeleton({
  isFirst = false,
  isLast = false,
}: {
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex gap-4 animate-pulse">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        {!isFirst && <div className="w-0.5 h-4 bg-zinc-800" />}
        <div className="w-10 h-10 rounded-full bg-zinc-800" />
        {!isLast && <div className="w-0.5 flex-1 min-h-8 bg-zinc-800" />}
      </div>

      {/* Card skeleton */}
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 w-16 rounded-full bg-zinc-800" />
          <div className="h-4 w-20 rounded bg-zinc-800" />
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
          <div className="space-y-2">
            <div className="h-4 w-full bg-zinc-800 rounded" />
            <div className="h-4 w-3/4 bg-zinc-800 rounded" />
            <div className="h-4 w-5/6 bg-zinc-800 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
