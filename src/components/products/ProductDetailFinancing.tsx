// src/components/products/ProductDetailFinancing.tsx
"use client";

import type { FinancialProduct, Review } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, Heart, Calendar, DollarSign, Store, Lightbulb, Phone, Mail, MessageCircle, FileText, AlertCircle, Target, CheckCircle2, XCircle } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import BackToCompareButton from './BackToCompareButton';

interface ProductDetailFinancingProps {
  product: FinancialProduct;
  reviews: Review[];
}

export default function ProductDetailFinancing({ product, reviews }: ProductDetailFinancingProps) {
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

      {/* Costo de Financiamiento */}
      {product.interestRate && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
              <DollarSign className="h-5 w-5" />
              Costo de Financiamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">{product.interestRate}</p>
              <p className="text-sm text-muted-foreground">según tienda</p>
            </div>
            {(product as any).cat && (
              <div className="pt-2 border-t border-primary/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">CAT Promedio:</span>
                  <span className="text-base font-semibold text-foreground">{(product as any).cat}</span>
                </div>
              </div>
            )}
            {(product as any).ejemploFinanciamiento && (
              <div className="pt-2 bg-background/50 p-3 rounded-lg text-sm">
                <p className="font-medium text-foreground mb-1">Ejemplo:</p>
                <p className="text-muted-foreground">{(product as any).ejemploFinanciamiento}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Características Principales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Características Principales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {product.montoMinimo && (
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <span className="text-sm text-muted-foreground">Monto disponible:</span>
              <span className="font-semibold text-foreground">{product.montoMinimo} - {product.montoMaximo}</span>
            </div>
          )}
          {product.loanTerm && (
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <span className="text-sm text-muted-foreground">Plazos:</span>
              <span className="font-semibold text-foreground">{product.loanTerm}</span>
            </div>
          )}
          {(product as any).aprobacion && (
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <span className="text-sm text-muted-foreground">Aprobación:</span>
              <span className="font-semibold text-foreground">{(product as any).aprobacion}</span>
            </div>
          )}
          {product.features && product.features.length > 0 && (
            <div className="pt-2">
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tiendas Participantes */}
      {(product as any).tiendasParticipantes && (product as any).tiendasParticipantes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
              <Store className="h-5 w-5" />
              Tiendas Participantes {(product as any).totalTiendas && `(${(product as any).totalTiendas}+)`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {(product as any).tiendasParticipantes.slice(0, 8).map((tienda: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-sm py-1.5 px-3">
                  {tienda}
                </Badge>
              ))}
              {(product as any).totalTiendas && (product as any).totalTiendas > 8 && (
                <Badge variant="outline" className="text-sm py-1.5 px-3">
                  +{(product as any).totalTiendas - 8} más
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Store className="mr-2 h-4 w-4" />
              Ver todas las tiendas
            </Button>
          </CardContent>
        </Card>
      )}

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
                    <h4 className="font-semibold text-foreground">Ventajas</h4>
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
                    <h4 className="font-semibold text-foreground">Desventajas</h4>
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

      {/* Simulador de Pagos - placeholder */}
      <Card className="bg-gradient-to-br from-accent/5 to-accent/10">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Simulador de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Calcula tus pagos quincenales según el monto y plazo
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
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground/80">{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Costos Adicionales */}
      {(product as any).costosAdicionales && (product as any).costosAdicionales.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-amber-900 dark:text-amber-200">
              <AlertCircle className="h-5 w-5" />
              Costos Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(product as any).costosAdicionales.map((costo: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span className="text-sm text-foreground/80">{costo}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* ¿Para quién es ideal? */}
      {(product as any).idealPara && (product as any).idealPara.length > 0 && (
        <Card className="bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
              <Target className="h-5 w-5" />
              ¿Para quién es ideal?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(product as any).idealPara.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span className="text-sm text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tips Raisket */}
      {(product as any).tipsRaisket && (product as any).tipsRaisket.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-green-900 dark:text-green-200">
              <Lightbulb className="h-5 w-5" />
              Tips Raisket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(product as any).tipsRaisket.map((tip: { tipo: string; texto: string }, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className={`text-xl mt-0.5 ${
                    tip.tipo === 'positivo' ? '🟢' : tip.tipo === 'neutro' ? '🟡' : '🔴'
                  }`}>
                    {tip.tipo === 'positivo' ? '🟢' : tip.tipo === 'neutro' ? '🟡' : '🔴'}
                  </span>
                  <span className="text-sm text-foreground/80">{tip.texto}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {product.detailsUrl && product.detailsUrl !== '#' && (
          <Button
            size="lg"
            className="col-span-2 sm:col-span-1 bg-primary hover:bg-primary/90 text-lg py-6"
            asChild
          >
            <Link href={product.detailsUrl} target="_blank" rel="noopener noreferrer">
              Solicitar ahora
              <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        )}
        <Button
          size="lg"
          variant="outline"
          className="text-lg py-6"
          onClick={handleCompareClick}
        >
          <Heart className={`mr-2 h-5 w-5 ${isComparing ? 'fill-primary' : ''}`} />
          Guardar
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="text-lg py-6"
        >
          <ExternalLink className="mr-2 h-5 w-5" />
          Compartir
        </Button>
      </div>

      {/* Información Regulatoria */}
      {(product.vigenciaInicio || product.vigenciaFin || product.terminosCondicionesUrl) && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Información Regulatoria
            </h3>
            {(product as any).cat && (
              <p className="text-xs text-muted-foreground mb-2">
                CAT promedio {(product as any).cat} sin IVA (calculado el {new Date().toLocaleDateString('es-MX')}). Para fines informativos.
              </p>
            )}
            {(product.vigenciaInicio || product.vigenciaFin) && (
              <p className="text-sm text-muted-foreground mb-2">
                Vigencia: {product.vigenciaInicio || 'Permanente'} {product.vigenciaFin ? `- ${product.vigenciaFin}` : ''}
              </p>
            )}
            {product.terminosCondicionesUrl && (
              <div className="flex flex-wrap gap-2 mt-3">
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
                <Link href="#" className="text-sm text-primary hover:underline">
                  Ver tabla de pagos
                </Link>
                <span className="text-muted-foreground">|</span>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Descargar PDF
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contacto */}
      {(product as any).contacto && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
              <Phone className="h-5 w-5" />
              Contacto {product.provider}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              {(product as any).contacto.telefono && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{(product as any).contacto.telefono}</span>
                </div>
              )}
              {(product as any).contacto.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${(product as any).contacto.email}`} className="text-primary hover:underline">
                    {(product as any).contacto.email}
                  </a>
                </div>
              )}
              {(product as any).contacto.horario && (
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span>{(product as any).contacto.horario}</span>
                </div>
              )}
            </div>
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
