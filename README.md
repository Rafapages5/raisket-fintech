# Raisket - Marketplace Fintech

Raisket es un marketplace fintech que conecta a personas y empresas con productos financieros personalizados. Compara tarjetas de crédito, préstamos, seguros y más, con recomendaciones impulsadas por IA.

## Características Principales

- **Marketplace de Productos Financieros**: Explora y compara tarjetas de crédito, préstamos, cuentas de ahorro, seguros y más
- **Recomendaciones Personalizadas**: Sistema de IA que sugiere productos basados en tu perfil financiero
- **Comparador de Productos**: Compara características, beneficios y costos lado a lado
- **Chat con IA**: Asistente virtual para resolver dudas sobre productos financieros
- **Panel de Admin**: Gestión de productos, reseñas y usuarios
- **Blog Educativo**: Contenido sobre finanzas personales y tendencias fintech
- **Autenticación OAuth**: Login con Google

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 15.3.3 con App Router
- **React**: 18.3.1
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth + Google OAuth
- **IA/LLM**:
  - Anthropic Claude (API principal)
  - Google AI (Genkit)
  - OpenAI (fallback)
- **Vector Database**: Pinecone (RAG/búsqueda semántica)

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway / Render (recomendado)
- **Database**: Supabase Cloud

## Requisitos Previos

- **Node.js**: 20.x o superior
- **Python**: 3.11 o superior
- **npm** o **pnpm**: Gestor de paquetes
- **Git**: Control de versiones

## Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Rafapages5/raisket-fintech.git
cd raisket-fintech
```

### 2. Configurar Frontend (Next.js)

#### Instalar Dependencias

```bash
npm install
# o si usas pnpm
pnpm install
```

#### Variables de Entorno

Copia el archivo de ejemplo y configura tus credenciales:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y configura:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Google OAuth (desde Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# Backend API (desarrollo local)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Ejecutar en Desarrollo

```bash
npm run dev
```

El frontend estará disponible en [http://localhost:3000](http://localhost:3000)

### 3. Configurar Backend (FastAPI)

#### Crear Entorno Virtual

```bash
cd raisket-backend
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
source venv/bin/activate
```

#### Instalar Dependencias

```bash
pip install -r requirements.txt
```

#### Variables de Entorno

Crea un archivo `.env` desde el ejemplo:

```bash
cp .env.example .env
```

Edita `.env` y configura:

```env
# API Keys
ANTHROPIC_API_KEY=tu_anthropic_api_key
OPENAI_API_KEY=tu_openai_api_key
PINECONE_API_KEY=tu_pinecone_api_key

# Pinecone
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=raisket-knowledge-base

# CORS (ajusta según tu frontend)
CORS_ORIGINS=http://localhost:3000,https://www.raisket.mx

# LLM Configuration
DEFAULT_MODEL=claude-3-5-sonnet-20241022
MAX_TOKENS=4096
TEMPERATURE=0.7

# RAG Configuration
TOP_K_RESULTS=5
SIMILARITY_THRESHOLD=0.7
```

#### Ejecutar Backend

```bash
uvicorn app.main:app --reload
```

El backend estará disponible en [http://localhost:8000](http://localhost:8000)

La documentación de la API estará en [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ejecuta las migraciones SQL para crear las tablas necesarias
4. Configura Google OAuth en Supabase Dashboard:
   - Ve a Authentication > Providers
   - Habilita Google
   - Configura con tus credenciales de Google Cloud Console

### 5. Configurar APIs Externas

#### Anthropic (Claude)
1. Crea cuenta en [Anthropic Console](https://console.anthropic.com)
2. Genera API key
3. Agrega a `.env` del backend

#### Pinecone
1. Crea cuenta en [Pinecone](https://www.pinecone.io)
2. Crea un índice llamado `raisket-knowledge-base`
3. Genera API key
4. Agrega a `.env` del backend

#### Google Cloud (OAuth)
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto
3. Habilita Google+ API
4. Crea credenciales OAuth 2.0
5. Configura URLs autorizadas:
   - `http://localhost:3000`
   - `https://www.raisket.mx`
6. Agrega credenciales a `.env.local`

## Scripts Disponibles

### Frontend

```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run typecheck    # Verificar tipos TypeScript
npm run migrate:excel # Migrar productos desde Excel a Supabase
```

### Backend

```bash
uvicorn app.main:app --reload          # Desarrollo
uvicorn app.main:app --host 0.0.0.0    # Producción
```

## Estructura del Proyecto

```
raisket-fintech/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Página principal
│   │   ├── products/          # Páginas de productos
│   │   ├── compare/           # Comparador
│   │   ├── chat-demo/         # Demo del chat con IA
│   │   ├── admin/             # Panel de administración
│   │   ├── blog/              # Blog
│   │   └── login/             # Autenticación
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes shadcn/ui
│   │   └── chat/             # Componentes de chat
│   ├── lib/                   # Utilidades y configuración
│   │   ├── supabase.ts       # Cliente de Supabase
│   │   └── utils.ts          # Helpers
│   └── types/                 # TypeScript types
├── raisket-backend/           # Backend FastAPI
│   ├── app/
│   │   ├── api/              # Endpoints de API
│   │   │   ├── chat.py       # Chat con IA
│   │   │   └── workflows.py  # Workflows y automatizaciones
│   │   ├── services/         # Lógica de negocio
│   │   │   ├── llm_service.py  # Integración con LLMs
│   │   │   └── rag_service.py  # RAG/búsqueda semántica
│   │   ├── core/             # Configuración
│   │   └── main.py           # Aplicación principal
│   └── requirements.txt       # Dependencias Python
├── _posts/                    # Posts del blog (Markdown)
├── scripts/                   # Scripts de migración
├── public/                    # Archivos estáticos
└── migrations/                # Migraciones de datos

```

## Rutas Principales

### Públicas
- `/` - Página principal
- `/individuals/[category]` - Productos para individuos
- `/businesses/[category]` - Productos para empresas
- `/products/[id]` - Detalle de producto
- `/compare` - Comparador de productos
- `/blog` - Blog educativo
- `/about` - Acerca de Raisket

### Autenticadas
- `/dashboard` - Panel de usuario
- `/personalized-offer` - Oferta personalizada
- `/recommendations` - Recomendaciones con IA
- `/chat-demo` - Chat con asistente IA

### Admin
- `/admin/reviews` - Gestión de reseñas

## Deployment

### Frontend (Vercel)

1. Conecta tu repo de GitHub a Vercel
2. Configura las variables de entorno en Vercel Dashboard
3. Deploy automático en cada push a `main`

```bash
# O usando Vercel CLI
npm install -g vercel
vercel --prod
```

### Backend (Railway/Render)

#### Railway
```bash
railway login
railway init
railway up
```

#### Render
1. Conecta tu repo en Render Dashboard
2. Selecciona `raisket-backend` como directorio root
3. Configura variables de entorno
4. Deploy

### Database (Supabase)

Ya está en la nube - solo configura las variables de entorno correctas.

## Migraciones de Datos

Para importar productos desde Excel a Supabase:

```bash
npm run migrate:excel
```

Asegúrate de tener configuradas las credenciales de Supabase en `.env.local`

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Seguridad

- **NUNCA** commitees archivos `.env` o `.env.local`
- Las API keys son sensibles - manténlas seguras
- El Service Role Key de Supabase SOLO debe usarse en el backend
- Usa variables de entorno para todas las credenciales

## Soporte

Para reportar bugs o solicitar features, abre un issue en GitHub.

## Licencia

Proyecto privado - Todos los derechos reservados.

---

Desarrollado con ❤️ por el equipo de Raisket
