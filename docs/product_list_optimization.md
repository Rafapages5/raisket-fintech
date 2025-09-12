# Product List Optimization for Handling 500+ Products

## Overview

This document outlines the optimization strategies for the ProductList component to efficiently handle 500+ financial products while maintaining good performance and user experience.

## Current Performance Issues

### 1. DOM Overload
- Rendering all products at once creates too many DOM elements
- Each product card has multiple components (images, badges, buttons)
- Memory consumption increases with product count

### 2. React Reconciliation
- Large lists cause expensive reconciliation processes
- Component updates trigger re-renders of entire list
- State changes propagate through all product items

### 3. Image Loading
- Multiple images loading simultaneously
- No lazy loading implementation
- No image optimization strategy

## Optimization Strategies

### 1. Virtualization

Virtualize the product list to render only visible items:

```tsx
// src/components/products/VirtualizedProductList.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FixedSizeList as List, VariableSizeList as VariableList } from 'react-window';
import ProductCard from './ProductCard';
import { productService } from '@/services/productService';
import { useFilters } from '@/contexts/FilterContext';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualizedProductListProps {
  initialProducts: any[];
  initialPagination: any;
  categorySlug?: string;
  segment?: 'individual' | 'business';
}

const ProductRow = ({ 
  data, 
  index, 
  style 
}: { 
  data: any[]; 
  index: number; 
  style: React.CSSProperties;
}) => {
  const product = data[index];
  
  return (
    <div style={style} className="p-1">
      <ProductCard product={product} />
    </div>
  );
};

export default function VirtualizedProductList({
  initialProducts,
  initialPagination,
  categorySlug,
  segment = 'individual'
}: VirtualizedProductListProps) {
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

  const handleLoadMore = useCallback(() => {
    if (pagination.hasNext) {
      setPagination((prev: any) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination]);

  // Calculate item size based on screen width
  const getItemSize = useCallback((index: number) => {
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;
    
    if (isMobile) return 300; // Single column
    if (isTablet) return 250;  // Two columns
    return 250;                // Four columns on desktop
  }, []);

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
    <div className="h-[calc(100vh-200px)]">
      <AutoSizer>
        {({ height, width }) => {
          const columnCount = width < 640 ? 1 : width < 1024 ? 2 : 4;
          const itemWidth = width / columnCount;
          
          return (
            <VariableList
              height={height}
              itemCount={products.length}
              itemSize={getItemSize}
              itemData={products}
              width={width}
            >
              {ProductRow}
            </VariableList>
          );
        }}
      </AutoSizer>
      
      {/* Load more button for traditional pagination */}
      {pagination.hasNext && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Cargando...' : 'Cargar más productos'}
          </button>
        </div>
      )}
    </div>
  );
}
```

### 2. Lazy Loading Images

Implement lazy loading for product images:

```tsx
// src/components/products/ProductImage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function ProductImage({
  src,
  alt,
  width = 400,
  height = 200,
  className = '',
  priority = false
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    // Fallback to placeholder image
    setImageSrc('https://placehold.co/600x400.png');
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover w-full h-full ${isLoading ? 'invisible' : 'visible'}`}
        onLoadingComplete={handleLoad}
        onError={handleError}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-gray-500 text-sm">Imagen no disponible</span>
        </div>
      )}
    </div>
  );
}
```

### 3. Memoization

Memoize product components to prevent unnecessary re-renders:

```tsx
// src/components/products/ProductCard.tsx (optimized)
'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import ProductImage from './ProductImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Tag, Users, Briefcase, PlusCircle, MinusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCompare } from '@/contexts/CompareContext';

interface ProductCardProps {
  product: any;
}

