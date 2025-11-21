-- ============================================================================
-- TEMPLATE: Eliminar o Desactivar productos
-- ============================================================================

-- OPCIÓN RECOMENDADA: Desactivar (no eliminar) ✅
-- El producto no se mostrará en el sitio pero conservas el historial
UPDATE financial_products
SET
    is_active = false,
    updated_at = NOW()
WHERE slug = 'producto-descontinuado';

-- OPCIÓN 2: Eliminar permanentemente ⚠️ (NO RECOMENDADO)
-- Solo usa esto si estás 100% seguro
DELETE FROM financial_products
WHERE slug = 'producto-a-eliminar';

-- VERIFICAR
SELECT name, slug, is_active FROM financial_products WHERE is_active = false;
