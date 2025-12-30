'use client';

import { useRef, useState } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InfiniteMarqueeProps {
  items: React.ReactNode[];
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export function InfiniteMarquee({
  items,
  direction = 'left',
  speed = 50,
  pauseOnHover = true,
  className,
}: InfiniteMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const xRef = useRef(0);

  useAnimationFrame((_, delta) => {
    if (isPaused) return;
    
    const velocity = (direction === 'left' ? -1 : 1) * speed * (delta / 1000);
    xRef.current += velocity;

    if (containerRef.current) {
      const width = containerRef.current.scrollWidth / 2;
      if (Math.abs(xRef.current) >= width) {
        xRef.current = 0;
      }
      containerRef.current.style.transform = `translateX(${xRef.current}px)`;
    }
  });

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none" />

      {/* Scrolling content - duplicated for seamless loop */}
      <div
        ref={containerRef}
        className="flex gap-6 whitespace-nowrap"
        style={{ willChange: 'transform' }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex-shrink-0">{item}</div>
        ))}
        {/* Duplicate for seamless loop */}
        {items.map((item, i) => (
          <div key={`dup-${i}`} className="flex-shrink-0">{item}</div>
        ))}
      </div>
    </div>
  );
}

// Pre-built avatar marquee component
interface AvatarMarqueeProps {
  className?: string;
}

export function AvatarMarquee({ className }: AvatarMarqueeProps) {
  const avatars = [
    { name: 'Sarah L.', role: 'TikTok Creator', views: '2.4M' },
    { name: 'Mike R.', role: 'YouTuber', views: '1.8M' },
    { name: 'Emma T.', role: 'Influencer', views: '3.1M' },
    { name: 'Alex K.', role: 'Content Creator', views: '890K' },
    { name: 'Jessica W.', role: 'Shorts Creator', views: '1.2M' },
    { name: 'David P.', role: 'Reels Expert', views: '2.7M' },
    { name: 'Lisa M.', role: 'Brand Creator', views: '950K' },
    { name: 'Tom H.', role: 'Viral Specialist', views: '4.2M' },
  ];

  const items = avatars.map((avatar, i) => (
    <motion.div
      key={i}
      whileHover={{ y: -5, scale: 1.02 }}
      className="flex items-center gap-3 px-5 py-3 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm"
    >
      {/* Avatar with gradient ring */}
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-75" />
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
          {avatar.name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
      
      <div className="text-left">
        <div className="text-sm font-medium text-white">{avatar.name}</div>
        <div className="text-xs text-zinc-500">{avatar.role}</div>
      </div>
      
      <div className="ml-2 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
        <span className="text-xs text-green-400 font-medium">{avatar.views} views</span>
      </div>
    </motion.div>
  ));

  return (
    <div className={cn('py-8', className)}>
      <InfiniteMarquee items={items} speed={30} />
    </div>
  );
}

// Logo marquee for partners/platforms
interface LogoMarqueeProps {
  className?: string;
}

export function LogoMarquee({ className }: LogoMarqueeProps) {
  const platforms = [
    { name: 'TikTok', icon: '🎵' },
    { name: 'YouTube', icon: '▶️' },
    { name: 'Instagram', icon: '📸' },
    { name: 'Reels', icon: '🎬' },
    { name: 'Shorts', icon: '⚡' },
    { name: 'X', icon: '𝕏' },
    { name: 'Facebook', icon: '📘' },
    { name: 'LinkedIn', icon: '💼' },
  ];

  const items = platforms.map((platform, i) => (
    <motion.div
      key={i}
      whileHover={{ scale: 1.1 }}
      className="flex items-center gap-3 px-6 py-3 text-zinc-400 hover:text-white transition-colors"
    >
      <span className="text-2xl">{platform.icon}</span>
      <span className="text-lg font-semibold">{platform.name}</span>
    </motion.div>
  ));

  return (
    <div className={cn('py-4', className)}>
      <InfiniteMarquee items={items} speed={40} direction="right" />
    </div>
  );
}

// Stats counter marquee
interface StatsMarqueeProps {
  className?: string;
}

export function StatsMarquee({ className }: StatsMarqueeProps) {
  const stats = [
    { value: '2,847', label: 'Active Creators' },
    { value: '12.4M', label: 'Scripts Generated' },
    { value: '847K', label: 'Hours Saved' },
    { value: '4.9/5', label: 'User Rating' },
    { value: '156', label: 'Countries' },
    { value: '99.9%', label: 'Uptime' },
  ];

  const items = stats.map((stat, i) => (
    <div
      key={i}
      className="flex items-center gap-3 px-6"
    >
      <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
        {stat.value}
      </span>
      <span className="text-sm text-zinc-500">{stat.label}</span>
      <span className="text-zinc-700">•</span>
    </div>
  ));

  return (
    <div className={cn('py-4 border-y border-zinc-800/50 bg-zinc-900/30', className)}>
      <InfiniteMarquee items={items} speed={25} pauseOnHover={false} />
    </div>
  );
}
