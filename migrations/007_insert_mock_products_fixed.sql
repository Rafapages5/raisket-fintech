-- Migration: Insert mock products data into financial_products (Fixed)
-- Description: Inserts sample product data with required fields for each category
-- Date: 2025-09-13

-- Insert sample products into financial_products table with proper category-specific fields
INSERT INTO financial_products (
  product_id, name, tagline, description, long_description, category, segment,
  image_url, provider, features, benefits, eligibility, average_rating, review_count,
  fees, ai_hint, details_url, credit_interest_rate, credit_loan_term, credit_max_loan_amount,
  created_at, updated_at
) VALUES
(
  'ind-credit-001',
  'Tarjeta Platinum Rewards',
  'Gana puntos en cada compra.',
  'Una tarjeta de crédito premium que ofrece un programa de recompensas robusto, beneficios de viaje y protección de compras para el gasto diario.',
  'La Tarjeta Platinum Rewards está diseñada para personas que quieren maximizar sus recompensas en compras diarias. Disfruta de puntos adicionales en restaurantes, viajes y supermercados. Las ventajas adicionales incluyen seguro de viaje, garantía extendida y acceso a salas VIP exclusivas del aeropuerto. Con una TAE competitiva y un diseño elegante, es la compañera perfecta para tu billetera.',
  'Crédito',
  'Personas',
  'https://placehold.co/600x400.png',
  'Banco Global',
  '["5x puntos en viajes", "3x puntos en restaurantes", "1x punto en todas las demás compras", "Sin comisiones por transacciones en el extranjero", "Seguro de viaje"]'::jsonb,
  '["Maximiza recompensas", "Viaja con estilo", "Compra con confianza"]'::jsonb,
  '["Excelente puntuación crediticia (720+)", "Residente de EE.UU."]'::jsonb,
  4.8,
  1250,
  'Cuota anual de $95 (exenta el primer año)',
  'pago con tarjeta de crédito',
  '#',
  '15.99% - 23.99% TAE',
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  'ind-credit-002',
  'Tarjeta Estudiante Ahorrador',
  'Construye crédito responsablemente.',
  'Una tarjeta de crédito ideal para estudiantes, que ayuda a construir historial crediticio sin cuota anual y con recompensas de cashback.',
  'La Tarjeta Estudiante Ahorrador está hecha a medida para estudiantes que buscan comenzar su camino crediticio. Ofrece un límite de crédito manejable, cashback en gastos comunes de estudiantes como libros y servicios de streaming, y herramientas para ayudarte a aprender sobre el uso responsable del crédito. Sin cuota anual, es una opción asequible.',
  'Crédito',
  'Personas',
  'https://placehold.co/600x400.png',
  'Cooperativa de Crédito Campus',
  '["2% cashback en libros y streaming", "1% cashback en todas las compras", "Sin cuota anual", "Herramientas para construir crédito"]'::jsonb,
  '["Comienza a construir crédito", "Gana recompensas en lo esencial", "Aprende responsabilidad financiera"]'::jsonb,
  '["Estudiante inscrito", "No se requiere historial crediticio para algunos solicitantes"]'::jsonb,
  4.5,
  300,
  'Sin cuota anual',
  'finanzas estudiantiles',
  '#',
  '18.99% TAE',
  NULL,
  NULL,
  NOW(),
  NOW()
);

-- Insert financing product with required financing fields
INSERT INTO financial_products (
  product_id, name, tagline, description, category, segment,
  image_url, provider, features, benefits, eligibility, average_rating, review_count,
  ai_hint, details_url,
  financing_interest_rate, financing_loan_term, financing_max_loan_amount,
  created_at, updated_at
) VALUES
(
  'ind-finance-001',
  'Préstamo Personal Flex',
  'Financiamiento flexible para tus necesidades.',
  'Un préstamo personal versátil con tasas competitivas y términos de pago flexibles para consolidación de deudas, mejoras del hogar o compras importantes.',
  'Financiamiento',
  'Personas',
  'https://placehold.co/600x400.png',
  'TrustLend Finance',
  '["Montos de préstamo de $2,000 a $50,000", "Tasas de interés fijas", "Términos de pago de 2 a 5 años", "Sin penalizaciones por pago anticipado"]'::jsonb,
  '["Consolida deudas", "Financia proyectos importantes", "Pagos predecibles"]'::jsonb,
  '["Puntuación crediticia buena a excelente", "Ingresos verificables"]'::jsonb,
  4.7,
  870,
  'documento de préstamo personal',
  '#',
  '7.99% - 19.99% TAE',
  '24-60 meses',
  '$50,000',
  NOW(),
  NOW()
);

