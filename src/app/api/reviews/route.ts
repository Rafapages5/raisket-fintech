import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, name, email, rating, title, comment } = body;

    // Validar datos requeridos
    if (!productId || !name || !email || !rating || !comment) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben estar presentes' },
        { status: 400 }
      );
    }

    // Validar rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La calificación debe estar entre 1 y 5' },
        { status: 400 }
      );
    }

    // Insertar review en Supabase
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          product_id: productId,
          reviewer_name: name,
          reviewer_email: email,
          rating: parseInt(rating),
          title: title || null,
          comment: comment,
          is_approved: false // Por defecto no aprobado, requiere moderación
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting review:', error);
      return NextResponse.json(
        { error: 'Error al guardar la reseña' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reseña enviada exitosamente. Está pendiente de aprobación.',
      review: data[0]
    });

  } catch (error) {
    console.error('Error processing review:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    let query = supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    // Filtrar por producto si se especifica
    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json(
        { error: 'Error al obtener las reseñas' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reviews: data || []
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}