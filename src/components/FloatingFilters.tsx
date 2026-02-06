import { useState } from 'react';
import { Calendar, ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { IncidentFilters, AccidentType } from '@/types/incident';
import { ITALIAN_REGIONS, ACCIDENT_TYPE_LABELS } from '@/types/incident';

interface FloatingFiltersProps {
  filters: IncidentFilters;
  onFiltersChange: (filters: IncidentFilters) => void;
}

export function FloatingFilters({ filters, onFiltersChange }: FloatingFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    filters.dateFrom ? new Date(filters.dateFrom) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    filters.dateTo ? new Date(filters.dateTo) : undefined
  );

  const activeFiltersCount = [
    filters.region,
    filters.accidentType,
    filters.minFatalities,
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  const handleRegionChange = (value: string) => {
    onFiltersChange({ ...filters, region: value === 'all' ? undefined : value });
  };

  const handleAccidentTypeChange = (value: string) => {
    onFiltersChange({ ...filters, accidentType: value === 'all' ? undefined : value as AccidentType });
  };

  const handleMinFatalitiesChange = (value: string) => {
    onFiltersChange({ ...filters, minFatalities: value === 'all' ? undefined : parseInt(value) });
  };

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    onFiltersChange({ ...filters, dateFrom: date ? format(date, 'yyyy-MM-dd') : undefined });
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    onFiltersChange({ ...filters, dateTo: date ? format(date, 'yyyy-MM-dd') : undefined });
  };

  const clearAllFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    onFiltersChange({ searchQuery: filters.searchQuery });
  };

  return (
    <>
      {/* Desktop Floating Filters */}
      <div className="hidden md:flex justify-center w-full pt-2">
        <nav className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-full",
          "bg-[hsl(var(--glass-bg-strong))]",
          "backdrop-blur-[32px] saturate-[200%]",
          "border border-[hsl(var(--glass-border))]",
          "shadow-[inset_0_0.5px_0_0_hsl(var(--glass-highlight)),0_2px_6px_hsl(var(--glass-shadow)),0_8px_24px_hsl(var(--glass-shadow))]",
        )}>
          <div className="flex items-center gap-1.5 px-2 text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-xs font-medium">Filtri</span>
          </div>

          <div className="h-5 w-px bg-border/30" />

          {/* Region filter */}
          <Select value={filters.region || 'all'} onValueChange={handleRegionChange}>
            <SelectTrigger className="h-8 w-[140px] rounded-full border-0 bg-muted/30 text-xs">
              <SelectValue placeholder="Regione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-popover border border-border">
              <SelectItem value="all">Tutte le regioni</SelectItem>
              {ITALIAN_REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Accident type filter */}
          <Select value={filters.accidentType || 'all'} onValueChange={handleAccidentTypeChange}>
            <SelectTrigger className="h-8 w-[130px] rounded-full border-0 bg-muted/30 text-xs">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-popover border border-border">
              <SelectItem value="all">Tutti i tipi</SelectItem>
              {Object.entries(ACCIDENT_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Min fatalities filter */}
          <Select value={filters.minFatalities?.toString() || 'all'} onValueChange={handleMinFatalitiesChange}>
            <SelectTrigger className="h-8 w-[110px] rounded-full border-0 bg-muted/30 text-xs">
              <SelectValue placeholder="Decessi" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-popover border border-border">
              <SelectItem value="all">Qualsiasi</SelectItem>
              <SelectItem value="1">≥ 1 decesso</SelectItem>
              <SelectItem value="2">≥ 2 decessi</SelectItem>
              <SelectItem value="3">≥ 3 decessi</SelectItem>
            </SelectContent>
          </Select>

          <div className="h-5 w-px bg-border/30" />

          {/* Date from picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full bg-muted/30 text-xs gap-2">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {dateFrom ? format(dateFrom, 'dd/MM/yy') : 'Dal'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
              <CalendarComponent
                mode="single"
                selected={dateFrom}
                onSelect={handleDateFromChange}
                locale={it}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Date to picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full bg-muted/30 text-xs gap-2">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {dateTo ? format(dateTo, 'dd/MM/yy') : 'Al'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
              <CalendarComponent
                mode="single"
                selected={dateTo}
                onSelect={handleDateToChange}
                locale={it}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Clear filters */}
          {activeFiltersCount > 0 && (
            <>
              <div className="h-5 w-px bg-border/30" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters} 
                className="h-8 px-3 rounded-full text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1"
              >
                <X className="h-3.5 w-3.5" />
                Cancella ({activeFiltersCount})
              </Button>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Floating Filters */}
      <div className="md:hidden w-full">
        <div className={cn(
          "rounded-2xl overflow-hidden",
          "bg-[hsl(var(--glass-bg-strong))]",
          "backdrop-blur-[32px] saturate-[200%]",
          "border border-[hsl(var(--glass-border))]",
          "shadow-[0_2px_6px_hsl(var(--glass-shadow)),0_8px_24px_hsl(var(--glass-shadow))]",
        )}>
          {/* Toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              Filtri
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="h-5 px-1.5 text-[10px] rounded-full">
                  {activeFiltersCount}
                </Badge>
              )}
            </span>
            <ChevronDown className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </button>

          {/* Expandable content */}
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className="px-4 pb-4 space-y-3">
              <div className="h-px bg-border/30" />
              
              {/* Region filter */}
              <Select value={filters.region || 'all'} onValueChange={handleRegionChange}>
                <SelectTrigger className="w-full h-10 rounded-xl border-0 bg-muted/30">
                  <SelectValue placeholder="Regione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-popover border border-border">
                  <SelectItem value="all">Tutte le regioni</SelectItem>
                  {ITALIAN_REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Accident type filter */}
              <Select value={filters.accidentType || 'all'} onValueChange={handleAccidentTypeChange}>
                <SelectTrigger className="w-full h-10 rounded-xl border-0 bg-muted/30">
                  <SelectValue placeholder="Tipo incidente" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-popover border border-border">
                  <SelectItem value="all">Tutti i tipi</SelectItem>
                  {Object.entries(ACCIDENT_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Min fatalities filter */}
              <Select value={filters.minFatalities?.toString() || 'all'} onValueChange={handleMinFatalitiesChange}>
                <SelectTrigger className="w-full h-10 rounded-xl border-0 bg-muted/30">
                  <SelectValue placeholder="Decessi" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-popover border border-border">
                  <SelectItem value="all">Qualsiasi</SelectItem>
                  <SelectItem value="1">≥ 1 decesso</SelectItem>
                  <SelectItem value="2">≥ 2 decessi</SelectItem>
                  <SelectItem value="3">≥ 3 decessi</SelectItem>
                </SelectContent>
              </Select>

              {/* Date pickers */}
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="w-full h-10 justify-start rounded-xl bg-muted/30 text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      {dateFrom ? format(dateFrom, 'dd/MM/yy') : 'Dal'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateFrom}
                      onSelect={handleDateFromChange}
                      locale={it}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="w-full h-10 justify-start rounded-xl bg-muted/30 text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      {dateTo ? format(dateTo, 'dd/MM/yy') : 'Al'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="end">
                    <CalendarComponent
                      mode="single"
                      selected={dateTo}
                      onSelect={handleDateToChange}
                      locale={it}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Clear filters */}
              {activeFiltersCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters} 
                  className="w-full h-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancella filtri ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
