-- Migration: Add UI and mock data fields to products table
-- Description: Adds fields needed for mock product data migration
-- Date: 2025-09-13

-- Add new columns to products table
ALTER TABLE financial.products
ADD COLUMN IF NOT EXISTS segment TEXT,
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS interest_rate TEXT,
ADD COLUMN IF NOT EXISTS loan_term TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS ai_hint TEXT,
ADD COLUMN IF NOT EXISTS provider TEXT,
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS benefits TEXT[],
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS fees TEXT,
ADD COLUMN IF NOT EXISTS eligibility TEXT[],
ADD COLUMN IF NOT EXISTS details_url TEXT,
ADD COLUMN IF NOT EXISTS max_loan_amount TEXT,
ADD COLUMN IF NOT EXISTS min_investment TEXT,
ADD COLUMN IF NOT EXISTS investment_type TEXT,
ADD COLUMN IF NOT EXISTS coverage_amount TEXT;

-- Add constraints and defaults
ALTER TABLE financial.products
ALTER COLUMN average_rating SET DEFAULT 0,
ALTER COLUMN review_count SET DEFAULT 0,
ALTER COLUMN is_active SET DEFAULT true,
ALTER COLUMN is_featured SET DEFAULT false,
ALTER COLUMN collateral_required SET DEFAULT false,
ALTER COLUMN accepts_imss SET DEFAULT false,
ALTER COLUMN accepts_issste SET DEFAULT false,
ALTER COLUMN requires_guarantor SET DEFAULT false;

-- Add check constraints
ALTER TABLE financial.products
ADD CONSTRAINT products_average_rating_check
CHECK (average_rating >= 0 AND average_rating <= 5);

ALTER TABLE financial.products
ADD CONSTRAINT products_review_count_check
CHECK (review_count >= 0);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_segment ON financial.products(segment);
CREATE INDEX IF NOT EXISTS idx_products_provider ON financial.products(provider);
CREATE INDEX IF NOT EXISTS idx_products_average_rating ON financial.products(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_segment ON financial.products(category, segment);
CREATE INDEX IF NOT EXISTS idx_products_featured ON financial.products(is_featured) WHERE is_featured = true;

-- Add comments
COMMENT ON COLUMN financial.products.segment IS 'Target market segment (Personas, Empresas)';
COMMENT ON COLUMN financial.products.long_description IS 'Detailed product description for product pages';
COMMENT ON COLUMN financial.products.tagline IS 'Short marketing tagline';
COMMENT ON COLUMN financial.products.interest_rate IS 'Human-readable interest rate string (e.g., "15.99% - 23.99% TAE")';
COMMENT ON COLUMN financial.products.loan_term IS 'Human-readable loan term string (e.g., "12-60 months")';
COMMENT ON COLUMN financial.products.image_url IS 'URL to product image';
COMMENT ON COLUMN financial.products.ai_hint IS 'Hint for AI image generation';
COMMENT ON COLUMN financial.products.provider IS 'Institution/provider name (denormalized for UI)';
COMMENT ON COLUMN financial.products.features IS 'Array of product features';
COMMENT ON COLUMN financial.products.benefits IS 'Array of product benefits';
COMMENT ON COLUMN financial.products.average_rating IS 'Average user rating (0-5)';
COMMENT ON COLUMN financial.products.review_count IS 'Number of user reviews';
COMMENT ON COLUMN financial.products.fees IS 'Human-readable fees description';
COMMENT ON COLUMN financial.products.eligibility IS 'Array of eligibility requirements';
COMMENT ON COLUMN financial.products.details_url IS 'URL to external product details page';
COMMENT ON COLUMN financial.products.max_loan_amount IS 'Human-readable max loan amount';
COMMENT ON COLUMN financial.products.min_investment IS 'Human-readable minimum investment';
COMMENT ON COLUMN financial.products.investment_type IS 'Type of investment product';
COMMENT ON COLUMN financial.products.coverage_amount IS 'Insurance coverage amount';