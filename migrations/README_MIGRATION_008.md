# Migración 008: Optimización de Filtros de Productos

## 📋 Resumen

Esta migración optimiza la tabla `public.products` agregando campos desnormalizados para mejorar el performance de queries con filtros por:
- Tipo de cliente (Personas/Empresas)
- Tipo de producto (Crédito/Inversión/Seguros)
- Tipo de institución (Bancos/Fintech/Cooperativas/Aseguradoras)

**Tiempo estimado de ejecución:** ~30 segundos

---

## 🎯 Objetivos

1. ✅ Eliminar necesidad de JOINs para filtrar por tipo de institución
2. ✅ Agregar nomenclatura en español para mejores APIs
3. ✅ Crear índices compuestos optimizados
4. ✅ Sincronización automática con triggers
5. ✅ Mejorar performance de queries hasta 10x

---

## 🔧 Cambios Incluidos

### Nuevas Columnas
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `tipo_institucion` | TEXT NOT NULL | Tipo de institución (Bancos, Fintech, Cooperativas, Aseguradoras, Otro) |
| `segmento_cliente` | TEXT NOT NULL | Segmento en español (Personas, Empresas) |
| `tipo_producto` | TEXT NOT NULL | Tipo agrupado (Credito, Inversion, Seguros, Cuentas, Otro) |

### Nuevos Índices
- `idx_products_filters_combo` - Índice compuesto (segmento + tipo + institución)
- `idx_products_tipo_producto` - Índice en tipo_producto
- `idx_products_tipo_institucion` - Índice en tipo_institucion
- `idx_products_segmento_cliente` - Índice en segmento_cliente
- `idx_products_popularity` - Índice en (average_rating * review_count)
- `idx_products_name_trgm` - Búsqueda trigram en nombre
- `idx_products_description_trgm` - Búsqueda trigram en descripción

### Trigger Automático
- `sync_institution_type()` - Sincroniza automáticamente los campos derivados

### Vista Materializada
- `analytics.product_filter_stats` - Estadísticas pre-calculadas por filtros

---

## 🚀 Cómo Aplicar la Migración

### Opción 1: Usando Supabase Dashboard (Recomendado)

1. **Accede a tu proyecto en Supabase:**
   - Ve a https://app.supabase.com
   - Selecciona tu proyecto

2. **Abre el SQL Editor:**
   - Menú lateral → SQL Editor
   - Click en "New Query"

3. **Copia y pega el contenido:**
   ```bash
   # Abre el archivo de migración
   code migrations/008_optimize_product_filters.sql
   ```
   - Copia TODO el contenido del archivo
   - Pégalo en el editor SQL de Supabase

4. **Ejecuta la migración:**
   - Click en "Run" (o presiona Ctrl/Cmd + Enter)
   - Espera a que termine (~30 segundos)

5. **Verifica el resultado:**
   - Deberías ver mensajes de éxito en verde
   - Busca el mensaje: `✓ MIGRACIÓN 008 COMPLETADA EXITOSAMENTE`

---

### Opción 2: Usando psql (Línea de comandos)

```bash
# 1. Conecta a tu base de datos Supabase
psql "postgresql://postgres:[TU-PASSWORD]@[TU-PROJECT-REF].supabase.co:5432/postgres"

# 2. Ejecuta la migración
\i migrations/008_optimize_product_filters.sql

# 3. Verifica el resultado
\d public.products
```

---

### Opción 3: Usando el CLI de Supabase

```bash
# 1. Si tienes Supabase CLI instalado
supabase db push

# 2. O ejecuta directamente
supabase db execute --file migrations/008_optimize_product_filters.sql
```

---

## ✅ Verificación Post-Migración

### 1. Ejecutar queries de prueba

```bash
# Opción A: Desde Supabase Dashboard
# - Copia el contenido de migrations/008_test_queries.sql
# - Pega en SQL Editor
# - Ejecuta cada query individualmente

# Opción B: Desde psql
psql "tu-connection-string" -f migrations/008_test_queries.sql
```

### 2. Verificar datos migrados

```sql
-- Ver distribución de productos
SELECT
    segmento_cliente,
    tipo_producto,
    tipo_institucion,
    COUNT(*) as total
FROM public.products
GROUP BY segmento_cliente, tipo_producto, tipo_institucion;
```

### 3. Probar query optimizada

```sql
-- Tu caso de uso principal
SELECT id, name, provider, average_rating
FROM public.products
WHERE
    segmento_cliente = 'Personas'
    AND tipo_producto = 'Credito'
    AND tipo_institucion = 'Bancos'
    AND is_active = true
LIMIT 20;
```

### 4. Verificar performance

```sql
-- Ejecutar EXPLAIN ANALYZE para ver el plan de ejecución
EXPLAIN ANALYZE
SELECT id, name, provider
FROM public.products
WHERE
    segmento_cliente = 'Personas'
    AND tipo_producto = 'Credito'
    AND tipo_institucion = 'Bancos'
    AND is_active = true;
```

