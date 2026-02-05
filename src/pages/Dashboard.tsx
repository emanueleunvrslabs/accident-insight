import { useState } from 'react';
import { Scale, Shield, BarChart3 } from 'lucide-react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { IncidentFiltersBar } from '@/components/incidents/IncidentFilters';
import { IncidentList } from '@/components/incidents/IncidentList';
import { IncidentDetail } from '@/components/incidents/IncidentDetail';
import { AddArticleDialog } from '@/components/incidents/AddArticleDialog';
import { ManageFeedsDialog } from '@/components/feeds/ManageFeedsDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { IncidentFilters } from '@/types/incident';

export default function Dashboard() {
  const [filters, setFilters] = useState<IncidentFilters>({});
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 shrink-0">
                <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold truncate">Monitoraggio Incidenti</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Sistema AI per sinistri stradali mortali
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <ThemeToggle />
              <ManageFeedsDialog />
              <AddArticleDialog />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {selectedIncidentId ? (
          <IncidentDetail
            incidentId={selectedIncidentId}
            onBack={() => setSelectedIncidentId(null)}
          />
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Stats */}
            <StatsCards />

            {/* Filters */}
            <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
              <IncidentFiltersBar filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Incident list */}
            <IncidentList
              filters={filters}
              onViewDetails={(id) => setSelectedIncidentId(id)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Sistema riservato</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Dati elaborati con AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
