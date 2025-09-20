// src/lib/products.ts
import { supabase } from './supabase';
import type {
  Product,
  ProductWithInstitution,
  Institution,
  FinancialProduct,
  ProductQueryOptions,
  ProductCategory,
  ProductSegment
} from '@/types';

// Transform Supabase product data to legacy FinancialProduct format
export function transformProductToLegacy(
  product: ProductWithInstitution,
  averageRating: number = 0,
  reviewCount: number = 0
): FinancialProduct {
  // Map category to legacy format
  const categoryMap: Record<string, ProductCategory> = {
    'tarjeta_credito': 'Crédito',
    'prestamo_personal': 'Financiamiento',
    'cuenta_inversion': 'Inversión',
    'credito': 'Crédito',
    'financiamiento': 'Financiamiento',
    'inversion': 'Inversión'
  };

  // Map segment based on product segmento field
  const segment: ProductSegment = product.segmento === 'empresas' ? 'Empresas' : 'Personas';

  // Format interest rate
  const formatInterestRate = () => {
    if (product.interest_rate_min && product.interest_rate_max) {
      return `${product.interest_rate_min}% - ${product.interest_rate_max}% anual`;
    }
    if (product.interest_rate_min) {
      return `Desde ${product.interest_rate_min}% anual`;
    }
    return undefined;
  };

  // Format loan term
  const formatLoanTerm = () => {
    if (product.min_term_months && product.max_term_months) {
      return `${product.min_term_months}-${product.max_term_months} meses`;
    }
    if (product.min_term_months) {
      return `Desde ${product.min_term_months} meses`;
    }
    return undefined;
  };

  // Format max loan amount
  const formatMaxAmount = () => {
    if (product.max_amount) {
      return `$${product.max_amount.toLocaleString('es-MX')} MXN`;
    }
    if (product.credit_limit_max) {
      return `Límite hasta $${product.credit_limit_max.toLocaleString('es-MX')} MXN`;
    }
    return undefined;
  };

  // Format fees
  const formatFees = () => {
    if (product.annual_fee === 0) {
      return 'Sin anualidad';
    }
    if (product.annual_fee) {
      return `Anualidad: $${product.annual_fee.toLocaleString('es-MX')} MXN`;
    }
    return undefined;
  };

  // Build eligibility array
  const buildEligibility = (): string[] => {
    const eligibility: string[] = [];

    if (product.min_income) {
      eligibility.push(`Ingresos mínimos: $${product.min_income.toLocaleString('es-MX')} MXN mensuales`);
    }

    if (product.min_credit_score) {
      eligibility.push(`Score mínimo: ${product.min_credit_score}`);
    }

    if (product.employment_requirement) {
      eligibility.push(product.employment_requirement);
    }

    if (product.accepts_imss) {
      eligibility.push('Acepta IMSS');
    }

    if (product.accepts_issste) {
      eligibility.push('Acepta ISSSTE');
    }

    if (product.requires_guarantor) {
      eligibility.push('Requiere aval');
    }

    if (product.collateral_required) {
      eligibility.push('Requiere garantía');
    }

    return eligibility;
  };

  // Build features array
  const buildFeatures = (): string[] => {
    const features: string[] = [];

    if (product.rate_type) {
      features.push(`Tasa ${product.rate_type}`);
    }

    if (product.annual_fee === 0) {
      features.push('Sin anualidad');
    }

    if (product.min_amount && product.max_amount) {
      features.push(`Montos de $${product.min_amount.toLocaleString('es-MX')} a $${product.max_amount.toLocaleString('es-MX')} MXN`);
    }

    if (product.credit_limit_min && product.credit_limit_max) {
      features.push(`Límite de crédito de $${product.credit_limit_min.toLocaleString('es-MX')} a $${product.credit_limit_max.toLocaleString('es-MX')} MXN`);
    }

    // Add default features if none exist
    if (features.length === 0) {
      features.push('Producto financiero', 'Atención personalizada', 'Seguridad garantizada');
    }

    return features;
  };

  return {
    id: product.id,
    name: product.nombre,
    tagline: product.tagline || `${product.subcategorias.nombre} de ${product.instituciones.nombre}`,
    description: product.descripcion || `Producto financiero de ${product.instituciones.nombre}`,
    longDescription: product.descripcion_larga || product.descripcion || undefined,
    category: product.subcategorias.categorias.nombre as ProductCategory,
    segment,
    imageUrl: product.imagen_url || `https://placehold.co/600x400/0066CC/FFFFFF?text=${encodeURIComponent(product.instituciones.nombre)}`,
    provider: product.proveedor || product.instituciones.nombre,
    features: buildFeatures(),
    benefits: ['Producto confiable', 'Atención de calidad', 'Respaldo institucional'],
    averageRating: product.rating_promedio || 0,
    reviewCount: product.total_reviews,
    interestRate: formatInterestRate(),
    loanTerm: formatLoanTerm(),
    maxLoanAmount: formatMaxAmount(),
    fees: formatFees(),
    eligibility: buildEligibility(),
    aiHint: product.ai_hint || `${product.subcategorias.categorias.nombre} ${product.instituciones.nombre}`,
    detailsUrl: product.url_detalles || product.instituciones.sitio_web || '#'
  };
}

