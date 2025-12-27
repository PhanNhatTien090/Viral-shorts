'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, PlusCircle, FolderOpen, LayoutTemplate, Settings, History, Clapperboard, Sparkles, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';

interface MainLayoutProps {
  children: ReactNode;
}

const mobileNavItems = [
  { icon: PlusCircle, label: 'Tạo Kịch Bản', href: '/' },
  { icon: History, label: 'Lịch Sử', href: '/history' },
  { icon: FolderOpen, label: 'Thư Viện', href: '/library' },
  { icon: LayoutTemplate, label: 'Mẫu Viral', href: '/templates' },
  { icon: Settings, label: 'Cài Đặt', href: '/settings' },
];

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/50 flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative shrink-0">
            <Clapperboard className="h-6 w-6 text-pink-500" />
            <Sparkles className="absolute -top-1 -right-1 h-2.5 w-2.5 text-purple-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm bg-linear-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Viral Short
            </span>
          </div>
        </Link>

        {/* Hamburger Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-zinc-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-over Drawer */}
      <div
        className={cn(
          'lg:hidden fixed top-0 right-0 z-50 h-full w-72 bg-zinc-950 border-l border-zinc-800',
          'transform transition-transform duration-300 ease-in-out',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <span className="text-lg font-semibold text-white">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-zinc-400"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200',
                      isActive
                        ? 'bg-linear-to-r from-pink-500/20 to-purple-500/20 text-white border border-pink-500/30'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    )}
                  >
                    <item.icon className={cn('h-5 w-5', isActive && 'text-pink-500')} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
          <SignedIn>
            <div className="flex items-center gap-3 px-2">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'h-10 w-10',
                  }
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Tài khoản</p>
                <p className="text-xs text-zinc-500 truncate">Đã đăng nhập</p>
              </div>
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors">
                <LogIn className="h-5 w-5 text-pink-400" />
                <span className="text-base font-medium">Đăng nhập</span>
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>

      {/* Add padding top for mobile header */}
      <div className="lg:pt-0 pt-14">
        {children}
      </div>
    </div>
  );
}
