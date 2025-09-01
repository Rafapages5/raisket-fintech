# Advanced Filtering System for Financial Products

## Overview

This document outlines the design of an advanced filtering system for financial products that can efficiently handle 500+ products with multiple filter criteria.

## System Architecture

### 1. Filter Types

#### 1.1 Range Filters
- **Interest Rate**: Filter by minimum and maximum interest rates
- **Annual Fee**: Filter by minimum and maximum annual fees
- **Credit Score**: Filter by minimum required credit score
- **Loan Amount**: Filter by minimum and maximum loan amounts
- **Investment Minimum**: Filter by minimum investment amount

#### 1.2 Boolean Filters
- **Accepts IMSS Income**: Filter for products that accept IMSS income
- **Accepts ISSSTE Income**: Filter for products that accept ISSSTE income
- **Requires Guarantor**: Filter for products that require a guarantor
- **Collateral Required**: Filter for products that require collateral

#### 1.3 Enum/Multi-select Filters
- **Institution**: Filter by financial institution
- **Product Features**: Filter by specific product features (multiple selection)
- **Benefits**: Filter by specific benefits (multiple selection)
- **Payment Frequency**: Filter by payment frequency options

#### 1.4 Text Search Filters
- **Product Name**: Search by product name
- **Institution Name**: Search by institution name
- **Features/Benefits**: Search within features and benefits

### 2. Filter Configuration

#### 2.1 Dynamic Filter Generation
Filters are dynamically generated based on:
- Product category
- Available data in the database
- Business rules

#### 2.2 Filter Metadata
Each filter contains metadata:
```json
{
  "id": "uuid",
  "name": "Tasa de Interés Anual",
  "slug": "interest_rate",
  "type": "range",
  "data_type": "decimal",
  "category_id": "uuid",
  "min_value": 15.0,
  "max_value": 45.0,
  "unit": "%",
  "display_order": 1,
  "is_active": true
}
```

### 3. Filter UI Components

#### 3.1 Range Slider
For range filters like interest rates and fees:
```
[15.0%] -------------------O============O------------------- [45.0%]
        Min: 20.0%                    Max: 35.0%
```

#### 3.2 Checkbox Groups
For boolean and multi-select filters:
```
□ Acepta IMSS
□ Acepta ISSSTE
□ Requiere Aval
```

#### 3.3 Dropdown Selectors
For enum filters:
```
Institución: [▼ BBVA México]
```

#### 3.4 Search Inputs
For text search:
```
Buscar: [_________]
```

### 4. Filter State Management

#### 4.1 URL Persistence
Filters are persisted in the URL for bookmarking and sharing:
```
/products/credit-cards?min_interest_rate=20&max_interest_rate=35&accepts_imss=true&institution=bbva
```

#### 4.2 Local Storage
Recently used filters are stored in local storage for quick access.

#### 4.3 Filter Presets
Predefined filter combinations for common use cases:
- "Best for Low Income"
- "No Annual Fee"
- "High Rewards"
- "Business Friendly"

## Implementation Details

### 1. Filter Service

```typescript
// src/services/FilterService.ts
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

class FilterService {
  /**
   * Get available filters for a product category
   */
  async getAvailableFilters(categorySlug?: string): Promise<FilterOption[]> {
    // Implementation would fetch from API
    return [];
  }

  /**
   * Apply filters to product query
   */
  applyFilters(query: any, filters: ActiveFilter[]): any {
    // Implementation would modify database query based on active filters
    return query;
  }

  /**
   * Generate filter presets for common use cases
   */
  generateFilterPresets(categorySlug: string): Array<{ name: string; filters: ActiveFilter[] }> {
    // Implementation would return predefined filter combinations
    return [];
  }

  /**
   * Validate filter values
   */
  validateFilters(filters: ActiveFilter[]): boolean {
    // Implementation would validate filter values
    return true;
  }

  /**
   * Serialize filters to URL query parameters
   */
  serializeToUrl(filters: ActiveFilter[]): string {
    // Implementation would convert filters to URL query string
    return '';
  }

  /**
   * Deserialize filters from URL query parameters
   */
  deserializeFromUrl(queryString: string): ActiveFilter[] {
    // Implementation would parse URL query string to filters
    return [];
  }
}
```

### 2. Filter Context (React)

