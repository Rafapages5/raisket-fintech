# Product Search System for Financial Products

## Overview

This document outlines the implementation of a comprehensive search system for financial products that enables users to efficiently find products among 500+ options using various search criteria.

## Search Requirements

### 1. Search Fields
- Product name
- Product description
- Institution name
- Product features
- Product benefits
- Category name

### 2. Search Types
- **Full-text search**: Search across all relevant fields
- **Field-specific search**: Search within specific fields
- **Fuzzy search**: Handle typos and partial matches
- **Autocomplete**: Provide suggestions as users type

## Backend Implementation

### 1. Database Search Strategy

#### PostgreSQL Full-Text Search
```sql
-- Add full-text search columns to products table
ALTER TABLE financial.products 
ADD COLUMN search_vector tsvector;

-- Create search vector generation function
CREATE OR REPLACE FUNCTION update_product_search_vector() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('spanish', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(NEW.long_description, '')), 'C') ||
    setweight(to_tsvector('spanish', coalesce(NEW.tagline, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update search vector on insert/update
CREATE TRIGGER update_product_search_vector_trigger
BEFORE INSERT OR UPDATE ON financial.products
FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- Create index for fast searching
CREATE INDEX idx_products_search_vector ON financial.products USING GIN(search_vector);

-- Create search function
CREATE OR REPLACE FUNCTION search_products(
  search_term TEXT,
  category_slug TEXT DEFAULT NULL,
  segment TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
) RETURNS TABLE(
  id UUID,
  name VARCHAR(200),
  tagline TEXT,
  description TEXT,
  category_name VARCHAR(50),
  institution_name VARCHAR(200),
  average_rating DECIMAL(3,2),
  review_count INTEGER,
  image_url TEXT,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.tagline,
    p.description,
    c.name as category_name,
    i.name as institution_name,
    COALESCE(r.average_rating, 0) as average_rating,
    COALESCE(r.review_count, 0) as review_count,
    p.image_url,
    ts_rank(p.search_vector, to_tsquery('spanish', search_term)) as relevance
  FROM financial.products p
  JOIN financial.institutions i ON p.institution_id = i.id
  JOIN financial.product_categories c ON p.category_id = c.id
  LEFT JOIN financial.product_ratings r ON p.id = r.product_id
  WHERE p.is_active = true
    AND i.is_active = true
    AND p.search_vector @@ to_tsquery('spanish', search_term)
    AND (category_slug IS NULL OR c.slug = category_slug)
    AND (segment IS NULL OR p.target_segment = segment OR p.target_segment = 'both')
  ORDER BY relevance DESC, r.average_rating DESC NULLS LAST
  LIMIT limit_count OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
```

#### Alternative Search Strategy with Elasticsearch
```sql
-- For more advanced search capabilities, consider integrating Elasticsearch
-- This would require additional infrastructure but provide better search features

-- Elasticsearch index mapping
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "name": { 
        "type": "text",
        "analyzer": "spanish"
      },
      "tagline": { 
        "type": "text",
        "analyzer": "spanish"
      },
      "description": { 
        "type": "text",
        "analyzer": "spanish"
      },
      "long_description": { 
        "type": "text",
        "analyzer": "spanish"
      },
      "category": { 
        "type": "text",
        "analyzer": "spanish"
      },
      "institution": { 
        "type": "text",
        "analyzer": "spanish"
      },
      "features": { 
        "type": "text",
        "analyzer": "spanish"
      },
      "benefits": { 
        "type": "text",
        "analyzer": "spanish"
      },
      "average_rating": { "type": "float" },
      "review_count": { "type": "integer" },
      "target_segment": { "type": "keyword" },
      "created_at": { "type": "date" }
    }
  }
}
```

### 2. Updated Product Service

```typescript
// backend/src/services/ProductService.ts (updated with search)
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
   * Get products with filtering, pagination, and search
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
   * Search products with full-text search
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
        institution_name, category_name,
        ts_rank(search_vector, to_tsquery('spanish', $1)) as relevance
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
        query += ' ORDER BY relevance DESC, average_rating DESC';
        break;
      case 'interest_rate_asc':
        query += ' ORDER BY interest_rate_min ASC, relevance DESC';
        break;
      case 'interest_rate_desc':
        query += ' ORDER BY interest_rate_max DESC, relevance DESC';
        break;
      case 'annual_fee_asc':
        query += ' ORDER BY annual_fee ASC, relevance DESC';
        break;
      case 'annual_fee_desc':
        query += ' ORDER BY annual_fee DESC, relevance DESC';
        break;
      case 'rating_desc':
        query += ' ORDER BY average_rating DESC, relevance DESC';
        break;
      case 'newest':
        query += ' ORDER BY created_at DESC, relevance DESC';
        break;
      default:
        query += ' ORDER BY is_featured DESC, average_rating DESC, relevance DESC';
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
}
```

