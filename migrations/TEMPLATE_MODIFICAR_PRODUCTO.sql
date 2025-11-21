-- ============================================================================
-- TEMPLATE: Modificar producto existente
-- ============================================================================

-- EJEMPLO 1: Actualizar tasa de interés
UPDATE financial_products
SET
    main_rate_value = '70.5%',
    main_rate_numeric = 70.5,
    updated_at = NOW()
WHERE slug = 'tarjeta-nu';

-- EJEMPLO 2: Cambiar beneficios
UPDATE financial_products
SET
    benefits = '["Nuevo beneficio 1", "Nuevo beneficio 2", "Nuevo beneficio 3"]'::jsonb,
    updated_at = NOW()
WHERE slug = 'tarjeta-nu';

-- EJEMPLO 3: Actualizar rating
UPDATE financial_products
SET
    rating = 4.8,
    review_count = 15000,
    updated_at = NOW()
WHERE slug = 'tarjeta-nu';

-- EJEMPLO 4: Agregar/modificar badges
UPDATE financial_products
SET
    badges = '["Sin Anualidad", "100% Digital", "Nuevo Badge"]'::jsonb,
    updated_at = NOW()
WHERE slug = 'tarjeta-nu';

-- EJEMPLO 5: Actualizar metadata
UPDATE financial_products
SET
    meta_data = jsonb_set(
        meta_data,
        '{cashback}',
        '"hasta 8%"'
    ),
    updated_at = NOW()
WHERE slug = 'tarjeta-nu';

-- EJEMPLO 6: Desactivar un producto (no se mostrará en el sitio)
UPDATE financial_products
SET
    is_active = false,
    updated_at = NOW()
WHERE slug = 'tarjeta-vieja';

-- EJEMPLO 7: Destacar producto en home
UPDATE financial_products
SET
    is_featured = true,
    sort_order = 1,
    updated_at = NOW()
WHERE slug = 'tarjeta-nu';

-- ============================================================================
-- VERIFICAR CAMBIOS
-- ============================================================================
SELECT * FROM financial_products WHERE slug = 'tarjeta-nu';
