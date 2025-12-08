# Guía: Cómo Agregar Imágenes a los Productos Financieros

## 📋 Índice
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Tipos de Imágenes](#tipos-de-imágenes)
3. [Campos de Base de Datos](#campos-de-base-de-datos)
4. [Opciones de Implementación](#opciones-de-implementación)
5. [Ejemplos Prácticos](#ejemplos-prácticos)
6. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Resumen Ejecutivo

Actualmente, el sistema de Raisket maneja **dos tipos de imágenes** para productos financieros:

1. **Logo de la Institución** (`institution_logo`) - Logo del banco/financiera
2. **Imagen del Producto** (`image_url`) - Imagen específica del producto

Ambas son **opcionales** y se definen en la tabla `products` de Supabase.

---

## 🖼️ Tipos de Imágenes

### 1. Logo de la Institución (`institution_logo`)

**Propósito:** Mostrar el logo del banco o institución financiera en la tarjeta del producto.

**Dónde se usa:**
- Tarjetas de productos (`ProductCardNW.tsx`)
- Páginas de comparación
- Listados de productos

**Ejemplo visual:**
```
┌─────────────────────────┐
│ [LOGO] Tarjeta Nu       │  ← Logo aparece aquí
│        Nu México        │
│ Rating: ⭐⭐⭐⭐⭐        │
└─────────────────────────┘
```

### 2. Imagen del Producto (`image_url`)

**Propósito:** Imagen específica del producto financiero (tarjeta física, app, etc.)

**Dónde se usa:**
- Páginas de detalle de producto (reviews)
- Marketing y SEO
- Schema.org metadata

**Nota:** Actualmente este campo está definido en la base de datos pero **no se está mostrando visualmente** en las tarjetas de producto. Solo se usa para metadata.

---

## 📊 Campos de Base de Datos

En la tabla `products` de Supabase, tienes estos campos:

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|-------|------|-------------|-------------|---------|
| `institution_logo` | TEXT | URL del logo de la institución | No | `"https://example.com/logo-nu.png"` |
| `image_url` | TEXT | URL de la imagen del producto | No | `"https://example.com/tarjeta-nu.jpg"` |
| `ai_hint` | TEXT | Descripción para generar imagen con IA | No | `"Tarjeta de crédito morada moderna"` |

### Migración SQL aplicada:

```sql
-- Campo image_url ya existe en la base de datos
ALTER TABLE financial.products
ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN financial.products.image_url IS 'URL to product image';
```

---

## 🛠️ Opciones de Implementación

### Opción 1: URLs Externas (Recomendado)

**Ventajas:**
- ✅ Fácil de implementar
- ✅ No consume espacio en tu servidor
- ✅ Puedes usar CDN para mejor rendimiento

**Pasos:**

1. **Sube las imágenes a un servicio externo:**
   - Cloudinary
   - ImgBB
   - AWS S3
   - Google Cloud Storage
   - Imgur

2. **Obtén la URL permanente**
   ```
   https://res.cloudinary.com/tu-cuenta/image/upload/logo-nu.png
   ```

3. **Actualiza el producto en Supabase:**
   
   **Opción A - Interfaz de Supabase:**
   - Ir a Table Editor → `products`
   - Buscar el producto
   - Editar la columna `institution_logo` o `image_url`
   - Pegar la URL
   - Guardar

   **Opción B - SQL Editor:**
   ```sql
   UPDATE products
   SET 
     institution_logo = 'https://res.cloudinary.com/ejemplo/logo-nu.png',
     image_url = 'https://res.cloudinary.com/ejemplo/tarjeta-nu.jpg'
   WHERE slug = 'tarjeta-nu';
   ```

### Opción 2: Supabase Storage

**Ventajas:**
- ✅ Todo centralizado en Supabase
- ✅ Control total sobre las imágenes
- ✅ URLs permanentes

**Pasos:**

1. **En Supabase Dashboard → Storage:**
   - Crear un bucket llamado `product-images`
   - Configurar el bucket como **público**

2. **Subir imágenes:**
   - Usar la interfaz de Supabase Storage
   - O usar el SDK de Supabase en tu código

3. **Obtener URL pública:**
   ```
   https://[tu-proyecto].supabase.co/storage/v1/object/public/product-images/logo-nu.png
   ```

4. **Actualizar el producto:**
   ```sql
   UPDATE products
   SET institution_logo = 'https://[tu-proyecto].supabase.co/storage/v1/object/public/product-images/logo-nu.png'
   WHERE slug = 'tarjeta-nu';
   ```

### Opción 3: Imágenes Locales (No Recomendado)

**Solo para desarrollo.**

1. **Guardar imagen en:**
   ```
   /public/images/institutions/logo-nu.png
   ```

2. **Actualizar base de datos:**
   ```sql
   UPDATE products
   SET institution_logo = '/images/institutions/logo-nu.png'
   WHERE slug = 'tarjeta-nu';
   ```

---

## 🎨 Ejemplos Prácticos

### Ejemplo 1: Agregar Logo de Nu México

```sql
UPDATE products
SET institution_logo = 'https://nu.com.mx/images/nu-logo.svg'
WHERE institution = 'Nu México';
```

### Ejemplo 2: Agregar Múltiples Productos a la Vez

```sql
-- Actualizar todos los productos de BBVA
UPDATE products
SET institution_logo = 'https://example.com/logos/bbva.png'
WHERE institution = 'BBVA México';

-- Actualizar todos los productos de Banorte
UPDATE products
SET institution_logo = 'https://example.com/logos/banorte.png'
WHERE institution = 'Banorte';
```

### Ejemplo 3: Insertar Producto Nuevo con Imágenes

```sql
INSERT INTO products (
  id,
  name,
  slug,
  institution,
  institution_logo,
  image_url,
  category,
  description,
  is_active
) VALUES (
  'prod-tarjeta-nu-001',
  'Tarjeta de Crédito Nu',
  'tarjeta-nu',
  'Nu México',
  'https://nu.com.mx/images/logo.svg',
  'https://nu.com.mx/images/tarjeta-morada.jpg',
  'credit_card',
  'Tarjeta de crédito sin anualidad',
  true
);
```

### Ejemplo 4: Usar el Campo `ai_hint`

Si no tienes imágenes pero quieres generarlas con IA después:

```sql
UPDATE products
SET 
  ai_hint = 'Tarjeta de crédito moderna color morado de Nu México',
  image_url = NULL
WHERE slug = 'tarjeta-nu';
```

---

## ✅ Mejores Prácticas

### Tamaños Recomendados

| Tipo | Tamaño Recomendado | Formato |
|------|-------------------|---------|
| Logo de institución | 200x200px (cuadrado) | PNG con transparencia |
| Imagen de producto | 600x400px (3:2) | JPG o WebP |

### Optimización

1. **Comprime las imágenes antes de subirlas:**
   - TinyPNG (https://tinypng.com)
   - Squoosh (https://squoosh.app)

2. **Usa formatos modernos:**
   - WebP para fotografías (mejor compresión)
   - SVG para logos (escalable, peso mínimo)
   - PNG solo cuando necesites transparencia

3. **Nombres de archivo descriptivos:**
   ```
   ✅ logo-nu-mexico.svg
   ✅ tarjeta-bbva-azul.jpg
   ❌ image1.jpg
   ❌ foto.png
   ```

### SEO y Accesibilidad

El sistema ya incluye el `alt` text automáticamente:

```tsx
// Código actual en ProductCardNW.tsx
<Image
  src={product.institution_logo}
  alt={product.institution}  // ← Se genera automáticamente
  width={48}
  height={48}
/>
```

---

## 🔍 Verificación

### 1. Verifica que la imagen se guardó correctamente:

```sql
SELECT 
  name, 
  institution, 
  institution_logo, 
  image_url
FROM products
WHERE slug = 'tarjeta-nu';
```

### 2. Prueba la URL en el navegador:

Copia la URL y ábrela en una pestaña nueva. Debe mostrar la imagen.

### 3. Verifica en la aplicación:

Después de actualizar, recarga la página de comparación y verifica que el logo aparezca.

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si no pongo imágenes?**

R: El sistema mostrará una inicial del nombre de la institución en un círculo:
```tsx
// Código de fallback en ProductCardNW.tsx
<span className="text-2xl font-bold text-[#1A365D]">
  {product.institution.charAt(0)}  // ← Muestra "N" para Nu México
</span>
```

**P: ¿Puedo usar imágenes diferentes para móvil y desktop?**

R: No directamente en la base de datos, pero puedes usar un CDN que sirva imágenes responsive (ej: Cloudinary).

**P: ¿Las imágenes afectan el SEO?**

R: Sí. El campo `image_url` se usa en Schema.org metadata, lo que ayuda a que Google muestre rich snippets.

**P: ¿Cómo actualizo imágenes masivamente?**

R: Puedes usar un script SQL o preparar un CSV y usar la función de importación de Supabase.

---

## 📚 Documentación Relacionada

- [WORKFLOW_PRODUCTOS.md](./WORKFLOW_PRODUCTOS.md) - Flujo general de gestión de productos
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

---

## 🆘 Soporte

Si tienes problemas:
1. Verifica que las URLs sean públicas (no requieran autenticación)
2. Verifica que las imágenes sean HTTPS (no HTTP)
3. Verifica el formato del archivo (PNG, JPG, SVG, WebP)
4. Revisa la consola del navegador para errores 404

---

**Última actualización:** Diciembre 2025
