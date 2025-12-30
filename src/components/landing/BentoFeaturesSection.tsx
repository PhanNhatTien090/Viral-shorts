'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Video, 
  TrendingUp, 
  Zap, 
  Brain, 
  Target,
  Clock,
  Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
  className?: string;
  size?: 'default' | 'large';
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  gradient, 
  delay = 0,
  className,
  size = 'default'
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'group relative p-6 rounded-2xl',
        'bg-zinc-900/60 border border-zinc-800/80',
        'hover:border-zinc-700/80 hover:bg-zinc-900/80',
        'transition-colors duration-300',
        'backdrop-blur-sm',
        className
      )}
    >
      {/* Hover glow effect */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
        'bg-gradient-to-br blur-xl -z-10',
        gradient
      )} />
      
      {/* Icon */}
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
        'bg-gradient-to-br',
        gradient
      )}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      
      {/* Content */}
      <h3 className={cn(
        'font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors',
        size === 'large' ? 'text-xl' : 'text-lg'
      )}>
        {title}
      </h3>
      <p className={cn(
        'text-zinc-400 leading-relaxed',
        size === 'large' ? 'text-base' : 'text-sm'
      )}>
        {description}
      </p>
    </motion.div>
  );
}

export function BentoFeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-purple-500/10 to-pink-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/60 border border-zinc-700/50 text-sm text-zinc-300 mb-6"
          >
            <Zap className="h-4 w-4 text-yellow-400" />
            <span>Tính năng mạnh mẽ</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Mọi thứ bạn cần để{' '}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              viral
            </span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Công cụ AI được thiết kế riêng cho content creator Việt Nam
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Large card - spans 2 columns on lg */}
          <FeatureCard
            icon={Sparkles}
            title="Viral Hook Engine"
            description="AI được huấn luyện từ 10,000+ video viral để tạo hook khiến người xem dừng lướt ngay lập tức. Tối ưu cho 3 giây đầu tiên."
            gradient="from-pink-500/80 to-rose-500/80"
            delay={0}
            size="large"
            className="lg:col-span-2"
          />
          
          {/* Regular card */}
          <FeatureCard
            icon={Video}
            title="AI Video Prompts"
            description="Prompt tiếng Anh chuẩn cho Kling AI, Runway, Sora. Copy & paste trực tiếp."
            gradient="from-purple-500/80 to-violet-500/80"
            delay={0.1}
          />
          
          {/* Regular card */}
          <FeatureCard
            icon={Brain}
            title="Phân tích tâm lý"
            description="Hiểu vì sao hook này hiệu quả với từng đối tượng khán giả."
            gradient="from-blue-500/80 to-cyan-500/80"
            delay={0.15}
          />
          
          {/* Large card - spans 2 columns on lg */}
          <FeatureCard
            icon={TrendingUp}
            title="Viral Score & Analytics"
            description="Đánh giá tiềm năng viral của mỗi kịch bản với điểm số từ 1-10. Phân tích chi tiết về psychology, audience insight, và framework đang hot."
            gradient="from-green-500/80 to-emerald-500/80"
            delay={0.2}
            size="large"
            className="lg:col-span-2"
          />
          
          {/* Regular cards - bottom row */}
          <FeatureCard
            icon={Target}
            title="Multi-Platform"
            description="Tối ưu riêng cho TikTok, Facebook Reels, YouTube Shorts."
            gradient="from-orange-500/80 to-amber-500/80"
            delay={0.25}
          />
          
          <FeatureCard
            icon={Clock}
            title="Tạo trong 5 giây"
            description="Không cần chờ đợi. AI stream kết quả real-time ngay trước mắt bạn."
            gradient="from-teal-500/80 to-cyan-500/80"
            delay={0.3}
          />
          
          <FeatureCard
            icon={Languages}
            title="100% Tiếng Việt"
            description="Nội dung tự nhiên, không robot. Hiểu context và slang Việt Nam."
            gradient="from-red-500/80 to-pink-500/80"
            delay={0.35}
          />
        </div>
      </div>
    </section>
  );
}
