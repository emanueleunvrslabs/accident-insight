import { useState } from 'react';
import { Search, X, Calendar, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { IncidentFilters, AccidentType } from '@/types/incident';
import { ITALIAN_REGIONS, ACCIDENT_TYPE_LABELS } from '@/types/incident';

interface IncidentFiltersProps {
  filters: IncidentFilters;
  onFiltersChange: (filters: IncidentFilters) => void;
}

export function IncidentFiltersBar({ filters, onFiltersChange }: IncidentFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    filters.dateFrom ? new Date(filters.dateFrom) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    filters.dateTo ? new Date(filters.dateTo) : undefined
  );

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value || undefined });
  };

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
    onFiltersChange({});
  };

  return (
    <div className="space-y-3 sm:space-y-4">

      {/* Mobile: Collapsible filters */}
      <div className="sm:hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="glass" 
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtri
                {activeFiltersCount > 0 && (
                  <Badge variant="glass-primary" size="sm" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3">
            {/* Region filter */}
            <Select value={filters.region || 'all'} onValueChange={handleRegionChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Regione" />
              </SelectTrigger>
              <SelectContent>
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tipo incidente" />
              </SelectTrigger>
              <SelectContent>
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Decessi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Qualsiasi</SelectItem>
                <SelectItem value="1">≥ 1 decesso</SelectItem>
                <SelectItem value="2">≥ 2 decessi</SelectItem>
                <SelectItem value="3">≥ 3 decessi</SelectItem>
              </SelectContent>
            </Select>

            {/* Date pickers in row */}
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="glass" className="w-full justify-start text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    {dateFrom ? format(dateFrom, 'dd/MM/yy') : 'Dal'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
                  <Button variant="glass" className="w-full justify-start text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    {dateTo ? format(dateTo, 'dd/MM/yy') : 'Al'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
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
                variant="glass-destructive" 
                size="sm" 
                onClick={clearAllFilters} 
                className="w-full"
              >
                <X className="h-4 w-4 mr-1" />
                Cancella filtri ({activeFiltersCount})
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop: Filters row */}
      <div className="hidden sm:flex flex-wrap items-center gap-2">
        {/* Region filter */}
        <Select value={filters.region || 'all'} onValueChange={handleRegionChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Regione" />
          </SelectTrigger>
          <SelectContent>
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo incidente" />
          </SelectTrigger>
          <SelectContent>
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
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Decessi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Qualsiasi</SelectItem>
            <SelectItem value="1">≥ 1 decesso</SelectItem>
            <SelectItem value="2">≥ 2 decessi</SelectItem>
            <SelectItem value="3">≥ 3 decessi</SelectItem>
          </SelectContent>
        </Select>

        {/* Date from picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="glass" className="w-[140px] justify-start">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              {dateFrom ? format(dateFrom, 'dd/MM/yyyy') : 'Dal'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
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
            <Button variant="glass" className="w-[140px] justify-start">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              {dateTo ? format(dateTo, 'dd/MM/yyyy') : 'Al'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters} 
            className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4 mr-1" />
            Cancella ({activeFiltersCount})
          </Button>
        )}
      </div>
    </div>
  );
}
