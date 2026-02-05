import { useIncidentStats } from '@/hooks/useIncidents';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, MapPin, Car, Users, TrendingUp } from 'lucide-react';
import { ACCIDENT_TYPE_LABELS } from '@/types/incident';

export function StatsCards() {
  const { data: stats, isLoading } = useIncidentStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 sm:p-5 animate-pulse">
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const topRegion = Object.entries(stats.byRegion).sort((a, b) => b[1] - a[1])[0];
  const topType = Object.entries(stats.byType).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    {
      title: "Incidenti totali",
      value: stats.totalIncidents,
      subtitle: "Casi monitorati",
      icon: AlertTriangle,
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
      glow: "group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]",
    },
    {
      title: "Vittime totali",
      value: stats.totalDeceased,
      subtitle: "Decessi registrati",
      icon: Users,
      gradient: "from-destructive/20 to-destructive/5",
      iconBg: "bg-destructive/20",
      iconColor: "text-destructive",
      glow: "group-hover:shadow-[0_0_30px_hsl(var(--destructive)/0.3)]",
      valueColor: "text-destructive",
    },
    {
      title: "Regione top",
      value: topRegion?.[0] || '-',
      subtitle: topRegion ? `${topRegion[1]} incidenti` : 'Nessun dato',
      icon: MapPin,
      gradient: "from-success/20 to-success/5",
      iconBg: "bg-success/20",
      iconColor: "text-success",
      glow: "group-hover:shadow-[0_0_30px_hsl(var(--success)/0.3)]",
    },
    {
      title: "Tipo frequente",
      value: topType ? ACCIDENT_TYPE_LABELS[topType[0] as keyof typeof ACCIDENT_TYPE_LABELS] || topType[0] : '-',
      subtitle: topType ? `${topType[1]} casi` : 'Nessun dato',
      icon: Car,
      gradient: "from-accent/20 to-accent/5",
      iconBg: "bg-accent/20",
      iconColor: "text-accent",
      glow: "group-hover:shadow-[0_0_30px_hsl(var(--accent)/0.3)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className={`group glass rounded-2xl p-3 sm:p-5 shadow-liquid transition-all duration-500 hover:-translate-y-1 ${card.glow} animate-slide-up`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Gradient overlay */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-50`} />
          
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
        </div>
      ))}
    </div>
  );
}
