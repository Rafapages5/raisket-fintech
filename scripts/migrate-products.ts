import { createClient } from '@supabase/supabase-js';
import { mockProducts } from '../src/data/products';
import type { Database } from '../src/types/database';

// Ensure environment variables are loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

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
const providerToInstitutionId: Record<string, string> = {
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

// Helper function to parse interest rates
function parseInterestRate(rateString: string): { min: number; max: number } {
  // Handle different rate formats
  if (rateString.includes('-')) {
    const [minStr, maxStr] = rateString.split('-');
    const min = parseFloat(minStr.replace(/[^\d.]/g, ''));
    const max = parseFloat(maxStr.replace(/[^\d.]/g, ''));
    return { min: min / 100, max: max / 100 }; // Convert percentage to decimal
  } else {
    const rate = parseFloat(rateString.replace(/[^\d.]/g, ''));
    return { min: rate / 100, max: rate / 100 };
  }
}

// Helper function to parse loan terms
function parseLoanTerm(termString: string): { min: number; max: number } {
  if (termString.includes('-')) {
    const [minStr, maxStr] = termString.split('-');
    const min = parseInt(minStr.replace(/[^\d]/g, ''));
    const max = parseInt(maxStr.replace(/[^\d]/g, ''));
    return { min, max };
  } else {
    const term = parseInt(termString.replace(/[^\d]/g, ''));
    return { min: term, max: term };
  }
}

// Helper function to parse amounts
function parseAmount(amountString: string): number {
  const cleanAmount = amountString.replace(/[$,MXN\s]/g, '');
  const multiplier = amountString.toLowerCase().includes('k') ? 1000 : 
                   amountString.toLowerCase().includes('m') ? 1000000 : 1;
  return parseFloat(cleanAmount) * multiplier;
}

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

      // Parse interest rates
      let interestRateMin: number | null = null;
      let interestRateMax: number | null = null;
      if (product.interestRate) {
        const rates = parseInterestRate(product.interestRate);
        interestRateMin = rates.min;
        interestRateMax = rates.max;
      }

      // Parse loan terms
      let minTermMonths: number | null = null;
      let maxTermMonths: number | null = null;
      if (product.loanTerm) {
        const terms = parseLoanTerm(product.loanTerm);
        minTermMonths = terms.min;
        maxTermMonths = terms.max;
      }

      // Parse amounts
      let maxAmount: number | null = null;
      if (product.maxLoanAmount) {
        maxAmount = parseAmount(product.maxLoanAmount);
      }

      let minInvestment: number | null = null;
      if (product.minInvestment) {
        minInvestment = parseAmount(product.minInvestment);
      }

      return {
        id: product.id,
        institution_id: institutionId || institutions[0].id, // Fallback to first institution
        name: product.name,
        product_code: product.id,
        category: product.category,
        subcategory: product.segment, // Keep for backwards compatibility
        segment: product.segment, // New field
        description: product.description,
        long_description: product.longDescription,
        tagline: product.tagline,
        terms_and_conditions: product.longDescription || product.description,
        min_amount: minInvestment,
        max_amount: maxAmount,
        interest_rate_min: interestRateMin,
        interest_rate_max: interestRateMax,
        interest_rate: product.interestRate, // New string field
        min_term_months: minTermMonths,
        max_term_months: maxTermMonths,
        loan_term: product.loanTerm, // New string field
        annual_fee: product.fees && product.fees.includes('$') ? parseAmount(product.fees) : null,
        image_url: product.imageUrl,
        ai_hint: product.aiHint,
        provider: product.provider, // New field
        features: product.features, // New array field
        benefits: product.benefits, // New array field
        average_rating: product.averageRating, // New rating field
        review_count: product.reviewCount, // New count field
        fees: product.fees, // New string field
        eligibility: product.eligibility, // New array field
        details_url: product.detailsUrl,
        max_loan_amount: product.maxLoanAmount, // New string field
        min_investment: product.minInvestment, // New string field
        investment_type: product.investmentType, // New field
        coverage_amount: product.coverageAmount, // New field
        is_active: true,
        is_featured: product.averageRating && product.averageRating >= 4.5, // Auto-feature high-rated products
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
if (require.main === module) {
  migrateData();
}

export { migrateData };