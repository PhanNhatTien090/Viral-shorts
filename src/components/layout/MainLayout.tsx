'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  PlusCircle, 
  FolderOpen, 
  LayoutTemplate, 
  Settings, 
  Clapperboard, 
  Sparkles, 
  LogIn,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
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
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';

interface MainLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: PlusCircle, label: 'Tạo Kịch Bản', href: '/dashboard', description: 'Tạo nội dung mới' },
  { icon: FolderOpen, label: 'Thư Viện', href: '/library', description: 'Kịch bản đã lưu' },
  { icon: LayoutTemplate, label: 'Mẫu Viral', href: '/templates', description: 'Công thức viral' },
  { icon: Settings, label: 'Cài Đặt', href: '/settings', description: 'Tùy chỉnh ứng dụng' },
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
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  'hover:bg-zinc-800/60',
                  isActive 
                    ? 'bg-linear-to-r from-pink-500/15 to-purple-500/15 text-white border border-pink-500/30' 
                    : 'text-zinc-400 hover:text-zinc-100'
                )}
              >
                <item.icon className={cn(
                  'h-5 w-5 shrink-0 transition-colors',
                  isActive ? 'text-pink-500' : 'text-zinc-500'
                )} />
                {!collapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{item.label}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="mt-auto border-t border-zinc-800/50 p-4">
        <SignedIn>
          <div className={cn(
            'flex items-center gap-3',
            collapsed ? 'justify-center' : ''
          )}>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'h-9 w-9',
                }
              }}
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate">Tài khoản</p>
                <p className="text-xs text-zinc-500 truncate">Đã đăng nhập</p>
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
                collapsed && 'px-2'
              )}
            >
              <LogIn className="h-4 w-4" />
              {!collapsed && <span>Đăng nhập</span>}
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MOBILE HEADER - Only visible on mobile */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/50">
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative shrink-0">
              <Clapperboard className="h-6 w-6 text-pink-500" />
              <Sparkles className="absolute -top-1 -right-1 h-2.5 w-2.5 text-purple-400" />
            </div>
            <span className="font-bold text-base bg-linear-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Viral Short
            </span>
          </Link>

          {/* Mobile Menu Trigger - Using Sheet */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 hover:text-zinc-100">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-zinc-950 border-zinc-800">
              <SheetHeader className="p-4 border-b border-zinc-800/50">
                <SheetTitle className="flex items-center gap-2">
                  <div className="relative shrink-0">
                    <Clapperboard className="h-6 w-6 text-pink-500" />
                    <Sparkles className="absolute -top-1 -right-1 h-2.5 w-2.5 text-purple-400" />
                  </div>
                  <span className="font-bold bg-linear-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Viral Short
                  </span>
                </SheetTitle>
              </SheetHeader>
              <SidebarContent onNavigate={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DESKTOP SIDEBAR - Only visible on desktop */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <aside 
        className={cn(
          'hidden md:flex fixed left-0 top-0 z-40 h-screen flex-col',
          'bg-zinc-900/50 border-r border-zinc-800/50 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Sidebar Header with Logo */}
        <div className="flex items-center justify-between p-4 h-14 border-b border-zinc-800/50">
          <Link href="/" className={cn(
            'flex items-center gap-2 overflow-hidden',
            collapsed && 'justify-center w-full'
          )}>
            <div className="relative shrink-0">
              <Clapperboard className="h-7 w-7 text-pink-500" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-purple-400" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm bg-linear-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Viral Short
                </span>
                <span className="text-[10px] text-zinc-500">Architect</span>
              </div>
            )}
          </Link>
          
          {/* Collapse Toggle */}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-300"
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
            className="mx-auto mt-2 h-7 w-7 text-zinc-500 hover:text-zinc-300"
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
      <main 
        className={cn(
          'min-h-screen transition-all duration-300',
          // Mobile: add top padding for header
          'pt-14 md:pt-0',
          // Desktop: add left margin for sidebar
          collapsed ? 'md:ml-16' : 'md:ml-64'
        )}
      >
        {children}
      </main>
    </div>
  );
}
