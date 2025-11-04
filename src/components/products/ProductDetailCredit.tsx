// src/components/products/ProductDetailCredit.tsx
"use client";

import type { FinancialProduct, Review } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, Heart, Calendar, CreditCard, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import BackToCompareButton from './BackToCompareButton';

interface ProductDetailCreditProps {
  product: FinancialProduct;
  reviews: Review[];
}

export default function ProductDetailCredit({ product, reviews }: ProductDetailCreditProps) {
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
      <BackToCompareButton />

      {/* Header */}
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

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(averageRating)
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

      {/* Tasa de Interés - ESPECÍFICO DE CRÉDITO */}
      {product.interestRate && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
              <CreditCard className="h-5 w-5" />
              Tasa de Interés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-4xl font-bold text-primary">{product.interestRate}</p>
              <p className="text-sm text-muted-foreground">anual</p>
            </div>
            {(product as any).cat && (
              <div className="pt-2 border-t border-primary/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">CAT Promedio:</span>
                  <span className="text-base font-semibold text-foreground">{(product as any).cat}</span>
                </div>
              </div>
            )}
            {(product as any).pagoMensualEjemplo && (
              <div className="pt-2 text-sm text-muted-foreground">
                <p>Pago mensual: <span className="font-semibold text-foreground">{(product as any).pagoMensualEjemplo}</span></p>
                <p className="text-xs mt-1">{(product as any).pagoMensualNota || '*Ejemplo ilustrativo'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Características Principales - CRÉDITO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Características Principales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {product.montoMinimo && (
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <span className="text-sm text-muted-foreground">Monto mínimo:</span>
              <span className="font-semibold text-foreground">{product.montoMinimo}</span>
            </div>
          )}
          {(product.montoMaximo || product.maxLoanAmount) && (
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <span className="text-sm text-muted-foreground">Monto máximo:</span>
              <span className="font-semibold text-foreground">{product.montoMaximo || product.maxLoanAmount}</span>
            </div>
          )}
          {product.loanTerm && (
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <span className="text-sm text-muted-foreground">Plazo:</span>
              <span className="font-semibold text-foreground">{product.loanTerm}</span>
            </div>
          )}
          {(product as any).aprobacion && (
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <span className="text-sm text-muted-foreground">Aprobación:</span>
              <span className="font-semibold text-foreground">{(product as any).aprobacion}</span>
            </div>
          )}
          {(product as any).disposicion && (
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <span className="text-sm text-muted-foreground">Disposición:</span>
              <span className="font-semibold text-foreground">{(product as any).disposicion}</span>
            </div>
          )}
          {product.comisiones && product.comisiones.length > 0 && (
            <div className="pt-2">
              <p className="text-sm font-medium text-foreground mb-2">Comisiones:</p>
              <ul className="space-y-1">
                {product.comisiones.map((com, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{com}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pros and Cons */}
      {(product.pros || product.cons) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">
              Ventajas y Desventajas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {product.pros && product.pros.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-foreground">Pros</h4>
                  </div>
                  <ul className="space-y-2">
                    {product.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <span className="text-sm text-foreground/80">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.cons && product.cons.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-foreground">Cons</h4>
                  </div>
                  <ul className="space-y-2">
                    {product.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                        <span className="text-sm text-foreground/80">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simulador de Crédito - placeholder */}
      <Card className="bg-gradient-to-br from-accent/5 to-accent/10">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Simulador de Crédito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Calcula tu pago mensual según el monto y plazo deseados
          </p>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Simulador próximamente disponible</p>
          </div>
        </CardContent>
      </Card>

      {/* Requisitos */}
      {product.requisitos && product.requisitos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
              <FileText className="h-5 w-5" />
              Requisitos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {product.requisitos.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-sm text-foreground/80">{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {product.detailsUrl && product.detailsUrl !== '#' && (
          <Button
            size="lg"
            className="flex-1 bg-primary hover:bg-primary/90 text-lg py-6"
            asChild
          >
            <Link href={product.detailsUrl} target="_blank" rel="noopener noreferrer">
              Solicitar crédito
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
            <p className="text-xs text-muted-foreground mb-2">
              CAT informativo sin IVA
            </p>
            {product.terminosCondicionesUrl && (
              <div className="flex flex-wrap gap-2">
                <Link
                  href={product.terminosCondicionesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Leer T&C completos
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <span className="text-muted-foreground">|</span>
                <Link
                  href="#"
                  className="text-sm text-primary hover:underline"
                >
                  Ver tabla amortización
                </Link>
              </div>
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
    </div>
  );
}
