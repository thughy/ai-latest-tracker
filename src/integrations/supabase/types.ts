export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alembic_version: {
        Row: {
          version_num: string
        }
        Insert: {
          version_num: string
        }
        Update: {
          version_num?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          author: string | null
          content_summary: string | null
          created_at: string | null
          github_stars: number | null
          github_stars_growth_10d: number | null
          github_stars_growth_1d: number | null
          github_stars_growth_3d: number | null
          github_stars_updated_at: string | null
          id: number
          not_interested: number | null
          not_interested_manually_edited: boolean | null
          processed: number | null
          published_date: string
          read_count: number | null
          read_manually_edited: boolean | null
          relevance_score: number | null
          score_manually_edited: boolean | null
          source: string
          star_manually_edited: boolean | null
          starred: number | null
          title: string
          updated_at: string | null
          url: string
          user_rating: number | null
          user_rating_manually_edited: boolean | null
        }
        Insert: {
          author?: string | null
          content_summary?: string | null
          created_at?: string | null
          github_stars?: number | null
          github_stars_growth_10d?: number | null
          github_stars_growth_1d?: number | null
          github_stars_growth_3d?: number | null
          github_stars_updated_at?: string | null
          id?: number
          not_interested?: number | null
          not_interested_manually_edited?: boolean | null
          processed?: number | null
          published_date: string
          read_count?: number | null
          read_manually_edited?: boolean | null
          relevance_score?: number | null
          score_manually_edited?: boolean | null
          source: string
          star_manually_edited?: boolean | null
          starred?: number | null
          title: string
          updated_at?: string | null
          url: string
          user_rating?: number | null
          user_rating_manually_edited?: boolean | null
        }
        Update: {
          author?: string | null
          content_summary?: string | null
          created_at?: string | null
          github_stars?: number | null
          github_stars_growth_10d?: number | null
          github_stars_growth_1d?: number | null
          github_stars_growth_3d?: number | null
          github_stars_updated_at?: string | null
          id?: number
          not_interested?: number | null
          not_interested_manually_edited?: boolean | null
          processed?: number | null
          published_date?: string
          read_count?: number | null
          read_manually_edited?: boolean | null
          relevance_score?: number | null
          score_manually_edited?: boolean | null
          source?: string
          star_manually_edited?: boolean | null
          starred?: number | null
          title?: string
          updated_at?: string | null
          url?: string
          user_rating?: number | null
          user_rating_manually_edited?: boolean | null
        }
        Relationships: []
      }
      research_items: {
        Row: {
          authors: string[]
          created_at: string
          date: string
          description: string
          id: string
          is_interested: boolean
          is_read: boolean
          is_starred: boolean
          relevance_score: number
          source: string
          tags: string[]
          title: string
          updated_at: string
          url: string
          user_score: number | null
        }
        Insert: {
          authors?: string[]
          created_at?: string
          date?: string
          description: string
          id?: string
          is_interested?: boolean
          is_read?: boolean
          is_starred?: boolean
          relevance_score: number
          source: string
          tags?: string[]
          title: string
          updated_at?: string
          url: string
          user_score?: number | null
        }
        Update: {
          authors?: string[]
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_interested?: boolean
          is_read?: boolean
          is_starred?: boolean
          relevance_score?: number
          source?: string
          tags?: string[]
          title?: string
          updated_at?: string
          url?: string
          user_score?: number | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
