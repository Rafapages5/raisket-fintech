# Backend API Endpoints for Product Retrieval with Filtering

## Overview

This document outlines the backend API endpoints for retrieving financial products with advanced filtering capabilities, designed to handle 500+ products efficiently.

## API Endpoints

### 1. Get Products with Filtering

#### Endpoint
```
GET /api/products
```

#### Query Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| category | string | Product category slug | `credit-cards` |
| segment | string | Target segment | `individual`, `business` |
| page | integer | Page number for pagination | `1` |
| limit | integer | Number of products per page | `20` |
| sort | string | Sorting criteria | `interest_rate_asc` |
| search | string | Search term for full-text search | `tarjeta oro` |
| min_interest_rate | number | Minimum interest rate | `15.5` |
| max_interest_rate | number | Maximum interest rate | `30.0` |
| min_annual_fee | number | Minimum annual fee | `0` |
| max_annual_fee | number | Maximum annual fee | `1000` |
| min_credit_score | integer | Minimum credit score required | `650` |
| accepts_imss | boolean | Accepts IMSS income | `true` |
| accepts_issste | boolean | Accepts ISSSTE income | `true` |
| institution | string | Institution name or ID | `bbva` |
| featured | boolean | Only featured products | `true` |

#### Response Format
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Tarjeta de Crédito Oro BBVA",
      "tagline": "Más beneficios para tu estilo de vida",
      "description": "Tarjeta clásica con beneficios premium...",
      "category": {
        "id": "uuid",
        "name": "Credit",
        "slug": "credit"
      },
      "institution": {
        "id": "uuid",
        "name": "BBVA México",
        "brand_name": "BBVA"
      },
      "target_segment": "individual",
      "image_url": "https://example.com/image.jpg",
      "average_rating": 4.5,
      "review_count": 1920,
      "interest_rate_min": 39.9,
      "interest_rate_max": 39.9,
      "annual_fee": 900,
      "is_featured": true,
      "created_at": "2023-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  },
  "filters": {
    "available": [
      {
        "id": "uuid",
        "name": "Tasa de Interés",
        "slug": "interest_rate",
        "type": "range",
        "min": 15.0,
        "max": 45.0
      }
    ]
  }
}
```

### 2. Get Product Categories

#### Endpoint
```
GET /api/categories
```

#### Response Format
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Credit",
      "slug": "credit",
      "description": "Tarjetas de crédito y productos de crédito",
      "segment": "both",
      "icon_name": "credit-card",
      "product_count": 75
    }
  ]
}
```

### 3. Get Product Details

#### Endpoint
```
GET /api/products/{id}
```

#### Response Format
```json
{
  "data": {
    "id": "uuid",
    "name": "Tarjeta de Crédito Oro BBVA",
    "tagline": "Más beneficios para tu estilo de vida",
    "description": "Tarjeta clásica con beneficios premium...",
    "long_description": "Descripción detallada del producto...",
    "category": {
      "id": "uuid",
      "name": "Credit",
      "slug": "credit"
    },
    "institution": {
      "id": "uuid",
      "name": "BBVA México",
      "brand_name": "BBVA",
      "website": "https://www.bbva.mx",
      "phone": "+52 55 1234 5678"
    },
    "target_segment": "individual",
    "image_url": "https://example.com/image.jpg",
    "ai_hint": "tarjeta de crédito oro dorada BBVA",
    "features": [
      "Límite de crédito más alto",
      "Seguro de vida por $200,000 MXN"
    ],
    "benefits": [
      "Mayor poder de compra",
      "Protección integral"
    ],
    "average_rating": 4.5,
    "review_count": 1920,
    "interest_rate_min": 39.9,
    "interest_rate_max": 39.9,
    "annual_fee": 900,
    "min_income": 15000,
    "min_credit_score": 650,
    "accepts_imss": true,
    "accepts_issste": true,
    "is_active": true,
    "is_featured": true,
    "created_at": "2023-01-15T10:30:00Z"
  }
}
```

### 4. Get Available Filters for Category

#### Endpoint
```
GET /api/filters?category={category_slug}
```

