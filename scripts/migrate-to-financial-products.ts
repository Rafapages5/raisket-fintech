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

async function migrateToFinancialProducts() {
  try {
    console.log('🚀 Starting migration to financial_products...');

    // Transform mockProducts to financial_products format
    console.log('🔄 Transforming products...');
    const transformedProducts = mockProducts.map((product) => {
      const baseProduct = {
        product_id: product.id,
        name: product.name,
        tagline: product.tagline,
        description: product.description,
        long_description: product.longDescription,
        category: product.category,
        segment: product.segment,
        image_url: product.imageUrl,
        provider: product.provider,
        features: product.features, // JSONB field
        benefits: product.benefits || null, // JSONB field
        eligibility: product.eligibility || null, // JSONB field
        average_rating: product.averageRating,
        review_count: product.reviewCount,
        fees: product.fees,
        ai_hint: product.aiHint,
        details_url: product.detailsUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add category-specific fields based on product category
      if (product.category === 'Crédito') {
        return {
          ...baseProduct,
          credit_interest_rate: product.interestRate,
          credit_loan_term: product.loanTerm,
          credit_max_loan_amount: product.maxLoanAmount,
          credit_min_income: product.eligibility?.find(e => e.includes('ingresos'))?.replace('ingresos mínimos de ', '') || null,
          // Set other category fields to null
          financing_interest_rate: null,
          financing_loan_term: null,
          financing_max_loan_amount: null,
          financing_min_income: null,
          investment_min_balance: null,
          investment_account_type: null,
        };
      } else if (product.category === 'Financiamiento') {
        return {
          ...baseProduct,
          financing_interest_rate: product.interestRate,
          financing_loan_term: product.loanTerm,
          financing_max_loan_amount: product.maxLoanAmount,
          financing_min_income: product.eligibility?.find(e => e.includes('ingresos'))?.replace('ingresos mínimos de ', '') || null,
          // Set other category fields to null
          credit_interest_rate: null,
          credit_loan_term: null,
          credit_max_loan_amount: null,
          credit_min_income: null,
          investment_min_balance: null,
          investment_account_type: null,
        };
      } else if (product.category === 'Inversión') {
        return {
          ...baseProduct,
          investment_min_balance: product.minInvestment,
          investment_account_type: product.investmentType,
          investment_plazo: product.loanTerm, // Some investments have terms
          // Set other category fields to null
          credit_interest_rate: null,
          credit_loan_term: null,
          credit_max_loan_amount: null,
          credit_min_income: null,
          financing_interest_rate: null,
          financing_loan_term: null,
          financing_max_loan_amount: null,
          financing_min_income: null,
        };
      }

      // Default case
      return {
        ...baseProduct,
        credit_interest_rate: null,
        credit_loan_term: null,
        credit_max_loan_amount: null,
        credit_min_income: null,
        financing_interest_rate: null,
        financing_loan_term: null,
        financing_max_loan_amount: null,
        financing_min_income: null,
        investment_min_balance: null,
        investment_account_type: null,
      };
    });

    // Insert products into financial_products table
    console.log('📦 Inserting products into financial_products...');
    const { error: productsError } = await supabase
      .from('financial_products')
      .upsert(transformedProducts, { onConflict: 'product_id' });

    if (productsError) {
      console.error('❌ Error inserting products:', productsError);
      return;
    }

    console.log(`✅ Successfully migrated ${transformedProducts.length} products to financial_products table`);
    console.log('🎉 Migration completed successfully!');

    // Verify migration
    const { data: verifyData, error: verifyError } = await supabase
      .from('financial_products')
      .select('product_id, name, category, segment')
      .limit(5);

    if (verifyError) {
      console.warn('⚠️ Could not verify migration:', verifyError);
    } else {
      console.log('📋 Sample migrated products:');
      verifyData?.forEach(p => {
        console.log(`  - ${p.name} (${p.category} - ${p.segment})`);
      });
    }

  } catch (error) {
    console.error('💥 Migration failed:', error);
  }
}

// Run the migration
if (require.main === module) {
  migrateToFinancialProducts();
}

export { migrateToFinancialProducts };