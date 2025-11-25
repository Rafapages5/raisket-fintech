# 📊 Template Excel para Productos Raisket

## Estructura del Excel

Crea un archivo Excel con 4 pestañas:

---

## PESTAÑA 1: PRODUCTOS_BASE

### Columnas (en este orden):

| # | Columna | Ejemplo | Notas |
|---|---------|---------|-------|
| 1 | id | `uuid_generate_v4()` | UUID único |
| 2 | institucion_id | (UUID de institución) | Debe existir en tabla instituciones |
| 3 | subcategoria_id | (UUID de subcategoría) | Debe existir en tabla subcategorias |
| 4 | nombre | Tarjeta BBVA Azul | Nombre del producto |
| 5 | tagline | Tu primera tarjeta sin anualidad | Frase corta |
| 6 | descripcion | Tarjeta ideal para iniciar... | 1-2 oraciones |
| 7 | descripcion_larga | La Tarjeta BBVA Azul es perfecta... | Descripción completa |
| 8 | segmento | personas | "personas" o "empresas" |
| 9 | imagen_url | https://... | URL de imagen |
| 10 | ai_hint | tarjeta de crédito azul | Palabras clave |
| 11 | proveedor | BBVA México | Nombre del banco |
| 12 | rating_promedio | 4.5 | Número decimal |
| 13 | total_reviews | 2340 | Número entero |
| 14 | elegibilidad | Mayor de 18 años | Texto simple |
| 15 | url_detalles | https://www.bbva.mx/... | URL oficial |
| 16 | activo | TRUE | TRUE o FALSE |
| 17 | slug | bbva-azul | URL amigable (sin espacios) |
| 18 | **pros** | Sin anualidad\|Cashback\|Construcción historial | **Separar por \|** |
| 19 | **cons** | Tasa alta 42%\|Límite inicial bajo | **Separar por \|** |
| 20 | logo_url | https://www.bbva.mx/logo.svg | URL del logo |
| 21 | vigencia_inicio | 2025-01-01 | Formato YYYY-MM-DD |
| 22 | vigencia_fin | 2025-12-31 | Formato YYYY-MM-DD |
| 23 | terminos_condiciones_url | https://... | URL términos |

---

## PESTAÑA 2: PRODUCTOS_INVERSION

### Columnas (en este orden):

| # | Columna | Ejemplo | Notas |
|---|---------|---------|-------|
| 1 | id_producto | (mismo UUID de PRODUCTOS_BASE) | Para hacer match |
| 2 | rendimiento_anual | 15% | Con símbolo % |
| 3 | gat_nominal | 16.18% | Con símbolo % |
| 4 | gat_real | 11.97% | Con símbolo % |
| 5 | liquidez | 24/7 inmediata | Descripción de liquidez |
| 6 | monto_minimo | $0.01 | Con símbolo $ |
| 7 | monto_maximo | $25,000 | Con símbolo $ y comas |
| 8 | **requisitos** | 1 compra al mes\|Mayor de 18 | **Separar por \|** |
| 9 | proteccion | Fondo IPAB hasta 25K UDIs | Descripción |
| 10 | **comisiones** | $0 apertura\|$0 mantenimiento\|$0 retiros | **Separar por \|** |

### Ejemplo Fila Completa:
```
abc-123 | 15% | 16.18% | 11.97% | 24/7 inmediata | $0.01 | $25,000 | 1 compra al mes|Mayor de 18 | Fondo IPAB hasta 25K UDIs | $0 apertura|$0 mantenimiento
```

---

## PESTAÑA 3: PRODUCTOS_CREDITO

### Columnas (en este orden):

