-- Script SQL COMPLETO para agregar todas las columnas nuevas a la tabla productos
-- Ejecuta esto en tu Supabase SQL Editor

-- Agregar campos COMUNES a todos los productos
ALTER TABLE public.productos
ADD COLUMN IF NOT EXISTS pros text[],
ADD COLUMN IF NOT EXISTS cons text[],
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS vigencia_inicio date,
ADD COLUMN IF NOT EXISTS vigencia_fin date,
ADD COLUMN IF NOT EXISTS terminos_condiciones_url text;

-- Agregar campos ESPECÍFICOS DE INVERSIÓN
ALTER TABLE public.productos
ADD COLUMN IF NOT EXISTS gat_nominal text,
ADD COLUMN IF NOT EXISTS gat_real text,
ADD COLUMN IF NOT EXISTS rendimiento_anual text,
ADD COLUMN IF NOT EXISTS liquidez text,
ADD COLUMN IF NOT EXISTS monto_minimo text,
ADD COLUMN IF NOT EXISTS monto_maximo text,
ADD COLUMN IF NOT EXISTS requisitos text[],
ADD COLUMN IF NOT EXISTS proteccion text,
ADD COLUMN IF NOT EXISTS comisiones text[];

-- Agregar campos ESPECÍFICOS DE CRÉDITO
ALTER TABLE public.productos
ADD COLUMN IF NOT EXISTS cat text,
ADD COLUMN IF NOT EXISTS pago_mensual_ejemplo text,
ADD COLUMN IF NOT EXISTS pago_mensual_nota text,
ADD COLUMN IF NOT EXISTS aprobacion text,
ADD COLUMN IF NOT EXISTS disposicion text;

-- Agregar campos ESPECÍFICOS DE FINANCIAMIENTO
ALTER TABLE public.productos
ADD COLUMN IF NOT EXISTS ejemplo_financiamiento text,
ADD COLUMN IF NOT EXISTS tiendas_participantes text[],
ADD COLUMN IF NOT EXISTS total_tiendas integer,
ADD COLUMN IF NOT EXISTS costos_adicionales text[],
ADD COLUMN IF NOT EXISTS ideal_para text[],
ADD COLUMN IF NOT EXISTS tips_raisket jsonb,
ADD COLUMN IF NOT EXISTS contacto jsonb;

-- Verificar las columnas añadidas
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'productos'
  AND table_schema = 'public'
ORDER BY column_name;

-- Agregar comentarios descriptivos
COMMENT ON COLUMN productos.pros IS 'Ventajas del producto financiero';
COMMENT ON COLUMN productos.cons IS 'Desventajas del producto financiero';
COMMENT ON COLUMN productos.logo_url IS 'URL del logo del proveedor/institución';
COMMENT ON COLUMN productos.vigencia_inicio IS 'Fecha de inicio de vigencia';
COMMENT ON COLUMN productos.vigencia_fin IS 'Fecha de fin de vigencia';
COMMENT ON COLUMN productos.terminos_condiciones_url IS 'URL a términos y condiciones';

-- Inversión
COMMENT ON COLUMN productos.gat_nominal IS 'GAT Nominal para productos de inversión';
COMMENT ON COLUMN productos.gat_real IS 'GAT Real para productos de inversión';
COMMENT ON COLUMN productos.rendimiento_anual IS 'Rendimiento anual del producto';
COMMENT ON COLUMN productos.liquidez IS 'Información sobre liquidez (ej: 24/7 inmediata)';
COMMENT ON COLUMN productos.monto_minimo IS 'Monto mínimo requerido';
COMMENT ON COLUMN productos.monto_maximo IS 'Monto máximo permitido';
COMMENT ON COLUMN productos.requisitos IS 'Lista de requisitos del producto';
COMMENT ON COLUMN productos.proteccion IS 'Información sobre protección (ej: IPAB)';
COMMENT ON COLUMN productos.comisiones IS 'Lista de comisiones del producto';

-- Crédito
COMMENT ON COLUMN productos.cat IS 'CAT (Costo Anual Total) promedio';
COMMENT ON COLUMN productos.pago_mensual_ejemplo IS 'Ejemplo de pago mensual';
COMMENT ON COLUMN productos.pago_mensual_nota IS 'Nota explicativa del ejemplo de pago';
COMMENT ON COLUMN productos.aprobacion IS 'Tiempo de aprobación (ej: En 24 hrs)';
COMMENT ON COLUMN productos.disposicion IS 'Método de disposición (ej: Transferencia inmediata)';

-- Financiamiento
COMMENT ON COLUMN productos.ejemplo_financiamiento IS 'Ejemplo de financiamiento con montos y plazos';
COMMENT ON COLUMN productos.tiendas_participantes IS 'Lista de tiendas donde se puede usar';
COMMENT ON COLUMN productos.total_tiendas IS 'Número total de tiendas participantes';
COMMENT ON COLUMN productos.costos_adicionales IS 'Lista de costos adicionales (interés moratorio, etc.)';
COMMENT ON COLUMN productos.ideal_para IS 'Lista de casos de uso ideales';
COMMENT ON COLUMN productos.tips_raisket IS 'Tips de Raisket en formato JSON: [{"tipo": "positivo|neutro|negativo", "texto": "..."}]';
COMMENT ON COLUMN productos.contacto IS 'Información de contacto en formato JSON: {"telefono": "...", "email": "...", "horario": "..."}';

