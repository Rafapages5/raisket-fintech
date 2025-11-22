-- ====================================================================
-- ROLLBACK MIGRATION 008: Revertir Optimización de Filtros
-- ====================================================================
-- ADVERTENCIA: Solo ejecutar si necesitas revertir la migración 008
-- ====================================================================

BEGIN;

-- Eliminar vista materializada
DROP MATERIALIZED VIEW IF EXISTS analytics.product_filter_stats CASCADE;

-- Eliminar trigger
DROP TRIGGER IF EXISTS trigger_sync_product_fields ON public.products;

-- Eliminar función
DROP FUNCTION IF EXISTS sync_institution_type() CASCADE;

-- Eliminar índices
DROP INDEX IF EXISTS idx_products_filters_combo;
DROP INDEX IF EXISTS idx_products_tipo_producto;
DROP INDEX IF EXISTS idx_products_tipo_institucion;
DROP INDEX IF EXISTS idx_products_segmento_cliente;
DROP INDEX IF EXISTS idx_products_popularity;
DROP INDEX IF EXISTS idx_products_name_trgm;
DROP INDEX IF EXISTS idx_products_description_trgm;

-- Eliminar constraints
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_tipo_institucion_check;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_segmento_cliente_check;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_tipo_producto_check;

-- Eliminar columnas
ALTER TABLE public.products DROP COLUMN IF EXISTS tipo_institucion;
ALTER TABLE public.products DROP COLUMN IF EXISTS segmento_cliente;
ALTER TABLE public.products DROP COLUMN IF EXISTS tipo_producto;

COMMIT;

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE '✓ ROLLBACK COMPLETADO';
    RAISE NOTICE 'La migración 008 ha sido revertida';
    RAISE NOTICE '============================================';
END $$;
