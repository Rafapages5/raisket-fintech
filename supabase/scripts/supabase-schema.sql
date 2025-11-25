-- Supabase schema for Financial Products
-- Run this SQL in your Supabase SQL Editor

-- Create the products table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    category TEXT NOT NULL,
    segment TEXT NOT NULL,
    image_url TEXT,
    ai_hint TEXT,
    provider TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    average_rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    interest_rate TEXT,
    fees TEXT,
    eligibility TEXT[] DEFAULT '{}',
    details_url TEXT,
    loan_term TEXT,
    max_loan_amount TEXT,
    min_investment TEXT,
    investment_type TEXT,
    coverage_amount TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_segment ON products(segment);
CREATE INDEX IF NOT EXISTS idx_products_provider ON products(provider);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(average_rating);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only for products)
CREATE POLICY "Public can view products" ON products
    FOR SELECT USING (true);

-- Optional: Create policy for authenticated users to insert/update
-- Uncomment if you want to allow authenticated users to manage products
-- CREATE POLICY "Authenticated users can insert products" ON products
--     FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- CREATE POLICY "Authenticated users can update products" ON products
--     FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample data from your mock products
INSERT INTO public.products (
    id, name, tagline, description, long_description, category, segment, 
    image_url, ai_hint, provider, features, benefits, average_rating, 
    review_count, interest_rate, fees, eligibility, details_url
) VALUES 
(
    'bbva-azul-001',
    'Tarjeta de Crédito Azul BBVA',
    'Tu primera tarjeta de crédito sin anualidad.',
    'Ideal para comenzar tu historial crediticio. Sin anualidad el primer año y con la seguridad de BBVA México.',
    'La Tarjeta Azul BBVA es perfecta para quienes buscan su primera tarjeta de crédito o desean una opción confiable sin complicaciones. Disfruta de compras seguras con tecnología chip y contactless, además de beneficios exclusivos en comercios afiliados.',
    'Crédito',
    'Personas',
    'https://placehold.co/600x400/0066CC/FFFFFF?text=BBVA+Azul',
    'tarjeta de crédito azul BBVA México',
    'BBVA México',
    ARRAY['Sin anualidad el primer año', 'Tecnología chip y contactless', 'BBVA Net Cash para consultas 24/7', 'Seguro por compra protegida'],
    ARRAY['Construye tu historial crediticio', 'Compras seguras y protegidas', 'Flexibilidad de pago'],
    4.2,
    2850,
    '42.8% anual',
    'Anualidad: $0 primer año, $450 MXN a partir del segundo año',
    ARRAY['Ingresos mínimos de $8,000 MXN mensuales', 'Edad entre 18 y 70 años', 'Residencia en México'],
    'https://www.bbva.mx/personas/productos/tarjetas-de-credito/azul.html'
),
(
    'bbva-oro-001',
    'Tarjeta de Crédito Oro BBVA',
    'Más beneficios para tu estilo de vida.',
    'Tarjeta clásica con beneficios premium, seguros incluidos y programa de recompensas mejorado para el día a día.',
    'La Tarjeta Oro BBVA combina la elegancia de un diseño distintivo con beneficios que se adaptan a tu estilo de vida. Disfruta de un límite de crédito más alto, seguros de vida y accidentes incluidos.',
    'Crédito',
    'Personas',
    'https://placehold.co/600x400/FFD700/000000?text=BBVA+Oro',
    'tarjeta de crédito oro dorada BBVA',
    'BBVA México',
    ARRAY['Límite de crédito más alto', 'Seguro de vida por $200,000 MXN', 'BBVA Rewards programa mejorado', 'Servicio al cliente preferencial'],
    ARRAY['Mayor poder de compra', 'Protección integral', 'Recompensas aceleradas', 'Atención prioritaria'],
    4.5,
    1920,
    '39.9% anual',
    'Anualidad: $900 MXN (condonable con consumos mínimos)',
    ARRAY['Ingresos mínimos de $15,000 MXN mensuales', 'Buen historial crediticio', 'Edad entre 21 y 70 años'],
    'https://www.bbva.mx/personas/productos/tarjetas-de-credito/oro.html'
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;