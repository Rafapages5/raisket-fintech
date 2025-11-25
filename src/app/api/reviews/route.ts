import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

// Validation schema for creating a review
const createReviewSchema = z.object({
  productId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  reviewerName: z.string().min(1, 'Name is required'),
  reviewerEmail: z.string().email('Invalid email address'),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(1, 'Comment is required'),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const approvedOnly = searchParams.get('approvedOnly') !== 'false'; // Default to true
    const productId = searchParams.get('productId');

    let query = supabase
      .schema('financial')
      .from('reviews')
      .select(`
        *,
        user:core.users(email),
        product:financial.products(name)
      `, { count: 'exact' });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    if (approvedOnly) {
      query = query.eq('is_approved', true);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: reviews, error, count } = await query;

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map response to match expected format
    const mappedReviews = reviews?.map(review => ({
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
    }));

    return NextResponse.json({
      reviews: mappedReviews,
      pagination: {
        limit,
        offset,
        totalCount: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0
      }
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = createReviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { productId, userId, reviewerName, reviewerEmail, rating, title, comment } = validation.data;

    // Insert review
    const { data: review, error: insertError } = await supabase
      .schema('financial')
      .from('reviews')
      .insert({
        product_id: productId,
        user_id: userId,
        reviewer_name: reviewerName,
        reviewer_email: reviewerEmail,
        rating,
        title,
        comment,
        // is_approved defaults to false in DB usually
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating review:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Update product stats (best effort)
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
      console.warn('Failed to update product stats:', statsErr);
    }

    return NextResponse.json({
      message: 'Review created successfully',
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
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in POST /api/reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}