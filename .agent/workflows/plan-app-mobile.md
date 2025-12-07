---
description: Plan completo de desarrollo de la app móvil de Raisket (iOS y Android)
---

# Plan de Implementación: Aplicación Móvil Raisket

Este documento contiene el plan completo para desarrollar y publicar la aplicación móvil de Raisket en las tiendas de iOS (App Store) y Android (Google Play Store).

---

## FASE 1: PLANIFICACIÓN Y CONFIGURACIÓN INICIAL (1-2 semanas)

### 1.1 Definición de Requisitos
- [ ] Definir el MVP (Producto Mínimo Viable) de la app
- [ ] Identificar las funcionalidades críticas de la web que deben estar en la app
- [ ] Determinar funcionalidades exclusivas de la app móvil (ej: notificaciones push, biometría)
- [ ] Crear wireframes/mockups para las pantallas principales
- [ ] Definir la experiencia de usuario (UX) específica para móvil

### 1.2 Selección de Tecnología
**Opción Recomendada: React Native con Expo**

**Ventajas:**
- Reutilización de código entre iOS y Android (~95%)
- Mismo stack tecnológico (React/TypeScript) que tu web
- Expo simplifica la configuración y el deployment
- Comunidad grande y activa
- Integración fácil con Supabase

**Alternativas a considerar:**
- Flutter (si prefieres Dart)
- Native (Swift para iOS, Kotlin para Android) - si necesitas máximo rendimiento

### 1.3 Configuración del Entorno de Desarrollo

#### Instalación de Herramientas Básicas:
```bash
# Instalar Node.js (ya lo tienes)
# Instalar Expo CLI
npm install -g expo-cli

# Instalar EAS CLI (para builds y deployment)
npm install -g eas-cli
```

#### Para iOS (requiere Mac):
```bash
# Instalar Xcode desde App Store
# Instalar Command Line Tools
xcode-select --install

# Instalar CocoaPods
sudo gem install cocoapods
```

#### Para Android:
```bash
# Descargar e instalar Android Studio
# Configurar Android SDK y AVD Manager
# Instalar JDK 17 o superior
```

### 1.4 Creación del Proyecto

```bash
# Crear directorio para la app móvil dentro del proyecto
cd c:\Users\LENOVO\raisket-fintech
mkdir raisket-mobile
cd raisket-mobile

# Inicializar proyecto Expo con TypeScript
npx create-expo-app@latest . --template expo-template-blank-typescript

# Inicializar EAS (Expo Application Services)
eas init
eas login
```

### 1.5 Estructura del Proyecto Sugerida

```
raisket-mobile/
├── app/                    # App Router (Expo Router)
│   ├── (auth)/            # Screens de autenticación
│   ├── (tabs)/            # Navegación principal con tabs
│   ├── products/          # Screens de productos
│   └── _layout.tsx        # Root layout
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes UI base
│   └── features/         # Componentes específicos
├── services/             # Servicios (API, Supabase)
├── hooks/                # Custom hooks
├── stores/               # Estado global (Zustand o React Context)
├── utils/                # Utilidades y helpers
├── constants/            # Constantes y configuraciones
├── assets/               # Imágenes, fuentes, etc.
├── app.json             # Configuración de Expo
├── eas.json             # Configuración de EAS Build
└── package.json
```

---

## FASE 2: CONFIGURACIÓN DE INFRAESTRUCTURA (1 semana)

### 2.1 Configuración de Supabase

```bash
# Instalar Supabase cliente
npm install @supabase/supabase-js

# Instalar otras dependencias clave
npm install @react-native-async-storage/async-storage
npm install react-native-url-polyfill
```

