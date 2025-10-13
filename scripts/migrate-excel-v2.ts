// scripts/migrate-excel-v2.ts
import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as fs from 'fs';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  WARNING: Using ANON key instead of SERVICE_ROLE key. This may fail due to RLS policies.');
  console.warn('   Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file.\n');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// INTERFACES - Based on actual Excel structure
// ============================================
interface CreditRow {
  Banco: string;
  name: string;
  tagline?: string;
  description?: string;
  longDescription?: string;
  category: string;
  segment?: string;
  imageUrl?: string;
  aiHint?: string;
  provider: string;
  features?: string;
  benefits?: string;
  averageRating?: number;
  reviewCount?: number;
  interestRate?: string;
  fees?: string;
  eligibility?: string;
  detailsUrl?: string;
  cat?: string;
  minCreditLimit?: number | string;
  maxCreditLimit?: number | string;
}

interface FinancingRow {
  Banco: string;
  name: string;
  tagline?: string;
  description?: string;
  longDescription?: string;
  category: string;
  segment?: string;
  imageUrl?: string;
  aiHint?: string;
  provider: string;
  features?: string;
  benefits?: string;
  averageRating?: number;
  reviewCount?: number;
  interestRate?: string;
  fees?: string;
  eligibility?: string;
  detailsUrl?: string;
  cat?: string;
  minAmount?: number | string;
  maxAmount?: number | string;
  loanTerm?: string;
  interestRateType?: string;
  paymentFrequency?: string;
  collateralRequired?: string;
}

interface InvestmentRow {
  Banco: string;
  name: string;
  tagline?: string;
  description?: string;
  longDescription?: string;
  category: string;
  segment?: string;
  aiHint?: string;
  provider: string;
  features?: string;
  benefits?: string;
  averageRating?: number;
  fees?: string;
  eligibility?: string;
  detailsUrl?: string;
  yieldRate?: string;
  gatNominal?: number | string;
  gatReal?: number | string;
  minBalance?: number | string;
  maxBalance?: number | string;
  accountType?: string;
  depositMethods?: string;
  withdrawalMethods?: string;
  ipabProtection?: string;
  cashbackRate?: string;
  monthlyLimit?: string;
}

interface MigrationResult {
  success: number;
  errors: Array<{ row: number; product: string; error: string }>;
  institutions: Map<string, string>;
  skipped: number;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function parseNumericValue(value: any): number | null {
  if (!value) return null;
  if (typeof value === 'number') return value;
  const cleaned = value.toString().replace(/[$,%]/g, '').replace(/,/g, '').trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

function parseInterestRate(rate: string | undefined): { min: number | null; max: number | null } {
  if (!rate) return { min: null, max: null };

  const rangeMatch = rate.match(/([\d.]+)%?\s*-\s*([\d.]+)%?/);
  if (rangeMatch) {
    return {
      min: parseFloat(rangeMatch[1]),
      max: parseFloat(rangeMatch[2])
    };
  }

  const singleMatch = rate.match(/desde\s*([\d.]+)%?/i) || rate.match(/([\d.]+)%?/);
  if (singleMatch) {
    const value = parseFloat(singleMatch[1]);
    return { min: value, max: null };
  }

  return { min: null, max: null };
}

function parseLoanTerm(term: any): { min: number | null; max: number | null } {
  if (!term) return { min: null, max: null };
  const termStr = term.toString();

  const rangeMatch = termStr.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return {
      min: parseInt(rangeMatch[1]),
      max: parseInt(rangeMatch[2])
    };
  }

  const singleMatch = termStr.match(/desde\s*(\d+)|(\d+)/i);
  if (singleMatch) {
    const value = parseInt(singleMatch[1] || singleMatch[2]);
    return { min: value, max: null };
  }

  return { min: null, max: null };
}

function parseArrayField(field: any): string[] {
  if (!field) return [];
  const fieldStr = field.toString();
  return fieldStr
    .split(/[;|]/)
    .map((item: string) => item.trim())
    .filter((item: string) => item.length > 0);
}

function generateSlug(name: string, provider: string): string {
  return `${name}-${provider}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 250);
}

async function getOrCreateInstitution(
  institutionName: string,
  institutionsCache: Map<string, string>
): Promise<string> {
  if (institutionsCache.has(institutionName)) {
    return institutionsCache.get(institutionName)!;
  }

  const { data: existing } = await supabase
    .from('instituciones')
    .select('id')
    .eq('nombre', institutionName)
    .single();

  if (existing) {
    institutionsCache.set(institutionName, existing.id);
    return existing.id;
  }

  const { data: newInstitution, error } = await supabase
    .from('instituciones')
    .insert({
      nombre: institutionName,
      activa: true
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create institution ${institutionName}: ${error.message}`);
  }

  institutionsCache.set(institutionName, newInstitution.id);
  console.log(`  ✅ Created institution: ${institutionName}`);
  return newInstitution.id;
}

