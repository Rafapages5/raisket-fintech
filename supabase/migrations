-- ====================================================================
-- DIAGNÓSTICO: Identificar Schema Actual de Base de Datos
-- ====================================================================
-- Ejecuta este script PRIMERO en Supabase SQL Editor
-- para saber qué tablas y schemas tienes
-- ====================================================================

-- 1. Listar todos los schemas
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY schema_name;

-- 2. Listar todas las tablas de productos (en cualquier schema)
SELECT
    table_schema,
    table_name,
    (
        SELECT COUNT(*)
        FROM information_schema.columns c
        WHERE c.table_schema = t.table_schema
          AND c.table_name = t.table_name
    ) as column_count
FROM information_schema.tables t
WHERE table_name ILIKE '%product%'
  AND table_type = 'BASE TABLE'
ORDER BY table_schema, table_name;

-- 3. Listar todas las tablas en schema public
SELECT
    table_name,
    (
        SELECT COUNT(*)
        FROM information_schema.columns c
        WHERE c.table_schema = 'public'
          AND c.table_name = t.table_name
    ) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 4. Listar todas las tablas en schema financial (si existe)
SELECT
    table_name,
    (
        SELECT COUNT(*)
        FROM information_schema.columns c
        WHERE c.table_schema = 'financial'
          AND c.table_name = t.table_name
    ) as column_count
FROM information_schema.tables t
WHERE table_schema = 'financial'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 5. Si existe financial.products, mostrar sus columnas
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'financial'
  AND table_name = 'products'
ORDER BY ordinal_position;

-- 6. Si existe public.products, mostrar sus columnas
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'products'
ORDER BY ordinal_position;

-- 7. Contar registros en cada tabla de productos
DO $$
DECLARE
    row_count INTEGER;
    schema_name TEXT;
    table_exists BOOLEAN;
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'CONTEO DE REGISTROS';
    RAISE NOTICE '============================================';

    -- Check public.products
    SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'products'
    ) INTO table_exists;

    IF table_exists THEN
        EXECUTE 'SELECT COUNT(*) FROM public.products' INTO row_count;
        RAISE NOTICE 'public.products: % registros', row_count;
    ELSE
        RAISE NOTICE 'public.products: NO EXISTE';
    END IF;

    -- Check financial.products
    SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'financial'
          AND table_name = 'products'
    ) INTO table_exists;

    IF table_exists THEN
        EXECUTE 'SELECT COUNT(*) FROM financial.products' INTO row_count;
        RAISE NOTICE 'financial.products: % registros', row_count;
    ELSE
        RAISE NOTICE 'financial.products: NO EXISTE';
    END IF;

    RAISE NOTICE '============================================';
END $$;

-- 8. Mostrar tabla de instituciones
SELECT
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_name ILIKE '%institution%'
  AND table_type = 'BASE TABLE'
ORDER BY table_schema, table_name;
