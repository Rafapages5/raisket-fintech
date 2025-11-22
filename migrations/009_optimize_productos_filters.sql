-- ====================================================================
-- MIGRATION 009: Optimizar Filtros de Productos (para tabla PRODUCTOS)
-- ====================================================================
-- Descripción: Mejora el performance de filtros en public.productos
--              (versión para tabla en español)
-- Autor: Claude Code
-- Fecha: 2025-11-18
-- Estimado: ~30 segundos de ejecución
-- ====================================================================

BEGIN;

-- ====================================================================
-- PASO 0: Verificar que la tabla existe
-- ====================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'productos'
    ) THEN
        RAISE EXCEPTION 'La tabla public.productos NO EXISTE. Verifica el nombre de tu tabla.';
    END IF;

    RAISE NOTICE '✓ Tabla public.productos encontrada';
END $$;

-- ====================================================================
-- PASO 1: Verificar columnas existentes necesarias
-- ====================================================================

DO $$
DECLARE
    tiene_categoria BOOLEAN;
    tiene_segmento BOOLEAN;
    tiene_institucion_id BOOLEAN;
BEGIN
    -- Verificar columnas necesarias
    SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'productos'
          AND column_name IN ('categoria', 'category')
    ) INTO tiene_categoria;

    SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'productos'
          AND column_name IN ('segmento', 'segment')
    ) INTO tiene_segmento;

    SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'productos'
          AND column_name IN ('institucion_id', 'institution_id', 'proveedor')
    ) INTO tiene_institucion_id;

    RAISE NOTICE '============================================';
    RAISE NOTICE 'VERIFICACIÓN DE COLUMNAS EXISTENTES';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Tiene categoría: %', tiene_categoria;
    RAISE NOTICE 'Tiene segmento: %', tiene_segmento;
    RAISE NOTICE 'Tiene institución: %', tiene_institucion_id;
    RAISE NOTICE '============================================';
END $$;

-- ====================================================================
-- PASO 2: Agregar nuevas columnas
-- ====================================================================

-- Columna para tipo de institución
ALTER TABLE public.productos
ADD COLUMN IF NOT EXISTS tipo_institucion TEXT;

-- Columna para segmento de cliente
ALTER TABLE public.productos
ADD COLUMN IF NOT EXISTS segmento_cliente TEXT;

-- Columna para tipo de producto agrupado
ALTER TABLE public.productos
ADD COLUMN IF NOT EXISTS tipo_producto TEXT;

-- ====================================================================
-- PASO 3: Migrar datos existentes
-- ====================================================================

-- Actualizar tipo_institucion desde proveedor
-- (Asumimos que tienes un campo 'proveedor' o similar)
UPDATE public.productos
SET tipo_institucion = CASE
    WHEN LOWER(proveedor) LIKE '%bbva%' THEN 'Bancos'
    WHEN LOWER(proveedor) LIKE '%banamex%' THEN 'Bancos'
    WHEN LOWER(proveedor) LIKE '%santander%' THEN 'Bancos'
    WHEN LOWER(proveedor) LIKE '%scotiabank%' THEN 'Bancos'
    WHEN LOWER(proveedor) LIKE '%hsbc%' THEN 'Bancos'
    WHEN LOWER(proveedor) LIKE '%banorte%' THEN 'Bancos'
    WHEN LOWER(proveedor) LIKE '%citibanamex%' THEN 'Bancos'
    WHEN LOWER(proveedor) LIKE '%nu%' THEN 'Fintech'
    WHEN LOWER(proveedor) LIKE '%kueski%' THEN 'Fintech'
    WHEN LOWER(proveedor) LIKE '%konfio%' THEN 'Fintech'
    WHEN LOWER(proveedor) LIKE '%klar%' THEN 'Fintech'
    WHEN LOWER(proveedor) LIKE '%mercado%pago%' THEN 'Fintech'
    WHEN LOWER(proveedor) LIKE '%rappi%' THEN 'Fintech'
    WHEN LOWER(proveedor) LIKE '%stori%' THEN 'Fintech'
    WHEN LOWER(proveedor) LIKE '%fondeadora%' THEN 'Fintech'
    ELSE 'Otro'
END
WHERE tipo_institucion IS NULL
  AND proveedor IS NOT NULL;

-- Si NO tienes campo 'proveedor', usar un valor por defecto
UPDATE public.productos
SET tipo_institucion = 'Otro'
WHERE tipo_institucion IS NULL;

