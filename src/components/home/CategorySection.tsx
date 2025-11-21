// src/components/home/CategorySection.tsx
"use client";

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCardNW from '@/components/products/ProductCardNW';
import type { FinancialProduct, ProductCategory } from '@/lib/financial-products';
import { categoryLabels } from '@/lib/financial-products';

interface CategorySectionProps {
  category: ProductCategory;
  products: FinancialProduct[];
  showViewAll?: boolean;
}

const categoryHrefs: Record<ProductCategory, string> = {
  credit_card: '/tarjetas-credito',
  personal_loan: '/prestamos-personales',
  investment: '/inversiones',
  banking: '/cuentas-bancarias',
};

export default function CategorySection({
  category,
  products,
  showViewAll = true,
}: CategorySectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A365D]">
              {categoryLabels[category]}
            </h2>
            <p className="text-[#64748B] mt-1">
              Compara y encuentra la mejor opción para ti
            </p>
          </div>
          {showViewAll && (
            <Link href={categoryHrefs[category]}>
              <Button
                variant="ghost"
                className="text-[#00D9A5] hover:text-[#00C294] hover:bg-[#00D9A5]/10"
              >
                Ver todos
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCardNW key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
