// src/components/reviews/SimpleReviewForm.tsx
"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Star, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const reviewSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  email: z.string().email({ message: "Please enter a valid email." }), // For internal use, not displayed
  rating: z.number().min(1, { message: "Please select a rating." }).max(5),
  title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(100).optional(),
  comment: z.string().min(10, { message: "Comment must be at least 10 characters." }).max(1000),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface SimpleReviewFormProps {
  productId: string;
}

export default function SimpleReviewForm({ productId }: SimpleReviewFormProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: '',
      email: '',
      rating: 0,
      title: '',
      comment: '',
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    console.log('Review Submitted:', { ...data, productId });
    // Here you would typically send the data to a server action or API endpoint
    // For now, we'll just show a success toast and reset the form
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback. Your review is pending approval.",
    });
    form.reset();
    // setSelectedRating(0); // Resetting Controller's value is handled by form.reset()
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Calificar Producto</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Rating</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 cursor-pointer transition-colors
                          ${star <= (hoverRating || field.value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-300'}
                        `}
                        onClick={() => field.onChange(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${star} out of 5 stars`}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review Title (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Excellent Product!" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Comment</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us more about your experience..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={form.formState.isSubmitting}>
            <Send className="mr-2 h-4 w-4" /> Submit Review
          </Button>
        </form>
      </Form>
    </div>
  );
}