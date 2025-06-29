// src/components/products/ProductList.tsx
import type { FinancialProduct } from '@/types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: FinancialProduct[];
}

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No products found for this category.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
