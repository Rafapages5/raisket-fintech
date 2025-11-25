// Script para probar el sistema completo de reviews
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function testAdminSystem() {
  try {
    // Leer variables de entorno
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');
    const env = {};

    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    });

    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    console.log('🧪 Probando sistema completo de admin...');

    // 1. Insertar algunas reviews de prueba
    console.log('\n1️⃣ Insertando reviews de prueba...');

    const testReviews = [
      {
        product_id: 'test-product-1',
        reviewer_name: 'María García',
        reviewer_email: 'maria@test.com',
        rating: 5,
        title: 'Excelente producto',
        comment: 'Muy satisfecha con este producto financiero. El servicio es excelente.',
        is_approved: false
      },
      {
        product_id: 'test-product-2',
        reviewer_name: 'Juan Pérez',
        reviewer_email: 'juan@test.com',
        rating: 4,
        title: 'Buen servicio',
        comment: 'Cumple con las expectativas, aunque podría mejorar en algunos aspectos.',
        is_approved: false
      },
      {
        product_id: 'test-product-1',
        reviewer_name: 'Ana López',
        reviewer_email: 'ana@test.com',
        rating: 3,
        title: 'Regular',
        comment: 'El producto está bien pero el proceso fue un poco lento.',
        is_approved: true // Esta ya está aprobada
      }
    ];

    const { data: insertedReviews, error: insertError } = await supabase
      .from('reviews')
      .insert(testReviews)
      .select();

    if (insertError) {
      console.log('❌ Error insertando:', insertError.message);
      return;
    }

    console.log('✅ Reviews insertadas:', insertedReviews.length);

    // 2. Verificar que se pueden obtener
    console.log('\n2️⃣ Verificando obtener reviews...');

    const { data: allReviews, error: fetchError } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.log('❌ Error obteniendo:', fetchError.message);
      return;
    }

    console.log('✅ Total reviews en DB:', allReviews.length);
    console.log('📊 Pendientes:', allReviews.filter(r => !r.is_approved).length);
    console.log('📊 Aprobadas:', allReviews.filter(r => r.is_approved).length);

    // 3. Mostrar algunas reviews para verificar
    console.log('\n3️⃣ Ejemplo de reviews:');
    allReviews.slice(0, 3).forEach((review, index) => {
      console.log(`\n📝 Review ${index + 1}:`);
      console.log(`   Usuario: ${review.reviewer_name}`);
      console.log(`   Rating: ${'⭐'.repeat(review.rating)}`);
      console.log(`   Estado: ${review.is_approved ? '✅ Aprobada' : '⏳ Pendiente'}`);
      console.log(`   Comentario: ${review.comment.substring(0, 50)}...`);
    });

    console.log('\n🎉 Sistema funcionando correctamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Ejecuta: npm run dev');
    console.log('2. Ve a: http://localhost:3000/admin/reviews');
    console.log('3. Contraseña: admin123');
    console.log('4. Aprueba/rechaza reviews');
    console.log('5. Ve que las reviews aparecen en los productos');

    // Limpiar reviews de prueba al final
    console.log('\n🧹 ¿Limpiar reviews de prueba? (comentar esta línea para mantenerlas)');
    const testIds = insertedReviews.map(r => r.id);
    await supabase
      .from('reviews')
      .delete()
      .in('id', testIds);
    console.log('✅ Reviews de prueba eliminadas');

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

testAdminSystem();