// src/app/page.tsx
// Landing Page MVP Raisket.mx - Estilo NerdWallet

import Link from 'next/link';
import { CreditCard, Banknote, TrendingUp, Building2, ChevronRight, Shield, Scale, Brain, Users, Star, ExternalLink, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  getFinancialProducts,
  categoryLabels,
  type FinancialProduct,
  type ProductCategory,
} from '@/lib/financial-products';
import SchemaScript from '@/lib/schema/SchemaScript';
import { generateProductListSchema } from '@/lib/schema/generators';
import PopularGuidesSection from '@/components/home/PopularGuidesSection';
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

// ============ HERO SECTION ============
function HeroSection() {
  const categories = [
    {
      name: 'Tarjetas de Crédito',
      href: '/tarjetas-credito',
      icon: CreditCard,
      color: 'bg-[#00D9A5]',
      description: 'Sin anualidad, cashback',
    },
    {
      name: 'Préstamos',
      href: '/prestamos-personales',
      icon: Banknote,
      color: 'bg-[#4FD1C7]',
      description: 'Tasas desde 8.9%',
    },
    {
      name: 'Inversiones',
      href: '/inversiones',
      icon: TrendingUp,
      color: 'bg-[#F59E0B]',
      description: 'CETES, fondos, pagarés',
    },
    {
      name: 'Cuentas',
      href: '/cuentas-bancarias',
      icon: Building2,
      color: 'bg-[#8B5CF6]',
      description: 'Alto rendimiento',
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#1A365D] to-[#2D4A68] overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Encuentra el producto financiero{' '}
            <span className="text-[#00D9A5]">perfecto para ti</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Compara tarjetas, préstamos, inversiones y cuentas bancarias.
            Decisiones informadas, sin conflictos de interés.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 mb-8">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4 text-[#00D9A5]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              100% Gratuito
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4 text-[#00D9A5]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Independiente
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4 text-[#00D9A5]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              +50 productos
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link key={category.href} href={category.href} className="group">
              <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-[#00D9A5]">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-3", category.color)}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#1A365D] mb-1 group-hover:text-[#00D9A5] transition-colors text-sm md:text-base">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F8FAFC"/>
        </svg>
      </div>
    </section>
  );
}

// ============ PRODUCT CARD ============
const badgeStyles: Record<string, string> = {
  'Sin Anualidad': 'bg-[#00D9A5]/10 text-[#00D9A5] border-[#00D9A5]/20',
  '100% Digital': 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20',
  'Sin Buró': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  'Sin Buró Mínimo': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  'Riesgo Muy Bajo': 'bg-[#00D9A5]/10 text-[#00D9A5] border-[#00D9A5]/20',
  'Gobierno Federal': 'bg-[#1A365D]/10 text-[#1A365D] border-[#1A365D]/20',
  'Alto Riesgo': 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
  'default': 'bg-gray-100 text-gray-600 border-gray-200',
};

function ProductCard({ product }: { product: FinancialProduct }) {
  return (
    <article className="group bg-white rounded-xl border border-[#E2E8F0] transition-all duration-300 hover:shadow-lg hover:border-[#00D9A5]">
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-[#1A365D]">
              {product.institution.charAt(0)}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-[#1A365D] group-hover:text-[#00D9A5] transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-[#64748B]">{product.institution}</p>
            {product.rating > 0 && (
              <div className="mt-1 flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                <span className="text-sm font-medium text-[#1A365D]">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-[#64748B]">({product.review_count.toLocaleString()})</span>
              </div>
            )}
          </div>

          {product.main_rate_value && (
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold text-[#1A365D]">{product.main_rate_value}</div>
              <div className="text-xs text-[#64748B]">{product.main_rate_label}</div>
            </div>
          )}
        </div>

        {product.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.badges.slice(0, 3).map((badge) => (
              <span
                key={badge}
                className={cn(
                  'text-xs font-medium px-2.5 py-1 rounded-full border',
                  badgeStyles[badge] || badgeStyles['default']
                )}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {product.description && (
          <p className="text-sm text-[#334155] mb-4 line-clamp-2">{product.description}</p>
        )}

        {product.benefits.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {product.benefits.slice(0, 3).map((benefit, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#334155]">
                <svg className="h-4 w-4 text-[#00D9A5] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="line-clamp-1">{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          {product.apply_url && (
            <Button asChild className="flex-1 bg-[#00D9A5] hover:bg-[#00C294] text-white">
              <a href={product.apply_url} target="_blank" rel="noopener noreferrer">
                Solicitar <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
          <Button asChild variant="outline" className="border-[#1A365D] text-[#1A365D] hover:bg-[#1A365D] hover:text-white">
            <Link href={`/producto/${product.slug}`}>
              Ver más <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

// ============ CATEGORY SECTION ============
const categoryHrefs: Record<ProductCategory, string> = {
  credit_card: '/tarjetas-credito',
  personal_loan: '/prestamos-personales',
  investment: '/inversiones',
  banking: '/cuentas-bancarias',
};

function CategorySection({ category, products }: { category: ProductCategory; products: FinancialProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A365D]">{categoryLabels[category]}</h2>
            <p className="text-[#64748B] mt-1">Compara y encuentra la mejor opción para ti</p>
          </div>
          <Link href={categoryHrefs[category]}>
            <Button variant="ghost" className="text-[#00D9A5] hover:text-[#00C294] hover:bg-[#00D9A5]/10">
              Ver todos <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ WHY RAISKET SECTION ============
function WhyRaisketSection() {
  const features = [
    { icon: Shield, title: 'Independiente', description: 'No vendemos productos de nadie. Recomendaciones basadas en tu beneficio.' },
    { icon: Scale, title: 'Sin Conflictos', description: 'No ganamos comisión por venderte. Trabajamos para ti.' },
    { icon: Brain, title: 'IA Avanzada', description: 'Analizamos cientos de productos para encontrar el ideal.' },
    { icon: Users, title: 'Comunidad Real', description: 'Reseñas de usuarios reales de México.' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A365D] mb-4">¿Por qué confiar en Raisket?</h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            El primer comparador financiero independiente de México
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.title} className="text-center p-6 rounded-xl hover:bg-[#F8FAFC] transition-colors">
              <div className="w-14 h-14 bg-[#00D9A5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <f.icon className="h-7 w-7 text-[#00D9A5]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A365D] mb-2">{f.title}</h3>
              <p className="text-sm text-[#64748B]">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ MAIN PAGE ============
export default async function HomePage() {
  const [creditCards, personalLoans, investments, bankingAccounts] = await Promise.all([
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

      <HeroSection />

      <CategorySection category="credit_card" products={creditCards} />

      <WhyRaisketSection />

      <PopularGuidesSection />

      <CategorySection category="personal_loan" products={personalLoans} />
      <CategorySection category="investment" products={investments} />
      <CategorySection category="banking" products={bankingAccounts} />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1A365D] to-[#2D4A68]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">¿No sabes por dónde empezar?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Nuestro asistente IA te ayuda a encontrar el producto perfecto según tu perfil
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-[#00D9A5] hover:bg-[#00C294] text-white font-medium px-8 py-3 rounded-full transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Hablar con el Asistente IA
          </Link>
        </div>
      </section>
    </div>
  );
}
