// src/app/businesses/[category]/page.tsx
import ProductList from '@/components/products/ProductList';
import CategoryNav from '@/components/products/CategoryNav';
import { mockProducts } from '@/data/products';
import type { FinancialProduct, ProductCategory } from '@/types';
import { Metadata } from 'next';

interface BusinessProductsPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: BusinessProductsPageProps): Promise<Metadata> {
  const category = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  const title = category === 'All' ? 'All Business Financial Products' : `${category} Products for Businesses`;
  return {
    title: `${title} | Raisket`,
    description: `Browse ${category.toLowerCase()} financial products tailored for businesses on Raisket.`,
  };
}

export default async function BusinessProductsPage({ params }: BusinessProductsPageProps) {
  const currentCategory = params.category as ProductCategory | 'all';

  const products = mockProducts.filter((product) => {
    const segmentMatch = product.segment === 'Business';
    const categoryMatch = currentCategory === 'all' || product.category.toLowerCase() === currentCategory.toLowerCase();
    return segmentMatch && categoryMatch;
  });

  return (
    <>
      <CategoryNav basePath="/businesses" />
      <ProductList products={products} />
    </>
  );
}

export async function generateStaticParams() {
  const categories: ProductCategory[] = ["All", "Credit", "Financing", "Investment"];
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}
