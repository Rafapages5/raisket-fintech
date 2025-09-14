// src/app/individuals/[category]/page.tsx
import ProductList from '@/components/products/ProductList';
import CategoryNav from '@/components/products/CategoryNav';
import { ProductsAPI } from '@/lib/api/products';
import type { ProductCategory, FinancialProduct } from '@/types';
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
  'insurance': 'Seguro',
  'seguro': 'Seguro',
};

export default async function IndividualProductsPage({ params }: IndividualProductsPageProps) {
  const currentCategoryKey = params.category.toLowerCase();
  const productCategory = categoryUrlToProductMap[currentCategoryKey] || 'All';

  // Get products from Supabase
  let products: FinancialProduct[];
  try {
    if (productCategory === 'All') {
      products = await ProductsAPI.getBySegment('Personas');
    } else {
      products = await ProductsAPI.getByCategoryAndSegment(productCategory, 'Personas');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    products = [];
  }

  return (
    <>
      <CategoryNav basePath="/individuals" />
      <ProductList products={products} />
    </>
  );
}

export async function generateStaticParams() {
  // Usamos las claves en inglés para generar las rutas estáticas
  const categories: string[] = ["all", "credit", "financing", "investment"];
  return categories.map((category) => ({
    category: category,
  }));
}
