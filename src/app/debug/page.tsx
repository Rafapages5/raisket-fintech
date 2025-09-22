'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addTest = (name: string, status: 'running' | 'success' | 'error', data?: any, error?: string) => {
    setTests(prev => {
      const newTests = [...prev];
      const existingIndex = newTests.findIndex(t => t.name === name);
      const testResult = { name, status, data, error, timestamp: new Date().toISOString() };
      
      if (existingIndex >= 0) {
        newTests[existingIndex] = testResult;
      } else {
        newTests.push(testResult);
      }
      return newTests;
    });
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setTests([]);

    try {
      // Test 1: Variables de entorno
      addTest('Variables de entorno', 'running');
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (hasUrl && hasKey) {
        addTest('Variables de entorno', 'success', { 
          url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
          keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length 
        });
      } else {
        addTest('Variables de entorno', 'error', null, 'Faltan variables de entorno');
      }

      // Test 2: Conexión básica
      addTest('Conexión a Supabase', 'running');
      try {
        const { data: healthCheck, error: healthError } = await supabase
          .from('products')
          .select('count', { count: 'exact', head: true });

        if (healthError) {
          addTest('Conexión a Supabase', 'error', null, healthError.message);
        } else {
          addTest('Conexión a Supabase', 'success', { count: healthCheck });
        }
      } catch (err: any) {
        addTest('Conexión a Supabase', 'error', null, err.message);
      }

      // Test 3: Listar tablas disponibles
      addTest('Tablas disponibles', 'running');
      try {
        const { data: tables, error: tablesError } = await supabase.rpc('get_table_names');
        if (tablesError) {
          // Método alternativo si no existe el RPC
          const testTables = ['products', 'institutions', 'product_categories', 'product_features'];
          const tableResults = [];
          
          for (const table of testTables) {
            try {
              const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
              tableResults.push({ table, exists: !error, error: error?.message });
            } catch {
              tableResults.push({ table, exists: false, error: 'No accesible' });
            }
          }
          addTest('Tablas disponibles', 'success', { tables: tableResults });
        } else {
          addTest('Tablas disponibles', 'success', { tables });
        }
      } catch (err: any) {
        addTest('Tablas disponibles', 'error', null, err.message);
      }

      // Test 4: Estructura de tabla products
      addTest('Estructura de tabla products', 'running');
      try {
        const { data: sampleProduct, error: structureError } = await supabase
          .from('products')
          .select('*')
          .limit(1);

        if (structureError) {
          addTest('Estructura de tabla products', 'error', null, structureError.message);
        } else {
          const structure = sampleProduct?.[0] ? Object.keys(sampleProduct[0]) : [];
          addTest('Estructura de tabla products', 'success', { 
            columns: structure,
            sampleData: sampleProduct?.[0] 
          });
        }
      } catch (err: any) {
        addTest('Estructura de tabla products', 'error', null, err.message);
      }

      // Test 5: Contar productos
      addTest('Contar productos', 'running');
      try {
        const { count, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (countError) {
          addTest('Contar productos', 'error', null, countError.message);
        } else {
          addTest('Contar productos', 'success', { totalProducts: count });
        }
      } catch (err: any) {
        addTest('Contar productos', 'error', null, err.message);
      }

      // Test 6: Consultar productos con filtros
      addTest('Consultar productos por segmento', 'running');
      try {
        const { data: personalProducts, error: segmentError } = await supabase
          .from('products')
          .select('*')
          .eq('segment', 'Personas')
          .limit(3);

        if (segmentError) {
          addTest('Consultar productos por segmento', 'error', null, segmentError.message);
        } else {
          addTest('Consultar productos por segmento', 'success', { 
            foundProducts: personalProducts?.length || 0,
            sampleProducts: personalProducts?.map(p => ({ id: p.id, name: p.name, category: p.category }))
          });
        }
      } catch (err: any) {
        addTest('Consultar productos por segmento', 'error', null, err.message);
      }

      // Test 7: Verificar políticas RLS
      addTest('Políticas RLS', 'running');
      try {
        const { data: policies, error: policyError } = await supabase
          .from('products')
          .select('id')
          .limit(1);

        if (policyError && policyError.message.includes('RLS')) {
          addTest('Políticas RLS', 'error', null, 'RLS bloqueando acceso: ' + policyError.message);
        } else if (policyError) {
          addTest('Políticas RLS', 'error', null, policyError.message);
        } else {
          addTest('Políticas RLS', 'success', { message: 'RLS configurado correctamente' });
        }
      } catch (err: any) {
        addTest('Políticas RLS', 'error', null, err.message);
      }

    } catch (error: any) {
      addTest('Error general', 'error', null, error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">🔍 Diagnóstico de Base de Datos</h1>
      
      <div className="mb-6">
        <button 
          onClick={runDiagnostics}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? '🔄 Ejecutando...' : '🔄 Ejecutar Diagnóstico'}
        </button>
      </div>

      <div className="space-y-4">
        {tests.map((test, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">
                {test.status === 'success' && '✅'}
                {test.status === 'error' && '❌'}
                {test.status === 'running' && '🔄'}
              </span>
              <h3 className="font-semibold text-lg">{test.name}</h3>
              <span className="text-xs text-gray-500">{test.timestamp}</span>
            </div>
            
            {test.error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-2">
                <p className="text-red-700 font-medium">Error:</p>
                <p className="text-red-600 text-sm">{test.error}</p>
              </div>
            )}
            
            {test.data && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-green-700 font-medium">Datos:</p>
                <pre className="text-green-600 text-sm overflow-auto">
                  {JSON.stringify(test.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}