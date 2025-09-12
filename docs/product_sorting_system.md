# Product Sorting System for Financial Products

## Overview

This document outlines the implementation of a comprehensive sorting system for financial products that enables users to efficiently organize 500+ products by various criteria.

## Sorting Requirements

### 1. Sort Criteria
- **Relevance**: Based on search term matching (when searching)
- **Featured**: Featured products first, then by rating
- **Rating**: Highest rated products first
- **Newest**: Most recently added products first
- **Interest Rate**: Lowest to highest or highest to lowest
- **Annual Fee**: Lowest to highest or highest to lowest
- **Review Count**: Products with most reviews first

### 2. Implementation Scope
- Backend API endpoints with sorting parameters
- Frontend UI components for sort selection
- Database indexing for efficient sorting
- Default sorting behavior for different contexts

## Backend Implementation

### 1. Database Indexes for Sorting

```sql
-- Add indexes for common sort fields
CREATE INDEX idx_products_average_rating ON financial.product_ratings (average_rating DESC);
CREATE INDEX idx_products_created_at ON financial.products (created_at DESC);
CREATE INDEX idx_products_interest_rate_min ON financial.products (interest_rate_min ASC);
CREATE INDEX idx_products_interest_rate_max ON financial.products (interest_rate_max DESC);
CREATE INDEX idx_products_annual_fee ON financial.products (annual_fee ASC);
CREATE INDEX idx_products_review_count ON financial.product_ratings (review_count DESC);
CREATE INDEX idx_products_is_featured ON financial.products (is_featured DESC);

-- Composite indexes for common sort combinations
CREATE INDEX idx_products_featured_rating ON financial.products (is_featured DESC, average_rating DESC);
CREATE INDEX idx_products_category_featured ON financial.products (category_id, is_featured DESC);
```

### 2. Updated Product Service with Sorting

