// src/app/compare/page.tsx
"use client";

import { useCompare } from '@/contexts/CompareContext';
import { FinancialProduct } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Info, Star, XCircle, Scale } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

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

      <div className="overflow-x-auto">
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
