// scripts/test-connection.ts
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('🔍 Testing Supabase Connection\n');
console.log('URL:', supabaseUrl);
console.log('Service Key present:', !!supabaseServiceKey);
console.log('Service Key length:', supabaseServiceKey?.length || 0);
console.log('Anon Key present:', !!supabaseAnonKey);
console.log('Anon Key length:', supabaseAnonKey?.length || 0);

async function testConnection() {
  // Test with Service Role Key
  console.log('\n--- Testing with SERVICE ROLE KEY ---');
  const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

  const { data: subcats, error: subError } = await supabaseService
    .from('subcategorias')
    .select('id, nombre, slug');

  if (subError) {
    console.error('❌ Error with Service Key:', subError);
  } else {
    console.log(`✅ Success! Found ${subcats?.length || 0} subcategories:`);
    subcats?.forEach(sub => {
      console.log(`  - ${sub.slug} → ${sub.nombre}`);
    });
  }

  // Test with Anon Key
  console.log('\n--- Testing with ANON KEY ---');
  const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

  const { data: subcats2, error: subError2 } = await supabaseAnon
    .from('subcategorias')
    .select('id, nombre, slug');

  if (subError2) {
    console.error('❌ Error with Anon Key:', subError2);
  } else {
    console.log(`✅ Success! Found ${subcats2?.length || 0} subcategories:`);
    subcats2?.forEach(sub => {
      console.log(`  - ${sub.slug} → ${sub.nombre}`);
    });
  }

  // Test inserting a product (will fail with RLS, but good to see the error)
  console.log('\n--- Testing INSERT with SERVICE KEY ---');
  const { error: insertError } = await supabaseService
    .from('instituciones')
    .select('id')
    .limit(1);

  if (insertError) {
    console.error('❌ Error querying institutions:', insertError);
  } else {
    console.log('✅ Can query institutions successfully');
  }
}

testConnection();
