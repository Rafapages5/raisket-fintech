
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importInstitutionTypes() {
  const csvPath = path.join(process.cwd(), 'data', 'temp_financial.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`Error: CSV file not found at ${csvPath}`);
    process.exit(1);
  }

  console.log('Reading CSV file...');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
interface CsvRecord {
  id?: string;
  name?: string;
  slug?: string;
  institution_type?: string;
  tipo_institucion?: string;
  [key: string]: any;
}

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
    skip_records_with_error: true,
    delimiter: ';'
  }) as CsvRecord[];

  console.log(`Found ${records.length} records to process.`);

  let updatedCount = 0;
  let errorCount = 0;

  for (const record of records) {
    // Determine the identifier column (slug or id or name)
    // Adjust this based on the user's CSV structure
    const identifier = record.slug || record.id || record.name;
    const institutionType = record.institution_type || record.tipo_institucion;

    if (!identifier || !institutionType) {
      console.warn('Skipping row due to missing identifier or institution_type:', record);
      continue;
    }

    // Normalize institution type
    const normalizedType = institutionType.toLowerCase().trim();
    const validTypes = ['banco', 'sofipo', 'sofom', 'fintech', 'union_credito', 'cooperativa', 'aseguradora', 'afore', 'casa_bolsa'];

    if (!validTypes.includes(normalizedType)) {
       console.warn(`Warning: Invalid institution type '${normalizedType}' for ${identifier}. Allowed: ${validTypes.join(', ')}`);
       // Continue anyway, or skip? Let's try to update, database constraint might catch it if strict
    }

    try {
      // Try to match by slug first, then name if slug fails
      let query = supabase.from('financial_products').update({ institution_type: normalizedType });
      
      if (record.slug) {
        query = query.eq('slug', record.slug);
      } else if (record.name) {
        query = query.eq('name', record.name);
      } else if (record.id) {
        query = query.eq('id', record.id);
      }

      const { error } = await query;

      if (error) {
        console.error(`Failed to update ${identifier}:`, error.message);
        errorCount++;
      } else {
        updatedCount++;
        if (updatedCount % 10 === 0) process.stdout.write('.');
      }
    } catch (err) {
      console.error(`Exception updating ${identifier}:`, err);
      errorCount++;
    }
  }

  console.log('\nImport complete!');
  console.log(`Successfully updated: ${updatedCount}`);
  console.log(`Errors: ${errorCount}`);
}

importInstitutionTypes().catch(console.error);