```typescript
// src/contexts/FilterContext.tsx
import React, { createContext, useContext, useReducer } from 'react';

interface FilterState {
  activeFilters: ActiveFilter[];
  availableFilters: FilterOption[];
  isLoading: boolean;
  error: string | null;
}

interface FilterContextType extends FilterState {
  addFilter: (filter: ActiveFilter) => void;
  removeFilter: (filterSlug: string) => void;
  clearFilters: () => void;
  updateFilter: (filter: ActiveFilter) => void;
  loadFilters: (categorySlug?: string) => Promise<void>;
  applyPreset: (presetFilters: ActiveFilter[]) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const filterReducer = (state: FilterState, action: any): FilterState => {
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
        error: action.payload,
        isLoading: false
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
    error: null
  });

  const addFilter = (filter: ActiveFilter) => {
    dispatch({ type: 'ADD_FILTER', payload: filter });
  };

  const removeFilter = (filterSlug: string) => {
    dispatch({ type: 'REMOVE_FILTER', payload: filterSlug });
  };

  const updateFilter = (filter: ActiveFilter) => {
    dispatch({ type: 'UPDATE_FILTER', payload: filter });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const loadFilters = async (categorySlug?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const filters = await filterService.getAvailableFilters(categorySlug);
      dispatch({ type: 'SET_FILTERS', payload: filters });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load filters' });
    }
  };

  const applyPreset = (presetFilters: ActiveFilter[]) => {
    dispatch({ type: 'CLEAR_FILTERS' });
    presetFilters.forEach(filter => {
      dispatch({ type: 'ADD_FILTER', payload: filter });
    });
  };

  return (
    <FilterContext.Provider
      value={{
        ...state,
        addFilter,
        removeFilter,
        updateFilter,
        clearFilters,
        loadFilters,
        applyPreset
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

### 3. Filter Components

#### 3.1 Filter Panel Component

```tsx
// src/components/products/FilterPanel.tsx
import React, { useState } from 'react';
import { useFilters } from '@/contexts/FilterContext';
import RangeSlider from '@/components/ui/range-slider';
import CheckboxGroup from '@/components/ui/checkbox-group';
import Select from '@/components/ui/select';
import SearchInput from '@/components/ui/search-input';

interface FilterPanelProps {
  categorySlug?: string;
  onFiltersChange?: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ categorySlug, onFiltersChange }) => {
  const { availableFilters, activeFilters, addFilter, removeFilter, updateFilter } = useFilters();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter available filters by category
  const categoryFilters = availableFilters.filter(filter => {
    if (!categorySlug) return true;
    // Implementation would filter by category
    return true;
  });

  const handleRangeChange = (slug: string, min: number, max: number) => {
    updateFilter({ slug, value: { min, max } });
    onFiltersChange?.();
  };

  const handleBooleanChange = (slug: string, value: boolean) => {
    if (value) {
      addFilter({ slug, value });
    } else {
      removeFilter(slug);
    }
    onFiltersChange?.();
  };

  const handleMultiSelectChange = (slug: string, values: string[]) => {
    if (values.length > 0) {
      addFilter({ slug, value: values });
    } else {
      removeFilter(slug);
    }
    onFiltersChange?.();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value) {
      addFilter({ slug: 'search', value });
    } else {
      removeFilter('search');
    }
    onFiltersChange?.();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <SearchInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar productos..."
        />
      </div>

      {categoryFilters.map(filter => {
        switch (filter.type) {
          case 'range':
            const activeRangeFilter = activeFilters.find(f => f.slug === filter.slug);
            const rangeValue = activeRangeFilter?.value || { 
              min: filter.min_value, 
              max: filter.max_value 
            };
            
            return (
              <div key={filter.id} className="mb-6">
                <h4 className="font-medium mb-2">{filter.name}</h4>
                <RangeSlider
                  min={filter.min_value || 0}
                  max={filter.max_value || 100}
                  value={rangeValue}
                  onChange={(min, max) => handleRangeChange(filter.slug, min, max)}
                  unit={filter.unit}
                />
              </div>
            );

          case 'boolean':
            const activeBooleanFilter = activeFilters.find(f => f.slug === filter.slug);
            const booleanValue = activeBooleanFilter?.value || false;
            
            return (
              <div key={filter.id} className="mb-4">
                <CheckboxGroup
                  options={[{ value: 'true', label: filter.name }]}
                  selectedValues={booleanValue ? ['true'] : []}
                  onChange={(values) => handleBooleanChange(filter.slug, values.includes('true'))}
                />
              </div>
            );

          case 'multi_select':
            const activeMultiFilter = activeFilters.find(f => f.slug === filter.slug);
            const multiValues = activeMultiFilter?.value || [];
            
            return (
              <div key={filter.id} className="mb-6">
                <h4 className="font-medium mb-2">{filter.name}</h4>
                <CheckboxGroup
                  options={filter.options || []}
                  selectedValues={multiValues}
                  onChange={(values) => handleMultiSelectChange(filter.slug, values)}
                />
              </div>
            );

          case 'enum':
            const activeEnumFilter = activeFilters.find(f => f.slug === filter.slug);
            const enumValue = activeEnumFilter?.value || '';
            
            return (
              <div key={filter.id} className="mb-6">
                <h4 className="font-medium mb-2">{filter.name}</h4>
                <Select
                  options={filter.options || []}
                  value={enumValue}
                  onChange={(value) => {
                    if (value) {
                      addFilter({ slug: filter.slug, value });
                    } else {
                      removeFilter(filter.slug);
                    }
                    onFiltersChange?.();
                  }}
                />
              </div>
            );

          default:
            return null;
        }
      })}

      <button
        onClick={() => {
          // Clear all filters
        }}
        className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Limpiar Filtros
      </button>
    </div>
  );
};

