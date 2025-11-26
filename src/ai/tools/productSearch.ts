import { tool } from 'genkit';
import { z } from 'zod';
import { searchFinancialProducts } from '@/lib/vertex-search';

export const productSearchTool = tool(
  {
    name: 'productSearch',
    description: 'Search for financial products in the Raisket database. Use this to find credit cards, loans, or investments based on user requirements.',
    inputSchema: z.object({
      query: z.string().describe('The search query for financial products, e.g., "tarjetas sin anualidad" or "préstamos personales bajos intereses"'),
    }),
    outputSchema: z.array(z.object({
      title: z.string(),
      snippet: z.string(),
      uri: z.string().optional(),
      data: z.any().optional(),
    })),
  },
  async ({ query }) => {
    const results = await searchFinancialProducts(query);
    return results.map(r => ({
      title: r.title,
      snippet: r.snippet,
      uri: r.uri,
      data: r.data
    }));
  }
);
