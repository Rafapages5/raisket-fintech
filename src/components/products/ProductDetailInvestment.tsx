// src/components/products/ProductDetailInvestment.tsx
"use client";

import type { FinancialProduct, Review } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, Heart, Calendar, TrendingUp } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import InterestRateCard from './InterestRateCard';
import KeyFeaturesCard from './KeyFeaturesCard';
import ProsConsSection from './ProsConsSection';
import ProductCalculator from './ProductCalculator';
import BackToCompareButton from './BackToCompareButton';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';

interface ProductDetailInvestmentProps {
  product: FinancialProduct;
  reviews: Review[];
}

export default function ProductDetailInvestment({ product, reviews }: ProductDetailInvestmentProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const isComparing = isInCompare(product.id);

  const handleCompareClick = () => {
    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const averageRating = product.averageRating || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back to Compare Button */}
      <BackToCompareButton />

      {/* Header Section - Logo + Name + Rating */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 mb-4">
            {product.logoUrl && (
              <div className="shrink-0">
                <Image
                  src={product.logoUrl}
                  alt={`${product.provider} logo`}
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-1">
                {product.name}
              </h1>
              {product.tagline && (
                <p className="text-sm text-muted-foreground">{product.tagline}</p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.round(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">
              {averageRating.toFixed(1)}/5
            </span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} opiniones)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tasa de Rendimiento - ESPECÍFICO DE INVERSIÓN */}
      <InterestRateCard
        rendimientoAnual={product.rendimientoAnual}
        gatNominal={product.gatNominal}
        gatReal={product.gatReal}
        interestRate={product.interestRate}
      />

      {/* Características Principales - ESPECÍFICO DE INVERSIÓN */}
      <KeyFeaturesCard
        liquidez={product.liquidez}
        montoMinimo={product.montoMinimo || product.minInvestment}
        montoMaximo={product.montoMaximo}
        requisitos={product.requisitos}
        proteccion={product.proteccion}
        comisiones={product.comisiones}
        features={product.features}
      />

      {/* Pros and Cons */}
      <ProsConsSection pros={product.pros} cons={product.cons} />

      {/* Calculadora - ¿Cuánto ganarías? */}
      <ProductCalculator
        rendimientoAnual={product.rendimientoAnual}
        interestRate={product.interestRate}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {product.detailsUrl && product.detailsUrl !== '#' && (
          <Button
            size="lg"
            className="flex-1 bg-primary hover:bg-primary/90 text-lg py-6"
            asChild
          >
            <Link href={product.detailsUrl} target="_blank" rel="noopener noreferrer">
              Abrir cuenta
              <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        )}
        <Button
          size="lg"
          variant="outline"
          className="flex-1 text-lg py-6"
          onClick={handleCompareClick}
        >
          <Heart className={`mr-2 h-5 w-5 ${isComparing ? 'fill-primary' : ''}`} />
          {isComparing ? 'Guardado' : 'Guardar favorito'}
        </Button>
      </div>

      {/* Terms and Conditions */}
      {(product.vigenciaInicio || product.vigenciaFin || product.terminosCondicionesUrl) && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Términos y Condiciones
            </h3>
            {(product.vigenciaInicio || product.vigenciaFin) && (
              <p className="text-sm text-muted-foreground mb-2">
                Vigencia: {product.vigenciaInicio || ''} - {product.vigenciaFin || ''}
              </p>
            )}
            {product.terminosCondicionesUrl && (
              <Link
                href={product.terminosCondicionesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                Leer T&C completos
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Product Description */}
      {product.longDescription && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg text-foreground mb-3">
              Sobre este producto
            </h3>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
              {product.longDescription}
            </p>
          </CardContent>
        </Card>
      )}
      {/* Reviews Section */}
      <div className="pt-8 border-t mt-8">
        <h3 className="font-headline text-2xl font-bold text-primary mb-6">
          Opiniones de Usuarios
        </h3>
        <div className="grid md:grid-cols-1 gap-8">
          <div className="bg-muted/30 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Escribe tu opinión</h4>
            <ReviewForm productId={product.id} />
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Opiniones recientes</h4>
            <ReviewList reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  );
}
