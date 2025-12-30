'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Sparkles, Zap, Target, Brain, TrendingUp,
  Video, Palette, BarChart3, Rocket
} from 'lucide-react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(236, 72, 153, 0.15)',
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm',
        className
      )}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />

      {/* Border glow on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500"
        style={{
          opacity: opacity * 0.5,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(236, 72, 153, 0.3), transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

interface BentoGridProps {
  className?: string;
}

const features = [
  {
    title: 'Viral Hook Engine',
    description: 'AI-powered hooks that stop scrollers in their tracks. 500+ proven templates optimized for maximum retention.',
    icon: Sparkles,
    gradient: 'from-pink-500 to-rose-500',
    size: 'large',
  },
  {
    title: 'AI Script Writer',
    description: 'Generate complete scripts in seconds with your brand voice.',
    icon: Brain,
    gradient: 'from-purple-500 to-violet-500',
    size: 'small',
  },
  {
    title: 'Trend Radar',
    description: 'Real-time trending topics tailored to your niche.',
    icon: TrendingUp,
    gradient: 'from-cyan-500 to-blue-500',
    size: 'small',
  },
  {
    title: 'Multi-Platform Export',
    description: 'Optimized scripts for TikTok, Reels, Shorts, and more. One click, all platforms.',
    icon: Video,
    gradient: 'from-orange-500 to-amber-500',
    size: 'medium',
  },
  {
    title: 'Performance Analytics',
    description: 'Track what works. AI learns from your top performers.',
    icon: BarChart3,
    gradient: 'from-green-500 to-emerald-500',
    size: 'medium',
  },
  {
    title: 'Lightning Fast',
    description: '10x faster than writing manually. Save hours every week.',
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-500',
    size: 'small',
  },
  {
    title: 'Brand Voice AI',
    description: 'Trains on your content to match your unique style.',
    icon: Palette,
    gradient: 'from-fuchsia-500 to-pink-500',
    size: 'small',
  },
  {
    title: 'Engagement Optimizer',
    description: 'CTAs, hooks, and endings designed for maximum engagement and conversions.',
    icon: Target,
    gradient: 'from-indigo-500 to-purple-500',
    size: 'large',
  },
];

export function BentoGrid({ className }: BentoGridProps) {
  return (
    <section className={cn('py-24 relative', className)}>
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-gradient-to-br from-purple-500/5 to-pink-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 mb-6"
          >
            <Rocket className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-zinc-300">Powerful Features</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-white">Everything you need to </span>
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              go viral
            </span>
          </h2>
          
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            A complete toolkit for creating scroll-stopping short-form content that captivates audiences and drives engagement.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLarge = feature.size === 'large';
            const isMedium = feature.size === 'medium';
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  isLarge && 'md:col-span-2 md:row-span-2',
                  isMedium && 'lg:col-span-2'
                )}
              >
                <SpotlightCard
                  className="h-full p-6 flex flex-col"
                  spotlightColor={`${feature.gradient.includes('pink') ? 'rgba(236, 72, 153, 0.15)' : 
                    feature.gradient.includes('purple') ? 'rgba(168, 85, 247, 0.15)' :
                    feature.gradient.includes('cyan') ? 'rgba(6, 182, 212, 0.15)' :
                    'rgba(236, 72, 153, 0.15)'}`}
                >
                  {/* Icon */}
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                    'bg-gradient-to-br',
                    feature.gradient
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                    {feature.description}
                  </p>

                  {/* Decorative element for large cards */}
                  {isLarge && (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-zinc-900"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-zinc-400">
                          <span className="text-pink-400 font-semibold">2,847+</span> creators using this
                        </span>
                      </div>
                    </div>
                  )}
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