export default FilterPanel;
```

#### 3.2 Active Filters Component

```tsx
// src/components/products/ActiveFilters.tsx
import React from 'react';
import { useFilters } from '@/contexts/FilterContext';
import { X } from 'lucide-react';

const ActiveFilters: React.FC = () => {
  const { activeFilters, removeFilter, availableFilters } = useFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  const getFilterLabel = (slug: string, value: any) => {
    const filter = availableFilters.find(f => f.slug === slug);
    if (!filter) return slug;

    switch (filter.type) {
      case 'range':
        return `${filter.name}: ${value.min}${filter.unit} - ${value.max}${filter.unit}`;
      case 'boolean':
        return value ? filter.name : `No ${filter.name}`;
      case 'multi_select':
        return `${filter.name}: ${value.join(', ')}`;
      case 'enum':
        const option = filter.options?.find(opt => opt.value === value);
        return `${filter.name}: ${option?.label || value}`;
      default:
        return `${filter.name}: ${value}`;
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            {getFilterLabel(filter.slug, filter.value)}
            <button
              onClick={() => removeFilter(filter.slug)}
              className="ml-2 inline-flex items-center rounded-full hover:bg-blue-200 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        ))}
        <button
          onClick={() => {
            // Clear all filters
          }}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Limpiar todo
        </button>
      </div>
    </div>
  );
};

export default ActiveFilters;
```

## Performance Optimization

### 1. Debouncing Filter Changes
To prevent excessive API calls when users adjust filters:

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

### 2. Caching Filter Options
Cache filter options to reduce API calls:

```typescript
// src/services/FilterCache.ts
class FilterCache {
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

export const filterCache = new FilterCache();
```

## User Experience Considerations

### 1. Progressive Disclosure
Show basic filters first, with advanced filters hidden behind an "Advanced" toggle:

```tsx
// src/components/products/AdvancedFiltersToggle.tsx
import React, { useState } from 'react';

interface AdvancedFiltersToggleProps {
  children: React.ReactNode;
}

const AdvancedFiltersToggle: React.FC<AdvancedFiltersToggleProps> = ({ children }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div>
      {!showAdvanced ? (
        <button
          onClick={() => setShowAdvanced(true)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Mostrar filtros avanzados
        </button>
      ) : (
        <div>
          {children}
          <button
            onClick={() => setShowAdvanced(false)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4"
          >
            - Ocultar filtros avanzados
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedFiltersToggle;
```

### 2. Filter Presets
Provide common filter combinations for quick access:

```tsx
// src/components/products/FilterPresets.tsx
import React from 'react';
import { useFilters } from '@/contexts/FilterContext';

interface FilterPreset {
  name: string;
  filters: Array<{ slug: string; value: any }>;
}

const FILTER_PRESETS: FilterPreset[] = [
  {
    name: "Sin Anualidad",
    filters: [
      { slug: "annual_fee", value: { min: 0, max: 0 } }
    ]
  },
  {
    name: "Para Negocios",
    filters: [
      { slug: "segment", value: "business" }
    ]
  },
  {
    name: "Altas Recompensas",
    filters: [
      { slug: "features", value: ["rewards"] }
    ]
  }
];

const FilterPresets: React.FC = () => {
  const { applyPreset } = useFilters();

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Filtros Rápidos</h4>
      <div className="flex flex-wrap gap-2">
        {FILTER_PRESETS.map((preset, index) => (
          <button
            key={index}
            onClick={() => applyPreset(preset.filters)}
            className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPresets;
```

### 3. Responsive Design
Ensure filters work well on mobile devices:

```tsx
// src/components/products/MobileFilters.tsx
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import FilterPanel from './FilterPanel';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MobileFilters: React.FC<{ categorySlug?: string }> = ({ categorySlug }) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="lg:hidden inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="h-5 w-5 mr-2" />
          Filtros
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-96">
        <FilterPanel categorySlug={categorySlug} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilters;
```

## Analytics and Insights

### 1. Filter Usage Tracking
Track which filters are used most frequently:

```typescript
// src/services/AnalyticsService.ts
class AnalyticsService {
  trackFilterApplied(filterSlug: string, value: any) {
    // Send event to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'filter_applied', {
        filter_slug: filterSlug,
        filter_value: JSON.stringify(value)
      });
    }
  }

  trackFilterRemoved(filterSlug: string) {
    // Send event to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'filter_removed', {
        filter_slug: filterSlug
      });
    }
  }

  trackFilterCleared() {
    // Send event to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'filters_cleared');
    }
  }
}

export const analyticsService = new AnalyticsService();
```

### 2. Filter Effectiveness
Measure how filters impact user engagement:

```typescript
// Track when users apply filters and then interact with results
// Track conversion rates with and without specific filters
// Identify which filter combinations lead to the best user outcomes
```

## Testing Strategy

### 1. Unit Tests
```typescript
// tests/services/FilterService.test.ts
import { FilterService } from '@/services/FilterService';

describe('FilterService', () => {
  let filterService: FilterService;

  beforeEach(() => {
    filterService = new FilterService();
  });

  describe('applyFilters', () => {
    it('should apply range filters correctly', () => {
      const query = {};
      const filters = [
        { slug: 'interest_rate', value: { min: 20, max: 30 } }
      ];
      
      const result = filterService.applyFilters(query, filters);
      // Assert query was modified correctly
    });

    it('should apply boolean filters correctly', () => {
      const query = {};
      const filters = [
        { slug: 'accepts_imss', value: true }
      ];
      
      const result = filterService.applyFilters(query, filters);
      // Assert query was modified correctly
    });
  });

  describe('validateFilters', () => {
    it('should validate correct filter values', () => {
      const filters = [
        { slug: 'interest_rate', value: { min: 20, max: 30 } }
      ];
      
      const result = filterService.validateFilters(filters);
      expect(result).toBe(true);
    });

    it('should invalidate incorrect filter values', () => {
      const filters = [
        { slug: 'interest_rate', value: { min: 30, max: 20 } } // Invalid range
      ];
      
      const result = filterService.validateFilters(filters);
      expect(result).toBe(false);
    });
  });
});
```

### 2. Integration Tests
```typescript
// tests/components/FilterPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from '@/components/products/FilterPanel';
import { FilterProvider } from '@/contexts/FilterContext';

describe('FilterPanel', () => {
  it('renders filter options correctly', async () => {
    render(
      <FilterProvider>
        <FilterPanel />
      </FilterProvider>
    );

    // Assert filter options are displayed
    expect(screen.getByText('Filtros')).toBeInTheDocument();
  });

  it('applies filters when user interacts with controls', async () => {
    render(
      <FilterProvider>
        <FilterPanel />
      </FilterProvider>
    );

    // Simulate user interaction with filter controls
    // Assert that filters are applied correctly
  });
});
```

## Future Enhancements

### 1. AI-Powered Filter Suggestions
Use machine learning to suggest relevant filters based on user behavior:

```typescript
// src/services/AIFilterSuggestions.ts
class AIFilterSuggestions {
  async getSuggestions(userProfile: any, currentFilters: ActiveFilter[]): Promise<ActiveFilter[]> {
    // Implementation would use ML model to suggest filters
    return [];
  }
}
```

### 2. Filter History and Favorites
Allow users to save their favorite filter combinations:

```typescript
// src/services/FilterHistoryService.ts
class FilterHistoryService {
  saveFavorite(name: string, filters: ActiveFilter[]) {
    // Save to localStorage or database
  }

  getFavorites(): Array<{ name: string; filters: ActiveFilter[] }> {
    // Retrieve from localStorage or database
    return [];
  }

  addToHistory(filters: ActiveFilter[]) {
    // Add to filter history
  }

  getHistory(): ActiveFilter[][] {
    // Retrieve filter history
    return [];
  }
}
```

This advanced filtering system provides a comprehensive solution for handling 500+ financial products with multiple filter criteria while maintaining good performance and user experience.