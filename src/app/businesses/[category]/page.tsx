// src/app/businesses/[category]/page.tsx
import ProductList from '@/components/products/ProductList';
import CategoryNav from '@/components/products/CategoryNav';
import { getAllProducts } from '@/lib/products';
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
};

export default async function BusinessProductsPage({ params }: BusinessProductsPageProps) {
  const urlCategory = params.category.toLowerCase();

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
      categoria: urlCategory === 'all' ? undefined : categoryMap[urlCategory],
      segmento: 'empresas',
      limit: 50
    });

    // Filter by segment (for now, filter based on institution type or product characteristics)
    const businessProducts = products.filter(product => product.segment === 'Empresas');

    return (
      <>
        <CategoryNav basePath="/businesses" />
        <ProductList products={businessProducts} />
      </>
    );
  } catch (error) {
    console.error('Error loading business products:', error);
    return (
      <>
        <CategoryNav basePath="/businesses" />
        <div className="text-center py-8">
          <p className="text-muted-foreground">Error loading products. Please try again later.</p>
        </div>
      </>
    );
  }
}

export async function generateStaticParams() {
  const urlCategories = ["all", "credit", "financing", "investment"];
  return urlCategories.map((category) => ({
    category,
  }));
}
