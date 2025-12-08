// src/app/inversiones/page.tsx
// Página de categoría: Inversiones - Estilo NerdWallet

import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Filter, TrendingUp, CheckCircle2, Shield } from 'lucide-react';
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
  title: 'Las Mejores Inversiones en México 2025 | Raisket',
  description: 'Compara CETES, pagarés bancarios, fondos de inversión y más. Invierte desde $100 con las mejores tasas y rendimientos del mercado mexicano. Análisis experto actualizado.',
  keywords: ['inversiones', 'CETES', 'pagarés', 'fondos de inversión', 'GAT', 'México', 'comparador inversiones'],
  alternates: {
    canonical: '/comparadores/inversiones',
  },
};

export const revalidate = 3600;

const investmentTypes = [
  { id: 'all', name: 'Todas las Inversiones', count: 0 },
  { id: 'cetes', name: 'CETES y Gobierno', count: 0 },
  { id: 'pagares', name: 'Pagarés Bancarios', count: 0 },
  { id: 'bolsa', name: 'Bolsa de Valores', count: 0 },
  { id: 'fondos', name: 'Fondos de Inversión', count: 0 },
  { id: 'crypto', name: 'Criptomonedas', count: 0 },
];

const riskLevels = [
  { level: 'Muy Bajo', color: 'bg-[#00D9A5]', description: 'CETES, pagarés gubernamentales' },
  { level: 'Bajo', color: 'bg-[#4FD1C7]', description: 'Pagarés bancarios, bonos' },
  { level: 'Medio', color: 'bg-[#F59E0B]', description: 'Fondos mixtos, ETFs' },
  { level: 'Alto', color: 'bg-[#EF4444]', description: 'Acciones, criptomonedas' },
];

