# Flujo de Trabajo: Mantenimiento de SEO Diario

Este documento describe cómo mantener y mejorar el posicionamiento SEO de Raisket. La arquitectura actual está diseñada para ser "Data-Driven SEO", lo que significa que **la calidad de tu SEO depende directamente de la calidad de los datos en tu base de datos**.

## 1. Arquitectura SEO Actual

El sistema automatiza las tareas técnicas de SEO para que te enfoques en el contenido:

*   **Meta Etiquetas (Title/Description):** Se generan automáticamente en `src/app/.../page.tsx` usando el nombre del producto, institución, rating y descripción corta.
*   **Sitemap XML:** Se reconstruye automáticamente en `src/app/sitemap.ts` cada vez que se agregan productos nuevos.
*   **Datos Estructurados (Schema.org):** Se inyectan JSON-LD para Google (Review, Product, FAQ, Breadcrumb) basados en la categoría del producto.
*   **Contenido Editorial:** El texto de las reseñas (Pros, Contras, Análisis) se genera programáticamente en `src/lib/review-content.ts` basándose en los atributos del producto.

## 2. Rutina Diaria de Alimentación SEO

Para "alimentar" el SEO, no necesitas editar código HTML. Debes enriquecer la base de datos en Supabase.

### A. Al Agregar un Nuevo Producto

Cuando agregues un producto en la tabla `financial_products`, asegúrate de llenar estos campos clave para el SEO:

1.  **`slug` (CRÍTICO):** Debe ser limpio y contener palabras clave.
    *   ✅ Bien: `tarjeta-credito-nu-sin-anualidad`
    *   ❌ Mal: `tarjeta-nu-123`
2.  **`description`:** Úsala para el Meta Description. Debe ser persuasiva y contener keywords (ej. "sin anualidad", "tasa baja"). Longitud ideal: 150-160 caracteres.
3.  **`badges`:** Estas etiquetas activan secciones automáticas en la reseña.
    *   Ejemplo: Agregar `["Sin Anualidad", "100% Digital"]` generará automáticamente párrafos sobre estos beneficios en la sección de "Análisis" y "Pros".
4.  **`meta_data`:** Llena este JSON con datos ricos. El sistema usa estos datos para generar preguntas frecuentes (FAQ) y tablas comparativas.
    *   Ejemplo para Tarjeta: `{"annuity": 0, "min_income": 5000, "cat": "35%"}`.

### B. Al Actualizar un Producto Existente

Si Google Search Console indica que una página tiene "Contenido pobre":

1.  Ve a Supabase > `financial_products`.
2.  Mejora el campo `description`.
3.  Agrega más `benefits` (array de texto).
4.  Enriquece el `meta_data`.

### C. Creación de Contenido "Mejores" (Listicles)

Las páginas tipo `/tarjetas-de-credito/mejores/sin-anualidad` se generan basadas en filtros.

1.  Para crear una nueva landing de SEO (ej. "Mejores Tarjetas para Viajes"), no necesitas programar.
2.  Solo asegúrate de que los productos relevantes tengan la etiqueta o categoría correcta en la base de datos.
3.  El sistema agrupará automáticamente los productos y generará la página con su Schema.org correspondiente.

## 3. Monitoreo Técnico

Aunque es automático, verifica periódicamente:

1.  **Sitemap:** Visita `https://raisket.mx/sitemap.xml` para confirmar que los nuevos productos aparecen.
2.  **Rich Results Test:** Usa la herramienta de Google para probar una URL de producto y verificar que los Schemas (Estrellas, FAQ, Precio) se detectan correctamente.

## Resumen

**Tu trabajo de SEO es un trabajo de Datos.**
*   Más datos en `meta_data` = Reseñas más detalladas y largas.
*   Mejores `descriptions` = CTR más alto en Google.
*   `slugs` estratégicos = Mejor ranking por palabras clave.
