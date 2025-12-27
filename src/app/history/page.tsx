'use client';

import { useState, useEffect } from 'react';
import { Sidebar, MainLayout } from '@/components/layout';
import { History, Clock, Calendar, Zap, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Script } from '@/lib/db/schema';

// Script Card Component
function ScriptCard({ script }: { script: Script }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    const fullText = `HOOK:\n${script.hook}\n\nNỘI DUNG:\n${script.script}\n\nKÊU GỌI HÀNH ĐỘNG:\n${script.cta}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formattedDate = new Date(script.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate">
            {script.title}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
            {script.platform && (
              <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                {script.platform}
              </span>
            )}
            {script.viralScore && (
              <span className="flex items-center gap-1 text-yellow-400">
                <Zap className="h-3 w-3" />
                {script.viralScore}/10
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            'p-2 rounded-lg transition-colors shrink-0',
            copied
              ? 'bg-green-500/20 text-green-400'
              : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      
      {/* Hook Preview */}
      <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
        <p className="text-sm text-pink-400 font-medium line-clamp-2">
          &quot;{script.hook}&quot;
        </p>
      </div>
      
      {/* Script Preview */}
      <p className="mt-3 text-sm text-zinc-400 line-clamp-2">
        {script.script}
      </p>
    </div>
  );
}

// Loading Skeleton
function ScriptCardSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="h-5 w-3/4 bg-zinc-800 rounded" />
          <div className="h-3 w-1/2 bg-zinc-800 rounded mt-2" />
        </div>
        <div className="h-8 w-8 bg-zinc-800 rounded-lg" />
      </div>
      <div className="h-16 bg-zinc-800/50 rounded-lg" />
      <div className="h-4 w-full bg-zinc-800 rounded mt-3" />
    </div>
  );
}

export default function HistoryPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch scripts on mount
  useEffect(() => {
    async function fetchScripts() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/scripts/get');
        const data = await response.json();

        if (response.ok) {
          setScripts(data.scripts || []);
        } else {
          throw new Error(data.error || 'Failed to fetch scripts');
        }
      } catch (err) {
        console.error('Error fetching scripts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load scripts');
      } finally {
        setIsLoading(false);
      }
    }

    fetchScripts();
  }, []);

  return (
    <MainLayout>
      {/* Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Main content area */}
      <main className="lg:ml-64 min-h-screen transition-all duration-300 ease-in-out">
        <div className="p-4 lg:p-6 xl:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <History className="h-8 w-8 text-blue-400" />
                Lịch Sử Tạo Kịch Bản
              </h1>
              <p className="text-sm text-zinc-400 mt-2">
                Xem lại các kịch bản bạn đã lưu. Tổng cộng: {scripts.length} kịch bản
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                <ScriptCardSkeleton />
                <ScriptCardSkeleton />
                <ScriptCardSkeleton />
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-red-400">❌ {error}</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && scripts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
                <div className="p-4 rounded-full bg-blue-500/10 mb-4">
                  <Clock className="h-10 w-10 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Chưa có lịch sử
                </h2>
                <p className="text-zinc-400 text-center max-w-md">
                  Bạn chưa lưu kịch bản nào. Tạo kịch bản mới và nhấn &quot;Lưu&quot; để thêm vào lịch sử.
                </p>
              </div>
            )}

            {/* Scripts List */}
            {!isLoading && !error && scripts.length > 0 && (
              <div className="space-y-4">
                {scripts.map((script) => (
                  <ScriptCard key={script.id} script={script} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
