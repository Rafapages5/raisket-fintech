-- ====================================================================
-- VERIFICAR ESTRUCTURA COMPLETA
-- ====================================================================
-- Ejecuta esto para ver la estructura de productos e instituciones
-- ====================================================================

-- 1. Ver columnas de la tabla productos
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'productos'
ORDER BY ordinal_position;

-- 2. Ver columnas de la tabla instituciones
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'instituciones'
ORDER BY ordinal_position;

-- 3. Verificar si hay foreign key entre productos e instituciones
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'productos'
  AND tc.table_schema = 'public';

-- 4. Ver muestra de datos de productos
SELECT
    id,
    nombre,
    categoria,
    segmento,
    proveedor
FROM public.productos
LIMIT 5;

-- 5. Ver muestra de datos de instituciones
SELECT *
FROM public.instituciones
LIMIT 5;

-- 6. Contar registros
SELECT
    (SELECT COUNT(*) FROM public.productos) as total_productos,
    (SELECT COUNT(*) FROM public.instituciones) as total_instituciones;
