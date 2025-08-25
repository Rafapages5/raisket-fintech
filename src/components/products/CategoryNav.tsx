// src/components/products/CategoryNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Definimos las categorías que queremos mostrar en la navegación.
// El 'slug' corresponde a la parte de la URL (ej. /individuals/credit)
// El 'name' es el texto que se mostrará al usuario.
const categories = [
  { slug: 'all', name: 'Todos' },
  { slug: 'credit', name: 'Crédito' },
  { slug: 'financing', name: 'Financiamiento' },
  { slug: 'investment', name: 'Inversión' },
  { slug: 'insurance', name: 'Seguros' },
];

interface CategoryNavProps {
  // El `basePath` nos permite reutilizar este componente para
  // '/individuals' y '/businesses'.
  basePath: '/individuals' | '/businesses';
}

export default function CategoryNav({ basePath }: CategoryNavProps) {
  const pathname = usePathname();
  
  // Extraemos la categoría actual de la URL para saber cuál resaltar.
  // Por ejemplo, de '/individuals/credit', obtendremos 'credit'.
  const currentCategory = pathname.split('/').pop();

  return (
    <nav className="mb-8 flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-2 rounded-full bg-muted p-2">
        {categories.map((category) => {
          const isActive = currentCategory === category.slug;
          return (
            <li key={category.slug}>
              <Link
                href={`${basePath}/${category.slug}`}
                // Aplicamos estilos dinámicos con `clsx` o simplemente con `className`.
                // Si la categoría está activa, tendrá un fondo y color de texto diferente.
                className={`
                  rounded-full px-4 py-2 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}