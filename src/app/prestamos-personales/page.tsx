// src/app/prestamos-personales/page.tsx
// Página de categoría: Préstamos Personales - Estilo NerdWallet

import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Filter, Banknote, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFinancialProducts } from '@/lib/financial-products';
import ProductCardNW from '@/components/products/ProductCardNW';
import SchemaScript from '@/lib/schema/SchemaScript';
import {
  generateBreadcrumbSchema,
  generateProductListSchema,
  generateArticleSchema,
} from '@/lib/schema/generators';

export const metadata: Metadata = {
  title: 'Los Mejores Préstamos Personales en México 2025',
  description: 'Compara préstamos personales con las mejores tasas. Préstamos rápidos, sin aval y con aprobación inmediata. Análisis experto actualizado.',
  keywords: ['préstamos personales', 'créditos', 'préstamos rápidos', 'sin aval', 'México', 'comparador préstamos'],
  alternates: {
    canonical: '/prestamos-personales',
  },
};

export const revalidate = 3600;

const loanTypes = [
  { id: 'all', name: 'Todos los Préstamos', count: 0 },
  { id: 'rapidos', name: 'Aprobación Rápida', count: 0 },
  { id: 'sin-aval', name: 'Sin Aval', count: 0 },
  { id: 'p2p', name: 'Préstamos P2P', count: 0 },
  { id: 'nomina', name: 'Préstamos de Nómina', count: 0 },
  { id: 'bancos', name: 'Bancos Tradicionales', count: 0 },
];

