# Enhanced Product Database Schema for 500+ Products

## Overview

This document outlines the enhanced database schema for handling 500+ financial products with improved performance, indexing, and advanced filtering capabilities.

## Key Enhancements

1. **Improved Indexing Strategy**
2. **Enhanced Filtering Capabilities**
3. **Performance Optimizations**
4. **Scalability Considerations**

## Database Schema

### Core Tables

#### 1. financial.institutions (Enhanced)
```sql
CREATE TABLE financial.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    brand_name VARCHAR(200),
    institution_type VARCHAR(50) NOT NULL,
    
    -- Mexican Regulatory Information
    cnbv_license VARCHAR(50),
    condusef_registration VARCHAR(50),
    cnsf_registration VARCHAR(50),
    
    -- Contact Information
    website VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Address
    street_address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(10),
    
    -- Operational Status
    is_active BOOLEAN DEFAULT TRUE,
    risk_rating VARCHAR(10),
    
    -- Integration Status
    api_enabled BOOLEAN DEFAULT FALSE,
    api_endpoint VARCHAR(255),
    webhook_endpoint VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. financial.product_categories (New)
```sql
CREATE TABLE financial.product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    segment VARCHAR(20) NOT NULL, -- 'individual' or 'business'
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    icon_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. financial.products (Enhanced)
```sql
CREATE TABLE financial.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES financial.institutions(id),
    category_id UUID NOT NULL REFERENCES financial.product_categories(id),
    
    -- Product Information
    name VARCHAR(200) NOT NULL,
    product_code VARCHAR(50),
    description TEXT,
    long_description TEXT,
    terms_and_conditions TEXT,
    tagline VARCHAR(255),
    
    -- Segmentation
    target_segment VARCHAR(20) NOT NULL, -- 'individual', 'business', 'both'
    
    -- Financial Terms
    min_amount DECIMAL(15,2),
    max_amount DECIMAL(15,2),
    interest_rate_min DECIMAL(5,4),
    interest_rate_max DECIMAL(5,4),
    rate_type VARCHAR(20), -- 'fixed', 'variable'
    
    -- Loan Terms
    min_term_months INTEGER,
    max_term_months INTEGER,
    
    -- Credit Card Specific
    annual_fee DECIMAL(10,2),
    credit_limit_min DECIMAL(15,2),
    credit_limit_max DECIMAL(15,2),
    
    -- Requirements
    min_income DECIMAL(15,2),
    min_credit_score INTEGER,
    max_credit_score INTEGER,
    employment_requirement TEXT,
    collateral_required BOOLEAN DEFAULT FALSE,
    
    -- Mexican Specific
    accepts_imss BOOLEAN DEFAULT TRUE,
    accepts_issste BOOLEAN DEFAULT TRUE,
    requires_guarantor BOOLEAN DEFAULT FALSE,
    
    -- Product Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    commission_rate DECIMAL(5,4),
    
    -- Media
    image_url VARCHAR(500),
    ai_hint VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. financial.product_features (New)
```sql
CREATE TABLE financial.product_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES financial.products(id) ON DELETE CASCADE,
    feature_text TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_benefit BOOLEAN DEFAULT FALSE, -- TRUE for benefits, FALSE for features
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. financial.product_filters (New)
```sql
CREATE TABLE financial.product_filters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    filter_type VARCHAR(50) NOT NULL, -- 'range', 'boolean', 'enum', 'multi_select'
    data_type VARCHAR(50), -- 'integer', 'decimal', 'string', 'boolean'
    category_id UUID REFERENCES financial.product_categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. financial.product_filter_values (New)
```sql
CREATE TABLE financial.product_filter_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES financial.products(id) ON DELETE CASCADE,
    filter_id UUID NOT NULL REFERENCES financial.product_filters(id),
    value_string VARCHAR(255),
    value_integer INTEGER,
    value_decimal DECIMAL(15,2),
    value_boolean BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(product_id, filter_id)
);
```

#### 7. financial.product_ratings (New)
```sql
CREATE TABLE financial.product_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES financial.products(id) ON DELETE CASCADE,
    average_rating DECIMAL(3,2) CHECK (average_rating >= 0 AND average_rating <= 5),
    review_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Indexing Strategy