// Get all products with institutions
export async function getAllProducts(options: ProductQueryOptions = {}) {
  try {
    let query = supabase
      .from('productos')
      .select(`
        *,
        instituciones(*),
        subcategorias(*, categorias(*))
      `)
      .eq('activo', true);

    // Apply filters
    if (options.categoria) {
      query = query.eq('subcategorias.categorias.slug', options.categoria);
    }

    if (options.subcategoria) {
      query = query.eq('subcategorias.slug', options.subcategoria);
    }

    if (options.segmento) {
      query = query.eq('segmento', options.segmento);
    }

    if (options.institucion_id) {
      query = query.eq('institucion_id', options.institucion_id);
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Transform to legacy format
    return data.map(product =>
      transformProductToLegacy(product as ProductWithInstitution)
    );

  } catch (error) {
    console.error('Error in getAllProducts:', error);
    throw error;
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<FinancialProduct | null> {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select(`
        *,
        instituciones(*),
        subcategorias(*, categorias(*))
      `)
      .eq('id', id)
      .eq('activo', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null;
      }
      console.error('Error fetching product:', error);
      throw error;
    }

    if (!data) {
      return null;
    }

    return transformProductToLegacy(data as ProductWithInstitution);

  } catch (error) {
    console.error('Error in getProductById:', error);
    throw error;
  }
}

// Get products by category
export async function getProductsByCategory(category: string, limit?: number): Promise<FinancialProduct[]> {
  return getAllProducts({
    categoria: category.toLowerCase().replace('é', 'e'),
    limit
  });
}

// Get featured products
export async function getFeaturedProducts(limit: number = 6): Promise<FinancialProduct[]> {
  // Since we don't have is_featured field, return recent products
  return getAllProducts({
    limit
  });
}

// Get products by institution
export async function getProductsByInstitution(institutionId: string): Promise<FinancialProduct[]> {
  return getAllProducts({ institucion_id: institutionId });
}

// Search products by name or description
export async function searchProducts(query: string, limit: number = 20): Promise<FinancialProduct[]> {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select(`
        *,
        instituciones(*),
        subcategorias(*, categorias(*))
      `)
      .eq('activo', true)
      .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      console.error('Error searching products:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(product =>
      transformProductToLegacy(product as ProductWithInstitution)
    );

  } catch (error) {
    console.error('Error in searchProducts:', error);
    throw error;
  }
}

// Get all institutions
export async function getAllInstitutions(): Promise<Institution[]> {
  try {
    const { data, error } = await supabase
      .from('instituciones')
      .select('*')
      .eq('activa', true)
      .order('nombre');

    if (error) {
      console.error('Error fetching institutions:', error);
      throw error;
    }

    return data || [];

  } catch (error) {
    console.error('Error in getAllInstitutions:', error);
    throw error;
  }
}

// Get products with user eligibility matching
export async function getEligibleProducts(
  userIncome: number,
  userCreditScore?: number,
  limit: number = 10
): Promise<FinancialProduct[]> {
  // For now, just return all products as eligibility logic needs characteristics data
  return getAllProducts({ limit });
}