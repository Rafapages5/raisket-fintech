# Raisket Backend API

Backend de IA para el proyecto Raisket. API construida con FastAPI que proporciona funcionalidades de chat con IA, RAG (Retrieval-Augmented Generation) y gestión de documentos vectoriales.

## Características

- **Chat con IA**: Integración con Anthropic Claude y OpenAI GPT
- **Streaming**: Respuestas en tiempo real
- **RAG**: Búsqueda semántica con Pinecone
- **Gestión de Documentos**: CRUD completo de vectores
- **CORS Configurado**: Listo para integración con frontend
- **Production-Ready**: Logging, manejo de errores y validación

## Estructura del Proyecto

```
raisket-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Aplicación principal FastAPI
│   ├── api/
│   │   ├── __init__.py
│   │   ├── chat.py            # Endpoints de chat
│   │   └── workflows.py       # Endpoints de workflows/RAG
│   ├── services/
│   │   ├── __init__.py
│   │   ├── llm_service.py     # Servicio de LLM (Anthropic/OpenAI)
│   │   └── rag_service.py     # Servicio de RAG (Pinecone)
│   └── core/
│       ├── __init__.py
│       └── config.py          # Configuración con Pydantic
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## Instalación

### 1. Clonar/Navegar al directorio

```bash
cd raisket-backend
```

### 2. Crear entorno virtual

**En Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**En Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus API keys
nano .env  # o usa tu editor preferido
```

**Variables requeridas en `.env`:**

```env
# API Keys (REQUERIDAS)
ANTHROPIC_API_KEY=tu_clave_aqui
OPENAI_API_KEY=tu_clave_aqui
PINECONE_API_KEY=tu_clave_aqui

# Pinecone Configuration
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=raisket-knowledge-base

# CORS Configuration
CORS_ORIGINS=https://www.raisket.mx,http://localhost:3000,http://localhost:3001

# Server Configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

# LLM Configuration
DEFAULT_MODEL=claude-3-5-sonnet-20241022
MAX_TOKENS=4096
TEMPERATURE=0.7

# RAG Configuration
TOP_K_RESULTS=5
SIMILARITY_THRESHOLD=0.7
```

## Uso

### Iniciar el servidor

**Desarrollo (con auto-reload):**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**O usando Python directamente:**
```bash
python -m app.main
```

**Producción:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Verificar que funciona

Abre tu navegador en: http://localhost:8000

Deberías ver:
```json
{
  "message": "Raisket Backend API",
  "version": "1.0.0",
  "status": "running",
  "environment": "development",
  "docs": "/docs"
}
```

### Documentación interactiva

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Endpoints Disponibles

### Endpoints Globales

#### `GET /`
Información general de la API

#### `GET /health`
Health check del sistema

```bash
curl http://localhost:8000/health
```

### Endpoints de Chat

#### `POST /chat`
Chat simple sin RAG

**Ejemplo:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hola, ¿qué es Raisket?"}
    ],
    "provider": "anthropic"
  }'
```

#### `POST /chat/stream`
Chat con streaming en tiempo real

**Ejemplo:**
```bash
curl -X POST http://localhost:8000/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Explícame qué es una fintech"}
    ],
    "provider": "anthropic"
  }'
```

#### `POST /chat/rag`
Chat con RAG (búsqueda en documentos)

**Ejemplo:**
```bash
curl -X POST http://localhost:8000/chat/rag \
  -H "Content-Type: application/json" \
  -d '{
    "query": "¿Cuáles son los beneficios de Raisket?",
    "top_k": 5,
    "namespace": "default"
  }'
```

### Endpoints de Workflows

#### `POST /workflows/documents/upsert`
Insertar/actualizar documentos en Pinecone

**Ejemplo:**
```bash
curl -X POST http://localhost:8000/workflows/documents/upsert \
  -H "Content-Type: application/json" \
  -d '{
    "documents": [
      {
        "id": "doc1",
        "text": "Raisket es una plataforma fintech mexicana que ayuda a las personas a gestionar sus finanzas.",
        "metadata": {"category": "intro", "author": "Raisket Team"}
      }
    ],
    "namespace": "default"
  }'
```

#### `POST /workflows/documents/search`
Buscar documentos similares

**Ejemplo:**
```bash
curl -X POST http://localhost:8000/workflows/documents/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "finanzas personales",
    "top_k": 3,
    "namespace": "default"
  }'
```

#### `POST /workflows/documents/delete`
Eliminar documentos

**Ejemplo:**
```bash
curl -X POST http://localhost:8000/workflows/documents/delete \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["doc1", "doc2"],
    "namespace": "default"
  }'
```

#### `GET /workflows/index/stats`
Obtener estadísticas del índice

**Ejemplo:**
```bash
curl http://localhost:8000/workflows/index/stats
```

## Integración con Frontend

### Configuración de CORS

El backend ya está configurado para aceptar requests desde:
- https://www.raisket.mx (producción)
- http://localhost:3000 (desarrollo)
- http://localhost:3001 (desarrollo alternativo)

### Ejemplo de integración en Next.js

```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: message }],
      provider: 'anthropic'
    })
  });

  const data = await response.json();
  return Response.json(data);
}
```

## Desarrollo

### Agregar nuevos endpoints

1. Crear una nueva función en `app/api/chat.py` o `app/api/workflows.py`
2. Decorar con `@router.post()` o `@router.get()`
3. Definir modelos Pydantic para request/response
4. Los endpoints se registran automáticamente

### Agregar nuevos servicios

1. Crear archivo en `app/services/`
2. Implementar clase de servicio
3. Crear instancia global al final del archivo
4. Importar en `app/services/__init__.py`

### Testing

```bash
# Instalar dependencias de testing
pip install pytest pytest-asyncio httpx

# Ejecutar tests (cuando se implementen)
pytest
```

## Deployment

### Variables de entorno en producción

Asegúrate de configurar:
```env
ENVIRONMENT=production
CORS_ORIGINS=https://www.raisket.mx
```

### Opciones de deployment

**Docker:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Railway/Render:**
- Comando de inicio: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**AWS/GCP/Azure:**
- Usar servicios serverless o contenedores
- Configurar auto-scaling según necesidades

## Troubleshooting

### Error: "Module not found"
```bash
# Asegúrate de estar en el entorno virtual
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate      # Windows

# Reinstalar dependencias
pip install -r requirements.txt
```

### Error: "API Key not found"
Verifica que tu archivo `.env` existe y tiene las claves correctas.

### Error de CORS
Agrega tu dominio a `CORS_ORIGINS` en el archivo `.env`.

### Pinecone no conecta
Verifica:
- `PINECONE_API_KEY` es correcta
- `PINECONE_ENVIRONMENT` coincide con tu región
- El índice existe o puede ser creado

## Logs

Los logs se muestran en la consola con formato:
```
2025-11-01 12:00:00 - app.main - INFO - POST /chat
2025-11-01 12:00:01 - app.services.llm_service - INFO - Generando respuesta con Claude
2025-11-01 12:00:03 - app.main - INFO - Status: 200
```

## Seguridad

- Nunca commitees el archivo `.env` (está en `.gitignore`)
- Usa variables de entorno en producción
- Mantén actualizadas las dependencias
- Limita CORS solo a dominios necesarios
- Implementa rate limiting en producción

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades:
- Crear issue en el repositorio
- Contactar al equipo de desarrollo

## Licencia

Propiedad de Raisket. Todos los derechos reservados.

---

**Versión:** 1.0.0
**Última actualización:** 2025-11-01
