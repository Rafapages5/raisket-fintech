// src/ai/flows/generate-landing-page-prompt.ts
'use server';

/**
 * @fileOverview Generates a personalized financial product offer based on user input.
 *
 * - generateLandingPageOffer - A function that generates a personalized financial product offer.
 * - GenerateLandingPageOfferInput - The input type for the generateLandingPageOffer function.
 * - GenerateLandingPageOfferOutput - The return type for the generateLandingPageOffer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLandingPageOfferInputSchema = z.object({
  segment: z.enum(['Individual', 'Business']).describe('The segment of the user.'),
  productType: z.string().describe('The type of financial product the user is looking for.'),
  needs: z.string().describe('The specific needs and requirements of the user.'),
});
export type GenerateLandingPageOfferInput = z.infer<typeof GenerateLandingPageOfferInputSchema>;

const GenerateLandingPageOfferOutputSchema = z.object({
  offerDetails: z.string().describe('Detailed description of the personalized financial product offer.'),
  referralLink: z.string().url().describe('Referral link to the offer with proper referrer information.'),
});
export type GenerateLandingPageOfferOutput = z.infer<typeof GenerateLandingPageOfferOutputSchema>;

export async function generateLandingPageOffer(input: GenerateLandingPageOfferInput): Promise<GenerateLandingPageOfferOutput> {
  return generateLandingPageOfferFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLandingPageOfferPrompt',
  input: {schema: GenerateLandingPageOfferInputSchema},
  output: {schema: GenerateLandingPageOfferOutputSchema},
  prompt: `You are a financial product expert who specializes in creating personalized offers for users.

  Based on the user's segment, product type, and needs, you will generate a personalized offer and a referral link to the offer with proper referrer information for tracking.

  Segment: {{{segment}}}
  Product Type: {{{productType}}}
  Needs: {{{needs}}}

  Offer Details: {{offerDetails}}
  Referral Link: {{referralLink}}`,
});

const generateLandingPageOfferFlow = ai.defineFlow(
  {
    name: 'generateLandingPageOfferFlow',
    inputSchema: GenerateLandingPageOfferInputSchema,
    outputSchema: GenerateLandingPageOfferOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
