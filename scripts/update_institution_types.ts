
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('🚀 Starting Mass Update of institution_type...');

  const csvPath = path.join(process.cwd(), 'data', 'temp_financial.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ File not found: ${csvPath}`);
    process.exit(1);
  }

  console.log(`📖 Reading CSV from: ${csvPath}`);
  const fileContent = fs.readFileSync(csvPath, 'utf-8');

  // Parse CSV
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';',
    trim: true
  });

  if (records.length === 0) {
    console.error('❌ No records found in CSV');
    process.exit(1);
  }

  // Identify the target column
  const headers = Object.keys(records[0]);
  console.log('Headers found:', headers);


  const targetColumn = headers.find(h => 
    h.toLowerCase().includes('tipo de institucion') || 
    h.toLowerCase().includes('institution_type') ||
    h.toLowerCase().includes('institution type')
  );

  if (!targetColumn) {
    console.error('❌ Could not find a column for institution type. Headers:', headers);
    process.exit(1);
  }

  console.log(`🎯 Target column identified: "${targetColumn}"`);

  // Mapping function
  function mapInstitutionType(type: string): string | null {
    const normalized = type.toLowerCase().trim();
    if (normalized.includes('banco')) return 'banco';
    if (normalized.includes('sofipo')) return 'sofipo';
    if (normalized.includes('fintech')) return 'fintech';
    if (normalized.includes('unión de crédito') || normalized.includes('union de credito') || normalized.includes('cooperativa')) return 'cooperativa';
    if (normalized.includes('aseguradora') || normalized.includes('seguros')) return 'aseguradora';
    if (normalized.includes('sofom')) return 'sofom';
    if (normalized.includes('casa de bolsa')) return 'casa_de_bolsa'; // Speculative, but let's try or map to null if unsure.
    return null;
  }

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const record of records) {
    const id = record.id;
    const rawType = record[targetColumn];

    if (!id) {
      skippedCount++;
      continue;
    }

    if (!rawType) {
      console.warn(`⚠️ Skipping record ${id} without institution type`);
      skippedCount++;
      continue;
    }

    const institutionType = mapInstitutionType(rawType);

    if (!institutionType) {
      console.warn(`⚠️ Could not map institution type "${rawType}" for record ${id}`);
      errorCount++; // Count as error or skipped? Let's count as error to be safe
      continue;
    }
    
    const { error } = await supabase
      .from('financial_products')
      .update({ institution_type: institutionType })
      .eq('id', id);

    if (error) {
      console.error(`❌ Error updating ${id} with ${institutionType}:`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Updated ${id} with type: ${institutionType} (was "${rawType}")`);
      successCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 UPDATE SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful updates: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`⏭️  Skipped: ${skippedCount}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
