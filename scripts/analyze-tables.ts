// scripts/analyze-tables.ts
// Analizar tablas de Supabase y su uso en el código

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function analyzeTable(tableName: string) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      return { table: tableName, exists: false, error: error.message };
    }

    // Obtener columnas
    const { data: columns, error: colError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    return {
      table: tableName,
      exists: true,
      count: count || 0,
      columns: columns && columns[0] ? Object.keys(columns[0]) : [],
    };
  } catch (error: any) {
    return { table: tableName, exists: false, error: error.message };
  }
}

async function main() {
  console.log('🔍 Analizando tablas de Supabase...\n');

  const tablesToCheck = [
    'productos',
    'instituciones',
    'categorias',
    'subcategorias',
    'caracteristicas',
    'reviews',
    'users',
    'profiles',
    'chat_messages',
    'chat_sessions',
    'financial_products',
    'product_reviews',
    'user_favorites',
  ];

  const results = [];

  for (const table of tablesToCheck) {
    const result = await analyzeTable(table);
    results.push(result);
  }

  console.log('📊 RESUMEN DE TABLAS:\n');
  console.log('='.repeat(80));

  const existingTables = results.filter((r) => r.exists);
  const missingTables = results.filter((r) => !r.exists);

  console.log('\n✅ TABLAS EXISTENTES:\n');
  existingTables.forEach((r) => {
    console.log(`  📋 ${r.table}`);
    console.log(`     Registros: ${r.count}`);
    console.log(`     Columnas: ${r.columns?.length || 0}`);
    if (r.columns && r.columns.length > 0) {
      console.log(`     Campos: ${r.columns.slice(0, 5).join(', ')}${r.columns.length > 5 ? '...' : ''}`);
    }
    console.log('');
  });

  console.log('\n❌ TABLAS NO ENCONTRADAS:\n');
  missingTables.forEach((r) => {
    console.log(`  ⚠️  ${r.table}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log(`\nTotal existentes: ${existingTables.length}`);
  console.log(`Total no encontradas: ${missingTables.length}`);

  // Análisis de uso en el código
  console.log('\n\n📝 ANÁLISIS DE USO EN EL CÓDIGO:\n');
  console.log('='.repeat(80));

  const codeAnalysis = {
    productos: {
      usedIn: ['src/lib/products.ts', 'src/app/products/[id]/page.tsx'],
      purpose: 'Sistema antiguo de productos (tabla normalizada)',
      recommendation: '⚠️  DEPRECAR - Usar financial_products en su lugar',
    },
    instituciones: {
      usedIn: ['src/lib/products.ts'],
      purpose: 'Instituciones financieras (relacionado con productos antiguos)',
      recommendation: '⚠️  DEPRECAR - Ya no necesario con financial_products',
    },
    categorias: {
      usedIn: ['src/lib/products.ts'],
      purpose: 'Categorías de productos (normalizado)',
      recommendation: '⚠️  DEPRECAR - financial_products usa ENUM',
    },
    subcategorias: {
      usedIn: ['src/lib/products.ts'],
      purpose: 'Subcategorías de productos',
      recommendation: '⚠️  DEPRECAR - No necesario en MVP',
    },
    caracteristicas: {
      usedIn: [],
      purpose: 'Características de productos (normalizado)',
      recommendation: '❌ ELIMINAR - No usado, meta_data en financial_products',
    },
    financial_products: {
      usedIn: ['src/lib/financial-products.ts', 'src/app/page.tsx', 'src/app/tarjetas-credito/page.tsx'],
      purpose: '✅ NUEVA tabla polimórfica para MVP',
      recommendation: '✅ MANTENER - Sistema principal del MVP',
    },
    reviews: {
      usedIn: ['src/data/reviews.ts'],
      purpose: 'Reseñas de usuarios',
      recommendation: '✅ MANTENER - Sistema de reseñas',
    },
    users: {
      usedIn: ['Supabase Auth'],
      purpose: 'Usuarios (Auth)',
      recommendation: '✅ MANTENER - Sistema de autenticación',
    },
    profiles: {
      usedIn: [],
      purpose: 'Perfiles de usuario extendidos',
      recommendation: '⚠️  Verificar si existe - Podría ser útil',
    },
    chat_messages: {
      usedIn: ['src/app/chat/page.tsx'],
      purpose: 'Mensajes del chat AI',
      recommendation: '✅ MANTENER - Sistema de chat',
    },
  };

  Object.entries(codeAnalysis).forEach(([table, info]) => {
    console.log(`\n📋 ${table.toUpperCase()}`);
    console.log(`   Propósito: ${info.purpose}`);
    console.log(`   Usado en: ${info.usedIn.length > 0 ? info.usedIn.join(', ') : 'No usado'}`);
    console.log(`   ${info.recommendation}`);
  });

  console.log('\n' + '='.repeat(80));
}

main().catch(console.error);