```typescript
// backend/src/services/ProductService.ts (updated with sorting)
import { Pool } from 'pg';
import { PaginationService, PaginationOptions, PaginationResult } from './PaginationService';

interface ProductQueryOptions {
  category?: string;
  segment?: string;
  page?: number;
  limit?: number;
  cursor?: string;
  sort?: string;
  search?: string;
  filters?: Record<string, any>;
}

export class ProductService {
  private db: Pool;
  private paginationService: PaginationService;

  constructor(db: Pool) {
    this.db = db;
    this.paginationService = new PaginationService();
  }

  /**
   * Get products with filtering, pagination, and sorting
   */
  async getProducts(options: ProductQueryOptions): Promise<PaginationResult<any>> {
    const {
      category,
      segment,
      page = 1,
      limit = 20,
      cursor,
      sort = 'featured',
      search,
      filters = {}
    } = options;

    // Use search function if search term is provided
    if (search) {
      return this.searchProducts(search, category, segment, page, limit, sort, filters);
    }

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

    // Add filters
    if (category) {
      query += ` AND c.slug = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (segment) {
      query += ` AND (p.target_segment = $${paramIndex} OR p.target_segment = 'both')`;
      params.push(segment);
      paramIndex++;
    }

    // Add dynamic filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        switch (key) {
          case 'min_income':
            query += ` AND p.target_income_min <= $${paramIndex}`;
            params.push(value);
            paramIndex++;
            break;
          case 'max_annual_fee':
            query += ` AND p.annual_fee <= $${paramIndex}`;
            params.push(value);
            paramIndex++;
            break;
          case 'institution':
            query += ` AND i.slug = $${paramIndex}`;
            params.push(value);
            paramIndex++;
            break;
          // Add more filter cases as needed
        }
      }
    });

    // Add sorting
    switch (sort) {
      case 'interest_rate_asc':
        query += ' ORDER BY p.interest_rate_min ASC NULLS LAST';
        break;
      case 'interest_rate_desc':
        query += ' ORDER BY p.interest_rate_max DESC NULLS LAST';
        break;
      case 'annual_fee_asc':
        query += ' ORDER BY p.annual_fee ASC NULLS LAST';
        break;
      case 'annual_fee_desc':
        query += ' ORDER BY p.annual_fee DESC NULLS LAST';
        break;
      case 'rating_desc':
        query += ' ORDER BY r.average_rating DESC NULLS LAST';
        break;
      case 'review_count_desc':
        query += ' ORDER BY r.review_count DESC NULLS LAST';
        break;
      case 'newest':
        query += ' ORDER BY p.created_at DESC';
        break;
      default:
        query += ' ORDER BY p.is_featured DESC, r.average_rating DESC NULLS LAST';
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

      const countParams: any[] = [];
      let countParamIndex = 1;

      // Add the same filters to count query
      if (category) {
        countQuery += ` AND c.slug = $${countParamIndex}`;
        countParams.push(category);
        countParamIndex++;
      }

      if (segment) {
        countQuery += ` AND (p.target_segment = $${countParamIndex} OR p.target_segment = 'both')`;
        countParams.push(segment);
        countParamIndex++;
      }

      // Add dynamic filters to count query
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          switch (key) {
            case 'min_income':
              countQuery += ` AND p.target_income_min <= $${countParamIndex}`;
              countParams.push(value);
              countParamIndex++;
              break;
            case 'max_annual_fee':
              countQuery += ` AND p.annual_fee <= $${countParamIndex}`;
              countParams.push(value);
              countParamIndex++;
              break;
            case 'institution':
              countQuery += ` AND i.slug = $${countParamIndex}`;
              countParams.push(value);
              countParamIndex++;
              break;
          }
        }
      });

      const countResult = await this.db.query(countQuery, countParams);
      total = parseInt(countResult.rows[0].total);
    }

    // Transform results
    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      tagline: row.tagline,
      description: row.description,
      image_url: row.image_url,
      interest_rate_min: row.interest_rate_min,
      interest_rate_max: row.interest_rate_max,
      annual_fee: row.annual_fee,
      is_featured: row.is_featured,
      created_at: row.created_at,
      average_rating: parseFloat(row.average_rating),
      review_count: parseInt(row.review_count),
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug
      },
      institution: {
        id: row.institution_id,
        name: row.institution_name,
        brand_name: row.institution_brand
      }
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

  /**
   * Search products with full-text search and sorting
   */
  async searchProducts(
    searchTerm: string,
    category?: string,
    segment?: string,
    page: number = 1,
    limit: number = 20,
    sort: string = 'featured',
    filters: Record<string, any> = {}
  ): Promise<PaginationResult<any>> {
    // Prepare search term for PostgreSQL full-text search
    const preparedSearchTerm = searchTerm
      .toLowerCase()
      .replace(/\s+/g, ' & ')
      .replace(/[^a-z0-9&\s]/g, '');

    // Build search query
    let query = `
      SELECT 
        id, name, tagline, description, image_url,
        interest_rate_min, interest_rate_max, annual_fee,
        is_featured, created_at, average_rating, review_count,
        institution_name, category_name, relevance
      FROM search_products($1, $2, $3, $4, $5)
    `;

    const params = [preparedSearchTerm, category, segment, limit, (page - 1) * limit];
    let paramIndex = 6;

    // Add dynamic filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        switch (key) {
          case 'min_income':
            query += ` AND target_income_min <= $${paramIndex}`;
            params.push(value);
            paramIndex++;
            break;
          case 'max_annual_fee':
            query += ` AND annual_fee <= $${paramIndex}`;
            params.push(value);
            paramIndex++;
            break;
          case 'institution':
            query += ` AND institution_slug = $${paramIndex}`;
            params.push(value);
            paramIndex++;
            break;
        }
      }
    });

    // Add sorting
    switch (sort) {
      case 'relevance':
        query += ' ORDER BY relevance DESC, average_rating DESC NULLS LAST';
        break;
      case 'interest_rate_asc':
        query += ' ORDER BY interest_rate_min ASC NULLS LAST, relevance DESC';
        break;
      case 'interest_rate_desc':
        query += ' ORDER BY interest_rate_max DESC NULLS LAST, relevance DESC';
        break;
      case 'annual_fee_asc':
        query += ' ORDER BY annual_fee ASC NULLS LAST, relevance DESC';
        break;
      case 'annual_fee_desc':
        query += ' ORDER BY annual_fee DESC NULLS LAST, relevance DESC';
        break;
      case 'rating_desc':
        query += ' ORDER BY average_rating DESC NULLS LAST, relevance DESC';
        break;
      case 'review_count_desc':
        query += ' ORDER BY review_count DESC NULLS LAST, relevance DESC';
        break;
      case 'newest':
        query += ' ORDER BY created_at DESC, relevance DESC';
        break;
      default:
        query += ' ORDER BY is_featured DESC, average_rating DESC NULLS LAST, relevance DESC';
    }

    // Execute search query
    const result = await this.db.query(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM financial.products p
      JOIN financial.institutions i ON p.institution_id = i.id
      JOIN financial.product_categories c ON p.category_id = c.id
      WHERE p.is_active = true
        AND i.is_active = true
        AND p.search_vector @@ to_tsquery('spanish', $1)
    `;

    const countParams = [preparedSearchTerm];
    let countParamIndex = 2;

    if (category) {
      countQuery += ` AND c.slug = $${countParamIndex}`;
      countParams.push(category);
      countParamIndex++;
    }

    if (segment) {
      countQuery += ` AND (p.target_segment = $${countParamIndex} OR p.target_segment = 'both')`;
      countParams.push(segment);
      countParamIndex++;
    }

    // Add dynamic filters to count query
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        switch (key) {
          case 'min_income':
            countQuery += ` AND p.target_income_min <= $${countParamIndex}`;
            countParams.push(value);
            countParamIndex++;
            break;
          case 'max_annual_fee':
            countQuery += ` AND p.annual_fee <= $${countParamIndex}`;
            countParams.push(value);
            countParamIndex++;
            break;
          case 'institution':
            countQuery += ` AND i.slug = $${countParamIndex}`;
            countParams.push(value);
            countParamIndex++;
            break;
        }
      }
    });

    const countResult = await this.db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Transform results
    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      tagline: row.tagline,
      description: row.description,
      image_url: row.image_url,
      interest_rate_min: row.interest_rate_min,
      interest_rate_max: row.interest_rate_max,
      annual_fee: row.annual_fee,
      is_featured: row.is_featured,
      created_at: row.created_at,
      average_rating: parseFloat(row.average_rating),
      review_count: parseInt(row.review_count),
      category: {
        name: row.category_name
      },
      institution: {
        name: row.institution_name
      }
    }));

    // Generate pagination metadata
    const pagination = this.paginationService.generatePaginationMetadata(
      products,
      { page, limit },
      total
    );

    return {
      data: products,
      pagination
    };
  }

  /**
   * Get available sort options
   */
  getSortOptions(): Array<{ value: string; label: string; description: string }> {
    return [
      { 
        value: 'featured', 
        label: 'Destacados', 
        description: 'Productos destacados primero, luego por calificación'
      },
      { 
        value: 'rating_desc', 
        label: 'Mejor Calificados', 
        description: 'Productos con la mejor calificación primero'
      },
      { 
        value: 'newest', 
        label: 'Más Recientes', 
        description: 'Productos añadidos más recientemente primero'
      },
      { 
        value: 'interest_rate_asc', 
        label: 'Tasa de Interés (Menor)', 
        description: 'Productos con la menor tasa de interés primero'
      },
      { 
        value: 'interest_rate_desc', 
        label: 'Tasa de Interés (Mayor)', 
        description: 'Productos con la mayor tasa de interés primero'
      },
      { 
        value: 'annual_fee_asc', 
        label: 'Cuota Anual (Menor)', 
        description: 'Productos con la menor cuota anual primero'
      },
      { 
        value: 'annual_fee_desc', 
        label: 'Cuota Anual (Mayor)', 
        description: 'Productos con la mayor cuota anual primero'
      },
      { 
        value: 'review_count_desc', 
        label: 'Más Reseñas', 
        description: 'Productos con más reseñas primero'
      }
    ];
  }
}
```

## Frontend Implementation

### 1. Sort Selector Component

```tsx
// src/components/products/SortSelector.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';

interface SortOption {
  value: string;
  label: string;
  description: string;
}

interface SortSelectorProps {
  onSortChange: (sort: string) => void;
  currentSort: string;
  sortOptions: SortOption[];
}

export default function SortSelector({ onSortChange, currentSort, sortOptions }: SortSelectorProps) {
  const [selectedSort, setSelectedSort] = useState(currentSort);

  useEffect(() => {
    setSelectedSort(currentSort);
  }, [currentSort]);

  const handleChange = (value: string) => {
    setSelectedSort(value);
    onSortChange(value);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Ordenar por:</span>
      <Select value={selectedSort} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Seleccionar orden" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex flex-col">
                <span>{option.label}</span>
                <span className="text-xs text-gray-500">{option.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

### 2. Updated Filter Context with Sort

```typescript
// src/contexts/FilterContext.tsx (updated with sort)
'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { productService } from '@/services/productService';

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

interface ActiveFilter {
  slug: string;
  value: any;
}

interface FilterState {
  activeFilters: ActiveFilter[];
  availableFilters: FilterOption[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  sortOption: string;
  sortOptions: Array<{ value: string; label: string; description: string }>;
}

type FilterAction =
  | { type: 'SET_FILTERS'; payload: FilterOption[] }
  | { type: 'ADD_FILTER'; payload: ActiveFilter }
  | { type: 'REMOVE_FILTER'; payload: string }
  | { type: 'UPDATE_FILTER'; payload: ActiveFilter }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'CLEAR_SEARCH_TERM' }
  | { type: 'SET_SORT_OPTION'; payload: string }
  | { type: 'SET_SORT_OPTIONS'; payload: Array<{ value: string; label: string; description: string }> };

const FilterContext = createContext<{
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
  addFilter: (filter: ActiveFilter) => void;
  removeFilter: (filterSlug: string) => void;
  clearFilters: () => void;
  updateFilter: (filter: ActiveFilter) => void;
  loadFilters: (categorySlug?: string) => Promise<void>;
  applyPreset: (presetFilters: ActiveFilter[]) => void;
  setSearchTerm: (term: string) => void;
  clearSearchTerm: () => void;
  setSortOption: (option: string) => void;
} | undefined>(undefined);

const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'SET_FILTERS':
      return {
        ...state,
        availableFilters: action.payload,
        isLoading: false
      };
    case 'ADD_FILTER':
      return {
        ...state,
        activeFilters: [...state.activeFilters, action.payload]
      };
    case 'REMOVE_FILTER':
      return {
        ...state,
        activeFilters: state.activeFilters.filter(f => f.slug !== action.payload)
      };
    case 'UPDATE_FILTER':
      return {
        ...state,
        activeFilters: state.activeFilters.map(f => 
          f.slug === action.payload.slug ? action.payload : f
        )
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        activeFilters: []
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload
      };
    case 'CLEAR_SEARCH_TERM':
      return {
        ...state,
        searchTerm: ''
      };
    case 'SET_SORT_OPTION':
      return {
        ...state,
        sortOption: action.payload
      };
    case 'SET_SORT_OPTIONS':
      return {
        ...state,
        sortOptions: action.payload
      };
    default:
      return state;
  }
};

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, {
    activeFilters: [],
    availableFilters: [],
    isLoading: false,
    error: null,
    searchTerm: '',
    sortOption: 'featured',
    sortOptions: []
  });

  // Load sort options on initialization
  useEffect(() => {
    const loadSortOptions = async () => {
      try {
        const options = await productService.getSortOptions();
        dispatch({ type: 'SET_SORT_OPTIONS', payload: options });
      } catch (error) {
        console.error('Failed to load sort options:', error);
      }
    };

    loadSortOptions();
  }, []);

  const addFilter = useCallback((filter: ActiveFilter) => {
    dispatch({ type: 'ADD_FILTER', payload: filter });
  }, []);

  const removeFilter = useCallback((filterSlug: string) => {
    dispatch({ type: 'REMOVE_FILTER', payload: filterSlug });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  const updateFilter = useCallback((filter: ActiveFilter) => {
    dispatch({ type: 'UPDATE_FILTER', payload: filter });
  }, []);

  const loadFilters = useCallback(async (categorySlug?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const filters = await productService.getFilters(categorySlug);
      dispatch({ type: 'SET_FILTERS', payload: filters });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load filters' });
      console.error('Error loading filters:', error);
    }
  }, []);

  const applyPreset = useCallback((presetFilters: ActiveFilter[]) => {
    dispatch({ type: 'CLEAR_FILTERS' });
    presetFilters.forEach(filter => {
      dispatch({ type: 'ADD_FILTER', payload: filter });
    });
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  const clearSearchTerm = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH_TERM' });
  }, []);

  const setSortOption = useCallback((option: string) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: option });
  }, []);

  return (
    <FilterContext.Provider
      value={{
        state,
        dispatch,
        addFilter,
        removeFilter,
        clearFilters,
        updateFilter,
        loadFilters,
        applyPreset,
        setSearchTerm,
        clearSearchTerm,
        setSortOption
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
```

### 3. Updated Product List Component with Sort

```tsx
// src/components/products/ProductList.tsx (updated with sort)
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import InfiniteScroll from './InfiniteScroll';
import SortSelector from './SortSelector';
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
  const { state, setSortOption } = useFilters();
  const paginationStrategy = useAdaptivePagination();

  // Fetch products when filters, sort option, or pagination change
  const fetchProducts = useCallback(async () => {
    if (pagination.page === 1 && products.length > 0 && initialProducts.length > 0) {
      // Don't fetch on initial load if we already have data
      return;
    }

    setIsLoading(true);
    
    try {
      const filterParams: any = {
        category: categorySlug,
        segment: segment,
        page: pagination.page,
        limit: pagination.limit,
        sort: state.sortOption,
        search: state.searchTerm
      };

      // Add active filters to request
      state.activeFilters.forEach(filter => {
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
  }, [state.activeFilters, state.sortOption, state.searchTerm, pagination.page, categorySlug, segment, products.length, initialProducts.length]);

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

  const handleSortChange = useCallback((sort: string) => {
    setSortOption(sort);
    // Reset to first page when sort changes
    setPagination((prev: any) => ({ ...prev, page: 1 }));
  }, [setSortOption]);

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
      {/* Sort selector */}
      <div className="mb-6 flex justify-between items-center">
        <SortSelector 
          onSortChange={handleSortChange} 
          currentSort={state.sortOption}
          sortOptions={state.sortOptions}
        />
        
        <div className="text-sm text-gray-600">
          Mostrando {products.length} de {pagination.total || 'muchos'} productos
        </div>
      </div>
      
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

### 4. Updated Page Components with Sort

#### Individual Products Page with Sort

```tsx
// src/app/individuals/[category]/page.tsx (updated with sort)
'use client';

import { useEffect, useState } from 'react';
import ProductList from '@/components/products/ProductList';
import CategoryNav from '@/components/products/CategoryNav';
import ActiveFilters from '@/components/products/ActiveFilters';
import FilterPanel from '@/components/products/FilterPanel';
import ProductSearch from '@/components/products/ProductSearch';
import { productService } from '@/services/productService';
import { useFilters } from '@/contexts/FilterContext';
import ProductListSkeleton from '@/components/products/ProductListSkeleton';
import { MobileFilters } from '@/components/products/MobileFilters';

interface IndividualProductsPageProps {
  params: {
    category: string;
  };
  searchParams: {
    search?: string;
    sort?: string;
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

export default function IndividualProductsPage({ params, searchParams }: IndividualProductsPageProps) {
  const currentCategoryKey = params.category.toLowerCase();
  const currentCategoryName = getSpanishCategoryName(currentCategoryKey);
  
  const { state, setSearchTerm, clearSearchTerm, setSortOption } = useFilters();
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set initial search term and sort option from URL
  useEffect(() => {
    if (searchParams.search) {
      setSearchTerm(searchParams.search);
    }
    
    if (searchParams.sort) {
      setSortOption(searchParams.sort);
    }
  }, [searchParams.search, searchParams.sort, setSearchTerm, setSortOption]);

  // Fetch products when filters, search term, sort option, or pagination change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const filterParams: any = {
          category: currentCategoryKey !== 'all' ? currentCategoryKey : undefined,
          segment: 'individual',
          page: 1,
          limit: 20,
          search: state.searchTerm,
          sort: state.sortOption
        };

        // Add active filters to request
        state.activeFilters.forEach(filter => {
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
  }, [currentCategoryKey, state.activeFilters, state.searchTerm, state.sortOption]);

  const handleSearch = (term: string) => {
    if (term) {
      setSearchTerm(term);
    } else {
      clearSearchTerm();
    }
  };

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
          
          {/* Search bar */}
          <div className="mb-6">
            <ProductSearch 
              onSearch={handleSearch} 
              initialTerm={state.searchTerm}
              placeholder="Buscar tarjetas de crédito, préstamos, inversiones..." 
            />
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
              segment="individual"
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

## Sorting Analytics

### 1. Sort Tracking

```typescript
// src/services/analyticsService.ts (updated with sort tracking)
class AnalyticsService {
  trackSearch(term: string, resultCount: number, duration: number) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'product_search', {
        search_term: term,
        result_count: resultCount,
        search_duration: duration
      });
    }
  }

  trackSearchSuggestionClick(term: string, suggestion: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search_suggestion_click', {
        search_term: term,
        clicked_suggestion: suggestion
      });
    }
  }

  trackSearchResultClick(term: string, productId: string, position: number) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search_result_click', {
        search_term: term,
        product_id: productId,
        position: position
      });
    }
  }

  trackSortChange(sortOption: string, category?: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'product_sort_change', {
        sort_option: sortOption,
        category: category
      });
    }
  }

  trackSortUsage(sortOption: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'product_sort_usage', {
        sort_option: sortOption
      });
    }
  }
}