| # | Columna | Ejemplo | Notas |
|---|---------|---------|-------|
| 1 | id_producto | (mismo UUID de PRODUCTOS_BASE) | Para hacer match |
| 2 | cat | 45.2% | Con símbolo % |
| 3 | pago_mensual_ejemplo | $450 | Con símbolo $ |
| 4 | pago_mensual_nota | (Crédito de $5,000 con pago mínimo) | Nota explicativa |
| 5 | liquidez | Crédito renovable mensual | Tipo de crédito |
| 6 | monto_minimo | $1,000 | Con símbolo $ |
| 7 | monto_maximo | $50,000 | Con símbolo $ |
| 8 | aprobacion | En 5 días hábiles | Tiempo de aprobación |
| 9 | disposicion | Línea de crédito inmediata | Método |
| 10 | **requisitos** | Edad 18-70\|Ingresos $5,000/mes\|ID oficial | **Separar por \|** |
| 11 | proteccion | Seguro contra fraude incluido | Tipo de seguro |
| 12 | **comisiones** | $0 anualidad\|$30 efectivo\|$50 pago tardío | **Separar por \|** |

### Ejemplo Fila Completa:
```
def-456 | 45.2% | $450 | (Crédito de $5,000) | Crédito renovable | $1,000 | $50,000 | En 5 días | Inmediata | Edad 18-70|Ingresos $5,000 | Seguro fraude | $0 anualidad|$30 efectivo
```

---

## PESTAÑA 4: PRODUCTOS_FINANCIAMIENTO

### Columnas (en este orden):

| # | Columna | Ejemplo | Notas |
|---|---------|---------|-------|
| 1 | id_producto | (mismo UUID de PRODUCTOS_BASE) | Para hacer match |
| 2 | cat | 45.8% | Con símbolo % |
| 3 | ejemplo_financiamiento | $3,000 en 4 quincenas → $750 c/u sin interés | Ejemplo completo |
| 4 | monto_minimo | $300 | Con símbolo $ |
| 5 | monto_maximo | $12,000 | Con símbolo $ |
| 6 | liquidez | Línea renovable | Tipo de línea |
| 7 | aprobacion | Instantánea (en segundos) | Tiempo |
| 8 | **tiendas_participantes** | Amazon\|Liverpool\|Walmart\|Elektra | **Separar por \|** |
| 9 | total_tiendas | 1500 | Número entero |
| 10 | **requisitos** | Mayor de 18\|INE vigente\|CURP\|Celular | **Separar por \|** |
| 11 | **costos_adicionales** | Interés 10%\|Comisión $150\|Anualidad $0 | **Separar por \|** |
| 12 | **ideal_para** | Compras emergentes\|Sin tarjeta\|Historial | **Separar por \|** |
| 13 | tips_raisket | Ver formato JSON abajo | **JSON completo** |
| 14 | contacto | Ver formato JSON abajo | **JSON completo** |

### Formato JSON para `tips_raisket`:
```json
[{"tipo": "positivo", "texto": "Usa solo en tiendas con 0% interés"}, {"tipo": "neutro", "texto": "Paga antes de tiempo si puedes"}, {"tipo": "negativo", "texto": "Evita acumular múltiples financiamientos"}]
```

### Formato JSON para `contacto`:
```json
{"telefono": "55-4000-5000", "email": "ayuda@kueski.com", "horario": "Lun-Dom 8am-10pm"}
```

---

## 📝 EJEMPLOS COMPLETOS

### Ejemplo 1: Producto de Inversión (Nu Cajita Turbo)

**PRODUCTOS_BASE:**
```
abc-123 | inst-nu | subcat-inv | Cajita Turbo | Ahorra y gana con Nu | Cuenta de inversión líquida | La Cajita Turbo... | personas | https://... | cuenta inversión | Nu México | 4.8 | 1234 | Mayor de 18 | https://nu.com.mx | TRUE | nu-cajita-turbo | Tasa competitiva|Liquidez 24/7|Sin comisiones | Límite $25K|Requiere tarjeta Nu | https://nu-logo.svg | 2025-10-09 | 2025-11-19 | https://nu.com.mx/terminos
```

**PRODUCTOS_INVERSION:**
```
abc-123 | 15% | 16.18% | 11.97% | 24/7 inmediata | $0.01 | $25,000 | 1 compra al mes con tarjeta Nu | Fondo IPAB hasta 25K UDIs | $0 apertura|$0 mantenimiento|$0 retiros
```

### Ejemplo 2: Producto de Crédito (BBVA Azul)

