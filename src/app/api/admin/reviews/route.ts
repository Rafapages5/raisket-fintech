import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Obtener todas las reviews para admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filter === 'pending') {
      query = query.eq('is_approved', false);
    } else if (filter === 'approved') {
      query = query.eq('is_approved', true);
    }
    // 'all' no necesita filtro adicional

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching admin reviews:', error);
      return NextResponse.json(
        { error: 'Error al obtener las reviews' },
        { status: 500 }
      );
    }

    // Estadísticas adicionales
    const { data: stats } = await supabase
      .from('reviews')
      .select('is_approved');

    const totalReviews = stats?.length || 0;
    const pendingReviews = stats?.filter(r => !r.is_approved).length || 0;
    const approvedReviews = stats?.filter(r => r.is_approved).length || 0;

    return NextResponse.json({
      success: true,
      reviews: data || [],
      stats: {
        total: totalReviews,
        pending: pendingReviews,
        approved: approvedReviews
      }
    });

  } catch (error) {
    console.error('Error in admin reviews GET:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}