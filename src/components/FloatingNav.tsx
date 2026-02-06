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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 px-2 py-2 rounded-full bg-card/95 dark:bg-card/90 border border-border/50 shadow-liquid backdrop-blur-xl">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 pr-6 border-r border-border/50">
          <div className="p-1.5 rounded-lg bg-primary">
            <Scale className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm text-foreground">LexMonitor</span>
        </div>

        {/* Nav Items */}
        <div className="flex items-center gap-1 px-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                item.active
                  ? "bg-primary/10 text-primary dark:bg-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-border/50">
          <ThemeToggle />
          <ManageFeedsDialog />
          <AddArticleDialog />
        </div>
      </nav>
    </div>
  );
}
