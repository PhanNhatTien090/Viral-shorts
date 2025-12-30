'use client';

import { motion } from 'framer-motion';
import { SignUpButton } from '@clerk/nextjs';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
      />
      
      {/* Animated Gradient Background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-br from-pink-500/25 via-purple-500/20 to-blue-500/25 blur-[120px] rounded-full"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/25"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Sẵn sàng để{' '}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              bùng nổ
            </span>
            {' '}kênh của bạn?
          </h2>
          
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Tham gia cùng hàng trăm creator đang sử dụng AI để tạo nội dung viral mỗi ngày. 
            Bắt đầu miễn phí ngay hôm nay.
          </p>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <SignUpButton mode="modal">
              <Button 
                size="lg" 
                className={cn(
                  "h-14 px-10 text-lg font-semibold group",
                  "bg-gradient-to-r from-pink-500 to-purple-500",
                  "hover:from-pink-600 hover:to-purple-600",
                  "shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50",
                  "transition-all duration-300 hover:scale-105"
                )}
              >
                Bắt đầu ngay — Miễn phí
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignUpButton>
          </motion.div>

          {/* Trust text */}
          <p className="text-sm text-zinc-500">
            Không cần thẻ tín dụng • Tạo 3 kịch bản miễn phí mỗi ngày
          </p>
        </motion.div>
      </div>
    </section>
  );
}
