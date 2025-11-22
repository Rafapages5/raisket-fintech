-- ====================================================================
-- MIGRATION 008: Optimizar Filtros de Productos
-- ====================================================================
-- Descripción: Mejora el performance de filtros agregando campos
--              desnormalizados y columnas generadas en español
-- Autor: Claude Code
-- Fecha: 2025-11-18
-- Estimado: ~30 segundos de ejecución
-- ====================================================================

BEGIN;

-- ====================================================================
-- PASO 1: Agregar nuevas columnas
-- ====================================================================

-- Columna para tipo de institución (desnormalizada)
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS tipo_institucion TEXT;

-- Columna generada para segmento en español (opcional)
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS segmento_cliente TEXT;

-- Columna generada para tipo de producto agrupado
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS tipo_producto TEXT;

-- ====================================================================
-- PASO 2: Migrar datos existentes
-- ====================================================================

-- Actualizar tipo_institucion desde la tabla institutions
UPDATE public.products p
SET tipo_institucion = CASE
    WHEN i.institution_type = 'bank' THEN 'Bancos'
    WHEN i.institution_type = 'fintech' THEN 'Fintech'
    WHEN i.institution_type = 'credit_union' THEN 'Cooperativas'
    WHEN i.institution_type = 'insurance' THEN 'Aseguradoras'
    ELSE 'Otro'
END
FROM public.institutions i
WHERE p.institution_id = i.id
  AND p.tipo_institucion IS NULL;

-- Actualizar segmento_cliente (mantener consistencia)
UPDATE public.products
SET segmento_cliente = CASE
    WHEN segment = 'Personas' THEN 'Personas'
    WHEN segment = 'Empresas' THEN 'Empresas'
    WHEN segment ILIKE '%persona%' THEN 'Personas'
    WHEN segment ILIKE '%empresa%' THEN 'Empresas'
    ELSE segment
END
WHERE segmento_cliente IS NULL;

-- Actualizar tipo_producto basado en category
UPDATE public.products
SET tipo_producto = CASE
    WHEN category IN ('credit_card', 'personal_loan', 'mortgage', 'auto_loan', 'business_loan') THEN 'Credito'
    WHEN category IN ('investment', 'savings', 'investment_fund') THEN 'Inversion'
    WHEN category IN ('insurance', 'life_insurance', 'health_insurance') THEN 'Seguros'
    WHEN category IN ('debit_card', 'checking_account', 'savings_account') THEN 'Cuentas'
    ELSE 'Otro'
END
WHERE tipo_producto IS NULL;

-- ====================================================================
-- PASO 3: Agregar constraints
-- ====================================================================

-- Hacer tipo_institucion NOT NULL después de migrar
ALTER TABLE public.products
ALTER COLUMN tipo_institucion SET NOT NULL;

-- Hacer segmento_cliente NOT NULL
ALTER TABLE public.products
ALTER COLUMN segmento_cliente SET NOT NULL;

-- Hacer tipo_producto NOT NULL
ALTER TABLE public.products
ALTER COLUMN tipo_producto SET NOT NULL;

-- Validar valores permitidos
ALTER TABLE public.products
ADD CONSTRAINT products_tipo_institucion_check
CHECK (tipo_institucion IN ('Bancos', 'Fintech', 'Cooperativas', 'Aseguradoras', 'Otro'));

ALTER TABLE public.products
ADD CONSTRAINT products_segmento_cliente_check
CHECK (segmento_cliente IN ('Personas', 'Empresas'));

ALTER TABLE public.products
ADD CONSTRAINT products_tipo_producto_check
CHECK (tipo_producto IN ('Credito', 'Inversion', 'Seguros', 'Cuentas', 'Otro'));

-- ====================================================================
-- PASO 4: Crear índices optimizados
-- ====================================================================

-- Índice compuesto para la query más común (segmento + tipo + institución)
CREATE INDEX IF NOT EXISTS idx_products_filters_combo
ON public.products(segmento_cliente, tipo_producto, tipo_institucion)
WHERE is_active = true;

-- Índices individuales para filtros específicos
CREATE INDEX IF NOT EXISTS idx_products_tipo_producto
ON public.products(tipo_producto)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_products_tipo_institucion
ON public.products(tipo_institucion)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_products_segmento_cliente
ON public.products(segmento_cliente)
WHERE is_active = true;

-- Índice para ordenamiento por popularidad
CREATE INDEX IF NOT EXISTS idx_products_popularity
ON public.products((average_rating * review_count) DESC)
WHERE is_active = true;

-- Índice trigram para búsqueda de texto en nombre
CREATE INDEX IF NOT EXISTS idx_products_name_trgm
ON public.products USING gin(name gin_trgm_ops);

-- Índice trigram para búsqueda en descripción
CREATE INDEX IF NOT EXISTS idx_products_description_trgm
ON public.products USING gin(description gin_trgm_ops);

-- ====================================================================
-- PASO 5: Crear trigger para mantener sincronización
-- ====================================================================