**Crear servicio de Supabase:**
```typescript
// services/supabase.ts
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

### 2.2 Configuración de Variables de Entorno

```bash
# Crear archivo .env
cp .env.example .env
```

```env
# .env
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
EXPO_PUBLIC_API_URL=https://www.raisket.mx/api
```

### 2.3 Configuración de Navegación

```bash
# Instalar Expo Router (navegación file-based)
npx expo install expo-router react-native-safe-area-context react-native-screens
```

### 2.4 Configuración de app.json

```json
{
  "expo": {
    "name": "Raisket",
    "slug": "raisket-fintech",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "mx.raisket.app",
      "infoPlist": {
        "NSFaceIDUsageDescription": "Usamos Face ID para autenticación segura"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "mx.raisket.app",
      "permissions": [
        "USE_BIOMETRIC",
        "USE_FINGERPRINT"
      ]
    },
    "plugins": [
      "expo-router"
    ],
    "scheme": "raisket"
  }
}
```

---

## FASE 3: DESARROLLO DE LA APP (6-10 semanas)

### 3.1 Sprint 1: Autenticación y Perfil (2 semanas)

**Objetivos:**
- [ ] Implementar pantallas de login/registro
- [ ] Integrar autenticación con Supabase
- [ ] Implementar biometría (Face ID/Touch ID/Fingerprint)
- [ ] Crear pantalla de perfil de usuario
- [ ] Implementar recuperación de contraseña

**Dependencias a instalar:**
```bash
npm install expo-local-authentication
npm install expo-secure-store
```

**Tasks:**
1. Crear componentes UI base (botones, inputs, cards)
2. Implementar flujo de onboarding
3. Crear screens de autenticación
4. Integrar con Supabase Auth
5. Implementar persistencia de sesión
6. Añadir autenticación biométrica

### 3.2 Sprint 2: Listado y Búsqueda de Productos (2 semanas)

**Objetivos:**
- [ ] Pantalla principal con categorías de productos
- [ ] Sistema de búsqueda y filtros
- [ ] Listado de productos financieros
- [ ] Vista detallada de productos
- [ ] Implementar caché local para mejor performance

**Dependencias:**
```bash
npm install react-native-reanimated
npm install @shopify/flash-list
```

**Tasks:**
1. Crear servicio de productos (API calls a Supabase)
2. Implementar sistema de caché con AsyncStorage
3. Crear componentes de tarjetas de productos
4. Implementar búsqueda en tiempo real
5. Añadir sistema de filtros avanzados
6. Optimizar listas con FlashList

### 3.3 Sprint 3: Comparador y Calculadoras (2 semanas)

**Objetivos:**
- [ ] Implementar comparador de productos
- [ ] Integrar calculadoras financieras
- [ ] Sistema de favoritos
- [ ] Compartir productos

**Dependencias:**
```bash
npm install expo-sharing
npm install expo-clipboard
```

**Tasks:**
1. Crear pantalla de comparación
2. Implementar calculadora de crédito
3. Implementar calculadora de inversiones
4. Implementar calculadora de ahorro
5. Sistema de favoritos con persistencia local
6. Funcionalidad de compartir

### 3.4 Sprint 4: AI Advisor y Premium Features (2 semanas)

**Objetivos:**
- [ ] Integrar chat con AI financial advisor
- [ ] Implementar recomendaciones personalizadas
- [ ] Sistema de notificaciones push
- [ ] Analítica de usuario

**Dependencias:**
```bash
npm install @genkit-ai/googleai
npm install expo-notifications
npm install @react-native-firebase/app
npm install @react-native-firebase/analytics
```

**Tasks:**
1. Integrar Gemini AI con la app
2. Crear interfaz de chat
3. Implementar sistema de notificaciones
4. Configurar Firebase Analytics
5. Crear dashboard de recomendaciones personalizadas

### 3.5 Sprint 5: Reviews y Estado Perfil (1 semana)

**Objetivos:**
- [ ] Sistema de reviews y ratings
- [ ] Historial de productos visitados
- [ ] Estado financiero del usuario
- [ ] Alertas de productos

**Tasks:**
1. Implementar reviews con Supabase
2. Crear pantalla de historial
3. Dashboard de perfil financiero
4. Sistema de alertas personalizadas

### 3.6 Sprint 6: Monetización y Afiliados (1 semana)

**Objetivos:**
- [ ] Integración de links de afiliados
- [ ] Tracking de conversiones
- [ ] Banners promocionales
- [ ] Sistema de referidos

**Tasks:**
1. Implementar deep linking para afiliados
2. Sistema de tracking de clicks
3. Banners y promociones
4. Programa de referidos

---

## FASE 4: TESTING Y QA (2-3 semanas)

### 4.1 Testing Funcional

**Herramientas:**
```bash
npm install --save-dev jest @testing-library/react-native
npm install --save-dev detox # Para E2E testing
```

**Tests a realizar:**
- [ ] Unit tests de componentes críticos
- [ ] Integration tests de flujos principales
- [ ] E2E tests de user journeys
- [ ] Test de autenticación
- [ ] Test de sincronización con Supabase
- [ ] Test de cálculos financieros

### 4.2 Testing de Performance

**Herramientas:**
```bash
npm install --save-dev @react-native-community/performance
npm install --save-dev react-native-flipper
```

**Métricas a medir:**
- [ ] Tiempo de carga inicial
- [ ] Tiempo de respuesta de API calls
- [ ] Uso de memoria
- [ ] Consumo de batería
- [ ] Tamaño del bundle

### 4.3 Testing de UI/UX

**Tests a realizar:**
- [ ] Pruebas en diferentes tamaños de pantalla
- [ ] Pruebas en modo claro/oscuro
- [ ] Pruebas de accesibilidad
- [ ] Pruebas de navegación
- [ ] Pruebas de gestos nativos

### 4.4 Beta Testing

```bash
# Crear build de desarrollo interno
eas build --profile development --platform all

