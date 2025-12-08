# ✅ Checklist Rápido: Agregar Imágenes a Productos

## 📋 Para UN SOLO Producto

### Paso 1: Preparar la imagen
- [ ] Tengo la imagen del logo de la institución
- [ ] La imagen está optimizada (< 100KB)
- [ ] El formato es correcto (SVG/PNG para logos, JPG/WebP para fotos)
- [ ] El tamaño es: 200x200px (logo) o 600x400px (producto)

### Paso 2: Subir la imagen
- [ ] Elegí dónde hospedar: 
  - [ ] Cloudinary
  - [ ] ImgBB
  - [ ] Supabase Storage
  - [ ] AWS S3
  - [ ] Otro: _____________
- [ ] Subí la imagen
- [ ] Copié la URL permanente
- [ ] Verifiqué que la URL funciona (la abrí en el navegador)

### Paso 3: Actualizar Supabase

**Opción A - Interfaz Gráfica:**
- [ ] Abrí Supabase Dashboard
- [ ] Fui a Table Editor → `products`
- [ ] Busqué el producto por `slug` o `name`
- [ ] Edité la columna `institution_logo`
- [ ] Pegué la URL
- [ ] Guardé

**Opción B - SQL Editor:**
```sql
-- Copiar y modificar esto:
UPDATE products
SET institution_logo = 'https://TU-URL-AQUI.com/logo.svg'
WHERE slug = 'slug-del-producto';
```
- [ ] Copié el SQL de arriba
- [ ] Reemplacé la URL y el slug
- [ ] Ejecuté en SQL Editor
- [ ] Vi el mensaje de éxito

### Paso 4: Verificar
- [ ] Verifiqué en Supabase que se guardó:
```sql
SELECT name, institution_logo 
FROM products 
WHERE slug = 'mi-producto';
```
- [ ] Recargué la página web
- [ ] VI el logo en la tarjeta del producto
- [ ] El logo se ve bien (no pixelado, no cortado)

---

## 📦 Para MÚLTIPLES Productos

### Opción 1: Misma institución

```sql
-- Actualizar todos los productos de una institución
UPDATE products
SET institution_logo = 'https://URL-DEL-LOGO.com/logo.svg'
WHERE institution = 'Nombre de la Institución';
```

**Checklist:**
- [ ] Identifiqué el nombre exacto de la institución
- [ ] Preparé el logo
- [ ] Ejecuté el UPDATE
- [ ] Verifiqué cuántos productos se actualizaron:
```sql
SELECT COUNT(*), institution 
FROM products 
WHERE institution_logo IS NOT NULL
GROUP BY institution;
```

### Opción 2: Carga masiva con CSV

**Preparar CSV:**
```csv
slug,institution_logo
tarjeta-nu,https://example.com/nu.svg
tarjeta-bbva,https://example.com/bbva.png
cuenta-banorte,https://example.com/banorte.svg
```

**Checklist:**
- [ ] Creé archivo CSV con columnas: `slug`, `institution_logo`
- [ ] Verifiqué que los slugs existen en la base de datos
- [ ] Todas las URLs funcionan
- [ ] Importé el CSV en Supabase
- [ ] Ejecuté el UPDATE masivo
- [ ] Verifiqué que se aplicaron correctamente

---

## 🔍 Checklist de Calidad

### Para cada imagen:
- [ ] La URL es HTTPS (no HTTP)
- [ ] La URL es pública (no requiere login)
- [ ] El archivo existe (no da error 404)
- [ ] El tamaño es apropiado (< 200KB)
- [ ] El formato es correcto:
  - [ ] SVG para logos vectoriales
  - [ ] PNG con transparencia para logos
  - [ ] JPG o WebP para fotografías
- [ ] El nombre del archivo es descriptivo (no "image1.jpg")

### Para logos de institución:
- [ ] Tiene fondo transparente (si es PNG/SVG)
- [ ] Es cuadrado o casi cuadrado (ratio 1:1)
- [ ] Se ve bien en 48px x 48px (tamaño pequeño)
- [ ] La marca es reconocible

### Para imágenes de producto:
- [ ] Muestra claramente el producto
- [ ] Tiene buena resolución
- [ ] Ratio 3:2 (600x400px)
- [ ] Fondo limpio o relevante

---

## 🚨 Troubleshooting

Si algo no funciona, verificar:

- [ ] ¿La URL tiene HTTPS?
  ```
  ✅ https://example.com/logo.svg
  ❌ http://example.com/logo.svg
  ```