-- Función para sincronizar tipo_institucion automáticamente
CREATE OR REPLACE FUNCTION sync_institution_type()
RETURNS TRIGGER AS $$
BEGIN
    -- Sincronizar tipo_institucion desde institutions
    NEW.tipo_institucion := (
        SELECT CASE
            WHEN institution_type = 'bank' THEN 'Bancos'
            WHEN institution_type = 'fintech' THEN 'Fintech'
            WHEN institution_type = 'credit_union' THEN 'Cooperativas'
            WHEN institution_type = 'insurance' THEN 'Aseguradoras'
            ELSE 'Otro'
        END
        FROM public.institutions
        WHERE id = NEW.institution_id
    );

    -- Sincronizar segmento_cliente
    IF NEW.segment IS NOT NULL THEN
        NEW.segmento_cliente := CASE
            WHEN NEW.segment = 'Personas' THEN 'Personas'
            WHEN NEW.segment = 'Empresas' THEN 'Empresas'
            WHEN NEW.segment ILIKE '%persona%' THEN 'Personas'
            WHEN NEW.segment ILIKE '%empresa%' THEN 'Empresas'
            ELSE NEW.segment
        END;
    END IF;

    -- Sincronizar tipo_producto
    IF NEW.category IS NOT NULL THEN
        NEW.tipo_producto := CASE
            WHEN NEW.category IN ('credit_card', 'personal_loan', 'mortgage', 'auto_loan', 'business_loan') THEN 'Credito'
            WHEN NEW.category IN ('investment', 'savings', 'investment_fund') THEN 'Inversion'
            WHEN NEW.category IN ('insurance', 'life_insurance', 'health_insurance') THEN 'Seguros'
            WHEN NEW.category IN ('debit_card', 'checking_account', 'savings_account') THEN 'Cuentas'
            ELSE 'Otro'
        END;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
DROP TRIGGER IF EXISTS trigger_sync_product_fields ON public.products;
CREATE TRIGGER trigger_sync_product_fields
BEFORE INSERT OR UPDATE OF institution_id, segment, category ON public.products
FOR EACH ROW
EXECUTE FUNCTION sync_institution_type();

-- ====================================================================
-- PASO 6: Agregar comentarios de documentación
-- ====================================================================

COMMENT ON COLUMN public.products.tipo_institucion IS
    'Tipo de institución financiera (Bancos, Fintech, Cooperativas, Aseguradoras, Otro) - desnormalizado para performance';

COMMENT ON COLUMN public.products.segmento_cliente IS
    'Segmento de cliente en español (Personas, Empresas) - sincronizado con segment';

COMMENT ON COLUMN public.products.tipo_producto IS
    'Tipo de producto agrupado (Credito, Inversion, Seguros, Cuentas, Otro) - derivado de category';

COMMENT ON INDEX idx_products_filters_combo IS
    'Índice compuesto optimizado para queries con filtros múltiples (segmento + tipo + institución)';

-- ====================================================================
-- PASO 7: Verificar integridad de la migración
-- ====================================================================

DO $$
DECLARE
    null_tipo_inst INTEGER;
    null_segmento INTEGER;
    null_tipo_prod INTEGER;
    total_products INTEGER;
BEGIN
    -- Contar productos
    SELECT COUNT(*) INTO total_products FROM public.products;

    -- Verificar nulls en tipo_institucion
    SELECT COUNT(*) INTO null_tipo_inst
    FROM public.products
    WHERE tipo_institucion IS NULL;

    -- Verificar nulls en segmento_cliente
    SELECT COUNT(*) INTO null_segmento
    FROM public.products
    WHERE segmento_cliente IS NULL;

    -- Verificar nulls en tipo_producto
    SELECT COUNT(*) INTO null_tipo_prod
    FROM public.products
    WHERE tipo_producto IS NULL;

    -- Reportar resultados
    RAISE NOTICE '============================================';
    RAISE NOTICE 'VERIFICACIÓN DE MIGRACIÓN';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Total de productos: %', total_products;
    RAISE NOTICE 'Productos con tipo_institucion NULL: %', null_tipo_inst;
    RAISE NOTICE 'Productos con segmento_cliente NULL: %', null_segmento;
    RAISE NOTICE 'Productos con tipo_producto NULL: %', null_tipo_prod;
    RAISE NOTICE '============================================';

    -- Fallar si hay nulls
    IF null_tipo_inst > 0 OR null_segmento > 0 OR null_tipo_prod > 0 THEN
        RAISE EXCEPTION 'Migración incompleta: hay valores NULL en las nuevas columnas';
    ELSE
        RAISE NOTICE '✓ Migración exitosa: todos los productos tienen valores válidos';
    END IF;
END $$;

-- ====================================================================
-- PASO 8: Crear vista materializada para analytics (opcional)
-- ====================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.product_filter_stats AS
SELECT
    segmento_cliente,
    tipo_producto,
    tipo_institucion,
    COUNT(*) as total_productos,
    AVG(average_rating) as avg_rating,
    SUM(review_count) as total_reviews,
    COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count
FROM public.products
WHERE is_active = true
GROUP BY segmento_cliente, tipo_producto, tipo_institucion
ORDER BY segmento_cliente, tipo_producto, tipo_institucion;

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_filter_stats_unique
ON analytics.product_filter_stats(segmento_cliente, tipo_producto, tipo_institucion);

COMMENT ON MATERIALIZED VIEW analytics.product_filter_stats IS
    'Estadísticas pre-calculadas de productos por filtros - refrescar periódicamente';

-- ====================================================================
-- FIN DE MIGRACIÓN
-- ====================================================================

COMMIT;

-- Mensaje final
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE '✓ MIGRACIÓN 008 COMPLETADA EXITOSAMENTE';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Cambios aplicados:';
    RAISE NOTICE '  - 3 nuevas columnas agregadas';
    RAISE NOTICE '  - 7 índices creados/optimizados';
    RAISE NOTICE '  - 1 trigger de sincronización automática';
    RAISE NOTICE '  - 1 vista materializada para analytics';
    RAISE NOTICE '';
    RAISE NOTICE 'Siguiente paso: ejecutar query de prueba';
    RAISE NOTICE '============================================';
END $$;