async function getSubcategoryId(subcategorySlug: string): Promise<string> {
  const { data, error } = await supabase
    .from('subcategorias')
    .select('id, nombre, slug')
    .eq('slug', subcategorySlug)
    .single();

  if (error || !data) {
    // Show available subcategories for debugging
    const { data: allSubs } = await supabase
      .from('subcategorias')
      .select('slug, nombre');

    console.error(`\n❌ Subcategory '${subcategorySlug}' not found.`);
    console.error('Available subcategories:');
    allSubs?.forEach(sub => console.error(`  - ${sub.slug} (${sub.nombre})`));

    throw new Error(`Subcategory '${subcategorySlug}' not found`);
  }

  console.log(`✅ Found subcategory: ${data.nombre} (${data.slug})`);
  return data.id;
}

// ============================================
// CREDIT PRODUCTS MIGRATION
// ============================================
async function migrateCreditProducts(
  rows: CreditRow[],
  subcategoryId: string,
  result: MigrationResult
): Promise<void> {
  console.log('\n📊 Migrating Credit Products...');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      // Skip empty rows
      if (!row.name || row.name === 'undefined') {
        result.skipped++;
        continue;
      }

      const institutionId = await getOrCreateInstitution(
        row.provider || row.Banco,
        result.institutions
      );

      const interestRate = parseInterestRate(row.interestRate);
      const maxCreditLimit = parseNumericValue(row.maxCreditLimit);
      const minCreditLimit = parseNumericValue(row.minCreditLimit);
      const slug = generateSlug(row.name, row.provider || row.Banco);

      // Insert product
      const { data: product, error: productError } = await supabase
        .from('productos')
        .insert({
          institucion_id: institutionId,
          subcategoria_id: subcategoryId,
          nombre: row.name,
          tagline: row.tagline || null,
          descripcion: row.description || null,
          descripcion_larga: row.longDescription || null,
          segmento: (row.segment || 'Personas').toLowerCase(),
          imagen_url: row.imageUrl || null,
          ai_hint: row.aiHint || row.name,
          proveedor: row.provider || row.Banco,
          url_detalles: row.detailsUrl || null,
          rating_promedio: row.averageRating || 0,
          total_reviews: row.reviewCount || 0,
          activo: true,
          slug
        })
        .select('id')
        .single();

      if (productError) throw productError;

      // Insert credit characteristics
      await supabase
        .from('caracteristicas_credito')
        .insert({
          producto_id: product.id,
          tasa_interes_min: interestRate.min,
          tasa_interes_max: interestRate.max,
          limite_credito_min: minCreditLimit,
          limite_credito_max: maxCreditLimit,
          anualidad: parseNumericValue(row.fees),
          sin_anualidad: row.fees?.toLowerCase().includes('sin') || row.fees?.toLowerCase().includes('gratis') || false
        });

      // Insert features
      const features = parseArrayField(row.features);
      if (features.length > 0) {
        await supabase.from('producto_caracteristicas').insert(
          features.map((f, idx) => ({
            producto_id: product.id,
            tipo: 'feature',
            descripcion: f,
            orden: idx
          }))
        );
      }

      // Insert benefits
      const benefits = parseArrayField(row.benefits);
      if (benefits.length > 0) {
        await supabase.from('producto_caracteristicas').insert(
          benefits.map((b, idx) => ({
            producto_id: product.id,
            tipo: 'benefit',
            descripcion: b,
            orden: idx
          }))
        );
      }

      result.success++;
      console.log(`  ✅ [${i + 1}/${rows.length}] ${row.name}`);

    } catch (error: any) {
      result.errors.push({
        row: i + 1,
        product: row.name || 'Unknown',
        error: error.message
      });
      console.log(`  ❌ [${i + 1}/${rows.length}] ${row.name}: ${error.message}`);
    }
  }
}