export const analyticsService = new AnalyticsService();
```

### 2. Popular Sorts Component

```tsx
// src/components/products/PopularSorts.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface PopularSortsProps {
  sorts: Array<{ value: string; label: string }>;
  onSortClick: (sort: string) => void;
  currentSort: string;
}

export default function PopularSorts({ sorts, onSortClick, currentSort }: PopularSortsProps) {
  if (sorts.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Ordenar por</h4>
      <div className="flex flex-wrap gap-2">
        {sorts.map((sort) => (
          <Button
            key={sort.value}
            variant={currentSort === sort.value ? "default" : "outline"}
            size="sm"
            onClick={() => onSortClick(sort.value)}
            className="text-xs"
          >
            {sort.label}
            {currentSort === sort.value && <ChevronDown className="ml-1 h-3 w-3" />}
          </Button>
        ))}
      </div>
    </div>
  );
}
```

## Performance Optimization

### 1. Sort Caching

```typescript
// src/services/sortCacheService.ts
class SortCacheService {
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

export const sortCacheService = new SortCacheService();
```

### 2. Sort Preference Persistence

```typescript
// src/hooks/useSortPreference.ts
import { useState, useEffect } from 'react';

export function useSortPreference(initialSort: string = 'featured') {
  const [sortOption, setSortOption] = useState(initialSort);

  useEffect(() => {
    // Load sort preference from localStorage
    const savedSort = localStorage.getItem('product_sort_preference');
    if (savedSort) {
      setSortOption(savedSort);
    }
  }, []);

  const updateSortOption = (newSort: string) => {
    setSortOption(newSort);
    // Save to localStorage
    localStorage.setItem('product_sort_preference', newSort);
  };

  return [sortOption, updateSortOption] as const;
}
```

## Testing Strategy

### 1. Unit Tests

```typescript
// tests/services/ProductService.sort.test.ts
import { ProductService } from '@/services/ProductService';

describe('ProductService - Sorting', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  describe('getProducts', () => {
    it('should sort products by rating descending', async () => {
      const result = await productService.getProducts({ sort: 'rating_desc' });
      
      // Verify products are sorted by rating
      const ratings = result.data.map(p => p.average_rating);
      const sortedRatings = [...ratings].sort((a, b) => b - a);
      expect(ratings).toEqual(sortedRatings);
    });

    it('should sort products by interest rate ascending', async () => {
      const result = await productService.getProducts({ sort: 'interest_rate_asc' });
      
      // Verify products are sorted by interest rate
      const rates = result.data.map(p => p.interest_rate_min);
      const sortedRates = [...rates].sort((a, b) => a - b);
      expect(rates).toEqual(sortedRates);
    });

    it('should sort products by newest first', async () => {
      const result = await productService.getProducts({ sort: 'newest' });
      
      // Verify products are sorted by creation date
      const dates = result.data.map(p => new Date(p.created_at).getTime());
      const sortedDates = [...dates].sort((a, b) => b - a);
      expect(dates).toEqual(sortedDates);
    });
  });

  describe('getSortOptions', () => {
    it('should return all available sort options', async () => {
      const options = await productService.getSortOptions();
      
      expect(options).toHaveLength(8);
      expect(options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ value: 'featured', label: 'Destacados' }),
          expect.objectContaining({ value: 'rating_desc', label: 'Mejor Calificados' }),
          expect.objectContaining({ value: 'newest', label: 'Más Recientes' })
        ])
      );
    });
  });
});
```

### 2. Integration Tests

```typescript
// tests/components/SortSelector.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SortSelector from '@/components/products/SortSelector';

