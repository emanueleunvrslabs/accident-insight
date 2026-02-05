export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alert_preferences: {
        Row: {
          created_at: string
          email: string
          frequency: string | null
          id: string
          is_active: boolean | null
          min_fatalities: number | null
          regions: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          min_fatalities?: number | null
          regions?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          min_fatalities?: number | null
          regions?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      article_queue: {
        Row: {
          article_snippet: string | null
          article_title: string | null
          article_url: string
          created_at: string
          error_message: string | null
          feed_id: string | null
          id: string
          processed_at: string | null
          status: string | null
        }
        Insert: {
          article_snippet?: string | null
          article_title?: string | null
          article_url: string
          created_at?: string
          error_message?: string | null
          feed_id?: string | null
          id?: string
          processed_at?: string | null
          status?: string | null
        }
        Update: {
          article_snippet?: string | null
          article_title?: string | null
          article_url?: string
          created_at?: string
          error_message?: string | null
          feed_id?: string | null
          id?: string
          processed_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_queue_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "news_feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_sources: {
        Row: {
          article_title: string | null
          article_url: string
          created_at: string
          fetched_at: string
          id: string
          incident_id: string
          published_at: string | null
          raw_snippet: string | null
          source_name: string
        }
        Insert: {
          article_title?: string | null
          article_url: string
          created_at?: string
          fetched_at?: string
          id?: string
          incident_id: string
          published_at?: string | null
          raw_snippet?: string | null
          source_name: string
        }
        Update: {
          article_title?: string | null
          article_url?: string
          created_at?: string
          fetched_at?: string
          id?: string
          incident_id?: string
          published_at?: string | null
          raw_snippet?: string | null
          source_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "incident_sources_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          accident_type: Database["public"]["Enums"]["accident_type"] | null
          ai_summary: string | null
          city: string
          cluster_id: string | null
          confidence_score: number | null
          created_at: string
          deceased_count: number
          dynamics_description: string | null
          event_date: string
          event_time: string | null
          id: string
          injured_count: number | null
          is_archived: boolean | null
          is_verified: boolean | null
          province: string | null
          region: string | null
          road_name: string | null
          updated_at: string
          victim_details: Json | null
        }
        Insert: {
          accident_type?: Database["public"]["Enums"]["accident_type"] | null
          ai_summary?: string | null
          city: string
          cluster_id?: string | null
          confidence_score?: number | null
          created_at?: string
          deceased_count?: number
          dynamics_description?: string | null
          event_date: string
          event_time?: string | null
          id?: string
          injured_count?: number | null
          is_archived?: boolean | null
          is_verified?: boolean | null
          province?: string | null
          region?: string | null
          road_name?: string | null
          updated_at?: string
          victim_details?: Json | null
        }
        Update: {
          accident_type?: Database["public"]["Enums"]["accident_type"] | null
          ai_summary?: string | null
          city?: string
          cluster_id?: string | null
          confidence_score?: number | null
          created_at?: string
          deceased_count?: number
          dynamics_description?: string | null
          event_date?: string
          event_time?: string | null
          id?: string
          injured_count?: number | null
          is_archived?: boolean | null
          is_verified?: boolean | null
          province?: string | null
          region?: string | null
          road_name?: string | null
          updated_at?: string
          victim_details?: Json | null
        }
        Relationships: []
      }
      news_feeds: {
        Row: {
          created_at: string
          feed_type: string
          feed_url: string
          id: string
          is_active: boolean | null
          last_fetched_at: string | null
          name: string
        }
        Insert: {
          created_at?: string
          feed_type?: string
          feed_url: string
          id?: string
          is_active?: boolean | null
          last_fetched_at?: string | null
          name: string
        }
        Update: {
          created_at?: string
          feed_type?: string
          feed_url?: string
          id?: string
          is_active?: boolean | null
          last_fetched_at?: string | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      accident_type:
        | "auto-auto"
        | "auto-moto"
        | "auto-pedone"
        | "auto-bici"
        | "veicolo-singolo"
        | "camion"
        | "altro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      accident_type: [
        "auto-auto",
        "auto-moto",
        "auto-pedone",
        "auto-bici",
        "veicolo-singolo",
        "camion",
        "altro",
      ],
    },
  },
} as const
