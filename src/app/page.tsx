'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sparkles, ArrowRight, Play, Star, Shield, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  HeroBeams,
  FlipWords,
  ShimmerButton,
  MagicBorderButton,
  FloatingMockup,
  AvatarMarquee,
  StatsMarquee,
  BentoGrid,
  FloatingMetrics,
  FloatingBadge,
} from '@/components/landing';

// Glassmorphism Navbar with scroll effect
function Navbar() {
  const { isSignedIn } = useUser();
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 20]);

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50">
      {/* Background that appears on scroll */}
      <motion.div
        className="absolute inset-0 border-b border-white/5"
        style={{
          opacity: navOpacity,
          backdropFilter: `blur(${navBlur}px)`,
          backgroundColor: 'rgba(9, 9, 11, 0.8)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20"
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors">
              ViralScript
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Templates'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm text-zinc-400 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <Link href="/dashboard">
                <ShimmerButton className="text-sm">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ShimmerButton>
              </Link>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/5">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <ShimmerButton className="text-sm">
                    Get Started Free
                  </ShimmerButton>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// Hero Section with all effects
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background effects */}
      <HeroBeams />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <FloatingBadge />
          </motion.div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="block text-white"
            >
              Go viral on
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="block mt-2"
            >
              <FlipWords
                words={['TikTok', 'YouTube', 'Reels', 'Shorts']}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
              />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="block mt-2 bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent"
            >
              while you sleep.
            </motion.span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            AI-powered script generator that creates{' '}
            <FlipWords
              words={['viral', 'engaging', 'scroll-stopping', 'addictive']}
              duration={2500}
              className="text-pink-400 font-semibold"
            />{' '}
            content in seconds. Join 2,800+ creators.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <SignUpButton mode="modal">
              <ShimmerButton className="text-base px-8 py-4">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </ShimmerButton>
            </SignUpButton>

            <MagicBorderButton className="px-6 py-3">
              <Play className="w-4 h-4 mr-2 fill-current" />
              Watch Demo
            </MagicBorderButton>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-zinc-500"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span>4.9/5 from 500+ reviews</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-zinc-700 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ height: ['20%', '60%', '20%'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 bg-zinc-500 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// 3D Product Showcase
function ProductShowcase() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            See it in action
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Experience the power of AI-driven content creation with our intuitive dashboard.
          </p>
        </motion.div>

        <FloatingMockup />
      </div>
    </section>
  );
}

// Social Proof Section
function SocialProof() {
  return (
    <section className="relative py-16">
      <StatsMarquee />
      
      <div className="py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-sm text-zinc-500 uppercase tracking-wider mb-4">
            Trusted by top creators worldwide
          </p>
        </motion.div>
        
        <AvatarMarquee />
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-blue-500/20 blur-[150px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-2xl shadow-pink-500/30"
          >
            <Zap className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            <span className="text-white">Ready to create </span>
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              viral content?
            </span>
          </h2>

          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Join thousands of creators who are saving hours every week and getting more views than ever.
          </p>

          <div className="pt-4">
            <SignUpButton mode="modal">
              <ShimmerButton className="text-lg px-10 py-5">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </ShimmerButton>
            </SignUpButton>
          </div>

          <p className="text-sm text-zinc-500">
            No credit card required • 5 free scripts per day
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const links = {
    Product: ['Features', 'Pricing', 'Templates', 'API'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
    Legal: ['Privacy', 'Terms', 'Security'],
  };

  return (
    <footer className="relative py-16 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Logo column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">ViralScript</span>
            </div>
            <p className="text-sm text-zinc-500">
              AI-powered scripts for viral short-form content.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © 2024 ViralScript. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['TikTok', 'YouTube', 'Twitter'].map((social) => (
              <Link
                key={social}
                href="#"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <span className="sr-only">{social}</span>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">
                  <span className="text-xs">{social[0]}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page
export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-12 h-12 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-purple-500 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-sm text-zinc-500">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <Navbar />
      <FloatingMetrics />
      <HeroSection />
      <ProductShowcase />
      <SocialProof />
      <BentoGrid />
      <CTASection />
      <Footer />
    </main>
  );
}
