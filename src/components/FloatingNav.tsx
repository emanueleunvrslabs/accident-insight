import { useState } from 'react';
import { Search, Menu, X, AlertTriangle, BarChart3, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AddMenu } from './AddMenu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/contexts/SearchContext';

interface NavItem {
  label: string;
  href: string;
  icon: typeof AlertTriangle;
}

const navItems: NavItem[] = [
  { label: 'Incidenti', href: '/', icon: AlertTriangle },
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
        <nav 
          className="flex items-center gap-1 px-2.5 py-2.5 rounded-full"
          style={{
            background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.04) 100%)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid hsl(0 0% 100% / 0.12)',
            boxShadow: '0 8px 32px hsl(220 30% 5% / 0.3), inset 0 1px 0 0 hsl(0 0% 100% / 0.1)'
          }}
        >
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
        <div 
          className="flex items-center justify-between px-4 py-3"
          style={{
            background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.06) 0%, hsl(0 0% 100% / 0.03) 100%)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            borderBottom: '1px solid hsl(0 0% 100% / 0.1)'
          }}
        >
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
        <div 
          className={cn(
            "absolute top-full left-0 right-0 overflow-hidden transition-all duration-300 ease-out",
            isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          )}
          style={{
            background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.06) 0%, hsl(0 0% 100% / 0.03) 100%)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            borderBottom: '1px solid hsl(0 0% 100% / 0.1)'
          }}
        >
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
