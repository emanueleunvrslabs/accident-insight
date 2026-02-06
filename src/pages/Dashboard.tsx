import { useState } from 'react';
import { Shield, BarChart3, Calendar } from 'lucide-react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { IncidentList } from '@/components/incidents/IncidentList';
import { IncidentDetail } from '@/components/incidents/IncidentDetail';
import { FloatingNav } from '@/components/FloatingNav';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export default function Dashboard() {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  
  // Filter for today's incidents only
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayFilters = { dateFrom: today, dateTo: today };

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Floating Navigation */}
      <FloatingNav />

      {/* Main content - add top padding for floating nav */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pt-20 sm:pt-24">
        {selectedIncidentId ? (
          <IncidentDetail
            incidentId={selectedIncidentId}
            onBack={() => setSelectedIncidentId(null)}
          />
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Stats */}
            <StatsCards />

            {/* Today's Incidents Header */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">Incidenti di Oggi</h2>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(), "EEEE d MMMM yyyy", { locale: it })}
                </p>
              </div>
            </div>

            {/* Incident list - only today's */}
            <IncidentList
              filters={todayFilters}
              onViewDetails={(id) => setSelectedIncidentId(id)}
            />
          </div>
        )}
      </main>

      {/* Footer - Glass effect */}
      <footer className="glass-subtle border-t-0 mt-auto">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              </div>
              <span>Sistema riservato</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-accent/10">
                <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
              </div>
              <span>Elaborato con AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
