// src/app/tarjetas-credito/page.tsx
// Página de categoría: Tarjetas de Crédito - Estilo NerdWallet

import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Filter, Star, CreditCard, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFinancialProducts } from '@/lib/financial-products';
import ProductCardNW from '@/components/products/ProductCardNW';
import SchemaScript from '@/lib/schema/SchemaScript';
import {
  generateBreadcrumbSchema,
  generateProductListSchema,
  generateFAQSchema,
  generateArticleSchema,
} from '@/lib/schema/generators';

export const metadata: Metadata = {
  title: 'Las Mejores Tarjetas de Crédito en México 2025',
  description: 'Compara las mejores tarjetas de crédito sin anualidad, con cashback y puntos. Encuentra la tarjeta perfecta según tu perfil financiero. Análisis experto actualizado.',
  keywords: ['tarjetas de crédito', 'mejores tarjetas', 'sin anualidad', 'cashback', 'puntos', 'México', 'comparador tarjetas'],
  alternates: {
    canonical: '/tarjetas-de-credito',
  },
  openGraph: {
    title: 'Las Mejores Tarjetas de Crédito en México 2025',
    description: 'Compara las mejores tarjetas de crédito sin anualidad, con cashback y puntos.',
    url: 'https://raisket.mx/tarjetas-de-credito',
    type: 'website',
  },
};

export const revalidate = 3600;

// Tipos de tarjetas (sub-filtros)
const cardTypes = [
  { id: 'all', name: 'Todas las Tarjetas', count: 0 },
  { id: 'sin-anualidad', name: 'Sin Anualidad', count: 0 },
  { id: 'cashback', name: 'Con Cashback', count: 0 },
  { id: 'puntos', name: 'Con Puntos', count: 0 },
  { id: 'viajes', name: 'Para Viajes', count: 0 },
  { id: 'estudiantes', name: 'Para Estudiantes', count: 0 },
];