#### Response Format
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Tasa de Interés Anual",
      "slug": "interest_rate",
      "type": "range",
      "data_type": "decimal",
      "min_value": 15.0,
      "max_value": 45.0,
      "unit": "%"
    },
    {
      "id": "uuid",
      "name": "Cuota Anual",
      "slug": "annual_fee",
      "type": "range",
      "data_type": "decimal",
      "min_value": 0,
      "max_value": 5000,
      "unit": "MXN"
    },
    {
      "id": "uuid",
      "name": "Puntaje de Crédito Mínimo",
      "slug": "min_credit_score",
      "type": "range",
      "data_type": "integer",
      "min_value": 300,
      "max_value": 850
    },
    {
      "id": "uuid",
      "name": "Acepta IMSS",
      "slug": "accepts_imss",
      "type": "boolean",
      "data_type": "boolean"
    }
  ]
}
```

## Implementation Plan

### 1. API Route Structure
```
backend/src/
├── routes/
│   ├── products.ts
│   ├── categories.ts
│   └── filters.ts
├── controllers/
│   ├── ProductController.ts
│   ├── CategoryController.ts
│   └── FilterController.ts
├── services/
│   ├── ProductService.ts
│   ├── CategoryService.ts
│   └── FilterService.ts
└── middleware/
    └── validation.ts