## Frontend Implementation

### 1. Search Component

```tsx
// src/components/products/ProductSearch.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { productService } from '@/services/productService';
import { useDebounce } from '@/hooks/useDebounce';

interface ProductSearchProps {
  onSearch: (term: string) => void;
  initialTerm?: string;
  placeholder?: string;
}

export default function ProductSearch({
  onSearch,
  initialTerm = '',
  placeholder = 'Buscar productos...'
}: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch search suggestions
  useEffect(() => {
    if (debouncedSearchTerm.length > 2) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        try {
          const response = await productService.searchProducts(debouncedSearchTerm, { limit: 5 });
          setSuggestions(response.data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    onSearch(term);
    setShowSuggestions(false);
  }, [onSearch]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    onSearch('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, [onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  }, [searchTerm, handleSearch]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </Button>
        )}
      </div>

      {/* Search suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md overflow-hidden">
          <ul className="py-1">
            {suggestions.map((product) => (
              <li
                key={product.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleSearch(product.name)}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded mr-3"></div>
                <div>
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs text-gray-500">{product.institution.name} • {product.category.name}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}
```

### 2. Debounce Hook

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### 3. Updated Filter Context

```typescript
// src/contexts/FilterContext.tsx (updated with search)
'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
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
  | { type: 'CLEAR_SEARCH_TERM' };

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
    searchTerm: ''
  });

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
        clearSearchTerm
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

### 4. Updated Page Components

#### Individual Products Page with Search

```tsx
// src/app/individuals/[category]/page.tsx (updated with search)
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
  
  const { state, setSearchTerm, clearSearchTerm } = useFilters();
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set initial search term from URL
  useEffect(() => {
    if (searchParams.search) {
      setSearchTerm(searchParams.search);
    }
  }, [searchParams.search, setSearchTerm]);

  // Fetch products when filters, search term, or pagination change
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
          search: state.searchTerm
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
  }, [currentCategoryKey, state.activeFilters, state.searchTerm]);

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

## Search Analytics

### 1. Search Tracking

```typescript
// src/services/analyticsService.ts (updated with search tracking)
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
}

export const analyticsService = new AnalyticsService();
```

### 2. Popular Searches Component

```tsx
// src/components/products/PopularSearches.tsx
'use client';

import React from 'react';

interface PopularSearchesProps {
  searches: string[];
  onSearchClick: (term: string) => void;
}

export default function PopularSearches({ searches, onSearchClick }: PopularSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Búsquedas populares</h4>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSearchClick(search)}
            className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
}
```

## Performance Optimization

### 1. Search Caching

```typescript
// src/services/searchCacheService.ts
class SearchCacheService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private ttl: number = 2 * 60 * 1000; // 2 minutes

  get(term: string): any | null {
    const key = this.generateKey(term);
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(term: string, data: any): void {
    const key = this.generateKey(term);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private generateKey(term: string): string {
    return `search:${term.toLowerCase().trim()}`;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const searchCacheService = new SearchCacheService();
```

### 2. Search Debouncing

```typescript
// src/hooks/useSearchDebounce.ts
import { useState, useEffect } from 'react';

export function useSearchDebounce(searchTerm: string, delay: number = 300) {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  return debouncedTerm;
}
```

## Testing Strategy

### 1. Unit Tests

```typescript
// tests/services/ProductService.search.test.ts
import { ProductService } from '@/services/ProductService';

describe('ProductService - Search', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  describe('searchProducts', () => {
    it('should search products by name', async () => {
      const result = await productService.searchProducts('tarjeta oro');
      
      expect(result.data).toBeDefined();
      expect(result.pagination).toBeDefined();
      // Assert that products matching the search term are returned
    });

    it('should search products with category filter', async () => {
      const result = await productService.searchProducts('tarjeta', { category: 'credit' });
      
      expect(result.data.every(product => product.category.slug === 'credit')).toBe(true);
    });

    it('should search products with segment filter', async () => {
      const result = await productService.searchProducts('inversión', { segment: 'individual' });
      
      expect(result.data.every(product => product.target_segment === 'individual')).toBe(true);
    });

    it('should handle empty search terms', async () => {
      const result = await productService.searchProducts('');
      
      // Should return all products or empty result depending on implementation
      expect(result).toBeDefined();
    });
  });
});
```

