import { useState, useEffect } from 'react';
import { FloatingNav } from '@/components/FloatingNav';
import { FloatingFilters } from '@/components/FloatingFilters';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { IncidentList } from '@/components/incidents/IncidentList';
import { IncidentDetail } from '@/components/incidents/IncidentDetail';
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
