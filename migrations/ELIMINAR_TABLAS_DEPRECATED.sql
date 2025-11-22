-- ============================================================================
-- ELIMINAR TABLAS DEPRECADAS
-- ============================================================================
-- ⚠️ SOLO EJECUTAR DESPUÉS DE 1 MES
-- ⚠️ Verificar que todo el código usa financial_products
-- ⚠️ Hacer backup antes de ejecutar
--
-- Ejecutar en: https://supabase.com/dashboard/project/gwiyvnxlhbcipxpjhfvo/sql/new
-- ============================================================================

-- ============================================================================
-- VERIFICACIÓN PREVIA
-- ============================================================================

-- 1. Verificar que financial_products tiene datos
DO $$
DECLARE
    fp_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO fp_count FROM financial_products;

    IF fp_count < 10 THEN
        RAISE EXCEPTION 'ERROR: financial_products solo tiene % productos. Agrega más antes de eliminar tablas antiguas.', fp_count;
    END IF;

    RAISE NOTICE 'OK: financial_products tiene % productos.', fp_count;
END $$;

-- 2. Listar tablas a eliminar con su conteo
SELECT
    'productos' as tabla_a_eliminar,
    COUNT(*) as registros_que_se_perderan
FROM productos
UNION ALL
SELECT
    'instituciones' as tabla_a_eliminar,
    COUNT(*) as registros_que_se_perderan
FROM instituciones
UNION ALL
SELECT
    'categorias' as tabla_a_eliminar,
    COUNT(*) as registros_que_se_perderan
FROM categorias
UNION ALL
SELECT
    'subcategorias' as tabla_a_eliminar,
    COUNT(*) as registros_que_se_perderan
FROM subcategorias;

-- ============================================================================
-- ⚠️ PUNTO DE NO RETORNO - ELIMINAR TABLAS
-- ============================================================================
-- Descomenta las siguientes líneas SOLO si estás seguro:

-- DROP TABLE IF EXISTS productos CASCADE;
-- DROP TABLE IF EXISTS instituciones CASCADE;
-- DROP TABLE IF EXISTS categorias CASCADE;
-- DROP TABLE IF EXISTS subcategorias CASCADE;

-- SELECT '✅ Tablas deprecadas eliminadas exitosamente' as status;

-- ============================================================================
-- ALTERNATIVA SEGURA: RENOMBRAR EN LUGAR DE ELIMINAR
-- ============================================================================
-- Si prefieres renombrar en lugar de eliminar (recomendado):

ALTER TABLE IF EXISTS productos RENAME TO _backup_productos;
ALTER TABLE IF EXISTS instituciones RENAME TO _backup_instituciones;
ALTER TABLE IF EXISTS categorias RENAME TO _backup_categorias;
ALTER TABLE IF EXISTS subcategorias RENAME TO _backup_subcategorias;

SELECT '✅ Tablas renombradas con prefijo _backup_' as status;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

-- Listar solo tablas activas
SELECT
    tablename,
    obj_description((schemaname || '.' || tablename)::regclass, 'pg_class') as comment
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT LIKE '_backup_%'
ORDER BY tablename;

-- ============================================================================
-- ✅ PROCESO COMPLETADO
-- ============================================================================
-- Las tablas deprecadas han sido renombradas.
-- Puedes eliminarlas definitivamente después de 1 mes más si todo funciona bien.
--
-- Para eliminar backups:
-- DROP TABLE IF EXISTS _backup_productos CASCADE;
-- DROP TABLE IF EXISTS _backup_instituciones CASCADE;
-- DROP TABLE IF EXISTS _backup_categorias CASCADE;
-- DROP TABLE IF EXISTS _backup_subcategorias CASCADE;
-- ============================================================================