### Primary Indexes
```sql
-- Core indexes for performance
CREATE INDEX idx_products_category ON financial.products(category_id);
CREATE INDEX idx_products_institution ON financial.products(institution_id);
CREATE INDEX idx_products_active ON financial.products(is_active);
CREATE INDEX idx_products_featured ON financial.products(is_featured);
CREATE INDEX idx_products_segment ON financial.products(target_segment);
CREATE INDEX idx_products_created_at ON financial.products(created_at);

-- Indexes for filtering
CREATE INDEX idx_products_min_income ON financial.products(min_income);
CREATE INDEX idx_products_min_credit_score ON financial.products(min_credit_score);
CREATE INDEX idx_products_interest_rate_min ON financial.products(interest_rate_min);
CREATE INDEX idx_products_annual_fee ON financial.products(annual_fee);

-- Composite indexes for common queries
CREATE INDEX idx_products_category_active ON financial.products(category_id, is_active);
CREATE INDEX idx_products_segment_active ON financial.products(target_segment, is_active);

-- Indexes for filter values
CREATE INDEX idx_filter_values_product ON financial.product_filter_values(product_id);
CREATE INDEX idx_filter_values_filter ON financial.product_filter_values(filter_id);
CREATE INDEX idx_filter_values_value_decimal ON financial.product_filter_values(value_decimal);
CREATE INDEX idx_filter_values_value_integer ON financial.product_filter_values(value_integer);
CREATE INDEX idx_filter_values_value_boolean ON financial.product_filter_values(value_boolean);

-- Indexes for product features
CREATE INDEX idx_product_features_product ON financial.product_features(product_id);
CREATE INDEX idx_product_features_benefit ON financial.product_features(is_benefit);

-- Indexes for ratings
CREATE INDEX idx_product_ratings_product ON financial.product_ratings(product_id);
CREATE INDEX idx_product_ratings_average ON financial.product_ratings(average_rating);
```

## Performance Considerations

### 1. Partitioning Strategy
For 500+ products, consider partitioning the products table by category:
```sql
-- Example of range partitioning by category
CREATE TABLE financial.products_credit PARTITION OF financial.products
FOR VALUES IN ('credit_card', 'personal_loan', 'auto_loan', 'mortgage');

CREATE TABLE financial.products_investment PARTITION OF financial.products
FOR VALUES IN ('investment_fund', 'savings_account', 'time_deposit');

CREATE TABLE financial.products_insurance PARTITION OF financial.products
FOR VALUES IN ('life_insurance', 'auto_insurance', 'home_insurance', 'health_insurance');

CREATE TABLE financial.products_business PARTITION OF financial.products
FOR VALUES IN ('business_loan', 'business_credit_card');
```

### 2. Materialized Views for Common Queries
```sql
-- Materialized view for product listings with ratings
CREATE MATERIALIZED VIEW financial.product_listings AS
SELECT 
    p.id,
    p.name,
    p.tagline,
    p.description,
    p.category_id,
    p.institution_id,
    p.target_segment,
    p.image_url,
    p.is_active,
    p.is_featured,
    p.created_at,
    r.average_rating,
    r.review_count,
    i.name as institution_name,
    c.name as category_name,
    c.slug as category_slug
FROM financial.products p
JOIN financial.product_ratings r ON p.id = r.product_id
JOIN financial.institutions i ON p.institution_id = i.id
JOIN financial.product_categories c ON p.category_id = c.id
WHERE p.is_active = TRUE;

-- Refresh the materialized view periodically
-- REFRESH MATERIALIZED VIEW financial.product_listings;
```

### 3. Full-Text Search Index
```sql
-- Add a tsvector column for full-text search
ALTER TABLE financial.products ADD COLUMN search_vector tsvector;

-- Update the search vector with product information
UPDATE financial.products SET search_vector = 
    setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(tagline, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(description, '')), 'C') ||
    setweight(to_tsvector('spanish', coalesce(long_description, '')), 'D');

-- Create index for full-text search
CREATE INDEX idx_products_search ON financial.products USING GIN(search_vector);

-- Trigger to update search vector on product changes
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('spanish', coalesce(NEW.name, '')), 'A') ||
        setweight(to_tsvector('spanish', coalesce(NEW.tagline, '')), 'B') ||
        setweight(to_tsvector('spanish', coalesce(NEW.description, '')), 'C') ||
        setweight(to_tsvector('spanish', coalesce(NEW.long_description, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_search_vector_trigger
BEFORE INSERT OR UPDATE ON financial.products
FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();
```

## Scalability Considerations

### 1. Connection Pooling
Use connection pooling (e.g., PgBouncer) to handle concurrent requests efficiently.

### 2. Read Replicas
Set up read replicas for the database to distribute read load.

### 3. Caching Strategy
Implement Redis caching for:
- Product listings
- Filter options
- Category information
- Institution details

### 4. CDN for Images
Use a CDN for product images to reduce load on the application server.

## Migration Path

### From Current Schema
1. Add new tables (product_categories, product_features, product_filters, product_filter_values, product_ratings)
2. Migrate existing data to new structure
3. Add indexes
4. Implement materialized views
5. Set up full-text search
6. Configure caching layer

This enhanced schema will efficiently handle 500+ products while providing advanced filtering capabilities and maintaining good performance.