export default async function InversionesPage() {
  const products = await getFinancialProducts({ category: 'investment' });

  // Generar Schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://raisket.mx' },
    { name: 'Inversiones' },
  ]);

  const productListSchema = generateProductListSchema(products, {
    name: 'Las Mejores Inversiones en México 2025',
    description: 'Listado completo de opciones de inversión comparadas por Raisket',
  });

  const articleSchema = generateArticleSchema({
    title: 'Las Mejores Inversiones en México 2025',
    description: 'Guía completa para comenzar a invertir en México con opciones reguladas y seguras',
    datePublished: new Date().toISOString(),
    url: 'https://raisket.mx/comparadores/inversiones',
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
            <span className="text-[#1A365D] font-medium">Inversiones</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1A365D] to-[#2D4A68] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Las Mejores Inversiones en México
              </h1>
            </div>
            <p className="text-lg text-gray-300 mb-6">
              Compara CETES, pagarés bancarios, fondos de inversión y más. Invierte desde $100
              y haz crecer tu dinero con las mejores opciones del mercado mexicano.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>Inversión desde $100</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>Rendimientos hasta 15% anual</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>{products.length}+ opciones comparadas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20 space-y-6">
              {/* Type Filter */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5 text-[#1A365D]" />
                  <h2 className="font-semibold text-[#1A365D]">Tipo de inversión</h2>
                </div>
                <div className="space-y-2">
                  {investmentTypes.map((type) => (
                    <button
                      key={type.id}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className={type.id === 'all' ? 'text-[#00D9A5] font-medium' : 'text-[#334155]'}>
                          {type.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk Level Guide */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-[#1A365D] mb-3 text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Nivel de riesgo
                </h3>
                <div className="space-y-2">
                  {riskLevels.map((risk) => (
                    <div key={risk.level} className="flex items-start gap-2">
                      <div className={`${risk.color} w-3 h-3 rounded-full mt-1 flex-shrink-0`} />
                      <div>
                        <div className="text-xs font-medium text-[#1A365D]">{risk.level}</div>
                        <div className="text-xs text-[#64748B]">{risk.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculator */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-[#1A365D] mb-3 text-sm">🧮 Calcula rendimiento</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Monto inicial</label>
                    <input
                      type="number"
                      placeholder="$10,000"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D9A5]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Rendimiento anual</label>
                    <input
                      type="number"
                      placeholder="10%"
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
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-[#1A365D] mb-3 text-sm">💡 Tips para invertir</h3>
                <ul className="space-y-2 text-xs text-[#64748B]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00D9A5] mt-0.5">•</span>
                    <span>Diversifica tu portafolio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00D9A5] mt-0.5">•</span>
                    <span>Verifica que esté regulado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00D9A5] mt-0.5">•</span>
                    <span>Compara GAT Real, no solo Nominal</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Info Banner */}
            <div className="bg-[#00D9A5]/10 border border-[#00D9A5]/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Shield className="h-5 w-5 text-[#00D9A5] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-[#1A365D] mb-1">
                  Invierte de forma segura y regulada
                </p>
                <p className="text-[#64748B]">
                  Todas las opciones listadas están reguladas por la CNBV o respaldadas por el Gobierno Federal.
                  Tu dinero está protegido.
                </p>
              </div>
            </div>

            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1A365D] mb-2">
                {products.length} opciones de inversión
              </h2>
              <p className="text-[#64748B]">
                Ordenadas por rendimiento y nivel de riesgo
              </p>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="space-y-6">
                {products.map((product, index) => (
                  <div key={product.id} className="relative">
                    {index < 3 && (
                      <div className="absolute -left-2 -top-2 z-10">
                        <div className="bg-[#F59E0B] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          #{index + 1} Top Rendimiento
                        </div>
                      </div>
                    )}
                    <ProductCardNW product={product} variant={index === 0 ? 'featured' : 'default'} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#1A365D] mb-2">
                  No se encontraron inversiones
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
            Guía para comenzar a invertir en México
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-[#1A365D] mb-3">
                Pasos para invertir
              </h3>
              <ul className="space-y-3 text-[#334155]">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00D9A5] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <strong>Define tu objetivo:</strong> ¿Para qué estás ahorrando? (retiro, emergencia, metas)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00D9A5] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <strong>Evalúa tu perfil de riesgo:</strong> Conservador, moderado o agresivo
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00D9A5] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <strong>Diversifica:</strong> No pongas todo tu dinero en una sola inversión
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00D9A5] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <strong>Empieza pequeño:</strong> Puedes comenzar con solo $100 en CETES
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#1A365D] mb-3">
                Tipos de inversiones
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-[#00D9A5]/5 rounded-lg border border-[#00D9A5]/20">
                  <h4 className="font-semibold text-[#1A365D] mb-1 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    CETES (Muy Bajo Riesgo)
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    Respaldado por el Gobierno Federal. GAT Real 5-11%. Desde $100. Ideal para principiantes.
                  </p>
                </div>
                <div className="p-4 bg-[#4FD1C7]/5 rounded-lg border border-[#4FD1C7]/20">
                  <h4 className="font-semibold text-[#1A365D] mb-1">
                    📊 Pagarés Bancarios (Bajo Riesgo)
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    Protegido por IPAB. GAT 10-15%. Liquidez diaria. Para ahorro de corto plazo.
                  </p>
                </div>
                <div className="p-4 bg-[#F59E0B]/5 rounded-lg border border-[#F59E0B]/20">
                  <h4 className="font-semibold text-[#1A365D] mb-1">
                    📈 Fondos/ETFs (Medio-Alto Riesgo)
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    Rendimiento variable. Acceso a bolsa sin comprar acciones individuales. Largo plazo.
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
                ¿Qué es el GAT y para qué sirve?
              </h3>
              <p className="text-[#64748B]">
                La Ganancia Anual Total (GAT) muestra el rendimiento de tu inversión en un año. El GAT Real
                descuenta la inflación, mostrando tu ganancia real. Siempre compara el GAT Real.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A365D] mb-2">
                ¿Qué significa que mi inversión esté protegida por IPAB?
              </h3>
              <p className="text-[#64748B]">
                El IPAB (Instituto para la Protección al Ahorro Bancario) protege tus depósitos hasta 400,000 UDIs
                (aproximadamente $3 millones de pesos) por persona y por institución. Si el banco quiebra, recuperas
                tu dinero.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A365D] mb-2">
                ¿Cuánto debo invertir para empezar?
              </h3>
              <p className="text-[#64748B]">
                Puedes empezar con tan solo $100 en CETES o Hey Banco. Lo importante es crear el hábito. Aumenta
                tu inversión gradualmente conforme te sientas cómodo. Recuerda: nunca inviertas dinero que necesites
                en el corto plazo.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