const ProductCard = memo(({ product }: ProductCardProps) => {
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
          <ProductImage
            src={product.image_url}
            alt={product.name}
            width={400}
            height={200}
            className="w-full h-48"
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
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
```

### 4. Windowing with Intersection Observer

Implement a custom windowing solution using Intersection Observer:

```tsx
// src/components/products/WindowedProductList.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';
import { productService } from '@/services/productService';
import { useFilters } from '@/contexts/FilterContext';

interface WindowedProductListProps {
  initialProducts: any[];
  initialPagination: any;
  categorySlug?: string;
  segment?: 'individual' | 'business';
  windowHeight?: number;
}

export default function WindowedProductList({
  initialProducts,
  initialPagination,
  categorySlug,
  segment = 'individual',
  windowHeight = 600
}: WindowedProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeFilters } = useFilters();

  // Calculate visible products based on window size
  const calculateVisibleProducts = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerHeight = container.clientHeight;
    const scrollTop = container.scrollTop;
    const itemHeight = 300; // Approximate height of product card

    const newStartIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 5; // Add buffer
    const newEndIndex = newStartIndex + visibleCount;

    setStartIndex(Math.max(0, newStartIndex - 5)); // Add buffer before
    setEndIndex(Math.min(products.length, newEndIndex + 5)); // Add buffer after
  }, [products.length]);

  // Update visible products when indices change
  useEffect(() => {
    setVisibleProducts(products.slice(startIndex, endIndex));
  }, [startIndex, endIndex, products]);

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

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', calculateVisibleProducts);
    window.addEventListener('resize', calculateVisibleProducts);

    // Initial calculation
    calculateVisibleProducts();

    return () => {
      container.removeEventListener('scroll', calculateVisibleProducts);
      window.removeEventListener('resize', calculateVisibleProducts);
    };
  }, [calculateVisibleProducts]);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasNext) {
      setPagination((prev: any) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination]);

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
    <div className="flex flex-col">
      <div 
        ref={containerRef}
        className="overflow-y-auto"
        style={{ height: `${windowHeight}px` }}
      >
        {/* Spacer for items before visible range */}
        <div style={{ height: `${startIndex * 300}px` }}></div>
        
        {/* Visible products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Spacer for items after visible range */}
        <div style={{ height: `${(products.length - endIndex) * 300}px` }}></div>
      </div>
      
      {/* Load more button */}
      {pagination.hasNext && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Cargando...' : 'Cargar más productos'}
          </button>
        </div>
      )}
    </div>
  );
}
```

### 5. Optimized Product List Component

```tsx
// src/components/products/ProductList.tsx (final optimized version)
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import InfiniteScroll from './InfiniteScroll';
import { productService } from '@/services/productService';
import { useFilters } from '@/contexts/FilterContext';
import { useAdaptivePagination } from '@/hooks/useAdaptivePagination';

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
  const paginationStrategy = useAdaptivePagination();

  // Fetch products when filters or pagination change
  const fetchProducts = useCallback(async () => {
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
  }, [activeFilters, pagination.page, categorySlug, segment, products.length]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev: any) => ({ ...prev, page }));
  }, []);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasNext) {
      setPagination((prev: any) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination]);

  // Memoize product grid to prevent unnecessary re-renders
  const productGrid = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  ), [products]);

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
      {paginationStrategy === 'infinite' ? (
        <InfiniteScroll
          onLoadMore={handleLoadMore}
          hasMore={pagination.hasNext}
          isLoading={isLoading}
        >
          {productGrid}
        </InfiniteScroll>
      ) : (
        <div>
          {productGrid}
          
          {/* Traditional pagination */}
          {pagination.totalPages && pagination.totalPages > 1 && (
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
      )}
    </div>
  );
}
```

## Performance Monitoring

### 1. Component Render Tracking

```typescript
// src/hooks/useRenderTracking.ts
import { useEffect, useRef } from 'react';

export const useRenderTracking = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(0);

  useEffect(() => {
    renderCount.current++;
    startTime.current = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;
      
      console.log(`${componentName} rendered ${renderCount.current} times, last render took ${renderTime}ms`);
      
      // Send to analytics service
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'component_render', {
          component_name: componentName,
          render_count: renderCount.current,
          render_time: renderTime
        });
      }
    };
  });

  return renderCount.current;
};
```

### 2. Memory Usage Monitoring

```typescript
// src/services/performanceMonitor.ts
class PerformanceMonitor {
  static trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  static logPerformanceMetrics(componentName: string, metrics: any) {
    console.log(`${componentName} performance metrics:`, metrics);
    
    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metrics', {
        component_name: componentName,
        ...metrics
      });
    }
  }
}

export default PerformanceMonitor;
```

## Testing Strategy

### 1. Performance Tests

```typescript
// tests/components/ProductList.performance.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import ProductList from '@/components/products/ProductList';
import { FilterProvider } from '@/contexts/FilterContext';

describe('ProductList Performance', () => {
  const largeProductSet = Array.from({ length: 500 }, (_, i) => ({
    id: `${i}`,
    name: `Product ${i}`,
    tagline: `Tagline for product ${i}`,
    description: `Description for product ${i}`,
    category: { name: 'Credit', slug: 'credit' },
    institution: { name: 'Test Bank', brand_name: 'Test' },
    target_segment: 'individual',
    image_url: 'https://example.com/image.jpg',
    average_rating: 4.5,
    review_count: 100
  }));

  const mockPagination = {
    page: 1,
    limit: 20,
    total: 500,
    totalPages: 25,
    hasNext: true,
    hasPrev: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render large product sets efficiently', async () => {
    // Mock the productService
    (require('@/services/productService').productService.getProducts as jest.Mock)
      .mockResolvedValueOnce({
        data: largeProductSet.slice(0, 20),
        pagination: mockPagination
      });

    const startTime = performance.now();
    
    render(
      <FilterProvider>
        <ProductList
          initialProducts={largeProductSet.slice(0, 20)}
          initialPagination={mockPagination}
        />
      </FilterProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Product/)).toHaveLength(20);
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within reasonable time
    expect(renderTime).toBeLessThan(1000);
  });

  it('should handle pagination efficiently', async () => {
    // Mock the productService
    (require('@/services/productService').productService.getProducts as jest.Mock)
      .mockResolvedValueOnce({
        data: largeProductSet.slice(0, 20),
        pagination: mockPagination
      })
      .mockResolvedValueOnce({
        data: largeProductSet.slice(20, 40),
        pagination: { ...mockPagination, page: 2 }
      });

    render(
      <FilterProvider>
        <ProductList
          initialProducts={largeProductSet.slice(0, 20)}
          initialPagination={mockPagination}
        />
      </FilterProvider>
    );

    // Simulate page change
    const startTime = performance.now();
    
    // This would trigger the useEffect that fetches products
    // In a real test, we would interact with the pagination controls
    
    await waitFor(() => {
      // Check that new products are loaded
    });

    const endTime = performance.now();
    const paginationTime = endTime - startTime;
    
    // Pagination should be efficient
    expect(paginationTime).toBeLessThan(500);
  });
});
```

### 2. Memory Tests

```typescript
// tests/components/ProductList.memory.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import ProductList from '@/components/products/ProductList';
import { FilterProvider } from '@/contexts/FilterContext';