export default async function TarjetasCreditoPage() {
  const products = await getFinancialProducts({ category: 'credit_card' });

  // Generar Schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://raisket.mx' },
    { name: 'Tarjetas de Crédito' },
  ]);

  const productListSchema = generateProductListSchema(products, {
    name: 'Las Mejores Tarjetas de Crédito en México 2025',
    description: 'Listado completo de tarjetas de crédito comparadas por Raisket',
  });

  const articleSchema = generateArticleSchema({
    title: 'Las Mejores Tarjetas de Crédito en México 2025',
    description: 'Guía completa para elegir la mejor tarjeta de crédito según tu perfil financiero',
    datePublished: new Date().toISOString(),
    url: 'https://raisket.mx/tarjetas-de-credito',
  });

  const faqSchema = generateFAQSchema([
    {
      question: '¿Qué es el CAT y por qué es importante?',
      answer: 'El CAT (Costo Anual Total) es el indicador más completo del costo de una tarjeta de crédito. Incluye la tasa de interés, anualidad, comisiones y todos los gastos. Entre menor sea el CAT, mejor para ti.',
    },
    {
      question: '¿Puedo obtener una tarjeta sin historial en Buró de Crédito?',
      answer: 'Sí, varias tarjetas como Nu, Stori y Klar están diseñadas para personas sin historial crediticio. Estas tarjetas te ayudan a construir tu perfil desde cero.',
    },
    {
      question: '¿Qué es mejor: cashback o puntos?',
      answer: 'Depende de tu estilo de vida. El cashback es más simple y te devuelve dinero directamente. Los puntos pueden ser más valiosos si viajas frecuentemente o compras en tiendas específicas, pero requieren más estrategia para maximizar su valor.',
    },
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Schema.org JSON-LD */}
      <SchemaScript schema={[breadcrumbSchema, productListSchema, articleSchema, faqSchema]} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-[#64748B]">
            <Link href="/" className="hover:text-[#00D9A5]">Inicio</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-[#1A365D] font-medium">Tarjetas de Crédito</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1A365D] to-[#2D4A68] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#00D9A5] rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Las Mejores Tarjetas de Crédito en México
              </h1>
            </div>
            <p className="text-lg text-gray-300 mb-6">
              Compara las mejores tarjetas de crédito sin anualidad, con cashback y puntos.
              Encuentra la tarjeta perfecta según tu perfil y necesidades financieras.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>Comparación 100% gratuita</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>Información actualizada</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>{products.length}+ tarjetas comparadas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-[#1A365D]" />
                <h2 className="font-semibold text-[#1A365D]">Filtrar por tipo</h2>
              </div>

              <div className="space-y-2">
                {cardTypes.map((type) => (
                  <button
                    key={type.id}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className={type.id === 'all' ? 'text-[#00D9A5] font-medium' : 'text-[#334155]'}>
                        {type.name}
                      </span>
                      {type.count > 0 && (
                        <span className="text-xs text-[#64748B]">({type.count})</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Tips */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-[#1A365D] mb-3 text-sm">💡 Tips Raisket</h3>
                <ul className="space-y-2 text-xs text-[#64748B]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00D9A5] mt-0.5">•</span>
                    <span>Compara el CAT, no solo la tasa de interés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00D9A5] mt-0.5">•</span>
                    <span>Verifica si hay anualidad después del primer año</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00D9A5] mt-0.5">•</span>
                    <span>Lee las reseñas de usuarios reales</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1A365D] mb-2">
                {products.length} tarjetas disponibles
              </h2>
              <p className="text-[#64748B]">
                Ordenadas por calificación y popularidad
              </p>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="space-y-6">
                {products.map((product, index) => (
                  <div key={product.id} className="relative">
                    {/* Ranking Badge */}
                    {index < 3 && (
                      <div className="absolute -left-2 -top-2 z-10">
                        <div className="bg-[#F59E0B] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          #{index + 1} Top
                        </div>
                      </div>
                    )}
                    <ProductCardNW product={product} variant={index === 0 ? 'featured' : 'default'} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#1A365D] mb-2">
                  No se encontraron tarjetas
                </h3>
                <p className="text-[#64748B] mb-6">
                  Estamos trabajando en agregar más productos. Vuelve pronto.
                </p>
                <Link href="/">
                  <Button className="bg-[#00D9A5] hover:bg-[#00C294]">
                    Volver al inicio
                  </Button>
                </Link>
              </div>
            )}
          </main>
        </div>

        {/* Educational Content */}
        <section className="mt-16 bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-[#1A365D] mb-6">
            Guía: ¿Cómo elegir la mejor tarjeta de crédito?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-[#1A365D] mb-3">
                Factores clave a considerar
              </h3>
              <ul className="space-y-3 text-[#334155]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>CAT (Costo Anual Total):</strong> Compara el costo real incluyendo todos los cargos
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Anualidad:</strong> Muchas tarjetas ofrecen $0 de anualidad de por vida
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Beneficios:</strong> Cashback, puntos, seguros o acceso a salas VIP
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Requisitos:</strong> Ingreso mínimo y score en Buró de Crédito
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#1A365D] mb-3">
                Recomendaciones según perfil
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-[#00D9A5]/5 rounded-lg border border-[#00D9A5]/20">
                  <h4 className="font-semibold text-[#1A365D] mb-1">
                    🎓 Primera tarjeta
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    Busca tarjetas sin requisito de Buró de Crédito y sin anualidad
                  </p>
                </div>
                <div className="p-4 bg-[#8B5CF6]/5 rounded-lg border border-[#8B5CF6]/20">
                  <h4 className="font-semibold text-[#1A365D] mb-1">
                    ✈️ Viajeros frecuentes
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    Tarjetas con puntos canjeables por vuelos y acceso a salas VIP
                  </p>
                </div>
                <div className="p-4 bg-[#F59E0B]/5 rounded-lg border border-[#F59E0B]/20">
                  <h4 className="font-semibold text-[#1A365D] mb-1">
                    💰 Maximizar ahorro
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    Tarjetas con alto cashback en categorías que más uses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-[#1A365D] mb-6">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-[#1A365D] mb-2">
                ¿Qué es el CAT y por qué es importante?
              </h3>
              <p className="text-[#64748B]">
                El CAT (Costo Anual Total) es el indicador más completo del costo de una tarjeta de crédito.
                Incluye la tasa de interés, anualidad, comisiones y todos los gastos. Entre menor sea el CAT,
                mejor para ti.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A365D] mb-2">
                ¿Puedo obtener una tarjeta sin historial en Buró de Crédito?
              </h3>
              <p className="text-[#64748B]">
                Sí, varias tarjetas como Nu, Stori y Klar están diseñadas para personas sin historial crediticio.
                Estas tarjetas te ayudan a construir tu perfil desde cero.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A365D] mb-2">
                ¿Qué es mejor: cashback o puntos?
              </h3>
              <p className="text-[#64748B]">
                Depende de tu estilo de vida. El cashback es más simple y te devuelve dinero directamente.
                Los puntos pueden ser más valiosos si viajas frecuentemente o compras en tiendas específicas,
                pero requieren más estrategia para maximizar su valor.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
