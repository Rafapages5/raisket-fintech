// src/components/home/PopularGuidesSection.tsx
// Sección de guías populares para el homepage

import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { FILTER_DEFINITIONS } from '@/lib/filters';

export default function PopularGuidesSection() {
  // Seleccionar las 8 guías más populares (2 de cada categoría)
  const popularGuides = [
    FILTER_DEFINITIONS['sin-anualidad'],
    FILTER_DEFINITIONS['cashback'],
    FILTER_DEFINITIONS['sin-aval'],
    FILTER_DEFINITIONS['aprobacion-rapida'],
    FILTER_DEFINITIONS['bajo-riesgo'],
    FILTER_DEFINITIONS['desde-100'],
    FILTER_DEFINITIONS['sin-comisiones'],
    FILTER_DEFINITIONS['alto-rendimiento-ahorro'],
  ];

  // Mapeo de categorías a paths y colores
  const categoryConfig: Record<string, { path: string; color: string; gradient: string }> = {
    credit_card: {
      path: 'tarjetas-de-credito',
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600'
    },
    personal_loan: {
      path: 'prestamos-personales',
      color: 'cyan',
      gradient: 'from-cyan-500 to-blue-600'
    },
    investment: {
      path: 'inversiones',
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-600'
    },
    banking: {
      path: 'cuentas-bancarias',
      color: 'blue',
      gradient: 'from-blue-500 to-sky-600'
    },
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Guías Más Populares
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra los mejores productos según tus necesidades específicas
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularGuides.map((guide) => {
            const config = categoryConfig[guide.category];
            const guideUrl = `/${config.path}/mejores/${guide.slug}`;

            return (
              <Link
                key={guide.id}
                href={guideUrl}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-[1px] transition-all hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  backgroundSize: '200% 200%',
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative bg-white rounded-2xl p-6 h-full flex flex-col">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-emerald-600 group-hover:to-cyan-600 transition-all">
                      {guide.name}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
                    {guide.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium text-${config.color}-600`}>
                      Ver guía completa
                    </span>
                    <ArrowRight className={`h-4 w-4 text-${config.color}-600 group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA para ver todas las guías */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">¿Buscas algo más específico?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/tarjetas-credito"
              className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors font-medium text-sm"
            >
              Ver todas las tarjetas
            </Link>
            <Link
              href="/prestamos-personales"
              className="px-6 py-2 bg-cyan-50 text-cyan-700 rounded-full hover:bg-cyan-100 transition-colors font-medium text-sm"
            >
              Ver todos los préstamos
            </Link>
            <Link
              href="/inversiones"
              className="px-6 py-2 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors font-medium text-sm"
            >
              Ver todas las inversiones
            </Link>
            <Link
              href="/cuentas-bancarias"
              className="px-6 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors font-medium text-sm"
            >
              Ver todas las cuentas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
