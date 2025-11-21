# Guía de Implementación Schema.org - Raisket

## 📋 Contenido

1. [Visión General](#visión-general)
2. [Archivos Creados](#archivos-creados)
3. [Schemas Implementados](#schemas-implementados)
4. [Cómo Usar](#cómo-usar)
5. [Testing y Validación](#testing-y-validación)
6. [Próximos Pasos](#próximos-pasos)

---

## 🎯 Visión General

Se ha implementado un sistema completo de **Schema.org** (datos estructurados JSON-LD) en todo el sitio para mejorar el SEO y permitir que los motores de búsqueda entiendan mejor tu contenido.

### Beneficios

✅ **Mejores Rich Snippets** en Google (breadcrumbs, ratings, precios)
✅ **Mayor visibilidad** en resultados de búsqueda
✅ **Mejor indexación** por parte de motores de búsqueda
✅ **Preparado para AI Search** (ChatGPT, Gemini, Claude)
✅ **FAQ Schema** para aparecer en People Also Ask
✅ **Sitemap dinámico** que se actualiza automáticamente

---

## 📁 Archivos Creados

### 1. Sistema de Schemas

```
src/lib/schema/
├── types.ts           # Tipos TypeScript para todos los schemas
├── generators.ts      # Funciones para generar schemas
├── SchemaScript.tsx   # Componente React para renderizar JSON-LD
└── index.ts          # Exportaciones centralizadas
```

### 2. Configuración SEO

```
src/app/
├── sitemap.ts        # Sitemap dinámico
├── robots.ts         # robots.txt optimizado
└── layout.tsx        # Schemas globales (Organization, WebSite)
```

### 3. Páginas Actualizadas

- ✅ [layout.tsx](../src/app/layout.tsx) - Schemas globales
- ✅ [(nerdwallet)/page.tsx](../src/app/(nerdwallet)/page.tsx) - Homepage
- ✅ [tarjetas-credito/page.tsx](../src/app/tarjetas-credito/page.tsx)
- ✅ [prestamos-personales/page.tsx](../src/app/prestamos-personales/page.tsx)
- ✅ [inversiones/page.tsx](../src/app/inversiones/page.tsx)
- ✅ [cuentas-bancarias/page.tsx](../src/app/cuentas-bancarias/page.tsx)

---

## 🏗️ Schemas Implementados

### 1. Organization & WebSite (Global)

**Ubicación:** `src/app/layout.tsx`

```typescript
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema/generators';

const organizationSchema = generateOrganizationSchema();
const websiteSchema = generateWebSiteSchema();
```

**Aparece en:** Todas las páginas del sitio

### 2. BreadcrumbList

**Uso:**

```typescript
import { generateBreadcrumbSchema } from '@/lib/schema/generators';

const breadcrumb = generateBreadcrumbSchema([
  { name: 'Inicio', url: 'https://raisket.mx' },
  { name: 'Tarjetas de Crédito' },
]);
```

**Resultado SEO:** Breadcrumbs en resultados de búsqueda de Google

### 3. Product & ItemList

**Para productos individuales:**

```typescript
import { generateProductSchema } from '@/lib/schema/generators';

const productSchema = generateProductSchema(product);
```

**Para listas de productos:**

```typescript
import { generateProductListSchema } from '@/lib/schema/generators';

const listSchema = generateProductListSchema(products, {
  name: 'Las Mejores Tarjetas de Crédito',
  description: 'Listado completo',
});
```

### 4. Article

**Para contenido editorial:**

```typescript
import { generateArticleSchema } from '@/lib/schema/generators';

const articleSchema = generateArticleSchema({
  title: 'Guía de Tarjetas de Crédito',
  description: 'Todo sobre tarjetas',
  datePublished: new Date().toISOString(),
  url: 'https://raisket.mx/tarjetas-de-credito',
});
```

### 5. FAQPage

**Para preguntas frecuentes:**

```typescript
import { generateFAQSchema } from '@/lib/schema/generators';

const faqSchema = generateFAQSchema([
  {
    question: '¿Qué es el CAT?',
    answer: 'El CAT es el Costo Anual Total...',
  },
  // más preguntas...
]);
```

---

## 🚀 Cómo Usar

### Agregar Schema a una Nueva Página

**1. Importar las funciones necesarias:**

```typescript
import SchemaScript from '@/lib/schema/SchemaScript';
import {
  generateBreadcrumbSchema,
  generateArticleSchema
} from '@/lib/schema/generators';
```

**2. Generar los schemas en tu componente:**

```typescript
export default async function MiPagina() {
  // Tus datos...

  // Generar schemas
  const breadcrumb = generateBreadcrumbSchema([...]);
  const article = generateArticleSchema({...});

  return (
    <div>
      {/* Renderizar schemas */}
      <SchemaScript schema={[breadcrumb, article]} />

      {/* Tu contenido */}
    </div>
  );
}
```

**3. Actualizar metadata:**

```typescript
export const metadata: Metadata = {
  title: 'Tu Título',
  description: 'Tu descripción optimizada',
  alternates: {
    canonical: '/tu-ruta',
  },
};
```

### Ejemplo Completo: Página de Review Individual

```typescript
// src/app/tarjetas-de-credito/reviews/[slug]/page.tsx

import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/schema/generators';
import SchemaScript from '@/lib/schema/SchemaScript';

export default async function ProductReviewPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://raisket.mx' },
    { name: 'Tarjetas de Crédito', url: 'https://raisket.mx/tarjetas-de-credito' },
    { name: product.name },
  ]);

  return (
    <div>
      <SchemaScript schema={[productSchema, breadcrumbSchema]} />

      <h1>{product.name}</h1>
      {/* Tu contenido */}
    </div>
  );
}
```

---

## ✅ Testing y Validación

### Herramientas de Validación

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Pega la URL de tu página
   - Verifica que no haya errores

2. **Schema Markup Validator**
   - URL: https://validator.schema.org/
   - Pega el código JSON-LD
   - Valida la sintaxis

3. **Google Search Console**
   - Sección "Mejoras" → "Datos estructurados"
   - Monitorea errores y warnings

### Comando para ver el JSON-LD generado

```bash
# En desarrollo
npm run dev

# Abre en el navegador y ve el código fuente (Ctrl+U)
# Busca <script type="application/ld+json">
```

### Verificar el Sitemap

```bash
# En desarrollo
http://localhost:3000/sitemap.xml

# En producción
https://raisket.mx/sitemap.xml
```

---

## 🎯 Próximos Pasos (FASE 2)

### 1. Páginas de "Mejores" (Spoke Pages)

Crear páginas como:
- `/tarjetas-de-credito/mejores/sin-anualidad`
- `/tarjetas-de-credito/mejores/cashback`

**Código ejemplo:**

```typescript
// src/app/tarjetas-de-credito/mejores/[filtro]/page.tsx

export async function generateStaticParams() {
  return [
    { filtro: 'sin-anualidad' },
    { filtro: 'cashback' },
    { filtro: 'para-viajar' },
  ];
}

export default async function MejoresTarjetasPage({ params }) {
  const products = await getFilteredProducts(params.filtro);

  const schemas = [
    generateBreadcrumbSchema([...]),
    generateProductListSchema(products, {...}),
    generateArticleSchema({...}),
  ];

  return (
    <div>
      <SchemaScript schema={schemas} />
      {/* Contenido editorial + lista */}
    </div>
  );
}
```

### 2. Páginas de Comparación

Crear:
- `/comparar/[slug1]-vs-[slug2]`

**Schema específico:**

```typescript
// Combinar los schemas de ambos productos
const comparisonSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Comparación: ${product1.name} vs ${product2.name}`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, item: generateProductSchema(product1) },
    { '@type': 'ListItem', position: 2, item: generateProductSchema(product2) },
  ],
};
```

### 3. Sistema de Reviews de Usuarios

Agregar **Review Schema** cuando implementes reviews:

```typescript
const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'Review',
  itemReviewed: generateProductSchema(product),
  author: {
    '@type': 'Person',
    name: 'Juan Pérez',
  },
  reviewRating: {
    '@type': 'Rating',
    ratingValue: 5,
    bestRating: 5,
  },
  reviewBody: 'Excelente tarjeta...',
};
```

### 4. Páginas de Institución

Crear:
- `/instituciones/[slug]`

Con **FinancialService** schema.

### 5. Blog/Guías

Cuando crees el blog, usa:
- `generateArticleSchema()` para cada post
- `generateFAQSchema()` si tiene preguntas frecuentes
- Author schema para perfiles de autores

---

## 📊 Métricas de Éxito

### Corto Plazo (1-2 meses)

- ✅ 0 errores en Google Search Console → Datos Estructurados
- ✅ Breadcrumbs visibles en resultados de búsqueda
- ✅ Ratings (estrellas) en resultados si tienes reviews

### Mediano Plazo (3-6 meses)

- 📈 Aumento en CTR (Click-Through Rate) de resultados orgánicos
- 📈 Aparición en "People Also Ask" por el FAQ schema
- 📈 Rich snippets con información de productos

### Largo Plazo (6-12 meses)

- 🎯 Citaciones por ChatGPT/Claude/Gemini como fuente autorizada
- 🎯 Top 3 en búsquedas clave de finanzas en México
- 🎯 Incremento significativo en tráfico orgánico

---

## 🐛 Troubleshooting

### Error: "Invalid Schema"

**Problema:** Google reporta error en Schema.org

**Solución:**
1. Valida en https://validator.schema.org/
2. Verifica que todos los campos requeridos estén presentes
3. Revisa que las URLs sean absolutas (https://raisket.mx/...)

### Los schemas no aparecen en el código fuente

**Problema:** No ves el JSON-LD en el HTML

**Solución:**
1. Verifica que `SchemaScript` esté dentro del `return` del componente
2. Asegúrate de que Next.js haya compilado correctamente
3. Limpia cache: `rm -rf .next && npm run build`

### Sitemap vacío

**Problema:** `/sitemap.xml` no muestra productos

**Solución:**
1. Verifica que `getFinancialProducts()` funcione
2. Revisa la conexión a Supabase
3. Verifica que haya productos con `is_active = true`

---

## 📚 Referencias

- [Schema.org Documentation](https://schema.org/)
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [JSON-LD](https://json-ld.org/)

---

## 💡 Tips Pro

1. **Actualiza fechas:** Usa `dateModified` en articles para mostrar que el contenido está fresco
2. **Ratings reales:** Si tienes 0 reviews, omite el `aggregateRating` (Google penaliza ratings falsos)
3. **URLs canónicas:** Siempre usa URLs absolutas en schemas
4. **Testing continuo:** Valida cada nueva página en Rich Results Test
5. **Monitoreo:** Revisa Google Search Console semanalmente

---

**¡Tu sitio ahora está optimizado para SEO a nivel profesional!** 🚀

Las IA como ChatGPT, Claude y Gemini podrán entender y citar tu contenido como fuente autorizada en finanzas mexicanas.
