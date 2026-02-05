import { useState } from 'react';
import { Scale, Shield, BarChart3 } from 'lucide-react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { IncidentFiltersBar } from '@/components/incidents/IncidentFilters';
import { IncidentList } from '@/components/incidents/IncidentList';
import { IncidentDetail } from '@/components/incidents/IncidentDetail';
import { AddArticleDialog } from '@/components/incidents/AddArticleDialog';
import type { IncidentFilters } from '@/types/incident';

export default function Dashboard() {
  const [filters, setFilters] = useState<IncidentFilters>({});
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Monitoraggio Incidenti</h1>
                <p className="text-sm text-muted-foreground">
                  Sistema AI per sinistri stradali mortali
                </p>
              </div>
            </div>
            <AddArticleDialog />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {selectedIncidentId ? (
          <IncidentDetail
            incidentId={selectedIncidentId}
            onBack={() => setSelectedIncidentId(null)}
          />
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <StatsCards />

            {/* Filters */}
            <div className="bg-card rounded-lg border border-border p-4">
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Sistema riservato - Uso professionale</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dati elaborati con AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
