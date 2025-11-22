// src/components/filters/FilterSidebar.tsx
// Sidebar con enlaces a páginas "mejores" por categoría

import Link from 'next/link';
import { Filter, TrendingUp, Star } from 'lucide-react';
import { getFiltersByCategory, type ProductCategory } from '@/lib/filters';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  category: ProductCategory;
  currentFilter?: string; // slug del filtro activo
  className?: string;
}

export default function FilterSidebar({ category, currentFilter, className }: FilterSidebarProps) {
  const filters = getFiltersByCategory(category);

  // Mapeo de categorías a paths
  const categoryPaths: Record<ProductCategory, string> = {
    credit_card: 'tarjetas-de-credito',
    personal_loan: 'prestamos-personales',
    investment: 'inversiones',
    banking: 'cuentas-bancarias',
  };

  const categoryPath = categoryPaths[category];

  return (
    <aside className={cn('bg-white rounded-2xl shadow-sm p-6 sticky top-4', className)}>
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-emerald-600" />
        <h3 className="font-bold text-gray-900">Guías Especializadas</h3>
      </div>

      <div className="space-y-2">
        {filters.map((filter) => {
          const isActive = currentFilter === filter.slug;
          const Icon = filter.id.includes('sin') || filter.id.includes('bajo') ? Star : TrendingUp;

          return (
            <Link
              key={filter.id}
              href={`/${categoryPath}/mejores/${filter.slug}`}
              className={cn(
                'block px-4 py-3 rounded-lg transition-all group',
                isActive
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : 'hover:bg-gray-50 text-gray-700 hover:text-emerald-600 border border-transparent'
              )}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0 mt-0.5',
                    isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className={cn('font-medium text-sm', isActive && 'text-emerald-900')}>
                    {filter.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{filter.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA inferior */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">¿No encuentras lo que buscas?</p>
        <Link
          href="/chat"
          className="block w-full text-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          Pregunta al Asistente IA
        </Link>
      </div>
    </aside>
  );
}
