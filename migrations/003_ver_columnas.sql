-- ====================================================================
-- VER COLUMNAS EXACTAS DE TUS TABLAS
-- ====================================================================

-- 1. Ver TODAS las columnas de productos
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'productos'
ORDER BY ordinal_position;

-- 2. Ver TODAS las columnas de instituciones
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'instituciones'
ORDER BY ordinal_position;

-- 3. Contar registros
SELECT
    (SELECT COUNT(*) FROM public.productos) as total_productos,
    (SELECT COUNT(*) FROM public.instituciones) as total_instituciones;

-- 4. Ver UNA fila de ejemplo de productos (sin especificar columnas)
SELECT *
FROM public.productos
LIMIT 1;

-- 5. Ver UNA fila de ejemplo de instituciones
SELECT *
FROM public.instituciones
LIMIT 1;
