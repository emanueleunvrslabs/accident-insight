import { useState, useEffect } from 'react';
import { FloatingNav } from '@/components/FloatingNav';
import { FloatingFilters } from '@/components/FloatingFilters';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { IncidentList } from '@/components/incidents/IncidentList';
import { IncidentDetail } from '@/components/incidents/IncidentDetail';
import { AlertTriangle } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import type { IncidentFilters } from '@/types/incident';

export default function Incidenti() {
  const { searchQuery } = useSearch();
  const [filters, setFilters] = useState<IncidentFilters>({});
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // Sync search query from global context
  useEffect(() => {
    setFilters(prev => ({ ...prev, searchQuery: searchQuery || undefined }));
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <FloatingNav />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pt-20 sm:pt-24">
        {selectedIncidentId ? (
          <IncidentDetail
            incidentId={selectedIncidentId}
            onBack={() => setSelectedIncidentId(null)}
          />
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Cards */}
            <StatsCards />

            {/* Floating Filters - positioned after stats */}
            <FloatingFilters filters={filters} onFiltersChange={setFilters} />

            {/* Header */}
            <div className="flex items-center gap-3 pt-16 md:pt-12">
              <div className="p-3 rounded-2xl bg-primary/10">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Incidenti</h1>
                <p className="text-muted-foreground text-sm">Elenco completo degli incidenti monitorati</p>
              </div>
            </div>

            {/* Incident list */}
            <IncidentList
              filters={filters}
              onViewDetails={(id) => setSelectedIncidentId(id)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
