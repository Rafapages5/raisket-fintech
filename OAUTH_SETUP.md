# Configuración OAuth para Raisket Fintech

## Configuración en Supabase Dashboard

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Authentication > Providers**

### Google OAuth

1. **Habilitar Google Provider:**
   - Activa el toggle de "Google"

2. **Configurar Google Cloud Console:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Habilita la API de Google+ y Google Identity
   - Ve a **Credentials > Create Credentials > OAuth 2.0 Client ID**
   - Tipo de aplicación: **Web application**
   - Authorized redirect URIs: `https://gwiyvnxlhbcipxpjhfvo.supabase.co/auth/v1/callback`

3. **Configurar en Supabase:**
   - Client ID: Pega el Client ID de Google
   - Client Secret: Pega el Client Secret de Google

### Facebook OAuth

1. **Habilitar Facebook Provider:**
   - Activa el toggle de "Facebook"

2. **Configurar Facebook Developer:**
   - Ve a [Facebook Developers](https://developers.facebook.com/)
   - Crea una nueva app o selecciona una existente
   - Agrega el producto "Facebook Login"
   - En **Facebook Login > Settings**:
     - Valid OAuth Redirect URIs: `https://gwiyvnxlhbcipxpjhfvo.supabase.co/auth/v1/callback`

3. **Configurar en Supabase:**
   - App ID: Pega el App ID de Facebook
   - App Secret: Pega el App Secret de Facebook

## Variables de Entorno

Actualiza tu archivo `.env.local` con las credenciales:

```env
# OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

NEXT_PUBLIC_FACEBOOK_APP_ID=tu_facebook_app_id
FACEBOOK_APP_SECRET=tu_facebook_app_secret
```

## Archivos Creados

### Hooks
- `src/hooks/useAuth.ts` - Hook para manejar autenticación

### Componentes
- `src/components/auth/OAuthButtons.tsx` - Botones de OAuth

### Páginas
- `src/app/login/page.tsx` - Página de login con OAuth
- `src/app/dashboard/page.tsx` - Dashboard protegido
- `src/app/auth/callback/page.tsx` - Manejo de callback OAuth
- `src/app/auth/error/page.tsx` - Página de errores de autenticación

## Flujo de Autenticación

1. Usuario hace clic en botón OAuth
2. Redirige a proveedor (Google/Facebook)
3. Usuario autoriza la aplicación
4. Proveedor redirige a `/auth/callback`
5. Callback procesa la sesión
6. Redirige a dashboard si es exitoso

## Testing

Para probar la implementación:

1. Configura las credenciales OAuth en Supabase
2. Actualiza las variables de entorno
3. Ejecuta `npm run dev`
4. Ve a `http://localhost:3000/login`
5. Prueba los botones de OAuth

## Consideraciones de Seguridad

- Las credenciales sensibles están en variables de entorno
- Los tokens se manejan automáticamente por Supabase
- La sesión se persiste de forma segura
- Los redirects están validados por Supabase