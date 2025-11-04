// src/components/products/ProductDetailClient.tsx
"use client";

import type { FinancialProduct, Review } from '@/types';
import ProductDetailInvestment from './ProductDetailInvestment';
import ProductDetailCredit from './ProductDetailCredit';
import ProductDetailFinancing from './ProductDetailFinancing';

interface ProductDetailClientProps {
  product: FinancialProduct;
  reviews: Review[];
}

export default function ProductDetailClient({ product, reviews }: ProductDetailClientProps) {
  // Renderizar componente específico según la categoría del producto
  switch (product.category) {
    case 'Inversión':
      return <ProductDetailInvestment product={product} reviews={reviews} />;

    case 'Crédito':
      return <ProductDetailCredit product={product} reviews={reviews} />;

    case 'Financiamiento':
      return <ProductDetailFinancing product={product} reviews={reviews} />;

    default:
      // Fallback a inversión si no se reconoce la categoría
      return <ProductDetailInvestment product={product} reviews={reviews} />;
  }
}
