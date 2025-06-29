// src/components/forms/LeadGenerationForm.tsx
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Loader2 } from 'lucide-react';
import type { GenerateLandingPageOfferInput } from '@/ai/flows/generate-landing-page-prompt';

const leadGenFormSchema = z.object({
  segment: z.enum(['Individual', 'Business'], { required_error: "Please select a segment." }),
  productType: z.string().min(3, "Product type must be at least 3 characters.").max(100, "Product type cannot exceed 100 characters."),
  needs: z.string().min(10, "Please describe your needs in at least 10 characters.").max(500, "Needs description cannot exceed 500 characters."),
});

type LeadGenFormData = z.infer<typeof leadGenFormSchema>;

interface LeadGenerationFormProps {
  onSubmit: (data: GenerateLandingPageOfferInput) => Promise<void>;
  isLoading: boolean;
}

export default function LeadGenerationForm({ onSubmit, isLoading }: LeadGenerationFormProps) {
  const form = useForm<LeadGenFormData>({
    resolver: zodResolver(leadGenFormSchema),
    defaultValues: {
      segment: undefined,
      productType: '',
      needs: '',
    },
  });

  const handleFormSubmit = async (data: LeadGenFormData) => {
    await onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-2">
          <FileText className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-2xl text-primary">Find a Personalized Offer</CardTitle>
        </div>
        <CardDescription>Describe your requirements, and we'll help you find a tailored financial product offer.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="segment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Segment</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a segment (Individual or Business)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mortgage, Business Loan, Travel Insurance" {...field} />
                  </FormControl>
                  <FormDescription>What kind of financial product are you looking for?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="needs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Needs & Requirements</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Need a loan for home renovation, looking for low-interest business credit line..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Offer...
                </>
              ) : (
                'Find My Offer'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
