# Guía Paso a Paso: Crear App Móvil con React Native + Expo

## 🎯 ¿Por Qué React Native + Expo?

**React Native** te permite escribir aplicaciones móviles nativas usando **JavaScript/TypeScript y React**.
**Expo** es una plataforma que simplifica enormemente el desarrollo, build y deployment.

### Ventajas para Raisket:
- ✅ **Mismo lenguaje**: TypeScript (igual que tu web)
- ✅ **Mismos conceptos**: React, componentes, hooks
- ✅ **Reutilización**: Puedes compartir servicios, tipos, utilidades entre web y móvil
- ✅ **Una sola app**: Funciona en iOS y Android
- ✅ **Hot Reload**: Cambios instantáneos mientras desarrollas
- ✅ **Over-the-Air Updates**: Actualiza la app sin pasar por las tiendas

---

## 📋 Pre-requisitos

### Software Necesario:

1. **Node.js** (ya lo tienes instalado)
   ```bash
   node --version  # Verificar versión (debe ser 18+)
   ```

2. **Git** (ya lo tienes)
   ```bash
   git --version
   ```

3. **Editor**: VS Code (ya lo tienes)

### Instalaciones Nuevas:

```bash
# Instalar Expo CLI globalmente
npm install -g expo-cli

# Instalar EAS CLI (para builds y deployment)
npm install -g eas-cli

# Verificar instalación
expo --version
eas --version
```

### Para Probar en Dispositivo Físico:

- **iOS**: Descargar "Expo Go" del App Store
- **Android**: Descargar "Expo Go" de Google Play Store

### Para Emuladores (Opcional):

**iOS (solo Mac):**
- Descargar Xcode desde App Store
- Instalar Command Line Tools:
  ```bash
  xcode-select --install
  ```

**Android (Windows/Mac/Linux):**
- Descargar Android Studio
- Instalar Android SDK y crear AVD (Android Virtual Device)

---

## 🏗️ Paso 1: Crear el Proyecto

### Opción A: Dentro del Monorepo (Recomendado)

```bash
# Navegar a tu proyecto
cd c:\Users\LENOVO\raisket-fintech

# Crear carpeta para la app móvil
mkdir raisket-mobile
cd raisket-mobile

# Crear proyecto Expo con TypeScript
npx create-expo-app@latest . --template expo-template-blank-typescript
```

### Opción B: Proyecto Separado

```bash
# Crear en una ubicación separada
cd c:\Users\LENOVO
npx create-expo-app raisket-mobile --template expo-template-blank-typescript
cd raisket-mobile
```

---

## 📁 Paso 2: Entender la Estructura del Proyecto

Después de crear el proyecto, tendrás esta estructura:

```
raisket-mobile/
├── app.json              # Configuración principal de Expo
├── App.tsx               # Componente raíz de la app
├── package.json          # Dependencias
├── tsconfig.json         # Configuración TypeScript
├── babel.config.js       # Configuración de Babel
├── assets/              # Imágenes, íconos, fuentes
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
└── node_modules/
```

---

## 🎨 Paso 3: Configurar el Proyecto

### 3.1 Actualizar app.json

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
      "backgroundColor": "#0F172A"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "mx.raisket.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0F172A"
      },
      "package": "mx.raisket.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### 3.2 Instalar Dependencias Esenciales

```bash
# Sistema de navegación
npx expo install expo-router react-native-safe-area-context react-native-screens

# Supabase para backend
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill

# UI Components (opcional pero recomendado)
npm install react-native-paper
npm install react-native-vector-icons

# Gestión de estado (opcional)
npm install zustand

# Utilidades
npm install date-fns
```

---

## 🔧 Paso 4: Configurar Integración con Supabase

### 4.1 Crear archivo de variables de entorno

```bash
# En raisket-mobile/
touch .env
```

```env
# .env
EXPO_PUBLIC_SUPABASE_URL=https://exnausjukdzlneyyrtlq.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 4.2 Crear servicio de Supabase

```bash
# Crear carpeta de servicios
mkdir src
mkdir src/services
```

Crear archivo `src/services/supabase.ts`:

```typescript
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

---

## 🎬 Paso 5: Crear Tu Primera Pantalla

Actualizar `App.tsx`:

```typescript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from './src/services/supabase';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_products')
        .select('id', { count: 'exact', head: true });
      
      if (!error) {
        setConnected(true);
        setProductsCount(data?.length || 0);
      }
    } catch (error) {
      console.error('Error conectando:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Raisket Mobile</Text>
      <Text style={styles.subtitle}>App Financiera de México</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Estado Supabase:</Text>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: connected ? '#10B981' : '#EF4444' }
        ]} />
        <Text style={styles.statusText}>
          {connected ? 'Conectado ✓' : 'Desconectado ✗'}
        </Text>
      </View>

      {connected && (
        <Text style={styles.info}>
          📊 Productos financieros en DB: {productsCount}
        </Text>
      )}

      <TouchableOpacity 
        style={styles.button}
        onPress={checkConnection}
      >
        <Text style={styles.buttonText}>🔄 Verificar Conexión</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 40,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  statusLabel: {
    color: '#CBD5E1',
    fontSize: 16,
    marginRight: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    color: '#10B981',
    fontSize: 14,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

## ▶️ Paso 6: Ejecutar la App

### Opción A: En Dispositivo Físico (Más Rápido)

```bash
# Iniciar servidor de desarrollo
npx expo start

