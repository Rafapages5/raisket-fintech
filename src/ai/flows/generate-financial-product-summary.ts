'use server';
/**
 * @fileOverview An AI agent that generates a summary of a financial product.
 *
 * - generateFinancialProductSummary - A function that generates a summary of a financial product.
 * - GenerateFinancialProductSummaryInput - The input type for the generateFinancialProductSummary function.
 * - GenerateFinancialProductSummaryOutput - The return type for the generateFinancialProductSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFinancialProductSummaryInputSchema = z.object({
  productName: z.string().describe('The name of the financial product.'),
  productDescription: z.string().describe('A detailed description of the financial product.'),
  targetAudience: z.string().describe('The target audience for the financial product (e.g., individuals, businesses).'),
  keyFeatures: z.string().describe('The key features and benefits of the financial product.'),
});
export type GenerateFinancialProductSummaryInput = z.infer<typeof GenerateFinancialProductSummaryInputSchema>;

const GenerateFinancialProductSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the financial product, highlighting its key benefits and features for the target audience.'),
});
export type GenerateFinancialProductSummaryOutput = z.infer<typeof GenerateFinancialProductSummaryOutputSchema>;

export async function generateFinancialProductSummary(input: GenerateFinancialProductSummaryInput): Promise<GenerateFinancialProductSummaryOutput> {
  return generateFinancialProductSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialProductSummaryPrompt',
  input: {schema: GenerateFinancialProductSummaryInputSchema},
  output: {schema: GenerateFinancialProductSummaryOutputSchema},
  prompt: `You are an expert financial product summarizer. Your goal is to provide a concise and informative summary of a given financial product.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  Target Audience: {{{targetAudience}}}
  Key Features: {{{keyFeatures}}}

  Please generate a summary that highlights the key benefits and features for the specified target audience. Keep the summary concise and easy to understand.
  `,
});

const generateFinancialProductSummaryFlow = ai.defineFlow(
  {
    name: 'generateFinancialProductSummaryFlow',
    inputSchema: GenerateFinancialProductSummaryInputSchema,
    outputSchema: GenerateFinancialProductSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
