import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { ArrowLeft, Calendar, MapPin, Users, AlertTriangle, ExternalLink, Car, FileText, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
        <div className="glass rounded-2xl p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
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
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="glass-subtle rounded-xl -ml-2 sm:ml-0 hover:bg-primary/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Torna alla lista</span>
        <span className="sm:hidden">Indietro</span>
      </Button>

      {/* Main incident card */}
      <div className="glass rounded-3xl overflow-hidden shadow-liquid animate-scale-in">
        {/* Header with gradient */}
        <div className="relative p-4 sm:p-6 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-2xl bg-primary/20 shadow-glow">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {incident.city}
                    {incident.province && (
                      <span className="text-muted-foreground font-normal text-lg ml-2">
                        ({incident.province})
                      </span>
                    )}
                  </h1>
                  {incident.region && (
                    <p className="text-muted-foreground text-sm">{incident.region}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge 
                className="badge-pill bg-destructive/20 text-destructive border-destructive/30 text-sm px-3 py-1.5"
              >
                <Users className="h-4 w-4 mr-1" />
                {incident.deceased_count} {incident.deceased_count === 1 ? 'decesso' : 'decessi'}
              </Badge>
              {incident.injured_count && incident.injured_count > 0 && (
                <Badge 
                  className="badge-pill bg-warning/20 text-warning border-warning/30 text-sm px-3 py-1.5"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {incident.injured_count} {incident.injured_count === 1 ? 'ferito' : 'feriti'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="glass-subtle rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/15">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Data e ora</p>
                <p className="font-medium capitalize text-sm truncate">{formattedDate}</p>
                {incident.event_time && (
                  <p className="text-xs text-muted-foreground">{incident.event_time.slice(0, 5)}</p>
                )}
              </div>
            </div>

            <div className="glass-subtle rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/15">
                <Car className="h-5 w-5 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Tipo incidente</p>
                <p className="font-medium text-sm">
                  {ACCIDENT_TYPE_LABELS[incident.accident_type] || incident.accident_type}
                </p>
              </div>
            </div>

            {incident.road_name && (
              <div className="glass-subtle rounded-xl p-4 flex items-center gap-3 sm:col-span-2">
                <div className="p-2 rounded-xl bg-success/15">
                  <MapPin className="h-5 w-5 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Strada/Luogo</p>
                  <p className="font-medium text-sm break-words">{incident.road_name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Dynamics */}
          {incident.dynamics_description && (
            <div className="glass-subtle rounded-xl p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Dinamica dell'incidente
              </h4>
              <p className="text-foreground/80 leading-relaxed text-sm">
                {incident.dynamics_description}
              </p>
            </div>
          )}

          {/* AI Summary */}
          {incident.ai_summary && (
            <div className="relative rounded-xl p-4 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl" />
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm relative">
                <Sparkles className="h-4 w-4 text-primary animate-pulse-soft" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Riassunto AI
                </span>
              </h4>
              <p className="text-foreground/80 leading-relaxed italic text-sm relative">
                {incident.ai_summary}
              </p>
            </div>
          )}

          {/* Victim details */}
          {incident.victim_details && Array.isArray(incident.victim_details) && incident.victim_details.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-sm">Dettagli vittime</h4>
              <div className="flex flex-wrap gap-2">
                {(incident.victim_details as { age_range?: string; role: string }[]).map((victim, idx) => (
                  <Badge key={idx} variant="outline" className="badge-pill bg-muted/30">
                    {victim.role}
                    {victim.age_range && ` (${victim.age_range} anni)`}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Confidence score */}
          {incident.confidence_score && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className={`h-3.5 w-3.5 ${incident.confidence_score >= 0.8 ? 'text-success' : 'text-muted-foreground'}`} />
              <span>Affidabilità dati:</span>
              <Badge 
                variant="outline"
                className={`badge-pill text-xs ${
                  incident.confidence_score >= 0.8 
                    ? 'bg-success/15 text-success border-success/30' 
                    : 'bg-muted/30'
                }`}
              >
                {Math.round(incident.confidence_score * 100)}%
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Sources card */}
      <div className="glass rounded-2xl overflow-hidden shadow-liquid animate-slide-up">
        <div className="p-4 sm:p-5 border-b border-border/50">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-primary" />
            Fonti ({sources?.length || 0})
          </h3>
        </div>
        <div className="p-4 sm:p-5">
          {sourcesLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : sources && sources.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {sources.map((source, index) => (
                <a
                  key={source.id}
                  href={source.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block glass-subtle rounded-xl p-3 sm:p-4 hover:bg-primary/5 transition-all duration-200 hover:-translate-y-0.5 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">
                        {source.article_title || 'Articolo senza titolo'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-full bg-muted/50">{source.source_name}</span>
                        {source.published_at && (
                          <span>· {format(new Date(source.published_at), 'd MMM yyyy', { locale: it })}</span>
                        )}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8 text-sm">
              Nessuna fonte collegata
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