// ============================================
// FINANCING PRODUCTS MIGRATION
// ============================================
async function migrateFinancingProducts(
  rows: FinancingRow[],
  subcategoryId: string,
  result: MigrationResult
): Promise<void> {
  console.log('\n📊 Migrating Financing Products...');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      if (!row.name || row.name === 'undefined') {
        result.skipped++;
        continue;
      }

      const institutionId = await getOrCreateInstitution(
        row.provider || row.Banco,
        result.institutions
      );

      const interestRate = parseInterestRate(row.interestRate);
      const loanTerm = parseLoanTerm(row.loanTerm);
      const maxAmount = parseNumericValue(row.maxAmount);
      const minAmount = parseNumericValue(row.minAmount);
      const slug = generateSlug(row.name, row.provider || row.Banco);

      // Insert product
      const { data: product, error: productError } = await supabase
        .from('productos')
        .insert({
          institucion_id: institutionId,
          subcategoria_id: subcategoryId,
          nombre: row.name,
          tagline: row.tagline || null,
          descripcion: row.description || null,
          descripcion_larga: row.longDescription || null,
          segmento: (row.segment || 'Personas').toLowerCase(),
          imagen_url: row.imageUrl || null,
          ai_hint: row.aiHint || row.name,
          proveedor: row.provider || row.Banco,
          url_detalles: row.detailsUrl || null,
          rating_promedio: row.averageRating || 0,
          total_reviews: row.reviewCount || 0,
          activo: true,
          slug
        })
        .select('id')
        .single();

      if (productError) throw productError;

      // Insert financing characteristics
      await supabase
        .from('caracteristicas_financiamiento')
        .insert({
          producto_id: product.id,
          tasa_interes_min: interestRate.min,
          tasa_interes_max: interestRate.max,
          monto_minimo: minAmount,
          monto_maximo: maxAmount,
          plazo_minimo_meses: loanTerm.min,
          plazo_maximo_meses: loanTerm.max,
          tipo_tasa: row.interestRateType || 'fija',
          frecuencia_pago: row.paymentFrequency || 'mensual',
          garantia_requerida: row.collateralRequired?.toLowerCase().includes('sí') || false
        });

      // Insert features
      const features = parseArrayField(row.features);
      if (features.length > 0) {
        await supabase.from('producto_caracteristicas').insert(
          features.map((f, idx) => ({
            producto_id: product.id,
            tipo: 'feature',
            descripcion: f,
            orden: idx
          }))
        );
      }

      // Insert benefits
      const benefits = parseArrayField(row.benefits);
      if (benefits.length > 0) {
        await supabase.from('producto_caracteristicas').insert(
          benefits.map((b, idx) => ({
            producto_id: product.id,
            tipo: 'benefit',
            descripcion: b,
            orden: idx
          }))
        );
      }

      result.success++;
      console.log(`  ✅ [${i + 1}/${rows.length}] ${row.name}`);

    } catch (error: any) {
      result.errors.push({
        row: i + 1,
        product: row.name || 'Unknown',
        error: error.message
      });
      console.log(`  ❌ [${i + 1}/${rows.length}] ${row.name}: ${error.message}`);
    }
  }
}

