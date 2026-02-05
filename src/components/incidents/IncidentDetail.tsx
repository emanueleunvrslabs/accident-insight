import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { ArrowLeft, Calendar, MapPin, Users, AlertTriangle, ExternalLink, Car, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useIncident, useIncidentSources } from '@/hooks/useIncidents';
import { ACCIDENT_TYPE_LABELS } from '@/types/incident';

interface IncidentDetailProps {
  incidentId: string;
  onBack: () => void;
}

export function IncidentDetail({ incidentId, onBack }: IncidentDetailProps) {
  const { data: incident, isLoading: incidentLoading } = useIncident(incidentId);
  const { data: sources, isLoading: sourcesLoading } = useIncidentSources(incidentId);

  if (incidentLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Incidente non trovato</p>
        <Button variant="ghost" onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna alla lista
        </Button>
      </div>
    );
  }

  const formattedDate = format(new Date(incident.event_date), "EEEE d MMMM yyyy", { locale: it });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={onBack} className="mb-2 sm:mb-4 -ml-2 sm:ml-0">
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Torna alla lista</span>
        <span className="sm:hidden">Indietro</span>
      </Button>

      {/* Main incident card */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2 flex-wrap">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                <span className="break-words">{incident.city}</span>
                {incident.province && (
                  <span className="text-muted-foreground font-normal text-base sm:text-lg">({incident.province})</span>
                )}
              </CardTitle>
              {incident.region && (
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">{incident.region}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="destructive" className="text-sm sm:text-base px-2 sm:px-3 py-1">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                {incident.deceased_count} {incident.deceased_count === 1 ? 'decesso' : 'decessi'}
              </Badge>
              {incident.injured_count && incident.injured_count > 0 && (
                <Badge variant="secondary" className="text-sm sm:text-base px-2 sm:px-3 py-1">
                  <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                  {incident.injured_count} {incident.injured_count === 1 ? 'ferito' : 'feriti'}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4 sm:space-y-6">
          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Data e ora</p>
                <p className="font-medium capitalize text-sm sm:text-base truncate">{formattedDate}</p>
                {incident.event_time && (
                  <p className="text-xs sm:text-sm">{incident.event_time.slice(0, 5)}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Car className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Tipo incidente</p>
                <p className="font-medium text-sm sm:text-base">
                  {ACCIDENT_TYPE_LABELS[incident.accident_type] || incident.accident_type}
                </p>
              </div>
            </div>

            {incident.road_name && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 sm:col-span-2">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Strada/Luogo</p>
                  <p className="font-medium text-sm sm:text-base break-words">{incident.road_name}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Dynamics */}
          {incident.dynamics_description && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                <FileText className="h-4 w-4" />
                Dinamica dell'incidente
              </h4>
              <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                {incident.dynamics_description}
              </p>
            </div>
          )}

          {/* AI Summary */}
          {incident.ai_summary && (
            <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary text-sm sm:text-base">
                <FileText className="h-4 w-4" />
                Riassunto AI
              </h4>
              <p className="text-foreground/80 leading-relaxed italic text-sm sm:text-base">
                {incident.ai_summary}
              </p>
            </div>
          )}

          {/* Victim details */}
          {incident.victim_details && Array.isArray(incident.victim_details) && incident.victim_details.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Dettagli vittime</h4>
              <div className="flex flex-wrap gap-2">
                {(incident.victim_details as { age_range?: string; role: string }[]).map((victim, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs sm:text-sm">
                    {victim.role}
                    {victim.age_range && ` (${victim.age_range} anni)`}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Confidence score */}
          {incident.confidence_score && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span>Affidabilità dati:</span>
              <Badge variant={incident.confidence_score >= 0.8 ? 'default' : 'secondary'} className="text-xs">
                {Math.round(incident.confidence_score * 100)}%
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sources card */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">
            Fonti ({sources?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          {sourcesLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : sources && sources.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {sources.map((source) => (
                <a
                  key={source.id}
                  href={source.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base line-clamp-2">
                        {source.article_title || 'Articolo senza titolo'}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {source.source_name}
                        {source.published_at && (
                          <> • {format(new Date(source.published_at), 'd MMM yyyy', { locale: it })}</>
                        )}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4 text-sm">
              Nessuna fonte collegata
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
