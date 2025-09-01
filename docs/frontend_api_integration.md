# Frontend API Integration for Financial Products

## Overview

This document outlines the process of updating the frontend to connect to the backend API instead of using mock data, enabling the application to handle 500+ financial products efficiently.

## Current State Analysis

### Existing Implementation
The current frontend uses mock data from `src/data/products.ts` and filters products client-side in page components like:
- `src/app/individuals/[category]/page.tsx`
- `src/app/businesses/[category]/page.tsx`

### Issues with Current Approach
1. **Scalability**: All 500+ products loaded at once
2. **Performance**: No server-side filtering or pagination
3. **Data Freshness**: No real-time data updates
4. **Maintenance**: Manual data updates required

## Migration Strategy

### 1. API Service Layer

Create a dedicated service for API interactions:

```typescript
// src/services/productService.ts
interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  long_description?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  institution: {
    id: string;
    name: string;
    brand_name: string;
  };
  target_segment: 'individual' | 'business' | 'both';
  image_url: string;
  average_rating: number;
  review_count: number;
  interest_rate_min?: number;
  interest_rate_max?: number;
  annual_fee?: number;
  is_featured: boolean;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  segment: 'individual' | 'business' | 'both';
  icon_name: string;
  product_count: number;
}

interface FilterOption {
  id: string;
  name: string;
  slug: string;
  type: 'range' | 'boolean' | 'enum' | 'multi_select' | 'search';
  data_type?: 'integer' | 'decimal' | 'string' | 'boolean';
  min_value?: number;
  max_value?: number;
  unit?: string;
  options?: Array<{ value: string; label: string }>;
}

interface Pagination {
  page: number;
  limit: number;
  total?: number;
  total_pages?: number;
  has_next: boolean;
  has_prev: boolean;
  next_cursor?: string;
  prev_cursor?: string;
}

interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
}

class ProductService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
  }

  /**
   * Get products with filtering and pagination
   */
  async getProducts(params: {
    category?: string;
    segment?: string;
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    [key: string]: any; // For dynamic filters
  }): Promise<ApiResponse<Product[]> & { pagination: Pagination }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          queryParams.append(key, JSON.stringify(value));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${this.baseUrl}/products?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    const response = await fetch(`${this.baseUrl}/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Get product categories
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await fetch(`${this.baseUrl}/categories`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Get available filters for a category
   */
  async getFilters(category?: string): Promise<ApiResponse<FilterOption[]>> {
    const queryParams = category ? `?category=${category}` : '';
    const response = await fetch(`${this.baseUrl}/filters${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch filters: ${response.statusText}`);
    }
    
    return response.json();
  }
}

export const productService = new ProductService();
```

### 2. Updated Page Components

#### Individual Products Page

```typescript
// src/app/individuals/[category]/page.tsx (updated)
'use client';

import { useEffect, useState } from 'react';
import ProductList from '@/components/products/ProductList';
import CategoryNav from '@/components/products/CategoryNav';
import ActiveFilters from '@/components/products/ActiveFilters';
import FilterPanel from '@/components/products/FilterPanel';
import { productService } from '@/services/productService';
import { useFilters } from '@/contexts/FilterContext';
import ProductListSkeleton from '@/components/products/ProductListSkeleton';
import { MobileFilters } from '@/components/products/MobileFilters';

interface IndividualProductsPageProps {
  params: {
    category: string;
  };
}

// Mapeo de categorías en inglés a español para la metadata y títulos
const categoryMap: { [key: string]: string } = {
  all: 'Todos',
  credit: 'Crédito',
  financing: 'Financiamiento',
  investment: 'Inversión',
  insurance: 'Seguros',
};

// Función para obtener el nombre de la categoría en español
const getSpanishCategoryName = (categoryKey: string): string => {
  return categoryMap[categoryKey.toLowerCase()] || categoryKey;
};

export async function generateMetadata({ params }: IndividualProductsPageProps) {
  const categoryKey = params.category.toLowerCase();
  const categoryName = getSpanishCategoryName(categoryKey);
  const title = categoryKey === 'all' ? 'Todos los Productos Financieros Personales' : `Productos de ${categoryName} para Personas`;
  
  return {
    title: `${title} | Raisket`,
    description: `Explora productos financieros de ${categoryName.toLowerCase()} diseñados para personas en Raisket.`,
  };
}

