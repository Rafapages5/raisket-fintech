// src/components/products/ProductCardNW.tsx
// Product Card estilo NerdWallet

import Link from 'next/link';
import Image from 'next/image';
import { Star, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { FinancialProduct } from '@/lib/financial-products';

interface ProductCardNWProps {
  product: FinancialProduct;
  variant?: 'default' | 'compact' | 'featured';
}

// Badge colors mapping
const badgeStyles: Record<string, string> = {
  'Sin Anualidad': 'bg-[#00D9A5]/10 text-[#00D9A5] border-[#00D9A5]/20',
  '100% Digital': 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20',
  'Sin Buró': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  'Sin Buró Mínimo': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  'Riesgo Muy Bajo': 'bg-[#00D9A5]/10 text-[#00D9A5] border-[#00D9A5]/20',
  'Gobierno Federal': 'bg-[#1A365D]/10 text-[#1A365D] border-[#1A365D]/20',
  'Alto Riesgo': 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
  'Rápido': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  'P2P': 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20',
  'IPAB': 'bg-[#1A365D]/10 text-[#1A365D] border-[#1A365D]/20',
  'default': 'bg-gray-100 text-gray-600 border-gray-200',
};

function getBadgeStyle(badge: string): string {
  return badgeStyles[badge] || badgeStyles['default'];
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'h-4 w-4',
            star <= Math.round(rating)
              ? 'fill-[#F59E0B] text-[#F59E0B]'
              : 'fill-gray-200 text-gray-200'
          )}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-[#1A365D]">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function ProductCardNW({ product, variant = 'default' }: ProductCardNWProps) {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <article
      className={cn(
        'group bg-white rounded-xl border border-[#E2E8F0] transition-all duration-300',
        'hover:shadow-lg hover:border-[#00D9A5]',
        isFeatured && 'ring-2 ring-[#00D9A5] ring-offset-2'
      )}
    >
      <div className={cn('p-5', isCompact && 'p-4')}>
        {/* Header: Logo + Institution */}
        <div className="flex items-start gap-4 mb-4">
          {/* Institution Logo */}
          <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {product.institution_logo ? (
              <Image
                src={product.institution_logo}
                alt={product.institution}
                width={48}
                height={48}
                className="object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-[#1A365D]">
                {product.institution.charAt(0)}
              </span>
            )}
          </div>

          {/* Title + Institution */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-[#1A365D] group-hover:text-[#00D9A5] transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-[#64748B]">{product.institution}</p>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="mt-1 flex items-center gap-2">
                <RatingStars rating={product.rating} />
                <span className="text-xs text-[#64748B]">
                  ({product.review_count.toLocaleString()} reseñas)
                </span>
              </div>
            )}
          </div>

          {/* Main Rate - Prominent */}
          {product.main_rate_value && (
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold text-[#1A365D]">
                {product.main_rate_value}
              </div>
              <div className="text-xs text-[#64748B]">
                {product.main_rate_label}
              </div>
            </div>
          )}
        </div>

        {/* Badges */}
        {product.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.badges.slice(0, 3).map((badge) => (
              <span
                key={badge}
                className={cn(
                  'text-xs font-medium px-2.5 py-1 rounded-full border',
                  getBadgeStyle(badge)
                )}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {!isCompact && product.description && (
          <p className="text-sm text-[#334155] mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Benefits */}
        {!isCompact && product.benefits.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {product.benefits.slice(0, 3).map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#334155]">
                <svg
                  className="h-4 w-4 text-[#00D9A5] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="line-clamp-1">{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          {product.apply_url && (
            <Button
              asChild
              className="flex-1 bg-[#00D9A5] hover:bg-[#00C294] text-white"
            >
              <a href={product.apply_url} target="_blank" rel="noopener noreferrer">
                Solicitar
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            className="border-[#1A365D] text-[#1A365D] hover:bg-[#1A365D] hover:text-white"
          >
            <Link href={`/producto/${product.slug}`}>
              Ver más
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Promoted Badge */}
      {product.is_promoted && (
        <div className="absolute top-0 right-4 bg-[#8B5CF6] text-white text-xs font-medium px-2 py-1 rounded-b-md">
          Promocionado
        </div>
      )}
    </article>
  );
}

// Compact version for lists/sidebars
export function ProductCardCompact({ product }: { product: FinancialProduct }) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#00D9A5] hover:shadow-md transition-all"
    >
      {/* Logo */}
      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
        {product.institution_logo ? (
          <Image
            src={product.institution_logo}
            alt={product.institution}
            width={32}
            height={32}
            className="object-contain"
          />
        ) : (
          <span className="text-lg font-bold text-[#1A365D]">
            {product.institution.charAt(0)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[#1A365D] group-hover:text-[#00D9A5] text-sm line-clamp-1">
          {product.name}
        </h4>
        <p className="text-xs text-[#64748B]">{product.institution}</p>
      </div>

      {/* Rate */}
      {product.main_rate_value && (
        <div className="text-right">
          <div className="text-sm font-semibold text-[#1A365D]">
            {product.main_rate_value}
          </div>
        </div>
      )}
    </Link>
  );
}