### 2. Integration Tests

```typescript
// tests/components/ProductSearch.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductSearch from '@/components/products/ProductSearch';
import { FilterProvider } from '@/contexts/FilterContext';

// Mock the productService
jest.mock('@/services/productService', () => ({
  productService: {
    searchProducts: jest.fn()
  }
}));

describe('ProductSearch', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input with placeholder', () => {
    render(
      <FilterProvider>
        <ProductSearch onSearch={mockOnSearch} placeholder="Buscar productos" />
      </FilterProvider>
    );

    expect(screen.getByPlaceholderText('Buscar productos')).toBeInTheDocument();
  });

  it('calls onSearch when user types and presses Enter', async () => {
    render(
      <FilterProvider>
        <ProductSearch onSearch={mockOnSearch} />
      </FilterProvider>
    );

    const input = screen.getByPlaceholderText('Buscar productos...');
    fireEvent.change(input, { target: { value: 'tarjeta de crédito' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('tarjeta de crédito');
    });
  });

  it('shows search suggestions when typing', async () => {
    const mockSuggestions = [
      { id: '1', name: 'Tarjeta Oro', institution: { name: 'BBVA' }, category: { name: 'Credit' } },
      { id: '2', name: 'Tarjeta Platinum', institution: { name: 'BBVA' }, category: { name: 'Credit' } }
    ];

    (require('@/services/productService').productService.searchProducts as jest.Mock)
      .mockResolvedValueOnce({
        data: mockSuggestions,
        pagination: { total: 2 }
      });

    render(
      <FilterProvider>
        <ProductSearch onSearch={mockOnSearch} />
      </FilterProvider>
    );

    const input = screen.getByPlaceholderText('Buscar productos...');
    fireEvent.change(input, { target: { value: 'tarjeta' } });

    await waitFor(() => {
      expect(screen.getByText('Tarjeta Oro')).toBeInTheDocument();
      expect(screen.getByText('Tarjeta Platinum')).toBeInTheDocument();
    });
  });

  it('clears search when X button is clicked', () => {
    render(
      <FilterProvider>
        <ProductSearch onSearch={mockOnSearch} initialTerm="tarjeta" />
      </FilterProvider>
    );

    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);

    expect(mockOnSearch).toHaveBeenCalledWith('');
    expect(screen.getByPlaceholderText('Buscar productos...')).toHaveValue('');
  });
});
```

## Future Enhancements

### 1. AI-Powered Search Suggestions

```typescript
// src/services/aiSearchSuggestions.ts
class AISearchSuggestions {
  async getSuggestions(searchTerm: string): Promise<string[]> {
    // Implementation would use AI model to generate relevant search suggestions
    // based on user behavior, popular searches, and product data
    
    // Example implementation with a simple algorithm:
    const commonTerms = [
      'tarjeta de crédito',
      'préstamo personal',
      'inversión',
      'seguro de vida',
      'cuenta de ahorro'
    ];
    
    // Filter terms that match the search term
    return commonTerms.filter(term => 
      term.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
```

### 2. Search History

```typescript
// src/services/searchHistoryService.ts
class SearchHistoryService {
  private storageKey = 'product_search_history';
  private maxHistoryItems = 10;

  addSearchTerm(term: string): void {
    if (!term.trim()) return;

    const history = this.getHistory();
    // Remove if already exists
    const filteredHistory = history.filter(item => item !== term);
    // Add to beginning
    filteredHistory.unshift(term);
    // Limit to max items
    const limitedHistory = filteredHistory.slice(0, this.maxHistoryItems);
    
    localStorage.setItem(this.storageKey, JSON.stringify(limitedHistory));
  }

  getHistory(): string[] {
    try {
      const history = localStorage.getItem(this.storageKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      return [];
    }
  }

  clearHistory(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const searchHistoryService = new SearchHistoryService();
```

This search system provides a comprehensive solution for finding financial products among 500+ options with efficient full-text search, autocomplete suggestions, and analytics tracking.