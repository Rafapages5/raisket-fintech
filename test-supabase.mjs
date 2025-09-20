// test-connection.mjs
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Cargar variables manualmente desde .env.local
try {
  const envFile = readFileSync('.env.local', 'utf8')
  const envVars = {}
  
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      envVars[key.trim()] = value.trim()
    }
  })
  
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('🔗 Probando conexión a Supabase...')
  console.log('URL:', supabaseUrl ? supabaseUrl : 'No configurada ❌')
  console.log('Key:', supabaseKey ? 'Configurada ✅' : 'No configurada ❌')
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de entorno no configuradas correctamente')
    console.log('\nVerifica que .env.local contenga:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Probar conexión
  const { data, error } = await supabase
    .from('instituciones')
    .select('*')
  
  if (error) {
    console.error('❌ Error de Supabase:', error)
  } else {
    console.log('✅ Conexión exitosa!')
    console.log('📊 Instituciones encontradas:', data.length)
    data.forEach(inst => {
      console.log(`  - ${inst.nombre}`)
    })
  }
  
} catch (err) {
  console.error('❌ Error:', err.message)
  console.log('\n🔧 Soluciones:')
  console.log('1. Verifica que existe el archivo .env.local')
  console.log('2. Verifica las variables de Supabase')
  console.log('3. Asegúrate de no tener espacios extra')
}