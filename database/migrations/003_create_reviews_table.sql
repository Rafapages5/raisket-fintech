-- Migration 003: Create Reviews Table
-- Raisket Mexican Fintech Platform
-- Created: 2025-09-01
-- Description: Creates the reviews table for storing product reviews and user emails

-- Migration metadata
INSERT INTO public.schema_migrations (version, name, applied_at) 
VALUES (3, 'create_reviews_table', NOW())
ON CONFLICT (version) DO NOTHING;

-- Create the reviews table in the financial schema
CREATE TABLE IF NOT EXISTS financial.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Product relationship
    product_id UUID NOT NULL REFERENCES financial.products(id) ON DELETE CASCADE,
    
    -- User relationship (optional for non-registered users)
    user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    
    -- Review details
    reviewer_name VARCHAR(100) NOT NULL,
    reviewer_email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT NOT NULL,
    
    -- Approval status
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES core.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON financial.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON financial.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON financial.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON financial.reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON financial.reviews(created_at);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON financial.reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON financial.reviews TO raisket_user;

-- Add a column to the products table to store the average rating and review count
ALTER TABLE financial.products 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Create indexes for the new columns in products table
CREATE INDEX IF NOT EXISTS idx_products_average_rating ON financial.products(average_rating);
CREATE INDEX IF NOT EXISTS idx_products_review_count ON financial.products(review_count);

-- Grant permissions for the new columns
GRANT SELECT, UPDATE ON financial.products TO raisket_user;

-- Add a comment to describe the table
COMMENT ON TABLE financial.reviews IS 'Product reviews with user information for the Raisket platform';

-- Sample data for testing (optional)
-- INSERT INTO financial.reviews (product_id, reviewer_name, reviewer_email, rating, title, comment, is_approved)
-- VALUES 
--     ((SELECT id FROM financial.products LIMIT 1), 'Juan Pérez', 'juan.perez@example.com', 5, 'Excelente producto', 'Muy buen servicio y atención personalizada.', true),
--     ((SELECT id FROM financial.products LIMIT 1), 'María García', 'maria.garcia@example.com', 4, 'Buena opción', 'Cumple con las expectativas, aunque podría mejorar en algunos aspectos.', true);