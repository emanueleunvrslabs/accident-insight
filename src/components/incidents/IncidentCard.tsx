import { useState } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar, MapPin, Users, AlertTriangle, ExternalLink, ChevronRight } from 'lucide-react';
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
  const formattedDate = format(new Date(incident.event_date), 'd MMMM yyyy', { locale: it });

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 bg-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Header with location and date */}
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <h3 className="font-semibold text-lg truncate">
                {incident.city}
                {incident.province && <span className="text-muted-foreground ml-1">({incident.province})</span>}
              </h3>
            </div>

            {/* Region and date */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
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

            {/* Road name if available */}
            {incident.road_name && (
              <p className="text-sm text-muted-foreground mb-2">
                📍 {incident.road_name}
              </p>
            )}

            {/* Dynamics description */}
            {incident.dynamics_description && (
              <p className="text-sm text-foreground/80 line-clamp-2 mb-3">
                {incident.dynamics_description}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {incident.deceased_count} {incident.deceased_count === 1 ? 'decesso' : 'decessi'}
              </Badge>
              
              {incident.injured_count && incident.injured_count > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {incident.injured_count} {incident.injured_count === 1 ? 'ferito' : 'feriti'}
                </Badge>
              )}
              
              <Badge variant="outline">
                {ACCIDENT_TYPE_LABELS[incident.accident_type] || incident.accident_type}
              </Badge>

              {incident.confidence_score && incident.confidence_score >= 0.8 && (
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  Alta affidabilità
                </Badge>
              )}
            </div>
          </div>

          {/* View details button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails(incident.id)}
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
