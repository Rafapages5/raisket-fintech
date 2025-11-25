-- Script SQL para agregar columnas nuevas a la tabla productos
-- Ejecuta esto en tu Supabase SQL Editor

-- Agregar campos para información detallada
ALTER TABLE public.productos
ADD COLUMN IF NOT EXISTS pros text[],
ADD COLUMN IF NOT EXISTS cons text[],
ADD COLUMN IF NOT EXISTS gat_nominal text,
ADD COLUMN IF NOT EXISTS gat_real text,
ADD COLUMN IF NOT EXISTS rendimiento_anual text,
ADD COLUMN IF NOT EXISTS liquidez text,
ADD COLUMN IF NOT EXISTS monto_minimo text,
ADD COLUMN IF NOT EXISTS monto_maximo text,
ADD COLUMN IF NOT EXISTS requisitos text[],
ADD COLUMN IF NOT EXISTS proteccion text,
ADD COLUMN IF NOT EXISTS comisiones text[],
ADD COLUMN IF NOT EXISTS vigencia_inicio date,
ADD COLUMN IF NOT EXISTS vigencia_fin date,
ADD COLUMN IF NOT EXISTS terminos_condiciones_url text,
ADD COLUMN IF NOT EXISTS logo_url text;

-- Verificar las columnas añadidas
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'productos'
  AND table_schema = 'public'
ORDER BY column_name;

COMMENT ON COLUMN productos.pros IS 'Ventajas del producto financiero';
COMMENT ON COLUMN productos.cons IS 'Desventajas del producto financiero';
COMMENT ON COLUMN productos.gat_nominal IS 'GAT Nominal para productos de inversión';
COMMENT ON COLUMN productos.gat_real IS 'GAT Real para productos de inversión';
COMMENT ON COLUMN productos.rendimiento_anual IS 'Rendimiento anual del producto';
COMMENT ON COLUMN productos.liquidez IS 'Información sobre liquidez (ej: 24/7 inmediata)';
COMMENT ON COLUMN productos.monto_minimo IS 'Monto mínimo requerido';
COMMENT ON COLUMN productos.monto_maximo IS 'Monto máximo permitido';
COMMENT ON COLUMN productos.requisitos IS 'Lista de requisitos del producto';
COMMENT ON COLUMN productos.proteccion IS 'Información sobre protección (ej: IPAB)';
COMMENT ON COLUMN productos.comisiones IS 'Lista de comisiones del producto';
COMMENT ON COLUMN productos.vigencia_inicio IS 'Fecha de inicio de vigencia de la promoción';
COMMENT ON COLUMN productos.vigencia_fin IS 'Fecha de fin de vigencia de la promoción';
COMMENT ON COLUMN productos.terminos_condiciones_url IS 'URL a términos y condiciones';
COMMENT ON COLUMN productos.logo_url IS 'URL del logo del proveedor/institución';
