'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Loader2, Zap, Settings2, LayoutTemplate, X, Lock, 
  ChevronDown, ChevronUp, Copy, Check, Video, Theater, 
  Briefcase, BookOpen, Play, Users, Wand2, Clock
} from 'lucide-react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MainLayout } from '@/components/layout';
import { ScriptTimeline, ActionBar, GuestUsageBanner } from '@/components/molecules';
import { cn } from '@/lib/utils';
import { viralHooks } from '@/data/viral-hooks';
import { useGuestUsage } from '@/hooks/useGuestUsage';

// CRITICAL: Must match backend schema EXACTLY
const schema = z.object({
  hook: z.string(),
  script: z.string(),
  cta: z.string(),
  visualPrompt: z.string().optional(),
  analysis: z.object({
    hookPsychology: z.string(),
    viralScore: z.number(),
    audienceInsight: z.string(),
    viralFramework: z.string(),
  }).optional(),
});

// 🎬 Collapsible Visual Prompt Card Component
function VisualPromptCard({ visualPrompt }: { visualPrompt: string }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(visualPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-linear-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-xl overflow-hidden"
    >
      {/* Header - Clickable to toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
            <Video className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-left">
            <h3 className="text-sm md:text-base font-semibold text-white">
              Visual Prompt (AI Video)
            </h3>
            <p className="text-xs text-zinc-400">
              Optimized for Kling AI, Runway, Luma
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Copy & Paste
          </span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-zinc-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-zinc-400" />
          )}
        </div>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-4 md:pb-5 space-y-3">
              {/* Copy Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleCopy}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    copied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10'
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Prompt
                    </>
                  )}
                </button>
              </div>
              
              {/* Prompt Content */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs md:text-sm text-zinc-300 leading-relaxed">
                {visualPrompt}
              </div>
              
              {/* Tip */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="text-sm">💡</span>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  Copy the English prompt and paste directly into Kling AI, Runway, or Luma to generate video.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Pill toggle button component
function PillOption({
  value,
  selected,
  children,
  onClick,
  disabled,
}: {
  value: string;
  selected: boolean;
  children: React.ReactNode;
  onClick: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onClick(value)}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2.5 h-10 rounded-full text-sm font-medium transition-all duration-200',
        'border focus:outline-none focus:ring-2 focus:ring-pink-500/50',
        'shrink-0 whitespace-nowrap',
        selected
          ? 'bg-linear-to-r from-pink-500 to-purple-500 text-white border-transparent shadow-lg shadow-pink-500/20'
          : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-zinc-200 hover:border-white/20',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </motion.button>
  );
}

// Loading skeleton for Suspense fallback
function DashboardLoadingSkeleton() {
  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 xl:p-8">
          <div className="w-full lg:w-96 lg:shrink-0 space-y-6">
            <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-4">
              <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
              <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
              <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-12 w-full bg-white/5 rounded-xl animate-pulse" />
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 min-h-100">
              <div className="space-y-4">
                <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
                <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
                <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
                <div className="h-32 bg-white/5 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Main content component that uses useSearchParams
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 🔐 Auth state from Clerk
  const { isSignedIn, isLoaded: isAuthLoaded } = useUser();
  
  // 👻 Guest usage tracking
  const { 
    remainingGenerations, 
    canGenerate: guestCanGenerate, 
    isLimitReached,
    incrementUsage 
  } = useGuestUsage();
  
  // Check for template params on initial render
  const templateId = searchParams.get('template');
  const patternParam = searchParams.get('pattern');
  const initialTemplate = templateId && patternParam ? viralHooks.find(h => h.id === templateId) : null;
  
  const [topic, setTopic] = useState(initialTemplate && patternParam ? decodeURIComponent(patternParam) : '');
  const [vibe, setVibe] = useState('');
  const [platform, setPlatform] = useState('');
  const [duration, setDuration] = useState<'15-30' | '30-60' | '60-90'>('30-60');
  const [includeVisuals, setIncludeVisuals] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(initialTemplate ? templateId : null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // 🎯 Determine if user can generate (signed in = unlimited, guest = limited)
  const canGenerate = isSignedIn || guestCanGenerate;

  // Clear URL params after mounting if template was used
  useEffect(() => {
    if (templateId && patternParam) {
      router.replace('/dashboard', { scroll: false });
    }
  }, [templateId, patternParam, router]);

  const clearTemplate = () => {
    setActiveTemplate(null);
    setTopic('');
  };

  // Health check on component mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        if (data.status === 'healthy') {
          setHealthStatus('healthy');
          console.log('✅ System health check passed');
        } else {
          setHealthStatus('unhealthy');
          console.error('❌ System health check failed:', data.checks);
        }
      } catch (error) {
        setHealthStatus('unhealthy');
        console.error('❌ Health check error:', error);
      }
    }
    
    checkHealth();
  }, []);

  // Use experimental_useObject for streaming structured data
  const { object, submit, isLoading, error } = useObject({
    api: '/generate',
    schema,
    onFinish: ({ object: finalObject, error: finishError }) => {
      if (finishError) {
        console.error('❌ Stream finished with error:', finishError);
      } else {
        console.log('✅ Stream finished successfully:', finalObject);
      }
    },
  });

  // Debug logging
  useEffect(() => {
    if (object) {
      console.log('📦 Stream data received:', object);
    }
  }, [object]);

  useEffect(() => {
    if (error) {
      console.error('Stream error:', error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic?.trim() || !vibe || !platform) {
      alert('Please fill in all required fields!');
      return;
    }

    // 🔐 Check if guest can generate
    if (!isSignedIn && !guestCanGenerate) {
      return; // Button should be disabled, but double-check
    }

    console.log('Submitting:', { topic, vibe, platform, duration, includeVisuals });
    submit({ topic: topic.trim(), vibe, platform, duration, includeVisuals });
    
    // 👻 Increment guest usage counter (only for guests)
    if (!isSignedIn) {
      incrementUsage();
    }
  };

  const handleCopyAll = () => {
    if (object) {
      const visualText = object.visualPrompt 
        ? `\n\n🎬 VISUAL PROMPT:\n\n🎥 Video Generation (Runway/Kling/Sora):\n${object.visualPrompt}`
        : '';
      const fullText = `HOOK:\n${object.hook}\n\nSCRIPT:\n${object.script}\n\nCALL TO ACTION:\n${object.cta}${visualText}`;
      navigator.clipboard.writeText(fullText);
    }
  };

  const handleRegenerate = () => {
    if (topic && vibe && platform) {
      submit({ topic: topic.trim(), vibe, platform, duration, includeVisuals });
    }
  };

  const handleSave = async () => {
    // Don't save if no content or not signed in
    if (!object || !isSignedIn) {
      console.log('Cannot save: no content or not signed in');
      return;
    }

    setSaveStatus('saving');
    setSaveMessage('Saving script...');

    try {
      const response = await fetch('/api/scripts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptData: {
            hook: object.hook,
            script: object.script,
            cta: object.cta,
            visualPrompt: object.visualPrompt || '',
            analysis: object.analysis,
          },
          topic,
          platform,
          vibe,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveStatus('success');
        setSaveMessage('✅ Saved to library!');
        console.log('✅ Script saved:', data);
        
        // Refresh router to update history sidebar
        router.refresh();
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setSaveStatus('idle');
          setSaveMessage('');
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to save');
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      setSaveStatus('error');
      setSaveMessage('❌ Error saving. Please try again.');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    }
  };

  // Convert script to body for timeline + include analysis
  // Pass raw script string - the timeline component will render <br> as HTML
  const scriptData = object?.hook && object?.script && object?.cta
    ? {
        hook: object.hook,
        body: object.script, // Pass as string, not array - timeline will render <br> tags
        cta: object.cta,
        // Only include analysis if all fields are present
        analysis: object.analysis?.hookPsychology && 
                  object.analysis?.viralScore && 
                  object.analysis?.audienceInsight && 
                  object.analysis?.viralFramework
          ? {
              hookPsychology: object.analysis.hookPsychology,
              viralScore: object.analysis.viralScore,
              audienceInsight: object.analysis.audienceInsight,
              viralFramework: object.analysis.viralFramework,
            }
          : undefined,
      }
    : undefined;

  const archetypeOptions = [
    {
      value: 'Storytime',
      label: 'Story Time',
      desc: 'Kể chuyện, Tâm sự, Vlog',
      icon: BookOpen, // Book/Coffee
    },
    {
      value: 'Expert',
      label: 'Chuyên Gia',
      desc: 'Chia sẻ kiến thức, Tips, Giáo dục',
      icon: Briefcase, // Glasses/Brain
    },
    {
      value: 'Savage',
      label: 'Xéo Xắt',
      desc: 'Tranh luận, Quan điểm, Review gắt',
      icon: Zap, // Fire/Lightning
    },
    {
      value: 'Drama',
      label: 'Hóng Biến',
      desc: 'Tin tức, Bóc phốt, Sự kiện hot',
      icon: Theater, // Eye/Mask
    },
  ];

  const platformOptions = [
    { value: 'tiktok', label: 'TikTok', icon: Play },
    { value: 'facebook', label: 'Facebook', icon: Users },
    { value: 'youtube', label: 'YouTube', icon: Play },
  ];

  return (
    <MainLayout>
      {/* Main content area */}
      <div className="min-h-screen">
        {/* 2-Column Layout: Fixed left (400px) + Flex right */}
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 xl:p-8">
          
          {/* Left Column - Input Form (Fixed Width, Sticky) */}
          <div className="w-full lg:w-96 lg:shrink-0 lg:sticky lg:top-20 lg:self-start space-y-6">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <Wand2 className="h-7 w-7 text-pink-400" />
                  Create New Script
                </h1>
                <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                  Enter your topic and let AI generate viral content for you ✨
                </p>
              </div>
              
              {/* Health Status */}
              <div className="flex items-center gap-2 mt-3">
                {healthStatus === 'checking' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-xs text-blue-400">Checking...</span>
                  </div>
                )}
                {healthStatus === 'healthy' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-xs text-green-400">AI Ready</span>
                  </div>
                )}
                {healthStatus === 'unhealthy' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span className="text-xs text-red-400">System Error</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Input Form Card - Glassmorphism */}
            <motion.form 
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl space-y-6">
                {/* Topic Input */}
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-zinc-200 flex items-center gap-2 text-sm font-medium">
                    <Zap className="h-4 w-4 text-pink-400" />
                    Video Topic
                    {activeTemplate && (
                      <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <LayoutTemplate className="h-3 w-3" />
                        From template
                      </span>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      id="topic"
                      name="topic"
                      placeholder="Ex: How to make money online 2024, 5 tips to learn English effectively..."
                      value={topic}
                      onChange={(e) => {
                        setTopic(e.target.value);
                        // Clear template indicator when user types
                        if (activeTemplate && e.target.value !== topic) {
                          setActiveTemplate(null);
                        }
                      }}
                      disabled={isLoading}
                      className={cn(
                        "h-12 bg-black/20 border-white/10 text-zinc-100 placeholder:text-zinc-600",
                        "focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20",
                        "transition-all leading-relaxed rounded-xl",
                        activeTemplate && "border-purple-500/50 pr-10"
                      )}
                      required
                    />
                    {activeTemplate && (
                      <button
                        type="button"
                        onClick={clearTemplate}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {activeTemplate && (
                    <p className="text-xs text-purple-300">
                      💡 Replace [placeholders] with your content
                    </p>
                  )}
                </div>

                {/* Vibe Pills */}
                <div className="space-y-3">
                  <Label className="text-zinc-200 text-sm font-medium">Script Archetype</Label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-visible md:pb-0">
                    {archetypeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <PillOption
                          key={option.value}
                          value={option.value}
                          selected={vibe === option.value}
                          onClick={setVibe}
                          disabled={isLoading}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="font-semibold">{option.label}</span>
                          <span className="text-xs text-zinc-400 ml-1">{option.desc}</span>
                        </PillOption>
                      );
                    })}
                  </div>
                </div>

                {/* Platform Pills */}
                <div className="space-y-3">
                  <Label className="text-zinc-200 text-sm font-medium">Platform</Label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-visible md:pb-0">
                    {platformOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <PillOption
                          key={option.value}
                          value={option.value}
                          selected={platform === option.value}
                          onClick={setPlatform}
                          disabled={isLoading}
                        >
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </PillOption>
                      );
                    })}
                  </div>
                </div>

                {/* 🎬 Visual Prompt Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0 border border-purple-500/20">
                      <Video className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-200">Generate Video Prompt</p>
                      <p className="text-xs text-zinc-500 truncate">For Runway/Kling/Sora</p>
                    </div>
                  </div>
                  <Switch 
                    checked={includeVisuals} 
                    onCheckedChange={setIncludeVisuals}
                    disabled={isLoading}
                    className="shrink-0"
                    style={{ width: '44px', minWidth: '44px', height: '24px' }}
                  />
                </div>

                {/* Advanced Settings Toggle */}
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <Settings2 className="h-4 w-4" />
                  {showAdvanced ? 'Hide advanced settings' : 'Advanced settings'}
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-4">
                        {/* Video Duration Selector */}
                        <div className="space-y-2">
                          <Label htmlFor="duration" className="text-zinc-400 text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Video Duration
                          </Label>
                          <Select 
                            value={duration} 
                            onValueChange={(val) => setDuration(val as '15-30' | '30-60' | '60-90')}
                          >
                            <SelectTrigger className="w-full bg-black/20 border-white/10 text-white rounded-xl">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-white/10 rounded-xl">
                              <SelectItem value="15-30">15-30 seconds</SelectItem>
                              <SelectItem value="30-60">30-60 seconds</SelectItem>
                              <SelectItem value="60-90">60-90 seconds</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                    >
                      <p className="text-red-400 text-sm">
                        ⚠️ Error: {error?.message || 'Something went wrong. Please try again.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button - with guest limit handling */}
                {!isSignedIn && isLimitReached ? (
                  // 🔒 Guest limit reached - show sign-in CTA
                  <SignInButton mode="modal">
                    <Button
                      type="button"
                      className={cn(
                        'w-full h-12 text-base font-semibold transition-all duration-300 rounded-xl',
                        'bg-linear-to-r from-pink-500 to-purple-500',
                        'hover:from-pink-600 hover:to-purple-600',
                        'shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30'
                      )}
                    >
                      <Lock className="mr-2 h-5 w-5" />
                      Sign in to continue creating
                    </Button>
                  </SignInButton>
                ) : (
                  // ✅ Normal submit button
                  <Button
                    type="submit"
                    disabled={isLoading || !topic || !vibe || !platform || !canGenerate}
                    className={cn(
                      'w-full h-12 text-base font-semibold transition-all duration-300 rounded-xl',
                      'bg-linear-to-r from-pink-500 to-purple-500',
                      'hover:from-pink-600 hover:to-purple-600',
                      'shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30',
                      'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating script...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate Script
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.form>

            {/* Tips Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-zinc-900/30 border border-white/5"
            >
              <p className="text-xs text-zinc-400 leading-relaxed">
                💡 <strong className="text-zinc-300">Pro tip:</strong> The more specific your topic, 
                the better the script. Try adding unique angles or specific data points 
                to make your content more compelling!
              </p>
            </motion.div>
            
            {/* 👻 Guest Usage Banner - only show for signed out users */}
            {isAuthLoaded && !isSignedIn && (
              <GuestUsageBanner
                remainingGenerations={remainingGenerations}
                isLimitReached={isLimitReached}
              />
            )}
          </div>

          {/* Right Column - Output Area (Fills remaining space) */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Toast Notification */}
            <AnimatePresence>
              {saveMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, y: -20, x: 20 }}
                  className={cn(
                    'fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-lg backdrop-blur-xl',
                    'flex items-center gap-2',
                    saveStatus === 'success' && 'bg-green-500/20 border border-green-500/30 text-green-400',
                    saveStatus === 'error' && 'bg-red-500/20 border border-red-500/30 text-red-400',
                    saveStatus === 'saving' && 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                  )}
                >
                  {saveStatus === 'saving' && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saveStatus === 'success' && <Check className="h-4 w-4" />}
                  {saveStatus === 'error' && <X className="h-4 w-4" />}
                  <span className="text-sm font-medium">{saveMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Action Bar */}
            <ActionBar
              hasContent={!!scriptData}
              isGenerating={isLoading}
              isSignedIn={!!isSignedIn}
              isSaving={saveStatus === 'saving'}
              onCopyAll={handleCopyAll}
              onRegenerate={handleRegenerate}
              onSave={handleSave}
            />

            {/* Timeline Results - Glassmorphism Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl"
            >
              <ScriptTimeline
                data={scriptData}
                isLoading={isLoading}
              />
            </motion.div>

            {/* 🎬 Visual Prompts Section - Enhanced for AI Tools */}
            {object?.visualPrompt && !isLoading && (
              <VisualPromptCard visualPrompt={object.visualPrompt} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Wrap in Suspense for useSearchParams
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
