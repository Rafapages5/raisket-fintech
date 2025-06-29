'use server';
/**
 * @fileOverview A financial product recommendation AI agent.
 *
 * - generateFinancialProductRecommendations - A function that generates personalized financial product recommendations.
 * - FinancialProfile - The input type for the generateFinancialProductRecommendations function.
 * - FinancialProductRecommendations - The return type for the generateFinancialProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialProfileSchema = z.object({
  income: z.number().describe('Annual income of the user.'),
  creditScore: z.number().describe('Credit score of the user (300-850).'),
  financialGoals: z
    .string()
    .describe('Description of the user’s financial goals.'),
  riskTolerance: z
    .string()
    .describe(
      'User’s risk tolerance (e.g., low, medium, high).  Low risk tolerance indicates aversion to risk.'
    ),
  age: z.number().describe('Age of the user'),
  isBusiness: z
    .boolean()
    .describe(
      'Whether the profile is for an individual or a business. True indicates that the profile is for a business.'
    ),
});
export type FinancialProfile = z.infer<typeof FinancialProfileSchema>;

const FinancialProductRecommendationsSchema = z.object({
  creditProducts: z
    .array(z.string())
    .describe('Recommended credit products based on the user profile.'),
  financingProducts: z
    .array(z.string())
    .describe('Recommended financing products based on the user profile.'),
  investmentProducts: z
    .array(z.string())
    .describe('Recommended investment products based on the user profile.'),
  insuranceProducts: z
    .array(z.string())
    .describe('Recommended insurance products based on the user profile.'),
  reasoning: z
    .string()
    .describe(
      'The AI reasoning for the recommendations, explaining why each product category was recommended based on the financial profile.'
    ),
});
export type FinancialProductRecommendations = z.infer<
  typeof FinancialProductRecommendationsSchema
>;

export async function generateFinancialProductRecommendations(
  input: FinancialProfile
): Promise<FinancialProductRecommendations> {
  return generateFinancialProductRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialProductRecommendationPrompt',
  input: {schema: FinancialProfileSchema},
  output: {schema: FinancialProductRecommendationsSchema},
  prompt: `You are an expert financial advisor providing personalized financial product recommendations.

  Based on the user's financial profile and needs, provide recommendations across four categories: credit products, financing products, investment products, and insurance products.

  Financial Profile:
  Income: {{income}}
  Credit Score: {{creditScore}}
  Financial Goals: {{financialGoals}}
  Risk Tolerance: {{riskTolerance}}
  Age: {{age}}
  Is Business: {{isBusiness}}

  Consider all factors when making your recommendations. For example, if the user has low risk tolerance, recommend low-risk investment products. If the user is a business, recommend financing products suitable for businesses.

  Reasoning:
  Provide detailed reasoning for each recommendation.

  Output the response in JSON format.
  `,
});

const generateFinancialProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateFinancialProductRecommendationsFlow',
    inputSchema: FinancialProfileSchema,
    outputSchema: FinancialProductRecommendationsSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