# Crear build de preview para beta testers
eas build --profile preview --platform all
```

**Distribución:**
- [ ] TestFlight (iOS) - invitar 10-100 beta testers
- [ ] Google Play Internal Testing (Android)
- [ ] Recopilar feedback
- [ ] Iterar basado en feedback

---

## FASE 5: PREPARACIÓN PARA PRODUCCIÓN (2 semanas)

### 5.1 Optimización del Bundle

```bash
# Analizar tamaño del bundle
npx expo export --dump-assetmap

# Optimizar imágenes
npm install --save-dev sharp-cli
```

**Tareas de optimización:**
- [ ] Comprimir imágenes y assets
- [ ] Implementar code splitting
- [ ] Habilitar Hermes engine (Android)
- [ ] Optimizar imports
- [ ] Eliminar código no usado

### 5.2 Configuración de EAS Build para Producción

```json
// eas.json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "tu_apple_id@email.com",
        "ascAppId": "tu_app_store_connect_id",
        "appleTeamId": "tu_apple_team_id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### 5.3 Seguridad y Privacidad

**Implementar:**
- [ ] Ofuscación de código
- [ ] Almacenamiento seguro de tokens (Expo SecureStore)
- [ ] Configurar SSL pinning
- [ ] Implementar rate limiting
- [ ] Añadir detección de jailbreak/root

**Dependencias:**
```bash
npm install expo-secure-store
npm install react-native-ssl-pinning
npm install jail-monkey
```

### 5.4 Políticas y Compliance

**Documentos requeridos:**
- [ ] Política de Privacidad
- [ ] Términos y Condiciones
- [ ] Política de Datos (GDPR, CCPA)
- [ ] Documentación de cumplimiento financiero (CONDUSEF, CNBV)

**Implementar en la app:**
- [ ] Pantalla de consentimiento de datos
- [ ] Opción de eliminar cuenta
- [ ] Exportación de datos del usuario
- [ ] Configuración de privacidad

### 5.5 Analytics y Monitoring

```bash
npm install @react-native-firebase/analytics
npm install @react-native-firebase/crashlytics
npm install @sentry/react-native
```

**Configurar:**
- [ ] Firebase Analytics
- [ ] Firebase Crashlytics
- [ ] Sentry para error tracking
- [ ] Custom events para métricas de negocio

---

## FASE 6: PUBLICACIÓN EN APP STORE (iOS) (1-2 semanas)

### 6.1 Requisitos Previos

**Cuentas necesarias:**
- [ ] Apple Developer Account ($99/año)
- [ ] Verificación de identidad
- [ ] Configuración de impuestos y pagos

### 6.2 Preparación de Assets

**Recursos gráficos requeridos:**
- [ ] App Icon (1024x1024px)
- [ ] Screenshots:
  - iPhone 6.7" (1290x2796px) - mínimo 3
  - iPhone 6.5" (1284x2778px)
  - iPad Pro 12.9" (2048x2732px) - si soportas iPad
- [ ] Preview videos (opcional pero recomendado)

### 6.3 App Store Connect

**Configuración:**
1. Crear nuevo app en App Store Connect
2. Completar información de la app:
   - [ ] Nombre de la app
   - [ ] Subtítulo (30 caracteres)
   - [ ] Descripción (4000 caracteres)
   - [ ] Palabras clave (100 caracteres)
   - [ ] URL de soporte
   - [ ] URL de marketing
   - [ ] Categorías (Finanzas, Productividad)