-- Ejemplo de actualización de un producto de INVERSIÓN (Nu Cajita Turbo)
-- Descomenta y ajusta según tus datos reales
/*
UPDATE productos SET
  pros = ARRAY['Tasa muy competitiva del 15% anual', 'Liquidez inmediata 24/7', 'Sin comisiones de ningún tipo'],
  cons = ARRAY['Límite máximo de $25,000', 'Requiere usar tarjeta Nu al menos 1 vez al mes'],
  rendimiento_anual = '15%',
  gat_nominal = '16.18%',
  gat_real = '11.97%',
  liquidez = '24/7 inmediata',
  monto_minimo = '$0.01',
  monto_maximo = '$25,000',
  requisitos = ARRAY['1 compra al mes con tarjeta Nu'],
  proteccion = 'Fondo IPAB hasta 25K UDIs',
  comisiones = ARRAY['$0 en apertura', '$0 en mantenimiento', '$0 en retiros'],
  vigencia_inicio = '2025-10-09',
  vigencia_fin = '2025-11-19',
  logo_url = 'https://nu.com.mx/images/nu-logo.svg',
  terminos_condiciones_url = 'https://nu.com.mx/terminos'
WHERE nombre LIKE '%Cajita%Turbo%';
*/

-- Ejemplo de actualización de un producto de CRÉDITO (Tarjeta BBVA)
/*
UPDATE productos SET
  pros = ARRAY['Sin anualidad de por vida', 'Cashback en gasolina y supermercados', 'Construcción de historial crediticio'],
  cons = ARRAY['Tasa de interés alta (42% anual)', 'Límite inicial bajo'],
  cat = '45.2%',
  pago_mensual_ejemplo = '$450',
  pago_mensual_nota = '(Crédito de $5,000 con pago mínimo)',
  liquidez = 'Crédito renovable mensual',
  monto_minimo = '$1,000',
  monto_maximo = '$50,000',
  aprobacion = 'En 5 días hábiles',
  disposicion = 'Línea de crédito inmediata',
  requisitos = ARRAY['Edad entre 18-70 años', 'Ingresos mínimos $5,000/mes', 'Identificación oficial'],
  proteccion = 'Seguro contra fraude incluido',
  comisiones = ARRAY['$0 anualidad', '$30 por disposición en efectivo', '$50 por pago tardío'],
  logo_url = 'https://www.bbva.mx/content/dam/public-web/global/images/icons/logo_bbva.svg',
  terminos_condiciones_url = 'https://www.bbva.mx/personas/productos/tarjetas-de-credito/azul.html'
WHERE nombre LIKE '%BBVA%Azul%';
*/

-- Ejemplo de actualización de un producto de FINANCIAMIENTO (Kueski Pay)
/*
UPDATE productos SET
  pros = ARRAY['Aprobación inmediata', '0% en tiendas selectas', 'Sin tarjeta de crédito necesaria', 'Proceso 100% digital'],
  cons = ARRAY['Monto limitado', 'Solo en tiendas participantes', 'Puede generar sobreendeudamiento'],
  cat = '45.8%',
  ejemplo_financiamiento = '$3,000 en 4 quincenas → $750 cada quincena sin interés',
  monto_minimo = '$300',
  monto_maximo = '$12,000',
  liquidez = 'Línea renovable',
  aprobacion = 'Instantánea (en segundos)',
  tiendas_participantes = ARRAY['Amazon', 'Liverpool', 'Walmart', 'Elektra', 'Coppel', 'Sears'],
  total_tiendas = 1500,
  requisitos = ARRAY['Ser mayor de 18 años', 'Tener INE vigente', 'CURP', 'Número celular activo', 'Tarjeta de débito'],
  costos_adicionales = ARRAY['Interés moratorio: 10% mensual', 'Comisión por pago tardío: $150', 'Comisión por uso: $0', 'Anualidad: $0'],
  ideal_para = ARRAY['Compras emergentes sin liquidez inmediata', 'Personas sin tarjeta de crédito', 'Construir historial crediticio'],
  tips_raisket = '[{"tipo": "positivo", "texto": "Usa solo en tiendas con 0% interés"}, {"tipo": "neutro", "texto": "Paga antes de tiempo si puedes"}, {"tipo": "negativo", "texto": "Evita acumular múltiples financiamientos"}]'::jsonb,
  contacto = '{"telefono": "55-4000-5000", "email": "ayuda@kueski.com", "horario": "Lun-Dom 8am-10pm"}'::jsonb,
  vigencia_inicio = NULL,
  vigencia_fin = NULL,
  logo_url = 'https://www.kueski.com/logo.svg',
  terminos_condiciones_url = 'https://www.kueski.com/terminos'
WHERE nombre LIKE '%Kueski%Pay%';
*/
