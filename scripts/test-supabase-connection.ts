import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database';

// Ensure environment variables are loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🧪 Testing Supabase connection and schema...');

  try {
    // 1. Test basic connection
    console.log('\n1️⃣ Testing basic connection...');
    const { data: institutions, error: instError } = await supabase
      .from('institutions')
      .select('count(*)')
      .limit(1);

    if (instError) {
      console.error('❌ Institution table error:', instError);
      return;
    }
    console.log('✅ Connection to institutions table works');

    // 2. Test new schema fields
    console.log('\n2️⃣ Testing new product schema fields...');
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        category,
        segment,
        tagline,
        long_description,
        image_url,
        ai_hint,
        provider,
        features,
        benefits,
        average_rating,
        review_count,
        fees,
        eligibility,
        details_url,
        interest_rate,
        loan_term,
        max_loan_amount,
        min_investment,
        investment_type,
        coverage_amount
      `)
      .limit(1);

    if (prodError) {
      console.error('❌ Products schema error:', prodError);
      console.error('This likely means the migration didn\'t run correctly.');
      return;
    }
    console.log('✅ All new schema fields are accessible');

    // 3. Test insert with new schema
    console.log('\n3️⃣ Testing insert with new schema...');
    const testProduct = {
      id: 'test-product-' + Date.now(),
      institution_id: '550e8400-e29b-41d4-a716-446655440001', // Will need to exist
      name: 'Test Product',
      category: 'Crédito',
      segment: 'Personas',
      tagline: 'Test tagline',
      description: 'Test description',
      long_description: 'Test long description',
      provider: 'Test Provider',
      features: ['Feature 1', 'Feature 2'],
      benefits: ['Benefit 1', 'Benefit 2'],
      average_rating: 4.5,
      review_count: 10,
      fees: 'No fees',
      eligibility: ['Test requirement'],
      is_active: true
    };

    const { error: insertError } = await supabase
      .from('products')
      .insert([testProduct]);

    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
      return;
    }
    console.log('✅ Insert test successful');

    // 4. Clean up test product
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', testProduct.id);

    if (deleteError) {
      console.warn('⚠️ Cleanup failed:', deleteError);
    } else {
      console.log('✅ Test cleanup successful');
    }

    console.log('\n🎉 All tests passed! Your schema migration was successful.');
    console.log('📝 You can now run the product migration script.');

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Run the test
if (require.main === module) {
  testConnection();
}

export { testConnection };