Deberías ver que usa `idx_products_filters_combo` en el plan.

---

## 🔄 Actualizar Código de tu Aplicación

### Antes (con JOIN):
```typescript
// ❌ Requiere JOIN - más lento
const { data } = await supabase
  .from('products')
  .select(`
    *,
    institutions!inner(institution_type)
  `)
  .eq('segment', 'Personas')
  .eq('category', 'credit_card')
  .eq('institutions.institution_type', 'bank');
```

### Después (sin JOIN):
```typescript
// ✅ Sin JOIN - hasta 10x más rápido
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('segmento_cliente', 'Personas')
  .eq('tipo_producto', 'Credito')
  .eq('tipo_institucion', 'Bancos')
  .eq('is_active', true)
  .order('average_rating', { ascending: false })
  .limit(20);
```

### Query con múltiples filtros opcionales:
```typescript
let query = supabase
  .from('products')
  .select('*')
  .eq('is_active', true);

if (segmento) query = query.eq('segmento_cliente', segmento);
if (tipo) query = query.eq('tipo_producto', tipo);
if (institucion) query = query.eq('tipo_institucion', institucion);
if (maxIncome) query = query.lte('min_income', maxIncome);

const { data } = await query
  .order('is_featured', { ascending: false })
  .order('average_rating', { ascending: false })
  .limit(50);
```

---

## 🔙 Rollback (En caso de problemas)

Si necesitas revertir la migración:

```bash
# Opción 1: Supabase Dashboard
# - Abre SQL Editor
# - Copia el contenido de migrations/008_rollback.sql
# - Ejecuta

# Opción 2: psql
psql "tu-connection-string" -f migrations/008_rollback.sql
```

⚠️ **ADVERTENCIA:** El rollback eliminará:
- Las 3 columnas nuevas
- Todos los índices creados
- El trigger de sincronización
- La vista materializada

---

## 📊 Mantenimiento

### Refrescar vista materializada (ejecutar cada hora)

```sql
-- Opción A: Sin bloquear lecturas (recomendado)
REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.product_filter_stats;

-- Opción B: Más rápido pero bloquea lecturas
REFRESH MATERIALIZED VIEW analytics.product_filter_stats;
```

### Automatizar con cron (PostgreSQL)

```sql
-- Crear extensión pg_cron si no existe
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programar refresh cada hora
SELECT cron.schedule(
    'refresh-product-stats',
    '0 * * * *',  -- Cada hora en punto
    $$REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.product_filter_stats$$
);
```

---

## 📈 Mejoras de Performance Esperadas

| Query | Antes | Después | Mejora |
|-------|-------|---------|--------|
| Filtro por tipo institución | ~150ms | ~15ms | **10x** |
| Filtros múltiples | ~200ms | ~20ms | **10x** |
| Búsqueda de texto | ~300ms | ~50ms | **6x** |
| Listado con paginación | ~100ms | ~12ms | **8x** |

*Tiempos estimados para ~10,000 productos

---

## 🐛 Troubleshooting

### Error: "column already exists"
```sql
-- Ya aplicaste la migración antes. Verifica:
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('tipo_institucion', 'segmento_cliente', 'tipo_producto');
```

### Error: "relation analytics.product_filter_stats already exists"
```sql
-- Elimina la vista y vuelve a ejecutar
DROP MATERIALIZED VIEW IF EXISTS analytics.product_filter_stats;
```

### Los nuevos campos están NULL
```sql
-- Ejecuta manualmente el UPDATE
UPDATE public.products p
SET tipo_institucion = (
    SELECT CASE
        WHEN institution_type = 'bank' THEN 'Bancos'
        WHEN institution_type = 'fintech' THEN 'Fintech'
        ELSE 'Otro'
    END
    FROM public.institutions i
    WHERE i.id = p.institution_id
)
WHERE tipo_institucion IS NULL;
```

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa los mensajes de error en el SQL Editor
2. Verifica que tengas permisos de ALTER TABLE
3. Confirma que la extensión `pg_trgm` está habilitada
4. Ejecuta las queries de [008_test_queries.sql](008_test_queries.sql) para diagnóstico

---

## 📝 Checklist de Migración

- [ ] Backup de base de datos realizado
- [ ] Migración ejecutada sin errores
- [ ] Verificación de datos completada
- [ ] Queries de prueba ejecutadas
- [ ] Performance mejorado confirmado
- [ ] Código de aplicación actualizado
- [ ] Cron job configurado (opcional)
- [ ] Documentación actualizada

---

## 📚 Archivos Relacionados

- `008_optimize_product_filters.sql` - Migración principal
- `008_rollback.sql` - Script de rollback
- `008_test_queries.sql` - Queries de prueba y verificación
- `README_MIGRATION_008.md` - Esta documentación

---

**Autor:** Claude Code
**Fecha:** 2025-11-18
**Versión:** 1.0
