// src/components/products/KeyFeaturesCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, DollarSign, Clock, Shield, Wallet, FileText } from 'lucide-react';

interface KeyFeaturesCardProps {
  liquidez?: string;
  montoMinimo?: string;
  montoMaximo?: string;
  requisitos?: string[];
  proteccion?: string;
  comisiones?: string[];
  features?: string[];
}

export default function KeyFeaturesCard({
  liquidez,
  montoMinimo,
  montoMaximo,
  requisitos,
  proteccion,
  comisiones,
  features
}: KeyFeaturesCardProps) {
  const hasContent = liquidez || montoMinimo || montoMaximo ||
                     (requisitos && requisitos.length > 0) ||
                     proteccion ||
                     (comisiones && comisiones.length > 0) ||
                     (features && features.length > 0);

  if (!hasContent) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
          <ListChecks className="h-5 w-5" />
          Características Principales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {liquidez && (
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Liquidez</p>
              <p className="text-sm text-muted-foreground">{liquidez}</p>
            </div>
          </div>
        )}

        {(montoMinimo || montoMaximo) && (
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-1">
              {montoMinimo && (
                <>
                  <p className="text-sm font-medium text-foreground">Monto mínimo</p>
                  <p className="text-sm text-muted-foreground">{montoMinimo}</p>
                </>
              )}
              {montoMaximo && (
                <>
                  <p className="text-sm font-medium text-foreground mt-2">Monto máximo con tasa</p>
                  <p className="text-sm text-muted-foreground">{montoMaximo}</p>
                </>
              )}
            </div>
          </div>
        )}

        {requisitos && requisitos.length > 0 && (
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Requisitos</p>
              <ul className="space-y-1">
                {requisitos.map((req, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">• {req}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {proteccion && (
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Protección</p>
              <p className="text-sm text-muted-foreground">{proteccion}</p>
            </div>
          </div>
        )}

        {comisiones && comisiones.length > 0 && (
          <div className="flex items-start gap-3">
            <Wallet className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Comisiones</p>
              <ul className="space-y-1">
                {comisiones.map((comision, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">• {comision}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {features && features.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <ul className="space-y-2">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