```

### 2. Product Controller Implementation
```typescript
// backend/src/controllers/ProductController.ts
import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * Get products with filtering and pagination
   */
  async getProducts(req: Request, res: Response) {
    try {
      const {
        category,
        segment,
        page = 1,
        limit = 20,
        sort,
        search,
        ...filters
      } = req.query;

      const result = await this.productService.getProducts({
        category: category as string,
        segment: segment as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sort: sort as string,
        search: search as string,
        filters: filters as Record<string, any>
      });

      res.json({
        data: result.products,
        pagination: result.pagination,
        filters: result.availableFilters
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve products',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      res.json({
        data: product
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve product',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get product categories
   */
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await this.productService.getCategories();
      res.json({
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get available filters for a category
   */
  async getFilters(req: Request, res: Response) {
    try {
      const { category } = req.query;
      const filters = await this.productService.getAvailableFilters(
        category as string
      );
      res.json({
        data: filters
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve filters',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
```

### 3. Product Service Implementation
```typescript
// backend/src/services/ProductService.ts
import { Pool } from 'pg';
import { FinancialProductModel } from '../models/FinancialProduct';

interface ProductFilters {
  category?: string;
  segment?: string;
  search?: string;
  min_interest_rate?: number;
  max_interest_rate?: number;
  min_annual_fee?: number;
  max_annual_fee?: number;
  min_credit_score?: number;
  accepts_imss?: boolean;
  accepts_issste?: boolean;
  institution?: string;
  featured?: boolean;
}

interface ProductQueryOptions {
  category?: string;
  segment?: string;
  page: number;
  limit: number;
  sort?: string;
  search?: string;
  filters: ProductFilters;
}

interface ProductQueryResult {
  products: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  availableFilters: any[];
}

export class ProductService {
  private db: Pool;
  private productModel: FinancialProductModel;

  constructor() {
    // Initialize database connection
    this.db = new Pool({
      // Database configuration
    });
    this.productModel = new FinancialProductModel(this.db);
  }

  /**
   * Get products with filtering and pagination
   */
  async getProducts(options: ProductQueryOptions): Promise<ProductQueryResult> {
    const {
      category,
      segment,
      page,
      limit,
      sort,
      search,
      filters
    } = options;

    // Build the query
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

    // Add category filter
    if (category) {
      query += ` AND c.slug = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Add segment filter
    if (segment) {
      query += ` AND p.target_segment IN ($${paramIndex}, 'both')`;
      params.push(segment);
      paramIndex++;
    }

    // Add search filter
    if (search) {
      query += ` AND p.search_vector @@ plainto_tsquery('spanish', $${paramIndex})`;
      params.push(search);
      paramIndex++;
    }

    // Add dynamic filters
    if (filters.min_interest_rate !== undefined) {
      query += ` AND p.interest_rate_min >= $${paramIndex}`;
      params.push(filters.min_interest_rate);
      paramIndex++;
    }

    if (filters.max_interest_rate !== undefined) {
      query += ` AND p.interest_rate_max <= $${paramIndex}`;
      params.push(filters.max_interest_rate);
      paramIndex++;
    }

    if (filters.min_annual_fee !== undefined) {
      query += ` AND p.annual_fee >= $${paramIndex}`;
      params.push(filters.min_annual_fee);
      paramIndex++;
    }

    if (filters.max_annual_fee !== undefined) {
      query += ` AND p.annual_fee <= $${paramIndex}`;
      params.push(filters.max_annual_fee);
      paramIndex++;
    }

    if (filters.min_credit_score !== undefined) {
      query += ` AND p.min_credit_score >= $${paramIndex}`;
      params.push(filters.min_credit_score);
      paramIndex++;
    }

    if (filters.accepts_imss !== undefined) {
      query += ` AND p.accepts_imss = $${paramIndex}`;
      params.push(filters.accepts_imss);
      paramIndex++;
    }

    if (filters.accepts_issste !== undefined) {
      query += ` AND p.accepts_issste = $${paramIndex}`;
      params.push(filters.accepts_issste);
      paramIndex++;
    }

    if (filters.institution) {
      query += ` AND i.name ILIKE $${paramIndex}`;
      params.push(`%${filters.institution}%`);
      paramIndex++;
    }

    if (filters.featured !== undefined) {
      query += ` AND p.is_featured = $${paramIndex}`;
      params.push(filters.featured);
      paramIndex++;
    }

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

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    // Execute query
    const result = await this.db.query(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM financial.products p
      JOIN financial.institutions i ON p.institution_id = i.id
      JOIN financial.product_categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;

    // Reuse the same filters for count query
    const countParams: any[] = [];
    let countParamIndex = 1;

    if (category) {
      countQuery += ` AND c.slug = $${countParamIndex}`;
      countParams.push(category);
      countParamIndex++;
    }

    if (segment) {
      countQuery += ` AND p.target_segment IN ($${countParamIndex}, 'both')`;
      countParams.push(segment);
      countParamIndex++;
    }

    if (search) {
      countQuery += ` AND p.search_vector @@ plainto_tsquery('spanish', $${countParamIndex})`;
      countParams.push(search);
      countParamIndex++;
    }

    // Add dynamic filters to count query
    if (filters.min_interest_rate !== undefined) {
      countQuery += ` AND p.interest_rate_min >= $${countParamIndex}`;
      countParams.push(filters.min_interest_rate);
      countParamIndex++;
    }

    if (filters.max_interest_rate !== undefined) {
      countQuery += ` AND p.interest_rate_max <= $${countParamIndex}`;
      countParams.push(filters.max_interest_rate);
      countParamIndex++;
    }

    if (filters.min_annual_fee !== undefined) {
      countQuery += ` AND p.annual_fee >= $${countParamIndex}`;
      countParams.push(filters.min_annual_fee);
      countParamIndex++;
    }

    if (filters.max_annual_fee !== undefined) {
      countQuery += ` AND p.annual_fee <= $${countParamIndex}`;
      countParams.push(filters.max_annual_fee);
      countParamIndex++;
    }

    if (filters.min_credit_score !== undefined) {
      countQuery += ` AND p.min_credit_score >= $${countParamIndex}`;
      countParams.push(filters.min_credit_score);
      countParamIndex++;
    }

    if (filters.accepts_imss !== undefined) {
      countQuery += ` AND p.accepts_imss = $${countParamIndex}`;
      countParams.push(filters.accepts_imss);
      countParamIndex++;
    }

    if (filters.accepts_issste !== undefined) {
      countQuery += ` AND p.accepts_issste = $${countParamIndex}`;
      countParams.push(filters.accepts_issste);
      countParamIndex++;
    }

    if (filters.institution) {
      countQuery += ` AND i.name ILIKE $${countParamIndex}`;
      countParams.push(`%${filters.institution}%`);
      countParamIndex++;
    }

    if (filters.featured !== undefined) {
      countQuery += ` AND p.is_featured = $${countParamIndex}`;
      countParams.push(filters.featured);
      countParamIndex++;
    }

    const countResult = await this.db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    // Get available filters for this category
    const availableFilters = await this.getAvailableFilters(category);

    // Transform results
    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      tagline: row.tagline,
      description: row.description,
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug
      },
      institution: {
        id: row.institution_id,
        name: row.institution_name,
        brand_name: row.institution_brand
      },
      target_segment: segment,
      image_url: row.image_url,
      average_rating: parseFloat(row.average_rating),
      review_count: parseInt(row.review_count),
      interest_rate_min: parseFloat(row.interest_rate_min),
      interest_rate_max: parseFloat(row.interest_rate_max),
      annual_fee: parseFloat(row.annual_fee),
      is_featured: row.is_featured,
      created_at: row.created_at
    }));

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        total_pages
      },
      availableFilters
    };
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string) {
    const query = `
      SELECT 
        p.*, 
        r.average_rating, r.review_count,
        i.id as institution_id, i.name as institution_name, i.brand_name as institution_brand,
        i.website as institution_website, i.phone as institution_phone,
        c.id as category_id, c.name as category_name, c.slug as category_slug
      FROM financial.products p
      JOIN financial.product_ratings r ON p.id = r.product_id
      JOIN financial.institutions i ON p.institution_id = i.id
      JOIN financial.product_categories c ON p.category_id = c.id
      WHERE p.id = $1 AND p.is_active = true
    `;

    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    // Get features and benefits
    const featuresQuery = `
      SELECT feature_text, is_benefit
      FROM financial.product_features
      WHERE product_id = $1
      ORDER BY is_benefit DESC, display_order ASC
    `;

    const featuresResult = await this.db.query(featuresQuery, [id]);
    const features = featuresResult.rows
      .filter(row => !row.is_benefit)
      .map(row => row.feature_text);
    const benefits = featuresResult.rows
      .filter(row => row.is_benefit)
      .map(row => row.feature_text);

    return {
      id: row.id,
      name: row.name,
      tagline: row.tagline,
      description: row.description,
      long_description: row.long_description,
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug
      },
      institution: {
        id: row.institution_id,
        name: row.institution_name,
        brand_name: row.institution_brand,
        website: row.institution_website,
        phone: row.institution_phone
      },
      target_segment: row.target_segment,
      image_url: row.image_url,
      ai_hint: row.ai_hint,
      features,
      benefits,
      average_rating: parseFloat(row.average_rating),
      review_count: parseInt(row.review_count),
      interest_rate_min: parseFloat(row.interest_rate_min),
      interest_rate_max: parseFloat(row.interest_rate_max),
      annual_fee: parseFloat(row.annual_fee),
      min_income: parseFloat(row.min_income),
      min_credit_score: parseInt(row.min_credit_score),
      accepts_imss: row.accepts_imss,
      accepts_issste: row.accepts_issste,
      is_active: row.is_active,
      is_featured: row.is_featured,
      created_at: row.created_at
    };
  }

  /**
   * Get product categories
   */
  async getCategories() {
    const query = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM financial.product_categories c
      LEFT JOIN financial.products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.display_order ASC
    `;

    const result = await this.db.query(query);

    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      segment: row.segment,
      icon_name: row.icon_name,
      product_count: parseInt(row.product_count)
    }));
  }

  /**
   * Get available filters for a category
   */
  async getAvailableFilters(categorySlug?: string) {
    let query = `
      SELECT DISTINCT
        f.id, f.name, f.slug, f.filter_type, f.data_type
      FROM financial.product_filters f
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (categorySlug) {
      query += ` JOIN financial.product_categories c ON f.category_id = c.id WHERE c.slug = $${paramIndex}`;
      params.push(categorySlug);
    }

    query += ` ORDER BY f.display_order ASC`;

    const result = await this.db.query(query, params);

    // For range filters, get min/max values from products
    const filters = [];
    for (const filter of result.rows) {
      if (filter.filter_type === 'range') {
        let valueQuery = `
          SELECT 
            MIN(pfv.value_${filter.data_type}) as min_value,
            MAX(pfv.value_${filter.data_type}) as max_value
          FROM financial.product_filter_values pfv
          JOIN financial.product_filters f ON pfv.filter_id = f.id
          JOIN financial.products p ON pfv.product_id = p.id
          WHERE f.id = $1 AND p.is_active = true
        `;

        if (categorySlug) {
          valueQuery += ` AND p.category_id = (
            SELECT id FROM financial.product_categories WHERE slug = $2
          )`;
        }

        const valueParams = categorySlug ? 
          [filter.id, categorySlug] : 
          [filter.id];

        const valueResult = await this.db.query(valueQuery, valueParams);
        const values = valueResult.rows[0];

        filters.push({
          id: filter.id,
          name: filter.name,
          slug: filter.slug,
          type: filter.filter_type,
          data_type: filter.data_type,
          min_value: values.min_value ? parseFloat(values.min_value) : null,
          max_value: values.max_value ? parseFloat(values.max_value) : null
        });
      } else {
        filters.push({
          id: filter.id,
          name: filter.name,
          slug: filter.slug,
          type: filter.filter_type,
          data_type: filter.data_type
        });
      }
    }

    return filters;
  }
}
```

### 4. API Routes Implementation
```typescript
// backend/src/routes/products.ts
import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();

/**
 * @route GET /api/products
 * @desc Get products with filtering and pagination
 * @access Public
 */
router.get('/', productController.getProducts.bind(productController));

/**
 * @route GET /api/products/:id
 * @desc Get product by ID
 * @access Public
 */
router.get('/:id', productController.getProductById.bind(productController));

/**
 * @route GET /api/categories
 * @desc Get product categories
 * @access Public
 */
router.get('/categories', productController.getCategories.bind(productController));

/**
 * @route GET /api/filters
 * @desc Get available filters
 * @access Public
 */
router.get('/filters', productController.getFilters.bind(productController));

export default router;
```

### 5. Express App Configuration
```typescript
// backend/src/app.ts
import express from 'express';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import filterRoutes from './routes/filters';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/filters', filterRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
```

## Performance Considerations

### 1. Database Indexing
Ensure all filterable columns are properly indexed:
```sql
-- Indexes for common filters
CREATE INDEX idx_products_interest_rate_min ON financial.products(interest_rate_min);
CREATE INDEX idx_products_interest_rate_max ON financial.products(interest_rate_max);
CREATE INDEX idx_products_annual_fee ON financial.products(annual_fee);
CREATE INDEX idx_products_min_credit_score ON financial.products(min_credit_score);
CREATE INDEX idx_products_accepts_imss ON financial.products(accepts_imss);
CREATE INDEX idx_products_accepts_issste ON financial.products(accepts_issste);
CREATE INDEX idx_products_is_featured ON financial.products(is_featured);
```

### 2. Caching Strategy
Implement Redis caching for:
- Product listings (with different filter combinations)
- Categories
- Available filters
- Individual products (with short TTL)

### 3. Query Optimization
- Use materialized views for complex aggregations
- Implement query result caching
- Use connection pooling
- Optimize JOIN operations

### 4. Pagination Strategy
- Implement cursor-based pagination for better performance with large datasets
- Use LIMIT and OFFSET for simple pagination
- Consider keyset pagination for deep pagination

## Security Considerations

### 1. Input Validation
- Validate all query parameters
- Sanitize user inputs
- Implement rate limiting
- Use parameterized queries to prevent SQL injection

### 2. API Security
- Implement API key authentication for sensitive operations
- Use HTTPS for all API endpoints
- Implement proper CORS configuration
- Add request logging for audit purposes

## Error Handling

### 1. Error Response Format
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

### 2. Common Error Types
- 400: Bad Request (invalid parameters)
- 404: Not Found (product or category not found)
- 500: Internal Server Error (database or server issues)
- 429: Too Many Requests (rate limiting)

## Monitoring and Logging

### 1. Request Logging
- Log all API requests with timestamps
- Track response times
- Monitor error rates
- Log filter combinations for analytics

### 2. Performance Monitoring
- Track database query performance
- Monitor API response times
- Set up alerts for performance degradation
- Implement distributed tracing

This API implementation provides a robust foundation for handling 500+ financial products with advanced filtering capabilities while maintaining good performance and scalability.