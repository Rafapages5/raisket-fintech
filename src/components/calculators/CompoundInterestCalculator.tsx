"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Percent, Calendar, TrendingUp } from 'lucide-react';

interface CalculationResult {
  year: number;
  principal: number;
  interest: number;
  total: number;
}

export default function CompoundInterestCalculator() {
  const [initialDeposit, setInitialDeposit] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(2000);
  const [interestRate, setInterestRate] = useState<number>(10); // 10% annual
  const [years, setYears] = useState<number>(10);
  const [data, setData] = useState<CalculationResult[]>([]);

  useEffect(() => {
    calculateCompoundInterest();
  }, [initialDeposit, monthlyContribution, interestRate, years]);

  const calculateCompoundInterest = () => {
    let currentPrincipal = initialDeposit;
    let currentInterest = 0;
    const newData: CalculationResult[] = [];
    
    // Year 0
    newData.push({
      year: 0,
      principal: initialDeposit,
      interest: 0,
      total: initialDeposit
    });

    for (let i = 1; i <= years; i++) {
      let yearlyInterest = 0;
      // Calculate monthly for better precision
      for (let m = 0; m < 12; m++) {
        const monthlyRate = interestRate / 100 / 12;
        const interestEarned = (currentPrincipal + currentInterest) * monthlyRate;
        yearlyInterest += interestEarned;
        currentPrincipal += monthlyContribution;
      }
      
      currentInterest += yearlyInterest;
      
      newData.push({
        year: i,
        principal: currentPrincipal,
        interest: Math.round(currentInterest),
        total: Math.round(currentPrincipal + currentInterest)
      });
    }
    setData(newData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const finalResult = data[data.length - 1] || { principal: 0, interest: 0, total: 0 };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Inputs Section */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="border-none shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-primary">Parámetros</CardTitle>
            <CardDescription>Ajusta los valores para tu simulación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Initial Deposit */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="initialDeposit" className="font-medium text-gray-700">Depósito Inicial</Label>
                <span className="text-primary font-bold">{formatCurrency(initialDeposit)}</span>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="initialDeposit" 
                  type="number" 
                  value={initialDeposit} 
                  onChange={(e) => setInitialDeposit(Number(e.target.value))}
                  className="pl-9 border-gray-200 focus:ring-accent focus:border-accent transition-all"
                />
              </div>
              <Slider 
                value={[initialDeposit]} 
                min={0} 
                max={1000000} 
                step={1000} 
                onValueChange={(val) => setInitialDeposit(val[0])}
                className="py-2"
              />
            </div>

            {/* Monthly Contribution */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="monthlyContribution" className="font-medium text-gray-700">Aportación Mensual</Label>
                <span className="text-primary font-bold">{formatCurrency(monthlyContribution)}</span>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="monthlyContribution" 
                  type="number" 
                  value={monthlyContribution} 
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="pl-9 border-gray-200 focus:ring-accent focus:border-accent transition-all"
                />
              </div>
              <Slider 
                value={[monthlyContribution]} 
                min={0} 
                max={50000} 
                step={500} 
                onValueChange={(val) => setMonthlyContribution(val[0])}
                className="py-2"
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="interestRate" className="font-medium text-gray-700">Tasa de Interés Anual</Label>
                <span className="text-primary font-bold">{interestRate}%</span>
              </div>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="interestRate" 
                  type="number" 
                  value={interestRate} 
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="pl-9 border-gray-200 focus:ring-accent focus:border-accent transition-all"
                />
              </div>
              <Slider 
                value={[interestRate]} 
                min={1} 
                max={50} 
                step={0.5} 
                onValueChange={(val) => setInterestRate(val[0])}
                className="py-2"
              />
            </div>

            {/* Years */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="years" className="font-medium text-gray-700">Plazo (Años)</Label>
                <span className="text-primary font-bold">{years} años</span>
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="years" 
                  type="number" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="pl-9 border-gray-200 focus:ring-accent focus:border-accent transition-all"
                />
              </div>
              <Slider 
                value={[years]} 
                min={1} 
                max={40} 
                step={1} 
                onValueChange={(val) => setYears(val[0])}
                className="py-2"
              />
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-l-4 border-l-primary shadow-sm">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total Invertido</p>
              <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(finalResult.principal)}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-l-4 border-l-accent shadow-sm">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Interés Ganado</p>
              <p className="text-2xl font-bold text-accent mt-1">{formatCurrency(finalResult.interest)}</p>
            </CardContent>
          </Card>
          <Card className="bg-primary text-white shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-100 font-medium uppercase tracking-wide">Saldo Total</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(finalResult.total)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="border-none shadow-md bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Proyección de Crecimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => `Año ${value}`}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelFormatter={(label) => `Año ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="principal" 
                    stackId="1" 
                    stroke="#1A365D" 
                    fill="#1A365D" 
                    name="Capital" 
                    fillOpacity={0.8}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="interest" 
                    stackId="1" 
                    stroke="#00D9A5" 
                    fill="#00D9A5" 
                    name="Interés" 
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-gray-600">Capital Invertido</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-gray-600">Interés Generado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
