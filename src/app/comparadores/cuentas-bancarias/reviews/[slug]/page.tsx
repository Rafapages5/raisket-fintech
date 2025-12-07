// src/app/cuentas-bancarias/reviews/[slug]/page.tsx
// Página individual de review para cuentas bancarias

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
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product || product.category !== 'banking') {
    return {
      title: 'Producto no encontrado - Raisket',
    };
  }

  const seoTitle = `${product.name} - Análisis Completo y Opiniones 2025 | Raisket`;
  const seoDescription = `Review completa de ${product.name} de ${product.institution}: comisiones, rendimientos, beneficios y opiniones reales. ${product.description || ''} ⭐ ${product.rating}/5 (${product.review_count} reseñas).`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      product.name,
      product.institution,
      'cuenta bancaria',
      'review',
      'opiniones',
      'análisis',
      product.badges.includes('Sin Comisiones') ? 'sin comisiones' : '',
      product.badges.includes('100% Digital') ? 'digital' : '',
      'México',
    ].filter(Boolean),
    alternates: {
      canonical: `/cuentas-bancarias/reviews/${product.slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `https://raisket.mx/cuentas-bancarias/reviews/${product.slug}`,
      type: 'article',
      images: product.institution_logo ? [{ url: product.institution_logo }] : [],
    },
  };
}

// ============ GENERAR RUTAS ESTÁTICAS ============
export async function generateStaticParams() {
  const products = await getFinancialProducts({ category: 'banking' });
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// ============ PÁGINA PRINCIPAL ============
export default async function CuentaReviewPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product || product.category !== 'banking') {
    notFound();
  }

  // Generar contenido editorial
  const reviewContent = generateReviewContent(product);

  // Obtener productos relacionados
  const relatedProducts = (await getFinancialProducts({ category: 'banking', limit: 4 }))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  // ============ SCHEMAS ESTRUCTURADOS ============
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://raisket.mx' },
    { name: 'Cuentas Bancarias', url: 'https://raisket.mx/cuentas-bancarias' },
    { name: product.name, url: `https://raisket.mx/cuentas-bancarias/reviews/${product.slug}` },
  ]);

  const productSchema = generateProductSchema(product);

  const articleSchema = generateArticleSchema({
    headline: `Análisis Completo de ${product.name}`,
    description: reviewContent.overview.content,
    datePublished: product.created_at,
    dateModified: product.updated_at,
    url: `https://raisket.mx/cuentas-bancarias/reviews/${product.slug}`,
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
        categoryName="Cuentas Bancarias"
        categoryPath="cuentas-bancarias"
        gradientColors="from-blue-600 via-blue-700 to-sky-800"
        accentColor="blue"
      />
    </>
  );
}