-- Insert BBVA products with required credit fields
INSERT INTO financial_products (
  product_id, name, tagline, description, long_description, category, segment,
  image_url, provider, features, benefits, eligibility, average_rating, review_count,
  fees, ai_hint, details_url, credit_interest_rate,
  created_at, updated_at
) VALUES
(
  'bbva-azul-001',
  'Tarjeta de Crédito Azul BBVA',
  'Tu primera tarjeta de crédito sin anualidad.',
  'Ideal para comenzar tu historial crediticio. Sin anualidad el primer año y con la seguridad de BBVA México.',
  'La Tarjeta Azul BBVA es perfecta para quienes buscan su primera tarjeta de crédito o desean una opción confiable sin complicaciones. Disfruta de compras seguras con tecnología chip y contactless, además de beneficios exclusivos en comercios afiliados. Con BBVA Net Cash podrás consultar tu saldo y movimientos las 24 horas. Incluye seguro por compra protegida y la posibilidad de diferir tus compras a meses sin intereses en establecimientos participantes.',
  'Crédito',
  'Personas',
  'https://placehold.co/600x400/0066CC/FFFFFF?text=BBVA+Azul',
  'BBVA México',
  '["Sin anualidad el primer año", "Tecnología chip y contactless", "BBVA Net Cash para consultas 24/7", "Seguro por compra protegida", "Meses sin intereses en comercios afiliados", "Programa de puntos BBVA Rewards"]'::jsonb,
  '["Construye tu historial crediticio", "Compras seguras y protegidas", "Flexibilidad de pago", "Acceso a promociones exclusivas"]'::jsonb,
  '["Ingresos mínimos de $8,000 MXN mensuales", "Edad entre 18 y 70 años", "Residencia en México", "Identificación oficial vigente"]'::jsonb,
  4.2,
  2850,
  'Anualidad: $0 primer año, $450 MXN a partir del segundo año',
  'tarjeta de crédito azul BBVA México',
  'https://www.bbva.mx/personas/productos/tarjetas-de-credito/azul.html',
  '42.8% anual',
  NOW(),
  NOW()
),
(
  'bbva-platinum-001',
  'Tarjeta de Crédito Platinum BBVA',
  'Exclusividad y beneficios premium.',
  'La tarjeta premium de BBVA con los mejores beneficios, seguros completos y acceso a experiencias exclusivas.',
  'La Tarjeta Platinum BBVA representa el máximo nivel de exclusividad y beneficios. Diseñada para clientes con ingresos altos que buscan una experiencia premium completa. Incluye seguros de alta cobertura, acceso a salas VIP en aeropuertos, concierge personal las 24 horas, y el programa BBVA Rewards más robusto con tasas de acumulación aceleradas. Disfruta de beneficios únicos como protección de compras internacional, extensión de garantía, y acceso a eventos exclusivos. Tu tarjeta para un estilo de vida sin límites.',
  'Crédito',
  'Personas',
  'https://placehold.co/600x400/C0C0C0/000000?text=BBVA+Platinum',
  'BBVA México',
  '["Límite de crédito premium", "Seguro de vida por $500,000 MXN", "Acceso a salas VIP Priority Pass", "Concierge personal 24/7", "Seguro de viaje internacional", "Protección de compras mundial", "BBVA Rewards acelerado 2x puntos", "Extensión de garantía automática"]'::jsonb,
  '["Máxima exclusividad", "Protección integral mundial", "Experiencias únicas", "Servicio personalizado", "Recompensas premium"]'::jsonb,
  '["Ingresos mínimos de $50,000 MXN mensuales", "Excelente historial crediticio", "Edad entre 25 y 70 años", "Cliente preferente BBVA", "Evaluación crediticia rigurosa"]'::jsonb,
  4.8,
  750,
  'Anualidad: $3,500 MXN',
  'tarjeta de crédito platinum plateada premium',
  'https://www.bbva.mx/personas/productos/tarjetas-de-credito/platinum.html',
  '36.9% anual',
  NOW(),
  NOW()
);

-- Verify the insert
SELECT
  'Success: Inserted ' || COUNT(*) || ' products' as result,
  product_id,
  name,
  category
FROM financial_products
WHERE product_id IN (
  'ind-credit-001', 'ind-credit-002', 'ind-finance-001',
  'bbva-azul-001', 'bbva-platinum-001'
)
GROUP BY ROLLUP(product_id, name, category)
ORDER BY product_id;