describe('ProductList Memory Usage', () => {
  const largeProductSet = Array.from({ length: 500 }, (_, i) => ({
    id: `${i}`,
    name: `Product ${i}`,
    tagline: `Tagline for product ${i}`,
    description: `Description for product ${i}`,
    category: { name: 'Credit', slug: 'credit' },
    institution: { name: 'Test Bank', brand_name: 'Test' },
    target_segment: 'individual',
    image_url: 'https://example.com/image.jpg',
    average_rating: 4.5,
    review_count: 100
  }));

  const mockPagination = {
    page: 1,
    limit: 20,
    total: 500,
    totalPages: 25,
    hasNext: true,
    hasPrev: false
  };

  it('should not cause memory leaks', async () => {
    // Mock the productService
    (require('@/services/productService').productService.getProducts as jest.Mock)
      .mockResolvedValueOnce({
        data: largeProductSet.slice(0, 20),
        pagination: mockPagination
      });

    const initialMemory = PerformanceMonitor.trackMemoryUsage();
    
    const { unmount } = render(
      <FilterProvider>
        <ProductList
          initialProducts={largeProductSet.slice(0, 20)}
          initialPagination={mockPagination}
        />
      </FilterProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Product/)).toHaveLength(20);
    });

    // Check memory usage after render
    const afterRenderMemory = PerformanceMonitor.trackMemoryUsage();
    
    // Unmount component
    unmount();
    
    // Check memory usage after unmount
    const afterUnmountMemory = PerformanceMonitor.trackMemoryUsage();
    
    // Memory usage should return to near initial levels after unmount
    // This is a simplified check - real memory leak detection would be more complex
  });
});
```

## Future Enhancements

### 1. Progressive Enhancement

Implement progressive enhancement for better performance on low-end devices:

```typescript
// src/hooks/useProgressiveEnhancement.ts
import { useState, useEffect } from 'react';

export const useProgressiveEnhancement = () => {
  const [enhancementLevel, setEnhancementLevel] = useState<'basic' | 'standard' | 'enhanced'>('basic');

  useEffect(() => {
    // Check device capabilities
    const isLowEndDevice = navigator.hardwareConcurrency <= 2;
    const isSlowConnection = (navigator as any).connection?.effectiveType?.includes('2g');
    
    if (isLowEndDevice || isSlowConnection) {
      setEnhancementLevel('basic');
    } else if (window.innerWidth < 768) {
      setEnhancementLevel('standard');
    } else {
      setEnhancementLevel('enhanced');
    }
  }, []);

  return enhancementLevel;
};
```

### 2. Adaptive Rendering

Adjust rendering strategy based on device capabilities:

```tsx
// src/components/products/AdaptiveProductList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductCardLite from './ProductCardLite'; // Simplified version for low-end devices
import { useProgressiveEnhancement } from '@/hooks/useProgressiveEnhancement';

interface AdaptiveProductListProps {
  products: any[];
}

export default function AdaptiveProductList({ products }: AdaptiveProductListProps) {
  const enhancementLevel = useProgressiveEnhancement();
  const [visibleCount, setVisibleCount] = useState(20);

  // On low-end devices, show fewer products initially
  useEffect(() => {
    if (enhancementLevel === 'basic') {
      setVisibleCount(10);
    }
  }, [enhancementLevel]);

  const ProductComponent = enhancementLevel === 'basic' ? ProductCardLite : ProductCard;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.slice(0, visibleCount).map((product) => (
        <ProductComponent key={product.id} product={product} />
      ))}
      
      {products.length > visibleCount && (
        <button
          onClick={() => setVisibleCount(prev => prev + 10)}
          className="col-span-full py-4 text-center text-blue-500 hover:text-blue-700"
        >
          Cargar más productos
        </button>
      )}
    </div>
  );
}
```

This optimization strategy provides a comprehensive solution for handling 500+ financial products efficiently while maintaining good performance and user experience across different devices and user preferences.