'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useUser,
} from '@clerk/nextjs';
import {
  Sparkles,
  FolderOpen,
  LayoutTemplate,
  Settings,
  History,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface HistoryItem {
  id: number;
  title: string;
  createdAt: string;
}

interface SidebarProps {
  onNewScript?: () => void;
  className?: string;
}

const navItems = [
  { icon: PlusCircle, label: 'New Script', href: '/' },
  { icon: FolderOpen, label: 'My Library', href: '/library' },
  { icon: LayoutTemplate, label: 'Templates', href: '/templates' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar({ onNewScript, className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  // 🔄 Fetch history when user is signed in
  useEffect(() => {
    async function fetchHistory() {
      if (!isSignedIn) {
        setHistoryItems([]);
        return;
      }
      
      try {
        const response = await fetch('/api/scripts/get', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          // Take only first 10 for sidebar
          const items = (data.scripts || []).slice(0, 10).map((s: { id: number; title: string; createdAt: string }) => ({
            id: s.id,
            title: s.title,
            createdAt: s.createdAt,
          }));
          setHistoryItems(items);
          console.log('📚 [SIDEBAR] Loaded', items.length, 'history items');
        }
      } catch (error) {
        console.error('❌ [SIDEBAR] Failed to fetch history:', error);
      }
    }

    fetchHistory();
  }, [isSignedIn, pathname]); // Refetch when pathname changes (after save)

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-zinc-950 border-r border-zinc-800/50',
        'overflow-hidden',
        className
      )}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <div className="relative shrink-0">
              <Clapperboard className="h-8 w-8 text-pink-500" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-purple-400" />
            </div>
            {!collapsed && (
              <div className="flex flex-col whitespace-nowrap overflow-hidden">
                <span className="font-bold text-sm bg-linear-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Viral Short
                </span>
                <span className="text-[10px] text-zinc-500 -mt-1">Architect</span>
              </div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-500 hover:text-zinc-300"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={item.label === 'New Script' ? onNewScript : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-linear-to-r from-pink-500/20 to-purple-500/20 text-white border border-pink-500/30'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    )}
                  >
                    <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-pink-500')} />
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                </li>
              );
            })}
          </ul>

          {/* History Section */}
          {!collapsed && (
            <div className="mt-6">
              <Link 
                href="/history"
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-300 transition-colors"
              >
                <History className="h-4 w-4" />
                <span>History</span>
              </Link>
              <ScrollArea className="h-[calc(100vh-380px)]">
                <ul className="space-y-1 mt-2">
                  {!isSignedIn ? (
                    <li className="px-3 py-2 text-xs text-zinc-600 italic">
                      Sign in to see history
                    </li>
                  ) : historyItems.length === 0 ? (
                    <li className="px-3 py-2 text-xs text-zinc-600 italic">
                      No recent scripts
                    </li>
                  ) : (
                    historyItems.map((item) => (
                      <li key={item.id}>
                        <Link 
                          href="/history"
                          className="block w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors truncate"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </ScrollArea>
            </div>
          )}
        </nav>

        {/* Footer - User Avatar / Sign In */}
        <div className="p-4 border-t border-zinc-800/50">
          {/* Signed In: Show UserButton with avatar */}
          <SignedIn>
            <div className={cn(
              'flex items-center gap-3',
              collapsed ? 'justify-center' : 'px-2'
            )}>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                    userButtonPopoverCard: 'bg-zinc-900 border-zinc-800',
                    userButtonPopoverActionButton: 'text-zinc-300 hover:bg-zinc-800',
                    userButtonPopoverActionButtonText: 'text-zinc-300',
                    userButtonPopoverFooter: 'hidden',
                  }
                }}
              />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Account</p>
                  <p className="text-xs text-zinc-500 truncate">Free Plan</p>
                </div>
              )}
            </div>
          </SignedIn>
          
          {/* Signed Out: Show Sign In button */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className={cn(
                'flex items-center gap-3 w-full rounded-lg transition-colors',
                'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
                collapsed ? 'justify-center p-2' : 'px-3 py-2'
              )}>
                <LogIn className="h-5 w-5 shrink-0 text-pink-400" />
                {!collapsed && (
                  <span className="text-sm font-medium">Sign In</span>
                )}
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </motion.aside>
  );
}
