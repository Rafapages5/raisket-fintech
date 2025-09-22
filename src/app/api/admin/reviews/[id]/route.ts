import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH - Aprobar o rechazar una review
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json();
    const reviewId = params.id;

    if (!reviewId) {
      return NextResponse.json(
        { error: 'ID de review requerido' },
        { status: 400 }
      );
    }

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Acción inválida. Use "approve" o "reject"' },
        { status: 400 }
      );
    }

    let updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (action === 'approve') {
      updateData.is_approved = true;
    } else if (action === 'reject') {
      // Para rechazar, podemos eliminar la review o marcarla como rechazada
      // Por ahora, la eliminaremos
      const { error: deleteError } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (deleteError) {
        console.error('Error deleting review:', deleteError);
        return NextResponse.json(
          { error: 'Error al rechazar la review' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Review rechazada y eliminada exitosamente'
      });
    }

    // Actualizar la review (solo para aprobar)
    const { data, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', reviewId)
      .select();

    if (error) {
      console.error('Error updating review:', error);
      return NextResponse.json(
        { error: 'Error al actualizar la review' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Review no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: action === 'approve' ? 'Review aprobada exitosamente' : 'Review actualizada',
      review: data[0]
    });

  } catch (error) {
    console.error('Error in review PATCH:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener una review específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = params.id;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Review no encontrada' },
          { status: 404 }
        );
      }
      console.error('Error fetching review:', error);
      return NextResponse.json(
        { error: 'Error al obtener la review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      review: data
    });

  } catch (error) {
    console.error('Error in review GET:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = params.id;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      return NextResponse.json(
        { error: 'Error al eliminar la review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error in review DELETE:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}