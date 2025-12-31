'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Library, Lock, Loader2, Calendar, Zap, Copy, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Script } from '@/lib/db/schema';

// Script Card Component with delete option
function ScriptCard({ script, onDelete }: { script: Script; onDelete?: (id: number) => void }) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleCopy = () => {
    const fullText = `HOOK:\n${script.hook}\n\nSCRIPT:\n${script.script}\n\nCALL TO ACTION:\n${script.cta}\n\nVISUAL PROMPT:\n${script.visualPrompt || 'N/A'}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this script?')) return;
    setIsDeleting(true);
    // TODO: Implement delete API
    onDelete?.(script.id);
  };
  
  const formattedDate = new Date(script.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/30 transition-colors group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2">
            {script.title}
          </h3>
          <div className="flex items-center gap-1.5 sm:gap-2 mt-2 text-xs text-zinc-500 flex-wrap">
            <span className="flex items-center gap-1 shrink-0">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
            {script.platform && (
              <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 shrink-0">
                {script.platform}
              </span>
            )}
            {script.vibe && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 shrink-0">
                {script.vibe}
              </span>
            )}
            {script.viralScore && (
              <span className="flex items-center gap-1 text-yellow-400 shrink-0">
                <Zap className="h-3 w-3" />
                {script.viralScore}/10
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopy}
            className={cn(
              'p-2 rounded-lg transition-colors',
              copied
                ? 'bg-green-500/20 text-green-400'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            )}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      {/* Hook Preview */}
      <div className="p-3 rounded-lg bg-linear-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
        <p className="text-xs sm:text-sm text-pink-400 font-medium line-clamp-3 sm:line-clamp-2 break-words">
          &quot;{script.hook}&quot;
        </p>
      </div>
      
      {/* Script Preview */}
      <p className="mt-3 text-xs sm:text-sm text-zinc-400 line-clamp-3 break-words">
        {script.script}
      </p>
      
      {/* CTA */}
      <p className="mt-2 text-xs text-purple-400 italic">
        📢 {script.cta}
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
      <div className="h-3 w-2/3 bg-zinc-800 rounded mt-2" />
    </div>
  );
}

export default function LibraryPage() {
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

  const handleDelete = (id: number) => {
    // Optimistically remove from UI
    setScripts((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="p-4 lg:p-6 xl:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <Library className="h-8 w-8 text-purple-400" />
                Script Library
              </h1>
              <p className="text-sm text-zinc-400 mt-2">
                All your saved scripts. Total: {scripts.length} scripts
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid gap-4">
                <ScriptCardSkeleton />
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
                <div className="p-4 rounded-full bg-purple-500/10 mb-4">
                  <Lock className="h-10 w-10 text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Library is empty
                </h2>
                <p className="text-zinc-400 text-center max-w-md">
                  You haven&apos;t saved any scripts yet. Create a new script and click &quot;Save&quot; to add it to your library.
                </p>
              </div>
            )}

            {/* Scripts Grid */}
            {!isLoading && !error && scripts.length > 0 && (
              <div className="grid gap-4">
                {scripts.map((script) => (
                  <ScriptCard 
                    key={script.id} 
                    script={script} 
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
