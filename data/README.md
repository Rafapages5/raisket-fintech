# Datos para RAG - Documentos Financieros Mexicanos

Este directorio contiene los documentos oficiales mexicanos para alimentar el sistema RAG de Raisket.

## Estructura de Carpetas

```
/data
├── sat/              # Documentos del SAT (impuestos, deducciones)
├── cnbv/             # Documentos de CNBV (regulación bancaria)
├── banxico/          # Documentos de Banxico (economía)
├── condusef/         # Documentos de Condusef (derechos financieros)
├── cetes_afores/     # Guías de CETES, Afores, etc.
├── metadata.csv      # Metadata de todos los documentos
├── urls_config.json  # Configuración de URLs (TÚ EDITAS ESTE)
└── download_docs.py  # Script de descarga automatizada
```

## Cómo Usar

### 1. Instalar Dependencias

```bash
cd data
pip install -r requirements.txt
```

### 2. Configurar URLs

Edita el archivo `urls_config.json` y reemplaza todas las URLs de ejemplo:

```json
{
  "SAT": [
    {
      "titulo": "Guía de deducciones personales 2024",
      "url": "https://www.sat.gob.mx/tu-url-real-aqui.pdf",
      "categoria": "impuestos",
      "descripcion": "Guía oficial sobre deducciones personales"
    }
  ]
}
```

**IMPORTANTE:** Reemplaza `REEMPLAZAR_CON_URL_REAL` con las URLs reales de los PDFs oficiales.

### 3. Ejecutar Descarga

```bash
python download_docs.py
```

El script automáticamente:
- ✅ Descarga todos los PDFs de las URLs configuradas
- ✅ Verifica que sean PDFs con texto (no escaneados)
- ✅ Organiza en carpetas por fuente
- ✅ Genera `metadata.csv` con toda la información
- ✅ Muestra estadísticas de descarga

### 4. Verificar Resultados

El archivo `metadata.csv` contendrá:
- `titulo`: Nombre del documento
- `fuente`: Institución (SAT, CNBV, etc.)
- `fecha_descarga`: Cuándo se descargó
- `categoria`: Categoría temática
- `descripcion`: Descripción breve
- `ruta_archivo`: Ubicación del PDF

## Características del Script

### Verificación Automática
- ❌ Rechaza PDFs escaneados (solo imágenes)
- ✅ Solo acepta PDFs con texto extraíble
- 🔍 Analiza las primeras 3 páginas para verificar

### Manejo de Errores
- Timeout de 30 segundos por descarga
- Headers de navegador para evitar bloqueos
- Reintentos automáticos en caso de fallo
- Reportes detallados de errores

### Metadata Automática
- Fecha de descarga
- Categorización
- Rutas relativas para portabilidad
- Formato CSV para fácil procesamiento

## Objetivo de Documentos

| Fuente | Meta | Categoría |
|--------|------|-----------|
| SAT | 10 docs | Impuestos, deducciones |
| CNBV | 10 docs | Regulación bancaria |
| Banxico | 5 docs | Economía, política monetaria |
| Condusef | 10 docs | Derechos financieros |
| CETES/Afores | 10 docs | Inversión, ahorro |
| **TOTAL** | **45 docs** | |

## Fuentes Oficiales Recomendadas

### SAT - https://www.sat.gob.mx
- Guías de trámites fiscales
- Manuales de declaraciones
- Información sobre regímenes fiscales

### CNBV - https://www.gob.mx/cnbv
- Leyes y regulaciones bancarias
- Circulares normativas
- Guías de protección al usuario

### Banxico - https://www.banxico.org.mx
- Reportes de política monetaria
- Estudios económicos
- Información del sistema financiero

### Condusef - https://www.gob.mx/condusef
- Guías de derechos del usuario
- Tutoriales de productos financieros
- Información de protección al consumidor

### CETES Directo - https://www.cetesdirecto.com
- Guías de inversión
- Tutoriales de la plataforma
- Información de instrumentos

## Próximos Pasos

Una vez descargados los documentos:
1. ✅ Verificar que `metadata.csv` esté completo
2. ✅ Confirmar que todos los PDFs tienen texto
3. ➡️ Proceder con el procesamiento de embeddings
4. ➡️ Integrar con el sistema RAG

## Notas Importantes

- Los documentos deben ser oficiales y de fuentes gubernamentales
- Verifica que tengas derecho a descargar y usar los documentos
- Los PDFs escaneados NO funcionarán con el RAG (necesitan OCR)
- Mantén las URLs actualizadas si los documentos cambian
