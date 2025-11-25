# 📋 Guía Rápida: Cómo Agregar Productos desde Excel

## 🚀 Proceso Completo en 4 Pasos

### Paso 1: Prepara tu Excel
Crea un archivo Excel con **4 pestañas** (tabs) con estos nombres EXACTOS:
- `PRODUCTOS_BASE`
- `PRODUCTOS_INVERSION`
- `PRODUCTOS_CREDITO`
- `PRODUCTOS_FINANCIAMIENTO`

### Paso 2: Llena las Columnas

#### Para TODOS los productos (PRODUCTOS_BASE):
```
id | institucion_id | subcategoria_id | nombre | tagline | descripcion | descripcion_larga | segmento | imagen_url | ai_hint | proveedor | rating_promedio | total_reviews | elegibilidad | url_detalles | activo | slug | pros | cons | logo_url | vigencia_inicio | vigencia_fin | terminos_condiciones_url
```

**Arrays (separar con |):**
- `pros`: Ventaja 1|Ventaja 2|Ventaja 3
- `cons`: Desventaja 1|Desventaja 2

#### Si es INVERSIÓN (PRODUCTOS_INVERSION):
```
id_producto | rendimiento_anual | gat_nominal | gat_real | liquidez | monto_minimo | monto_maximo | requisitos | proteccion | comisiones
```

**Arrays (separar con |):**
- `requisitos`: Requisito 1|Requisito 2
- `comisiones`: $0 apertura|$0 mantenimiento

#### Si es CRÉDITO (PRODUCTOS_CREDITO):
```
id_producto | cat | pago_mensual_ejemplo | pago_mensual_nota | liquidez | monto_minimo | monto_maximo | aprobacion | disposicion | requisitos | proteccion | comisiones
```

#### Si es FINANCIAMIENTO (PRODUCTOS_FINANCIAMIENTO):
```
id_producto | cat | ejemplo_financiamiento | monto_minimo | monto_maximo | liquidez | aprobacion | tiendas_participantes | total_tiendas | requisitos | costos_adicionales | ideal_para | tips_raisket | contacto
```

**JSON especial:**
- `tips_raisket`:
```json
[{"tipo": "positivo", "texto": "Tip verde"}, {"tipo": "neutro", "texto": "Tip amarillo"}, {"tipo": "negativo", "texto": "Tip rojo"}]
```

- `contacto`:
```json
{"telefono": "55-1234-5678", "email": "ayuda@banco.com", "horario": "Lun-Vie 9am-6pm"}
```

### Paso 3: Ejecuta el Script

```bash
python scripts/upload-excel-to-supabase.py ruta/al/archivo.xlsx
```

### Paso 4: Verifica en tu Web

Abre: `http://localhost:3000/products/[slug-del-producto]`

---

## 📝 Ejemplos Rápidos por Tipo

### Ejemplo Inversión (Nu Cajita Turbo)

**PRODUCTOS_BASE:**
```
pros: Tasa competitiva 15%|Liquidez 24/7|Sin comisiones
cons: Límite $25K|Requiere 1 compra/mes con tarjeta Nu
```

**PRODUCTOS_INVERSION:**
```
rendimiento_anual: 15%
gat_nominal: 16.18%
gat_real: 11.97%
liquidez: 24/7 inmediata
monto_minimo: $0.01
monto_maximo: $25,000
requisitos: 1 compra al mes con tarjeta Nu
proteccion: Fondo IPAB hasta 25K UDIs
comisiones: $0 apertura|$0 mantenimiento|$0 retiros
```

### Ejemplo Crédito (BBVA Azul)

**PRODUCTOS_BASE:**
```
pros: Sin anualidad|Cashback gasolina|Construye historial
cons: Tasa alta 42%|Límite inicial bajo
```

