import { useIncidentStats } from '@/hooks/useIncidents';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, MapPin, Car, Users, TrendingUp } from 'lucide-react';
import { ACCIDENT_TYPE_LABELS } from '@/types/incident';
import { Card } from '@/components/ui/card';

export function StatsCards() {
  const { data: stats, isLoading } = useIncidentStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
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

  const topRegion = Object.entries(stats.byRegion).sort((a, b) => b[1] - a[1])[0];
  const topType = Object.entries(stats.byType).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    {
      title: "Incidenti totali",
      value: stats.totalIncidents,
      subtitle: "Casi monitorati",
      icon: AlertTriangle,
      tintClass: "bg-primary/8 dark:bg-primary/12",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
    {
      title: "Vittime totali",
      value: stats.totalDeceased,
      subtitle: "Decessi registrati",
      icon: Users,
      tintClass: "bg-destructive/8 dark:bg-destructive/12",
      iconBg: "bg-destructive/15",
      iconColor: "text-destructive",
      valueColor: "text-destructive",
    },
    {
      title: "Regione top",
      value: topRegion?.[0] || '-',
      subtitle: topRegion ? `${topRegion[1]} incidenti` : 'Nessun dato',
      icon: MapPin,
      tintClass: "bg-success/8 dark:bg-success/12",
      iconBg: "bg-success/15",
      iconColor: "text-success",
    },
    {
      title: "Tipo frequente",
      value: topType ? ACCIDENT_TYPE_LABELS[topType[0] as keyof typeof ACCIDENT_TYPE_LABELS] || topType[0] : '-',
      subtitle: topType ? `${topType[1]} casi` : 'Nessun dato',
      icon: Car,
      tintClass: "bg-accent/8 dark:bg-accent/12",
      iconBg: "bg-accent/15",
      iconColor: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
