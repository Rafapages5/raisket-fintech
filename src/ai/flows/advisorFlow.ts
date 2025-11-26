import { z } from 'zod';
import { ai } from '../genkit';
import { productSearchTool } from '../tools/productSearch';

export const advisorFlow = ai.defineFlow(
  {
    name: 'advisorFlow',
    inputSchema: z.object({
      query: z.string(),
      isPremium: z.boolean().optional().default(false),
      context: z.string().optional(), // For contract analysis context
    }),
    outputSchema: z.string(),
  },
  async ({ query, isPremium, context }) => {
    const systemPrompt = `You are an expert Financial Advisor for Raisket, Mexico's premier financial platform.
    Your goal is to help users find the best financial products (credit cards, loans, investments) based on their needs.
    
    ${isPremium ? 'You are interacting with a PREMIUM user. Provide detailed, in-depth analysis and comparison.' : 'You are interacting with a FREE user. Provide helpful but concise summaries.'}
    
    Use the 'productSearch' tool to find real data from our database. 
    ALWAYS cite the products you find.
    If the user asks about a specific contract or document and provided context, analyze it.
    
    Tone: Professional, trustworthy, yet accessible. Like a Bloomberg analyst talking to a smart investor.
    `;

    const { text } = await ai.generate({
      prompt: `${systemPrompt}\n\nUser Query: ${query}\n${context ? `Context: ${context}` : ''}`,
      tools: [productSearchTool],
    });

    return text;
  }
);
