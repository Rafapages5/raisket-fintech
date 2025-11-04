// scripts/check-supabase-data.ts
// Script para verificar la estructura de datos en Supabase

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Faltan variables de entorno de Supabase');
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabaseData() {
  console.log('🔍 DIAGNÓSTICO DE DATOS EN SUPABASE\n');
  console.log('='.repeat(60));

  // 1. Verificar Categorías
  console.log('\n📁 1. CATEGORÍAS');
  console.log('-'.repeat(60));
  const { data: categorias, error: catError } = await supabase
    .from('categorias')
    .select('*');

  if (catError) {
    console.error('❌ Error al obtener categorías:', catError.message);
  } else {
    console.log(`✓ Total de categorías: ${categorias?.length || 0}`);
    categorias?.forEach(cat => {
      console.log(`  - ${cat.nombre} (slug: ${cat.slug})`);
    });
  }

  // 2. Verificar Subcategorías
  console.log('\n📂 2. SUBCATEGORÍAS');
  console.log('-'.repeat(60));
  const { data: subcategorias, error: subError } = await supabase
    .from('subcategorias')
    .select('*, categorias(nombre)');

  if (subError) {
    console.error('❌ Error al obtener subcategorías:', subError.message);
  } else {
    console.log(`✓ Total de subcategorías: ${subcategorias?.length || 0}`);
    subcategorias?.forEach(sub => {
      console.log(`  - ${sub.nombre} (${(sub as any).categorias?.nombre}) - slug: ${sub.slug}`);
    });
  }

  // 3. Verificar Instituciones
  console.log('\n🏦 3. INSTITUCIONES');
  console.log('-'.repeat(60));
  const { data: instituciones, error: instError } = await supabase
    .from('instituciones')
    .select('*')
    .eq('activa', true);

  if (instError) {
    console.error('❌ Error al obtener instituciones:', instError.message);
  } else {
    console.log(`✓ Total de instituciones activas: ${instituciones?.length || 0}`);
    instituciones?.forEach(inst => {
      console.log(`  - ${inst.nombre}`);
    });
  }

  // 4. Verificar Productos por Segmento
  console.log('\n👥 4. PRODUCTOS POR SEGMENTO');
  console.log('-'.repeat(60));

  const segmentos = ['personas', 'empresas'];
  for (const segmento of segmentos) {
    const { data: productos, error: prodError } = await supabase
      .from('productos')
      .select(`
        id,
        nombre,
        segmento,
        subcategorias(nombre, categorias(nombre))
      `)
      .eq('segmento', segmento)
      .eq('activo', true);

    if (prodError) {
      console.error(`❌ Error al obtener productos de ${segmento}:`, prodError.message);
    } else {
      console.log(`\n${segmento.toUpperCase()}: ${productos?.length || 0} productos`);

      if (productos && productos.length > 0) {
        // Agrupar por categoría
        const porCategoria: Record<string, number> = {};
        productos.forEach(prod => {
          const categoria = (prod as any).subcategorias?.categorias?.nombre || 'Sin categoría';
          porCategoria[categoria] = (porCategoria[categoria] || 0) + 1;
        });

        console.log('  Por categoría:');
        Object.entries(porCategoria).forEach(([cat, count]) => {
          console.log(`    - ${cat}: ${count} productos`);
        });

        console.log('\n  Productos:');
        productos.forEach(prod => {
          const categoria = (prod as any).subcategorias?.categorias?.nombre || 'Sin categoría';
          const subcategoria = (prod as any).subcategorias?.nombre || 'Sin subcategoría';
          console.log(`    - ${prod.nombre}`);
          console.log(`      Categoría: ${categoria} > ${subcategoria}`);
        });
      }
    }
  }

  // 5. Verificar Mapeo de URL a Categorías
  console.log('\n🔗 5. MAPEO DE URLs A CATEGORÍAS');
  console.log('-'.repeat(60));

  const urlMapping = {
    'credit': 'Crédito',
    'financing': 'Financiamiento',
    'investment': 'Inversión'
  };

  for (const [url, categoriaEsperada] of Object.entries(urlMapping)) {
    const { data: productos } = await supabase
      .from('productos')
      .select(`
        id,
        nombre,
        subcategorias(nombre, categorias(nombre, slug))
      `)
      .eq('activo', true);

    if (productos) {
      const productosFiltrados = productos.filter((prod: any) => {
        const categoriaNombre = prod.subcategorias?.categorias?.nombre;
        return categoriaNombre === categoriaEsperada;
      });

      console.log(`\nURL: /individuals/${url} → Categoría: "${categoriaEsperada}"`);
      console.log(`  Productos encontrados: ${productosFiltrados.length}`);

      if (productosFiltrados.length > 0) {
        console.log('  ✓ CORRECTO - Hay productos para esta categoría');
      } else {
        console.log('  ⚠️  ADVERTENCIA - No hay productos para esta categoría');
      }
    }
  }

  // 6. Diagnóstico de Problemas Comunes
  console.log('\n⚠️  6. DIAGNÓSTICO DE PROBLEMAS');
  console.log('-'.repeat(60));

  const { data: allProducts } = await supabase
    .from('productos')
    .select(`
      id,
      nombre,
      segmento,
      subcategorias(nombre, categorias(nombre))
    `)
    .eq('activo', true);

  if (allProducts) {
    // Problema 1: Productos sin segmento
    const sinSegmento = allProducts.filter(p => !p.segmento);
    if (sinSegmento.length > 0) {
      console.log(`\n❌ ${sinSegmento.length} productos SIN segmento definido:`);
      sinSegmento.forEach(p => console.log(`   - ${p.nombre}`));
    } else {
      console.log('\n✓ Todos los productos tienen segmento definido');
    }

    // Problema 2: Productos sin subcategoría
    const sinSubcategoria = allProducts.filter(p => !(p as any).subcategorias);
    if (sinSubcategoria.length > 0) {
      console.log(`\n❌ ${sinSubcategoria.length} productos SIN subcategoría:`);
      sinSubcategoria.forEach(p => console.log(`   - ${p.nombre}`));
    } else {
      console.log('✓ Todos los productos tienen subcategoría');
    }

    // Problema 3: Subcategorías sin categoría
    const sinCategoria = allProducts.filter(p => {
      const sub = (p as any).subcategorias;
      return sub && !sub.categorias;
    });
    if (sinCategoria.length > 0) {
      console.log(`\n❌ ${sinCategoria.length} productos con subcategoría SIN categoría:`);
      sinCategoria.forEach(p => console.log(`   - ${p.nombre}`));
    } else {
      console.log('✓ Todas las subcategorías tienen categoría asociada');
    }

    // Problema 4: Segmentos con valores incorrectos
    const segmentosUnicos = new Set(allProducts.map(p => p.segmento).filter(Boolean));
    console.log(`\n✓ Segmentos únicos encontrados: ${[...segmentosUnicos].join(', ')}`);

    const segmentosValidos = ['personas', 'empresas'];
    const segmentosInvalidos = [...segmentosUnicos].filter(s => !segmentosValidos.includes(s as string));
    if (segmentosInvalidos.length > 0) {
      console.log(`⚠️  Segmentos con valores no estándar: ${segmentosInvalidos.join(', ')}`);
      console.log('   (Deberían ser: "personas" o "empresas")');
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✓ Diagnóstico completado\n');
}

// Ejecutar diagnóstico
checkSupabaseData().catch(console.error);
