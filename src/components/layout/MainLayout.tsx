'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Mobile menu button - hamburger icon */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 bg-zinc-900/80 backdrop-blur border border-zinc-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-zinc-300" />
          ) : (
            <Menu className="h-5 w-5 text-zinc-300" />
          )}
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {children}
    </div>
  );
}
