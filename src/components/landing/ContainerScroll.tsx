'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ContainerScrollProps {
  children: React.ReactNode;
  className?: string;
}

export function ContainerScroll({ children, className }: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Smooth spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Transform values
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [25, 0, -10]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 0.95]);
  const y = useTransform(smoothProgress, [0, 0.5, 1], [100, 0, -50]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.7]);

  return (
    <div 
      ref={containerRef}
      className={cn('relative py-20', className)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          y,
          opacity,
          transformStyle: 'preserve-3d',
        }}
        className="relative mx-auto"
      >
        {/* Glow effect behind container */}
        <div className="absolute -inset-10 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-3xl opacity-50 rounded-[60px]" />
        
        {/* Main container */}
        <div className="relative">
          {/* Browser chrome */}
          <div className="relative rounded-t-2xl bg-zinc-900 border border-zinc-800 border-b-0 px-4 py-3 flex items-center gap-2">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            
            {/* URL bar */}
            <div className="flex-1 ml-4">
              <div className="max-w-md mx-auto bg-zinc-800/50 rounded-lg px-4 py-1.5 text-xs text-zinc-400 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>viralscript.ai/dashboard</span>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="relative rounded-b-2xl border border-zinc-800 border-t-0 overflow-hidden bg-zinc-950">
            {children}
          </div>

          {/* Reflection effect */}
          <div className="absolute inset-x-0 -bottom-20 h-20 bg-gradient-to-b from-zinc-950/50 to-transparent blur-sm" />
        </div>
      </motion.div>
    </div>
  );
}

interface FloatingMockupProps {
  className?: string;
}

export function FloatingMockup({ className }: FloatingMockupProps) {
  return (
    <ContainerScroll className={className}>
      <div className="relative w-full aspect-[16/10] bg-zinc-950 overflow-hidden">
        {/* Simulated Dashboard UI */}
        <div className="absolute inset-0 p-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600" />
              <div className="space-y-1">
                <div className="h-3 w-24 bg-zinc-800 rounded-full" />
                <div className="h-2 w-16 bg-zinc-800/50 rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-8 bg-zinc-800 rounded-lg" />
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg" />
            </div>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-3 gap-4 h-[calc(100%-80px)]">
            {/* Left sidebar */}
            <div className="col-span-1 space-y-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={cn(
                    'h-10 rounded-lg',
                    i === 0 ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30' : 'bg-zinc-800/50'
                  )}
                />
              ))}
            </div>

            {/* Main content */}
            <div className="col-span-2 space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: '2.4M', label: 'Views', color: 'from-pink-500 to-rose-500' },
                  { value: '847K', label: 'Likes', color: 'from-purple-500 to-blue-500' },
                  { value: '12.5K', label: 'Comments', color: 'from-cyan-500 to-teal-500' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                  >
                    <div className={cn('text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent', stat.color)}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Script preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <span className="text-xs">✨</span>
                  </div>
                  <span className="text-sm font-medium text-white">Generated Script</span>
                  <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Live
                  </span>
                </div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ width: 0 }}
                      animate={{ width: `${90 - i * 15}%` }}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                      className="h-2 bg-zinc-800 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Animated scan line */}
        <motion.div
          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500 to-transparent"
          animate={{
            top: ['0%', '100%'],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Corner gradients */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/10 to-transparent" />
      </div>
    </ContainerScroll>
  );
}
