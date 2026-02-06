import { useState } from 'react';
import { Shield, BarChart3 } from 'lucide-react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { IncidentFiltersBar } from '@/components/incidents/IncidentFilters';
import { IncidentList } from '@/components/incidents/IncidentList';
import { IncidentDetail } from '@/components/incidents/IncidentDetail';
import { FloatingNav } from '@/components/FloatingNav';
import { Card } from '@/components/ui/card';
import type { IncidentFilters } from '@/types/incident';

export default function Dashboard() {
  const [filters, setFilters] = useState<IncidentFilters>({});
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

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

            {/* Filters - Glass container */}
            <Card variant="glass-subtle" className="p-3 sm:p-4">
              <IncidentFiltersBar filters={filters} onFiltersChange={setFilters} />
            </Card>

            {/* Incident list */}
            <IncidentList
              filters={filters}
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
