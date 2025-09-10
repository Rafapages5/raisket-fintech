import { supabase } from '@/lib/supabase'
import type { FinancialProduct } from '@/types'

export class ProductsAPI {
  // Get all products
  static async getAll(): Promise<FinancialProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      throw new Error('Failed to fetch products')
    }

    return this.mapDatabaseToProduct(data || [])
  }

  // Get products by category
  static async getByCategory(category: string): Promise<FinancialProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('average_rating', { ascending: false })

    if (error) {
      console.error('Error fetching products by category:', error)
      throw new Error('Failed to fetch products by category')
    }

    return this.mapDatabaseToProduct(data || [])
  }

  // Get products by segment
  static async getBySegment(segment: string): Promise<FinancialProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('segment', segment)
      .order('average_rating', { ascending: false })

    if (error) {
      console.error('Error fetching products by segment:', error)
      throw new Error('Failed to fetch products by segment')
    }

    return this.mapDatabaseToProduct(data || [])
  }

  // Get products by category AND segment
  static async getByCategoryAndSegment(category: string, segment: string): Promise<FinancialProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('segment', segment)
      .order('average_rating', { ascending: false })

    if (error) {
      console.error('Error fetching products by category and segment:', error)
      throw new Error('Failed to fetch products by category and segment')
    }

    return this.mapDatabaseToProduct(data || [])
  }

  // Get single product by ID
  static async getById(id: string): Promise<FinancialProduct | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Product not found
      }
      console.error('Error fetching product by ID:', error)
      throw new Error('Failed to fetch product')
    }

    const products = this.mapDatabaseToProduct([data])
    return products[0] || null
  }

  // Search products by name or description
  static async search(query: string): Promise<FinancialProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,provider.ilike.%${query}%`)
      .order('average_rating', { ascending: false })

    if (error) {
      console.error('Error searching products:', error)
      throw new Error('Failed to search products')
    }

    return this.mapDatabaseToProduct(data || [])
  }

  // Get featured products (highest rated)
  static async getFeatured(limit: number = 6): Promise<FinancialProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gte('average_rating', 4.0)
      .order('average_rating', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured products:', error)
      throw new Error('Failed to fetch featured products')
    }

    return this.mapDatabaseToProduct(data || [])
  }

  // Map database fields to FinancialProduct interface
  private static mapDatabaseToProduct(dbProducts: any[]): FinancialProduct[] {
    return dbProducts.map(product => ({
      id: product.id,
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      longDescription: product.long_description,
      category: product.category,
      segment: product.segment,
      imageUrl: product.image_url || 'https://placehold.co/600x400.png',
      aiHint: product.ai_hint,
      provider: product.provider,
      features: product.features || [],
      benefits: product.benefits || [],
      averageRating: product.average_rating || 0,
      reviewCount: product.review_count || 0,
      interestRate: product.interest_rate,
      fees: product.fees,
      eligibility: product.eligibility || [],
      detailsUrl: product.details_url,
      loanTerm: product.loan_term,
      maxLoanAmount: product.max_loan_amount,
      minInvestment: product.min_investment,
      investmentType: product.investment_type,
      coverageAmount: product.coverage_amount,
    }))
  }
}

// Helper functions for backwards compatibility
export const getProducts = () => ProductsAPI.getAll()
export const getProductsByCategory = (category: string) => ProductsAPI.getByCategory(category)
export const getProductsBySegment = (segment: string) => ProductsAPI.getBySegment(segment)
export const getProductsByCategoryAndSegment = (category: string, segment: string) => 
  ProductsAPI.getByCategoryAndSegment(category, segment)
export const getProductById = (id: string) => ProductsAPI.getById(id)
export const searchProducts = (query: string) => ProductsAPI.search(query)
export const getFeaturedProducts = (limit?: number) => ProductsAPI.getFeatured(limit)