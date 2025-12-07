// src/app/inversiones/reviews/[slug]/page.tsx
// Página individual de review para inversiones

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getFinancialProducts,
  getProductBySlug,
} from '@/lib/financial-products';
import { generateReviewContent } from '@/lib/review-content';
import SchemaScript from '@/lib/schema/SchemaScript';
import {
  generateBreadcrumbSchema,
  generateProductSchema,
  generateArticleSchema,
  generateFAQSchema,
} from '@/lib/schema/generators';
import ReviewPageTemplate from '@/components/reviews/ReviewPageTemplate';

export const revalidate = 3600; // ISR - revalidar cada hora

// ============ METADATA SEO ============
// ============ METADATA SEO ============
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.category !== 'investment') {
    return {
      title: 'Producto no encontrado - Raisket',
    };
  }

  const seoTitle = `${product.name} - Análisis Completo y Opiniones 2025 | Raisket`;
  const seoDescription = `Review completa de ${product.name} de ${product.institution}: rendimientos, riesgos, inversión mínima y opiniones reales. ${product.description || ''} ⭐ ${product.rating}/5 (${product.review_count} reseñas).`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      product.name,
      product.institution,
      'inversión',
      'review',
      'opiniones',
      'análisis',
      product.badges.includes('Bajo Riesgo') ? 'bajo riesgo' : '',
      product.badges.includes('Alto Rendimiento') ? 'alto rendimiento' : '',
      'México',
    ].filter(Boolean),
    alternates: {
      canonical: `/inversiones/reviews/${product.slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `https://raisket.mx/inversiones/reviews/${product.slug}`,
      type: 'article',
      images: product.institution_logo ? [{ url: product.institution_logo }] : [],
    },
  };
}

// ============ GENERAR RUTAS ESTÁTICAS ============
export async function generateStaticParams() {
  const products = await getFinancialProducts({ category: 'investment' });
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// ============ PÁGINA PRINCIPAL ============
export default async function InversionReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.category !== 'investment') {
    notFound();
  }

  // Generar contenido editorial
  const reviewContent = generateReviewContent(product);

  // Obtener productos relacionados
  const relatedProducts = (await getFinancialProducts({ category: 'investment', limit: 4 }))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  // ============ SCHEMAS ESTRUCTURADOS ============
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://raisket.mx' },
    { name: 'Inversiones', url: 'https://raisket.mx/inversiones' },
    { name: product.name, url: `https://raisket.mx/inversiones/reviews/${product.slug}` },
  ]);

  const productSchema = generateProductSchema(product);

  const articleSchema = generateArticleSchema({
    headline: `Análisis Completo de ${product.name}`,
    description: reviewContent.overview.content,
    datePublished: product.created_at,
    dateModified: product.updated_at,
    url: `https://raisket.mx/inversiones/reviews/${product.slug}`,
  });

  const faqSchema = generateFAQSchema(
    reviewContent.faq.map((item) => ({
      question: item.question,
      answer: item.answer,
    }))
  );

  return (
    <>
      <SchemaScript schema={[breadcrumbSchema, productSchema, articleSchema, faqSchema]} />

      <ReviewPageTemplate
        product={product}
        reviewContent={reviewContent}
        relatedProducts={relatedProducts}
        categoryName="Inversiones"
        categoryPath="inversiones"
        gradientColors="from-purple-600 via-purple-700 to-indigo-800"
        accentColor="purple"
      />
    </>
  );
}
