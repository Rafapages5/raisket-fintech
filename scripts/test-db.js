// test-db.js (reemplaza todo el contenido)
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function testCompleteProduct() {
  try {
    // Leer variables de entorno
    const envContent = fs.readFileSync('.env.local', 'utf8')
    const lines = envContent.split('\n')
    const env = {}
    
    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim()
      }
    })
    
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    console.log('🔍 Probando consulta de producto completo...')
    
    const { data: producto, error } = await supabase
      .from('productos')
      .select(`
        *,
        institucion:instituciones(*),
        subcategoria:subcategorias(
          *,
          categoria:categorias(*)
        ),
        caracteristicas_credito(*),
        caracteristicas:producto_caracteristicas(*),
        comisiones:producto_comisiones(*)
      `)
      .eq('slug', 'tarjeta-oro-bbva')
      .single()
    
    if (error) {
      console.error('❌ Error:', error.message)
      return
    }
    
    console.log('✅ ¡Producto completo encontrado!')
    console.log('=====================================')
    console.log(`📋 Nombre: ${producto.nombre}`)
    console.log(`🏦 Banco: ${producto.institucion.nombre}`)
    console.log(`📊 Rating: ${producto.rating_promedio} (${producto.total_reviews} reviews)`)
    console.log(`💳 Categoría: ${producto.subcategoria.categoria.nombre} > ${producto.subcategoria.nombre}`)
    console.log(`👥 Segmento: ${producto.segmento}`)
    console.log(`🔗 Slug: ${producto.slug}`)
    
    if (producto.caracteristicas_credito) {
      console.log('\n💰 Información Financiera:')
      console.log(`  - CAT Promedio: ${producto.caracteristicas_credito.cat_promedio}%`)
      console.log(`  - Tasa: ${producto.caracteristicas_credito.tasa_interes_min}% - ${producto.caracteristicas_credito.tasa_interes_max}%`)
      console.log(`  - Límite máximo: $${producto.caracteristicas_credito.limite_credito_max?.toLocaleString()} MXN`)
      console.log(`  - Ingreso mínimo: $${producto.caracteristicas_credito.ingreso_minimo?.toLocaleString()} MXN`)
    }
    
    console.log('\n🎯 Características:')
    producto.caracteristicas
      .filter(c => c.tipo === 'caracteristica')
      .forEach((car, i) => {
        console.log(`  ${i + 1}. ${car.descripcion}`)
      })
    
    console.log('\n✨ Beneficios:')
    producto.caracteristicas
      .filter(c => c.tipo === 'beneficio')
      .forEach((ben, i) => {
        console.log(`  ${i + 1}. ${ben.descripcion}`)
      })
    
    console.log('\n💸 Comisiones:')
    producto.comisiones.forEach((com, i) => {
      console.log(`  ${i + 1}. ${com.tipo}: $${com.monto} - ${com.descripcion}`)
    })
    
    console.log('\n🚀 ¡Todo funcionando correctamente!')
    console.log('📌 Siguiente paso: Migrar componentes React')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testCompleteProduct()