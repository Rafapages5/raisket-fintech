-- Migración: Crear tabla maestra financial_products (polimórfica)
-- Para MVP Raisket.mx - Comparador Fintech Mexicano

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
    name TEXT NOT NULL,                          -- Ej: "Tarjeta Nu", "CetesDirecto"
    slug TEXT UNIQUE NOT NULL,                   -- URL-friendly: "tarjeta-nu"
    institution TEXT NOT NULL,                   -- Ej: "Nu México", "Gobierno de México"
    institution_logo TEXT,                       -- URL del logo
    category TEXT NOT NULL,                      -- 'credit_card', 'personal_loan', 'investment', 'banking'

    -- Tasa principal (flexible según categoría)
    main_rate_label TEXT,                        -- "CAT", "GAT", "Tasa Anual", "Rendimiento"
    main_rate_value TEXT,                        -- "0%", "15.5%", "11.25%"
    main_rate_numeric DECIMAL(10,4),             -- Para ordenamiento: 0, 15.5, 11.25

    -- Descripción y beneficios
    description TEXT,                            -- Descripción corta
    benefits JSONB DEFAULT '[]'::jsonb,          -- Array de strings con bullets

    -- URLs
    apply_url TEXT,                              -- Link de afiliado/solicitud
    info_url TEXT,                               -- Link a más información

    -- Metadatos específicos por categoría (polimórfico)
    meta_data JSONB DEFAULT '{}'::jsonb,
    -- Ejemplos:
    -- Tarjetas: { "annuity": 0, "min_income": 0, "cashback": "2%", "points_program": "Nu Rewards" }
    -- Préstamos: { "min_amount": 5000, "max_amount": 300000, "min_term": 6, "max_term": 48 }
    -- Inversiones: { "min_investment": 100, "risk_level": "bajo", "term_days": 28, "guaranteed": true }
    -- Bancos: { "monthly_fee": 0, "min_balance": 0, "atm_withdrawals": "ilimitados" }

    -- Badges y destacados
    badges JSONB DEFAULT '[]'::jsonb,            -- ["Sin Anualidad", "Digital", "Alto Riesgo"]
    is_featured BOOLEAN DEFAULT false,           -- Mostrar en página principal
    is_promoted BOOLEAN DEFAULT false,           -- Producto patrocinado

    -- Rating y reviews
    rating DECIMAL(3,2) DEFAULT 0,               -- 0.00 - 5.00
    review_count INTEGER DEFAULT 0,

    -- Control
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_financial_products_category ON financial_products(category);
CREATE INDEX IF NOT EXISTS idx_financial_products_institution ON financial_products(institution);
CREATE INDEX IF NOT EXISTS idx_financial_products_is_featured ON financial_products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_financial_products_is_active ON financial_products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_financial_products_rating ON financial_products(rating DESC);

-- Trigger para actualizar updated_at
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

-- Habilitar RLS (Row Level Security)
ALTER TABLE financial_products ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública (solo productos activos)
CREATE POLICY "Productos activos son públicos" ON financial_products
    FOR SELECT USING (is_active = true);

-- Comentarios de documentación
COMMENT ON TABLE financial_products IS 'Tabla maestra de productos financieros para comparador Raisket.mx';
COMMENT ON COLUMN financial_products.category IS 'credit_card | personal_loan | investment | banking';
COMMENT ON COLUMN financial_products.meta_data IS 'Datos específicos por categoría en formato JSON';
COMMENT ON COLUMN financial_products.badges IS 'Array de badges: Sin Anualidad, Digital, Alto Riesgo, etc.';
