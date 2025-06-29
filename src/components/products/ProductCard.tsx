// src/components/products/ProductCard.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { FinancialProduct } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Tag, Users, Briefcase, PlusCircle, MinusCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCompare } from '@/contexts/CompareContext';

interface ProductCardProps {
  product: FinancialProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const isComparing = isInCompare(product.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if card is wrapped in Link
    e.stopPropagation();
    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };
  
  const averageRating = product.averageRating || 0;


  return (
    <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0 relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={200}
            className="object-cover w-full h-48"
            data-ai-hint={product.aiHint || product.category.toLowerCase()}
          />
          <div className="absolute top-2 right-2 flex space-x-1">
            <Badge variant={product.segment === 'Individual' ? 'secondary' : 'outline'} className="bg-opacity-80 backdrop-blur-sm">
              {product.segment === 'Individual' ? <Users className="h-3 w-3 mr-1" /> : <Briefcase className="h-3 w-3 mr-1" />}
              {product.segment}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <Badge variant="default" className="mb-2 text-sm py-1 px-2.5 bg-accent text-accent-foreground">
            <Tag className="h-3.5 w-3.5 mr-1.5" />
            {product.category}
          </Badge>
          <CardTitle className="font-headline text-xl mb-1 leading-tight text-primary group-hover:text-accent transition-colors">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm text-foreground/70 mb-2 line-clamp-2">
            {product.tagline}
          </CardDescription>
          <div className="flex items-center text-sm text-muted-foreground">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
            <span className="ml-1.5">{averageRating.toFixed(1)} ({product.reviewCount} reviews)</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t mt-auto">
          <div className="flex justify-between items-center w-full">
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-accent hover:bg-accent/10">
              {/* This Link is nested, but the outer link covers the card. This button is for visual cue. */}
              <span>View Details</span> 
            </Button>
            <Button
              variant={isComparing ? "secondary" : "outline"}
              size="sm"
              onClick={handleCompareClick}
              aria-label={isComparing ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
              className="transition-all"
            >
              {isComparing ? <MinusCircle className="h-4 w-4 mr-1.5" /> : <PlusCircle className="h-4 w-4 mr-1.5" />}
              {isComparing ? 'Comparing' : 'Compare'}
            </Button>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
