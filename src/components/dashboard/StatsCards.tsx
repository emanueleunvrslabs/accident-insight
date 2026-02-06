import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, MapPin, Car, Users, TrendingUp, Calendar } from 'lucide-react';
import { ACCIDENT_TYPE_LABELS } from '@/types/incident';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

export function StatsCards() {
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['incident-stats-extended', today],
    queryFn: async () => {
      // Get all incidents for stats
      const { data: allIncidents, error: allError } = await supabase
        .from('incidents')
        .select('id, deceased_count, region, accident_type, event_date')
        .eq('is_archived', false);

      if (allError) throw allError;

      // Get today's incidents
      const { data: todayIncidents, error: todayError } = await supabase
        .from('incidents')
        .select('id, deceased_count')
        .eq('is_archived', false)
        .eq('event_date', today);

      if (todayError) throw todayError;

      const totalIncidents = allIncidents?.length || 0;
      const totalDeceased = allIncidents?.reduce((sum, i) => sum + (i.deceased_count || 0), 0) || 0;
      const todayCount = todayIncidents?.length || 0;
      const todayDeceased = todayIncidents?.reduce((sum, i) => sum + (i.deceased_count || 0), 0) || 0;
      
      const byRegion: Record<string, number> = {};
      const byType: Record<string, number> = {};
      
      allIncidents?.forEach((i) => {
        if (i.region) {
          byRegion[i.region] = (byRegion[i.region] || 0) + 1;
        }
        if (i.accident_type) {
          byType[i.accident_type] = (byType[i.accident_type] || 0) + 1;
        }
      });

      const topRegion = Object.entries(byRegion).sort((a, b) => b[1] - a[1])[0];
      const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];

      return {
        totalIncidents,
        totalDeceased,
        todayCount,
        todayDeceased,
        byRegion,
        byType,
        topRegion,
        topType,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} variant="glass" className="p-4 sm:p-5">
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: "Incidenti Oggi",
      value: stats.todayCount,
      subtitle: format(new Date(), 'dd/MM/yyyy'),
      icon: Calendar,
      tintClass: "bg-accent/8 dark:bg-accent/12",
      iconBg: "bg-accent/15",
      iconColor: "text-accent",
      valueColor: stats.todayCount > 0 ? "text-accent" : "",
    },
    {
      title: "Vittime Oggi",
      value: stats.todayDeceased,
      subtitle: "Decessi odierni",
      icon: Users,
      tintClass: "bg-destructive/8 dark:bg-destructive/12",
      iconBg: "bg-destructive/15",
      iconColor: "text-destructive",
      valueColor: "text-destructive",
    },
    {
      title: "Totale Incidenti",
      value: stats.totalIncidents,
      subtitle: "Casi monitorati",
      icon: AlertTriangle,
      tintClass: "bg-primary/8 dark:bg-primary/12",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
    {
      title: "Vittime Totali",
      value: stats.totalDeceased,
      subtitle: "Decessi registrati",
      icon: Users,
      tintClass: "bg-warning/8 dark:bg-warning/12",
      iconBg: "bg-warning/15",
      iconColor: "text-warning",
    },
    {
      title: "Regione Top",
      value: stats.topRegion?.[0] || '-',
      subtitle: stats.topRegion ? `${stats.topRegion[1]} incidenti` : 'Nessun dato',
      icon: MapPin,
      tintClass: "bg-success/8 dark:bg-success/12",
      iconBg: "bg-success/15",
      iconColor: "text-success",
    },
    {
      title: "Tipo Frequente",
      value: stats.topType ? ACCIDENT_TYPE_LABELS[stats.topType[0] as keyof typeof ACCIDENT_TYPE_LABELS] || stats.topType[0] : '-',
      subtitle: stats.topType ? `${stats.topType[1]} casi` : 'Nessun dato',
      icon: Car,
      tintClass: "bg-primary/8 dark:bg-primary/12",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          variant="glass"
          className="group p-3 sm:p-5 relative overflow-hidden animate-slide-up"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          {/* Subtle tint overlay */}
          <div className={`absolute inset-0 ${card.tintClass} rounded-2xl pointer-events-none`} />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {card.title}
              </span>
              <div className={`p-1.5 sm:p-2 rounded-xl ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                <card.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${card.iconColor}`} />
              </div>
            </div>
            
            <div className={`text-xl sm:text-3xl font-bold mb-1 truncate ${card.valueColor || ''}`}>
              {card.value}
            </div>
            
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="truncate">{card.subtitle}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
