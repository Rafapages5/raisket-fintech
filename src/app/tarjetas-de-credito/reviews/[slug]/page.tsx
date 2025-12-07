// src/app/tarjetas-de-credito/reviews/[slug]/page.tsx
// Página individual de review para tarjetas de crédito

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getFinancialProducts,
  getProductBySlug,
  type FinancialProduct,
} from '@/lib/financial-products';
import { generateReviewContent } from '@/lib/review-content';
import SchemaScript from '@/lib/schema/SchemaScript';
import {
  generateBreadcrumbSchema,
  generateProductSchema,
  generateArticleSchema,
  generateFAQSchema,
} from '@/lib/schema/generators';
import { Star, Check, X, ExternalLink, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  if (!product || product.category !== 'credit_card') {
    return {
      title: 'Producto no encontrado - Raisket',
    };
  }

  const seoTitle = `${product.name} - Análisis Completo y Opiniones 2025 | Raisket`;
  const seoDescription = `Review completa de ${product.name} de ${product.institution}: costos, beneficios, requisitos y opiniones reales. ${product.description || ''} ⭐ ${product.rating}/5 (${product.review_count} reseñas).`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      product.name,
      product.institution,
      'tarjeta de crédito',
      'review',
      'opiniones',
      'análisis',
      product.badges.includes('Sin Anualidad') ? 'sin anualidad' : '',
      product.badges.includes('Cashback') ? 'cashback' : '',
      'México',
    ].filter(Boolean),
    alternates: {
      canonical: `/tarjetas-de-credito/reviews/${product.slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `https://raisket.mx/tarjetas-de-credito/reviews/${product.slug}`,
      type: 'article',
      images: product.institution_logo ? [{ url: product.institution_logo }] : [],
    },
  };
}

// ============ GENERAR RUTAS ESTÁTICAS ============
export async function generateStaticParams() {
  const products = await getFinancialProducts({ category: 'credit_card' });
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// ============ PÁGINA PRINCIPAL ============
export default async function TarjetaReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.category !== 'credit_card') {
    notFound();
  }

  // Generar contenido editorial
  const reviewContent = generateReviewContent(product);

  // Obtener productos relacionados (misma categoría, diferentes)
  const relatedProducts = (await getFinancialProducts({ category: 'credit_card', limit: 4 }))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  // ============ SCHEMAS ESTRUCTURADOS ============
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://raisket.mx' },
    { name: 'Tarjetas de Crédito', url: 'https://raisket.mx/tarjetas-credito' },
    { name: product.name, url: `https://raisket.mx/tarjetas-de-credito/reviews/${product.slug}` },
  ]);

  const productSchema = generateProductSchema(product);

  const articleSchema = generateArticleSchema({
    headline: `Análisis Completo de ${product.name}`,
    description: reviewContent.overview.content,
    datePublished: product.created_at,
    dateModified: product.updated_at,
    url: `https://raisket.mx/tarjetas-de-credito/reviews/${product.slug}`,
  });

  const faqSchema = generateFAQSchema(
    reviewContent.faq.map((item) => ({
      question: item.question,
      answer: item.answer,
    }))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Schemas */}
      <SchemaScript schema={[breadcrumbSchema, productSchema, articleSchema, faqSchema]} />

      {/* Header Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6 opacity-90">
            <Link href="/" className="hover:underline">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <Link href="/tarjetas-credito" className="hover:underline">
              Tarjetas de Crédito
            </Link>
            <span className="mx-2">/</span>
            <span>{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Información del producto */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {product.institution_logo && (
                  <img
                    src={product.institution_logo}
                    alt={product.institution}
                    className="h-12 w-12 rounded-lg bg-white p-2 object-contain"
                  />
                )}
                <div>
                  <p className="text-sm opacity-90">{product.institution}</p>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                </div>
              </div>

              <p className="text-lg opacity-95 mb-6">{product.description}</p>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${star <= product.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-white/30'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{product.rating.toFixed(1)}/5</span>
                  <span className="text-sm opacity-75">({product.review_count} reseñas)</span>
                </div>
              )}

              {/* Badges */}
              {product.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              {product.main_rate_label && (
                <div className="mb-6">
                  <p className="text-sm opacity-90 mb-1">{product.main_rate_label}</p>
                  <p className="text-4xl font-bold">{product.main_rate_value}</p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {product.benefits.slice(0, 4).map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              {product.apply_url && (
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-white text-emerald-700 hover:bg-gray-100"
                >
                  <a href={product.apply_url} target="_blank" rel="nofollow noopener">
                    Solicitar Ahora
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <article className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {reviewContent.overview.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{reviewContent.overview.content}</p>
            </article>

            {/* Pros y Contras */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pros */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-emerald-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Check className="h-6 w-6 text-emerald-500" />
                  Ventajas
                </h3>
                <ul className="space-y-3">
                  {reviewContent.prosAndCons.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contras */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-red-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <X className="h-6 w-6 text-red-500" />
                  Desventajas
                </h3>
                <ul className="space-y-3">
                  {reviewContent.prosAndCons.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Análisis Detallado */}
            <article className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {reviewContent.detailedAnalysis.title}
              </h2>
              <div className="space-y-6">
                {reviewContent.detailedAnalysis.sections.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {section.subtitle}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* Ideal Para / No Recomendado */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ideal Para */}
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {reviewContent.bestFor.title}
                </h3>
                <ul className="space-y-2">
                  {reviewContent.bestFor.profiles.map((profile, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{profile}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* No Recomendado */}
              {reviewContent.notRecommendedFor.profiles.length > 0 && (
                <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {reviewContent.notRecommendedFor.title}
                  </h3>
                  <ul className="space-y-2">
                    {reviewContent.notRecommendedFor.profiles.map((profile, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{profile}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Cómo Solicitar */}
            <article className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {reviewContent.howToApply.title}
              </h2>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
                Pasos para Solicitar
              </h3>
              <ol className="space-y-3">
                {reviewContent.howToApply.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-semibold text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{step}</span>
                  </li>
                ))}
              </ol>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
                Requisitos Necesarios
              </h3>
              <ul className="space-y-2">
                {reviewContent.howToApply.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* FAQ */}
            <article className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
              <div className="space-y-6">
                {reviewContent.faq.map((item, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.question}
                    </h3>
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* CTA Sticky */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">¿Te interesa esta tarjeta?</h3>
              {product.apply_url && (
                <Button asChild size="lg" className="w-full mb-4 bg-emerald-600 hover:bg-emerald-700">
                  <a href={product.apply_url} target="_blank" rel="nofollow noopener">
                    Solicitar {product.name}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
              {product.info_url && (
                <Button asChild variant="outline" size="lg" className="w-full">
                  <a href={product.info_url} target="_blank" rel="nofollow noopener">
                    Más Información
                  </a>
                </Button>
              )}
            </div>

            {/* Productos Relacionados */}
            {relatedProducts.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Otras Tarjetas Populares
                </h3>
                <div className="space-y-4">
                  {relatedProducts.map((related) => (
                    <Link
                      key={related.id}
                      href={`/tarjetas-de-credito/reviews/${related.slug}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {related.institution_logo && (
                          <img
                            src={related.institution_logo}
                            alt={related.institution}
                            className="h-8 w-8 object-contain"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{related.name}</p>
                          <p className="text-xs text-gray-500">{related.institution}</p>
                        </div>
                      </div>
                      {related.rating > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{related.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
