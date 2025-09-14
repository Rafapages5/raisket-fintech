-- Migration: Create tables in public schema
-- Description: Creates institutions and products tables in public schema for API access
-- Date: 2025-09-13

-- Create institutions table in public schema
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand_name TEXT,
    institution_type TEXT NOT NULL,
    cnbv_license TEXT,
    condusef_registration TEXT,
    cnsf_registration TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    street_address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    is_active BOOLEAN DEFAULT true,
    risk_rating TEXT,
    api_enabled BOOLEAN DEFAULT false,
    api_endpoint TEXT,
    webhook_endpoint TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table in public schema
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    institution_id UUID NOT NULL REFERENCES public.institutions(id),
    name TEXT NOT NULL,
    product_code TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    segment TEXT,
    description TEXT,
    long_description TEXT,
    tagline TEXT,
    terms_and_conditions TEXT,
    min_amount DECIMAL(15,2),
    max_amount DECIMAL(15,2),
    interest_rate_min DECIMAL(8,4),
    interest_rate_max DECIMAL(8,4),
    interest_rate TEXT,
    rate_type TEXT,
    min_term_months INTEGER,
    max_term_months INTEGER,
    loan_term TEXT,
    annual_fee DECIMAL(10,2),
    credit_limit_min DECIMAL(15,2),
    credit_limit_max DECIMAL(15,2),
    min_income DECIMAL(15,2),
    min_credit_score INTEGER,
    max_credit_score INTEGER,
    employment_requirement TEXT,
    collateral_required BOOLEAN DEFAULT false,
    accepts_imss BOOLEAN DEFAULT false,
    accepts_issste BOOLEAN DEFAULT false,
    requires_guarantor BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    commission_rate DECIMAL(6,4),
    image_url TEXT,
    ai_hint TEXT,
    provider TEXT,
    features TEXT[],
    benefits TEXT[],
    average_rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    fees TEXT,
    eligibility TEXT[],
    details_url TEXT,
    max_loan_amount TEXT,
    min_investment TEXT,
    investment_type TEXT,
    coverage_amount TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraints
ALTER TABLE public.products
ADD CONSTRAINT products_average_rating_check
CHECK (average_rating >= 0 AND average_rating <= 5);

ALTER TABLE public.products
ADD CONSTRAINT products_review_count_check
CHECK (review_count >= 0);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_segment ON public.products(segment);
CREATE INDEX IF NOT EXISTS idx_products_provider ON public.products(provider);
CREATE INDEX IF NOT EXISTS idx_products_average_rating ON public.products(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_segment ON public.products(category, segment);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_institution ON public.products(institution_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to institutions" ON public.institutions
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to products" ON public.products
    FOR SELECT USING (true);

-- Add comments
COMMENT ON TABLE public.institutions IS 'Financial institutions providing products';
COMMENT ON TABLE public.products IS 'Financial products offered by institutions';

COMMENT ON COLUMN public.products.segment IS 'Target market segment (Personas, Empresas)';
COMMENT ON COLUMN public.products.long_description IS 'Detailed product description for product pages';
COMMENT ON COLUMN public.products.tagline IS 'Short marketing tagline';
COMMENT ON COLUMN public.products.interest_rate IS 'Human-readable interest rate string';
COMMENT ON COLUMN public.products.loan_term IS 'Human-readable loan term string';
COMMENT ON COLUMN public.products.image_url IS 'URL to product image';
COMMENT ON COLUMN public.products.ai_hint IS 'Hint for AI image generation';
COMMENT ON COLUMN public.products.provider IS 'Institution/provider name (denormalized for UI)';
COMMENT ON COLUMN public.products.features IS 'Array of product features';
COMMENT ON COLUMN public.products.benefits IS 'Array of product benefits';
COMMENT ON COLUMN public.products.average_rating IS 'Average user rating (0-5)';
COMMENT ON COLUMN public.products.review_count IS 'Number of user reviews';
COMMENT ON COLUMN public.products.fees IS 'Human-readable fees description';
COMMENT ON COLUMN public.products.eligibility IS 'Array of eligibility requirements';