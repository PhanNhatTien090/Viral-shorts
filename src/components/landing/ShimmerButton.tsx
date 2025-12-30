'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  shimmerColor?: string;
  borderRadius?: string;
  background?: string;
  onClick?: () => void;
}

export function ShimmerButton({
  children,
  className,
  shimmerColor = 'rgba(255, 255, 255, 0.3)',
  borderRadius = '12px',
  background = 'linear-gradient(135deg, rgb(236, 72, 153) 0%, rgb(168, 85, 247) 50%, rgb(59, 130, 246) 100%)',
  onClick,
}: ShimmerButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group relative inline-flex items-center justify-center overflow-hidden font-semibold text-white',
        'transition-all duration-300',
        className
      )}
      style={{ borderRadius }}
    >
      {/* Animated shimmer border */}
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
      >
        <span
          className="absolute inset-[-100%] animate-[shimmer_2s_infinite]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0 340deg, ${shimmerColor} 360deg)`,
          }}
        />
      </span>

      {/* Button background */}
      <span
        className="absolute inset-[2px] flex items-center justify-center"
        style={{
          borderRadius: `calc(${borderRadius} - 2px)`,
          background,
        }}
      />

      {/* Moving gradient overlay */}
      <span
        className="absolute inset-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          borderRadius: `calc(${borderRadius} - 2px)`,
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 1.5s ease infinite',
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 px-6 py-3">
        {children}
      </span>

      {/* Glow effect */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{
          background,
          zIndex: -1,
        }}
      />

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </motion.button>
  );
}

interface MagicBorderButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MagicBorderButton({ children, className, onClick }: MagicBorderButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative inline-flex items-center justify-center px-6 py-3 overflow-hidden',
        'font-semibold text-white rounded-xl group',
        className
      )}
    >
      {/* Rotating gradient border */}
      <span className="absolute inset-0 w-full h-full">
        <span
          className="absolute inset-[-2px] rounded-xl"
          style={{
            background: 'conic-gradient(from var(--angle), #ec4899, #8b5cf6, #06b6d4, #ec4899)',
            animation: 'rotate-gradient 3s linear infinite',
          }}
        />
      </span>

      {/* Inner background */}
      <span className="absolute inset-[2px] rounded-[10px] bg-zinc-950 group-hover:bg-zinc-900 transition-colors" />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>

      <style jsx>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes rotate-gradient {
          0% {
            --angle: 0deg;
          }
          100% {
            --angle: 360deg;
          }
        }
      `}</style>
    </motion.button>
  );
}

interface GlowingButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlowingButton({ children, className, onClick }: GlowingButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative px-8 py-4 rounded-full font-semibold text-white',
        'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600',
        'shadow-[0_0_30px_rgba(236,72,153,0.5)]',
        'hover:shadow-[0_0_50px_rgba(236,72,153,0.7)]',
        'transition-shadow duration-300',
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      
      {/* Pulse rings */}
      <motion.span
        className="absolute inset-0 rounded-full border border-pink-500/50"
        animate={{
          scale: [1, 1.2, 1.4],
          opacity: [0.5, 0.2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </motion.button>
  );
}
