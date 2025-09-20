-- Script para verificar que el esquema de productos se actualizó correctamente
-- Ejecuta esto en el SQL Editor de Supabase para verificar

-- 1. Verificar que la tabla existe y sus columnas
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'financial'
  AND table_name = 'products'
ORDER BY ordinal_position;

-- 2. Verificar los nuevos campos específicos que agregamos
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'financial'
  AND table_name = 'products'
  AND column_name IN (
    'segment', 'long_description', 'tagline', 'interest_rate',
    'loan_term', 'image_url', 'ai_hint', 'provider',
    'features', 'benefits', 'average_rating', 'review_count',
    'fees', 'eligibility', 'details_url', 'max_loan_amount',
    'min_investment', 'investment_type', 'coverage_amount'
  )
ORDER BY column_name;

-- 3. Verificar los constraints que agregamos
SELECT
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'financial'
  AND table_name = 'products'
  AND constraint_name LIKE 'products_%_check';

-- 4. Verificar los índices que creamos
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'financial'
  AND tablename = 'products'
  AND indexname LIKE 'idx_products_%';

-- 5. Contar cuántas columnas tiene la tabla ahora
SELECT COUNT(*) as total_columns
FROM information_schema.columns
WHERE table_schema = 'financial'
  AND table_name = 'products';