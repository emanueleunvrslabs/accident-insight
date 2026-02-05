import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar, MapPin, Users, AlertTriangle, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
      className="group hover:shadow-lg transition-all duration-200 border-border/50 bg-card cursor-pointer active:scale-[0.99]"
      onClick={() => onViewDetails(incident.id)}
    >
      <CardContent className="p-3 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Header with location */}
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <h3 className="font-semibold text-base sm:text-lg truncate">
                {incident.city}
                {incident.province && <span className="text-muted-foreground ml-1">({incident.province})</span>}
              </h3>
            </div>

            {/* Region and date */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
              {incident.region && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {incident.region}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
                {incident.event_time && ` - ${incident.event_time.slice(0, 5)}`}
              </span>
            </div>

            {/* Road name if available - hidden on mobile */}
            {incident.road_name && (
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 hidden sm:block">
                📍 {incident.road_name}
              </p>
            )}

            {/* Dynamics description - limited on mobile */}
            {incident.dynamics_description && (
              <p className="text-xs sm:text-sm text-foreground/80 line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-3">
                {incident.dynamics_description}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                <Users className="h-3 w-3" />
                {incident.deceased_count} {incident.deceased_count === 1 ? 'decesso' : 'decessi'}
              </Badge>
              
              {incident.injured_count && incident.injured_count > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <AlertTriangle className="h-3 w-3" />
                  {incident.injured_count} {incident.injured_count === 1 ? 'ferito' : 'feriti'}
                </Badge>
              )}
              
              <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                {ACCIDENT_TYPE_LABELS[incident.accident_type] || incident.accident_type}
              </Badge>

              {incident.confidence_score && incident.confidence_score >= 0.8 && (
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20 text-xs hidden sm:inline-flex">
                  Alta affidabilità
                </Badge>
              )}
            </div>
          </div>

          {/* View details button */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