export default function IndividualProductsPage({ params }: IndividualProductsPageProps) {
  const currentCategoryKey = params.category.toLowerCase();
  const currentCategoryName = getSpanishCategoryName(currentCategoryKey);
  
  const { activeFilters, loadFilters } = useFilters();
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load filters when category changes
  useEffect(() => {
    loadFilters(currentCategoryKey !== 'all' ? currentCategoryKey : undefined);
  }, [currentCategoryKey, loadFilters]);

  // Fetch products when filters or pagination change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const filterParams: any = {
          category: currentCategoryKey !== 'all' ? currentCategoryKey : undefined,
          segment: 'individual',
          page: 1,
          limit: 20
        };

        // Add active filters to request
        activeFilters.forEach(filter => {
          filterParams[filter.slug] = filter.value;
        });

        const response = await productService.getProducts(filterParams);
        setProducts(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategoryKey, activeFilters]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500">Error loading products: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar - hidden on mobile */}
        <div className="lg:w-1/4 hidden lg:block">
          <FilterPanel categorySlug={currentCategoryKey !== 'all' ? currentCategoryKey : undefined} />
        </div>
        
        {/* Main content */}
        <div className="lg:w-3/4">
          {/* Mobile filters toggle */}
          <div className="lg:hidden mb-6">
            <MobileFilters categorySlug={currentCategoryKey !== 'all' ? currentCategoryKey : undefined} />
          </div>
          
          <CategoryNav basePath="/individuals" />
          
          <ActiveFilters />
          
          {isLoading ? (
            <ProductListSkeleton count={8} />
          ) : (
            <ProductList 
              initialProducts={products}
              initialPagination={pagination}
              categorySlug={currentCategoryKey !== 'all' ? currentCategoryKey : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // Usamos las claves en inglés para generar las rutas estáticas
  const categories: string[] = ["all", "credit", "financing", "investment", "insurance"];
  return categories.map((category) => ({
    category: category,
  }));
}
```

#### Business Products Page

```typescript
// src/app/businesses/[category]/page.tsx (updated)
'use client';

import { useEffect, useState } from 'react';
import ProductList from '@/components/products/ProductList';
import CategoryNav from '@/components/products/CategoryNav';
import ActiveFilters from '@/components/products/ActiveFilters';
import FilterPanel from '@/components/products/FilterPanel';
import { productService } from '@/services/productService';
import { useFilters } from '@/contexts/FilterContext';
import ProductListSkeleton from '@/components/products/ProductListSkeleton';
import { MobileFilters } from '@/components/products/MobileFilters';

interface BusinessProductsPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: BusinessProductsPageProps) {
  const category = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  const title = category === 'All' ? 'All Business Financial Products' : `${category} Products for Businesses`;
  return {
    title: `${title} | Raisket`,
    description: `Browse ${category.toLowerCase()} financial products tailored for businesses on Raisket.`,
  };
}

export default function BusinessProductsPage({ params }: BusinessProductsPageProps) {
  const currentCategory = params.category;
  
  const { activeFilters, loadFilters } = useFilters();
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load filters when category changes
  useEffect(() => {
    loadFilters(currentCategory !== 'all' ? currentCategory : undefined);
  }, [currentCategory, loadFilters]);

  // Fetch products when filters or pagination change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const filterParams: any = {
          category: currentCategory !== 'all' ? currentCategory : undefined,
          segment: 'business',
          page: 1,
          limit: 20
        };

        // Add active filters to request
        activeFilters.forEach(filter => {
          filterParams[filter.slug] = filter.value;
        });

        const response = await productService.getProducts(filterParams);
        setProducts(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, activeFilters]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500">Error loading products: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar - hidden on mobile */}
        <div className="lg:w-1/4 hidden lg:block">
          <FilterPanel categorySlug={currentCategory !== 'all' ? currentCategory : undefined} />
        </div>
        
        {/* Main content */}
        <div className="lg:w-3/4">
          {/* Mobile filters toggle */}
          <div className="lg:hidden mb-6">
            <MobileFilters categorySlug={currentCategory !== 'all' ? currentCategory : undefined} />
          </div>
          
          <CategoryNav basePath="/businesses" />
          
          <ActiveFilters />
          
          {isLoading ? (
            <ProductListSkeleton count={8} />
          ) : (
            <ProductList 
              initialProducts={products}
              initialPagination={pagination}
              categorySlug={currentCategory !== 'all' ? currentCategory : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const categories: string[] = ["all", "credit", "financing", "investment", "insurance"];
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}
```

### 3. Updated Components

#### Product List Component

```typescript
// src/components/products/ProductList.tsx (updated)
'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import InfiniteScroll from './InfiniteScroll';
import { productService } from '@/services/productService';
import { useFilters } from '@/contexts/FilterContext';

interface ProductListProps {
  initialProducts: any[];
  initialPagination: any;
  categorySlug?: string;
  segment?: 'individual' | 'business';
}

export default function ProductList({
  initialProducts,
  initialPagination,
  categorySlug,
  segment = 'individual'
}: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const { activeFilters } = useFilters();

  // Fetch products when filters or pagination change
  useEffect(() => {
    const fetchProducts = async () => {
      if (pagination.page === 1 && products.length > 0) {
        // Don't fetch on initial load if we already have data
        return;
      }

      setIsLoading(true);
      
      try {
        const filterParams: any = {
          category: categorySlug,
          segment: segment,
          page: pagination.page,
          limit: pagination.limit
        };

        // Add active filters to request
        activeFilters.forEach(filter => {
          filterParams[filter.slug] = filter.value;
        });

        const response = await productService.getProducts(filterParams);
        
        if (pagination.page === 1) {
          setProducts(response.data);
        } else {
          setProducts(prev => [...prev, ...response.data]);
        }
        
        setPagination(response.pagination);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeFilters, pagination.page, categorySlug, segment]);

  const handlePageChange = (page: number) => {
    setPagination((prev: any) => ({ ...prev, page }));
  };

  const handleLoadMore = () => {
    if (pagination.hasNext) {
      setPagination((prev: any) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se encontraron productos que coincidan con los filtros.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Display products */}
      <InfiniteScroll
        onLoadMore={handleLoadMore}
        hasMore={pagination.hasNext}
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </InfiniteScroll>

      {/* Traditional pagination for non-infinite scroll */}
      {!pagination.nextCursor && pagination.totalPages && pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
```

#### Product Card Component

```typescript
// src/components/products/ProductCard.tsx (updated)
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Tag, Users, Briefcase, PlusCircle, MinusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCompare } from '@/contexts/CompareContext';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const isComparing = isInCompare(product.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const averageRating = product.average_rating || 0;

  return (
    <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0 relative">
          <Image
            src={product.image_url}
            alt={product.name}
            width={400}
            height={200}
            className="object-cover w-full h-48"
            data-ai-hint={product.ai_hint || product.category.slug.toLowerCase()}
          />
          <div className="absolute top-2 right-2 flex space-x-1">
            <Badge variant={product.target_segment === 'individual' ? 'secondary' : 'outline'} className="bg-opacity-80 backdrop-blur-sm">
              {product.target_segment === 'individual' ? <Users className="h-3 w-3 mr-1" /> : <Briefcase className="h-3 w-3 mr-1" />}
              {product.target_segment === 'individual' ? 'Persona' : 'Empresa'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <Badge variant="default" className="mb-2 text-sm py-1 px-2.5 bg-accent text-accent-foreground">
            <Tag className="h-3.5 w-3.5 mr-1.5" />
            {product.category.name}
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
            <span className="ml-1.5">{averageRating.toFixed(1)} ({product.review_count} reseñas)</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t mt-auto">
          <div className="flex justify-between items-center w-full">
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-accent hover:bg-accent/10">
              <span>Ver Detalles</span> 
            </Button>
            <Button
              variant={isComparing ? "secondary" : "outline"}
              size="sm"
              onClick={handleCompareClick}
              aria-label={isComparing ? `Remover ${product.name} de comparación` : `Agregar ${product.name} a comparación`}
              className="transition-all"
            >
              {isComparing ? <MinusCircle className="h-4 w-4 mr-1.5" /> : <PlusCircle className="h-4 w-4 mr-1.5" />}
              {isComparing ? 'Comparando' : 'Comparar'}
            </Button>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
```

### 4. Environment Configuration

```typescript
// src/lib/config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

export const APP_CONFIG = {
  API_BASE_URL,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
};
```

## Implementation Steps

### 1. Create API Service
1. Create `src/services/productService.ts`
2. Implement all API methods
3. Add error handling and retry logic

### 2. Update Page Components
1. Replace mock data usage with API calls
2. Add loading states
3. Implement error handling
4. Add filter integration

### 3. Update Components
1. Modify ProductList to use API data
2. Update ProductCard to work with new data structure
3. Add skeleton loaders for better UX

### 4. Configure Environment
1. Add API base URL to environment variables
2. Set up proper CORS configuration
3. Configure caching headers

## Performance Considerations

### 1. Caching Strategy
```typescript
// src/services/cacheService.ts
class CacheService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private ttl: number = 5 * 60 * 1000; // 5 minutes

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cacheService = new CacheService();
```

### 2. Request Deduplication
```typescript
// src/services/requestDeduplicator.ts
class RequestDeduplicator {
  private pendingRequests: Map<string, Promise<any>> = new Map();

  async request<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

export const requestDeduplicator = new RequestDeduplicator();
```

## Error Handling

### 1. Global Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but we encountered an error while loading the products.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 2. Retry Logic
```typescript
// src/services/retryService.ts
interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  exponentialBackoff?: boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    exponentialBackoff = true
  } = options;

  let lastError: any;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (i < maxRetries) {
        const waitTime = exponentialBackoff ? delay * Math.pow(2, i) : delay;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}
```

## Testing Strategy

### 1. Unit Tests
```typescript
// tests/services/productService.test.ts
import { productService } from '@/services/productService';

global.fetch = jest.fn();

describe('ProductService', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getProducts', () => {
    it('should fetch products with correct parameters', async () => {
      const mockResponse = {
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      const result = await productService.getProducts({
        category: 'credit',
        segment: 'individual',
        page: 1,
        limit: 20
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products?category=credit&segment=individual&page=1&limit=20')
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found'
      });

      await expect(
        productService.getProducts({ category: 'invalid' })
      ).rejects.toThrow('Failed to fetch products: Not Found');
    });
  });
});
```

### 2. Integration Tests
```typescript
// tests/components/ProductList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import ProductList from '@/components/products/ProductList';
import { FilterProvider } from '@/contexts/FilterContext';

// Mock the productService
jest.mock('@/services/productService', () => ({
  productService: {
    getProducts: jest.fn()
  }
}));

describe('ProductList', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Test Product',
      tagline: 'Test tagline',
      description: 'Test description',
      category: { name: 'Credit', slug: 'credit' },
      institution: { name: 'Test Bank', brand_name: 'Test' },
      target_segment: 'individual',
      image_url: 'https://example.com/image.jpg',
      average_rating: 4.5,
      review_count: 100
    }
  ];

  const mockPagination = {
    page: 1,
    limit: 20,
    total: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (require('@/services/productService').productService.getProducts as jest.Mock)
      .mockResolvedValueOnce({
        data: mockProducts,
        pagination: mockPagination
      });

    render(
      <FilterProvider>
        <ProductList
          initialProducts={[]}
          initialPagination={mockPagination}
        />
      </FilterProvider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders products after loading', async () => {
    (require('@/services/productService').productService.getProducts as jest.Mock)
      .mockResolvedValueOnce({
        data: mockProducts,
        pagination: mockPagination
      });

    render(
      <FilterProvider>
        <ProductList
          initialProducts={mockProducts}
          initialPagination={mockPagination}
        />
      </FilterProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });
});
```

## Monitoring and Analytics

### 1. API Performance Tracking
```typescript
// src/services/analyticsService.ts
class AnalyticsService {
  trackApiCall(endpoint: string, duration: number, success: boolean) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'api_call', {
        endpoint,
        duration,
        success
      });
    }
  }

  trackError(error: string, context: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'error', {
        error,
        context
      });
    }
  }
}

export const analyticsService = new AnalyticsService();
```

### 2. User Behavior Tracking
Track how users interact with the new API-driven product listings:
- Load times
- Filter usage
- Pagination interactions
- Error rates

## Rollout Plan

### 1. Development Environment
1. Implement API service layer
2. Update page components
3. Test with mock API responses
4. Verify error handling

### 2. Staging Environment
1. Connect to staging API
2. Test with real data
3. Performance testing
4. User acceptance testing

### 3. Production Rollout
1. Deploy to subset of users
2. Monitor performance metrics
3. Gradually increase rollout
4. Full deployment

This frontend API integration provides a robust foundation for handling 500+ financial products while maintaining good performance and user experience.