import { useState } from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
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
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca per città o descrizione..."
          className="pl-10"
          value={filters.searchQuery || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
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
          <SelectTrigger className="w-[150px]">
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
            <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
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
            <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
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
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Cancella ({activeFiltersCount})
          </Button>
        )}
      </div>
    </div>
  );
}
