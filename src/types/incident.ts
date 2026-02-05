export type AccidentType = 
  | 'auto-auto'
  | 'auto-moto'
  | 'auto-pedone'
  | 'auto-bici'
  | 'veicolo-singolo'
  | 'camion'
  | 'altro';

export interface VictimDetail {
  age_range?: string;
  role: 'conducente' | 'passeggero' | 'pedone' | 'ciclista' | 'motociclista';
}

// Using Json type for database compatibility
export type VictimDetailsJson = VictimDetail[] | null;

export interface Incident {
  id: string;
  event_date: string;
  event_time: string | null;
  city: string;
  province: string | null;
  region: string | null;
  road_name: string | null;
  deceased_count: number;
  injured_count: number | null;
  accident_type: AccidentType;
  dynamics_description: string | null;
  victim_details: unknown; // JSONB from database
  ai_summary: string | null;
  confidence_score: number | null;
  is_verified: boolean;
  is_archived: boolean;
  cluster_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface IncidentSource {
  id: string;
  incident_id: string;
  source_name: string;
  article_url: string;
  article_title: string | null;
  published_at: string | null;
  fetched_at: string;
  raw_snippet: string | null;
  created_at: string;
}

export interface NewsFeed {
  id: string;
  name: string;
  feed_url: string;
  feed_type: string;
  is_active: boolean;
  last_fetched_at: string | null;
  created_at: string;
}

export interface IncidentFilters {
  dateFrom?: string;
  dateTo?: string;
  region?: string;
  province?: string;
  minFatalities?: number;
  accidentType?: AccidentType;
  searchQuery?: string;
}

export const ITALIAN_REGIONS = [
  'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna',
  'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche',
  'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana',
  'Trentino-Alto Adige', 'Umbria', "Valle d'Aosta", 'Veneto'
] as const;

export const ACCIDENT_TYPE_LABELS: Record<AccidentType, string> = {
  'auto-auto': 'Auto-Auto',
  'auto-moto': 'Auto-Moto',
  'auto-pedone': 'Auto-Pedone',
  'auto-bici': 'Auto-Bicicletta',
  'veicolo-singolo': 'Veicolo Singolo',
  'camion': 'Camion',
  'altro': 'Altro',
};
