-- ============================================================================
-- MIGRACIÓN COMPLETA: financial_products
-- Ejecutar en: https://supabase.com/dashboard/project/gwiyvnxlhbcipxpjhfvo/sql/new
-- ============================================================================

-- PASO 1: Crear tabla financial_products
-- ============================================================================

-- Crear tipo ENUM para categorías
DO $$ BEGIN
    CREATE TYPE product_category AS ENUM (
        'credit_card',      -- Tarjetas de crédito
        'personal_loan',    -- Préstamos personales
        'investment',       -- Inversiones (CETES, fondos, etc.)
        'banking'           -- Cuentas bancarias
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Crear tabla principal
CREATE TABLE IF NOT EXISTS financial_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Información básica
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    institution TEXT NOT NULL,
    institution_logo TEXT,
    category TEXT NOT NULL,

    -- Tasa principal (flexible según categoría)
    main_rate_label TEXT,
    main_rate_value TEXT,
    main_rate_numeric DECIMAL(10,4),

    -- Descripción y beneficios
    description TEXT,
    benefits JSONB DEFAULT '[]'::jsonb,

    -- URLs
    apply_url TEXT,
    info_url TEXT,

    -- Metadatos específicos por categoría (polimórfico)
    meta_data JSONB DEFAULT '{}'::jsonb,

    -- Badges y destacados
    badges JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_promoted BOOLEAN DEFAULT false,

    -- Rating y reviews
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,

    -- Control
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_financial_products_category ON financial_products(category);
CREATE INDEX IF NOT EXISTS idx_financial_products_institution ON financial_products(institution);
CREATE INDEX IF NOT EXISTS idx_financial_products_is_featured ON financial_products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_financial_products_is_active ON financial_products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_financial_products_rating ON financial_products(rating DESC);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_financial_products_updated_at ON financial_products;
CREATE TRIGGER update_financial_products_updated_at
    BEFORE UPDATE ON financial_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE financial_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Productos activos son públicos" ON financial_products;
CREATE POLICY "Productos activos son públicos" ON financial_products
    FOR SELECT USING (is_active = true);

-- PASO 2: Insertar datos semilla
-- ============================================================================

INSERT INTO financial_products (
    name, slug, institution, institution_logo, category,
    main_rate_label, main_rate_value, main_rate_numeric,
    description, benefits, apply_url, meta_data, badges, is_featured, rating, review_count
) VALUES

-- ==================== TARJETAS DE CRÉDITO ====================
(
    'Tarjeta de Crédito Nu',
    'tarjeta-nu',
    'Nu México',
    '/images/institutions/nu.svg',
    'credit_card',
    'CAT Promedio',
    '66.7%',
    66.7,
    'La tarjeta 100% digital sin anualidad de Nu. Controla todo desde tu app, sin filas ni sucursales.',
    '["Sin anualidad de por vida", "Aprobación en minutos", "Cashback en compras seleccionadas", "App intuitiva con control total", "Sin comisión por disposición de efectivo en cajeros Nu"]'::jsonb,
    'https://nu.com.mx/tarjeta-de-credito/',
    '{"annuity": 0, "min_income": 0, "cashback": "hasta 5%", "digital_only": true, "instant_notifications": true}'::jsonb,
    '["Sin Anualidad", "100% Digital", "Sin Buró Mínimo"]'::jsonb,
    true,
    4.7,
    12453
),

(
    'Tarjeta Oro BBVA',
    'tarjeta-oro-bbva',
    'BBVA México',
    '/images/institutions/bbva.svg',
    'credit_card',
    'CAT Promedio',
    '78.4%',
    78.4,
    'Tarjeta con programa de puntos BBVA y beneficios en viajes y entretenimiento.',
    '["Puntos BBVA en todas tus compras", "Seguro de viaje incluido", "Acceso a salas VIP en aeropuertos", "Meses sin intereses en tiendas participantes", "Asistencia en viajes 24/7"]'::jsonb,
    'https://www.bbva.mx/personas/productos/tarjetas-de-credito/tarjeta-de-credito-oro.html',
    '{"annuity": 850, "min_income": 15000, "points_program": "Puntos BBVA", "travel_insurance": true}'::jsonb,
    '["Puntos", "Seguro de Viaje"]'::jsonb,
    true,
    4.2,
    8234
),

(
    'Tarjeta Stori',
    'tarjeta-stori',
    'Stori',
    '/images/institutions/stori.svg',
    'credit_card',
    'CAT Promedio',
    '89.9%',
    89.9,
    'Tu primera tarjeta de crédito. Ideal para construir historial crediticio desde cero.',
    '["Sin historial crediticio requerido", "Aprobación en minutos", "Aumentos de línea automáticos", "Sin anualidad el primer año", "Reporta a Buró de Crédito"]'::jsonb,
    'https://www.storicard.com/',
    '{"annuity": 0, "annuity_after_first_year": 499, "min_income": 0, "builds_credit": true}'::jsonb,
    '["Sin Buró", "Primer Tarjeta", "Construye Historial"]'::jsonb,
    true,
    4.1,
    6721
),

-- ==================== INVERSIONES ====================
(
    'CetesDirecto',
    'cetes-directo',
    'Gobierno de México',
    '/images/institutions/cetes.svg',
    'investment',
    'GAT Real',
    '11.25%',
    11.25,
    'Invierte en valores gubernamentales directamente. La inversión más segura de México respaldada por el Gobierno Federal.',
    '["Inversión desde $100 MXN", "Respaldo del Gobierno Federal", "Sin comisiones", "Liquidez según el instrumento", "Exento de ISR hasta cierto monto"]'::jsonb,
    'https://www.cetesdirecto.com/',
    '{"min_investment": 100, "risk_level": "muy_bajo", "guaranteed": true, "government_backed": true, "instruments": ["CETES", "BONDES", "UDIBONOS"]}'::jsonb,
    '["Gobierno Federal", "Sin Comisiones", "Riesgo Muy Bajo"]'::jsonb,
    true,
    4.8,
    15234
),

(
    'GBM+',
    'gbm-plus',
    'GBM Grupo Bursátil Mexicano',
    '/images/institutions/gbm.svg',
    'investment',
    'Rendimiento Variable',
    'Variable',
    0,
    'Plataforma de inversión para acceder a la Bolsa Mexicana de Valores y mercados internacionales.',
    '["Acceso a BMV y mercados internacionales", "Smart Cash con rendimiento diario", "Sin monto mínimo de apertura", "ETFs y acciones fraccionadas", "App moderna y fácil de usar"]'::jsonb,
    'https://gbm.com/',
    '{"min_investment": 0, "risk_level": "variable", "smart_cash_rate": "11%", "fractional_shares": true, "markets": ["BMV", "NYSE", "NASDAQ"]}'::jsonb,
    '["Sin Mínimo", "Acciones Fraccionadas", "Smart Cash"]'::jsonb,
    true,
    4.6,
    9876
),

(
    'Hey Banco Inversión',
    'hey-banco-inversion',
    'Hey Banco (Banregio)',
    '/images/institutions/hey.svg',
    'investment',
    'GAT Real',
    '13.0%',
    13.0,
    'Pagaré bancario con rendimiento competitivo. Tu dinero seguro y generando rendimientos.',
    '["Rendimiento desde el primer peso", "Protegido por IPAB", "Liquidez diaria", "Sin comisiones", "100% digital"]'::jsonb,
    'https://www.heybanco.com/inversiones',
    '{"min_investment": 1, "risk_level": "bajo", "ipab_protected": true, "daily_liquidity": true}'::jsonb,
    '["IPAB", "Liquidez Diaria", "Digital"]'::jsonb,
    true,
    4.5,
    5432
),

-- ==================== PRÉSTAMOS PERSONALES ====================
(
    'Préstamo Yotepresto',
    'prestamo-yotepresto',
    'Yotepresto',
    '/images/institutions/yotepresto.svg',
    'personal_loan',
    'CAT Promedio',
    '45.2%',
    45.2,
    'Préstamos entre personas (P2P). Tasas competitivas conectando directamente con inversionistas.',
    '["Tasas desde 8.9% anual", "Montos de $10,000 a $300,000", "Plazos de 6 a 36 meses", "Sin penalización por pago anticipado", "Proceso 100% en línea"]'::jsonb,
    'https://www.yotepresto.com/',
    '{"min_amount": 10000, "max_amount": 300000, "min_term_months": 6, "max_term_months": 36, "min_rate": 8.9, "p2p_lending": true}'::jsonb,
    '["P2P", "Sin Penalización", "Tasas Bajas"]'::jsonb,
    true,
    4.3,
    3456
),

(
    'Préstamo Kueski',
    'prestamo-kueski',
    'Kueski',
    '/images/institutions/kueski.svg',
    'personal_loan',
    'CAT Promedio',
    '395%',
    395,
    'Préstamos rápidos de nómina. Dinero en minutos para emergencias.',
    '["Aprobación en minutos", "Dinero el mismo día", "Sin aval ni garantía", "Mejora tu línea con buen comportamiento", "Proceso 100% digital"]'::jsonb,
    'https://kueski.com/',
    '{"min_amount": 1000, "max_amount": 20000, "min_term_weeks": 2, "max_term_weeks": 8, "instant_approval": true}'::jsonb,
    '["Rápido", "Sin Aval", "Emergencias"]'::jsonb,
    false,
    3.8,
    8901
),

(
    'Crédito Personal Banorte',
    'credito-personal-banorte',
    'Banorte',
    '/images/institutions/banorte.svg',
    'personal_loan',
    'CAT Promedio',
    '32.5%',
    32.5,
    'Crédito personal de uno de los bancos más grandes de México con tasas competitivas.',
    '["Tasas preferenciales para clientes Banorte", "Montos hasta $2,000,000", "Plazos hasta 60 meses", "Contratación en sucursal o digital", "Seguro de vida incluido"]'::jsonb,
    'https://www.banorte.com/personas/creditos/credito-personal',
    '{"min_amount": 20000, "max_amount": 2000000, "min_term_months": 12, "max_term_months": 60, "life_insurance": true}'::jsonb,
    '["Banco Grande", "Seguro Incluido", "Altos Montos"]'::jsonb,
    true,
    4.0,
    4567
),

-- ==================== CUENTAS BANCARIAS ====================
(
    'Cuenta Hey',
    'cuenta-hey',
    'Hey Banco (Banregio)',
    '/images/institutions/hey.svg',
    'banking',
    'Rendimiento',
    '13% GAT',
    13,
    'Cuenta digital sin comisiones con rendimiento en tu saldo. La cuenta más completa de México.',
    '["Sin comisiones de ningún tipo", "Rendimiento desde el primer peso", "Tarjeta de débito sin costo", "Retiros gratis en cualquier cajero", "Transferencias ilimitadas"]'::jsonb,
    'https://www.heybanco.com/',
    '{"monthly_fee": 0, "min_balance": 0, "atm_withdrawals": "ilimitados", "yield_rate": 13, "debit_card": "gratis"}'::jsonb,
    '["Sin Comisiones", "Rendimiento", "Tarjeta Gratis"]'::jsonb,
    true,
    4.7,
    11234
),

(
    'Cuenta Nu',
    'cuenta-nu',
    'Nu México',
    '/images/institutions/nu.svg',
    'banking',
    'Rendimiento',
    '15% anual',
    15,
    'La cuenta digital de Nu. Tu dinero siempre disponible y generando rendimientos.',
    '["Sin comisiones", "Rendimiento del 15% anual", "Cajita de ahorro con metas", "Transferencias SPEI ilimitadas", "App intuitiva"]'::jsonb,
    'https://nu.com.mx/cuenta/',
    '{"monthly_fee": 0, "min_balance": 0, "yield_rate": 15, "savings_goals": true}'::jsonb,
    '["Sin Comisiones", "Alto Rendimiento", "Digital"]'::jsonb,
    true,
    4.8,
    14567
),

(
    'Cuenta Openbank',
    'cuenta-openbank',
    'Openbank (Santander)',
    '/images/institutions/openbank.svg',
    'banking',
    'Rendimiento',
    '10% anual',
    10,
    'Banco 100% digital respaldado por Santander. Sin filas, sin sucursales.',
    '["Respaldo de Grupo Santander", "Sin comisiones por manejo de cuenta", "Tarjeta de débito sin costo", "App moderna y segura", "Atención 24/7"]'::jsonb,
    'https://www.openbank.mx/',
    '{"monthly_fee": 0, "min_balance": 0, "yield_rate": 10, "backed_by": "Santander"}'::jsonb,
    '["Santander", "Sin Comisiones", "Digital"]'::jsonb,
    false,
    4.4,
    3210
)

ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    institution = EXCLUDED.institution,
    main_rate_value = EXCLUDED.main_rate_value,
    main_rate_numeric = EXCLUDED.main_rate_numeric,
    description = EXCLUDED.description,
    benefits = EXCLUDED.benefits,
    meta_data = EXCLUDED.meta_data,
    badges = EXCLUDED.badges,
    updated_at = NOW();

-- ============================================================================
-- ✅ MIGRACIÓN COMPLETADA
-- ============================================================================
-- Verifica los datos con: SELECT * FROM financial_products;