**PRODUCTOS_BASE:**
```
def-456 | inst-bbva | subcat-cred | Tarjeta BBVA Azul | Tu primera tarjeta | Ideal para iniciar... | La Tarjeta BBVA... | personas | https://... | tarjeta azul | BBVA México | 4.5 | 2340 | Mayor de 18 | https://bbva.mx | TRUE | bbva-azul | Sin anualidad|Cashback|Construcción historial | Tasa alta 42%|Límite bajo | https://bbva-logo.svg | 2025-01-01 | 2025-12-31 | https://bbva.mx/terminos
```

**PRODUCTOS_CREDITO:**
```
def-456 | 45.2% | $450 | (Crédito de $5,000 con pago mínimo) | Crédito renovable mensual | $1,000 | $50,000 | En 5 días hábiles | Línea inmediata | Edad 18-70|Ingresos $5,000/mes|ID oficial | Seguro contra fraude | $0 anualidad|$30 efectivo|$50 pago tardío
```

### Ejemplo 3: Producto de Financiamiento (Kueski Pay)

**PRODUCTOS_BASE:**
```
ghi-789 | inst-kueski | subcat-fin | Kueski Pay | Compra ahora, paga después | Financiamiento sin tarjeta | Kueski Pay te permite... | personas | https://... | financiamiento kueski | Kueski | 4.3 | 5621 | Mayor de 18 | https://kueski.com | TRUE | kueski-pay | Aprobación inmediata|0% selectas|Sin tarjeta|100% digital | Monto limitado|Solo tiendas participantes|Sobreendeudamiento | https://kueski-logo.svg | NULL | NULL | https://kueski.com/terminos
```

**PRODUCTOS_FINANCIAMIENTO:**
```
ghi-789 | 45.8% | $3,000 en 4 quincenas → $750 cada quincena sin interés | $300 | $12,000 | Línea renovable | Instantánea (segundos) | Amazon|Liverpool|Walmart|Elektra|Coppel|Sears | 1500 | Mayor de 18|INE vigente|CURP|Celular activo|Tarjeta débito | Interés moratorio: 10%|Comisión tardío: $150|Comisión uso: $0|Anualidad: $0 | Compras emergentes|Sin tarjeta crédito|Construir historial | [{"tipo": "positivo", "texto": "Usa solo en 0%"}, {"tipo": "neutro", "texto": "Paga antes"}, {"tipo": "negativo", "texto": "Evita acumular"}] | {"telefono": "55-4000-5000", "email": "ayuda@kueski.com", "horario": "Lun-Dom 8am-10pm"}
```

---

## 🚀 Cómo Usar el Script de Carga

1. **Instalar dependencias:**
```bash
pip install pandas openpyxl supabase python-dotenv
```

2. **Preparar tu Excel** con las 4 pestañas según este template

3. **Ejecutar el script:**
```bash
python scripts/upload-excel-to-supabase.py ruta/a/tu/archivo.xlsx
```

4. **Verificar en Supabase** que los datos se subieron correctamente

---

## ⚠️ IMPORTANTE

### Campos que SIEMPRE usan separador `|`:
- `pros`
- `cons`
- `requisitos`
- `comisiones`
- `tiendas_participantes`
- `costos_adicionales`
- `ideal_para`

### Campos que usan JSON (como texto en Excel):
- `tips_raisket`
- `contacto`

### Campos de fecha:
- Formato: `YYYY-MM-DD`
- Ejemplo: `2025-01-01`
- Si no aplica: dejar vacío o `NULL`

### Campos numéricos:
- `rating_promedio`: decimal (ej: 4.5)
- `total_reviews`: entero (ej: 2340)
- `total_tiendas`: entero (ej: 1500)

### Campos booleanos:
- `activo`: `TRUE` o `FALSE`

---

## 📞 Soporte

Si tienes problemas con el script o el formato del Excel, verifica:
1. Que todas las pestañas tengan los nombres exactos
2. Que las columnas estén en el orden correcto
3. Que los arrays usen `|` como separador
4. Que los JSON estén bien formateados (usa un validador JSON online)

