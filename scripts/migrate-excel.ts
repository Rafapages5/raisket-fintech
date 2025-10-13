// scripts/migrate-excel.ts
import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as fs from 'fs';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// INTERFACES
// ============================================
interface ExcelRow {
  name: string;
  tagline?: string;
  description?: string;
  longDescription?: string;
  provider: string;
  segment?: string;
  imageUrl?: string;
  interestRate?: string;
  loanTerm?: string;
  maxLoanAmount?: string;
  coverageAmount?: string;
  investmentType?: string;
  minInvestment?: string;
  fees?: string;
  eligibility?: string;
  features?: string;
  benefits?: string;
  detailsUrl?: string;
  aiHint?: string;
}

interface MigrationResult {
  success: number;
  errors: Array<{ row: number; product: string; error: string }>;
  institutions: Map<string, string>; // nombre -> id
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Clean and parse numeric values from text
 * "29.9%" -> 29.9
 * "$50,000" -> 50000
 */
function parseNumericValue(value: string | undefined): number | null {
  if (!value) return null;
  const cleaned = value.toString().replace(/[$,%]/g, '').replace(/,/g, '').trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Parse interest rate range
 * "29.9% - 49.9% anual" -> { min: 29.9, max: 49.9 }
 */
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

/**
 * Parse loan term
 * "12-60 meses" -> { min: 12, max: 60 }
 */
function parseLoanTerm(term: string | undefined): { min: number | null; max: number | null } {
  if (!term) return { min: null, max: null };

  const rangeMatch = term.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return {
      min: parseInt(rangeMatch[1]),
      max: parseInt(rangeMatch[2])
    };
  }

  const singleMatch = term.match(/desde\s*(\d+)|(\d+)/i);
  if (singleMatch) {
    const value = parseInt(singleMatch[1] || singleMatch[2]);
    return { min: value, max: null };
  }

  return { min: null, max: null };
}

/**
 * Split comma or pipe-separated values into array
 */
function parseArrayField(field: string | undefined): string[] {
  if (!field) return [];
  return field
    .split(/[,|;]/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

/**
 * Generate slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get or create institution
 */
async function getOrCreateInstitution(
  institutionName: string,
  institutionsCache: Map<string, string>
): Promise<string> {
  // Check cache first
  if (institutionsCache.has(institutionName)) {
    return institutionsCache.get(institutionName)!;
  }

  // Check if exists in DB
  const { data: existing } = await supabase
    .from('instituciones')
    .select('id')
    .eq('nombre', institutionName)
    .single();

  if (existing) {
    institutionsCache.set(institutionName, existing.id);
    return existing.id;
  }

  // Create new institution
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

/**
 * Get subcategory ID by slug
 */
async function getSubcategoryId(subcategorySlug: string): Promise<string> {
  const { data, error } = await supabase
    .from('subcategorias')
    .select('id')
    .eq('slug', subcategorySlug)
    .single();

  if (error || !data) {
    throw new Error(`Subcategory '${subcategorySlug}' not found. Please create it in Supabase first.`);
  }

  return data.id;
}

// ============================================
// MIGRATION FUNCTIONS
// ============================================

/**
 * Migrate credit products
 */
async function migrateCreditProducts(
  rows: ExcelRow[],
  subcategoryId: string,
  result: MigrationResult
): Promise<void> {
  console.log('\n📊 Migrating Credit Products...');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      // Validate required fields
      if (!row.name || !row.provider) {
        throw new Error('Missing required fields: name or provider');
      }

      // Get or create institution
      const institutionId = await getOrCreateInstitution(row.provider, result.institutions);

      // Parse numeric fields
      const interestRate = parseInterestRate(row.interestRate);
      const maxAmount = parseNumericValue(row.maxLoanAmount);
      const fee = parseNumericValue(row.fees);

      // Generate unique slug
      const slug = generateSlug(`${row.name}-${row.provider}`);

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
          segmento: row.segment?.toLowerCase() || 'personas',
          imagen_url: row.imageUrl || `https://placehold.co/600x400/0066CC/FFFFFF?text=${encodeURIComponent(row.provider)}`,
          ai_hint: row.aiHint || `Tarjeta de crédito ${row.name}`,
          proveedor: row.provider,
          url_detalles: row.detailsUrl || null,
          activo: true,
          slug
        })
        .select('id')
        .single();

      if (productError) throw productError;

      // Insert credit characteristics
      const { error: charError } = await supabase
        .from('caracteristicas_credito')
        .insert({
          producto_id: product.id,
          tasa_interes_min: interestRate.min,
          tasa_interes_max: interestRate.max,
          limite_credito_max: maxAmount,
          anualidad: fee,
          sin_anualidad: fee === 0 || row.fees?.toLowerCase().includes('sin anualidad')
        });

      if (charError) throw charError;

      // Insert features
      const features = parseArrayField(row.features);
      if (features.length > 0) {
        const featureInserts = features.map((feature, idx) => ({
          producto_id: product.id,
          tipo: 'feature',
          descripcion: feature,
          orden: idx
        }));

        await supabase.from('producto_caracteristicas').insert(featureInserts);
      }

      // Insert benefits
      const benefits = parseArrayField(row.benefits);
      if (benefits.length > 0) {
        const benefitInserts = benefits.map((benefit, idx) => ({
          producto_id: product.id,
          tipo: 'benefit',
          descripcion: benefit,
          orden: idx
        }));

        await supabase.from('producto_caracteristicas').insert(benefitInserts);
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

/**
 * Migrate financing products
 */
async function migrateFinancingProducts(
  rows: ExcelRow[],
  subcategoryId: string,
  result: MigrationResult
): Promise<void> {
  console.log('\n📊 Migrating Financing Products...');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      if (!row.name || !row.provider) {
        throw new Error('Missing required fields: name or provider');
      }

      const institutionId = await getOrCreateInstitution(row.provider, result.institutions);
      const interestRate = parseInterestRate(row.interestRate);
      const loanTerm = parseLoanTerm(row.loanTerm);
      const maxAmount = parseNumericValue(row.maxLoanAmount);
      const slug = generateSlug(`${row.name}-${row.provider}`);

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
          segmento: row.segment?.toLowerCase() || 'personas',
          imagen_url: row.imageUrl || `https://placehold.co/600x400/0066CC/FFFFFF?text=${encodeURIComponent(row.provider)}`,
          ai_hint: row.aiHint || `Préstamo personal ${row.name}`,
          proveedor: row.provider,
          url_detalles: row.detailsUrl || null,
          activo: true,
          slug
        })
        .select('id')
        .single();

      if (productError) throw productError;

      // Insert financing characteristics
      const { error: charError } = await supabase
        .from('caracteristicas_financiamiento')
        .insert({
          producto_id: product.id,
          tasa_interes_min: interestRate.min,
          tasa_interes_max: interestRate.max,
          monto_maximo: maxAmount,
          plazo_minimo_meses: loanTerm.min,
          plazo_maximo_meses: loanTerm.max,
          tipo_tasa: 'fija',
          frecuencia_pago: 'mensual',
          garantia_requerida: row.eligibility?.toLowerCase().includes('garantía') || false
        });

      if (charError) throw charError;

      // Insert features and benefits
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

/**
 * Migrate investment products
 */
async function migrateInvestmentProducts(
  rows: ExcelRow[],
  subcategoryId: string,
  result: MigrationResult
): Promise<void> {
  console.log('\n📊 Migrating Investment Products...');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      if (!row.name || !row.provider) {
        throw new Error('Missing required fields: name or provider');
      }

      const institutionId = await getOrCreateInstitution(row.provider, result.institutions);
      const interestRate = parseInterestRate(row.interestRate);
      const minInvestment = parseNumericValue(row.minInvestment);
      const slug = generateSlug(`${row.name}-${row.provider}`);

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
          segmento: row.segment?.toLowerCase() || 'personas',
          imagen_url: row.imageUrl || `https://placehold.co/600x400/0066CC/FFFFFF?text=${encodeURIComponent(row.provider)}`,
          ai_hint: row.aiHint || `Inversión ${row.name}`,
          proveedor: row.provider,
          url_detalles: row.detailsUrl || null,
          activo: true,
          slug
        })
        .select('id')
        .single();

      if (productError) throw productError;

      // Insert investment characteristics
      const { error: charError } = await supabase
        .from('caracteristicas_inversion')
        .insert({
          producto_id: product.id,
          rendimiento_anual: interestRate.min,
          gat_nominal: interestRate.min,
          monto_minimo: minInvestment,
          tipo_cuenta: row.investmentType || 'Cuenta de inversión',
          proteccion_ipab: row.description?.toLowerCase().includes('ipab') || false,
          riesgo: 'medio'
        });

      if (charError) throw charError;

      // Insert features and benefits
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

/**
 * Read Excel file and return rows
 */
function readExcelFile(filePath: string): ExcelRow[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

  return data;
}

// ============================================
// MAIN MIGRATION FUNCTION
// ============================================
async function main() {
  console.log('🚀 Starting Excel to Supabase Migration\n');

  const result: MigrationResult = {
    success: 0,
    errors: [],
    institutions: new Map()
  };

  try {
    // Get subcategory IDs
    const creditSubcategoryId = await getSubcategoryId('tarjeta_credito');
    const financingSubcategoryId = await getSubcategoryId('prestamo_personal');
    const investmentSubcategoryId = await getSubcategoryId('cuenta_inversion');

    // Migrate credit products
    const creditPath = path.join(__dirname, 'excel-data', 'Credito.xlsx');
    if (fs.existsSync(creditPath)) {
      const creditRows = readExcelFile(creditPath);
      await migrateCreditProducts(creditRows, creditSubcategoryId, result);
    } else {
      console.log('⚠️  Credito.xlsx not found, skipping...');
    }

    // Migrate financing products
    const financingPath = path.join(__dirname, 'excel-data', 'Financiamiento.xlsx');
    if (fs.existsSync(financingPath)) {
      const financingRows = readExcelFile(financingPath);
      await migrateFinancingProducts(financingRows, financingSubcategoryId, result);
    } else {
      console.log('⚠️  Financiamiento.xlsx not found, skipping...');
    }

    // Migrate investment products
    const investmentPath = path.join(__dirname, 'excel-data', 'Inversion.xlsx');
    if (fs.existsSync(investmentPath)) {
      const investmentRows = readExcelFile(investmentPath);
      await migrateInvestmentProducts(investmentRows, investmentSubcategoryId, result);
    } else {
      console.log('⚠️  Inversion.xlsx not found, skipping...');
    }

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully migrated: ${result.success} products`);
    console.log(`🏢 Institutions created/used: ${result.institutions.size}`);
    console.log(`❌ Errors: ${result.errors.length}`);

    if (result.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      result.errors.forEach(({ row, product, error }) => {
        console.log(`  Row ${row} - ${product}: ${error}`);
      });
    }

    console.log('\n✅ Migration completed!');

  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run migration
main();
