# Pagination System for Handling Large Product Sets

## Overview

This document outlines the implementation of a robust pagination system designed to efficiently handle 500+ financial products while maintaining good performance and user experience.

## Pagination Strategies

### 1. Offset-Based Pagination (Current Implementation)

#### Pros:
- Simple to implement
- Works well for small to medium datasets
- Easy to understand for users

#### Cons:
- Performance degrades with large offsets
- Inconsistent results with data changes
- Not suitable for deep pagination

#### Implementation:
```sql
-- Example query with offset-based pagination
SELECT * FROM financial.products 
WHERE is_active = true 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 40;  -- Page 3 with 20 items per page
```

### 2. Cursor-Based Pagination (Recommended for Large Sets)

#### Pros:
- Consistent performance regardless of page depth
- Stable results even with data changes
- Efficient for large datasets

#### Cons:
- More complex to implement
- Requires cursor management
- Not as intuitive for users

#### Implementation:
```sql
-- Example query with cursor-based pagination
SELECT * FROM financial.products 
WHERE is_active = true 
  AND created_at < '2023-01-01 12:00:00' 
ORDER BY created_at DESC 
LIMIT 20;
```

### 3. Hybrid Approach (Recommended)

Use offset-based pagination for the first few pages (1-5) and cursor-based pagination for deeper pages to get the benefits of both approaches.

## API Design

### Response Format
```json
{
  "data": [
    // Product objects
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false,
    "next_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyMy0wMS0wMVQxMjowMDowMC4wMDBaIn0=",
    "prev_cursor": null
  }
}
```

### Query Parameters
```
GET /api/products?page=1&limit=20&cursor=eyJjcmVhdGVkX2F0IjoiMjAyMy0wMS0wMVQxMjowMDowMC4wMDBaIn0=
```

## Implementation Details

### 1. Backend Pagination Service

```typescript
// backend/src/services/PaginationService.ts
interface PaginationOptions {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total?: number;
    totalPages?: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextCursor?: string;
    prevCursor?: string;
  };
}

class PaginationService {
  /**
   * Apply pagination to a database query
   */
  applyPagination<T>(
    query: string,
    params: any[],
    options: PaginationOptions
  ): { query: string; params: any[] } {
    const { page = 1, limit = 20, cursor } = options;
    
    // Validate limit
    const validatedLimit = Math.min(Math.max(limit, 1), 100); // Max 100 items per page
    
    if (cursor) {
      // Cursor-based pagination
      const decodedCursor = this.decodeCursor(cursor);
      // Add cursor condition to query
      // This is a simplified example - actual implementation depends on cursor fields
      query += ` AND created_at < $${params.length + 1}`;
      params.push(decodedCursor.created_at);
    } else {
      // Offset-based pagination
      const offset = (Math.max(page, 1) - 1) * validatedLimit;
      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(validatedLimit, offset);
    }
    
    return { query, params };
  }

  /**
   * Generate pagination metadata
   */
  generatePaginationMetadata<T>(
    data: T[],
    options: PaginationOptions,
    total?: number
  ): PaginationResult<T>['pagination'] {
    const { page = 1, limit = 20, cursor } = options;
    const validatedLimit = Math.min(Math.max(limit, 1), 100);
    
    if (cursor) {
      // Cursor-based pagination
      const hasNext = data.length === validatedLimit;
      const nextCursor = hasNext ? this.encodeCursor(data[data.length - 1]) : undefined;
      
      return {
        page: 0, // Not applicable for cursor-based
        limit: validatedLimit,
        hasNext,
        hasPrev: true, // Assume we have previous if using cursor
        nextCursor,
        prevCursor: cursor
      };
    } else {
      // Offset-based pagination
      const validatedPage = Math.max(page, 1);
      const hasNext = data.length === validatedLimit;
      const hasPrev = validatedPage > 1;
      const totalPages = total ? Math.ceil(total / validatedLimit) : undefined;
      
      return {
        page: validatedPage,
        limit: validatedLimit,
        total,
        totalPages,
        hasNext,
        hasPrev
      };
    }
  }

  /**
   * Encode cursor for pagination
   */
  private encodeCursor(data: any): string {
    // In a real implementation, you would encode the relevant fields
    // For example, if sorting by created_at, encode that field
    return Buffer.from(JSON.stringify(data)).toString('base64');
  }

  /**
   * Decode cursor for pagination
   */
  private decodeCursor(cursor: string): any {
    try {
      return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
    } catch (error) {
      throw new Error('Invalid cursor');
    }
  }
}
```

### 2. Updated Product Service with Pagination

