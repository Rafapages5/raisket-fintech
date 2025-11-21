// src/app/sitemap.ts
// Sitemap dinámico generado automáticamente

import { MetadataRoute } from 'next';
import { categoryToPath } from '@/lib/schema/generators';
import { getFinancialProducts } from '@/lib/financial-products';
import { FILTER_DEFINITIONS } from '@/lib/filters';

const BASE_URL = 'https://raisket.mx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Obtener todos los productos
  const products = await getFinancialProducts();

  // URLs estáticas principales
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tarjetas-de-credito`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/prestamos-personales`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/inversiones`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cuentas-bancarias`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/chat`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // URLs dinámicas de productos individuales
  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/${categoryToPath(product.category)}/reviews/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Agrupar productos por categoría para páginas de institución
  const institutions = new Set(products.map((p) => p.institution));
  const institutionUrls: MetadataRoute.Sitemap = Array.from(institutions).map((institution: string) => {
    const slug = institution
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

    return {
      url: `${BASE_URL}/instituciones/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  });

  // URLs de páginas "mejores" - Generadas dinámicamente desde filtros
  const bestOfUrls: MetadataRoute.Sitemap = Object.values(FILTER_DEFINITIONS).map((filter) => ({
    url: `${BASE_URL}/${categoryToPath(filter.category)}/mejores/${filter.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [...staticUrls, ...productUrls, ...institutionUrls, ...bestOfUrls];
}
