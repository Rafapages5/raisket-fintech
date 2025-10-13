// scripts/inspect-excel.ts
import * as XLSX from 'xlsx';
import * as path from 'path';

function inspectExcel(filePath: string) {
  console.log(`\n📊 Inspecting: ${path.basename(filePath)}`);
  console.log('='.repeat(60));

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(`Sheet name: ${sheetName}`);
    console.log(`Total rows: ${data.length}`);

    if (data.length > 0) {
      console.log('\nColumn names:');
      const columns = Object.keys(data[0] as any);
      columns.forEach((col, idx) => {
        console.log(`  ${idx + 1}. ${col}`);
      });

      console.log('\nFirst 3 rows sample:');
      data.slice(0, 3).forEach((row: any, idx) => {
        console.log(`\nRow ${idx + 1}:`);
        columns.forEach(col => {
          const value = row[col];
          const displayValue = typeof value === 'string' && value.length > 50
            ? value.substring(0, 50) + '...'
            : value;
          console.log(`  ${col}: ${displayValue}`);
        });
      });
    } else {
      console.log('⚠️  No data found in Excel');
    }

  } catch (error: any) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
  }
}

// Inspect all three files
const files = [
  'scripts/excel-data/Credito.xlsx',
  'scripts/excel-data/Financiamiento.xlsx',
  'scripts/excel-data/Inversion.xlsx'
];

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  inspectExcel(fullPath);
});