```typescript
// backend/src/services/ProductService.ts (updated)
import { PaginationService, PaginationOptions, PaginationResult } from './PaginationService';

export class ProductService {
  private paginationService: PaginationService;

  constructor() {
    this.paginationService = new PaginationService();
  }

  /**
   * Get products with filtering and pagination
   */
  async getProducts(options: ProductQueryOptions): Promise<PaginationResult<any>> {
    const {
      category,
      segment,
      page,
      limit,
      cursor,
      sort,
      search,
      filters
    } = options;

    // Build the base query
    let query = `
      SELECT 
        p.id, p.name, p.tagline, p.description, p.image_url,
        p.interest_rate_min, p.interest_rate_max, p.annual_fee,
        p.is_featured, p.created_at,
        r.average_rating, r.review_count,
        i.id as institution_id, i.name as institution_name, i.brand_name as institution_brand,
        c.id as category_id, c.name as category_name, c.slug as category_slug
      FROM financial.products p
      JOIN financial.product_ratings r ON p.id = r.product_id
      JOIN financial.institutions i ON p.institution_id = i.id
      JOIN financial.product_categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Add filters (same as before)
    // ... filter logic ...

    // Add sorting
    switch (sort) {
      case 'interest_rate_asc':
        query += ' ORDER BY p.interest_rate_min ASC';
        break;
      case 'interest_rate_desc':
        query += ' ORDER BY p.interest_rate_max DESC';
        break;
      case 'annual_fee_asc':
        query += ' ORDER BY p.annual_fee ASC';
        break;
      case 'annual_fee_desc':
        query += ' ORDER BY p.annual_fee DESC';
        break;
      case 'rating_desc':
        query += ' ORDER BY r.average_rating DESC';
        break;
      case 'newest':
        query += ' ORDER BY p.created_at DESC';
        break;
      default:
        query += ' ORDER BY p.is_featured DESC, r.average_rating DESC';
    }

    // Apply pagination
    const paginationOptions: PaginationOptions = { page, limit, cursor };
    const { query: paginatedQuery, params: paginatedParams } = 
      this.paginationService.applyPagination(query, params, paginationOptions);

    // Execute query
    const result = await this.db.query(paginatedQuery, [...paginatedParams]);

    // For offset-based pagination, get total count
    let total: number | undefined;
    if (!cursor) {
      let countQuery = `
        SELECT COUNT(*) as total
        FROM financial.products p
        JOIN financial.institutions i ON p.institution_id = i.id
        JOIN financial.product_categories c ON p.category_id = c.id
        WHERE p.is_active = true
      `;

      // Add the same filters to count query
      // ... count query filters ...

      const countResult = await this.db.query(countQuery, countParams);
      total = parseInt(countResult.rows[0].total);
    }

    // Transform results (same as before)
    const products = result.rows.map(row => ({
      // ... product transformation ...
    }));

    // Generate pagination metadata
    const pagination = this.paginationService.generatePaginationMetadata(
      products,
      paginationOptions,
      total
    );

    return {
      data: products,
      pagination
    };
  }
}
```

## Frontend Implementation

### 1. Pagination Component

```tsx
// src/components/products/Pagination.tsx
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  onNext,
  onPrev,
  className = ''
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center justify-between ${className}`} aria-label="Pagination">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          onClick={onPrev}
          disabled={!hasPrev}
          variant="outline"
          size="sm"
        >
          Anterior
        </Button>
        <Button
          onClick={onNext}
          disabled={!hasNext}
          variant="outline"
          size="sm"
        >
          Siguiente
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando página <span className="font-medium">{currentPage}</span> de{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <ul className="flex items-center gap-1">
            <li>
              <Button
                onClick={onPrev}
                disabled={!hasPrev}
                variant="outline"
                size="sm"
                className="rounded-md"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Anterior</span>
              </Button>
            </li>
            
            {getPageNumbers().map((page, index) => (
              <li key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-gray-500">
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                ) : (
                  <Button
                    onClick={() => onPageChange(page as number)}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    className="rounded-md"
                  >
                    {page}
                  </Button>
                )}
              </li>
            ))}
            
            <li>
              <Button
                onClick={onNext}
                disabled={!hasNext}
                variant="outline"
                size="sm"
                className="rounded-md"
              >
                <span className="sr-only">Siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Pagination;
```

### 2. Infinite Scroll Component

```tsx
// src/components/products/InfiniteScroll.tsx
import React, { useEffect, useRef, useState } from 'react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  onLoadMore,
  hasMore,
  isLoading
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isFetching) {
        setIsFetching(true);
        onLoadMore();
      }
    });

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isLoading, isFetching, onLoadMore]);

  useEffect(() => {
    if (!isLoading) {
      setIsFetching(false);
    }
  }, [isLoading]);

  return (
    <div>
      {children}
      {hasMore && (
        <div ref={lastElementRef} className="py-4 flex justify-center">
          {isLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
```

### 3. Updated Product List Component

