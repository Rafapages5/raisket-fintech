# Chat de Raisket AI

Componente de chat inteligente para asesoría financiera con integración a backend FastAPI.

## Componentes Creados

### 1. `ChatInterface.tsx`
Componente principal del chat con todas las funcionalidades:
- ✅ UI completa con lista de mensajes y input
- ✅ Auto-scroll a último mensaje
- ✅ Auto-resize del textarea
- ✅ Optimistic UI (mensajes aparecen antes de respuesta)
- ✅ Loading states ("Pensando...")
- ✅ Manejo de errores robusto
- ✅ Integración con API backend
- ✅ Soporte para RAG automático
- ✅ Mobile responsive

### 2. `MessageBubble.tsx`
Componente para renderizar mensajes individuales:
- Burbujas diferenciadas por rol (user/assistant)
- Timestamps formateados en español
- Animaciones suaves

### 3. `types/chat.ts`
Tipos TypeScript para el sistema de chat:
- `Message` - Mensaje individual
- `ChatResponse` - Respuesta de la API
- `ChatRequest` - Request a la API
- `ChatError` - Errores del chat

## Instalación

Los componentes ya están creados. Solo necesitas configurar la variable de entorno.

### 1. Configurar Variable de Entorno

Crea o edita `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

En producción:
```bash
NEXT_PUBLIC_API_URL=https://tu-backend.com
```

### 2. Iniciar Backend FastAPI

Primero, asegúrate de que tu backend esté corriendo:

```bash
cd raisket-backend
source venv/bin/activate  # En Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

El backend debe estar disponible en `http://localhost:8000`.

### 3. Iniciar Frontend Next.js

```bash
npm run dev
```

## Uso

### Opción 1: Página de Demo

Visita la página de demo que ya fue creada:

```
http://localhost:3000/chat-demo
```

### Opción 2: Importar en tu Página

```tsx
import { ChatInterface } from '@/components/chat';

export default function MiPagina() {
  return (
    <div className="container mx-auto py-8">
      <h1>Mi Asesor Financiero</h1>
      <ChatInterface />
    </div>
  );
}
```

### Opción 3: Con URL Personalizada

```tsx
import { ChatInterface } from '@/components/chat';

export default function MiPagina() {
  return (
    <ChatInterface
      apiUrl="https://mi-backend-custom.com"
      className="my-custom-class"
    />
  );
}
```

## Props de ChatInterface

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `apiUrl` | `string?` | `process.env.NEXT_PUBLIC_API_URL` | URL del backend |
| `className` | `string?` | `''` | Clases CSS adicionales |

## Características

### 1. Optimistic UI
Los mensajes del usuario aparecen inmediatamente, mejorando la experiencia.

### 2. Auto-scroll
La lista de mensajes hace scroll automático al último mensaje.

### 3. Auto-resize Textarea
El input crece automáticamente hasta 120px de altura.

### 4. Keyboard Shortcuts
- **Enter**: Enviar mensaje
- **Shift+Enter**: Nueva línea

### 5. Loading States
- Animación de "Pensando..." mientras espera respuesta
- Botón deshabilitado durante carga
- Spinner en botón de envío

### 6. Error Handling
- Muestra errores de forma amigable
- Fallback cuando API no responde
- Reintentos automáticos

### 7. RAG Automático
- Busca contexto relevante en Pinecone
- Incluye fuentes en la respuesta (si están disponibles)

### 8. Mobile Responsive
- Burbujas adaptativas (80% max-width en móvil)
- Input táctil optimizado
- Layout responsive

## API Backend

El componente espera que el backend tenga este endpoint:

```
POST /chat/message
```

### Request:
```json
{
  "message": "¿Cómo hago un presupuesto?",
  "chat_id": "optional-uuid",
  "use_rag": true
}
```

### Response:
```json
{
  "response": "Para hacer un presupuesto...",
  "chat_id": "uuid-v4",
  "sources": [
    {
      "id": "doc1",
      "score": 0.95,
      "text": "Contenido relevante...",
      "metadata": {}
    }
  ],
  "context_used": true
}
```

## Personalización

### Cambiar Colores

Edita las clases de Tailwind en `ChatInterface.tsx`:

```tsx
// Mensajes del usuario
bg-blue-600 text-white  // Cambiar a tus colores

// Mensajes del asistente
bg-gray-100 text-gray-900  // Cambiar a tus colores

// Header
bg-gradient-to-r from-blue-600 to-blue-700  // Cambiar gradient
```

### Cambiar Altura

```tsx
<ChatInterface className="h-[800px]" />  // Más alto
<ChatInterface className="h-[400px]" />  // Más bajo
```

### Agregar Preguntas Sugeridas

Edita el array de preguntas sugeridas en `ChatInterface.tsx` (líneas ~160-180):

```tsx
<button
  onClick={() => setInput('Tu pregunta personalizada aquí')}
  className="text-left px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
>
  💡 Tu pregunta sugerida
</button>
```

## Troubleshooting

### Error: "Cannot connect to backend"

**Solución:**
1. Verifica que el backend esté corriendo: `http://localhost:8000`
2. Revisa que `NEXT_PUBLIC_API_URL` esté correcta en `.env.local`
3. Verifica CORS en el backend (debe permitir tu dominio)

### Error: "use_rag is undefined"

**Solución:**
El backend espera el campo `use_rag`. Asegúrate de usar la versión actualizada del backend.

### Mensajes no se ven

**Solución:**
1. Abre DevTools → Console
2. Busca errores de JavaScript
3. Verifica que `@/types/chat` se esté importando correctamente

### El textarea no crece

**Solución:**
Asegúrate de que Tailwind esté configurado correctamente y que las clases `h-auto` y `max-height` no estén siendo sobreescritas.

## Stack Tecnológico

- **React 18+** con Server/Client Components
- **TypeScript** con strict mode
- **Tailwind CSS** para estilos
- **FastAPI** backend (Python)
- **Anthropic Claude** para IA
- **Pinecone** para RAG

## Archivos Creados

```
src/
├── components/
│   └── chat/
│       ├── ChatInterface.tsx    (Principal)
│       ├── MessageBubble.tsx    (Burbujas)
│       ├── index.ts             (Exports)
│       └── README.md            (Este archivo)
├── types/
│   └── chat.ts                  (Tipos TypeScript)
└── app/
    └── chat-demo/
        └── page.tsx             (Página de demo)
```

## Licencia

Parte del proyecto Raisket. Todos los derechos reservados.

---

**Última actualización:** 2025-11-01
**Versión:** 1.0.0