-- Actualizar segmento_cliente desde segmento
UPDATE public.productos
SET segmento_cliente = CASE
    WHEN segmento = 'Personas' THEN 'Personas'
    WHEN segmento = 'Empresas' THEN 'Empresas'
    WHEN segmento ILIKE '%persona%' THEN 'Personas'
    WHEN segmento ILIKE '%empresa%' THEN 'Empresas'
    WHEN segmento ILIKE '%pyme%' THEN 'Empresas'
    ELSE 'Personas'  -- Default a Personas si no está claro
END
WHERE segmento_cliente IS NULL
  AND segmento IS NOT NULL;

-- Si NO tienes campo 'segmento', asumir 'Personas'
UPDATE public.productos
SET segmento_cliente = 'Personas'
WHERE segmento_cliente IS NULL;

-- Actualizar tipo_producto desde categoria
UPDATE public.productos
SET tipo_producto = CASE
    WHEN categoria ILIKE '%credit%' THEN 'Credito'
    WHEN categoria ILIKE '%tarjeta%' THEN 'Credito'
    WHEN categoria ILIKE '%prestamo%' THEN 'Credito'
    WHEN categoria ILIKE '%hipoteca%' THEN 'Credito'
    WHEN categoria ILIKE '%auto%' THEN 'Credito'
    WHEN categoria ILIKE '%financiamiento%' THEN 'Credito'
    WHEN categoria ILIKE '%inversion%' THEN 'Inversion'
    WHEN categoria ILIKE '%ahorro%' THEN 'Inversion'
    WHEN categoria ILIKE '%cetes%' THEN 'Inversion'
    WHEN categoria ILIKE '%seguro%' THEN 'Seguros'
    WHEN categoria ILIKE '%cuenta%' THEN 'Cuentas'
    ELSE 'Otro'
END
WHERE tipo_producto IS NULL
  AND categoria IS NOT NULL;

-- Si NO tienes campo 'categoria', asumir 'Credito'
UPDATE public.productos
SET tipo_producto = 'Credito'
WHERE tipo_producto IS NULL;

-- ====================================================================
-- PASO 4: Agregar constraints
-- ====================================================================

-- Hacer campos NOT NULL
ALTER TABLE public.productos
ALTER COLUMN tipo_institucion SET NOT NULL;

ALTER TABLE public.productos
ALTER COLUMN segmento_cliente SET NOT NULL;

ALTER TABLE public.productos
ALTER COLUMN tipo_producto SET NOT NULL;

-- Validar valores permitidos
ALTER TABLE public.productos
ADD CONSTRAINT productos_tipo_institucion_check
CHECK (tipo_institucion IN ('Bancos', 'Fintech', 'Cooperativas', 'Aseguradoras', 'Otro'));

ALTER TABLE public.productos
ADD CONSTRAINT productos_segmento_cliente_check
CHECK (segmento_cliente IN ('Personas', 'Empresas'));

ALTER TABLE public.productos
ADD CONSTRAINT productos_tipo_producto_check
CHECK (tipo_producto IN ('Credito', 'Inversion', 'Seguros', 'Cuentas', 'Otro'));

-- ====================================================================
-- PASO 5: Crear índices optimizados
-- ====================================================================

-- Índice compuesto para filtros múltiples
CREATE INDEX IF NOT EXISTS idx_productos_filters_combo
ON public.productos(segmento_cliente, tipo_producto, tipo_institucion);

-- Índices individuales
CREATE INDEX IF NOT EXISTS idx_productos_tipo_producto
ON public.productos(tipo_producto);

CREATE INDEX IF NOT EXISTS idx_productos_tipo_institucion
ON public.productos(tipo_institucion);

CREATE INDEX IF NOT EXISTS idx_productos_segmento_cliente
ON public.productos(segmento_cliente);

-- Índice para búsqueda de texto (si tienes extensión pg_trgm)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
        CREATE INDEX IF NOT EXISTS idx_productos_nombre_trgm
        ON public.productos USING gin(nombre gin_trgm_ops);

        RAISE NOTICE '✓ Índice trigram creado para búsqueda de texto';
    ELSE
        RAISE NOTICE '⚠ Extensión pg_trgm no disponible - omitiendo índice de búsqueda';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠ No se pudo crear índice trigram: %', SQLERRM;
END $$;

-- ====================================================================
-- PASO 6: Crear trigger para sincronización automática
-- ====================================================================

