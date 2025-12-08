
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
    console.error("WARNING: Supabase URL does not look like a standard Supabase URL (missing .supabase.co)");
}

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    console.log("URL:", supabaseUrl);
    console.log("Key:", supabaseKey ? "Found" : "Missing");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log("Testing Supabase connection...");

    try {
        const { data, error } = await supabase
            .from('financial_products')
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.error("Supabase Connection Error:", error);
        } else {
            console.log("Connection successful. Total rows in 'financial_products':", data); // count is in count property not data for head:true usually, but wait
            // Actually { count, data, error } 
        }

        // Try fetching actual data
        console.log("Fetching products with is_active=true...");
        const { data: products, error: dataError } = await supabase
            .from('financial_products')
            .select('id, name, category, slug, is_active')
            .eq('is_active', true)
            .limit(5);

        if (dataError) {
            console.error("Data Fetch Error:", dataError);
        } else {
            console.log(`Successfully fetched ${products?.length} active products.`);
            products?.forEach(p => console.log(`- [${p.category}] ${p.name} (${p.slug})`));
        }

    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

testConnection();
