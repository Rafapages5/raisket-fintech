// src/types/index.ts
export type ProductCategory = "Crédito" | "Financiamiento" | "Inversión" | "All";
export type ProductSegment = "Personas" | "Empresas";

// Legacy interface for compatibility
export interface Review {
  id: string;
  productId: string;
  userName: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  date: string;
  title?: string;
}

// Legacy interface for compatibility - mapped from Supabase data
export interface FinancialProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  category: ProductCategory;
  segment: ProductSegment;
  imageUrl: string;
  provider: string;
  features: string[];
  benefits?: string[];
  averageRating: number;
  reviewCount: number;
  interestRate?: string;
  loanTerm?: string;
  maxLoanAmount?: string;
  coverageAmount?: string;
  investmentType?: string;
  minInvestment?: string;
  fees?: string;
  eligibility?: string[];
  aiHint?: string;
  detailsUrl?: string;
  // New fields for enhanced product detail page
  pros?: string[];
  cons?: string[];
  gatNominal?: string;
  gatReal?: string;
  rendimientoAnual?: string;
  liquidez?: string;
  montoMinimo?: string;
  montoMaximo?: string;
  requisitos?: string[];
  proteccion?: string;
  comisiones?: string[];
  vigenciaInicio?: string;
  vigenciaFin?: string;
  terminosCondicionesUrl?: string;
  logoUrl?: string;
}

// New Supabase-based types based on actual database structure
export interface Institution {
  id: string;
  nombre: string;
  logo_url: string | null;
  sitio_web: string | null;
  telefono: string | null;
  descripcion: string | null;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string | null;
  slug: string;
  created_at: string;
}

export interface Subcategoria {
  id: string;
  categoria_id: string;
  nombre: string;
  descripcion: string | null;
  slug: string;
  created_at: string;
}

export interface Product {
  id: string;
  institucion_id: string;
  subcategoria_id: string;
  nombre: string;
  tagline: string | null;
  descripcion: string | null;
  descripcion_larga: string | null;
  segmento: string | null;
  imagen_url: string | null;
  ai_hint: string | null;
  proveedor: string | null;
  rating_promedio: number | null;
  total_reviews: number;
  elegibilidad: string | null;
  url_detalles: string | null;
  activo: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CaracteristicasCredito {
  producto_id: string;
  tasa_interes_min: number | null;
  tasa_interes_max: number | null;
  cat_promedio: number | null;
  ingreso_minimo: number | null;
  limite_credito_min: number | null;
  limite_credito_max: number | null;
  plazo_maximo_meses: number | null;
  monto_maximo: number | null;
  tipo_inversion: string | null;
  created_at: string;
}

export interface CaracteristicasFinanciamiento {
  producto_id: string;
  tasa_interes_min: number | null;
  tasa_interes_max: number | null;
  cat_promedio: number | null;
  monto_minimo: number | null;
  monto_maximo: number | null;
  plazo_maximo_meses: number | null;
  tipo_tasa: string | null;
  frecuencia_pago: string | null;
  garantia_requerida: boolean;
  tiempo_procesamiento_dias: number | null;
  metodo_aplicacion: string | null;
  metodo_desembolso: string | null;
  penalizacion_prepago: boolean;
  created_at: string;
}

export interface CaracteristicasInversion {
  producto_id: string;
  rendimiento_anual: number | null;
  gat_nominal: number | null;
  gat_real: number | null;
  monto_minimo: number | null;
  monto_maximo: number | null;
  tipo_cuenta: string | null;
  proteccion_ipab: boolean;
  tasa_cashback: number | null;
  limite_mensual: number | null;
  metodos_deposito: string[] | null;
  metodos_retiro: string[] | null;
  created_at: string;
}

export interface ProductoCaracteristicas {
  id: string;
  producto_id: string;
  tipo: string | null;
  descripcion: string;
  orden: number;
  created_at: string;
}

export interface ProductoComisiones {
  id: string;
  producto_id: string;
  tipo: string;
  monto: number | null;
  porcentaje: number | null;
  descripcion: string | null;
  activa: boolean;
  created_at: string;
}

// Extended product with institution and subcategory data
export interface ProductWithInstitution extends Product {
  instituciones: Institution;
  subcategorias: Subcategoria & {
    categorias: Categoria;
  };
}

// Product with characteristics based on type
export interface ProductWithCharacteristics extends Product {
  instituciones: Institution;
  subcategorias: Subcategoria & {
    categorias: Categoria;
  };
  caracteristicas_credito?: CaracteristicasCredito[];
  caracteristicas_financiamiento?: CaracteristicasFinanciamiento[];
  caracteristicas_inversion?: CaracteristicasInversion[];
  producto_caracteristicas?: ProductoCaracteristicas[];
  producto_comisiones?: ProductoComisiones[];
}

// Utility type for product queries
export interface ProductQueryOptions {
  categoria?: string;
  subcategoria?: string;
  segmento?: string;
  institucion_id?: string;
  activo?: boolean;
  limit?: number;
  offset?: number;
}

// Product creation/update types
export interface CreateProductInput {
  institucion_id: string;
  subcategoria_id: string;
  nombre: string;
  tagline?: string;
  descripcion?: string;
  descripcion_larga?: string;
  segmento?: string;
  imagen_url?: string;
  ai_hint?: string;
  proveedor?: string;
  elegibilidad?: string;
  url_detalles?: string;
  activo?: boolean;
  slug: string;
}
