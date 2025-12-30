'use client';

import { motion } from 'framer-motion';
import { SignUpButton } from '@clerk/nextjs';
import { ArrowRight, Play, Sparkles, Zap, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LiveUserCounter } from './LiveUserCounter';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Animated Gradient Blob Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary blob - breathing animation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-br from-purple-600/30 via-pink-500/20 to-blue-500/30 blur-[120px] rounded-full"
        />
        
        {/* Secondary blob */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/25 to-purple-600/20 blur-[100px] rounded-full"
        />
        
        {/* Tertiary accent blob */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-pink-500/20 to-rose-500/15 blur-[80px] rounded-full"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Live User Counter */}
          <motion.div variants={itemVariants}>
            <LiveUserCounter />
          </motion.div>

          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/60 border border-zinc-700/50 backdrop-blur-sm text-sm">
              <Sparkles className="h-4 w-4 text-pink-400" />
              <span className="text-zinc-300">Powered by Gemini AI</span>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-medium">
                New
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
          >
            <span className="bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Tạo Kịch Bản Video
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Triệu Views Với AI
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Không cần sáng tạo từ con số 0. AI sẽ tạo{' '}
            <span className="text-white font-medium">hook cuốn hút</span>,{' '}
            <span className="text-white font-medium">nội dung viral</span>, và{' '}
            <span className="text-white font-medium">prompt AI video</span> — 
            tối ưu cho TikTok, Reels & Shorts.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <SignUpButton mode="modal">
              <Button 
                size="lg" 
                className={cn(
                  "h-14 px-8 text-lg font-semibold group",
                  "bg-gradient-to-r from-pink-500 to-purple-500",
                  "hover:from-pink-600 hover:to-purple-600",
                  "shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40",
                  "transition-all duration-300"
                )}
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Bắt đầu miễn phí
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignUpButton>
            <Link href="#features">
              <Button 
                variant="outline" 
                size="lg"
                className="h-14 px-8 text-lg font-medium border-zinc-700 text-zinc-300 hover:bg-zinc-800/80 hover:text-white hover:border-zinc-600 transition-all duration-300"
              >
                Khám phá tính năng
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-zinc-500"
          >
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span>Miễn phí 3 lần/ngày</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-400" />
              <span>Tạo trong 5 giây</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span>Tối ưu viral score</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
    </section>
  );
}
