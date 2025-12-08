-- ============================================
-- EJEMPLOS RÁPIDOS: Agregar Imágenes a Productos
-- ============================================
-- Ejecuta estos ejemplos en el SQL Editor de Supabase

-- ============================================
-- Ejemplo 1: Actualizar UN SOLO producto
-- ============================================

UPDATE products
SET 
  institution_logo = 'https://example.com/logos/nu-mexico.svg',
  image_url = 'https://example.com/products/tarjeta-nu.jpg',
  ai_hint = 'Tarjeta de crédito morada moderna de Nu México'
WHERE slug = 'tarjeta-nu';


-- ============================================
-- Ejemplo 2: Actualizar TODOS los productos de una institución
-- ============================================

UPDATE products
SET institution_logo = 'https://example.com/logos/bbva.png'
WHERE institution = 'BBVA México';


-- ============================================
-- Ejemplo 3: Insertar NUEVO producto con imágenes
-- ============================================

INSERT INTO products (
  id,
  name,
  slug,
  institution,
  institution_logo,
  image_url,
  category,
  segment,
  description,
  tagline,
  provider,
  is_active,
  is_featured
) VALUES (
  'prod-example-001',
  'Cuenta de Ahorro Digital',
  'cuenta-ahorro-digital-ejemplo',
  'Banco Digital',
  'https://example.com/logos/banco-digital.svg',  -- Logo de la institución
  'https://example.com/products/cuenta-digital.jpg', -- Imagen del producto
  'banking',
  'Personas',
  'Cuenta de ahorro 100% digital con rendimientos competitivos',
  'Ahorra fácil, gana más',
  'Banco Digital',
  true,
  false
);


-- ============================================
-- Ejemplo 4: Actualizar usando Supabase Storage
-- ============================================
-- Primero sube la imagen a Supabase Storage (interfaz web)
-- Luego actualiza con la URL pública

UPDATE products
SET institution_logo = 'https://[TU-PROYECTO].supabase.co/storage/v1/object/public/product-images/logo-nu.svg'
WHERE slug = 'tarjeta-nu';


-- ============================================
-- Ejemplo 5: Ver qué productos NO tienen imágenes
-- ============================================

SELECT 
  id,
  name,
  institution,
  slug,
  CASE 
    WHEN institution_logo IS NULL THEN '❌ Sin logo'
    ELSE '✅ Con logo'
  END as estado_logo,
  CASE 
    WHEN image_url IS NULL THEN '❌ Sin imagen'
    ELSE '✅ Con imagen'
  END as estado_imagen
FROM products
WHERE is_active = true
ORDER BY institution, name;


-- ============================================
-- Ejemplo 6: Actualización masiva por categoría
-- ============================================

-- Actualizar todas las tarjetas de crédito de HSBC
UPDATE products
SET 
  institution_logo = 'https://example.com/logos/hsbc.png',
  image_url = 'https://example.com/products/hsbc-tarjeta-default.jpg'
WHERE 
  institution = 'HSBC México' 
  AND category = 'credit_card'
  AND image_url IS NULL;


-- ============================================
-- Ejemplo 7: Actualizar desde un CSV (preparación)
-- ============================================
-- Si tienes un CSV con: slug, institution_logo, image_url
-- Puedes crear una tabla temporal e importar:

CREATE TEMP TABLE temp_images (
  slug TEXT,
  institution_logo TEXT,
  image_url TEXT
);

-- Luego importar el CSV en Supabase UI
-- Y hacer el UPDATE:

UPDATE products p
SET 
  institution_logo = t.institution_logo,
  image_url = t.image_url
FROM temp_images t
WHERE p.slug = t.slug;


-- ============================================
-- Ejemplo 8: Verificar URLs de imágenes
-- ============================================

SELECT 
  slug,
  name,
  institution_logo,
  image_url,
  LENGTH(institution_logo) as logo_length,
  LENGTH(image_url) as image_length
FROM products
WHERE 
  is_active = true
  AND (
    institution_logo IS NOT NULL 
    OR image_url IS NOT NULL
  )
LIMIT 20;


-- ============================================
-- Ejemplo 9: Copiar logo de institución a todos sus productos
-- ============================================

-- Paso 1: Actualizar UN producto manualmente
UPDATE products
SET institution_logo = 'https://example.com/logos/banorte.png'
WHERE slug = 'tarjeta-banorte-oro'
  AND institution = 'Banorte';

-- Paso 2: Copiar ese logo a todos los demás productos de Banorte
UPDATE products
SET institution_logo = (
  SELECT institution_logo 
  FROM products 
  WHERE slug = 'tarjeta-banorte-oro'
  LIMIT 1
)
WHERE 
  institution = 'Banorte'
  AND institution_logo IS NULL;


-- ============================================
-- Ejemplo 10: Limpiar URLs inválidas
-- ============================================

-- Marcar como NULL las URLs que no empiezan con https://
UPDATE products
SET 
  institution_logo = NULL
WHERE 
  institution_logo IS NOT NULL 
  AND institution_logo NOT LIKE 'https://%';

UPDATE products
SET 
  image_url = NULL
WHERE 
  image_url IS NOT NULL 
  AND image_url NOT LIKE 'https://%';
