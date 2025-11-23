// src/lib/financial-products.ts
// Queries para la nueva tabla financial_products (MVP NerdWallet-style)

import { supabase } from './supabase';

export type ProductCategory = 'credit_card' | 'personal_loan' | 'investment' | 'banking';

export interface FinancialProduct {
  id: string;
  name: string;
  slug: string;
  institution: string;
  institution_logo: string | null;
  category: ProductCategory;
  main_rate_label: string | null;
  main_rate_value: string | null;
  main_rate_numeric: number | null;
  description: string | null;
  benefits: string[];
  apply_url: string | null;
  info_url: string | null;
  meta_data: Record<string, any>;
  badges: string[];
  is_featured: boolean;
  is_promoted: boolean;
  rating: number;
  review_count: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Mapeo de categorías a nombres legibles
export const categoryLabels: Record<ProductCategory, string> = {
  credit_card: 'Tarjetas de Crédito',
  personal_loan: 'Préstamos Personales',
  investment: 'Inversiones',
  banking: 'Cuentas Bancarias',
};

// Mapeo de categorías a iconos (Lucide)
export const categoryIcons: Record<ProductCategory, string> = {
  credit_card: 'CreditCard',
  personal_loan: 'Banknote',
  investment: 'TrendingUp',
  banking: 'Building2',
};

// Mapeo de categorías a descripciones
export const categoryDescriptions: Record<ProductCategory, string> = {
  credit_card: 'Compara tarjetas de crédito sin anualidad, con cashback y puntos.',
  personal_loan: 'Encuentra préstamos con las mejores tasas y sin aval.',
  investment: 'Inversiones seguras desde $100: CETES, pagarés y más.',
  banking: 'Cuentas digitales sin comisiones y con alto rendimiento.',
};

/**
 * Obtener todos los productos financieros
 */
export async function getFinancialProducts(options?: {
  category?: ProductCategory;
  featured?: boolean;
  limit?: number;
  orderBy?: 'rating' | 'main_rate_numeric' | 'created_at';
  ascending?: boolean;
  target_audience?: 'personal' | 'business';
}): Promise<FinancialProduct[]> {
  try {
    let query = supabase
      .from('financial_products')
      .select('*')
      .eq('is_active', true);

    if (options?.target_audience) {
      query = query.eq('target_audience', options.target_audience);
    } else {
      // Default to personal if not specified, or show all? 
      // Usually we want to separate them. Let's default to 'personal' if not specified to avoid mixing, 
      // OR we can leave it open. Given the user wants to separate "Para Personas" and "Para Empresas", 
      // explicit filtering is better.
      // For now, let's NOT default here to allow flexibility, but we should use it in the pages.
    }

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    if (options?.featured) {
      query = query.eq('is_featured', true);
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? false });
    } else {
      query = query.order('sort_order', { ascending: true }).order('rating', { ascending: false });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching financial products:', error);
      return [];
    }

    return (data || []).map(transformProduct);
  } catch (error) {
    console.error('Error in getFinancialProducts:', error);
    return [];
  }
}

/**
 * Obtener productos destacados para la landing page
 */
export async function getFeaturedFinancialProducts(limit: number = 6): Promise<FinancialProduct[]> {
  return getFinancialProducts({ featured: true, limit });
}

/**
 * Obtener productos por categoría
 */
export async function getProductsByCategory(category: ProductCategory, limit?: number): Promise<FinancialProduct[]> {
  return getFinancialProducts({ category, limit });
}

/**
 * Obtener un producto por slug
 */
export async function getProductBySlug(slug: string): Promise<FinancialProduct | null> {
  try {
    const { data, error } = await supabase
      .from('financial_products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    return transformProduct(data);
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return null;
  }
}

/**
 * Obtener conteo de productos por categoría
 */
export async function getProductCounts(): Promise<Record<ProductCategory, number>> {
  try {
    const { data, error } = await supabase
      .from('financial_products')
      .select('category')
      .eq('is_active', true)
      .returns<{ category: string }[]>();

    if (error || !data) {
      return { credit_card: 0, personal_loan: 0, investment: 0, banking: 0 };
    }

    const counts: Record<ProductCategory, number> = {
      credit_card: 0,
      personal_loan: 0,
      investment: 0,
      banking: 0,
    };

    data.forEach((item) => {
      const cat = item.category as ProductCategory;
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });

    return counts;
  } catch (error) {
    console.error('Error in getProductCounts:', error);
    return { credit_card: 0, personal_loan: 0, investment: 0, banking: 0 };
  }
}

/**
 * Buscar productos
 */
export async function searchFinancialProducts(query: string, limit: number = 20): Promise<FinancialProduct[]> {
  try {
    const { data, error } = await supabase
      .from('financial_products')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,institution.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    return (data || []).map(transformProduct);
  } catch (error) {
    console.error('Error in searchFinancialProducts:', error);
    return [];
  }
}

/**
 * Transformar datos raw a tipo FinancialProduct
 */
function transformProduct(data: any): FinancialProduct {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    institution: data.institution,
    institution_logo: data.institution_logo,
    category: data.category as ProductCategory,
    main_rate_label: data.main_rate_label,
    main_rate_value: data.main_rate_value,
    main_rate_numeric: data.main_rate_numeric,
    description: data.description,
    benefits: Array.isArray(data.benefits) ? data.benefits : [],
    apply_url: data.apply_url,
    info_url: data.info_url,
    meta_data: data.meta_data || {},
    badges: Array.isArray(data.badges) ? data.badges : [],
    is_featured: data.is_featured || false,
    is_promoted: data.is_promoted || false,
    rating: parseFloat(data.rating) || 0,
    review_count: data.review_count || 0,
    is_active: data.is_active,
    sort_order: data.sort_order || 0,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}
