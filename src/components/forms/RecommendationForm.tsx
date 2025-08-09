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
  income: z.coerce.number().min(0, "Los ingresos deben ser positivos.").positive("Los ingresos deben ser un número positivo."),
  creditScore: z.coerce.number().min(300, "La puntuación crediticia debe ser al menos 300.").max(850, "La puntuación crediticia no puede exceder 850."),
  financialGoals: z.string().min(10, "Por favor describe tus objetivos financieros en al menos 10 caracteres.").max(500, "Los objetivos financieros no pueden exceder 500 caracteres."),
  riskTolerance: z.enum(['low', 'medium', 'high'], { required_error: "Por favor selecciona tu tolerancia al riesgo." }),
  age: z.coerce.number().min(18, "La edad debe ser al menos 18.").max(100, "La edad no puede exceder 100.").int(),
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
          <CardTitle className="font-headline text-2xl text-primary">Obtén Recomendaciones Personalizadas</CardTitle>
        </div>
        <CardDescription>Cuéntanos sobre tu situación financiera y objetivos, y te sugeriremos productos adecuados.</CardDescription>
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
                    <FormLabel>Ingresos Anuales ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="ej., 60000" {...field} />
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
                    <FormLabel>Puntuación Crediticia (300-850)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="ej., 720" {...field} />
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
                  <FormLabel>Objetivos Financieros</FormLabel>
                  <FormControl>
                    <Textarea placeholder="ej., Ahorrar para una casa, invertir para el retiro, iniciar un negocio..." {...field} rows={4}/>
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
                    <FormLabel>Tolerancia al Riesgo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu tolerancia al riesgo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
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
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="ej., 35" {...field} />
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
                      ¿Es esto para un negocio?
                    </FormLabel>
                    <FormDescription>
                      Marca esta casilla si estas recomendaciones son para una entidad empresarial.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Obteniendo Recomendaciones...
                </>
              ) : (
                'Encontrar Productos'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
