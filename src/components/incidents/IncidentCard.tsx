import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar, MapPin, Users, AlertTriangle, ChevronRight, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Incident } from '@/types/incident';
import { ACCIDENT_TYPE_LABELS } from '@/types/incident';

interface IncidentCardProps {
  incident: Incident;
  onViewDetails: (id: string) => void;
}

export function IncidentCard({ incident, onViewDetails }: IncidentCardProps) {
  const formattedDate = format(new Date(incident.event_date), 'd MMM yyyy', { locale: it });

  return (
    <Card 
      variant="glass"
      className="group p-4 sm:p-5 cursor-pointer active:scale-[0.99] animate-slide-up"
      onClick={() => onViewDetails(incident.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Header with location */}
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-xl bg-primary/12 shrink-0">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg truncate">
              {incident.city}
              {incident.province && (
                <span className="text-muted-foreground font-normal ml-1.5 text-sm">
                  ({incident.province})
                </span>
              )}
            </h3>
          </div>

          {/* Region and date */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-3">
            {incident.region && (
              <Badge variant="glass" size="sm" className="font-normal">
                {incident.region}
              </Badge>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
              {incident.event_time && ` · ${incident.event_time.slice(0, 5)}`}
            </span>
          </div>

          {/* Road name - hidden on mobile */}
          {incident.road_name && (
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 hidden sm:block truncate">
              📍 {incident.road_name}
            </p>
          )}

          {/* Dynamics description */}
          {incident.dynamics_description && (
            <p className="text-xs sm:text-sm text-foreground/70 line-clamp-1 sm:line-clamp-2 mb-3 leading-relaxed">
              {incident.dynamics_description}
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Badge variant="glass-destructive" size="lg">
              <Users className="h-3 w-3 mr-1" />
              {incident.deceased_count} {incident.deceased_count === 1 ? 'decesso' : 'decessi'}
            </Badge>
            
            {incident.injured_count && incident.injured_count > 0 && (
              <Badge variant="glass-warning" size="lg">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {incident.injured_count} {incident.injured_count === 1 ? 'ferito' : 'feriti'}
              </Badge>
            )}
            
            <Badge variant="glass" className="hidden sm:inline-flex">
              {ACCIDENT_TYPE_LABELS[incident.accident_type] || incident.accident_type}
            </Badge>

            {incident.confidence_score && incident.confidence_score >= 0.8 && (
              <Badge variant="glass-success" className="hidden sm:inline-flex">
                <Zap className="h-3 w-3 mr-1" />
                Alta affidabilità
              </Badge>
            )}
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="shrink-0 p-2 rounded-xl bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 sm:flex hidden">
          <ChevronRight className="h-5 w-5" />
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 sm:hidden" />
      </div>
    </Card>
  );
}
