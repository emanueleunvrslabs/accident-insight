import { useState } from 'react';
import { Search, Menu, X, LayoutDashboard, AlertTriangle, BarChart3, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AddMenu } from './AddMenu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/contexts/SearchContext';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Incidenti', href: '/incidenti', icon: AlertTriangle },
  { label: 'Statistiche', href: '/statistiche', icon: BarChart3 },
  { label: 'Report', href: '/report', icon: FileText },
];

export function FloatingNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-fit">
        <nav className={cn(
          "flex items-center gap-1 px-2.5 py-2.5 rounded-full",
          "bg-[hsl(var(--glass-bg-strong))]",
          "backdrop-blur-[32px] saturate-[200%]",
          "border border-[hsl(var(--glass-border))]",
          "shadow-[inset_0_0.5px_0_0_hsl(var(--glass-highlight)),0_2px_6px_hsl(var(--glass-shadow)),0_8px_24px_hsl(var(--glass-shadow))]",
        )}>
          {/* Search */}
          <div className="relative flex items-center px-3 border-r border-border/30">
            <Search className="absolute left-6 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Cerca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 h-8 pl-8 pr-3 rounded-full bg-muted/30 border-0 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-0.5 px-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 active:scale-95"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-border/30">
            <AddMenu />
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        {/* Mobile Header Bar */}
        <div className={cn(
          "flex items-center justify-between px-4 py-3",
          "bg-[hsl(var(--glass-bg-strong))]",
          "backdrop-blur-[32px] saturate-[200%]",
          "border-b border-[hsl(var(--glass-border))]",
        )}>
          {/* Search */}
          <div className="relative flex-1 max-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Cerca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-muted/30 border-0 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <AddMenu />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={cn(
          "absolute top-full left-0 right-0 overflow-hidden transition-all duration-300 ease-out",
          "bg-[hsl(var(--glass-bg-strong))]",
          "backdrop-blur-[32px] saturate-[200%]",
          "border-b border-[hsl(var(--glass-border))]",
          isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}>
          <div className="p-4 space-y-2">
            {/* Nav Links */}
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 active:scale-[0.98]"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* Divider */}
            <div className="h-px bg-border/30 my-3" />
          </div>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
