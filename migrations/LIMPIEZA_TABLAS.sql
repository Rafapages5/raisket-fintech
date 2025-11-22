-- ============================================================================
-- LIMPIEZA DE TABLAS SUPABASE
-- ============================================================================
-- Ejecutar en: https://supabase.com/dashboard/project/gwiyvnxlhbcipxpjhfvo/sql/new
--
-- IMPORTANTE: Lee ANALISIS_TABLAS_SUPABASE.md antes de ejecutar
-- ============================================================================

-- ============================================================================
-- PARTE 1: ELIMINAR TABLAS NO USADAS (Sin datos, sin código que las use)
-- ============================================================================

-- Eliminar tabla caracteristicas (vacía, reemplazada por meta_data JSONB)
DROP TABLE IF EXISTS caracteristicas CASCADE;

-- Eliminar tabla product_reviews (vacía, duplicada con reviews)
DROP TABLE IF EXISTS product_reviews CASCADE;

SELECT 'PARTE 1 COMPLETADA: Tablas vacías eliminadas' as status;

-- ============================================================================
-- PARTE 2: MARCAR TABLAS COMO DEPRECADAS (Conservar temporalmente)
-- ============================================================================

-- Marcar productos como deprecated
COMMENT ON TABLE productos IS '⚠️ DEPRECATED - Usar financial_products en su lugar. Sistema antiguo normalizado. Conservar 1 mes antes de eliminar.';

-- Marcar instituciones como deprecated
COMMENT ON TABLE instituciones IS '⚠️ DEPRECATED - Usar financial_products.institution (denormalizado). Conservar 1 mes antes de eliminar.';

-- Marcar categorias como deprecated
COMMENT ON TABLE categorias IS '⚠️ DEPRECATED - Usar financial_products.category ENUM. Conservar 1 mes antes de eliminar.';

-- Marcar subcategorias como deprecated
COMMENT ON TABLE subcategorias IS '⚠️ DEPRECATED - No necesario en MVP. Solo 4 categorías principales. Conservar 1 mes antes de eliminar.';

SELECT 'PARTE 2 COMPLETADA: Tablas marcadas como deprecated' as status;

-- ============================================================================
-- PARTE 3: VERIFICAR ESTRUCTURA FINAL
-- ============================================================================

-- Listar todas las tablas con sus comentarios
SELECT
    tablename,
    obj_description((schemaname || '.' || tablename)::regclass, 'pg_class') as table_comment
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================================================
-- PARTE 4: VERIFICAR TABLAS ACTIVAS DEL MVP
-- ============================================================================

-- Contar registros en tablas principales
SELECT
    'financial_products' as tabla,
    COUNT(*) as registros
FROM financial_products
UNION ALL
SELECT
    'reviews' as tabla,
    COUNT(*) as registros
FROM reviews
UNION ALL
SELECT
    'chat_messages' as tabla,
    COUNT(*) as registros
FROM chat_messages
UNION ALL
SELECT
    'productos (deprecated)' as tabla,
    COUNT(*) as registros
FROM productos;

-- ============================================================================
-- ✅ LIMPIEZA COMPLETADA
-- ============================================================================
--
-- PRÓXIMOS PASOS:
-- 1. Verificar que el sitio funciona correctamente
-- 2. Ejecutar EJECUTAR_COMPLETO.sql si aún no lo has hecho
-- 3. En 1 mes, ejecutar ELIMINAR_TABLAS_DEPRECATED.sql
--
-- ============================================================================
