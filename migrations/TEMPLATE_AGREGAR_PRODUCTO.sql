-- ============================================================================
-- TEMPLATE: Agregar nuevo producto a financial_products
-- ============================================================================
-- Copia este template, llena los datos y ejecuta en SQL Editor
-- https://supabase.com/dashboard/project/gwiyvnxlhbcipxpjhfvo/sql/new
-- ============================================================================

INSERT INTO financial_products (
    name,
    slug,
    institution,
    institution_logo,
    category,
    main_rate_label,
    main_rate_value,
    main_rate_numeric,
    description,
    benefits,
    apply_url,
    meta_data,
    badges,
    is_featured,
    rating,
    review_count
) VALUES (
    -- NOMBRE DEL PRODUCTO
    'Tarjeta Klar',

    -- SLUG (único, sin espacios, todo minúsculas)
    'tarjeta-klar',

    -- INSTITUCIÓN
    'Klar',

    -- LOGO (opcional, puedes dejarlo null)
    '/images/institutions/klar.svg',

    -- CATEGORÍA (elige una):
    -- 'credit_card'    = Tarjetas de Crédito
    -- 'personal_loan'  = Préstamos Personales
    -- 'investment'     = Inversiones
    -- 'banking'        = Cuentas Bancarias
    'credit_card',

    -- TASA PRINCIPAL - Etiqueta
    'CAT Promedio',

    -- TASA PRINCIPAL - Valor (texto visible)
    '55.8%',

    -- TASA PRINCIPAL - Valor numérico (para ordenar)
    55.8,

    -- DESCRIPCIÓN BREVE
    'Tarjeta de crédito 100% digital sin anualidad. Control total desde tu celular.',

    -- BENEFICIOS (array JSON)
    '["Sin anualidad de por vida", "Sin comisión por anualidad", "Cashback del 2%", "App muy fácil de usar"]'::jsonb,

    -- URL PARA SOLICITAR
    'https://www.klar.mx/tarjeta-de-credito',

    -- METADATA ESPECÍFICA (JSON)
    -- Para Tarjetas de Crédito:
    '{"annuity": 0, "min_income": 8000, "cashback": "2%", "digital_only": true}'::jsonb,

    -- Para Préstamos:
    -- '{"min_amount": 5000, "max_amount": 200000, "min_term_months": 6, "max_term_months": 36}'::jsonb,

    -- Para Inversiones:
    -- '{"min_investment": 100, "risk_level": "bajo", "ipab_protected": true}'::jsonb,

    -- Para Cuentas:
    -- '{"monthly_fee": 0, "min_balance": 0, "yield_rate": 12, "atm_withdrawals": "ilimitados"}'::jsonb,

    -- BADGES (array JSON)
    '["Sin Anualidad", "100% Digital", "Cashback"]'::jsonb,

    -- ¿Es producto destacado? (aparece en home)
    true,

    -- RATING (0.00 a 5.00)
    4.6,

    -- NÚMERO DE RESEÑAS
    2340
);

-- ============================================================================
-- ✅ PRODUCTO AGREGADO
-- ============================================================================
-- Verifica con: SELECT * FROM financial_products WHERE slug = 'tarjeta-klar';
