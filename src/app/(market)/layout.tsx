// src/app/(market)/layout.tsx
"use client"; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Landmark, TrendingUp, Shield, LayoutGrid } from 'lucide-react';
import type { ProductCategory, ProductSegment } from '@/types';
import React from 'react';

const categories: { name: ProductCategory; icon: React.ElementType }[] = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Credit', icon: CreditCard },
  { name: 'Financing', icon: Landmark },
  { name: 'Investment', icon: TrendingUp },
  { name: 'Insurance', icon: Shield },
];

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const currentSegment = segments[1] as ProductSegment | undefined; // 'individuals' or 'businesses'
  const currentCategory = segments[2] as ProductCategory | undefined; // e.g. 'credit', 'all'

  const pageTitle = currentSegment === 'individuals' ? 'For Individuals' : currentSegment === 'businesses' ? 'For Businesses' : 'Financial Products';
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-2">
          {pageTitle}
        </h1>
        <p className="text-muted-foreground text-lg">
          Browse {currentCategory && currentCategory.toLowerCase() !== 'all' ? `${currentCategory.toLowerCase()} products` : 'all products'} tailored for {currentSegment === 'individuals' ? 'your personal needs' : 'your business needs'}.
        </p>
      </div>

      <Tabs defaultValue={currentCategory || 'all'} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 h-auto p-1.5">
          {categories.map((category) => (
            <TabsTrigger
              key={category.name}
              value={category.name.toLowerCase()}
              asChild
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md h-12 text-sm"
            >
              <Link href={`/${currentSegment}/${category.name.toLowerCase()}`} className="flex items-center justify-center gap-2">
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
