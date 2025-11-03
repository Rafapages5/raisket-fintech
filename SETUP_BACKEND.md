# 🚀 Configuración del Backend de Raisket

## Estado Actual
✅ Código completo y funcional
✅ Dependencias definidas
⚠️ Falta configuración de credenciales

## Pasos para Configurar

### 1. Crear archivo `.env` en `raisket-backend/`

```bash
cd raisket-backend
cp .env.example .env
```

### 2. Obtener API Key de Anthropic

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys"
4. Genera una nueva API Key
5. Copia la key (comienza con `sk-ant-api03-...`)

### 3. Configurar el archivo `.env`

Edita `raisket-backend/.env` y agrega:

```env
# OBLIGATORIO - Para el chat con IA
ANTHROPIC_API_KEY=sk-ant-api03-tu-key-aqui

# OPCIONAL - Solo si usas RAG
OPENAI_API_KEY=sk-proj-tu-key-aqui
PINECONE_API_KEY=pcsk_tu-key-aqui
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=raisket-knowledge-base

# Configuración del servidor
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

# Configuración del modelo
DEFAULT_MODEL=claude-3-5-sonnet-20241022
MAX_TOKENS=4096
TEMPERATURE=0.7
```

### 4. Instalar Dependencias

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 5. Ejecutar el Backend

```bash
uvicorn app.main:app --reload
```

El backend estará disponible en: `http://localhost:8000`

Documentación interactiva en: `http://localhost:8000/docs`

### 6. Probar la Conexión

Abre tu navegador y ve a:
- http://localhost:8000/health

Deberías ver:
```json
{
  "status": "healthy",
  "environment": "development",
  "version": "1.0.0",
  "services": {
    "api": "operational",
    "llm": "operational",
    "rag": "operational"
  }
}
```

## 🔥 Endpoints Principales

### Chat Simple
```bash
POST http://localhost:8000/chat/message
Content-Type: application/json

{
  "message": "Hola, ¿cómo puedo ahorrar dinero?",
  "use_rag": false
}
```

### Chat con Streaming
```bash
POST http://localhost:8000/chat/message/stream
Content-Type: application/json

{
  "message": "¿Qué es una tarjeta de crédito?"
}
```

## ⚠️ Notas Importantes

1. **Anthropic API Key es OBLIGATORIA** - Sin ella, el chat no funcionará
2. **OpenAI y Pinecone son OPCIONALES** - Solo necesarios si usas RAG
3. **CORS ya está configurado** para `localhost:3000`
4. **El System Prompt** está personalizado para ser un asesor financiero mexicano

## 🎯 Próximos Pasos

1. ✅ Obtener API Key de Anthropic
2. ✅ Configurar `.env`
3. ✅ Instalar dependencias
4. ✅ Ejecutar backend
5. ✅ Conectar frontend en `http://localhost:3000/chat`

## 💰 Costos

**Claude 3.5 Sonnet:**
- Input: $3 por millón de tokens
- Output: $15 por millón de tokens

**Estimado**: ~$0.01-0.05 por conversación típica

## 🔗 Enlaces Útiles

- [Anthropic Console](https://console.anthropic.com)
- [Docs de Anthropic API](https://docs.anthropic.com)
- [FastAPI Docs](https://fastapi.tiangolo.com)
