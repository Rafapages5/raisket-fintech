import { supabase } from '@/lib/supabase';

export default async function TestSupabaseProducts() {
  let products = [];
  let error = null;

  try {
    // Test connection to 'products' table (English schema)
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .limit(5);

    if (fetchError) {
      error = fetchError;
      console.error('Error loading products:', fetchError);
    } else {
      products = data || [];
      console.log('Products from Supabase:', products);
    }
  } catch (err) {
    error = err;
    console.error('Error loading products:', err);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Test Supabase Products</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
        <p>Products found: {products.length}</p>
      </div>

      {products.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Products from Supabase:</h2>
          <div className="grid gap-4">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.tagline}</p>
                <p className="text-sm">Provider: {product.provider}</p>
                <p className="text-sm">Category: {product.category}</p>
                <p className="text-sm">Segment: {product.segment}</p>
                <p className="text-sm">ID: {product.id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}