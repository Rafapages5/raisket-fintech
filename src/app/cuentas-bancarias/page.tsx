// src/app/cuentas-bancarias/page.tsx
// Página de categoría: Cuentas Bancarias - Estilo NerdWallet

import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Filter, Building2, CheckCircle2, Zap, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFinancialProducts } from '@/lib/financial-products';
import ProductCardNW from '@/components/products/ProductCardNW';

export const metadata: Metadata = {
  title: 'Las Mejores Cuentas Bancarias en México 2025 | Raisket',
  description: 'Compara cuentas bancarias sin comisiones y con alto rendimiento. Cuentas digitales desde $0 con rendimientos hasta 15% anual.',
  keywords: ['cuentas bancarias', 'sin comisiones', 'rendimiento', 'cuentas digitales', 'México'],
};

export const revalidate = 3600;

const accountTypes = [
  { id: 'all', name: 'Todas las Cuentas', count: 0 },
  { id: 'sin-comisiones', name: 'Sin Comisiones', count: 0 },
  { id: 'rendimiento', name: 'Con Rendimiento', count: 0 },
  { id: 'digitales', name: '100% Digitales', count: 0 },
  { id: 'tradicionales', name: 'Bancos Tradicionales', count: 0 },
];

export default async function CuentasBancariasPage() {
  const products = await getFinancialProducts({ category: 'banking' });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-[#64748B]">
            <Link href="/" className="hover:text-[#00D9A5]">Inicio</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-[#1A365D] font-medium">Cuentas Bancarias</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1A365D] to-[#2D4A68] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#8B5CF6] rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Las Mejores Cuentas Bancarias en México
              </h1>
            </div>
            <p className="text-lg text-gray-300 mb-6">
              Compara cuentas bancarias sin comisiones y con alto rendimiento. Encuentra cuentas
              digitales 100% en línea con rendimientos de hasta 15% anual sobre tu saldo.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>$0 en comisiones</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>Rendimiento hasta 15% anual</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#00D9A5]" />
                <span>{products.length}+ cuentas comparadas</span>
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
                  <h2 className="font-semibold text-[#1A365D]">Tipo de cuenta</h2>
                </div>
                <div className="space-y-2">
                  {accountTypes.map((type) => (
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

              {/* Features Checklist */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-[#1A365D] mb-3 text-sm">
                  ✨ Características ideales
                </h3>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-[#00D9A5] focus:ring-[#00D9A5]" />
                    <span className="text-[#334155]">Sin comisiones</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-[#00D9A5] focus:ring-[#00D9A5]" />
                    <span className="text-[#334155]">Con rendimiento</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-[#00D9A5] focus:ring-[#00D9A5]" />
                    <span className="text-[#334155]">100% digital</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-[#00D9A5] focus:ring-[#00D9A5]" />
                    <span className="text-[#334155]">Cajeros gratis</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-[#00D9A5] focus:ring-[#00D9A5]" />
                    <span className="text-[#334155]">Sin saldo mínimo</span>
                  </label>
                </div>
              </div>

              {/* Comparison Tool */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-[#1A365D] mb-3 text-sm flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Calcula tu rendimiento
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Saldo promedio</label>
                    <input
                      type="number"
                      placeholder="$5,000"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D9A5]"
                    />
                  </div>
                  <div className="bg-[#F8FAFC] p-3 rounded-lg">
                    <div className="text-xs text-[#64748B] mb-1">Ganarías al año:</div>
                    <div className="text-lg font-bold text-[#00D9A5]">$750</div>
                    <div className="text-xs text-[#64748B]">Con 15% de rendimiento</div>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-[#1A365D] mb-3 text-sm">💡 Consejos</h3>
                <ul className="space-y-2 text-xs text-[#64748B]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00D9A5] mt-0.5">•</span>
                    <span>Verifica que sea una institución regulada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00D9A5] mt-0.5">•</span>
                    <span>Lee bien las comisiones ocultas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00D9A5] mt-0.5">•</span>
                    <span>Confirma protección IPAB</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Info Banner */}
            <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Zap className="h-5 w-5 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-[#1A365D] mb-1">
                  La era digital llegó a la banca
                </p>
                <p className="text-[#64748B]">
                  Las cuentas 100% digitales ofrecen mejores tasas de rendimiento al no tener costos de sucursales.
                  Todas están reguladas y tu dinero está protegido por IPAB.
                </p>
              </div>
            </div>

            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1A365D] mb-2">
                {products.length} cuentas disponibles
              </h2>
              <p className="text-[#64748B]">
                Ordenadas por rendimiento y beneficios
              </p>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="space-y-6">
                {products.map((product, index) => (
                  <div key={product.id} className="relative">
                    {index < 3 && (
                      <div className="absolute -left-2 -top-2 z-10">
                        <div className="bg-[#8B5CF6] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          #{index + 1} Mejor Rendimiento
                        </div>
                      </div>
                    )}
                    <ProductCardNW product={product} variant={index === 0 ? 'featured' : 'default'} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#1A365D] mb-2">
                  No se encontraron cuentas
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
            Guía: ¿Cómo elegir la mejor cuenta bancaria?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-[#1A365D] mb-3">
                Comisiones a verificar
              </h3>
              <ul className="space-y-3 text-[#334155]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Manejo de cuenta:</strong> Busca $0 MXN mensuales
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Retiros en cajero:</strong> Idealmente ilimitados o gratis en red amplia
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Transferencias SPEI:</strong> Deben ser gratuitas
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Saldo mínimo:</strong> Sin requisito o muy bajo
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#1A365D] mb-3">
                Tipos de cuentas
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-[#8B5CF6]/5 rounded-lg border border-[#8B5CF6]/20">
                  <h4 className="font-semibold text-[#1A365D] mb-1 flex items-center gap-2">
                    📱 Cuentas Digitales
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    100% en app. Sin sucursales. Mejor rendimiento. Ideal para quien no necesita ventanilla.
                  </p>
                </div>
                <div className="p-4 bg-[#00D9A5]/5 rounded-lg border border-[#00D9A5]/20">
                  <h4 className="font-semibold text-[#1A365D] mb-1">
                    🏦 Bancos Tradicionales
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    Red de sucursales física. Atención presencial. Mayor variedad de servicios.
                  </p>
                </div>
                <div className="p-4 bg-[#4FD1C7]/5 rounded-lg border border-[#4FD1C7]/20">
                  <h4 className="font-semibold text-[#1A365D] mb-1">
                    💰 Cuentas con Rendimiento
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    Tu dinero genera intereses diariamente. Perfecto para fondos de emergencia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mt-12 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#1A365D]">
              Tabla comparativa rápida
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Característica
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Cuenta Digital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Banco Tradicional
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1A365D]">
                    Comisión mensual
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#00D9A5]">
                    $0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B]">
                    $100-300
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1A365D]">
                    Rendimiento
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#00D9A5]">
                    10-15% anual
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B]">
                    0-5% anual
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1A365D]">
                    Apertura
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#00D9A5]">
                    5-10 minutos
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B]">
                    Visita sucursal
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1A365D]">
                    Atención
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B]">
                    Solo app/chat
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#00D9A5]">
                    Sucursal física
                  </td>
                </tr>
              </tbody>
            </table>
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
                ¿Las cuentas digitales son seguras?
              </h3>
              <p className="text-[#64748B]">
                Sí, todas las cuentas listadas están reguladas por la CNBV y protegidas por IPAB hasta
                400,000 UDIs (~$3 millones). Usan encriptación bancaria y autenticación de dos factores.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A365D] mb-2">
                ¿Por qué las cuentas digitales dan más rendimiento?
              </h3>
              <p className="text-[#64748B]">
                Al no tener sucursales físicas, ahorran en costos operativos y pasan esos ahorros a los usuarios
                en forma de mejor rendimiento y sin comisiones.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A365D] mb-2">
                ¿Puedo tener más de una cuenta bancaria?
              </h3>
              <p className="text-[#64748B]">
                Sí, puedes tener las cuentas que quieras. Es una buena práctica tener una para gastos diarios,
                otra para ahorros de emergencia (con rendimiento) y otra para metas específicas.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
