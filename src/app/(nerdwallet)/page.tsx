// src/app/(nerdwallet)/page.tsx
// Nueva Landing Page estilo NerdWallet

import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import WhyRaisketSection from '@/components/home/WhyRaisketSection';
import { getFinancialProducts } from '@/lib/financial-products';
import SchemaScript from '@/lib/schema/SchemaScript';
import { generateProductListSchema } from '@/lib/schema/generators';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Raisket - Compara Productos Financieros en México',
  description: 'Encuentra y compara los mejores productos financieros en México: tarjetas de crédito sin anualidad, préstamos personales, inversiones y cuentas bancarias. Comparador 100% gratuito con análisis experto.',
  keywords: ['productos financieros', 'comparador', 'tarjetas de crédito', 'préstamos', 'inversiones', 'cuentas bancarias', 'México'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Raisket - Compara Productos Financieros en México',
    description: 'Encuentra y compara los mejores productos financieros en México',
    url: 'https://raisket.mx',
    type: 'website',
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  // Fetch products by category in parallel
  const [creditCards, personalLoans, investments, bankingAccounts] =
    await Promise.all([
      getFinancialProducts({ category: 'credit_card', limit: 3 }),
      getFinancialProducts({ category: 'personal_loan', limit: 3 }),
      getFinancialProducts({ category: 'investment', limit: 3 }),
      getFinancialProducts({ category: 'banking', limit: 3 }),
    ]);

  // Combinar todos los productos para el schema
  const allProducts = [...creditCards, ...personalLoans, ...investments, ...bankingAccounts];

  const productListSchema = generateProductListSchema(allProducts, {
    name: 'Productos Financieros Destacados en Raisket',
    description: 'Los mejores productos financieros en México',
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Schema.org JSON-LD */}
      <SchemaScript schema={productListSchema} />
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Categories */}
      <div className="space-y-4">
        {/* Credit Cards */}
        <CategorySection
          category="credit_card"
          products={creditCards}
        />

        {/* Why Raisket - Trust Section */}
        <WhyRaisketSection />

        {/* Personal Loans */}
        <CategorySection
          category="personal_loan"
          products={personalLoans}
        />

        {/* Investments */}
        <CategorySection
          category="investment"
          products={investments}
        />

        {/* Banking Accounts */}
        <CategorySection
          category="banking"
          products={bankingAccounts}
        />
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1A365D] to-[#2D4A68]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            ¿No sabes por dónde empezar?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Nuestro asistente de IA te ayuda a encontrar el producto perfecto
            según tu perfil financiero
          </p>
          <a
            href="/chat"
            className="inline-flex items-center gap-2 bg-[#00D9A5] hover:bg-[#00C294] text-white font-medium px-8 py-3 rounded-full transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Hablar con el Asistente IA
          </a>
        </div>
      </section>
    </div>
  );
}
