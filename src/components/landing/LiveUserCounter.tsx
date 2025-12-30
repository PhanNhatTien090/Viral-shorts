'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LiveUserCounterProps {
  baseCount?: number;
  className?: string;
}

export function LiveUserCounter({ baseCount = 847, className }: LiveUserCounterProps) {
  const [count, setCount] = useState(baseCount);

  useEffect(() => {
    // Simulate live user count fluctuation
    const interval = setInterval(() => {
      setCount(prev => {
        // Random change between -2 and +3 (slight upward bias)
        const change = Math.floor(Math.random() * 6) - 2;
        const newCount = prev + change;
        // Keep within reasonable bounds
        return Math.max(baseCount - 50, Math.min(baseCount + 100, newCount));
      });
    }, 3000 + Math.random() * 2000); // Random interval 3-5 seconds

    return () => clearInterval(interval);
  }, [baseCount]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-700/50 backdrop-blur-sm">
        {/* Pulsing green dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        
        {/* Counter text */}
        <span className="text-sm text-zinc-300">
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block font-semibold text-white tabular-nums"
          >
            {count.toLocaleString()}
          </motion.span>
          {' '}creators đang viết script
        </span>
      </div>
    </motion.div>
  );
}