-- Función para mantener campos sincronizados
CREATE OR REPLACE FUNCTION sync_producto_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Sincronizar tipo_institucion desde proveedor
    IF NEW.proveedor IS NOT NULL THEN
        NEW.tipo_institucion := CASE
            WHEN LOWER(NEW.proveedor) LIKE '%bbva%' THEN 'Bancos'
            WHEN LOWER(NEW.proveedor) LIKE '%banamex%' THEN 'Bancos'
            WHEN LOWER(NEW.proveedor) LIKE '%santander%' THEN 'Bancos'
            WHEN LOWER(NEW.proveedor) LIKE '%nu%' THEN 'Fintech'
            WHEN LOWER(NEW.proveedor) LIKE '%kueski%' THEN 'Fintech'
            WHEN LOWER(NEW.proveedor) LIKE '%konfio%' THEN 'Fintech'
            ELSE 'Otro'
        END;
    END IF;

    -- Sincronizar segmento_cliente
    IF NEW.segmento IS NOT NULL THEN
        NEW.segmento_cliente := CASE
            WHEN NEW.segmento ILIKE '%persona%' THEN 'Personas'
            WHEN NEW.segmento ILIKE '%empresa%' THEN 'Empresas'
            ELSE 'Personas'
        END;
    END IF;

    -- Sincronizar tipo_producto
    IF NEW.categoria IS NOT NULL THEN
        NEW.tipo_producto := CASE
            WHEN NEW.categoria ILIKE '%credit%' OR NEW.categoria ILIKE '%tarjeta%' THEN 'Credito'
            WHEN NEW.categoria ILIKE '%inversion%' OR NEW.categoria ILIKE '%ahorro%' THEN 'Inversion'
            WHEN NEW.categoria ILIKE '%seguro%' THEN 'Seguros'
            ELSE 'Otro'
        END;
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Si hay error, no bloquear la inserción
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger (solo si las columnas existen)
DO $$
BEGIN
    DROP TRIGGER IF EXISTS trigger_sync_productos ON public.productos;

    CREATE TRIGGER trigger_sync_productos
    BEFORE INSERT OR UPDATE ON public.productos
    FOR EACH ROW
    EXECUTE FUNCTION sync_producto_fields();

    RAISE NOTICE '✓ Trigger de sincronización creado';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠ Trigger no creado: %', SQLERRM;
END $$;

-- ====================================================================
-- PASO 7: Agregar comentarios
-- ====================================================================

COMMENT ON COLUMN public.productos.tipo_institucion IS
    'Tipo de institución financiera (Bancos, Fintech, Cooperativas, Aseguradoras, Otro)';

COMMENT ON COLUMN public.productos.segmento_cliente IS
    'Segmento de cliente (Personas, Empresas)';

COMMENT ON COLUMN public.productos.tipo_producto IS
    'Tipo de producto agrupado (Credito, Inversion, Seguros, Cuentas, Otro)';

-- ====================================================================
-- PASO 8: Verificación final
-- ====================================================================

DO $$
DECLARE
    total_productos INTEGER;
    null_tipo_inst INTEGER;
    null_segmento INTEGER;
    null_tipo_prod INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_productos FROM public.productos;
    SELECT COUNT(*) INTO null_tipo_inst FROM public.productos WHERE tipo_institucion IS NULL;
    SELECT COUNT(*) INTO null_segmento FROM public.productos WHERE segmento_cliente IS NULL;
    SELECT COUNT(*) INTO null_tipo_prod FROM public.productos WHERE tipo_producto IS NULL;

    RAISE NOTICE '============================================';
    RAISE NOTICE 'VERIFICACIÓN FINAL';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Total productos: %', total_productos;
    RAISE NOTICE 'Con tipo_institucion NULL: %', null_tipo_inst;
    RAISE NOTICE 'Con segmento_cliente NULL: %', null_segmento;
    RAISE NOTICE 'Con tipo_producto NULL: %', null_tipo_prod;
    RAISE NOTICE '============================================';

    IF null_tipo_inst > 0 OR null_segmento > 0 OR null_tipo_prod > 0 THEN
        RAISE EXCEPTION 'Hay valores NULL - revisa los datos';
    ELSE
        RAISE NOTICE '✓ MIGRACIÓN COMPLETADA EXITOSAMENTE';
    END IF;
END $$;

COMMIT;

-- Mensaje final
SELECT
    'Migración 009 completada' as status,
    COUNT(*) as total_productos,
    COUNT(DISTINCT tipo_institucion) as tipos_institucion,
    COUNT(DISTINCT tipo_producto) as tipos_producto,
    COUNT(DISTINCT segmento_cliente) as segmentos
FROM public.productos;
