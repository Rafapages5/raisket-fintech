import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          tagline: string
          description: string
          long_description: string
          category: string
          segment: string
          image_url: string
          ai_hint: string
          provider: string
          features: string[]
          benefits: string[]
          average_rating: number
          review_count: number
          interest_rate?: string
          fees?: string
          eligibility: string[]
          details_url: string
          loan_term?: string
          max_loan_amount?: string
          min_investment?: string
          investment_type?: string
          coverage_amount?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          tagline: string
          description: string
          long_description?: string
          category: string
          segment: string
          image_url?: string
          ai_hint?: string
          provider: string
          features?: string[]
          benefits?: string[]
          average_rating?: number
          review_count?: number
          interest_rate?: string
          fees?: string
          eligibility?: string[]
          details_url?: string
          loan_term?: string
          max_loan_amount?: string
          min_investment?: string
          investment_type?: string
          coverage_amount?: string
        }
        Update: {
          id?: string
          name?: string
          tagline?: string
          description?: string
          long_description?: string
          category?: string
          segment?: string
          image_url?: string
          ai_hint?: string
          provider?: string
          features?: string[]
          benefits?: string[]
          average_rating?: number
          review_count?: number
          interest_rate?: string
          fees?: string
          eligibility?: string[]
          details_url?: string
          loan_term?: string
          max_loan_amount?: string
          min_investment?: string
          investment_type?: string
          coverage_amount?: string
        }
      }
    }
  }
}