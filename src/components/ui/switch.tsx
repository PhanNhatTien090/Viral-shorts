'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export function Switch({ 
  checked, 
  onCheckedChange, 
  disabled = false,
  className,
  id 
}: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex cursor-pointer rounded-full border-2 border-transparent',
        'transition-colors duration-200 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900',
        'disabled:cursor-not-allowed disabled:opacity-50',
        checked 
          ? 'bg-linear-to-r from-pink-500 to-purple-500' 
          : 'bg-zinc-700',
        className
      )}
      style={{ 
        width: '44px', 
        height: '24px', 
        minWidth: '44px',
        maxWidth: '44px',
        minHeight: '24px',
        maxHeight: '24px',
        flexShrink: 0,
        aspectRatio: '44/24'
      }}
    >
      <span
        className={cn(
          'pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0',
          'transition duration-200 ease-in-out'
        )}
        style={{ 
          width: '20px', 
          height: '20px',
          minWidth: '20px',
          minHeight: '20px',
          transform: checked ? 'translateX(20px)' : 'translateX(0)'
        }}
      />
    </button>
  );
}
