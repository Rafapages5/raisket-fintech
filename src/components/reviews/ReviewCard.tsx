// src/components/reviews/ReviewCard.tsx
import type { Review } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, UserCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const timeAgo = formatDistanceToNow(new Date(review.date), { addSuffix: true });
  const userNameInitials = review.userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-start space-x-4 pb-3">
        <Avatar className="h-12 w-12">
          {review.avatarUrl ? (
            <AvatarImage src={review.avatarUrl} alt={review.userName} />
          ) : (
             <AvatarFallback className="bg-muted text-muted-foreground">
              {review.avatarUrl === undefined && <UserCircle className="h-6 w-6" />}
              {review.avatarUrl === null && userNameInitials}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">{review.userName}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{timeAgo}</CardDescription>
        </div>
        <div className="flex items-center">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {review.title && <h4 className="font-semibold text-md mb-1.5 text-foreground">{review.title}</h4>}
        <p className="text-sm text-foreground/80 leading-relaxed">{review.comment}</p>
      </CardContent>
    </Card>
  );
}
