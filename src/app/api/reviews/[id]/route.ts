import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

// Validation schema for updating a review
const updateReviewSchema = z.object({
    isApproved: z.boolean().optional(),
    approvedBy: z.string().optional(),
    approvedAt: z.string().datetime().optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
        }

        const { data: review, error } = await supabase
            .schema('financial')
            .from('reviews')
            .select(`
        *,
        user:core.users(email),
        product:financial.products(name)
      `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching review:', error);
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        return NextResponse.json({
            review: {
                id: review.id,
                productId: review.product_id,
                userId: review.user_id,
                reviewerName: review.reviewer_name,
                reviewerEmail: review.reviewer_email || review.user?.email,
                rating: review.rating,
                title: review.title,
                comment: review.comment,
                isApproved: review.is_approved,
                approvedBy: review.approved_by,
                approvedAt: review.approved_at,
                createdAt: review.created_at,
                updatedAt: review.updated_at,
                productName: review.product?.name
            }
        });

    } catch (error) {
        console.error('Unexpected error in GET /api/reviews/[id]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
        }

        const validation = updateReviewSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation error', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { isApproved, approvedBy, approvedAt } = validation.data;
        const updates: any = { updated_at: new Date().toISOString() };

        if (isApproved !== undefined) updates.is_approved = isApproved;
        if (approvedBy !== undefined) updates.approved_by = approvedBy;
        if (approvedAt !== undefined) updates.approved_at = approvedAt;

        const { data: review, error } = await supabase
            .schema('financial')
            .from('reviews')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating review:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Update product stats if approval status changed
        if (isApproved !== undefined) {
            try {
                const productId = review.product_id;
                const { data: stats, error: statsError } = await supabase
                    .schema('financial')
                    .from('reviews')
                    .select('rating')
                    .eq('product_id', productId)
                    .eq('is_approved', true);

                if (!statsError && stats) {
                    const totalReviews = stats.length;
                    const averageRating = totalReviews > 0
                        ? stats.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
                        : 0;

                    await supabase
                        .schema('financial')
                        .from('products')
                        .update({
                            average_rating: averageRating,
                            review_count: totalReviews,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', productId);
                }
            } catch (statsErr) {
                console.warn('Failed to update product stats after review update:', statsErr);
            }
        }

        return NextResponse.json({
            message: 'Review updated successfully',
            review: {
                id: review.id,
                productId: review.product_id,
                userId: review.user_id,
                reviewerName: review.reviewer_name,
                reviewerEmail: review.reviewer_email,
                rating: review.rating,
                title: review.title,
                comment: review.comment,
                isApproved: review.is_approved,
                createdAt: review.created_at,
                updatedAt: review.updated_at
            }
        });

    } catch (error) {
        console.error('Unexpected error in PUT /api/reviews/[id]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
        }

        // Get product ID before deleting
        const { data: reviewToCheck, error: fetchError } = await supabase
            .schema('financial')
            .from('reviews')
            .select('product_id')
            .eq('id', id)
            .single();

        if (fetchError || !reviewToCheck) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        const productId = reviewToCheck.product_id;

        // Delete review
        const { error: deleteError } = await supabase
            .schema('financial')
            .from('reviews')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Error deleting review:', deleteError);
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        // Update product stats
        try {
            const { data: stats, error: statsError } = await supabase
                .schema('financial')
                .from('reviews')
                .select('rating')
                .eq('product_id', productId)
                .eq('is_approved', true);

            if (!statsError && stats) {
                const totalReviews = stats.length;
                const averageRating = totalReviews > 0
                    ? stats.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
                    : 0;

                await supabase
                    .schema('financial')
                    .from('products')
                    .update({
                        average_rating: averageRating,
                        review_count: totalReviews,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', productId);
            }
        } catch (statsErr) {
            console.warn('Failed to update product stats after deletion:', statsErr);
        }

        return NextResponse.json({ message: 'Review deleted successfully' });

    } catch (error) {
        console.error('Unexpected error in DELETE /api/reviews/[id]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
