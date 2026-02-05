-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for accident types
CREATE TYPE public.accident_type AS ENUM (
  'auto-auto',
  'auto-moto',
  'auto-pedone',
  'auto-bici',
  'veicolo-singolo',
  'camion',
  'altro'
);

-- Main incidents table
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_date DATE NOT NULL,
  event_time TIME,
  city TEXT NOT NULL,
  province TEXT,
  region TEXT,
  road_name TEXT,
  deceased_count INTEGER NOT NULL DEFAULT 1,
  injured_count INTEGER,
  accident_type public.accident_type DEFAULT 'altro',
  dynamics_description TEXT,
  victim_details JSONB,
  ai_summary TEXT,
  confidence_score DECIMAL(3,2),
  is_verified BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  cluster_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sources table (articles linked to incidents)
CREATE TABLE public.incident_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id UUID NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  article_url TEXT NOT NULL,
  article_title TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  raw_snippet TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- News feeds configuration table
CREATE TABLE public.news_feeds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  feed_url TEXT NOT NULL UNIQUE,
  feed_type TEXT NOT NULL DEFAULT 'rss',
  is_active BOOLEAN DEFAULT true,
  last_fetched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Alert preferences table
CREATE TABLE public.alert_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  regions TEXT[],
  min_fatalities INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  frequency TEXT DEFAULT 'daily',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Processing queue for raw articles
CREATE TABLE public.article_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feed_id UUID REFERENCES public.news_feeds(id) ON DELETE SET NULL,
  article_url TEXT NOT NULL UNIQUE,
  article_title TEXT,
  article_snippet TEXT,
  status TEXT DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_incidents_event_date ON public.incidents(event_date DESC);
CREATE INDEX idx_incidents_region ON public.incidents(region);
CREATE INDEX idx_incidents_province ON public.incidents(province);
CREATE INDEX idx_incidents_accident_type ON public.incidents(accident_type);
CREATE INDEX idx_incidents_cluster ON public.incidents(cluster_id);
CREATE INDEX idx_incident_sources_incident ON public.incident_sources(incident_id);
CREATE INDEX idx_article_queue_status ON public.article_queue(status);

-- Enable RLS on all tables
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_queue ENABLE ROW LEVEL SECURITY;

-- Public read access for incidents and sources (dashboard is public)
CREATE POLICY "Anyone can view incidents" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "Anyone can view sources" ON public.incident_sources FOR SELECT USING (true);
CREATE POLICY "Anyone can view feeds" ON public.news_feeds FOR SELECT USING (true);

-- Service role can manage all data (for edge functions)
CREATE POLICY "Service can manage incidents" ON public.incidents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage sources" ON public.incident_sources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage feeds" ON public.news_feeds FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage alerts" ON public.alert_preferences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage queue" ON public.article_queue FOR ALL USING (true) WITH CHECK (true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alert_preferences_updated_at
  BEFORE UPDATE ON public.alert_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();