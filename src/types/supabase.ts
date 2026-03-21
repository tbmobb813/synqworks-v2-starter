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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      assessment_questions: {
        Row: {
          context: string | null
          created_at: string
          id: string
          is_active: boolean
          options: Json
          question_text: string
          skill_id: string
          sort_order: number
        }
        Insert: {
          context?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          options: Json
          question_text: string
          skill_id: string
          sort_order?: number
        }
        Update: {
          context?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          options?: Json
          question_text?: string
          skill_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_results: {
        Row: {
          completed_at: string
          id: string
          scores: Json
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          scores: Json
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          scores?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module_completions: {
        Row: {
          completed_at: string
          id: string
          module_id: string
          score: number | null
          time_spent_s: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          module_id: string
          score?: number | null
          time_spent_s?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          module_id?: string
          score?: number | null
          time_spent_s?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_completions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      simulation_results: {
        Row: {
          choices_log: Json
          completed_at: string
          id: string
          metrics: Json
          outcome_label: string | null
          scenario_id: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          choices_log: Json
          completed_at?: string
          id?: string
          metrics: Json
          outcome_label?: string | null
          scenario_id: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          choices_log?: Json
          completed_at?: string
          id?: string
          metrics?: Json
          outcome_label?: string | null
          scenario_id?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "simulation_results_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "simulation_scenarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulation_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      simulation_scenarios: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          difficulty: number
          environment: string
          id: string
          is_active: boolean
          skill_id: string
          title: string
        }
        Insert: {
          config?: Json
          created_at?: string
          description?: string | null
          difficulty: number
          environment?: string
          id?: string
          is_active?: boolean
          skill_id: string
          title: string
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          difficulty?: number
          environment?: string
          id?: string
          is_active?: boolean
          skill_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulation_scenarios_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      training_modules: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          difficulty: number
          estimated_mins: number
          id: string
          is_active: boolean
          skill_id: string
          title: string
          xp_reward: number
        }
        Insert: {
          config?: Json
          created_at?: string
          description?: string | null
          difficulty: number
          estimated_mins?: number
          id?: string
          is_active?: boolean
          skill_id: string
          title: string
          xp_reward?: number
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          difficulty?: number
          estimated_mins?: number
          id?: string
          is_active?: boolean
          skill_id?: string
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "training_modules_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          competency_score: number
          id: string
          last_activity_at: string
          sessions_count: number
          skill_id: string
          user_id: string
        }
        Insert: {
          competency_score?: number
          id?: string
          last_activity_at?: string
          sessions_count?: number
          skill_id: string
          user_id: string
        }
        Update: {
          competency_score?: number
          id?: string
          last_activity_at?: string
          sessions_count?: number
          skill_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