3. Configurar información de privacidad:
   - [ ] Completar cuestionario de privacidad
   - [ ] URL de política de privacidad

4. Configurar pricing:
   - [ ] Seleccionar países/regiones
   - [ ] Configurar precio (gratis o pagado)

### 6.4 Build y Submit

```bash
# Generar build de producción para iOS
eas build --platform ios --profile production

# Una vez completado el build, submit a App Store
eas submit --platform ios --profile production
```

**Alternativa manual:**
```bash
# Si necesitas más control
eas build --platform ios --profile production

# Descargar el .ipa
# Subir manualmente usando Transporter app
```

### 6.5 Review de Apple

**Preparación para review:**
- [ ] Crear cuenta de demo (si requiere login)
- [ ] Proporcionar notas para el revisor
- [ ] Incluir instrucciones especiales
- [ ] Preparar datos de prueba

**Checklist de cumplimiento:**
- [ ] La app hace lo que promete
- [ ] No tiene crashes
- [ ] Toda funcionalidad es accesible
- [ ] Links de privacidad funcionan
- [ ] No usa APIs privadas
- [ ] Cumple con guidelines financieras
- [ ] Información financiera es precisa

**Tiempos esperados:**
- Primera review: 24-48 horas
- Reviews subsecuentes: 24 horas
- Rechazos comunes: resolver y resubmitir

### 6.6 Después de la Aprobación

```bash
# Monitorear la publicación
eas build:list --platform ios

# Verificar que está live
# Revisar App Store Connect Analytics
```

---

## FASE 7: PUBLICACIÓN EN GOOGLE PLAY (Android) (1 semana)

### 7.1 Requisitos Previos

**Cuentas necesarias:**
- [ ] Google Play Console Account ($25 única vez)
- [ ] Verificación de identidad
- [ ] Configuración de merchant account

### 7.2 Preparación de Assets

**Recursos gráficos requeridos:**
- [ ] App Icon (512x512px)
- [ ] Feature Graphic (1024x500px)
- [ ] Screenshots:
  - Phone: mínimo 2, máximo 8 (320-3840px)
  - Tablet 7": mínimo 1 (opcional)
  - Tablet 10": mínimo 1 (opcional)
- [ ] Promotional video (opcional)

### 7.3 Google Play Console

**Configuración de la app:**
1. Crear nueva aplicación
2. Completar Store Listing:
   - [ ] Título (30 caracteres)
   - [ ] Descripción corta (80 caracteres)
   - [ ] Descripción completa (4000 caracteres)
   - [ ] Screenshots y gráficos
   - [ ] Categoría (Finanzas)
   - [ ] Información de contacto

3. Content Rating:
   - [ ] Completar cuestionario IARC
   - [ ] Confirmar que es apropiado para todas las edades

4. Pricing & Distribution:
   - [ ] Seleccionar países
   - [ ] Configurar precio
   - [ ] Aceptar términos de distribución

5. App Content:
   - [ ] Política de privacidad URL
   - [ ] Anuncios (si aplica)
   - [ ] Target audience
   - [ ] Declaraciones de contenido

### 7.4 Configuración de Signing

**Opción A: App Signing by Google Play (Recomendado)**
```bash
# EAS maneja esto automáticamente
eas build --platform android --profile production
```

**Opción B: Manual**
```bash
# Generar keystore
keytool -genkeypair -v -storetype PKCS12 -keystore raisket.keystore \
  -alias raisket -keyalg RSA -keysize 2048 -validity 10000

# Guardar contraseña de forma segura
```

### 7.5 Build y Submit

```bash
# Generar AAB (Android App Bundle) para producción
eas build --platform android --profile production

# Submit a Google Play
eas submit --platform android --profile production
```

**Tracks de distribución:**
- Internal testing (hasta 100 testers)
- Closed testing (alpha)
- Open testing (beta)
- Production

```bash
# Submit a internal testing primero
eas submit --platform android --track internal
```

### 7.6 Review de Google Play

**Preparación:**
- [ ] Completar todos los campos requeridos
- [ ] Verificar que no hay warnings
- [ ] Revisar pre-launch report
- [ ] Configurar países target

**Tiempos esperados:**
- Primera review: 1-7 días
- Updates subsecuentes: pocas horas a 1 día
- Pre-launch report: disponible después de unos días

