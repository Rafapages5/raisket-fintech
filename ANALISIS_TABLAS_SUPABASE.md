# 📊 Análisis de Tablas Supabase - Raisket MVP

**Fecha:** 2025-01-21
**Estado Actual:** Transición de sistema normalizado a polimórfico

---

## 📈 Estado de las Tablas

### ✅ MANTENER (Activas en MVP)

#### 1. **`financial_products`** ⭐ PRINCIPAL
- **Registros:** 12 productos
- **Uso:** Sistema principal del MVP
- **Archivos que la usan:**
  - `src/lib/financial-products.ts`
  - `src/app/page.tsx`
  - `src/app/tarjetas-credito/page.tsx`
  - `src/app/prestamos-personales/page.tsx`
  - `src/app/inversiones/page.tsx`
  - `src/app/cuentas-bancarias/page.tsx`
- **Acción:** ✅ **MANTENER Y EXPANDIR**
- **Próximos pasos:** Agregar más productos reales

#### 2. **`reviews`**
- **Registros:** 1 reseña
- **Uso:** Sistema de reseñas de usuarios
- **Archivos que la usan:** `src/data/reviews.ts`
- **Acción:** ✅ **MANTENER**
- **Próximos pasos:** Conectar con `financial_products` usando `product_slug`

#### 3. **`chat_messages`** / **`chat_sessions`**
- **Registros:** 0 (vacías pero necesarias)
- **Uso:** Sistema de chat con IA
- **Archivos que la usan:** `src/app/chat/page.tsx`
- **Acción:** ✅ **MANTENER**
- **Estado:** Funcionales, se llenarán con uso

#### 4. **`users`** (Supabase Auth)
- **Registros:** 0 (vacía pero necesaria)
- **Uso:** Autenticación de usuarios
- **Acción:** ✅ **MANTENER**
- **Estado:** Gestionada por Supabase Auth

---

### ⚠️ DEPRECAR (Sistema Antiguo - Conservar temporalmente)

#### 5. **`productos`**
- **Registros:** 131 productos
- **Problema:** Sistema normalizado antiguo, redundante con `financial_products`
- **Uso actual:** `src/lib/products.ts`, `src/app/products/[id]/page.tsx`
- **Acción:** ⚠️ **DEPRECAR GRADUALMENTE**
- **Plan:**
  1. ✅ Crear `financial_products` (ya hecho)
  2. ⏳ Migrar datos importantes de `productos` a `financial_products`
  3. ⏳ Actualizar código para usar `financial_products`
  4. ⏳ Marcar `productos` como deprecated
  5. 🔜 Eliminar en versión futura

#### 6. **`instituciones`**
- **Registros:** 26 instituciones
- **Problema:** Relacionada con sistema antiguo `productos`
- **Uso actual:** `src/lib/products.ts`
- **Acción:** ⚠️ **DEPRECAR**
- **Razón:** `financial_products` tiene campo `institution` (denormalizado)
- **Alternativa:** Crear tabla simple `institutions` si necesitas logos/info centralizada

#### 7. **`categorias`**
- **Registros:** 3 categorías
- **Problema:** Sistema normalizado innecesario
- **Acción:** ⚠️ **DEPRECAR**
- **Razón:** `financial_products` usa ENUM ('credit_card', 'personal_loan', etc.)

#### 8. **`subcategorias`**
- **Registros:** 9 subcategorías
- **Problema:** Complejidad innecesaria para MVP
- **Acción:** ⚠️ **DEPRECAR**
- **Razón:** MVP usa solo 4 categorías principales

---

### ❌ ELIMINAR (No usadas)

#### 9. **`caracteristicas`**
- **Registros:** 0
- **Uso:** Ninguno
- **Acción:** ❌ **ELIMINAR AHORA**
- **Razón:** Reemplazada por `meta_data` JSONB en `financial_products`

#### 10. **`product_reviews`**
- **Registros:** 0
- **Uso:** Ninguno (duplicada con `reviews`)
- **Acción:** ❌ **ELIMINAR AHORA**

#### 11. **`user_favorites`**
- **Registros:** 0
- **Uso:** Ninguno (no implementada)
- **Acción:** ⏳ **MANTENER PARA FUTURO** o eliminar si no planeas usarla

#### 12. **`profiles`**
- **Registros:** 0
- **Uso:** Ninguno aún
- **Acción:** ⏳ **MANTENER PARA FUTURO**
- **Razón:** Útil para perfiles de usuario extendidos (recomendado por Supabase Auth)

---

## 🎯 Plan de Acción Recomendado

### FASE 1: Limpieza Inmediata (HOY) ✅

```sql
-- Eliminar tablas no usadas y sin datos
DROP TABLE IF EXISTS caracteristicas CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
```

