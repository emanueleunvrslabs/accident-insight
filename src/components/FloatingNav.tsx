import { Scale } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ManageFeedsDialog } from './feeds/ManageFeedsDialog';
import { AddArticleDialog } from './incidents/AddArticleDialog';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '#', active: true },
  { label: 'Incidenti', href: '#' },
  { label: 'Statistiche', href: '#' },
  { label: 'Report', href: '#' },
];

export function FloatingNav() {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-fit">
      <nav className={cn(
        "flex items-center gap-1 px-2.5 py-2.5 rounded-full",
        // Liquid Glass styling
        "bg-[hsl(var(--glass-bg-strong))]",
        "backdrop-blur-[32px] saturate-[200%]",
        "border border-[hsl(var(--glass-border))]",
        "shadow-[inset_0_0.5px_0_0_hsl(var(--glass-highlight)),0_2px_6px_hsl(var(--glass-shadow)),0_8px_24px_hsl(var(--glass-shadow))]",
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 pr-5 border-r border-border/30">
          <div className="p-2 rounded-xl bg-primary shadow-sm">
            <Scale className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm text-foreground hidden sm:block">LexMonitor</span>
        </div>

        {/* Nav Items */}
        <div className="flex items-center gap-0.5 px-1.5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                item.active
                  ? "bg-primary/10 text-primary dark:bg-primary/20 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 active:scale-95"
              )}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-border/30">
          <ThemeToggle />
          <ManageFeedsDialog />
          <AddArticleDialog />
        </div>
      </nav>
    </div>
  );
}
