// src/app/inversiones/mejores/[filtro]/page.tsx
// Página dinámica de "Mejores" inversiones con filtro específico

import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, TrendingUp, CheckCircle2, Info } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getFinancialProducts } from '@/lib/financial-products';
import { getFilterDefinition, getFiltersByCategory, applyFilter } from '@/lib/filters';
import ProductCardNW from '@/components/products/ProductCardNW';
import SchemaScript from '@/lib/schema/SchemaScript';
import {
  generateBreadcrumbSchema,
  generateProductListSchema,
  generateArticleSchema,
} from '@/lib/schema/generators';

export const revalidate = 3600; // Revalidar cada hora

// Generar rutas estáticas en build time
export async function generateStaticParams() {
  const filters = getFiltersByCategory('investment');
  return filters.map((filter) => ({
    filtro: filter.slug,
  }));
}

// Generar metadata dinámicamente
export async function generateMetadata({
  params,
}: {
  params: Promise<{ filtro: string }>;
}): Promise<Metadata> {
  const { filtro } = await params;
  const filter = getFilterDefinition('investment', filtro);

  if (!filter) {
    return {
      title: 'Página no encontrada',
    };
  }

  return {
    title: filter.seoTitle,
    description: filter.seoDescription,
    keywords: [
      'inversiones',
      filter.name,
      'mejores inversiones',
      'México',
      'comparador',
      '2025',
    ],
    alternates: {
      canonical: `/inversiones/mejores/${filter.slug}`,
    },
    openGraph: {
      title: filter.seoTitle,
      description: filter.seoDescription,
      url: `https://raisket.mx/inversiones/mejores/${filter.slug}`,
      type: 'article',
    },
  };
}

export default async function MejoresInversionesPage({
  params,
}: {
  params: Promise<{ filtro: string }>;
}) {
  const { filtro } = await params;
  // Obtener definición del filtro
  const filter = getFilterDefinition('investment', filtro);

  if (!filter) {
    notFound();
  }

  // Obtener todos los productos de inversiones
  const allProducts = await getFinancialProducts({ category: 'investment' });

  // Aplicar filtro
  const filteredProducts = applyFilter(allProducts, filter);

  // Si no hay productos, mostrar mensaje
  if (filteredProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1A365D] mb-2">
            No hay productos disponibles
          </h1>
          <p className="text-[#64748B] mb-6">
            Estamos trabajando en agregar más productos con este filtro.
          </p>
          <Link
            href="/inversiones"
            className="text-[#00D9A5] hover:underline"
          >
            ← Volver a Inversiones
          </Link>
        </div>
      </div>
    );
  }

  // Generar schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://raisket.mx' },
    { name: 'Inversiones', url: 'https://raisket.mx/inversiones' },
    { name: `Mejores ${filter.name}` },
  ]);

  const productListSchema = generateProductListSchema(filteredProducts, {
    name: filter.seoTitle,
    description: filter.seoDescription,
  });

  const articleSchema = generateArticleSchema({
    title: filter.seoTitle,
    description: filter.editorial.intro,
    datePublished: new Date().toISOString(),
    url: `https://raisket.mx/inversiones/mejores/${filter.slug}`,
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Schema.org JSON-LD */}
      <SchemaScript schema={[breadcrumbSchema, productListSchema, articleSchema]} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-[#64748B] flex-wrap">
            <Link href="/" className="hover:text-[#00D9A5]">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link
              href="/inversiones"
              className="hover:text-[#00D9A5]"
            >
              Inversiones
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-[#1A365D] font-medium">
              Mejores {filter.name}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1A365D] to-[#2D4A68] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#00D9A5] rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{filter.h1}</h1>
            </div>
            <p className="text-lg text-gray-300 mb-6">
              {filter.editorial.intro}
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>Comparación 100% gratuita</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>Actualizado 2025</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>{filteredProducts.length} opciones comparadas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Metodología */}
        <section className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-semibold text-[#1A365D] mb-2">
                Nuestra Metodología de Selección
              </h2>
              <p className="text-[#64748B] text-sm">
                {filter.editorial.metodologia}
              </p>
            </div>
          </div>
        </section>

        {/* Lista de Productos */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A365D] mb-6">
            Top {filteredProducts.length} - {filter.name}
          </h2>

          <div className="space-y-6">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="relative">
                {/* Ranking Badge */}
                {index < 3 && (
                  <div className="absolute -left-2 -top-2 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                      #{index + 1}
                    </div>
                  </div>
                )}
                <ProductCardNW
                  product={product}
                  variant={index === 0 ? 'featured' : 'default'}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Tips Section */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1A365D] mb-6">
            💡 Tips Raisket para {filter.name}
          </h2>
          <ul className="space-y-4">
            {filter.editorial.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                <span className="text-[#334155]">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Filtros Relacionados */}
        <section className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-[#1A365D] mb-6">
            Otras Comparativas Populares
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFiltersByCategory('investment')
              .filter((f) => f.slug !== filter.slug)
              .slice(0, 6)
              .map((relatedFilter) => (
                <Link
                  key={relatedFilter.slug}
                  href={`/inversiones/mejores/${relatedFilter.slug}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-[#00D9A5] hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-[#1A365D] mb-2">
                    {relatedFilter.name}
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    {relatedFilter.description}
                  </p>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
