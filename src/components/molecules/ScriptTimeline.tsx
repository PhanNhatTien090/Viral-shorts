'use client';

import { TimelineCard } from './TimelineCard';
import { ThumbsUp, ThumbsDown, Flame, Brain, Users, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnalysisData {
  hookPsychology: string;
  viralScore: number;
  audienceInsight: string;
  viralFramework: string;
}

interface ScriptData {
  hook: string;
  body: string | string[];
  cta: string;
  analysis?: AnalysisData;
}

interface ScriptTimelineProps {
  data?: ScriptData;
  isLoading?: boolean;
  className?: string;
}

export function ScriptTimeline({ data, isLoading = false, className }: ScriptTimelineProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <div className={cn('relative', className)}>
        {/* Shimmer Skeleton Loading State */}
        <div className="space-y-4">
          {/* Hook Skeleton */}
          <div className="relative flex gap-2 sm:gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-pink-500/30 to-purple-500/30 animate-pulse" />
              <div className="w-0.5 flex-1 min-h-8 bg-zinc-700/50" />
            </div>
            <div className="flex-1 pb-6 min-w-0">
              <div className="h-6 w-20 bg-zinc-800 rounded-full mb-3 animate-pulse" />
              <div className="p-3 sm:p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden relative">
                <div className="h-5 w-3/4 bg-zinc-800 rounded mb-2 animate-pulse" />
                <div className="h-4 w-1/2 bg-zinc-800/50 rounded animate-pulse" />
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-zinc-700/20 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
          
          {/* Body Skeleton */}
          <div className="relative flex gap-2 sm:gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-0.5 h-4 bg-zinc-700/50" />
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-800 animate-pulse" />
              <div className="w-0.5 flex-1 min-h-8 bg-zinc-700/50" />
            </div>
            <div className="flex-1 pb-6 min-w-0">
              <div className="h-6 w-24 bg-zinc-800 rounded-full mb-3 animate-pulse" />
              <div className="p-3 sm:p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden relative">
                <div className="space-y-3">
                  <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-zinc-800/50 rounded animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-zinc-700/20 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
          
          {/* CTA Skeleton */}
          <div className="relative flex gap-2 sm:gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-0.5 h-4 bg-zinc-700/50" />
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-purple-500/30 to-blue-500/30 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-6 w-32 bg-zinc-800 rounded-full mb-3 animate-pulse" />
              <div className="p-3 sm:p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden relative">
                <div className="h-5 w-2/3 bg-zinc-800 rounded animate-pulse" />
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-zinc-700/20 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500 animate-pulse">
            ✨ Đang tạo kịch bản viral cho bạn...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center px-4">
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-linear-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-linear-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center animate-pulse">
              <span className="text-4xl md:text-5xl">🎬</span>
            </div>
          </div>
          {/* Floating sparkles */}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center animate-bounce">
            <span className="text-lg">✨</span>
          </div>
          <div className="absolute -bottom-1 -left-3 w-6 h-6 rounded-full bg-pink-500/30 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.2s' }}>
            <span className="text-sm">⚡</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
          Chưa có kịch bản nào
        </h3>
        
        {/* Description */}
        <p className="text-sm md:text-base text-zinc-400 max-w-sm leading-relaxed mb-6">
          Điền thông tin bên {typeof window !== 'undefined' && window.innerWidth < 768 ? 'trên' : 'trái'} và nhấn 
          <span className="text-pink-400 font-medium"> &ldquo;Tạo Kịch Bản&rdquo; </span> 
          để AI bắt đầu viết nội dung viral cho bạn!
        </p>
        
        {/* Animated dots */}
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce" />
          <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
        
        {/* Tips */}
        <div className="mt-8 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 max-w-sm">
          <p className="text-xs md:text-sm text-zinc-500 leading-relaxed">
            💡 <strong className="text-zinc-400">Mẹo:</strong> Chủ đề càng cụ thể, kịch bản càng chất lượng. 
            Thử thêm góc nhìn độc đáo hoặc số liệu cụ thể!
          </p>
        </div>
      </div>
    );
  }

  // For clipboard copy, convert <br> to newlines
  const bodyText = Array.isArray(data.body) 
    ? data.body.join('\n\n') 
    : data.body.replace(/<br\s*\/?>/gi, '\n');

  return (
    <div className={cn('relative', className)}>
      {/* 🔥 Viral Score Badge - Floating */}
      {data.analysis?.viralScore && (
        <div className="absolute -top-2 right-0 z-10">
          <div className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
            'bg-linear-to-r shadow-lg',
            data.analysis.viralScore >= 8 
              ? 'from-orange-500 to-red-500 shadow-orange-500/30' 
              : data.analysis.viralScore >= 6 
              ? 'from-yellow-500 to-orange-500 shadow-yellow-500/30'
              : 'from-zinc-600 to-zinc-500 shadow-zinc-500/20'
          )}>
            <Flame className="h-4 w-4 text-white" />
            <span className="text-sm font-bold text-white">
              {data.analysis.viralScore}/10
            </span>
          </div>
        </div>
      )}

      {/* Gradient glow effect behind cards */}
      <div className="absolute top-0 left-8 w-1 h-full bg-linear-to-b from-pink-500/20 via-purple-500/10 to-transparent pointer-events-none blur-lg" />

      {/* Hook Card */}
      <TimelineCard
        timeLabel="0-3s"
        titleLabel="HOOK"
        variant="hook"
        isFirst
        onCopy={() => copyToClipboard(data.hook)}
      >
        <p className="font-medium">{data.hook}</p>
        
        {/* 🧠 Hook Psychology Tooltip - Why this works */}
        {data.analysis?.hookPsychology && (
          <div className="mt-3 pt-3 border-t border-red-500/20">
            <div className="flex items-start gap-2">
              <Brain className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-yellow-400">Tại sao hook này hiệu quả?</span>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  {data.analysis.hookPsychology}
                </p>
              </div>
            </div>
          </div>
        )}
      </TimelineCard>

      {/* Body Card */}
      <TimelineCard
        timeLabel="3-20s"
        titleLabel="NỘI DUNG"
        variant="body"
        onCopy={() => copyToClipboard(bodyText)}
      >
        {Array.isArray(data.body) ? (
          <ul className="space-y-2">
            {data.body.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-pink-400 font-bold mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p dangerouslySetInnerHTML={{ __html: data.body.replace(/<br\s*\/?>/gi, '<br />') }} />
        )}
      </TimelineCard>

      {/* CTA Card */}
      <TimelineCard
        timeLabel="End"
        titleLabel="KÊU GỌI HÀNH ĐỘNG"
        variant="cta"
        isLast
        onCopy={() => copyToClipboard(data.cta)}
      >
        <p className="font-medium">{data.cta}</p>
      </TimelineCard>

      {/* 📊 Viral Analysis Panel */}
      {data.analysis && (
        <div className="mt-6 p-4 rounded-xl bg-linear-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-purple-400" />
            <h4 className="text-sm font-semibold text-purple-300">Phân Tích Viral</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Audience Insight */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 shrink-0">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <span className="text-xs font-medium text-zinc-500">Đối tượng mục tiêu</span>
                <p className="text-sm text-zinc-200 mt-0.5">{data.analysis.audienceInsight}</p>
              </div>
            </div>
            
            {/* Viral Framework */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-pink-500/20 shrink-0">
                <Brain className="h-4 w-4 text-pink-400" />
              </div>
              <div>
                <span className="text-xs font-medium text-zinc-500">Kỹ thuật Viral</span>
                <p className="text-sm text-zinc-200 mt-0.5">{data.analysis.viralFramework}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Section */}
      <div className="mt-6 pt-4 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-500">Đánh giá kịch bản này:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-9 px-3 transition-all duration-200',
                feedback === 'up'
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'text-zinc-500 hover:text-green-400 hover:bg-green-500/10'
              )}
              onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Hay
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-9 px-3 transition-all duration-200',
                feedback === 'down'
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10'
              )}
              onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Chưa ổn
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
