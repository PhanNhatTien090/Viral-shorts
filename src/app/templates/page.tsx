'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  viralHooks, 
  categoryLabels, 
  hookCategories, 
  type HookCategory,
  type ViralHook 
} from '@/data/viral-hooks';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Brain,
  LayoutTemplate,
  Filter,
  BookOpen,
  DollarSign,
  Smile,
  BookMarked,
  Zap
} from 'lucide-react';

// Icon mapping for categories
const categoryIcons: Record<HookCategory, React.ElementType> = {
  education: BookOpen,
  sales: DollarSign,
  funny: Smile,
  storytelling: BookMarked,
  motivation: Zap,
};

// Template Card Component
function TemplateCard({ hook, onUse }: { hook: ViralHook; onUse: (hook: ViralHook) => void }) {
  const category = categoryLabels[hook.category];
  
  return (
    <div className={cn(
      'group relative flex flex-col h-full p-5 rounded-2xl',
      'bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm',
      'hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/5',
      'transition-all duration-300'
    )}>
      {/* Viral Potential Badge */}
      <div className="absolute -top-2 -right-2">
        <div className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold',
          hook.viralPotential >= 9 
            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
        )}>
          <Flame className="h-3 w-3" />
          {hook.viralPotential}/10
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        {(() => {
          const Icon = categoryIcons[hook.category];
          return (
            <span className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
              category.color
            )}>
              <Icon className="h-3 w-3" />
              {category.label}
            </span>
          );
        })()}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-1">
        {hook.titleVi}
      </h3>
      <p className="text-xs text-zinc-500 mb-4">
        {hook.title}
      </p>

      {/* Pattern - The Template */}
      <div className="flex-1 mb-4">
        <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800">
          <p className="text-sm text-zinc-200 leading-relaxed">
            {hook.patternVi.split(/(\[.*?\])/).map((part, i) => {
              if (part.startsWith('[') && part.endsWith(']')) {
                return (
                  <span key={i} className="text-pink-400 font-semibold bg-pink-500/10 px-1 rounded">
                    {part}
                  </span>
                );
              }
              return part;
            })}
          </p>
        </div>
      </div>

      {/* Example */}
      <div className="mb-4">
        <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
          <Brain className="h-3 w-3" />
          Ví dụ thực tế:
        </p>
        <p className="text-sm text-zinc-400 italic leading-relaxed">
          &ldquo;{hook.exampleVi}&rdquo;
        </p>
      </div>

      {/* Psychology Insight */}
      <div className="mb-4 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
        <p className="text-xs text-purple-300">
          💡 {hook.psychology}
        </p>
      </div>

      {/* Action Button */}
      <Button
        onClick={() => onUse(hook)}
        className={cn(
          'w-full mt-auto',
          'bg-linear-to-r from-pink-500 to-purple-500',
          'hover:from-pink-600 hover:to-purple-600',
          'shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30',
          'transition-all duration-300'
        )}
      >
        Sử dụng mẫu này
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

// Filter Tab Component
function FilterTab({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2.5 h-10 rounded-full text-sm font-medium transition-all duration-200',
        'border focus:outline-none focus:ring-2 focus:ring-pink-500/50',
        'shrink-0 whitespace-nowrap',
        active
          ? 'bg-linear-to-r from-pink-500 to-purple-500 text-white border-transparent shadow-lg shadow-pink-500/20'
          : 'bg-zinc-900/50 text-zinc-400 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200'
      )}
    >
      {children}
    </button>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<HookCategory | 'all'>('all');

  // Filter hooks based on selected category
  const filteredHooks = activeCategory === 'all'
    ? viralHooks
    : viralHooks.filter(hook => hook.category === activeCategory);

  // Handle using a template
  const handleUseTemplate = (hook: ViralHook) => {
    // Redirect to dashboard page with template query param
    const encodedPattern = encodeURIComponent(hook.patternVi);
    router.push(`/dashboard?template=${hook.id}&pattern=${encodedPattern}`);
  };

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-linear-to-br from-pink-500/20 to-purple-500/20">
                <LayoutTemplate className="h-6 w-6 text-pink-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Kho Mẫu Viral Hooks
              </h1>
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-2xl">
              Bộ sưu tập các công thức hook đã được chứng minh hiệu quả. 
              Chọn một mẫu và bắt đầu tạo nội dung viral ngay lập tức! 🚀
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 mb-6 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-400" />
              <span className="text-sm text-zinc-300">
                <strong className="text-white">{viralHooks.length}</strong> mẫu hook
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" />
              <span className="text-sm text-zinc-300">
                <strong className="text-white">{viralHooks.filter(h => h.viralPotential >= 9).length}</strong> mẫu viral cao
              </span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 text-zinc-500 shrink-0" />
            <FilterTab 
              active={activeCategory === 'all'} 
              onClick={() => setActiveCategory('all')}
            >
              Tất cả
            </FilterTab>
            {hookCategories.map(cat => {
              const info = categoryLabels[cat];
              const Icon = categoryIcons[cat];
              return (
                <FilterTab
                  key={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                >
                  <Icon className="h-4 w-4" />
                  {info.label}
                </FilterTab>
              );
            })}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHooks.map(hook => (
              <TemplateCard 
                key={hook.id} 
                hook={hook} 
                onUse={handleUseTemplate}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredHooks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                <LayoutTemplate className="h-8 w-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-medium text-zinc-400 mb-2">
                Không tìm thấy mẫu nào
              </h3>
              <p className="text-sm text-zinc-500">
                Thử chọn danh mục khác
              </p>
            </div>
          )}

          {/* Pro Tip */}
          <div className="mt-8 p-4 rounded-xl bg-linear-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <p className="text-sm text-zinc-300 leading-relaxed">
              💡 <strong className="text-purple-300">Pro tip:</strong> Các mẫu với điểm viral 9/10 
              thường tạo ra nhiều comment tranh cãi - đây là yếu tố giúp thuật toán đẩy video của bạn!
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
