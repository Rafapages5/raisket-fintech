// src/app/individuals/[category]/page.tsx
import ProductList from '@/components/products/ProductList';
import CategoryNav from '@/components/products/CategoryNav';
import { getAllProducts } from '@/lib/products';
import type { ProductCategory } from '@/types';
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
  'crédito': 'Crédito',
  financing: 'Financiamiento',
  financiamiento: 'Financiamiento',
  investment: 'Inversión',
  'inversión': 'Inversión',
  insurance: 'Seguro',
  seguro: 'Seguro',
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

// Mapeo de URLs a categorías del producto
const categoryUrlToProductMap: { [key: string]: ProductCategory } = {
  'all': 'All',
  'credit': 'Crédito',
  'credito': 'Crédito',
  'financing': 'Financiamiento',
  'financiamiento': 'Financiamiento',
  'investment': 'Inversión',
  'inversion': 'Inversión',
};

export default async function IndividualProductsPage({ params }: IndividualProductsPageProps) {
  const currentCategoryKey = params.category.toLowerCase();

  // Map URL categories to Supabase categories
  const categoryMap: { [key: string]: string } = {
    'credit': 'tarjeta_credito',
    'credito': 'tarjeta_credito',
    'financing': 'prestamo_personal',
    'financiamiento': 'prestamo_personal',
    'investment': 'cuenta_inversion',
    'inversion': 'cuenta_inversion'
  };

  try {
    // Get products from Supabase
    const products = await getAllProducts({
      categoria: currentCategoryKey === 'all' ? undefined : categoryMap[currentCategoryKey],
      segmento: 'personas',
      limit: 50
    });

    // Filter by segment (for now, all products will be 'Personas' based on our transform logic)
    const individualProducts = products.filter(product => product.segment === 'Personas');

    return (
      <>
        <CategoryNav basePath="/individuals" />
        <ProductList products={individualProducts} />
      </>
    );
  } catch (error) {
    console.error('Error loading products:', error);
    return (
      <>
        <CategoryNav basePath="/individuals" />
        <div className="text-center py-8">
          <p className="text-muted-foreground">Error loading products. Please try again later.</p>
        </div>
      </>
    );
  }
}

export async function generateStaticParams() {
  // Usamos las claves en inglés para generar las rutas estáticas
  const categories: string[] = ["all", "credit", "financing", "investment"];
  return categories.map((category) => ({
    category: category,
  }));
}