**Checklist de cumplimiento:**
- [ ] Cumple con políticas de Google Play
- [ ] Permisos justificados
- [ ] Política de privacidad visible
- [ ] No solicita permisos innecesarios
- [ ] Funciona correctamente en diferentes dispositivos

### 7.7 Staged Rollout

**Recomendación:** Hacer rollout gradual
```bash
# Empezar con 10% de usuarios
# Monitorear crashes y ANRs
# Incrementar gradualmente: 25% → 50% → 100%
```

**En Google Play Console:**
- [ ] Crear release en Production track
- [ ] Seleccionar "Staged rollout"
- [ ] Configurar porcentaje inicial
- [ ] Monitorear métricas
- [ ] Aumentar gradualmente

---

## FASE 8: POST-LANZAMIENTO Y MANTENIMIENTO (Continuo)

### 8.1 Monitoreo y Analytics

**Métricas clave a monitorear:**
- [ ] Instalaciones diarias/semanales/mensuales
- [ ] Usuarios activos (DAU/MAU)
- [ ] Retención (D1, D7, D30)
- [ ] Session length
- [ ] Crashes y ANRs
- [ ] Rating promedio de la app
- [ ] Reviews de usuarios

**Herramientas:**
- App Store Connect Analytics
- Google Play Console Statistics
- Firebase Analytics
- Sentry/Crashlytics para errors

### 8.2 Gestión de Reviews

**Estrategia:**
- [ ] Responder a reviews (especialmente negativos) en 24-48h
- [ ] Agradecer reviews positivos
- [ ] Resolver problemas reportados
- [ ] Pedir updates de reviews después de fixes
- [ ] Implementar in-app review prompts (después de acciones positivas)

```bash
npm install react-native-rate
```

### 8.3 Ciclo de Actualizaciones

**Cadencia recomendada:**
- Hotfixes críticos: ASAP
- Bug fixes menores: cada 2 semanas
- Features nuevas: mensual
- Major updates: trimestral

**Process de actualización:**
```bash
# 1. Incrementar versión en app.json
# 2. Actualizar changelog
# 3. Build
eas build --platform all --profile production

# 4. Submit
eas submit --platform all --profile production

# 5. Crear release notes
# 6. Monitorear adoption
```

### 8.4 OTA Updates con Expo

**Para cambios menores (JS/assets):**
```bash
# Configurar EAS Update
npm install expo-updates

# Publicar update OTA
eas update --branch production --message "Fix bug in calculator"
```

**Ventajas:**
- No requiere review de stores
- Deploy inmediato
- Rollback fácil

**Limitaciones:**
- Solo para código JS/TypeScript
- No para cambios nativos

### 8.5 A/B Testing

```bash
npm install @react-native-firebase/remote-config
```

**Experimentos a realizar:**
- [ ] Diferentes onboarding flows
- [ ] Variaciones de UI
- [ ] Diferentes call-to-actions
- [ ] Pricing strategies

### 8.6 Roadmap de Features

**Q1 Post-Launch:**
- [ ] Widget para home screen
- [ ] Apple Watch companion app
- [ ] Wear OS support
- [ ] Siri Shortcuts / Google Assistant actions

**Q2:**
- [ ] Modo offline robusto
- [ ] Sincronización cross-device
- [ ] Sharing entre usuarios
- [ ] Gamificación

**Q3:**
- [ ] Integración con bancos (open banking)
- [ ] Firma electrónica de documentos
- [ ] Video KYC
- [ ] Inversiones desde la app

---

## FASE 9: OPTIMIZACIÓN DE ASO (App Store Optimization)

### 9.1 Keywords Research

**Herramientas:**
- App Store Connect Search Ads
- Google Play Console Keyword tools
- Sensor Tower
- App Annie

**Keywords objetivo (México):**
- "tarjetas de credito"
- "prestamos personales"
- "comparador financiero"
- "inversiones mexico"
- "calculadora credito"
- "mejores cuentas de ahorro"

### 9.2 Optimización de Metadata

**A/B Testing de:**
- [ ] App icon
- [ ] Screenshots
- [ ] Descripción corta
- [ ] Feature graphic

**iOS:**
```bash
# Usar App Store Connect A/B testing
```

**Android:**
```bash
# Usar Google Play Store Listing Experiments
```

### 9.3 Estrategia de Ratings

**Objetivos:**
- Mantener rating > 4.5 ★
- Incrementar número de reviews

