-- Migration: Fix and update public schema tables
-- Description: Adds missing columns to existing public.products table and creates indexes
-- Date: 2025-09-13

-- Add missing columns to existing products table (if they don't exist)
DO $$
BEGIN
    -- Add segment column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'segment') THEN
        ALTER TABLE public.products ADD COLUMN segment TEXT;
    END IF;

    -- Add long_description column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'long_description') THEN
        ALTER TABLE public.products ADD COLUMN long_description TEXT;
    END IF;

    -- Add tagline column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'tagline') THEN
        ALTER TABLE public.products ADD COLUMN tagline TEXT;
    END IF;

    -- Add interest_rate column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'interest_rate') THEN
        ALTER TABLE public.products ADD COLUMN interest_rate TEXT;
    END IF;

    -- Add loan_term column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'loan_term') THEN
        ALTER TABLE public.products ADD COLUMN loan_term TEXT;
    END IF;

    -- Add image_url column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'image_url') THEN
        ALTER TABLE public.products ADD COLUMN image_url TEXT;
    END IF;

    -- Add ai_hint column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'ai_hint') THEN
        ALTER TABLE public.products ADD COLUMN ai_hint TEXT;
    END IF;

    -- Add provider column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'provider') THEN
        ALTER TABLE public.products ADD COLUMN provider TEXT;
    END IF;

    -- Add features column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'features') THEN
        ALTER TABLE public.products ADD COLUMN features TEXT[];
    END IF;

    -- Add benefits column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'benefits') THEN
        ALTER TABLE public.products ADD COLUMN benefits TEXT[];
    END IF;

    -- Add average_rating column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'average_rating') THEN
        ALTER TABLE public.products ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0;
    END IF;

    -- Add review_count column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'review_count') THEN
        ALTER TABLE public.products ADD COLUMN review_count INTEGER DEFAULT 0;
    END IF;

    -- Add fees column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'fees') THEN
        ALTER TABLE public.products ADD COLUMN fees TEXT;
    END IF;

    -- Add eligibility column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'eligibility') THEN
        ALTER TABLE public.products ADD COLUMN eligibility TEXT[];
    END IF;

    -- Add details_url column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'details_url') THEN
        ALTER TABLE public.products ADD COLUMN details_url TEXT;
    END IF;

    -- Add max_loan_amount column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'max_loan_amount') THEN
        ALTER TABLE public.products ADD COLUMN max_loan_amount TEXT;
    END IF;

    -- Add min_investment column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'min_investment') THEN
        ALTER TABLE public.products ADD COLUMN min_investment TEXT;
    END IF;

    -- Add investment_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'investment_type') THEN
        ALTER TABLE public.products ADD COLUMN investment_type TEXT;
    END IF;

    -- Add coverage_amount column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'coverage_amount') THEN
        ALTER TABLE public.products ADD COLUMN coverage_amount TEXT;
    END IF;

    -- Add is_featured column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'is_featured') THEN
        ALTER TABLE public.products ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;

END$$;

-- Add constraints (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE table_schema = 'public' AND table_name = 'products'
                   AND constraint_name = 'products_average_rating_check') THEN
        ALTER TABLE public.products
        ADD CONSTRAINT products_average_rating_check
        CHECK (average_rating >= 0 AND average_rating <= 5);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE table_schema = 'public' AND table_name = 'products'
                   AND constraint_name = 'products_review_count_check') THEN
        ALTER TABLE public.products
        ADD CONSTRAINT products_review_count_check
        CHECK (review_count >= 0);
    END IF;
END$$;

-- Create indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_segment ON public.products(segment);
CREATE INDEX IF NOT EXISTS idx_products_provider ON public.products(provider);
CREATE INDEX IF NOT EXISTS idx_products_average_rating ON public.products(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_segment ON public.products(category, segment);
CREATE INDEX IF NOT EXISTS idx_products_institution ON public.products(institution_id);

-- Create the featured index only after ensuring is_featured column exists
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;

-- Verify the schema
SELECT
    'Column added successfully' as status,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'products'
  AND column_name IN (
    'segment', 'tagline', 'provider', 'features', 'benefits',
    'average_rating', 'review_count', 'image_url', 'is_featured'
  )
ORDER BY column_name;