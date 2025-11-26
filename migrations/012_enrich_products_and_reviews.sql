-- Migration: Enrich Financial Products and Create Reviews System

-- 1. Add internal_rating to financial_products
ALTER TABLE public.financial_products 
ADD COLUMN IF NOT EXISTS internal_rating DECIMAL(3,2) DEFAULT 0;

COMMENT ON COLUMN public.financial_products.internal_rating IS 'Rating assigned by Raisket team (0.00 - 5.00)';
COMMENT ON COLUMN public.financial_products.rating IS 'Social rating calculated from user reviews (0.00 - 5.00)';

-- 2. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.financial_products(id) ON DELETE CASCADE,
    
    -- User info (can be linked to auth.users if logged in, or anonymous with moderation)
    user_id UUID REFERENCES auth.users(id),
    reviewer_name TEXT,
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    
    -- Status
    is_approved BOOLEAN DEFAULT FALSE, -- Requires moderation by default
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON public.reviews(is_approved);

-- RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Function to calculate social rating
CREATE OR REPLACE FUNCTION update_product_social_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.financial_products
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM public.reviews
            WHERE product_id = NEW.product_id AND is_approved = true
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE product_id = NEW.product_id AND is_approved = true
        )
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS update_social_rating_trigger ON public.reviews;
CREATE TRIGGER update_social_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_social_rating();
