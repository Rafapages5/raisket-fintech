// src/app/(market)/layout.tsx
"use client"; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Landmark, TrendingUp, Shield, LayoutGrid } from 'lucide-react';
import type { ProductCategory } from '@/types';
import React from 'react';

const categories: { name: ProductCategory; icon: React.ElementType; url: string }[] = [
  { name: 'All', icon: LayoutGrid, url: 'all' },
  { name: 'Crédito', icon: CreditCard, url: 'credit' },
  { name: 'Financiamiento', icon: Landmark, url: 'financing' },
  { name: 'Inversión', icon: TrendingUp, url: 'investment' },
];

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const currentSegmentUrl = segments[1]; // 'individuals' or 'businesses'
  const currentCategory = segments[2] as ProductCategory | undefined; // e.g. 'credit', 'all'

  const pageTitle = currentSegmentUrl === 'individuals' ? 'Para Personas' : currentSegmentUrl === 'businesses' ? 'Para Empresas' : 'Productos Financieros';
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-2">
          {pageTitle}
        </h1>
        <p className="text-muted-foreground text-lg">
          Browse {currentCategory && currentCategory.toLowerCase() !== 'all' ? `${currentCategory.toLowerCase()} products` : 'all products'} tailored for {currentSegmentUrl === 'individuals' ? 'your personal needs' : 'your business needs'}.
        </p>
      </div>

      <Tabs defaultValue={currentCategory || 'all'} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 h-auto p-1.5">
          {categories.map((category) => (
            <TabsTrigger
              key={category.name}
              value={category.url}
              asChild
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md h-12 text-sm"
            >
              <Link href={`/${currentSegmentUrl}/${category.url}`} className="flex items-center justify-center gap-2">
                <category.icon className="h-5 w-5" />
                {category.name}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div>{children}</div>
    </div>
  );
}
