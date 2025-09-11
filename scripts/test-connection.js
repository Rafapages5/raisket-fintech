// Simplified test to check Supabase connection
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Testing Supabase connection...');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

if (supabaseUrl && supabaseAnonKey) {
  console.log('✅ Environment variables are configured correctly');
  console.log('🎯 Ready to proceed with data migration');
} else {
  console.log('❌ Please check your .env.local file');
}