// src/components/home/HeroSection.tsx
"use client";

import Link from 'next/link';
import { CreditCard, Banknote, TrendingUp, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  {
    name: 'Tarjetas de Crédito',
    href: '/tarjetas-credito',
    icon: CreditCard,
    color: 'bg-[#00D9A5]',
    description: 'Sin anualidad, cashback y más',
  },
  {
    name: 'Préstamos',
    href: '/prestamos-personales',
    icon: Banknote,
    color: 'bg-[#4FD1C7]',
    description: 'Tasas desde 8.9% anual',
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
    description: 'Alto rendimiento, $0 comisiones',
  },
];

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#1A365D] to-[#2D4A68] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Encuentra el producto financiero{' '}
            <span className="text-[#00D9A5]">perfecto para ti</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Compara tarjetas, préstamos, inversiones y cuentas bancarias.
            Decisiones informadas, sin conflictos de interés.
          </p>

          {/* Trust Badges */}
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
              +50 productos comparados
            </span>
          </div>
        </div>

        {/* Category Cards - Floating on hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group"
            >
              <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-[#00D9A5]">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-3",
                  category.color
                )}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#1A365D] mb-1 group-hover:text-[#00D9A5] transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F8FAFC"/>
        </svg>
      </div>
    </section>
  );
}
