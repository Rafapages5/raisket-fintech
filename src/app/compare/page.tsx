// src/app/compare/page.tsx
"use client";

import { useCompare } from '@/contexts/CompareContext';
import { FinancialProduct } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Info, Star, XCircle, Scale, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) {
    return (
      <div className="text-center py-16">
        <Scale className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="font-headline text-3xl text-primary mb-4">Comparación de Productos</h1>
        <p className="text-lg text-muted-foreground mb-6">Aún no has agregado ningún producto para comparar.</p>
        <Button asChild>
          <Link href="/individuals/all">Explorar Productos</Link>
        </Button>
      </div>
    );
  }

  // Define which fields to display in the comparison table.
  const comparisonFields: Array<{ label: string; key: keyof FinancialProduct | ((p: FinancialProduct) => React.ReactNode) }> = [
    { label: 'Proveedor', key: 'provider' },
    { label: 'Categoría', key: 'category' },
    { label: 'Segmento', key: 'segment' },
    { label: 'Tasa de Interés', key: 'interestRate' },
    { label: 'Tarifas', key: 'fees' },
    { label: 'Plazo del Préstamo', key: 'loanTerm' },
    { label: 'Monto Máximo del Préstamo', key: 'maxLoanAmount' },
    { label: 'Inversión Mínima', key: 'minInvestment' },
    { label: 'Monto de Cobertura', key: 'coverageAmount' },
    { 
      label: 'Elegibilidad', 
      key: (p) => p.eligibility && p.eligibility.length > 0 ? (
        <ul className="list-disc list-inside text-xs">
          {p.eligibility.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      ) : <span className="text-muted-foreground/70">-</span>
    },
    { 
      label: 'Características', 
      key: (p) => p.features && p.features.length > 0 ? (
        <ul className="list-disc list-inside text-xs">
          {p.features.slice(0, 5).map((item, i) => <li key={i}>{item}</li>)} {/* Show first 5 features */}
          {p.features.length > 5 && <li>...y más</li>}
        </ul>
      ) : <span className="text-muted-foreground/70">-</span>
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-headline text-3xl md:text-4xl text-primary">Comparar Productos ({compareItems.length})</h1>
        {compareItems.length > 0 && (
          <Button variant="destructive" onClick={clearCompare} size="sm">
            <Trash2 className="mr-2 h-4 w-4" /> Limpiar Todo
          </Button>
        )}
      </div>

      {compareItems.length < 2 && (
        <Card className="border-accent bg-accent/10">
          <CardHeader className="flex flex-row items-center space-x-3">
            <Info className="h-6 w-6 text-accent" />
            <CardTitle className="text-accent">Agregar Más Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-accent/80">
              Agrega al menos un producto más para ver una comparación lado a lado.
            </p>
            <Button asChild variant="link" className="p-0 h-auto text-accent hover:underline">
              <Link href="/individuals/all">Continuar Explorando Productos</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-6">
        {compareItems.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="p-0 relative">
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={200}
                  className="object-cover w-full h-48"
                  data-ai-hint={product.aiHint || product.category.toLowerCase()}
                />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromCompare(product.id)}
                className="absolute top-2 right-2 text-destructive hover:text-destructive/80 bg-white/90 backdrop-blur-sm"
              >
                <XCircle className="mr-1 h-4 w-4" /> Quitar
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg text-primary hover:underline mb-2">{product.name}</h3>
                </Link>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(product.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2">{(product.averageRating || 0).toFixed(1)} ({product.reviewCount} reseñas)</span>
                </div>
                <div className="flex gap-2 mb-3">
                  <Badge variant="secondary">
                    {product.segment}
                  </Badge>
                  <Badge variant="default">
                    {product.category}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                {product.provider && (
                  <div>
                    <span className="font-medium text-foreground">Proveedor:</span>{' '}
                    <span className="text-muted-foreground">{product.provider}</span>
                  </div>
                )}
                {product.interestRate && (
                  <div>
                    <span className="font-medium text-foreground">Tasa de Interés:</span>{' '}
                    <span className="text-muted-foreground">{product.interestRate}</span>
                  </div>
                )}
                {product.fees && (
                  <div>
                    <span className="font-medium text-foreground">Tarifas:</span>{' '}
                    <span className="text-muted-foreground">{product.fees}</span>
                  </div>
                )}
                {product.loanTerm && (
                  <div>
                    <span className="font-medium text-foreground">Plazo del Préstamo:</span>{' '}
                    <span className="text-muted-foreground">{product.loanTerm}</span>
                  </div>
                )}
                {product.maxLoanAmount && (
                  <div>
                    <span className="font-medium text-foreground">Monto Máximo:</span>{' '}
                    <span className="text-muted-foreground">{product.maxLoanAmount}</span>
                  </div>
                )}
                {product.minInvestment && (
                  <div>
                    <span className="font-medium text-foreground">Inversión Mínima:</span>{' '}
                    <span className="text-muted-foreground">{product.minInvestment}</span>
                  </div>
                )}
                {product.coverageAmount && (
                  <div>
                    <span className="font-medium text-foreground">Monto de Cobertura:</span>{' '}
                    <span className="text-muted-foreground">{product.coverageAmount}</span>
                  </div>
                )}
              </div>

              {product.features && product.features.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Características</h4>
                    <ul className="space-y-1.5">
                      {product.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-start text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-accent mr-2 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {product.features.length > 3 && (
                        <li className="text-sm text-muted-foreground pl-6">
                          +{product.features.length - 3} más
                        </li>
                      )}
                    </ul>
                  </div>
                </>
              )}

              {product.eligibility && product.eligibility.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Elegibilidad</h4>
                    <ul className="space-y-1.5">
                      {product.eligibility.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-accent mr-2 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <Separator />

              <Button asChild className="w-full">
                <Link href={`/products/${product.id}`}>Ver Detalles Completos</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-max lg:min-w-full border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] sticky left-0 bg-card z-10 border-r">Característica</TableHead>
              {compareItems.map(product => (
                <TableHead key={product.id} className="min-w-[250px] border-l">
                  <div className="flex flex-col items-center text-center">
                     <Link href={`/products/${product.id}`}>
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={150}
                            height={80}
                            className="object-cover rounded-md mb-2 h-20 w-full max-w-[150px]"
                            data-ai-hint={product.aiHint || product.category.toLowerCase()}
                        />
                      </Link>
                    <Link href={`/products/${product.id}`} className="font-semibold text-primary hover:underline text-base mb-1 line-clamp-2">{product.name}</Link>
                    <div className="flex items-center text-xs text-muted-foreground mb-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.round(product.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-1">({product.reviewCount})</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFromCompare(product.id)} className="text-destructive hover:text-destructive/80 h-auto p-1 text-xs">
                      <XCircle className="mr-1 h-3 w-3" /> Quitar
                    </Button>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonFields.map(field => {
              // Check if at least one product has a value for this field
              const hasData = compareItems.some(p => {
                if (typeof field.key === 'function') {
                  const val = field.key(p);
                  return val !== null && val !== undefined && (typeof val !== 'object' || (val as any).props?.children !== '-');
                }
                return p[field.key as keyof FinancialProduct] !== undefined && p[field.key as keyof FinancialProduct] !== null && p[field.key as keyof FinancialProduct] !== '';
              });

              if (!hasData) return null; // Skip row if no product has data for this field

              return (
                <TableRow key={field.label}>
                  <TableCell className="font-medium sticky left-0 bg-card z-10 border-r">{field.label}</TableCell>
                  {compareItems.map(product => (
                    <TableCell key={product.id} className="text-sm border-l">
                      {typeof field.key === 'function'
                        ? field.key(product)
                        : (product[field.key as keyof FinancialProduct] as React.ReactNode) || <span className="text-muted-foreground/70">-</span>
                      }
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-card z-10 border-r">Acciones</TableCell>
              {compareItems.map(product => (
                <TableCell key={product.id} className="text-center border-l">
                  <Button asChild size="sm">
                    <Link href={`/products/${product.id}`}>Ver Detalles</Link>
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
