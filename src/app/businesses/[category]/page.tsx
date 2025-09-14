// src/app/businesses/[category]/page.tsx
import ProductList from '@/components/products/ProductList';
import CategoryNav from '@/components/products/CategoryNav';
import { ProductsAPI } from '@/lib/api/products';
import type { FinancialProduct, ProductCategory } from '@/types';
import { Metadata } from 'next';

interface BusinessProductsPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: BusinessProductsPageProps): Promise<Metadata> {
  const category = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  const title = category === 'All' ? 'Todos los Productos Financieros para Empresas' : `Productos de ${category} para Empresas`;
  return {
    title: `${title} | Raisket`,
    description: `Browse ${category.toLowerCase()} financial products tailored for businesses on Raisket.`,
  };
}

// Mapeo de URLs en inglés a categorías en español
const categoryUrlMap: { [key: string]: ProductCategory } = {
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

export default async function BusinessProductsPage({ params }: BusinessProductsPageProps) {
  const urlCategory = params.category.toLowerCase();
  const currentCategory = categoryUrlMap[urlCategory] || 'All';

  // Get products from Supabase
  let products: FinancialProduct[];
  try {
    if (currentCategory === 'All') {
      products = await ProductsAPI.getBySegment('Empresas');
    } else {
      products = await ProductsAPI.getByCategoryAndSegment(currentCategory, 'Empresas');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    products = [];
  }

  return (
    <>
      <CategoryNav basePath="/businesses" />
      <ProductList products={products} />
    </>
  );
}

export async function generateStaticParams() {
  const urlCategories = ["all", "credit", "financing", "investment", "insurance"];
  return urlCategories.map((category) => ({
    category,
  }));
}
