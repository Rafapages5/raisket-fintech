# 🎯 RESUMEN EJECUTIVO: Imágenes en Productos Raisket

> **Última actualización:** Diciembre 2025

---

## ⚡ TL;DR (Respuesta Ultra-Rápida)

### ¿Cómo agrego imágenes a los productos?

1. **Sube tu imagen** a Cloudinary/ImgBB/Supabase Storage
2. **Copia la URL** de la imagen
3. **Actualiza en Supabase** con este SQL:
   ```sql
   UPDATE products
   SET institution_logo = 'TU_URL_AQUI'
   WHERE slug = 'nombre-producto';
   ```
4. **Recarga la web** y listo ✅

---

## 📊 Campos Disponibles (2)

| Campo | ¿Qué es? | ¿Se muestra? | Prioridad |
|-------|----------|--------------|-----------|
| **`institution_logo`** | Logo del banco/institución | ✅ SÍ - En tarjetas de productos | 🔥 **ALTA** |
| **`image_url`** | Imagen del producto | ❌ NO - Solo metadata/SEO | 📊 Media |

---

## 🎨 Visualización Actual

### Con logo:
```
┌─────────────────────────┐
│ [🏦 LOGO]  Tarjeta Nu   │  ← Logo aparece aquí
│            Nu México     │
│            ⭐⭐⭐⭐⭐      │
└─────────────────────────┘
```

### Sin logo:
```
┌─────────────────────────┐
│   [N]      Tarjeta Nu   │  ← Solo inicial
│            Nu México     │
│            ⭐⭐⭐⭐⭐      │
└─────────────────────────┘
```

---

## 🚀 Opciones de Implementación

### Opción 1: URLs Externas (⭐ Recomendado)

