export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// ─── Pricing helpers (computed, not stored) ───────────────────────────────────

export interface PricingCalc {
  totalCost: number       // COG + freight + tax on cost
  iofAmount: number
  checkoutFee: number
  gatewayFee: number
  otherTaxes: number
  marketingBudget: number
  netProfit: number
  profitMarginPct: number // 0–1
  markup: number          // sellPrice / totalCost
  cpaIdeal: number        // = marketingBudget
  cpaMax: number          // = marketingBudget + netProfit
  roasMin: number         // = sellPrice / cpaIdeal
}

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
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }

      // ── Swipe File ────────────────────────────────────────────────────────────
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

      // ── Products (entidade central) ───────────────────────────────────────────
      products: {
        Row: {
          id: string
          project_id: string
          name: string
          line_category: string | null
          source_url: string | null
          mineracao_id: string | null
          notreglr_score: number | null
          notreglr_label: string | null
          notreglr_visual_traits: string[]
          images: string[]
          pipeline_status: 'a_testar' | 'testando' | 'validado' | 'descartado'
          status: 'mining' | 'evaluating' | 'active' | 'archived' | 'testing' | 'approved' | 'discarded'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          line_category?: string | null
          source_url?: string | null
          mineracao_id?: string | null
          notreglr_score?: number | null
          notreglr_label?: string | null
          notreglr_visual_traits?: string[]
          images?: string[]
          pipeline_status?: 'a_testar' | 'testando' | 'validado' | 'descartado'
          status?: 'mining' | 'evaluating' | 'active' | 'archived' | 'testing' | 'approved' | 'discarded'
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }

      // ── Product Pricing (modelo financeiro 1:1 com product) ───────────────────
      product_pricing: {
        Row: {
          id: string
          product_id: string
          cog_eur: number | null
          freight_eur: number
          sale_price_eur: number | null
          coupon_pct: number
          iof_rate: number
          checkout_fee_rate: number
          gateway_fee_rate: number
          marketing_allocation_pct: number
          other_taxes_rate: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          cog_eur?: number | null
          freight_eur?: number
          sale_price_eur?: number | null
          coupon_pct?: number
          iof_rate?: number
          checkout_fee_rate?: number
          gateway_fee_rate?: number
          marketing_allocation_pct?: number
          other_taxes_rate?: number
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['product_pricing']['Insert']>
      }

      // ── Pricing Config (taxas globais por projeto) ────────────────────────────
      pricing_config: {
        Row: {
          id: string
          project_id: string
          iof_rate: number
          checkout_fee_rate: number
          gateway_fee_rate: number
          marketing_allocation_pct: number
          other_taxes_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          iof_rate?: number
          checkout_fee_rate?: number
          gateway_fee_rate?: number
          marketing_allocation_pct?: number
          other_taxes_rate?: number
        }
        Update: Partial<Database['public']['Tables']['pricing_config']['Insert']>
      }

      // ── Creatives ─────────────────────────────────────────────────────────────
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
          // performance
          result_ctr: number | null
          result_cpc: number | null
          result_cpm: number | null
          result_cpa: number | null
          result_impressions: number | null
          total_spend_eur: number | null
          kill_criteria_result: string | null
          // strategy
          persona_description: string | null
          mental_triggers: string[]
          awareness_stage: 'unaware' | 'problem_aware' | 'solution_aware' | 'product_aware' | 'most_aware' | null
          wow_factor: string | null
          cta_strategy: string | null
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
          result_ctr?: number | null
          result_cpc?: number | null
          result_cpm?: number | null
          result_cpa?: number | null
          result_impressions?: number | null
          total_spend_eur?: number | null
          kill_criteria_result?: string | null
          persona_description?: string | null
          mental_triggers?: string[]
          awareness_stage?: 'unaware' | 'problem_aware' | 'solution_aware' | 'product_aware' | 'most_aware' | null
          wow_factor?: string | null
          cta_strategy?: string | null
          swipe_refs?: string[]
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['creatives']['Insert']>
      }

      // ── Ad Campaigns ──────────────────────────────────────────────────────────
      ad_campaigns: {
        Row: {
          id: string
          project_id: string
          product_id: string | null
          creative_id: string | null
          status: 'a_testar' | 'testando' | 'validado' | 'descartado'
          daily_budget_eur: number | null
          days_active: number
          gender_target: string | null
          age_target: string | null
          interests: string[]
          countries: string[]
          ctr: number | null
          cpc_eur: number | null
          cpm_eur: number | null
          page_views: number | null
          checkouts: number | null
          conversions: number | null
          total_spent_eur: number | null
          notes: string | null
          started_at: string | null
          ended_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          product_id?: string | null
          creative_id?: string | null
          status?: 'a_testar' | 'testando' | 'validado' | 'descartado'
          daily_budget_eur?: number | null
          days_active?: number
          gender_target?: string | null
          age_target?: string | null
          interests?: string[]
          countries?: string[]
          ctr?: number | null
          cpc_eur?: number | null
          cpm_eur?: number | null
          page_views?: number | null
          checkouts?: number | null
          conversions?: number | null
          total_spent_eur?: number | null
          notes?: string | null
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['ad_campaigns']['Insert']>
      }

      // ── Scenarios ─────────────────────────────────────────────────────────────
      scenarios: {
        Row: {
          id: string
          project_id: string
          product_id: string | null
          campaign_id: string | null
          label: string
          scenario_type: 'realizado' | 'simulacao' | 'pessimista' | 'otimista'
          ctr: number | null
          view_page_rate: number | null
          checkout_rate: number | null
          conversion_rate: number | null
          budget_eur: number | null
          cpm_eur: number | null
          aov_eur: number | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          product_id?: string | null
          campaign_id?: string | null
          label?: string
          scenario_type?: 'realizado' | 'simulacao' | 'pessimista' | 'otimista'
          ctr?: number | null
          view_page_rate?: number | null
          checkout_rate?: number | null
          conversion_rate?: number | null
          budget_eur?: number | null
          cpm_eur?: number | null
          aov_eur?: number | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['scenarios']['Insert']>
      }

      // ── Audiences ─────────────────────────────────────────────────────────────
      audiences: {
        Row: {
          id: string
          project_id: string
          name: string
          demographics: string | null
          interests: string[]
          pain_points: string[]
          awareness_stage: 'unaware' | 'problem_aware' | 'solution_aware' | 'product_aware' | 'most_aware' | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          demographics?: string | null
          interests?: string[]
          pain_points?: string[]
          awareness_stage?: 'unaware' | 'problem_aware' | 'solution_aware' | 'product_aware' | 'most_aware' | null
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['audiences']['Insert']>
      }

      // ── Tasks ─────────────────────────────────────────────────────────────────
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
