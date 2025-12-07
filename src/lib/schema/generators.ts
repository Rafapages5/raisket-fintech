// src/lib/schema/generators.ts
// Generadores de Schema.org para SEO

import { FinancialProduct, ProductCategory } from '@/lib/financial-products';
import type {
  SchemaOrganization,
  SchemaWebSite,
  SchemaBreadcrumb,
  SchemaProduct,
  SchemaArticle,
  SchemaFAQPage,
  SchemaItemList,
} from './types';

const SITE_URL = 'https://raisket.mx';
const SITE_NAME = 'Raisket';
const SITE_DESCRIPTION = 'Compara y encuentra los mejores productos financieros en México: tarjetas de crédito, préstamos, inversiones y cuentas bancarias.';

/**
 * Schema de Organización - Para el sitio completo
 */
export function generateOrganizationSchema(): SchemaOrganization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    sameAs: [
      // 'https://twitter.com/raisket',
      // 'https://www.linkedin.com/company/raisket',
      // 'https://www.facebook.com/raisket',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contacto@raisket.mx',
    },
  };
}

/**
 * Schema de WebSite con SearchAction
 */
export function generateWebSiteSchema(): SchemaWebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/buscar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Schema de Breadcrumbs
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url?: string }>): SchemaBreadcrumb {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

/**
 * Schema de Producto Financiero
 */
export function generateProductSchema(product: FinancialProduct): SchemaProduct {
  // Determinar el tipo específico según categoría
  const getSchemaType = (category: ProductCategory): SchemaProduct['@type'] => {
    switch (category) {
      case 'credit_card':
        return 'CreditCard';
      case 'personal_loan':
        return 'LoanOrCredit';
      case 'investment':
        return 'InvestmentOrDeposit';
      case 'banking':
        return 'BankAccount';
      default:
        return 'FinancialProduct';
    }
  };

  const baseSchema: SchemaProduct = {
    '@context': 'https://schema.org',
    '@type': getSchemaType(product.category),
    name: product.name,
    description: product.description || undefined,
    brand: {
      '@type': 'Organization',
      name: product.institution,
      logo: product.institution_logo || undefined,
    },
    image: product.institution_logo || undefined,
    url: product.apply_url || `${SITE_URL}/producto/${product.slug}`,
  };

  // Agregar rating si existe
  if (product.rating > 0 && product.review_count > 0) {
    baseSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Agregar campos específicos por categoría
  if (product.category === 'credit_card') {
    baseSchema.feesAndCommissionsSpecification = product.meta_data.annuity
      ? `Anualidad: $${product.meta_data.annuity} MXN`
      : 'Sin anualidad';

    if (product.main_rate_numeric) {
      baseSchema.interestRate = `${product.main_rate_numeric}%`;
    }
  }

  if (product.category === 'personal_loan' && product.meta_data.min_amount) {
    baseSchema.amount = {
      '@type': 'MonetaryAmount',
      minValue: product.meta_data.min_amount,
      maxValue: product.meta_data.max_amount,
      currency: 'MXN',
    };

    if (product.main_rate_numeric) {
      baseSchema.annualPercentageRate = product.main_rate_numeric;
    }
  }

  if (product.category === 'investment' && product.main_rate_numeric) {
    baseSchema.annualPercentageRate = product.main_rate_numeric;
  }

  return baseSchema;
}

/**
 * Schema de Lista de Productos (para páginas de categoría)
 */
export function generateProductListSchema(
  products: FinancialProduct[],
  options?: { name?: string; description?: string }
): SchemaItemList {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: options?.name,
    description: options?.description,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateProductSchema(product),
    })),
  };
}

/**
 * Schema de Artículo (para guías y blog)
 */
export function generateArticleSchema(
  article: {
    title?: string;
    headline?: string;
    description?: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
    url: string;
  }
): SchemaArticle {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline || article.title || '',
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author || 'Equipo Raisket',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

/**
 * Schema de FAQ Page
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): SchemaFAQPage {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Helper para combinar múltiples schemas en un array
 */
export function combineSchemas(...schemas: Array<Record<string, any> | undefined>) {
  return schemas.filter(Boolean);
}

/**
 * Mapeo de categorías a rutas URL
 */
export function categoryToPath(category: ProductCategory): string {
  const paths: Record<ProductCategory, string> = {
    credit_card: 'comparadores/tarjetas-credito',
    personal_loan: 'comparadores/prestamos-personales',
    investment: 'comparadores/inversiones',
    banking: 'comparadores/cuentas-bancarias',
  };
  return paths[category];
}

/**
 * Mapeo de categorías a nombres legibles
 */
export function categoryToName(category: ProductCategory): string {
  const names: Record<ProductCategory, string> = {
    credit_card: 'Tarjetas de Crédito',
    personal_loan: 'Préstamos Personales',
    investment: 'Inversiones',
    banking: 'Cuentas Bancarias',
  };
  return names[category];
}
