'use client';

import { useState } from 'react';
import { Copy, Check, Clapperboard, Image, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export interface GeneratedResultProps {
  hook?: string;
  script?: string;
  cta?: string;
  visualPrompt?: string;
  isLoading?: boolean;
}

export function GeneratedResult({
  hook,
  script,
  cta,
  visualPrompt,
  isLoading = false,
}: GeneratedResultProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = async (text: string, section: string) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Skeleton Loading State
  if (isLoading || (!hook && !script && !cta && !visualPrompt)) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <Skeleton className="h-8 w-48 bg-zinc-800" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full bg-zinc-800" />
            <Skeleton className="h-32 w-full bg-zinc-800" />
            <Skeleton className="h-20 w-full bg-zinc-800" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format script text with bullet points (handle both \n and actual newlines)
  const formatScript = (text: string) => {
    return text.split(/\\n|\n/).map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      
      // Remove existing numbering like "1.", "2." etc.
      const cleaned = trimmed.replace(/^\d+\.\s*/, '');
      
      return (
        <div key={idx} className="flex gap-3 mb-3 group">
          <span className="text-purple-400 font-bold text-lg shrink-0 mt-0.5">•</span>
          <p className="text-zinc-300 leading-relaxed">{cleaned}</p>
        </div>
      );
    });
  };

  const CopyButton = ({ text, section }: { text?: string; section: string }) => {
    const isCopied = copiedSection === section;
    
    return (
      <Button
        size="sm"
        variant="ghost"
        onClick={() => text && handleCopy(text, section)}
        disabled={!text}
        className="text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
      >
        {isCopied ? (
          <>
            <Check className="h-4 w-4 mr-2 text-green-400" />
            <span className="text-green-400">Đã sao chép!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            Sao chép
          </>
        )}
      </Button>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Tabs defaultValue="video" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800 p-1">
          <TabsTrigger
            value="video"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Clapperboard className="h-4 w-4 mr-2" />
            Kịch bản Video
          </TabsTrigger>
          <TabsTrigger
            value="visual"
            className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
          >
            <Image className="h-4 w-4 mr-2" />
            Visual Prompts
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Video Script */}
        <TabsContent value="video" className="space-y-6 mt-6">
          {/* Hook Card - Large, Gradient Border */}
          {hook && (
            <Card className="relative overflow-hidden bg-zinc-900 border-0 shadow-xl">
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-linear-to-r from-purple-500 via-pink-500 to-red-500 opacity-100" />
              <div className="absolute inset-[2px] bg-zinc-900 rounded-lg" />
              
              <div className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <span className="text-4xl">🎯</span>
                      <span className="bg-linear-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                        HOOK - Câu mở đầu sốc
                      </span>
                    </CardTitle>
                    <CopyButton text={hook} section="hook" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                    <p className="text-2xl md:text-3xl font-bold leading-relaxed text-white">
                      "{hook}"
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          )}

          {/* Script Card */}
          {script && (
            <Card className="bg-zinc-900 border-zinc-800 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-pink-400">
                    <span className="text-2xl">📝</span>
                    Kịch bản chi tiết
                  </CardTitle>
                  <CopyButton text={script} section="script" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-base">
                  {formatScript(script)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* CTA Card */}
          {cta && (
            <Card className="bg-zinc-900 border-zinc-800 hover:border-green-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <span className="text-2xl">🚀</span>
                    Call to Action
                  </CardTitle>
                  <CopyButton text={cta} section="cta" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-lg font-medium text-zinc-200 leading-relaxed">
                    {cta}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Visual Prompts */}
        <TabsContent value="visual" className="space-y-6 mt-6">
          {visualPrompt ? (
            <Card className="bg-zinc-900 border-zinc-800 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Sparkles className="h-6 w-6" />
                    Visual Prompt for AI Video Generation
                  </CardTitle>
                  <CopyButton text={visualPrompt} section="visualPrompt" />
                </div>
                <p className="text-sm text-zinc-500 mt-2">
                  Dùng prompt này cho Midjourney, Runway, Sora, hoặc bất kỳ AI video tool nào
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300" />
                  <div className="relative bg-zinc-950 rounded-lg p-6 border border-zinc-700">
                    <pre className="text-sm md:text-base leading-relaxed text-zinc-300 font-mono whitespace-pre-wrap break-words">
                      {visualPrompt}
                    </pre>
                  </div>
                </div>

                {/* Usage Tips */}
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                    💡 Cách sử dụng
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                      <p className="text-xs text-zinc-400">
                        <strong className="text-blue-400">Midjourney:</strong> Copy prompt + thêm "--ar 9:16 --v 6"
                      </p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                      <p className="text-xs text-zinc-400">
                        <strong className="text-purple-400">Runway Gen-3:</strong> Paste trực tiếp vào text prompt
                      </p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                      <p className="text-xs text-zinc-400">
                        <strong className="text-pink-400">Sora (OpenAI):</strong> Dùng nguyên prompt này
                      </p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                      <p className="text-xs text-zinc-400">
                        <strong className="text-green-400">Pika Labs:</strong> Chỉnh độ dài video ở settings
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="py-12 text-center">
                <Image className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
                <p className="text-zinc-500">
                  Chưa có visual prompt. Tạo kịch bản để nhận prompt AI video!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Copy All Button */}
      {(hook || script || cta || visualPrompt) && (
        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            onClick={() => {
              const fullText = `
🎯 HOOK
${hook || 'N/A'}

📝 KỊCH BẢN
${script || 'N/A'}

🚀 CALL TO ACTION
${cta || 'N/A'}

🎬 VISUAL PROMPT
${visualPrompt || 'N/A'}
              `.trim();
              handleCopy(fullText, 'all');
            }}
            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg"
          >
            {copiedSection === 'all' ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Đã sao chép toàn bộ!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-5 w-5" />
                Sao chép toàn bộ
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