describe('SortSelector', () => {
  const mockSortOptions = [
    { value: 'featured', label: 'Destacados', description: 'Productos destacados primero' },
    { value: 'rating_desc', label: 'Mejor Calificados', description: 'Productos con mejor calificación' },
    { value: 'newest', label: 'Más Recientes', description: 'Productos más recientes primero' }
  ];

  const mockOnSortChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sort options correctly', () => {
    render(
      <SortSelector 
        onSortChange={mockOnSortChange} 
        currentSort="featured"
        sortOptions={mockSortOptions}
      />
    );

    expect(screen.getByText('Ordenar por:')).toBeInTheDocument();
    expect(screen.getByText('Destacados')).toBeInTheDocument();
  });

  it('calls onSortChange when sort option is selected', async () => {
    render(
      <SortSelector 
        onSortChange={mockOnSortChange} 
        currentSort="featured"
        sortOptions={mockSortOptions}
      />
    );

    // Open the select dropdown
    fireEvent.click(screen.getByRole('combobox'));

    // Select a sort option
    fireEvent.click(screen.getByText('Más Recientes'));

    await waitFor(() => {
      expect(mockOnSortChange).toHaveBeenCalledWith('newest');
    });
  });

  it('displays the current sort option', () => {
    render(
      <SortSelector 
        onSortChange={mockOnSortChange} 
        currentSort="rating_desc"
        sortOptions={mockSortOptions}
      />
    );

    expect(screen.getByText('Mejor Calificados')).toBeInTheDocument();
  });
});
```

## Future Enhancements

### 1. AI-Powered Smart Sorting

```typescript
// src/services/aiSmartSorting.ts
class AISmartSorting {
  async getSmartSortOptions(userId?: string): Promise<Array<{ value: string; label: string; description: string }>> {
    // Implementation would use AI to determine the most relevant sort options
    // based on user behavior, preferences, and current context
    
    // Example implementation with a simple algorithm:
    if (userId) {
      // Return personalized sort options based on user history
      return [
        { value: 'personalized', label: 'Recomendados para ti', description: 'Productos recomendados basados en tu perfil' },
        { value: 'featured', label: 'Destacados', description: 'Productos destacados primero, luego por calificación' },
        { value: 'rating_desc', label: 'Mejor Calificados', description: 'Productos con la mejor calificación primero' }
      ];
    }
    
    // Return default smart sort options
    return [
      { value: 'featured', label: 'Destacados', description: 'Productos destacados primero, luego por calificación' },
      { value: 'rating_desc', label: 'Mejor Calificados', description: 'Productos con la mejor calificación primero' },
      { value: 'newest', label: 'Más Recientes', description: 'Productos añadidos más recientemente primero' }
    ];
  }
}
```

### 2. Sort Presets

```typescript
// src/services/sortPresetsService.ts
class SortPresetsService {
  private presets = [
    {
      id: 'low_interest',
      name: 'Menor Interés',
      description: 'Productos con menor tasa de interés',
      sort: 'interest_rate_asc',
      filters: {
        max_annual_fee: 0
      }
    },
    {
      id: 'high_rewards',
      name: 'Mayores Recompensas',
      description: 'Productos con mejores programas de recompensas',
      sort: 'rating_desc',
      filters: {
        institution: 'preferred'
      }
    },
    {
      id: 'no_annual_fee',
      name: 'Sin Cuota Anual',
      description: 'Productos sin cuota anual',
      sort: 'featured',
      filters: {
        max_annual_fee: 0
      }
    }
  ];

  getPreset(id: string) {
    return this.presets.find(preset => preset.id === id);
  }

  getAllPresets() {
    return this.presets;
  }
}

export const sortPresetsService = new SortPresetsService();
```

This sorting system provides a comprehensive solution for organizing financial products among 500+ options with multiple sort criteria, efficient database indexing, and analytics tracking.