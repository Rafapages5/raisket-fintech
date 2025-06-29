// src/components/reviews/ReviewList.tsx
import type { Review } from '@/types';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground bg-card rounded-lg shadow">
        <p className="text-lg">No reviews yet for this product.</p>
        <p className="text-sm">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
