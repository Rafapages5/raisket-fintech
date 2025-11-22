-- ====================================================================
-- TEST QUERIES: Migración 008 - Optimización de Filtros
-- ====================================================================
-- Ejecuta estas queries DESPUÉS de aplicar la migración para verificar
-- que todo funciona correctamente
-- ====================================================================

-- ====================================================================
-- 1. VERIFICAR DATOS MIGRADOS
-- ====================================================================

-- Ver distribución de productos por filtros
SELECT
    segmento_cliente,
    tipo_producto,
    tipo_institucion,
    COUNT(*) as total,
    COUNT(CASE WHEN is_active = true THEN 1 END) as activos
FROM public.products
GROUP BY segmento_cliente, tipo_producto, tipo_institucion
ORDER BY segmento_cliente, tipo_producto, tipo_institucion;

-- ====================================================================
-- 2. QUERY BÁSICA CON FILTROS (tu caso de uso principal)
-- ====================================================================

-- Obtener productos de Crédito para Personas de Bancos
SELECT
    id,
    name,
    provider,
    category,
    tipo_producto,
    segmento_cliente,
    tipo_institucion,
    interest_rate,
    annual_fee,
    average_rating,
    review_count
FROM public.products
WHERE
    segmento_cliente = 'Personas'
    AND tipo_producto = 'Credito'
    AND tipo_institucion = 'Bancos'
    AND is_active = true
ORDER BY
    is_featured DESC,
    average_rating DESC,
    review_count DESC
LIMIT 20;

-- ====================================================================
-- 3. QUERY CON TODOS LOS FILTROS OPCIONALES
-- ====================================================================

-- Simulación de búsqueda con parámetros del usuario
-- Reemplaza los valores según necesites
SELECT
    id,
    name,
    provider,
    tagline,
    description,
    image_url,
    tipo_producto,
    segmento_cliente,
    tipo_institucion,
    interest_rate,
    fees,
    min_income,
    average_rating,
    review_count,
    features,
    benefits
FROM public.products
WHERE
    is_active = true
    AND (segmento_cliente = 'Personas')                     -- Filtro: tipo de cliente
    AND (tipo_producto = 'Credito')                         -- Filtro: tipo de producto
    AND (tipo_institucion = 'Bancos')                       -- Filtro: tipo de institución
    AND (min_income IS NULL OR min_income <= 25000)         -- Filtro: ingreso mínimo requerido
    AND (min_credit_score IS NULL OR min_credit_score <= 680) -- Filtro: score mínimo
ORDER BY
    is_featured DESC,
    (average_rating * review_count) DESC,  -- Ordenar por popularidad
    name ASC
LIMIT 50;

-- ====================================================================
-- 4. BÚSQUEDA DE TEXTO CON FILTROS
-- ====================================================================

-- Buscar productos por palabra clave + filtros
SELECT
    id,
    name,
    provider,
    tipo_producto,
    tipo_institucion,
    average_rating,
    SIMILARITY(name, 'tarjeta oro') as name_relevance,
    SIMILARITY(description, 'tarjeta oro') as desc_relevance
FROM public.products
WHERE
    segmento_cliente = 'Personas'
    AND tipo_producto = 'Credito'
    AND (
        name ILIKE '%tarjeta%'
        OR description ILIKE '%tarjeta%'
    )
    AND is_active = true
ORDER BY
    name_relevance DESC,
    desc_relevance DESC,
    average_rating DESC
LIMIT 10;

-- ====================================================================
-- 5. ANÁLISIS DE PERFORMANCE DE ÍNDICES
-- ====================================================================

-- Verificar que el índice compuesto se está usando
EXPLAIN ANALYZE
SELECT id, name, provider, average_rating
FROM public.products
WHERE
    segmento_cliente = 'Personas'
    AND tipo_producto = 'Credito'
    AND tipo_institucion = 'Bancos'
    AND is_active = true
LIMIT 20;

-- ====================================================================
-- 6. QUERY PARA PÁGINA DE CATEGORÍAS
-- ====================================================================

-- Ejemplo: Página de "Créditos para Personas"
SELECT
    id,
    name,
    provider,
    tagline,
    description,
    image_url,
    interest_rate,
    fees,
    annual_fee,
    average_rating,
    review_count,
    features,
    benefits,
    tipo_institucion,
    (average_rating * review_count) as popularity_score
