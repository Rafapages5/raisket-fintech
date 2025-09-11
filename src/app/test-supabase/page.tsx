'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabasePage() {
  const [status, setStatus] = useState('Probando conexión...');
  const [details, setDetails] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    const results: any[] = [];

    try {
      // Test 1: Conexión básica
      results.push({ test: 'Conexión básica', status: 'probando...' });
      setDetails([...results]);

      const { data: healthCheck, error: healthError } = await supabase
        .from('products')
        .select('count', { count: 'exact', head: true });

      if (healthError) {
        results[results.length - 1] = { 
          test: 'Conexión básica', 
          status: 'error', 
          error: healthError.message 
        };
        setDetails([...results]);
        setError('Error de conexión básica');
        return;
      }

      results[results.length - 1] = { 
        test: 'Conexión básica', 
        status: 'exitoso' 
      };
      setDetails([...results]);

      // Test 2: Consultar productos
      results.push({ test: 'Consultar productos', status: 'probando...' });
      setDetails([...results]);

      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(3);

      if (productsError) {
        results[results.length - 1] = { 
          test: 'Consultar productos', 
          status: 'error', 
          error: productsError.message 
        };
        setDetails([...results]);
        setError('Error al consultar productos');
        return;
      }

      results[results.length - 1] = { 
        test: 'Consultar productos', 
        status: 'exitoso', 
        data: `${products?.length || 0} productos encontrados`
      };
      setDetails([...results]);

      // Test 3: Contar productos
      results.push({ test: 'Contar productos', status: 'probando...' });
      setDetails([...results]);

      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        results[results.length - 1] = { 
          test: 'Contar productos', 
          status: 'error', 
          error: countError.message 
        };
        setDetails([...results]);
      } else {
        results[results.length - 1] = { 
          test: 'Contar productos', 
          status: 'exitoso', 
          data: `${count} productos en total`
        };
        setDetails([...results]);
      }

      setStatus('¡Conexión exitosa!');

    } catch (err: any) {
      setError(`Error inesperado: ${err.message}`);
      setStatus('Error de conexión');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Prueba de Conexión Supabase</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Estado: {status}</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="space-y-4">
          {details.map((result, index) => (
            <div key={index} className="border-l-4 pl-4 py-2" 
                 style={{ borderColor: result.status === 'exitoso' ? '#10b981' : result.status === 'error' ? '#ef4444' : '#f59e0b' }}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{result.test}</span>
                {result.status === 'exitoso' && <span className="text-green-600">✅</span>}
                {result.status === 'error' && <span className="text-red-600">❌</span>}
                {result.status === 'probando...' && <span className="text-yellow-600">🔄</span>}
              </div>
              {result.data && <div className="text-sm text-gray-600 mt-1">{result.data}</div>}
              {result.error && <div className="text-sm text-red-600 mt-1">{result.error}</div>}
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={testSupabaseConnection}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Probar Conexión Nuevamente
      </button>
    </div>
  );
}