```tsx
// src/components/products/ProductList.tsx (updated)
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import InfiniteScroll from './InfiniteScroll';
import { useFilters } from '@/contexts/FilterContext';

interface ProductListProps {
  initialProducts: any[];
  initialPagination: any;
  categorySlug?: string;
  viewMode?: 'grid' | 'list';
}

const ProductList: React.FC<ProductListProps> = ({
  initialProducts,
  initialPagination,
  categorySlug,
  viewMode = 'grid'
}) => {
  const [products, setProducts] = useState(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const { activeFilters } = useFilters();

  // Fetch products when filters or pagination change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      
      try {
        const queryParams = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          ...Object.fromEntries(
            activeFilters.map(filter => [filter.slug, JSON.stringify(filter.value)])
          )
        });

        if (categorySlug) {
          queryParams.append('category', categorySlug);
        }

        const response = await fetch(`/api/products?${queryParams}`);
        const result = await response.json();
        
        if (pagination.page === 1) {
          setProducts(result.data);
        } else {
          setProducts(prev => [...prev, ...result.data]);
        }
        
        setPagination(result.pagination);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeFilters, pagination.page, categorySlug]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLoadMore = () => {
    if (pagination.hasNext) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
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
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} />
          ))}
        </div>
      </InfiniteScroll>

      {/* Traditional pagination for non-infinite scroll */}
      {!pagination.nextCursor && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages || 1}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
```

## Performance Optimization

### 1. Database Indexing for Pagination

```sql
-- Index for common pagination patterns
CREATE INDEX idx_products_active_created_at ON financial.products(is_active, created_at DESC);
CREATE INDEX idx_products_active_rating ON financial.products(is_active, average_rating DESC);
CREATE INDEX idx_products_active_featured ON financial.products(is_active, is_featured DESC, average_rating DESC);
```

### 2. Caching Pagination Results

```typescript
// backend/src/services/CacheService.ts
import Redis from 'ioredis';

class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });
  }

  async getCachedProducts(cacheKey: string): Promise<any | null> {
    const cached = await this.redis.get(cacheKey);
    return cached ? JSON.parse(cached) : null;
  }

  async cacheProducts(cacheKey: string, data: any, ttl: number = 300): Promise<void> {
    await this.redis.setex(cacheKey, ttl, JSON.stringify(data));
  }

  generateCacheKey(options: any): string {
    // Generate a unique cache key based on query options
    const keyParts = [
      'products',
      options.category || 'all',
      options.segment || 'all',
      options.page || 1,
      options.limit || 20,
      options.sort || 'default'
    ];

    // Add active filters to cache key
    if (options.filters) {
      const filterString = Object.entries(options.filters)
        .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
        .join('|');
      keyParts.push(filterString);
    }

    return keyParts.join(':');
  }
}
```

### 3. Pre-fetching Next Pages

```typescript
// src/hooks/usePrefetchPagination.ts
import { useEffect } from 'react';

export const usePrefetchPagination = (
  currentPage: number,
  totalPages: number,
  prefetchFn: (page: number) => void
) => {
  useEffect(() => {
    // Prefetch next page
    if (currentPage < totalPages) {
      prefetchFn(currentPage + 1);
    }

    // Prefetch previous page
    if (currentPage > 1) {
      prefetchFn(currentPage - 1);
    }
  }, [currentPage, totalPages, prefetchFn]);
};
```

## User Experience Considerations

### 1. Loading States

```tsx
// src/components/products/ProductListSkeleton.tsx
import React from 'react';

const ProductListSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
          <div className="bg-gray-200 h-48 w-full"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductListSkeleton;
```

### 2. Pagination Size Options

```tsx
// src/components/products/PaginationSizeSelector.tsx
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaginationSizeSelectorProps {
  currentSize: number;
  onSizeChange: (size: number) => void;
  sizes?: number[];
}

const PaginationSizeSelector: React.FC<PaginationSizeSelectorProps> = ({
  currentSize,
  onSizeChange,
  sizes = [10, 20, 50, 100]
}) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-700">Productos por página:</span>
      <Select
        value={currentSize.toString()}
        onValueChange={(value) => onSizeChange(parseInt(value))}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sizes.map(size => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaginationSizeSelector;
```

### 3. Scroll Restoration

```typescript
// src/hooks/useScrollRestoration.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useScrollRestoration = () => {
  const router = useRouter();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      let shouldScrollRestore = false;

      window.history.scrollRestoration = 'manual';

      const onBeforeUnload = () => {
        sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      };

      const onRouteChangeComplete = () => {
        if (shouldScrollRestore) {
          const scrollPosition = sessionStorage.getItem('scrollPosition');
          if (scrollPosition) {
            window.scrollTo(0, parseInt(scrollPosition));
          }
        }
      };

      window.addEventListener('beforeunload', onBeforeUnload);
      router.events.on('routeChangeComplete', onRouteChangeComplete);

      // Check if we should restore scroll on initial load
      shouldScrollRestore = router.asPath !== '/';

      return () => {
        window.removeEventListener('beforeunload', onBeforeUnload);
        router.events.off('routeChangeComplete', onRouteChangeComplete);
      };
    }
  }, [router.asPath, router.events]);
};
```