// ============================================
// INVESTMENT PRODUCTS MIGRATION
// ============================================
async function migrateInvestmentProducts(
  rows: InvestmentRow[],
  subcategoryId: string,
  result: MigrationResult
): Promise<void> {
  console.log('\n📊 Migrating Investment Products...');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      if (!row.name || row.name === 'undefined') {
        result.skipped++;
        continue;
      }

      const institutionId = await getOrCreateInstitution(
        row.provider || row.Banco,
        result.institutions
      );

      const yieldRate = parseNumericValue(row.yieldRate);
      const minBalance = parseNumericValue(row.minBalance);
      const maxBalance = parseNumericValue(row.maxBalance);
      const gatNominal = parseNumericValue(row.gatNominal);
      const gatReal = parseNumericValue(row.gatReal);
      const slug = generateSlug(row.name, row.provider || row.Banco);

      // Insert product
      const { data: product, error: productError } = await supabase
        .from('productos')
        .insert({
          institucion_id: institutionId,
          subcategoria_id: subcategoryId,
          nombre: row.name,
          tagline: row.tagline || null,
          descripcion: row.description || null,
          descripcion_larga: row.longDescription || null,
          segmento: (row.segment || 'Personas').toLowerCase(),
          imagen_url: null,
          ai_hint: row.aiHint || row.name,
          proveedor: row.provider || row.Banco,
          url_detalles: row.detailsUrl || null,
          rating_promedio: row.averageRating || 0,
          total_reviews: 0,
          activo: true,
          slug
        })
        .select('id')
        .single();

      if (productError) throw productError;

      // Insert investment characteristics
      await supabase
        .from('caracteristicas_inversion')
        .insert({
          producto_id: product.id,
          rendimiento_anual: yieldRate,
          gat_nominal: gatNominal,
          gat_real: gatReal,
          monto_minimo: minBalance,
          monto_maximo: maxBalance,
          tipo_cuenta: row.accountType || 'Cuenta de inversión',
          proteccion_ipab: row.ipabProtection?.toLowerCase().includes('sí') || row.ipabProtection?.toLowerCase().includes('400') || false,
          metodos_deposito: row.depositMethods ? parseArrayField(row.depositMethods) : null,
          metodos_retiro: row.withdrawalMethods ? parseArrayField(row.withdrawalMethods) : null,
          tasa_cashback: parseNumericValue(row.cashbackRate),
          limite_mensual: parseNumericValue(row.monthlyLimit),
          riesgo: 'medio'
        });

      // Insert features
      const features = parseArrayField(row.features);
      if (features.length > 0) {
        await supabase.from('producto_caracteristicas').insert(
          features.map((f, idx) => ({
            producto_id: product.id,
            tipo: 'feature',
            descripcion: f,
            orden: idx
          }))
        );
      }

      // Insert benefits
      const benefits = parseArrayField(row.benefits);
      if (benefits.length > 0) {
        await supabase.from('producto_caracteristicas').insert(
          benefits.map((b, idx) => ({
            producto_id: product.id,
            tipo: 'benefit',
            descripcion: b,
            orden: idx
          }))
        );
      }

      result.success++;
      console.log(`  ✅ [${i + 1}/${rows.length}] ${row.name}`);

    } catch (error: any) {
      result.errors.push({
        row: i + 1,
        product: row.name || 'Unknown',
        error: error.message
      });
      console.log(`  ❌ [${i + 1}/${rows.length}] ${row.name}: ${error.message}`);
    }
  }
}

function readExcelFile<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json<T>(sheet);

  return data;
}

// ============================================
// MAIN MIGRATION FUNCTION
// ============================================
async function main() {
  console.log('🚀 Starting Excel to Supabase Migration (v2)\n');

  const result: MigrationResult = {
    success: 0,
    errors: [],
    institutions: new Map(),
    skipped: 0
  };

  try {
    // Get subcategory IDs
    const creditSubcategoryId = await getSubcategoryId('tarjeta_credito');
    const financingSubcategoryId = await getSubcategoryId('prestamo_personal');
    const investmentSubcategoryId = await getSubcategoryId('cuenta_inversion');

    // Migrate credit products
    const creditPath = path.join(__dirname, 'excel-data', 'Credito.xlsx');
    if (fs.existsSync(creditPath)) {
      const creditRows = readExcelFile<CreditRow>(creditPath);
      console.log(`Found ${creditRows.length} credit products`);
      await migrateCreditProducts(creditRows, creditSubcategoryId, result);
    }

    // Migrate financing products
    const financingPath = path.join(__dirname, 'excel-data', 'Financiamiento.xlsx');
    if (fs.existsSync(financingPath)) {
      const financingRows = readExcelFile<FinancingRow>(financingPath);
      console.log(`Found ${financingRows.length} financing products`);
      await migrateFinancingProducts(financingRows, financingSubcategoryId, result);
    }

    // Migrate investment products
    const investmentPath = path.join(__dirname, 'excel-data', 'Inversion.xlsx');
    if (fs.existsSync(investmentPath)) {
      const investmentRows = readExcelFile<InvestmentRow>(investmentPath);
      console.log(`Found ${investmentRows.length} investment products`);
      await migrateInvestmentProducts(investmentRows, investmentSubcategoryId, result);
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${result.success} products`);
    console.log(`⏭️  Skipped (empty rows): ${result.skipped}`);
    console.log(`🏢 Institutions created/used: ${result.institutions.size}`);
    console.log(`❌ Errors: ${result.errors.length}`);

    if (result.errors.length > 0) {
      console.log('\n❌ ERRORS (first 10):');
      result.errors.slice(0, 10).forEach(({ row, product, error }) => {
        console.log(`  Row ${row} - ${product}: ${error}`);
      });
      if (result.errors.length > 10) {
        console.log(`  ... and ${result.errors.length - 10} more errors`);
      }
    }

    console.log('\n✅ Migration completed!');

  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run migration
main();
