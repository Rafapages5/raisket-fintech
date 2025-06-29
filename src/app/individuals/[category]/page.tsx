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

export async function generateMetadata({ params }: IndividualProductsPageProps): Promise<Metadata> {
  const category = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  const title = category === 'All' ? 'All Personal Financial Products' : `${category} Products for Individuals`;
  return {
    title: `${title} | Raisket`,
    description: `Browse ${category.toLowerCase()} financial products tailored for individuals on Raisket.`,
  };
}

export default async function IndividualProductsPage({ params }: IndividualProductsPageProps) {
  const currentCategory = params.category as ProductCategory | 'all';

  const products = mockProducts.filter((product) => {
    const segmentMatch = product.segment === 'Individual';
    const categoryMatch = currentCategory === 'all' || product.category.toLowerCase() === currentCategory.toLowerCase();
    return segmentMatch && categoryMatch;
  });

  return <ProductList products={products} />;
}

export async function generateStaticParams() {
  const categories: ProductCategory[] = ["All", "Credit", "Financing", "Investment", "Insurance"];
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}