**PRODUCTOS_CREDITO:**
```
cat: 45.2%
pago_mensual_ejemplo: $450
pago_mensual_nota: (Crédito de $5,000 con pago mínimo)
liquidez: Crédito renovable mensual
monto_minimo: $1,000
monto_maximo: $50,000
aprobacion: En 5 días hábiles
disposicion: Línea de crédito inmediata
requisitos: Edad 18-70|Ingresos $5,000/mes|ID oficial
comisiones: $0 anualidad|$30 efectivo|$50 pago tardío
```

### Ejemplo Financiamiento (Kueski Pay)

**PRODUCTOS_BASE:**
```
pros: Aprobación inmediata|0% en selectas|Sin tarjeta|100% digital
cons: Monto limitado|Solo tiendas participantes|Riesgo sobreendeudamiento
```

**PRODUCTOS_FINANCIAMIENTO:**
```
cat: 45.8%
ejemplo_financiamiento: $3,000 en 4 quincenas → $750 c/u sin interés
monto_minimo: $300
monto_maximo: $12,000
liquidez: Línea renovable
aprobacion: Instantánea (segundos)
tiendas_participantes: Amazon|Liverpool|Walmart|Elektra|Coppel|Sears
total_tiendas: 1500
requisitos: Mayor de 18|INE vigente|CURP|Celular activo|Tarjeta débito
costos_adicionales: Interés moratorio: 10%|Comisión tardío: $150|Comisión uso: $0|Anualidad: $0
ideal_para: Compras emergentes|Sin tarjeta crédito|Construir historial
tips_raisket: [{"tipo": "positivo", "texto": "Usa solo en tiendas con 0% interés"}, {"tipo": "neutro", "texto": "Paga antes de tiempo si puedes"}, {"tipo": "negativo", "texto": "Evita acumular múltiples financiamientos"}]
contacto: {"telefono": "55-4000-5000", "email": "ayuda@kueski.com", "horario": "Lun-Dom 8am-10pm"}
```

---

## ⚠️ Reglas Importantes

### Campos con Pipe Separator (|)
✅ **USA PIPE** en:
- pros
- cons
- requisitos
- comisiones
- tiendas_participantes
- costos_adicionales
- ideal_para

❌ **NO uses comas (,) ni punto y coma (;)**

### Campos JSON
✅ **USA JSON completo** en:
- tips_raisket
- contacto

❌ **NO uses comillas simples**, solo comillas dobles `"`

### Fechas
✅ Formato: `YYYY-MM-DD` (ej: 2025-01-15)
❌ NO uses: 15/01/2025 o 01-15-2025

### Booleanos
✅ USA: `TRUE` o `FALSE`
❌ NO uses: true, false, 1, 0

### IDs (UUIDs)
Genera con: `uuid_generate_v4()` en Supabase
O usa: https://www.uuidgenerator.net/

---

## 🔍 Verificación Rápida

Antes de subir tu Excel, verifica:

- [ ] Los 4 tabs tienen los nombres EXACTOS
- [ ] Todos los arrays usan `|` como separador
- [ ] Los JSON tienen comillas dobles `"`
- [ ] Las fechas están en formato YYYY-MM-DD
- [ ] Los UUIDs son válidos
- [ ] `institucion_id` y `subcategoria_id` existen en Supabase

---

## 🆘 Solución de Problemas

**Error: "Institution not found"**
→ Verifica que el `institucion_id` existe en la tabla `instituciones`

**Error: "Invalid JSON"**
→ Valida tu JSON en: https://jsonlint.com/

**Error: "Array parse error"**
→ Asegúrate de usar `|` sin espacios adicionales

**El producto no se ve en la web**
→ Verifica que `activo = TRUE` y que el `slug` es único

---

## 📚 Documentación Completa

Para más detalles, consulta:
- `TEMPLATE-EXCEL-PRODUCTOS.md` - Template completo con todos los campos
- `IMPLEMENTACION-PAGINAS-PRODUCTO.md` - Arquitectura del sistema
- `scripts/upload-excel-to-supabase.py` - Script de carga

---

¡Listo para agregar productos a Raisket! 🚀
