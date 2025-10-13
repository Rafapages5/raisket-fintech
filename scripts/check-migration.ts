// scripts/check-migration.ts
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMigration() {
  console.log('🔍 Checking migration status...\n');

  try {
    // Check products
    const { data: products, error: prodError } = await supabase
      .from('productos')
      .select('id, nombre, institucion_id, subcategoria_id, activo')
      .limit(10);

    if (prodError) {
      console.error('❌ Error fetching products:', prodError);
      return;
    }

    console.log(`📦 Total products in first 10: ${products?.length || 0}`);
    if (products && products.length > 0) {
      console.log('\nSample products:');
      products.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.nombre} (ID: ${p.id.slice(0, 8)}..., Active: ${p.activo})`);
      });
    }

    // Check institutions
    const { data: institutions, error: instError } = await supabase
      .from('instituciones')
      .select('id, nombre, activa')
      .limit(10);

    if (instError) {
      console.error('❌ Error fetching institutions:', instError);
      return;
    }

    console.log(`\n🏢 Total institutions in first 10: ${institutions?.length || 0}`);
    if (institutions && institutions.length > 0) {
      console.log('\nSample institutions:');
      institutions.forEach((i, idx) => {
        console.log(`  ${idx + 1}. ${i.nombre} (Active: ${i.activa})`);
      });
    }

    // Check subcategories
    const { data: subcats, error: subError } = await supabase
      .from('subcategorias')
      .select('id, nombre, slug');

    if (subError) {
      console.error('❌ Error fetching subcategories:', subError);
      return;
    }

    console.log(`\n📂 Total subcategories: ${subcats?.length || 0}`);
    if (subcats && subcats.length > 0) {
      console.log('\nSubcategories:');
      subcats.forEach((s, idx) => {
        console.log(`  ${idx + 1}. ${s.nombre} (slug: ${s.slug})`);
      });
    }

    // Check full query that the app uses
    console.log('\n🔍 Testing app query (productos with joins)...');
    const { data: fullProducts, error: fullError } = await supabase
      .from('productos')
      .select(`
        *,
        instituciones(*),
        subcategorias(*, categorias(*))
      `)
      .eq('activo', true)
      .limit(5);

    if (fullError) {
      console.error('❌ Error with full query:', fullError);
      return;
    }

    console.log(`✅ Full query returned ${fullProducts?.length || 0} products`);
    if (fullProducts && fullProducts.length > 0) {
      console.log('\nFull product sample:');
      fullProducts.forEach((p: any, idx) => {
        console.log(`  ${idx + 1}. ${p.nombre}`);
        console.log(`     Institution: ${p.instituciones?.nombre || 'N/A'}`);
        console.log(`     Category: ${p.subcategorias?.categorias?.nombre || 'N/A'}`);
        console.log(`     Subcategory: ${p.subcategorias?.nombre || 'N/A'}`);
      });
    }

  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
  }
}

checkMigration();
