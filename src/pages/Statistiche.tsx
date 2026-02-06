import { FloatingNav } from '@/components/FloatingNav';
import { Card } from '@/components/ui/card';
import { useIncidentStats } from '@/hooks/useIncidents';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  MapPin, 
  Calendar,
  Users,
  Car,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { ACCIDENT_TYPE_LABELS } from '@/types/incident';

export default function Statistiche() {
  const { data: stats, isLoading } = useIncidentStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-mesh">
        <FloatingNav />
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pt-20 sm:pt-24">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} variant="glass" className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-24 w-full" />
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const regionData = Object.entries(stats?.byRegion || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const typeData = Object.entries(stats?.byType || {})
    .sort((a, b) => b[1] - a[1]);

  const totalIncidents = stats?.totalIncidents || 0;
  const totalDeceased = stats?.totalDeceased || 0;
  const avgPerIncident = totalIncidents > 0 ? (totalDeceased / totalIncidents).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <FloatingNav />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pt-20 sm:pt-24">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Statistiche</h1>
              <p className="text-muted-foreground text-sm">Analisi dei dati sugli incidenti stradali</p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card variant="glass" className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Totale Incidenti</span>
                <div className="p-2 rounded-xl bg-primary/15">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold">{totalIncidents}</div>
              <div className="flex items-center gap-1 text-xs text-success mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>Monitorati attivamente</span>
              </div>
            </Card>

            <Card variant="glass" className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Vittime Totali</span>
                <div className="p-2 rounded-xl bg-destructive/15">
                  <Users className="h-4 w-4 text-destructive" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-destructive">{totalDeceased}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingDown className="h-3 w-3 text-destructive" />
                <span>Decessi registrati</span>
              </div>
            </Card>

            <Card variant="glass" className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Media per Incidente</span>
                <div className="p-2 rounded-xl bg-warning/15">
                  <Activity className="h-4 w-4 text-warning" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold">{avgPerIncident}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <span>Vittime per sinistro</span>
              </div>
            </Card>

            <Card variant="glass" className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Regioni Coinvolte</span>
                <div className="p-2 rounded-xl bg-success/15">
                  <MapPin className="h-4 w-4 text-success" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold">{Object.keys(stats?.byRegion || {}).length}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <span>Su 20 regioni italiane</span>
              </div>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Incidents by Region */}
            <Card variant="glass" className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Incidenti per Regione</h3>
              </div>
              <div className="space-y-3">
                {regionData.length > 0 ? regionData.map(([region, count]) => {
                  const maxCount = regionData[0]?.[1] || 1;
                  const percentage = (count / maxCount) * 100;
                  return (
                    <div key={region} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{region}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-muted-foreground text-sm text-center py-8">Nessun dato disponibile</p>
                )}
              </div>
            </Card>

            {/* Incidents by Type */}
            <Card variant="glass" className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Car className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Tipologie di Incidente</h3>
              </div>
              <div className="space-y-3">
                {typeData.length > 0 ? typeData.map(([type, count]) => {
                  const maxCount = typeData[0]?.[1] || 1;
                  const percentage = (count / maxCount) * 100;
                  const label = ACCIDENT_TYPE_LABELS[type as keyof typeof ACCIDENT_TYPE_LABELS] || type;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{label}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-muted-foreground text-sm text-center py-8">Nessun dato disponibile</p>
                )}
              </div>
            </Card>
          </div>

          {/* Summary Card */}
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Riepilogo Generale</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-primary/5">
                <div className="text-2xl font-bold text-primary">{totalIncidents}</div>
                <div className="text-xs text-muted-foreground mt-1">Incidenti Totali</div>
              </div>
              <div className="p-4 rounded-xl bg-destructive/5">
                <div className="text-2xl font-bold text-destructive">{totalDeceased}</div>
                <div className="text-xs text-muted-foreground mt-1">Vittime</div>
              </div>
              <div className="p-4 rounded-xl bg-success/5">
                <div className="text-2xl font-bold text-success">{Object.keys(stats?.byRegion || {}).length}</div>
                <div className="text-xs text-muted-foreground mt-1">Regioni</div>
              </div>
              <div className="p-4 rounded-xl bg-accent/5">
                <div className="text-2xl font-bold text-accent">{Object.keys(stats?.byType || {}).length}</div>
                <div className="text-xs text-muted-foreground mt-1">Tipologie</div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