export default async function PrestamosPersonalesPage() {
  const products = await getFinancialProducts({ category: 'personal_loan' });

  // Generar Schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://raisket.mx' },
    { name: 'Préstamos Personales' },
  ]);

  const productListSchema = generateProductListSchema(products, {
    name: 'Los Mejores Préstamos Personales en México 2025',
    description: 'Listado completo de préstamos personales comparados por Raisket',
  });

  const articleSchema = generateArticleSchema({
    title: 'Los Mejores Préstamos Personales en México 2025',
    description: 'Guía completa para elegir el mejor préstamo personal según tus necesidades',
    datePublished: new Date().toISOString(),
    url: 'https://raisket.mx/prestamos-personales',
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Schema.org JSON-LD */}
      <SchemaScript schema={[breadcrumbSchema, productListSchema, articleSchema]} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-[#64748B]">
            <Link href="/" className="hover:text-[#00D9A5]">Inicio</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-[#1A365D] font-medium">Préstamos Personales</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1A365D] to-[#2D4A68] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#4FD1C7] rounded-lg flex items-center justify-center">
                <Banknote className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Los Mejores Préstamos Personales en México
              </h1>
            </div>
            <p className="text-lg text-gray-300 mb-6">
              Compara préstamos personales con las mejores tasas de interés. Encuentra opciones
              rápidas, sin aval y con montos desde $1,000 hasta $2,000,000 MXN.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>Tasas desde 8.9% anual</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>Comparación imparcial</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>{products.length}+ opciones disponibles</span>
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
                {loanTypes.map((type) => (
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

              {/* Calculator Widget */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-[#1A365D] mb-3 text-sm">🧮 Calcula tu pago</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Monto</label>
                    <input
                      type="number"
                      placeholder="$50,000"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D9A5]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Plazo (meses)</label>
                    <input
                      type="number"
                      placeholder="12"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D9A5]"
                    />
                  </div>
                  <Button className="w-full bg-[#00D9A5] hover:bg-[#00C294] text-sm">
                    Calcular
                  </Button>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-[#1A365D] mb-3 text-sm">⚠️ Importante</h3>
                <ul className="space-y-2 text-xs text-[#64748B]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#F59E0B] mt-0.5">•</span>
                    <span>Compara el CAT, no solo la tasa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F59E0B] mt-0.5">•</span>
                    <span>Evita préstamos con más del 50% CAT</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F59E0B] mt-0.5">•</span>
                    <span>Lee los términos antes de firmar</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Warning Banner */}
            <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-[#1A365D] mb-1">
                  Cuidado con los préstamos de alto costo
                </p>
                <p className="text-[#64748B]">
                  Algunos préstamos pueden tener CAT superiores al 300%. Compara siempre el costo total
                  antes de solicitar y solo pide lo que puedas pagar.
                </p>
              </div>
            </div>

            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1A365D] mb-2">
                {products.length} préstamos disponibles
              </h2>
              <p className="text-[#64748B]">
                Ordenados por tasa de interés (menor a mayor CAT)
              </p>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="space-y-6">
                {products.map((product, index) => (
                  <div key={product.id} className="relative">
                    {index < 3 && (
                      <div className="absolute -left-2 -top-2 z-10">
                        <div className="bg-[#4FD1C7] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          #{index + 1} Mejor Tasa
                        </div>
                      </div>
                    )}
                    <ProductCardNW product={product} variant={index === 0 ? 'featured' : 'default'} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Banknote className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#1A365D] mb-2">
                  No se encontraron préstamos
                </h3>
                <p className="text-[#64748B] mb-6">
                  Estamos trabajando en agregar más opciones. Vuelve pronto.
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
            Guía: ¿Cómo elegir el mejor préstamo personal?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-[#1A365D] mb-3">
                Factores a comparar
              </h3>
              <ul className="space-y-3 text-[#334155]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>CAT:</strong> El indicador más importante. Incluye todos los costos
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Monto y plazo:</strong> Verifica que se ajusten a tu necesidad
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Requisitos:</strong> Ingreso mínimo, aval, garantías
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Tiempo de aprobación:</strong> Desde segundos hasta días
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#1A365D] mb-3">
                Tipos de préstamos
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-[#00D9A5]/5 rounded-lg border border-[#00D9A5]/20">
                  <h4 className="font-semibold text-[#1A365D] mb-1">
                    🏦 Préstamos bancarios
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    Tasas bajas (8-30% anual) pero requieren buen historial y trámites
                  </p>
                </div>
                <div className="p-4 bg-[#8B5CF6]/5 rounded-lg border border-[#8B5CF6]/20">
                  <h4 className="font-semibold text-[#1A365D] mb-1">
                    🤝 Préstamos P2P
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    Tasas competitivas (12-40%) conectando directamente con inversionistas
                  </p>
                </div>
                <div className="p-4 bg-[#F59E0B]/5 rounded-lg border border-[#F59E0B]/20">
                  <h4 className="font-semibold text-[#1A365D] mb-1">
                    ⚡ Préstamos rápidos
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    Aprobación inmediata pero CAT muy alto (100-400%). Solo emergencias
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
                ¿Qué documentos necesito para solicitar un préstamo?
              </h3>
              <p className="text-[#64748B]">
                Generalmente necesitas: INE vigente, comprobante de domicilio, comprobante de ingresos
                (recibos de nómina o declaraciones de impuestos) y estado de cuenta bancario. Los préstamos
                en línea suelen requerir menos documentos.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A365D] mb-2">
                ¿Puedo obtener un préstamo con mal historial crediticio?
              </h3>
              <p className="text-[#64748B]">
                Sí, existen opciones como Yotepresto o Kueski que consideran otros factores además del Buró.
                Sin embargo, las tasas suelen ser más altas. Trabaja en mejorar tu score para acceder a
                mejores condiciones.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A365D] mb-2">
                ¿Qué pasa si no puedo pagar mi préstamo?
              </h3>
              <p className="text-[#64748B]">
                Contacta inmediatamente a tu acreedor para negociar. Los pagos atrasados generan intereses
                moratorios y afectan tu historial crediticio. Nunca tomes otro préstamo para pagar uno existente
                sin antes buscar asesoría.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
