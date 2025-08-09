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
  segment: z.enum(['Individual', 'Business'], { required_error: "Por favor selecciona un segmento." }),
  productType: z.string().min(3, "El tipo de producto debe tener al menos 3 caracteres.").max(100, "El tipo de producto no puede exceder 100 caracteres."),
  needs: z.string().min(10, "Por favor describe tus necesidades en al menos 10 caracteres.").max(500, "La descripción de necesidades no puede exceder 500 caracteres."),
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
          <CardTitle className="font-headline text-2xl text-primary">Encuentra una Oferta Personalizada</CardTitle>
        </div>
        <CardDescription>Describe tus requisitos y te ayudaremos a encontrar una oferta de producto financiero a tu medida.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="segment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Segmento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un segmento (Individual o Business)" />
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
                  <FormLabel>Tipo de Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="ej., Hipoteca, Préstamo Empresarial, Seguro de Viaje" {...field} />
                  </FormControl>
                  <FormDescription>¿Qué tipo de producto financiero estás buscando?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="needs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Necesidades y Requisitos Específicos</FormLabel>
                  <FormControl>
                    <Textarea placeholder="ej., Necesito un préstamo para renovación de casa, busco una línea de crédito empresarial con bajo interés..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando Oferta...
                </>
              ) : (
                'Encontrar Mi Oferta'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