FROM public.products
WHERE
    segmento_cliente = 'Personas'
    AND tipo_producto = 'Credito'
    AND is_active = true
ORDER BY
    is_featured DESC,
    popularity_score DESC,
    name ASC
LIMIT 50 OFFSET 0;  -- Para paginación: cambiar OFFSET a 50, 100, etc.

-- ====================================================================
-- 7. QUERY PARA COMPARADOR DE PRODUCTOS
-- ====================================================================

-- Obtener productos similares para comparación
SELECT
    id,
    name,
    provider,
    tipo_institucion,
    interest_rate,
    interest_rate_min,
    interest_rate_max,
    annual_fee,
    min_income,
    min_credit_score,
    average_rating,
    review_count,
    features,
    benefits,
    fees
FROM public.products
WHERE
    segmento_cliente = 'Personas'
    AND tipo_producto = 'Credito'
    AND category = 'credit_card'  -- Comparar solo tarjetas
    AND is_active = true
ORDER BY
    annual_fee ASC NULLS LAST,
    interest_rate_min ASC NULLS LAST
LIMIT 10;

-- ====================================================================
-- 8. ESTADÍSTICAS DE PRODUCTOS (desde vista materializada)
-- ====================================================================

-- Ver estadísticas pre-calculadas
SELECT
    segmento_cliente,
    tipo_producto,
    tipo_institucion,
    total_productos,
    ROUND(avg_rating, 2) as rating_promedio,
    total_reviews,
    featured_count
FROM analytics.product_filter_stats
ORDER BY
    segmento_cliente,
    tipo_producto,
    total_productos DESC;

-- ====================================================================
-- 9. QUERY PARA FILTROS DINÁMICOS EN UI
-- ====================================================================

-- Obtener opciones disponibles para cada filtro
SELECT
    'segmento_cliente' as filtro_tipo,
    segmento_cliente as valor,
    COUNT(*) as cantidad
FROM public.products
WHERE is_active = true
GROUP BY segmento_cliente

UNION ALL

SELECT
    'tipo_producto' as filtro_tipo,
    tipo_producto as valor,
    COUNT(*) as cantidad
FROM public.products
WHERE is_active = true
GROUP BY tipo_producto

UNION ALL

SELECT
    'tipo_institucion' as filtro_tipo,
    tipo_institucion as valor,
    COUNT(*) as cantidad
FROM public.products
WHERE is_active = true
GROUP BY tipo_institucion

ORDER BY filtro_tipo, cantidad DESC;

-- ====================================================================
-- 10. VERIFICAR TRIGGER DE SINCRONIZACIÓN
-- ====================================================================

-- Insertar producto de prueba para verificar trigger
DO $$
DECLARE
    test_institution_id UUID;
    test_product_id TEXT := 'test-product-' || gen_random_uuid()::text;
BEGIN
    -- Obtener un institution_id existente
    SELECT id INTO test_institution_id
    FROM public.institutions
    WHERE institution_type = 'bank'
    LIMIT 1;

    -- Insertar producto de prueba
    INSERT INTO public.products (
        id,
        institution_id,
        name,
        category,
        segment,
        description,
        is_active
    ) VALUES (
        test_product_id,
        test_institution_id,
        'Producto de Prueba',
        'credit_card',
        'Personas',
        'Descripción de prueba',
        false  -- Inactivo para no afectar datos reales
    );

    -- Verificar que los campos se sincronizaron
    IF EXISTS (
        SELECT 1
        FROM public.products
        WHERE id = test_product_id
          AND tipo_institucion = 'Bancos'
          AND segmento_cliente = 'Personas'
          AND tipo_producto = 'Credito'
    ) THEN
        RAISE NOTICE '✓ Trigger funcionando correctamente';
    ELSE
        RAISE EXCEPTION '✗ Trigger NO está sincronizando correctamente';
    END IF;

    -- Limpiar producto de prueba
    DELETE FROM public.products WHERE id = test_product_id;

    RAISE NOTICE '✓ Prueba de trigger completada exitosamente';
END $$;

-- ====================================================================
-- 11. REFRESCAR VISTA MATERIALIZADA
-- ====================================================================

-- Ejecutar periódicamente (ej: cada hora) para actualizar estadísticas
REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.product_filter_stats;

-- ====================================================================
-- FIN DE QUERIES DE PRUEBA
-- ====================================================================
