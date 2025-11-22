-- ====================================================================
-- TEST QUERIES: Para tabla PRODUCTOS (en español)
-- ====================================================================

-- 1. Ver todas las columnas de productos
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'productos'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Ver distribución de productos por filtros
SELECT
    segmento_cliente,
    tipo_producto,
    tipo_institucion,
    COUNT(*) as total
FROM public.productos
GROUP BY segmento_cliente, tipo_producto, tipo_institucion
ORDER BY segmento_cliente, tipo_producto, tipo_institucion;

-- 3. QUERY PRINCIPAL: Filtrar productos de Crédito para Personas de Bancos
SELECT
    id,
    nombre,
    proveedor,
    categoria,
    tipo_producto,
    segmento_cliente,
    tipo_institucion,
    descripcion
FROM public.productos
WHERE
    segmento_cliente = 'Personas'
    AND tipo_producto = 'Credito'
    AND tipo_institucion = 'Bancos'
ORDER BY
    created_at DESC
LIMIT 20;

-- 4. Ver todos los productos con los nuevos campos
SELECT
    id,
    nombre,
    proveedor,
    segmento,
    categoria,
    -- Nuevos campos
    segmento_cliente,
    tipo_producto,
    tipo_institucion
FROM public.productos
LIMIT 10;

-- 5. Verificar que no hay NULLs
SELECT
    COUNT(*) as total,
    COUNT(tipo_institucion) as con_tipo_inst,
    COUNT(segmento_cliente) as con_segmento,
    COUNT(tipo_producto) as con_tipo_prod
FROM public.productos;

-- 6. Ver estadísticas por tipo
SELECT
    'Por Institución' as tipo,
    tipo_institucion as valor,
    COUNT(*) as cantidad
FROM public.productos
GROUP BY tipo_institucion

UNION ALL

SELECT
    'Por Producto' as tipo,
    tipo_producto as valor,
    COUNT(*) as cantidad
FROM public.productos
GROUP BY tipo_producto

UNION ALL

SELECT
    'Por Segmento' as tipo,
    segmento_cliente as valor,
    COUNT(*) as cantidad
FROM public.productos
GROUP BY segmento_cliente

ORDER BY tipo, cantidad DESC;

-- 7. Búsqueda con filtros múltiples
SELECT
    id,
    nombre,
    proveedor,
    tipo_producto,
    tipo_institucion,
    descripcion
FROM public.productos
WHERE
    segmento_cliente = 'Personas'
    AND tipo_producto = 'Credito'
    AND tipo_institucion IN ('Bancos', 'Fintech')
    AND nombre ILIKE '%tarjeta%'
LIMIT 10;