### FASE 2: MVP Enfocado (ESTA SEMANA) 🚀

**Prioridad 1: Alimentar `financial_products`**
- ✅ Ya tienes 12 productos (3 por categoría)
- 🔜 Agregar 10-20 productos más por categoría
- 🔜 Agregar datos reales de México

**Prioridad 2: Sistema de Reviews**
- 🔜 Conectar `reviews` con `financial_products.slug`
- 🔜 Permitir que usuarios dejen reseñas

**Prioridad 3: Ejecutar migraciones**
- ⚠️ **CRÍTICO:** Ejecutar `migrations/EJECUTAR_COMPLETO.sql` en Supabase
- Sin esto, las páginas no funcionarán

### FASE 3: Migración de Datos (PRÓXIMA SEMANA)

```sql
-- Script para migrar productos antiguos a financial_products
-- Solo migrar los productos más importantes (top 50)
INSERT INTO financial_products (...)
SELECT ... FROM productos WHERE rating > 4.0
LIMIT 50;
```

### FASE 4: Deprecación (PRÓXIMO MES)

1. Actualizar todo el código para usar `financial_products`
2. Renombrar tablas antiguas con prefijo `_deprecated_`:
   ```sql
   ALTER TABLE productos RENAME TO _deprecated_productos;
   ALTER TABLE instituciones RENAME TO _deprecated_instituciones;
   ALTER TABLE categorias RENAME TO _deprecated_categorias;
   ALTER TABLE subcategorias RENAME TO _deprecated_subcategorias;
   ```
3. Después de 1 mes sin issues, eliminar definitivamente

---

## 📋 SQL para Limpieza Inmediata

```sql
-- ============================================================================
-- LIMPIEZA INMEDIATA: Eliminar tablas no usadas
-- ============================================================================

-- 1. Eliminar tablas completamente vacías y sin uso
DROP TABLE IF EXISTS caracteristicas CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;

-- 2. Comentar tablas deprecadas (no eliminar todavía)
COMMENT ON TABLE productos IS '⚠️ DEPRECATED - Usar financial_products en su lugar';
COMMENT ON TABLE instituciones IS '⚠️ DEPRECATED - Usar financial_products.institution';
COMMENT ON TABLE categorias IS '⚠️ DEPRECATED - Usar financial_products.category ENUM';
COMMENT ON TABLE subcategorias IS '⚠️ DEPRECATED - No necesario en MVP';

-- 3. Verificar tablas activas
SELECT
    tablename,
    schemaname
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## 🏗️ Arquitectura Final Recomendada

### Tablas Core MVP:
```
✅ financial_products  (Productos financieros - PRINCIPAL)
✅ reviews             (Reseñas de usuarios)
✅ users               (Supabase Auth)
✅ profiles            (Perfiles extendidos)
✅ chat_messages       (Chat IA)
✅ chat_sessions       (Sesiones de chat)
⏳ user_favorites      (Favoritos - futuro)
```

### Tablas Deprecadas (eliminar después):
```
⚠️ productos
⚠️ instituciones
⚠️ categorias
⚠️ subcategorias
```

### Tablas Eliminadas:
```
❌ caracteristicas
❌ product_reviews
```

---

## 📊 Comparación: Sistema Antiguo vs MVP

| Aspecto | Sistema Antiguo | Sistema MVP |
|---------|----------------|-------------|
| Tablas principales | 5 (productos, instituciones, categorias, subcategorias, caracteristicas) | 1 (financial_products) |
| Complejidad | Alta (normalización excesiva) | Baja (polimórfico) |
| Consultas | 3-4 JOINs por query | 1 tabla directa |
| Mantenimiento | Difícil (múltiples tablas) | Fácil (una tabla) |
| Flexibilidad | Baja (schema rígido) | Alta (JSONB para meta_data) |
| Performance | Lenta (JOINs) | Rápida (sin JOINs) |

---

## ✅ Recomendación Final

### ACCIÓN INMEDIATA:
1. ✅ Ejecutar limpieza (eliminar `caracteristicas` y `product_reviews`)
2. ⚠️ **CRÍTICO:** Ejecutar `migrations/EJECUTAR_COMPLETO.sql` en Supabase
3. 🔜 Alimentar `financial_products` con más datos

### MANTENER:
- `financial_products` ⭐
- `reviews`
- `users`
- `profiles`
- `chat_messages`
- `chat_sessions`
- `user_favorites` (para futuro)

### DEPRECAR (conservar 1 mes):
- `productos`
- `instituciones`
- `categorias`
- `subcategorias`

### ELIMINAR AHORA:
- `caracteristicas`
- `product_reviews`

---

**Última actualización:** 2025-01-21
**Próxima revisión:** Después de ejecutar migraciones
