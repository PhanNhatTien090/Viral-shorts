'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show only the icon (for collapsed states) */
  iconOnly?: boolean;
  /** Show tagline below brand name */
  showTagline?: boolean;
  /** Custom className for additional styling */
  className?: string;
  /** Link destination (default: /) */
  href?: string;
  /** Disable link wrapper */
  asLink?: boolean;
  /** Enable hover animation */
  animated?: boolean;
}

const sizeConfig = {
  sm: {
    icon: 'w-7 h-7 rounded-lg',
    iconInner: 'h-3.5 w-3.5',
    text: 'text-sm',
    tagline: 'text-[9px]',
    gap: 'gap-2',
  },
  md: {
    icon: 'w-9 h-9 rounded-xl',
    iconInner: 'h-5 w-5',
    text: 'text-base',
    tagline: 'text-[10px]',
    gap: 'gap-2.5',
  },
  lg: {
    icon: 'w-11 h-11 rounded-xl',
    iconInner: 'h-6 w-6',
    text: 'text-xl',
    tagline: 'text-xs',
    gap: 'gap-3',
  },
};

export function Logo({
  size = 'md',
  iconOnly = false,
  showTagline = false,
  className,
  href = '/',
  asLink = true,
  animated = true,
}: LogoProps) {
  const config = sizeConfig[size];

  const LogoContent = (
    <div className={cn('flex items-center', config.gap, className)}>
      {/* Icon with gradient background */}
      <motion.div
        whileHover={animated ? { scale: 1.05, rotate: 5 } : undefined}
        className="relative shrink-0"
      >
        {/* Glow effect */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 blur-lg opacity-50',
          config.icon
        )} />
        {/* Icon container */}
        <div className={cn(
          'relative bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25',
          config.icon
        )}>
          <Sparkles className={cn('text-white', config.iconInner)} />
        </div>
      </motion.div>

      {/* Brand text */}
      {!iconOnly && (
        <div className="flex flex-col min-w-0">
          <span className={cn(
            'font-bold tracking-tight bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent',
            config.text
          )}>
            ViralScript
          </span>
          {showTagline && (
            <span className={cn('text-zinc-500 -mt-0.5', config.tagline)}>
              AI Script Generator
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (!asLink) {
    return LogoContent;
  }

  return (
    <Link href={href} className="group">
      {LogoContent}
    </Link>
  );
}

export default Logo;
