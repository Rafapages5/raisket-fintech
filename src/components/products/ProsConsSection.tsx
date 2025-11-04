// src/components/products/ProsConsSection.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ProsConsSectionProps {
  pros?: string[];
  cons?: string[];
}

export default function ProsConsSection({ pros, cons }: ProsConsSectionProps) {
  if ((!pros || pros.length === 0) && (!cons || cons.length === 0)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Ventajas y Desventajas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pros */}
          {pros && pros.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-foreground">Pros</h4>
              </div>
              <ul className="space-y-2">
                {pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cons */}
          {cons && cons.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-foreground">Cons</h4>
              </div>
              <ul className="space-y-2">
                {cons.map((con, idx) => (
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
  );
}
