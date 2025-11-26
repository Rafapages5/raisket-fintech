# Flujo de Trabajo: Gestión de Productos Financieros

Este documento describe el proceso para agregar, modificar o eliminar productos financieros en la base de datos de Raisket (Supabase).

## Estructura de Datos

La tabla principal es `financial_products`. A continuación se describen los campos clave que deben ser llenados por el equipo de análisis.

### Campos Obligatorios

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `name` | Texto | Nombre comercial del producto | "Tarjeta de Crédito Nu" |
| `slug` | Texto | Identificador único para la URL (debe ser único) | "tarjeta-nu" |
| `institution` | Texto | Nombre de la institución financiera | "Nu México" |
| `category` | Texto | Categoría del producto | "credit_card", "personal_loan", "investment", "banking" |
| `target_audience` | Texto | Público objetivo | "personal" o "business" |
| `is_active` | Booleano | Si el producto está visible en la web | `TRUE` |

### Campos Informativos (Recomendados)

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `description` | Texto | Descripción corta del producto | "Tarjeta sin anualidad..." |
| `main_rate_label` | Texto | Etiqueta de la tasa principal | "CAT Promedio" |
| `main_rate_value` | Texto | Valor de la tasa para mostrar | "66.7%" |
| `main_rate_numeric` | Número | Valor numérico para ordenamiento | `66.7` |
| `benefits` | Array (JSON) | Lista de beneficios clave | `["Sin anualidad", "Cashback"]` |
| `badges` | Array (JSON) | Etiquetas destacadas | `["Sin Anualidad", "Digital"]` |
| `apply_url` | Texto | Link de afiliado o solicitud | "https://nu.com.mx/..." |
| `institution_logo` | Texto | Ruta al logo de la institución | "/images/institutions/nu.svg" |

### Campos de Metadatos (`meta_data`)

El campo `meta_data` es un objeto JSON flexible para guardar detalles específicos que no tienen columna propia.
Ejemplo:
```json
{
  "annuity": 0,
  "cashback": "hasta 5%",
  "min_income": 0,
  "digital_only": true
}
```

## Proceso de Carga de Productos

### Opción 1: Interfaz de Supabase (Recomendado para cambios rápidos)

1.  Ingresar al Dashboard de Supabase.
2.  Ir al **Table Editor**.
3.  Seleccionar la tabla `financial_products`.
4.  Hacer clic en **Insert Row** para agregar uno nuevo o editar una fila existente.
5.  Llenar los campos según la tabla de arriba.
6.  Guardar cambios.

### Opción 2: Carga Masiva (CSV)

Si el equipo de análisis tiene muchos productos nuevos:

1.  Preparar un archivo CSV con las columnas mencionadas.
2.  Asegurarse de que el `slug` sea único.
3.  En Supabase > Table Editor > `financial_products`, usar el botón **Import** y subir el CSV.

### Opción 3: Script SQL

Para inserciones controladas, se puede usar un script SQL en el **SQL Editor** de Supabase:

```sql
INSERT INTO public.financial_products (
  name, slug, institution, category, target_audience, 
  main_rate_label, main_rate_value, main_rate_numeric, 
  description, benefits, is_active
) VALUES (
  'Nombre del Producto',
  'slug-unico-producto',
  'Banco Ejemplo',
  'credit_card', -- credit_card, personal_loan, investment, banking
  'personal',    -- personal, business
  'CAT',
  '50%',
  50.0,
  'Descripción del producto...',
  '["Beneficio 1", "Beneficio 2"]'::jsonb,
  true
);
```

## Eliminación de Productos "Mock" (Legacy)

Se ha eliminado el código heredado que cargaba productos "mock" desde archivos locales (`src/data/products.ts`). Ahora toda la información proviene exclusivamente de la base de datos Supabase.

Si encuentras referencias a `mockProducts` en documentación antigua, puedes ignorarlas.
