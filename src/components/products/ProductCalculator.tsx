// src/components/products/ProductCalculator.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calculator } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductCalculatorProps {
  rendimientoAnual?: string;
  interestRate?: string;
}

export default function ProductCalculator({
  rendimientoAnual,
  interestRate
}: ProductCalculatorProps) {
  const [amount, setAmount] = useState<string>("10000");
  const [term, setTerm] = useState<string>("12");
  const [earnings, setEarnings] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Extract numeric rate from string (e.g., "15%" -> 15)
  const extractRate = (rateString?: string): number => {
    if (!rateString) return 0;
    const match = rateString.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const rate = extractRate(rendimientoAnual || interestRate);

  useEffect(() => {
    const principal = parseFloat(amount) || 0;
    const months = parseInt(term) || 0;

    if (principal > 0 && months > 0 && rate > 0) {
      // Simple interest calculation for demonstration
      // For compound interest: A = P(1 + r/n)^(nt)
      const annualRate = rate / 100;
      const monthlyRate = annualRate / 12;
      const compoundAmount = principal * Math.pow(1 + monthlyRate, months);
      const earnedInterest = compoundAmount - principal;

      setEarnings(earnedInterest);
      setTotalAmount(compoundAmount);
    } else {
      setEarnings(0);
      setTotalAmount(principal);
    }
  }, [amount, term, rate]);

  if (!rate) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <Card className="bg-gradient-to-br from-accent/5 to-accent/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
          <Calculator className="h-5 w-5" />
          ¿Cuánto ganarías?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Monto a invertir
          </Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10000"
            className="text-lg"
            min="0"
            step="1000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="term" className="text-sm font-medium">
            Plazo
          </Label>
          <Select value={term} onValueChange={setTerm}>
            <SelectTrigger id="term" className="text-lg">
              <SelectValue placeholder="Selecciona el plazo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 mes</SelectItem>
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">12 meses</SelectItem>
              <SelectItem value="24">24 meses</SelectItem>
              <SelectItem value="36">36 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Rendimiento estimado:</span>
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(earnings)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Total al final:</span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            * Cálculo estimado con interés compuesto. Los resultados reales pueden variar.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