- [ ] ¿La URL es pública?
  - Abre la URL en una ventana de incógnito
  - Si pide login → ❌ No es pública

- [ ] ¿El formato es soportado?
  ```
  ✅ .svg, .png, .jpg, .jpeg, .webp
  ❌ .gif, .bmp, .tiff
  ```

- [ ] ¿El producto existe?
  ```sql
  SELECT * FROM products WHERE slug = 'mi-slug';
  ```
  Si no retorna nada → producto no existe

- [ ] ¿La columna se actualizó?
  ```sql
  SELECT institution_logo FROM products WHERE slug = 'mi-slug';
  ```
  Debe mostrar la URL, no NULL

- [ ] ¿El caché del navegador?
  - Ctrl + Shift + R (forzar recarga)
  - Abrir en ventana de incógnito

---

## 📊 Reporte de Progreso

### Ver qué falta

```sql
-- Productos SIN logo
SELECT 
  slug,
  name,
  institution
FROM products
WHERE 
  is_active = true
  AND institution_logo IS NULL
ORDER BY institution, name;
```

### Ver estadísticas

```sql
-- Resumen por institución
SELECT 
  institution,
  COUNT(*) as total_productos,
  COUNT(institution_logo) as con_logo,
  COUNT(*) - COUNT(institution_logo) as sin_logo,
  ROUND(COUNT(institution_logo)::numeric / COUNT(*) * 100, 1) as porcentaje_completado
FROM products
WHERE is_active = true
GROUP BY institution
ORDER BY total_productos DESC;
```

**Meta:**
- [ ] 100% de instituciones principales tienen logo
- [ ] 80%+ de todos los productos tienen logo
- [ ] Productos destacados (`is_featured = true`) tienen logo

---

## 🎯 Priorización

### Prioridad ALTA (hacer primero)
- [ ] Productos con `is_featured = true`
- [ ] Productos con más reviews (`review_count > 10`)
- [ ] Instituciones principales: Nu, BBVA, Banorte, HSBC, Santander

### Prioridad MEDIA
- [ ] Productos de inversiones destacadas
- [ ] Productos con buena calificación (`rating > 4.0`)
- [ ] Instituciones medianas

### Prioridad BAJA
- [ ] Productos legacy
- [ ] Productos con `is_active = false`
- [ ] Instituciones pequeñas

---

## 📝 Plantillas de SQL

### Actualizar UN producto
```sql
UPDATE products
SET 
  institution_logo = 'https://___URL_AQUI___',
  image_url = 'https://___URL_IMAGEN___'
WHERE slug = '___SLUG_AQUI___';
```

### Actualizar TODOS de una institución
```sql
UPDATE products
SET institution_logo = 'https://___URL_AQUI___'
WHERE institution = '___NOMBRE_INSTITUCION___';
```

### Verificar cambios
```sql
SELECT slug, name, institution_logo, image_url
FROM products
WHERE slug = '___SLUG_AQUI___';
```

### Contar cuántos tienen imágenes
```sql
SELECT 
  COUNT(*) FILTER (WHERE institution_logo IS NOT NULL) as con_logo,
  COUNT(*) FILTER (WHERE institution_logo IS NULL) as sin_logo,
  COUNT(*) as total
FROM products
WHERE is_active = true;
```

---

## ✨ Tips Finales

1. **Empieza pequeño**: Actualiza 1 producto, verifica, luego escala
2. **Verifica siempre**: Abre las URLs antes de guardarlas
3. **Usa SVG cuando puedas**: Pesan menos y se ven mejor
4. **Documenta**: Anota dónde guardaste las imágenes originales
5. **Backup**: Guarda una copia de las imágenes localmente
6. **Nombra bien**: Usa nombres descriptivos para los archivos
7. **CDN**: Si usas muchas imágenes, considera un CDN

---

## 📚 Recursos

- **Guía completa**: `GUIA_IMAGENES_PRODUCTOS.md`
- **Ejemplos SQL**: `scripts/EJEMPLOS_IMAGENES.sql`
- **Diagrama visual**: `docs/VISUAL_IMAGENES.md`
- **Workflow general**: `WORKFLOW_PRODUCTOS.md`

---

## 🎉 Checklist de Completado

- [ ] Leí la guía completa
- [ ] Preparé las imágenes
- [ ] Subí a hosting
- [ ] Actualicé la base de datos
- [ ] Verifiqué en la web
- [ ] Todo funciona correctamente
- [ ] Documenté lo que hice

---

**¿Necesitas ayuda?** Revisa la sección de Troubleshooting o la guía completa.
