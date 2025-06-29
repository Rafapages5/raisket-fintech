// src/components/forms/RecommendationForm.tsx
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';
import type { FinancialProfile } from '@/ai/flows/generate-financial-product-recommendations';

const recommendationFormSchema = z.object({
  income: z.coerce.number().min(0, "Income must be positive.").positive("Income must be a positive number."),
  creditScore: z.coerce.number().min(300, "Credit score must be at least 300.").max(850, "Credit score cannot exceed 850."),
  financialGoals: z.string().min(10, "Please describe your financial goals in at least 10 characters.").max(500, "Financial goals cannot exceed 500 characters."),
  riskTolerance: z.enum(['low', 'medium', 'high'], { required_error: "Please select your risk tolerance." }),
  age: z.coerce.number().min(18, "Age must be at least 18.").max(100, "Age cannot exceed 100.").int(),
  isBusiness: z.boolean().default(false),
});

type RecommendationFormData = z.infer<typeof recommendationFormSchema>;

interface RecommendationFormProps {
  onSubmit: (data: FinancialProfile) => Promise<void>;
  isLoading: boolean;
}

export default function RecommendationForm({ onSubmit, isLoading }: RecommendationFormProps) {
  const form = useForm<RecommendationFormData>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: {
      income: undefined, // Use undefined for numeric inputs for better placeholder behavior
      creditScore: undefined,
      financialGoals: '',
      riskTolerance: undefined,
      age: undefined,
      isBusiness: false,
    },
  });

  const handleFormSubmit = async (data: RecommendationFormData) => {
    await onSubmit(data as FinancialProfile);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-2">
          <Lightbulb className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-2xl text-primary">Get Personalized Recommendations</CardTitle>
        </div>
        <CardDescription>Tell us about your financial situation and goals, and we'll suggest suitable products.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 60000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="creditScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Score (300-850)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 720" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="financialGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Goals</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Save for a house, invest for retirement, start a business..." {...field} rows={4}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="riskTolerance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Tolerance</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your risk tolerance" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 35" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="isBusiness"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Is this for a business?
                    </FormLabel>
                    <FormDescription>
                      Check this box if these recommendations are for a business entity.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Recommendations...
                </>
              ) : (
                'Find Products'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
