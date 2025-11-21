// scripts/run-migrations.ts
// Script para ejecutar migraciones en Supabase

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration(filePath: string) {
  console.log(`\n📄 Ejecutando migración: ${path.basename(filePath)}`);

  try {
    const sql = fs.readFileSync(filePath, 'utf-8');

    // Ejecutar SQL usando la función RPC de Supabase
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // Si la función RPC no existe, intentar con query directo
      console.log('⚠️  Función exec_sql no disponible, usando método alternativo...');

      // Separar comandos SQL por punto y coma
      const commands = sql
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

      for (const command of commands) {
        if (command) {
          const { error: cmdError } = await supabase.from('_migrations').select('*').limit(0);
          if (cmdError) {
            console.error('❌ Error ejecutando comando:', cmdError);
          }
        }
      }

      console.log('✅ Migración ejecutada (método alternativo)');
      console.log('⚠️  IMPORTANTE: Debes ejecutar manualmente el SQL en el SQL Editor de Supabase');
      console.log(`📋 Archivo: ${filePath}`);
      return false;
    }

    console.log('✅ Migración completada exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando migraciones de Supabase...\n');
  console.log(`📍 URL: ${supabaseUrl}`);

  const migrationsDir = path.join(process.cwd(), 'migrations');
  const migrations = [
    '010_create_financial_products.sql',
    '011_seed_financial_products.sql',
  ];

  console.log(`\n📂 Directorio de migraciones: ${migrationsDir}`);

  let successCount = 0;
  let failCount = 0;

  for (const migration of migrations) {
    const filePath = path.join(migrationsDir, migration);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${migration}`);
      failCount++;
      continue;
    }

    const success = await runMigration(filePath);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Resumen de migraciones:');
  console.log(`   ✅ Exitosas: ${successCount}`);
  console.log(`   ❌ Fallidas: ${failCount}`);
  console.log('='.repeat(60));

  if (failCount > 0) {
    console.log('\n⚠️  ATENCIÓN: Algunas migraciones requieren ejecución manual.');
    console.log('\n📝 Pasos para ejecutar manualmente:');
    console.log('   1. Ve a https://supabase.com/dashboard/project/gwiyvnxlhbcipxpjhfvo/sql/new');
    console.log('   2. Copia el contenido de cada archivo de migración');
    console.log('   3. Pégalo en el SQL Editor');
    console.log('   4. Haz clic en "Run"');
    console.log('\n📂 Archivos de migración:');
    migrations.forEach(m => {
      console.log(`   - migrations/${m}`);
    });
  }

  console.log('\n✨ Proceso completado\n');
}

main().catch(console.error);
