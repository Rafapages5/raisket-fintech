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
        <p className="text-lg">Aún no hay reseñas para este producto.</p>
        <p className="text-sm">¡Sé el primero en compartir tu experiencia!</p>
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
