// scripts/check-db-simple.mjs
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Missing Supabase env variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('🔍 Checking Supabase structure...\n');

  // Check productos table
  const { data: productos, error } = await supabase
    .from('productos')
    .select(`
      id,
      nombre,
      segmento,
      subcategorias(nombre, categorias(nombre)),
      instituciones(nombre)
    `)
    .eq('activo', true)
    .limit(5);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`✓ Found ${productos?.length || 0} products`);
  console.log('\n📦 Sample products:');
  productos?.forEach((p, i) => {
    console.log(`\n${i + 1}. ${p.nombre}`);
    console.log(`   Segmento: ${p.segmento}`);
    console.log(`   Institución: ${p.instituciones?.nombre}`);
    console.log(`   Categoría: ${p.subcategorias?.categorias?.nombre} > ${p.subcategorias?.nombre}`);
  });

  // Check table columns
  console.log('\n\n🔍 Checking table structure...');
  const { data: columns, error: colError } = await supabase
    .from('productos')
    .select('*')
    .limit(1)
    .single();

  if (!colError && columns) {
    console.log('\n📋 Available columns in productos table:');
    Object.keys(columns).forEach(col => {
      console.log(`   - ${col}`);
    });
  }
}

main().catch(console.error);
