'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  PlusCircle, 
  FolderOpen, 
  LayoutTemplate, 
  Settings,
  LogIn,
  ChevronLeft,
  ChevronRight,
  Gem,
  Bell,
  Search
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, SignInButton, useUser } from '@clerk/nextjs';

interface MainLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: PlusCircle, label: 'Create Script', href: '/dashboard', description: 'Generate new content' },
  { icon: FolderOpen, label: 'My Library', href: '/library', description: 'Saved scripts' },
  { icon: LayoutTemplate, label: 'Templates', href: '/templates', description: 'Viral formulas' },
  { icon: Settings, label: 'Settings', href: '/settings', description: 'App preferences' },
];

// Sidebar content component - reused for both desktop and mobile
function SidebarContent({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="block"
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive 
                      ? 'bg-gradient-to-r from-pink-500/15 to-purple-500/15 text-white' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-purple-500"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <item.icon className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive ? 'text-pink-400' : 'text-zinc-500'
                  )} />
                  {!collapsed && (
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{item.label}</span>
                    </div>
                  )}
                  
                  {/* Glow effect for active */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-pink-500/10 blur-xl -z-10" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="mt-auto border-t border-white/5 p-4">
        <SignedIn>
          <div className={cn(
            'flex items-center gap-3',
            collapsed ? 'justify-center' : ''
          )}>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'h-9 w-9 ring-2 ring-pink-500/20',
                }
              }}
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate">Account</p>
                <p className="text-xs text-zinc-500 truncate">Signed in</p>
              </div>
            )}
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button 
              variant="outline" 
              className={cn(
                'w-full gap-2 border-pink-500/30 text-pink-400 hover:bg-pink-500/10 hover:text-pink-300',
                'bg-pink-500/5 backdrop-blur-sm',
                collapsed && 'px-2'
              )}
            >
              <LogIn className="h-4 w-4" />
              {!collapsed && <span>Sign In</span>}
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}

// Dashboard Header with credits and user info
function DashboardHeader() {
  const { user, isSignedIn } = useUser();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 px-4 lg:px-6 py-3 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between max-w-full">
        {/* Left side - Search (optional) */}
        <div className="hidden sm:flex items-center gap-3 flex-1">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search scripts..."
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/50 transition-all"
            />
          </div>
        </div>

        {/* Right side - Credits & User */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Credits Badge */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20"
          >
            <Gem className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">5 credits</span>
          </motion.div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9 text-zinc-400 hover:text-white hover:bg-white/5">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full" />
          </Button>

          {/* User Avatar (mobile) */}
          <SignedIn>
            <div className="sm:hidden">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </motion.header>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full" />
      </div>
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MOBILE HEADER - Only visible on mobile */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo */}
          <Logo size="sm" href="/dashboard" />

          {/* Mobile Menu Trigger - Using Sheet */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 hover:text-zinc-100 hover:bg-white/5">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-zinc-950/95 backdrop-blur-xl border-white/10">
              <SheetHeader className="p-4 border-b border-white/5">
                <SheetTitle>
                  <Logo size="sm" href="/dashboard" asLink={false} />
                </SheetTitle>
              </SheetHeader>
              <SidebarContent onNavigate={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DESKTOP SIDEBAR - Glassmorphism floating style */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <aside 
        className={cn(
          'hidden md:flex fixed left-0 top-0 z-40 h-screen flex-col',
          'bg-zinc-900/40 backdrop-blur-xl border-r border-white/5 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Sidebar Header with Logo */}
        <div className="flex items-center justify-between p-4 h-14 border-b border-white/5">
          <Logo 
            size="md" 
            href="/dashboard" 
            iconOnly={collapsed} 
            showTagline={!collapsed}
          />
          
          {/* Collapse Toggle */}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              onClick={() => setCollapsed(true)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="mx-auto mt-2 h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            onClick={() => setCollapsed(false)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        <SidebarContent collapsed={collapsed} />
      </aside>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT AREA */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div 
        className={cn(
          'relative min-h-screen transition-all duration-300',
          // Mobile: add top padding for header
          'pt-14 md:pt-0',
          // Desktop: add left margin for sidebar
          collapsed ? 'md:ml-16' : 'md:ml-64'
        )}
      >
        <DashboardHeader />
        <main className="relative">
          {children}
        </main>
      </div>
    </div>
  );
}