**Servicios sugeridos:**
- [Cloudinary](https://cloudinary.com) - Gratis hasta 25GB
- [ImgBB](https://imgbb.com) - Gratis, muy simple
- [Supabase Storage](https://supabase.com) - Si ya usas Supabase

**Pasos:**
1. Crea cuenta
2. Sube imagen
3. Copia URL permanente
4. Pega en Supabase

---

### Opción 2: Supabase Storage

**Ventajas:** Todo centralizado en Supabase

**Pasos:**
1. Dashboard → Storage
2. Crear bucket `product-images` (público)
3. Subir imagen
4. Copiar URL: `https://[proyecto].supabase.co/storage/v1/object/public/product-images/logo.svg`

---

### Opción 3: Archivos Locales

**⚠️ Solo para desarrollo**

1. Guardar en `/public/images/institutions/logo.svg`
2. URL: `/images/institutions/logo.svg`

---

## 📦 Ejemplos Rápidos de SQL

### Actualizar 1 producto
```sql
UPDATE products
SET institution_logo = 'https://example.com/logo.svg'
WHERE slug = 'tarjeta-nu';
```

### Actualizar toda una institución
```sql
UPDATE products
SET institution_logo = 'https://example.com/bbva-logo.png'
WHERE institution = 'BBVA México';
```

### Ver productos sin logo
```sql
SELECT name, institution, slug
FROM products
WHERE institution_logo IS NULL
  AND is_active = true;
```

---

## ✅ Checklist Rápido

- [ ] Preparé la imagen (200x200px, formato SVG/PNG)
- [ ] Subí a servicio externo
- [ ] Copié la URL (HTTPS)
- [ ] Ejecuté UPDATE en Supabase
- [ ] Recargué la web
- [ ] Verifiqué que se ve bien

---

## 🎯 Especificaciones Técnicas

### Tamaños Recomendados

| Tipo | Dimensiones | Formato | Peso Máx |
|------|-------------|---------|----------|
| Logo institución | 200x200px | SVG/PNG | 100KB |
| Imagen producto | 600x400px | JPG/WebP | 200KB |

### Formatos Soportados
- ✅ SVG (ideal para logos)
- ✅ PNG (con transparencia)
- ✅ JPG / JPEG
- ✅ WebP
- ❌ GIF (no recomendado)

---

## 🔍 Verificación

### En Supabase:
```sql
SELECT name, institution_logo 
FROM products 
WHERE slug = 'MI-PRODUCTO';
```

### En el navegador:
1. Abre la URL de la imagen
2. Debe mostrarse sin errores
3. Debe ser HTTPS (no HTTP)

### En la web:
1. Ve a `/inversiones/mejores/todos` (o la categoría)
2. Busca el producto
3. El logo debe aparecer en la tarjeta

---

## 📊 Estado Actual del Código

### Dónde se usa `institution_logo`:

**ProductCardNW.tsx** (líneas 82-96):
```tsx
{product.institution_logo ? (
  <Image
    src={product.institution_logo}
    alt={product.institution}
    width={48}
    height={48}
  />
) : (
  <span>{product.institution.charAt(0)}</span>
)}
```

### Dónde NO se usa `image_url`:
- Solo se guarda en BD para futuro uso
- Se usa en metadata/SEO (Schema.org)
- No se muestra visualmente en tarjetas

---

## 🚨 Problemas Comunes

| Problema | Solución |
|----------|----------|
| "No veo el logo" | 1. Verifica que la URL sea HTTPS<br>2. Recarga con Ctrl+Shift+R<br>3. Abre en incógnito |
| "404 Not Found" | La URL no existe o está mal copiada |
| "Imagen cortada" | Verifica que sea 200x200px (cuadrada) |
| "Muy pesada" | Comprime con TinyPNG |
| "No es pública" | Configura el bucket/archivo como público |

---

## 📄 Documentación Completa

He creado **4 documentos** para ti:

1. **`GUIA_IMAGENES_PRODUCTOS.md`** ← 📖 Guía completa (EMPIEZA AQUÍ)
2. **`scripts/EJEMPLOS_IMAGENES.sql`** ← 💻 Ejemplos SQL listos para usar
3. **`docs/VISUAL_IMAGENES.md`** ← 🎨 Diagramas y explicaciones visuales
4. **`CHECKLIST_IMAGENES.md`** ← ✅ Checklist paso a paso

---

## 🎓 Flujo Completo (Ejemplo Real)

### Escenario: Agregar logo de Nu México

**1. Preparar imagen**
- Descargo logo oficial: `nu-logo.svg`
- Tamaño: 512x512px → Redimensiono a 200x200px

**2. Subir a Cloudinary**
- Creo cuenta en Cloudinary
- Subo `nu-logo.svg`
- URL resultante: `https://res.cloudinary.com/raisket/image/upload/nu-logo.svg`

**3. Actualizar Supabase**
```sql
-- SQL Editor en Supabase
UPDATE products
SET institution_logo = 'https://res.cloudinary.com/raisket/image/upload/nu-logo.svg'
WHERE institution = 'Nu México';

-- Verificar
SELECT name, institution_logo FROM products WHERE institution = 'Nu México';
```

**4. Verificar en la web**
- Ir a: `https://raisket.mx/inversiones/mejores/todos`
- Buscar productos de Nu
- ✅ Logo aparece correctamente

---

## 📞 Soporte

**Si tienes problemas:**

1. **Revisa el checklist** en `CHECKLIST_IMAGENES.md`
2. **Verifica con SQL:**
   ```sql
   SELECT 
     name, 
     institution_logo,
     CASE 
       WHEN institution_logo IS NULL THEN '❌ Sin logo'
       WHEN institution_logo LIKE 'https://%' THEN '✅ URL válida'
       ELSE '⚠️ URL inválida'
     END as estado
   FROM products
   WHERE slug = 'tu-producto';
   ```
3. **Consulta la guía completa** en `GUIA_IMAGENES_PRODUCTOS.md`

---

## 🎯 Siguientes Pasos Recomendados

### Fase 1: Logos Básicos (Ahora)
- [ ] Agregar logos a las 5 instituciones principales
- [ ] Verificar que se ven bien
- [ ] Documentar URLs usadas

### Fase 2: Expansión (Semana 2)
- [ ] Agregar logos a todas las instituciones activas
- [ ] Optimizar imágenes pesadas
- [ ] Actualizar productos destacados

### Fase 3: Imágenes de Producto (Futuro)
- [ ] Definir uso visual de `image_url`
- [ ] Actualizar componentes para mostrar imágenes
- [ ] Agregar imágenes a productos destacados

---

## 🔗 Links Útiles

- [Cloudinary - Gratis](https://cloudinary.com/users/register/free)
- [ImgBB - Gratis](https://imgbb.com/)
- [TinyPNG - Comprimir imágenes](https://tinypng.com/)
- [Squoosh - Optimizar](https://squoosh.app/)
- [SVG OMG - Optimizar SVG](https://jakearchibald.github.io/svgomg/)

---

## 📈 Métricas de Éxito

**Objetivo:**
- ✅ 100% de instituciones principales con logo
- ✅ 80% de productos activos con logo
- ✅ Todos los productos destacados con logo

**Consulta de progreso:**
```sql
SELECT 
  ROUND(COUNT(institution_logo)::numeric / COUNT(*) * 100, 1) as porcentaje_completado
FROM products
WHERE is_active = true;
```

---

**🎉 ¡Listo! Ya sabes todo lo necesario para agregar imágenes a tus productos.**

**¿Por dónde empezar?** 
→ Lee `GUIA_IMAGENES_PRODUCTOS.md` 
→ Usa `CHECKLIST_IMAGENES.md` 
→ Ejecuta SQLs de `scripts/EJEMPLOS_IMAGENES.sql`
