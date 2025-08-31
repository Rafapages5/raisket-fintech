// src/app/individuals/[category]/page.tsx
import ProductList from '@/components/products/ProductList';
import { mockProducts } from '@/data/products';
import type { FinancialProduct, ProductCategory } from '@/types';
import { Metadata } from 'next';

interface IndividualProductsPageProps {
  params: {
    category: string;
  };
}

// Mapeo de categorías en inglés a español para la metadata y títulos
const categoryMap: { [key: string]: string } = {
  all: 'Todos',
  credit: 'Crédito',
  financing: 'Financiamiento',
  investment: 'Inversión',
};

// Función para obtener el nombre de la categoría en español
const getSpanishCategoryName = (categoryKey: string): string => {
  return categoryMap[categoryKey.toLowerCase()] || categoryKey;
};


export async function generateMetadata({ params }: IndividualProductsPageProps): Promise<Metadata> {
  const categoryKey = params.category.toLowerCase();
  const categoryName = getSpanishCategoryName(categoryKey);
  const title = categoryKey === 'all' ? 'Todos los Productos Financieros Personales' : `Productos de ${categoryName} para Personas`;
  
  return {
    title: `${title} | Raisket`,
    description: `Explora productos financieros de ${categoryName.toLowerCase()} diseñados para personas en Raisket.`,
  };
}

export default async function IndividualProductsPage({ params }: IndividualProductsPageProps) {
  const currentCategoryKey = params.category.toLowerCase();
  const currentCategoryName = getSpanishCategoryName(currentCategoryKey) as ProductCategory | 'Todos';

  const products = mockProducts.filter((product) => {
    const segmentMatch = product.segment === 'Individual';
    // Compara con el nombre de la categoría en inglés o si es 'all'
    const categoryMatch = currentCategoryKey === 'all' || product.category.toLowerCase() === currentCategoryKey;
    return segmentMatch && categoryMatch;
  });

  return <ProductList products={products} />;
}

export async function generateStaticParams() {
  // Usamos las claves en inglés para generar las rutas estáticas
  const categories: string[] = ["all", "credit", "financing", "investment"];
  return categories.map((category) => ({
    category: category,
  }));
}
