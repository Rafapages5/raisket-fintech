# 📊 Migración de Excel a Supabase

Este script automatizado permite migrar productos financieros desde archivos Excel a Supabase de forma masiva, con validación y manejo de errores.

## 🚀 Uso Rápido

```bash
npm run migrate:excel
```

## 📁 Estructura de Archivos

Los archivos Excel deben estar en `scripts/excel-data/`:
- `Credito.xlsx` - Productos de crédito (tarjetas)
- `Financiamiento.xlsx` - Productos de financiamiento (préstamos)
- `Inversion.xlsx` - Productos de inversión

## 📋 Formato del Excel

### Columnas Requeridas
- `name` - Nombre del producto (REQUERIDO)
- `provider` - Nombre de la institución/banco (REQUERIDO)

### Columnas Opcionales Comunes
- `tagline` - Frase descriptiva corta
- `description` - Descripción del producto
- `longDescription` - Descripción detallada
- `segment` - "Personas" o "Empresas" (default: "Personas")
- `imageUrl` - URL de la imagen
- `features` - Características separadas por comas
- `benefits` - Beneficios separados por comas
- `eligibility` - Requisitos separados por comas
- `detailsUrl` - URL del producto en el sitio oficial
- `aiHint` - Texto para mejorar búsquedas con IA

### Columnas Específicas por Categoría

#### Crédito (Credito.xlsx)
- `interestRate` - Ej: "29.9% - 49.9% anual" o "Desde 29.9%"
- `maxLoanAmount` - Ej: "$50,000" o "50000"
- `fees` - Ej: "Sin anualidad" o "$500"

#### Financiamiento (Financiamiento.xlsx)
- `interestRate` - Ej: "12.5% - 35% anual"
- `loanTerm` - Ej: "12-60 meses" o "Desde 12 meses"
- `maxLoanAmount` - Ej: "$500,000"

#### Inversión (Inversion.xlsx)
- `interestRate` - Rendimiento anual, Ej: "11.25%"
- `minInvestment` - Ej: "$100" o "100"
- `investmentType` - Ej: "CETES", "Fondos de Inversión"

## ✨ Características del Script

### 🔍 Validación Automática
- Verifica campos requeridos (name, provider)
- Parsea valores numéricos desde texto ("$50,000" → 50000)
- Extrae rangos de tasas ("29.9% - 49.9%" → min: 29.9, max: 49.9)
- Valida formato de datos antes de insertar

### 🏢 Gestión de Instituciones
- Busca instituciones existentes en la BD
- Crea automáticamente instituciones nuevas
- Usa caché para evitar consultas duplicadas

### 🔗 Relaciones Automáticas
- Asocia productos con instituciones
- Vincula con subcategorías correctas
- Crea características específicas por tipo de producto
- Inserta features y benefits como registros separados

### 📊 Reportes Detallados
```
✅ Successfully migrated: 47 products
🏢 Institutions created/used: 12
❌ Errors: 3

❌ ERRORS:
  Row 15 - Tarjeta Oro: Missing required fields: provider
  Row 28 - Préstamo Auto: Invalid interest rate format
  Row 42 - CETES Plus: Subcategory not found
```

### 🔄 Idempotencia
- Genera slugs únicos para evitar duplicados
- Maneja errores sin romper la migración completa
- Continúa procesando aunque fallen algunos registros

## 📝 Ejemplos de Datos

### Ejemplo Crédito
```
name: BBVA Azul
tagline: La tarjeta que te da más
provider: BBVA México
description: Tarjeta sin anualidad con cashback
segment: Personas
interestRate: 29.9% - 49.9% anual
maxLoanAmount: $50,000
fees: Sin anualidad
features: Cashback 1.5%, Sin anualidad, App móvil
benefits: Programa de recompensas, Seguro de compras
```

### Ejemplo Financiamiento
```
name: Préstamo Personal BBVA
tagline: Hasta $500,000 sin garantía
provider: BBVA México
interestRate: 12.5% - 35% anual
loanTerm: 12-60 meses
maxLoanAmount: $500,000
features: Tasa fija, Sin comisiones, Aprobación rápida
```

### Ejemplo Inversión
```
name: CETES Directo
tagline: Invierte desde $100 pesos
provider: Nacional Financiera
interestRate: 11.25%
minInvestment: $100
investmentType: CETES
features: Inversión gubernamental, Liquidez, Desde $100
```

## ⚙️ Requisitos Previos

### 1. Tablas en Supabase
Asegúrate de tener estas tablas creadas:
- `instituciones`
- `categorias`
- `subcategorias`
- `productos`
- `caracteristicas_credito`
- `caracteristicas_financiamiento`
- `caracteristicas_inversion`
- `producto_caracteristicas`

### 2. Datos Base
Debes tener estas subcategorías creadas:
```sql
-- Verificar que existan
SELECT * FROM subcategorias WHERE slug IN (
  'tarjeta_credito',
  'prestamo_personal',
  'cuenta_inversion'
);
```

### 3. Variables de Entorno
En `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
```

## 🐛 Troubleshooting

### Error: "Subcategory not found"
Ejecuta en Supabase SQL Editor:
```sql
INSERT INTO categorias (nombre, slug) VALUES
  ('Crédito', 'credito'),
  ('Financiamiento', 'financiamiento'),
  ('Inversión', 'inversion');

INSERT INTO subcategorias (categoria_id, nombre, slug)
SELECT c.id, 'Tarjeta de Crédito', 'tarjeta_credito'
FROM categorias c WHERE c.slug = 'credito';
```

### Error: "Missing required fields"
Verifica que tu Excel tenga las columnas `name` y `provider` con valores en todas las filas.

### Error: "File not found"
Asegúrate de que los archivos estén en `scripts/excel-data/`:
```bash
ls scripts/excel-data/
# Debe mostrar: Credito.xlsx, Financiamiento.xlsx, Inversion.xlsx
```

## 🔒 Seguridad

Los archivos Excel en `scripts/excel-data/` están en `.gitignore` para evitar subir datos sensibles al repositorio.

## 📞 Soporte

Si tienes problemas:
1. Revisa el log de errores detallado
2. Verifica que las columnas del Excel coincidan con el formato esperado
3. Confirma que las tablas en Supabase existan