# Escanear el QR code con:
# - iOS: App "Cámara" (abre Expo Go automáticamente)
# - Android: App "Expo Go"
```

### Opción B: En Emulador iOS (solo Mac)

```bash
npx expo start --ios
```

### Opción C: En Emulador Android

```bash
# Asegúrate de tener un emulador corriendo en Android Studio
npx expo start --android
```

### Opción D: En Web (para testing rápido)

```bash
npx expo start --web
```

---

## 🔥 Paso 7: Implementar Hot Reload

El Hot Reload ya viene activado por defecto. Para probarlo:

1. Con la app corriendo, edita el texto en `App.tsx`
2. Guarda el archivo (Ctrl+S)
3. ¡La app se actualiza automáticamente en el dispositivo! 🎉

**Comandos útiles mientras la app corre:**
- Presiona `r` para recargar
- Presiona `m` para alternar menú
- Presiona `j` para abrir debugger
- Presiona `i` para correr en iOS
- Presiona `a` para correr en Android

---

## 📱 Paso 8: Agregar Navegación (Expo Router)

Expo Router usa navegación basada en archivos (como Next.js).

### 8.1 Instalar Expo Router

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

### 8.2 Actualizar package.json

```json
{
  "main": "expo-router/entry"
}
```

### 8.3 Crear estructura de carpetas

```bash
mkdir app
mkdir app/(tabs)
mkdir components
```

### 8.4 Crear layout principal

Crear `app/_layout.tsx`:

```typescript
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}
```

### 8.5 Crear tabs

Crear `app/(tabs)/_layout.tsx`:

```typescript
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopColor: '#334155',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Productos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### 8.6 Crear pantallas

Crear `app/(tabs)/index.tsx`:

```typescript
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Home</Text>
      <Text style={styles.subtitle}>Bienvenido a Raisket</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
  },
});
```

Crear `app/(tabs)/products.tsx` y `app/(tabs)/profile.tsx` de forma similar.

---

## 🎯 Paso 9: Compartir Código con tu Web

Puedes reutilizar código entre tu web (Next.js) y la app móvil:

### 9.1 Compartir tipos

```bash
# Crear carpeta compartida
mkdir ../shared
mkdir ../shared/types
```

Crear `shared/types/database.types.ts`:

```typescript
export interface FinancialProduct {
  id: string;
  name: string;
  institution_name: string;
  product_type: string;
  interest_rate?: number;
  // ... otros campos
}
```

### 9.2 Usar en ambos proyectos

**En la app móvil:**
```typescript
import { FinancialProduct } from '../../shared/types/database.types';
```

**En la web:**
```typescript
import { FinancialProduct } from '../shared/types/database.types';
```

---

## 🚀 Paso 10: Preparar para Producción

### 10.1 Inicializar EAS

```bash
# Dentro de raisket-mobile/
eas init

# Login a tu cuenta Expo
eas login
```

### 10.2 Configurar eas.json

```json
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
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 10.3 Crear build de desarrollo

```bash
# Para iOS (requiere cuenta de Apple Developer)
eas build --profile development --platform ios

# Para Android
eas build --profile development --platform android
```

---

## 📚 Próximos Pasos Recomendados

1. **Implementar Autenticación**
   ```bash
   npm install @supabase/auth-helpers-react-native
   ```

2. **Agregar UI Components**
   - React Native Paper
   - React Native Elements
   - Native Base

3. **Implementar Navegación Completa**
   - Stack navigation
   - Modal screens
   - Deep linking

4. **Agregar Features Nativos**
   ```bash
   npx expo install expo-camera          # Cámara
   npx expo install expo-location        # GPS
   npx expo install expo-notifications   # Push notifications
   npx expo install expo-biometrics      # Face ID / Fingerprint
   ```

5. **Testing**
   ```bash
   npm install --save-dev jest @testing-library/react-native
   ```

---

## 🆘 Comandos Útiles

```bash
# Iniciar desarrollo
npx expo start

# Limpiar caché
npx expo start -c

# Verificar configuración
npx expo doctor

# Actualizar dependencias
npx expo install --fix

# Ver build en EAS
eas build:list

# Ver logs
npx expo logs
```

---

## 📖 Recursos

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Router](https://expo.github.io/router/)
- [Supabase React Native](https://supabase.com/docs/guides/with-react-native)
- [Expo Forums](https://forums.expo.dev/)

---

## 🎉 ¡Listo!

Ahora tienes:
- ✅ Proyecto React Native + Expo creado
- ✅ Integración con Supabase
- ✅ Sistema de navegación configurado
- ✅ Hot reload funcionando
- ✅ Base para desarrollar tu app

**Siguiente paso:** Empezar a implementar las pantallas del MVP según el plan de desarrollo.
