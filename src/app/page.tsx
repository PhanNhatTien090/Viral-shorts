'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, Loader2, Zap, Settings2, LayoutTemplate, X, Lock } from 'lucide-react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sidebar, MainLayout } from '@/components/layout';
import { ScriptTimeline, ActionBar, GuestUsageBanner } from '@/components/molecules';
import { cn } from '@/lib/utils';
import { viralHooks } from '@/data/viral-hooks';
import { useGuestUsage } from '@/hooks/useGuestUsage';

// CRITICAL: Must match backend schema EXACTLY
// 🧠 Advanced Schema with Viral Analysis (analysis is optional for graceful degradation)
const schema = z.object({
  hook: z.string(),
  script: z.string(),
  cta: z.string(),
  visualPrompt: z.string(),
  analysis: z.object({
    hookPsychology: z.string(),
    viralScore: z.number(),
    audienceInsight: z.string(),
    viralFramework: z.string(),
  }).optional(),
});

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
    <button
      type="button"
      onClick={() => onClick(value)}
      disabled={disabled}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
        'border focus:outline-none focus:ring-2 focus:ring-pink-500/50',
        selected
          ? 'bg-linear-to-r from-pink-500 to-purple-500 text-white border-transparent shadow-lg shadow-pink-500/20'
          : 'bg-zinc-900/50 text-zinc-400 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}

