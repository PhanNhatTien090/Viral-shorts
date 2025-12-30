'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export function FlipWords({ words, duration = 3000, className }: FlipWordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const startAnimation = useCallback(() => {
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 500);
  }, [words.length]);

  useEffect(() => {
    const interval = setInterval(startAnimation, duration);
    return () => clearInterval(interval);
  }, [startAnimation, duration]);

  return (
    <span className={cn('inline-block relative', className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ 
            opacity: 0, 
            y: 20,
            rotateX: 90,
            filter: 'blur(8px)'
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)'
          }}
          exit={{ 
            opacity: 0, 
            y: -20,
            rotateX: -90,
            filter: 'blur(8px)'
          }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
          style={{ perspective: '1000px' }}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({ text, delay = 50, className, onComplete }: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[3px] h-[1em] bg-pink-500 ml-1 align-middle"
      />
    </span>
  );
}

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className }: GlitchTextProps) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute inset-0 text-pink-500 z-0"
        animate={{
          x: [0, -2, 2, 0],
          opacity: [0, 0.8, 0.8, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
        style={{ clipPath: 'inset(30% 0 40% 0)' }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-cyan-500 z-0"
        animate={{
          x: [0, 2, -2, 0],
          opacity: [0, 0.8, 0.8, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 3,
          delay: 0.05,
        }}
        style={{ clipPath: 'inset(60% 0 10% 0)' }}
      >
        {text}
      </motion.span>
    </span>
  );
}
