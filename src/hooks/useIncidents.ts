import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Incident, IncidentSource, IncidentFilters, AccidentType } from '@/types/incident';

export function useIncidents(filters: IncidentFilters = {}) {
  return useQuery({
    queryKey: ['incidents', filters],
    queryFn: async () => {
      let query = supabase
        .from('incidents')
        .select('*')
        .eq('is_archived', false)
        .order('event_date', { ascending: false });

      if (filters.dateFrom) {
        query = query.gte('event_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('event_date', filters.dateTo);
      }
      if (filters.region) {
        query = query.eq('region', filters.region);
      }
      if (filters.province) {
        query = query.eq('province', filters.province);
      }
      if (filters.minFatalities) {
        query = query.gte('deceased_count', filters.minFatalities);
      }
      if (filters.accidentType) {
        query = query.eq('accident_type', filters.accidentType);
      }
      if (filters.searchQuery) {
        query = query.or(`city.ilike.%${filters.searchQuery}%,dynamics_description.ilike.%${filters.searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as unknown as Incident[];
    },
  });
}

export function useIncident(id: string | undefined) {
  return useQuery({
    queryKey: ['incident', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as unknown as Incident;
    },
    enabled: !!id,
  });
}

export function useIncidentSources(incidentId: string | undefined) {
  return useQuery({
    queryKey: ['incident-sources', incidentId],
    queryFn: async () => {
      if (!incidentId) return [];
      
      const { data, error } = await supabase
        .from('incident_sources')
        .select('*')
        .eq('incident_id', incidentId)
        .order('fetched_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as IncidentSource[];
    },
    enabled: !!incidentId,
  });
}

export function useProcessArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (article: {
      article_url: string;
      article_title: string;
      article_snippet?: string;
      source_name?: string;
      published_at?: string;
    }) => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-article`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(article),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process article');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

export function useIncidentStats() {
  return useQuery({
    queryKey: ['incident-stats'],
    queryFn: async () => {
      const { data: incidents, error } = await supabase
        .from('incidents')
        .select('id, deceased_count, region, accident_type, event_date')
        .eq('is_archived', false);

      if (error) throw error;

      const totalIncidents = incidents?.length || 0;
      const totalDeceased = incidents?.reduce((sum, i) => sum + (i.deceased_count || 0), 0) || 0;
      
      const byRegion: Record<string, number> = {};
      const byType: Record<string, number> = {};
      
      incidents?.forEach((i) => {
        if (i.region) {
          byRegion[i.region] = (byRegion[i.region] || 0) + 1;
        }
        if (i.accident_type) {
          byType[i.accident_type] = (byType[i.accident_type] || 0) + 1;
        }
      });

      return {
        totalIncidents,
        totalDeceased,
        byRegion,
        byType,
      };
    },
  });
}
