'use client';

import { Button } from '@/components/ui/button';
import { Copy, RefreshCw, Save, Check, LogIn, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SignInButton } from '@clerk/nextjs';

interface ActionBarProps {
  onCopyAll?: () => void;
  onRegenerate?: () => void;
  onSave?: () => void;
  isGenerating?: boolean;
  hasContent?: boolean;
  isSignedIn?: boolean;
  isSaving?: boolean; // New prop for save loading state
  className?: string;
}

export function ActionBar({
  onCopyAll,
  onRegenerate,
  onSave,
  isGenerating = false,
  hasContent = false,
  isSignedIn = false,
  isSaving = false,
  className,
}: ActionBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    onCopyAll?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!isSignedIn || isSaving) {
      return;
    }
    onSave?.();
  };

  if (!hasContent) return null;

  // Save button content - shared between signed in and signed out states
  const saveButtonContent = isSaving ? (
    <>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Đang lưu...
    </>
  ) : (
    <>
      {isSignedIn ? <Save className="h-4 w-4 mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
      {isSignedIn ? 'Lưu' : 'Đăng nhập để lưu'}
    </>
  );

  return (
    <div
      className={cn(
        'sticky top-4 z-20 p-3 rounded-xl',
        'bg-zinc-900/80 backdrop-blur-md border border-zinc-800',
        'shadow-lg shadow-black/20',
        className
      )}
    >
      {/* Flex container: Left label, Right buttons */}
      <div className="flex items-center justify-between gap-4">
        {/* Left section - Status indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-zinc-400 whitespace-nowrap">Kịch bản đã tạo</span>
        </div>

        {/* Right section - Action buttons in horizontal row */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Copy All */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyAll}
            className={cn(
              'h-9 px-3 transition-all duration-200 whitespace-nowrap',
              copied
                ? 'bg-green-500/20 text-green-400'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            )}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Đã copy
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </>
            )}
          </Button>

          {/* Regenerate */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="h-9 px-3 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 whitespace-nowrap"
          >
            <RefreshCw
              className={cn('h-4 w-4 mr-2', isGenerating && 'animate-spin')}
            />
            Tạo lại
          </Button>

          {/* Save to Library - with auth gate */}
          {isSignedIn ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                'h-9 px-3 transition-all duration-200 whitespace-nowrap',
                isSaving
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}
            >
              {saveButtonContent}
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-9 px-3 transition-all duration-200 whitespace-nowrap',
                  'text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 border border-pink-500/30'
                )}
              >
                {saveButtonContent}
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
}