// Loading skeleton for Suspense fallback
function HomeLoadingSkeleton() {
  return (
    <MainLayout>
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="lg:ml-64 min-h-screen transition-all duration-300 ease-in-out">
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 xl:p-8">
          <div className="w-full lg:w-96 lg:shrink-0 space-y-6">
            <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="h-12 bg-zinc-800 rounded animate-pulse" />
              <div className="h-12 bg-zinc-800 rounded animate-pulse" />
              <div className="h-12 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}

// Main content component that uses useSearchParams
function HomeContent() {
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
      router.replace('/', { scroll: false });
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
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // 🔐 Check if guest can generate
    if (!isSignedIn && !guestCanGenerate) {
      return; // Button should be disabled, but double-check
    }

    console.log('Submitting:', { topic, vibe, platform });
    submit({ topic: topic.trim(), vibe, platform });
    
    // 👻 Increment guest usage counter (only for guests)
    if (!isSignedIn) {
      incrementUsage();
    }
  };

  const handleCopyAll = () => {
    if (object) {
      const fullText = `HOOK:\n${object.hook}\n\nNỘI DUNG:\n${object.script}\n\nKÊU GỌI HÀNH ĐỘNG:\n${object.cta}\n\nGỢI Ý HÌNH ẢNH:\n${object.visualPrompt}`;
      navigator.clipboard.writeText(fullText);
    }
  };

  const handleRegenerate = () => {
    if (topic && vibe && platform) {
      submit({ topic: topic.trim(), vibe, platform });
    }
  };

  const handleSave = async () => {
    // Don't save if no content or not signed in
    if (!object || !isSignedIn) {
      console.log('Cannot save: no content or not signed in');
      return;
    }

    setSaveStatus('saving');
    setSaveMessage('');

    try {
      const response = await fetch('/api/scripts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptData: {
            hook: object.hook,
            script: object.script,
            cta: object.cta,
            visualPrompt: object.visualPrompt,
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
        setSaveMessage('Đã lưu vào thư viện!');
        console.log('✅ Script saved:', data);
        
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
      setSaveMessage('Lỗi khi lưu. Vui lòng thử lại.');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    }
  };

  // Convert script to body array for timeline + include analysis
  const scriptData = object?.hook && object?.script && object?.cta
    ? {
        hook: object.hook,
        body: object.script.split('\n').filter((line: string) => line.trim()),
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

  const vibeOptions = [
    { value: 'humorous', label: '🤣 Hài hước' },
    { value: 'drama', label: '🎭 Drama' },
    { value: 'expert', label: '👔 Chuyên gia' },
    { value: 'storytelling', label: '📖 Kể chuyện' },
  ];

  const platformOptions = [
    { value: 'tiktok', label: '📱 TikTok' },
    { value: 'facebook', label: '👥 Facebook' },
    { value: 'youtube', label: '▶️ YouTube' },
  ];

  return (
    <MainLayout>
      {/* Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Main content area - properly positioned next to sidebar */}
      <main className="lg:ml-64 min-h-screen transition-all duration-300 ease-in-out">
        {/* 2-Column Layout: Fixed left (400px) + Flex right */}
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 xl:p-8">
          
          {/* Left Column - Input Form (Fixed Width, Sticky) */}
          <div className="w-full lg:w-96 lg:shrink-0 lg:sticky lg:top-6 lg:self-start space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Tạo Kịch Bản Mới
                </h1>
                <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                  Nhập chủ đề và để AI tạo nội dung viral cho bạn ✨
                </p>
              </div>
              
              {/* Health Status */}
              <div className="flex items-center gap-2 mt-3">
                {healthStatus === 'checking' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-xs text-blue-400">Đang kiểm tra...</span>
                  </div>
                )}
                {healthStatus === 'healthy' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-xs text-green-400">AI sẵn sàng</span>
                  </div>
                )}
                {healthStatus === 'unhealthy' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span className="text-xs text-red-400">Lỗi hệ thống</span>
                  </div>
                )}
              </div>
            </div>

            {/* Input Form Card */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm space-y-6">
                {/* Topic Input */}
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-zinc-200 flex items-center gap-2 text-sm font-medium">
                    <Zap className="h-4 w-4 text-pink-400" />
                    Chủ đề Video
                    {activeTemplate && (
                      <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <LayoutTemplate className="h-3 w-3" />
                        Từ mẫu
                      </span>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      id="topic"
                      name="topic"
                      placeholder="VD: Bí quyết kiếm tiền online 2024, 5 tips học tiếng Anh hiệu quả..."
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
                        "h-12 bg-zinc-950 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-pink-500/50 focus:ring-pink-500/20 leading-relaxed",
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
                      💡 Thay thế các [placeholder] bằng nội dung của bạn
                    </p>
                  )}
              </div>

                {/* Vibe Pills */}
                <div className="space-y-3">
                  <Label className="text-zinc-200 text-sm font-medium">Phong cách</Label>
                <div className="flex flex-wrap gap-2">
                  {vibeOptions.map((option) => (
                    <PillOption
                      key={option.value}
                      value={option.value}
                      selected={vibe === option.value}
                      onClick={setVibe}
                      disabled={isLoading}
                    >
                      {option.label}
                    </PillOption>
                  ))}
                </div>
              </div>

                {/* Platform Pills */}
                <div className="space-y-3">
                  <Label className="text-zinc-200 text-sm font-medium">Nền tảng</Label>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map((option) => (
                    <PillOption
                      key={option.value}
                      value={option.value}
                      selected={platform === option.value}
                      onClick={setPlatform}
                      disabled={isLoading}
                    >
                      {option.label}
                    </PillOption>
                  ))}
                </div>
              </div>

              {/* Advanced Settings Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <Settings2 className="h-4 w-4" />
                {showAdvanced ? 'Ẩn cài đặt nâng cao' : 'Cài đặt nâng cao'}
              </button>

              {showAdvanced && (
                <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-zinc-400 text-sm">
                      Độ dài video
                    </Label>
                    <Select defaultValue="short">
                      <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        <SelectItem value="short">15-30 giây</SelectItem>
                        <SelectItem value="medium">30-60 giây</SelectItem>
                        <SelectItem value="long">60-90 giây</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm">
                    ⚠️ Lỗi: {error?.message || 'Có lỗi xảy ra. Vui lòng thử lại.'}
                  </p>
                </div>
              )}

              {/* Submit Button - with guest limit handling */}
              {!isSignedIn && isLimitReached ? (
                // 🔒 Guest limit reached - show sign-in CTA
                <SignInButton mode="modal">
                  <Button
                    type="button"
                    className={cn(
                      'w-full h-12 text-base font-semibold transition-all duration-300',
                      'bg-linear-to-r from-pink-500 to-purple-500',
                      'hover:from-pink-600 hover:to-purple-600',
                      'shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30'
                    )}
                  >
                    <Lock className="mr-2 h-5 w-5" />
                    Đăng nhập để tiếp tục tạo
                  </Button>
                </SignInButton>
              ) : (
                // ✅ Normal submit button
                <Button
                  type="submit"
                  disabled={isLoading || !topic || !vibe || !platform || !canGenerate}
                  className={cn(
                    'w-full h-12 text-base font-semibold transition-all duration-300',
                    'bg-linear-to-r from-pink-500 to-purple-500',
                    'hover:from-pink-600 hover:to-purple-600',
                    'shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang tạo kịch bản...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Tạo Kịch Bản
                    </>
                  )}
                </Button>
              )}
              </div>
            </form>

            {/* Tips Section */}
            <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
              <p className="text-xs text-zinc-400 leading-relaxed">
                💡 <strong className="text-zinc-300">Pro tip:</strong> Chủ đề càng cụ thể, 
                kịch bản càng chất lượng. Thử thêm góc nhìn độc đáo hoặc số liệu cụ thể để 
                tăng tính thuyết phục!
              </p>
            </div>
            
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
            {saveMessage && (
              <div className={cn(
                'fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg transition-all duration-300',
                'flex items-center gap-2',
                saveStatus === 'success' && 'bg-green-500/20 border border-green-500/30 text-green-400',
                saveStatus === 'error' && 'bg-red-500/20 border border-red-500/30 text-red-400',
                saveStatus === 'saving' && 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
              )}>
                {saveStatus === 'saving' && <Loader2 className="h-4 w-4 animate-spin" />}
                {saveStatus === 'success' && <span>✅</span>}
                {saveStatus === 'error' && <span>❌</span>}
                <span className="text-sm font-medium">{saveMessage}</span>
              </div>
            )}
            
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

            {/* Timeline Results */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm">
              <ScriptTimeline
                data={scriptData}
                isLoading={isLoading}
              />
            </div>

            {/* Visual Prompt Card (if available) */}
            {object?.visualPrompt && !isLoading && (
              <div className="p-6 rounded-2xl bg-linear-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 shrink-0">
                    <span className="text-lg">🎬</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-purple-300 mb-2">
                      Gợi ý hình ảnh & B-roll
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {object.visualPrompt}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </MainLayout>
  );
}

// Wrap in Suspense for useSearchParams
export default function Home() {
  return (
    <Suspense fallback={<HomeLoadingSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
