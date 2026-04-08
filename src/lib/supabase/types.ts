export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          slug: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          color?: string
          created_at?: string
        }
      }
      swipe_items: {
        Row: {
          id: string
          project_id: string
          source_type: 'meta_ad' | 'manual'
          meta_ad_id: string | null
          page_name: string | null
          page_url: string | null
          title: string | null
          body: string | null
          destination_domain: string | null
          snapshot_url: string | null
          platforms: string[]
          status: string | null
          days_running: number | null
          start_date: string | null
          tags: string[]
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          source_type?: 'meta_ad' | 'manual'
          meta_ad_id?: string | null
          page_name?: string | null
          page_url?: string | null
          title?: string | null
          body?: string | null
          destination_domain?: string | null
          snapshot_url?: string | null
          platforms?: string[]
          status?: string | null
          days_running?: number | null
          start_date?: string | null
          tags?: string[]
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['swipe_items']['Insert']>
      }
      products: {
        Row: {
          id: string
          project_id: string
          name: string
          line_category: string | null
          source_url: string | null
          cost_eur: number | null
          sell_price_eur: number | null
          status: 'mining' | 'evaluating' | 'testing' | 'approved' | 'discarded'
          checklist: Json
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          line_category?: string | null
          source_url?: string | null
          cost_eur?: number | null
          sell_price_eur?: number | null
          status?: 'mining' | 'evaluating' | 'testing' | 'approved' | 'discarded'
          checklist?: Json
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      creatives: {
        Row: {
          id: string
          project_id: string
          product_id: string | null
          title: string
          brief: string | null
          format: 'image' | 'video' | 'carousel'
          platform: 'instagram' | 'facebook' | 'both'
          angle: string | null
          status: 'briefing' | 'production' | 'review' | 'approved' | 'published'
          checklist: Json
          result_ctr: number | null
          result_cpc: number | null
          kill_criteria_result: string | null
          swipe_refs: string[]
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          product_id?: string | null
          title: string
          brief?: string | null
          format?: 'image' | 'video' | 'carousel'
          platform?: 'instagram' | 'facebook' | 'both'
          angle?: string | null
          status?: 'briefing' | 'production' | 'review' | 'approved' | 'published'
          checklist?: Json
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['creatives']['Insert']>
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: 'backlog' | 'todo' | 'in_progress' | 'done'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          due_date: string | null
          linked_type: string | null
          linked_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: 'backlog' | 'todo' | 'in_progress' | 'done'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          linked_type?: string | null
          linked_id?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
