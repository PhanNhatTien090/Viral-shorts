'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye, TrendingUp, Zap } from 'lucide-react';

interface FloatingMetricsProps {
  className?: string;
}

export function FloatingMetrics({ className }: FloatingMetricsProps) {
  const [activeUsers, setActiveUsers] = useState(847);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  
  // Simulate live user count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        return Math.max(800, Math.min(920, prev + change));
      });
    }, 2000 + Math.random() * 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Simulate activity feed
  useEffect(() => {
    const activities = [
      'Sarah just generated a viral hook',
      'Mike saved 3 hours with AI scripts',
      'Emma hit 1M views using ViralScript',
      'Alex created 5 scripts in 2 minutes',
      'Jessica optimized her TikTok content',
      'David exported to all platforms',
    ];

    const addActivity = () => {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      setRecentActivity(prev => [activity, ...prev].slice(0, 3));
    };

    addActivity();
    const interval = setInterval(addActivity, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:block ${className}`}
    >
      <div className="space-y-3">
        {/* Live Users Card */}
        <motion.div
          whileHover={{ scale: 1.02, x: -5 }}
          className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl p-4 w-56"
        >
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-2xl opacity-50">
            <div className="absolute inset-[-2px] bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
              </div>
              <span className="text-xs text-zinc-400 uppercase tracking-wider">Live Now</span>
            </div>

            <div className="flex items-baseline gap-2">
              <motion.span
                key={activeUsers}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-white tabular-nums"
              >
                {activeUsers.toLocaleString()}
              </motion.span>
              <span className="text-sm text-zinc-500">creators online</span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
              <TrendingUp className="w-3 h-3" />
              <span>+12% this hour</span>
            </div>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          whileHover={{ scale: 1.02, x: -5 }}
          className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl p-4 w-56"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-pink-400" />
            <span className="text-xs text-zinc-400 uppercase tracking-wider">Activity</span>
          </div>

          <div className="space-y-2 min-h-[80px]">
            <AnimatePresence mode="popLayout">
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={activity + i}
                  initial={{ opacity: 0, x: 20, height: 0 }}
                  animate={{ opacity: 1 - i * 0.3, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-zinc-400 line-clamp-1"
                >
                  {activity}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          whileHover={{ scale: 1.02, x: -5 }}
          className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl p-4 w-56"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-lg font-bold text-white">12.4M</div>
              <div className="text-xs text-zinc-500">Scripts created</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">847K</div>
              <div className="text-xs text-zinc-500">Hours saved</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Smaller floating badge version for mobile
export function FloatingBadge() {
  const [count, setCount] = useState(847);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(800, Math.min(900, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl"
    >
      <div className="relative">
        <div className="w-2 h-2 bg-green-400 rounded-full" />
        <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
      </div>
      <motion.span
        key={count}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm font-medium text-white tabular-nums"
      >
        {count.toLocaleString()}
      </motion.span>
      <span className="text-sm text-zinc-400">online now</span>
    </motion.div>
  );
}