## Testing Strategy

### 1. Unit Tests

```typescript
// tests/services/PaginationService.test.ts
import { PaginationService } from '@/services/PaginationService';

describe('PaginationService', () => {
  let paginationService: PaginationService;

  beforeEach(() => {
    paginationService = new PaginationService();
  });

  describe('applyPagination', () => {
    it('should apply offset-based pagination correctly', () => {
      const query = 'SELECT * FROM products WHERE active = true';
      const params = [];
      const options = { page: 2, limit: 10 };

      const result = paginationService.applyPagination(query, params, options);
      
      expect(result.query).toContain('LIMIT $1 OFFSET $2');
      expect(result.params).toEqual([10, 10]);
    });

    it('should apply cursor-based pagination correctly', () => {
      const query = 'SELECT * FROM products WHERE active = true';
      const params = [];
      const options = { 
        cursor: Buffer.from(JSON.stringify({ created_at: '2023-01-01' })).toString('base64'),
        limit: 10 
      };

      const result = paginationService.applyPagination(query, params, options);
      
      expect(result.query).toContain('AND created_at < $1');
      expect(result.params).toEqual(['2023-01-01']);
    });
  });

  describe('generatePaginationMetadata', () => {
    it('should generate correct metadata for offset-based pagination', () => {
      const data = Array(10).fill({});
      const options = { page: 2, limit: 10 };
      const total = 50;

      const result = paginationService.generatePaginationMetadata(data, options, total);
      
      expect(result).toEqual({
        page: 2,
        limit: 10,
        total: 50,
        totalPages: 5,
        hasNext: true,
        hasPrev: true
      });
    });
  });
});
```

### 2. Integration Tests

```typescript
// tests/components/Pagination.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '@/components/products/Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders pagination controls correctly', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        hasNext={true}
        hasPrev={false}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onPageChange when a page number is clicked', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        hasNext={true}
        hasPrev={false}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText('2'));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('hides pagination when there is only one page', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        hasNext={false}
        hasPrev={false}
        onPageChange={mockOnPageChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
```

## Monitoring and Analytics

### 1. Pagination Performance Tracking

```typescript
// src/services/AnalyticsService.ts (updated)
class AnalyticsService {
  trackPaginationEvent(event: 'page_change' | 'load_more' | 'size_change', data: any) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', `pagination_${event}`, data);
    }
  }

  trackPaginationPerformance(page: number, loadTime: number) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pagination_performance', {
        page,
        load_time: loadTime
      });
    }
  }
}
```

### 2. User Behavior Analysis

Track how users interact with pagination:
- Which pagination method they prefer (traditional vs. infinite scroll)
- How many pages they typically browse
- When they change page size
- Where they drop off in the pagination flow

## Future Enhancements

### 1. Virtualized Lists

For extremely large datasets, implement virtualized lists:

```typescript
// src/components/products/VirtualizedProductList.tsx
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import ProductCard from './ProductCard';

interface VirtualizedProductListProps {
  products: any[];
  itemHeight: number;
}

const VirtualizedProductList: React.FC<VirtualizedProductListProps> = ({
  products,
  itemHeight
}) => {
  const Item = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ProductCard product={products[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={products.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Item}
    </List>
  );
};

export default VirtualizedProductList;
```

### 2. Adaptive Pagination

Adjust pagination strategy based on user behavior and device capabilities:

```typescript
// src/hooks/useAdaptivePagination.ts
import { useState, useEffect } from 'react';

export const useAdaptivePagination = () => {
  const [strategy, setStrategy] = useState<'traditional' | 'infinite' | 'virtual'>('traditional');

  useEffect(() => {
    const updateStrategy = () => {
      // Check device capabilities
      const isMobile = window.innerWidth < 768;
      const isLowEndDevice = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Check user preferences from localStorage
      const userPreference = localStorage.getItem('paginationPreference');
      
      if (userPreference) {
        setStrategy(userPreference as any);
      } else if (isMobile || isLowEndDevice) {
        setStrategy('infinite');
      } else {
        setStrategy('traditional');
      }
    };

    updateStrategy();
    window.addEventListener('resize', updateStrategy);

    return () => {
      window.removeEventListener('resize', updateStrategy);
    };
  }, []);

  return strategy;
};
```

This pagination system provides a robust solution for handling 500+ financial products efficiently while maintaining good performance and user experience across different devices and user preferences.