import { useIncidents } from '@/hooks/useIncidents';
import { IncidentCard } from './IncidentCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, FileWarning } from 'lucide-react';
import type { IncidentFilters } from '@/types/incident';

interface IncidentListProps {
  filters: IncidentFilters;
  onViewDetails: (id: string) => void;
}

export function IncidentList({ filters, onViewDetails }: IncidentListProps) {
  const { data: incidents, isLoading, error } = useIncidents(filters);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Errore nel caricamento</h3>
        <p className="text-muted-foreground">
          Si è verificato un errore durante il caricamento degli incidenti.
        </p>
      </div>
    );
  }

  if (!incidents || incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileWarning className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nessun incidente trovato</h3>
        <p className="text-muted-foreground">
          Non ci sono incidenti che corrispondono ai filtri selezionati.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {incidents.length} {incidents.length === 1 ? 'incidente trovato' : 'incidenti trovati'}
      </p>
      {incidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          incident={incident}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
