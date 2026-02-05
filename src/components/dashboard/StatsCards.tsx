import { useIncidentStats } from '@/hooks/useIncidents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, MapPin, Car, Users } from 'lucide-react';
import { ACCIDENT_TYPE_LABELS } from '@/types/incident';

export function StatsCards() {
  const { data: stats, isLoading } = useIncidentStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 sm:h-28" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const topRegion = Object.entries(stats.byRegion).sort((a, b) => b[1] - a[1])[0];
  const topType = Object.entries(stats.byType).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Incidenti totali</CardTitle>
          <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold">{stats.totalIncidents}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Casi monitorati
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Vittime totali</CardTitle>
          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold text-destructive">{stats.totalDeceased}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Decessi registrati
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6">
          <CardTitle className="text-xs sm:text-sm font-medium truncate">Regione top</CardTitle>
          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="text-lg sm:text-2xl font-bold truncate">{topRegion?.[0] || '-'}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {topRegion ? `${topRegion[1]} incidenti` : 'Nessun dato'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6">
          <CardTitle className="text-xs sm:text-sm font-medium truncate">Tipo frequente</CardTitle>
          <Car className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="text-lg sm:text-2xl font-bold truncate">
            {topType ? ACCIDENT_TYPE_LABELS[topType[0] as keyof typeof ACCIDENT_TYPE_LABELS] || topType[0] : '-'}
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {topType ? `${topType[1]} casi` : 'Nessun dato'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
