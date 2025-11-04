// src/components/products/InterestRateCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface InterestRateCardProps {
  rendimientoAnual?: string;
  gatNominal?: string;
  gatReal?: string;
  interestRate?: string;
}

export default function InterestRateCard({
  rendimientoAnual,
  gatNominal,
  gatReal,
  interestRate
}: InterestRateCardProps) {
  const displayRate = rendimientoAnual || interestRate;

  if (!displayRate && !gatNominal && !gatReal) {
    return null;
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
          <TrendingUp className="h-5 w-5" />
          Tasa de Rendimiento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayRate && (
          <div className="space-y-1">
            <p className="text-4xl font-bold text-primary">{displayRate}</p>
            <p className="text-sm text-muted-foreground">anual</p>
          </div>
        )}
        <div className="space-y-2 pt-2 border-t border-primary/10">
          {gatNominal && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">GAT Nominal:</span>
              <span className="text-base font-semibold text-foreground">{gatNominal}</span>
            </div>
          )}
          {gatReal && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">GAT Real:</span>
              <span className="text-base font-semibold text-foreground">{gatReal}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
