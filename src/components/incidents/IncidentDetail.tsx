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
      <div className="space-y-6">
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
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Torna alla lista
      </Button>

      {/* Main incident card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                {incident.city}
                {incident.province && (
                  <span className="text-muted-foreground font-normal">({incident.province})</span>
                )}
              </CardTitle>
              {incident.region && (
                <p className="text-muted-foreground mt-1">{incident.region}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Badge variant="destructive" className="text-base px-3 py-1">
                <Users className="h-4 w-4 mr-1" />
                {incident.deceased_count} {incident.deceased_count === 1 ? 'decesso' : 'decessi'}
              </Badge>
              {incident.injured_count && incident.injured_count > 0 && (
                <Badge variant="secondary" className="text-base px-3 py-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {incident.injured_count} {incident.injured_count === 1 ? 'ferito' : 'feriti'}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Data e ora</p>
                <p className="font-medium capitalize">{formattedDate}</p>
                {incident.event_time && (
                  <p className="text-sm">{incident.event_time.slice(0, 5)}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Car className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Tipo incidente</p>
                <p className="font-medium">
                  {ACCIDENT_TYPE_LABELS[incident.accident_type] || incident.accident_type}
                </p>
              </div>
            </div>

            {incident.road_name && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 md:col-span-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Strada/Luogo</p>
                  <p className="font-medium">{incident.road_name}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Dynamics */}
          {incident.dynamics_description && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Dinamica dell'incidente
              </h4>
              <p className="text-foreground/80 leading-relaxed">
                {incident.dynamics_description}
              </p>
            </div>
          )}

          {/* AI Summary */}
          {incident.ai_summary && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                <FileText className="h-4 w-4" />
                Riassunto AI
              </h4>
              <p className="text-foreground/80 leading-relaxed italic">
                {incident.ai_summary}
              </p>
            </div>
          )}

          {/* Victim details */}
          {incident.victim_details && Array.isArray(incident.victim_details) && incident.victim_details.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Dettagli vittime</h4>
              <div className="flex flex-wrap gap-2">
                {(incident.victim_details as { age_range?: string; role: string }[]).map((victim, idx) => (
                  <Badge key={idx} variant="outline">
                    {victim.role}
                    {victim.age_range && ` (${victim.age_range} anni)`}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Confidence score */}
          {incident.confidence_score && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Affidabilità dati:</span>
              <Badge variant={incident.confidence_score >= 0.8 ? 'default' : 'secondary'}>
                {Math.round(incident.confidence_score * 100)}%
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sources card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Fonti ({sources?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sourcesLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : sources && sources.length > 0 ? (
            <div className="space-y-3">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {source.article_title || 'Articolo senza titolo'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {source.source_name}
                        {source.published_at && (
                          <> • {format(new Date(source.published_at), 'd MMM yyyy', { locale: it })}</>
                        )}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={source.article_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Nessuna fonte collegata
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
