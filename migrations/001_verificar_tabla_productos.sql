-- ====================================================================
-- VERIFICACIÓN: ¿Qué tabla de productos tienes?
-- ====================================================================
-- Ejecuta esto PRIMERO para saber qué tabla usar
-- ====================================================================

-- Opción 1: Verificar si existe public.productos (en español)
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'productos'
) as tiene_productos_espanol;

-- Opción 2: Verificar si existe public.products (en inglés)
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'products'
) as tiene_products_ingles;

-- Ver todas las columnas de public.productos
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'productos'
ORDER BY ordinal_position;

-- Contar registros
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'productos'
    ) THEN
        EXECUTE 'SELECT COUNT(*) FROM public.productos' INTO row_count;
        RAISE NOTICE 'Tabla: public.productos - Registros: %', row_count;
    END IF;

    IF EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'products'
    ) THEN
        EXECUTE 'SELECT COUNT(*) FROM public.products' INTO row_count;
        RAISE NOTICE 'Tabla: public.products - Registros: %', row_count;
    END IF;
END $$;

-- Ver tabla de instituciones
SELECT
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_name IN ('institutions', 'instituciones')
  AND table_schema = 'public';
