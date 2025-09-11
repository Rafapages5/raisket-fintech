const { createClient } = require('@supabase/supabase-js');
const { mockProducts } = require('../src/data/products.ts');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// First, create institutions that will be referenced by products
const institutions = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Banco Global',
    brand_name: 'Banco Global',
    institution_type: 'bank',
    website: 'https://bancoglobal.com',
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Cooperativa de Crédito Campus',
    brand_name: 'Campus Credit Union',
    institution_type: 'credit_union',
    website: 'https://campuscu.com',
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'TrustLend Finance',
    brand_name: 'TrustLend',
    institution_type: 'fintech',
    website: 'https://trustlend.com',
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'FutureVest Advisors',
    brand_name: 'FutureVest',
    institution_type: 'investment_firm',
    website: 'https://futurevest.com',
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'SecureLife Insurance Co.',
    brand_name: 'SecureLife',
    institution_type: 'insurance',
    website: 'https://securelife.com',
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Banco Enterprise',
    brand_name: 'Enterprise Bank',
    institution_type: 'bank',
    website: 'https://enterprisebank.com',
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Momentum Business Capital',
    brand_name: 'Momentum Capital',
    institution_type: 'fintech',
    website: 'https://momentumcapital.com',
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'Apex Business Bank',
    brand_name: 'Apex Bank',
    institution_type: 'bank',
    website: 'https://apexbank.com',
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    name: 'Guardian Business Insurers',
    brand_name: 'Guardian Insurance',
    institution_type: 'insurance',
    website: 'https://guardianinsurance.com',
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'BBVA México',
    brand_name: 'BBVA',
    institution_type: 'bank',
    cnbv_license: 'CNB-001-BBVA',
    condusef_registration: 'CONDUSEF-BBVA-2024',
    website: 'https://bbva.mx',
    is_active: true,
  },
];

// Map provider names to institution IDs
const providerToInstitutionId = {
  'Banco Global': '550e8400-e29b-41d4-a716-446655440001',
  'Cooperativa de Crédito Campus': '550e8400-e29b-41d4-a716-446655440002',
  'TrustLend Finance': '550e8400-e29b-41d4-a716-446655440003',
  'FutureVest Advisors': '550e8400-e29b-41d4-a716-446655440004',
  'SecureLife Insurance Co.': '550e8400-e29b-41d4-a716-446655440005',
  'Banco Enterprise': '550e8400-e29b-41d4-a716-446655440006',
  'Momentum Business Capital': '550e8400-e29b-41d4-a716-446655440007',
  'Apex Business Bank': '550e8400-e29b-41d4-a716-446655440008',
  'Guardian Business Insurers': '550e8400-e29b-41d4-a716-446655440009',
  'BBVA México': '550e8400-e29b-41d4-a716-446655440010',
};

async function migrateData() {
  try {
    console.log('🚀 Starting migration...');

    // 1. Insert institutions first
    console.log('📦 Inserting institutions...');
    const { error: institutionsError } = await supabase
      .from('institutions')
      .upsert(institutions, { onConflict: 'id' });

    if (institutionsError) {
      console.error('❌ Error inserting institutions:', institutionsError);
      return;
    }
    console.log('✅ Institutions inserted successfully');

    // 2. Transform mockProducts to database format
    console.log('🔄 Transforming products...');
    const transformedProducts = mockProducts.map((product) => {
      const institutionId = providerToInstitutionId[product.provider];
      
      if (!institutionId) {
        console.warn(`⚠️ No institution found for provider: ${product.provider}`);
      }

      return {
        id: product.id,
        institution_id: institutionId || institutions[0].id,
        name: product.name,
        product_code: product.id,
        category: product.category,
        subcategory: product.segment,
        description: product.description,
        terms_and_conditions: product.longDescription || product.description,
        is_active: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    // 3. Insert products
    console.log('📦 Inserting products...');
    const { error: productsError } = await supabase
      .from('products')
      .upsert(transformedProducts, { onConflict: 'id' });

    if (productsError) {
      console.error('❌ Error inserting products:', productsError);
      return;
    }

    console.log(`✅ Successfully migrated ${transformedProducts.length} products`);
    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('💥 Migration failed:', error);
  }
}

// Run the migration
migrateData();