**Tácticas:**
- In-app prompts en momentos clave
- Email campaigns a usuarios satisfechos
- Resolver issues de usuarios con 1-2 ★

---

## CHECKLIST FINAL PRE-LANZAMIENTO

### Técnico
- [ ] Todas las features del MVP funcionan
- [ ] App funciona offline (donde aplique)
- [ ] No hay memory leaks
- [ ] Crash rate < 0.1%
- [ ] Performance optimizada
- [ ] Seguridad implementada
- [ ] Analytics configurado

### Legal
- [ ] Política de Privacidad publicada
- [ ] Términos y Condiciones publicados
- [ ] Compliance financiero verificado
- [ ] Permisos de la app justificados
- [ ] Cuentas de developer configuradas

### Marketing
- [ ] Landing page de la app
- [ ] Assets para redes sociales
- [ ] Press kit preparado
- [ ] Plan de lanzamiento
- [ ] Email a usuarios existentes

### Stores
- [ ] App Store listing completo
- [ ] Google Play listing completo
- [ ] Screenshots profesionales
- [ ] Descripciones optimizadas
- [ ] Keywords investigados
- [ ] Cuenta de demo para reviewers

---

## PRESUPUESTO ESTIMADO

### Costos de Desarrollo (Asumiendo equipo de 2-3 personas):
- **Desarrollo:** $30,000 - $60,000 USD (3-4 meses)
- **Diseño UI/UX:** $5,000 - $10,000 USD
- **Testing & QA:** $5,000 - $10,000 USD

### Costos de Publicación:
- **Apple Developer:** $99/año
- **Google Play:** $25 (one-time)
- **Expo EAS:** $0 (free tier) o $29/mes (Production)

### Costos Operacionales:
- **Supabase:** $25-$50/mes (según uso)
- **Firebase:** $0-$50/mes
- **Sentry:** $0-$26/mes
- **CDN/Assets:** $10-$50/mes

### Costos de Marketing (Opcional):
- **ASO Tools:** $50-$200/mes
- **Paid User Acquisition:** Variable
- **PR/Marketing Agency:** $2,000-$10,000

**Total Estimado (Primer Año):** $45,000 - $85,000 USD

---

## TIMELINE ESTIMADO

| Fase | Duración | Semanas Acumuladas |
|------|----------|-------------------|
| 1. Planificación | 1-2 semanas | 0-2 |
| 2. Configuración | 1 semana | 2-3 |
| 3. Desarrollo Core | 6-10 semanas | 8-13 |
| 4. Testing & QA | 2-3 semanas | 10-16 |
| 5. Preparación Producción | 2 semanas | 12-18 |
| 6. App Store iOS | 1-2 semanas | 13-20 |
| 7. Google Play Android | 1 semana | 14-21 |
| **TOTAL** | **14-21 semanas** | **3.5-5 meses** |

---

## RECURSOS Y DOCUMENTACIÓN

### Documentación Oficial:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase React Native Guide](https://supabase.com/docs/guides/with-react-native)
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy Center](https://play.google.com/about/developer-content-policy/)

### Tutoriales Recomendados:
- [Expo + Supabase Tutorial](https://www.youtube.com/results?search_query=expo+supabase+tutorial)
- [Publishing to App Store with EAS](https://docs.expo.dev/submit/ios/)
- [Publishing to Google Play with EAS](https://docs.expo.dev/submit/android/)

### Comunidades:
- [Expo Discord](https://chat.expo.dev/)
- [React Native Community](https://www.reactnative.dev/community/overview)
- [Supabase Discord](https://discord.supabase.com/)

---

## PRÓXIMOS PASOS INMEDIATOS

1. **Esta semana:**
   - [ ] Revisar y aprobar este plan
   - [ ] Definir el MVP final
   - [ ] Crear mockups de las pantallas principales
   - [ ] Registrar cuentas de developer (Apple & Google)

2. **Próxima semana:**
   - [ ] Configurar proyecto Expo
   - [ ] Configurar repositorio Git
   - [ ] Configurar CI/CD básico
   - [ ] Empezar Sprint 1 (Autenticación)

3. **Primer mes:**
   - [ ] Completar Sprints 1 y 2
   - [ ] Primera versión funcional con auth y listado de productos
   - [ ] Internal testing con equipo

---

**Última actualización:** 2025-11-30
**Versión:** 1.0
**Mantenido por:** Equipo Raisket
