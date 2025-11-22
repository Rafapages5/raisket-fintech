"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, Calculator } from 'lucide-react';
import { differenceInDays, startOfYear, endOfYear } from 'date-fns';

export default function AguinaldoCalculator() {
    const [salary, setSalary] = useState<number>(15000);
    const [daysAguinaldo, setDaysAguinaldo] = useState<number>(15); // Law minimum is 15
    const [workedFullYear, setWorkedFullYear] = useState<boolean>(true);
    const [startDate, setStartDate] = useState<string>(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);

    const [aguinaldoAmount, setAguinaldoAmount] = useState<number>(0);

    useEffect(() => {
        calculateAguinaldo();
    }, [salary, daysAguinaldo, workedFullYear, startDate]);

    const calculateAguinaldo = () => {
        const dailySalary = salary / 30;
        let totalDays = 365;
        let daysWorked = 365;

        if (!workedFullYear) {
            const start = new Date(startDate);
            const end = new Date(new Date().getFullYear(), 11, 31); // Dec 31
            // Ensure start date is within current year for calculation
            if (start.getFullYear() === new Date().getFullYear()) {
                daysWorked = differenceInDays(end, start) + 1;
            }
        }

        const proportionalPart = daysWorked / totalDays;
        const totalAguinaldo = dailySalary * daysAguinaldo * proportionalPart;

        setAguinaldoAmount(totalAguinaldo);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Inputs Section */}
            <div className="lg:col-span-6 space-y-6">
                <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-headline text-primary">Datos Laborales</CardTitle>
                        <CardDescription>Calcula cuánto te corresponde de aguinaldo según la ley.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Salary */}
                        <div className="space-y-3">
                            <Label htmlFor="salary" className="font-medium text-gray-700">Salario Mensual Bruto</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="salary"
                                    type="number"
                                    value={salary}
                                    onChange={(e) => setSalary(Number(e.target.value))}
                                    className="pl-9 border-gray-200 focus:ring-accent focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        {/* Days of Aguinaldo */}
                        <div className="space-y-3">
                            <Label htmlFor="daysAguinaldo" className="font-medium text-gray-700">Días de Aguinaldo (Mínimo 15)</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="daysAguinaldo"
                                    type="number"
                                    value={daysAguinaldo}
                                    onChange={(e) => setDaysAguinaldo(Number(e.target.value))}
                                    className="pl-9 border-gray-200 focus:ring-accent focus:border-accent transition-all"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Por ley son mínimo 15 días, pero algunas empresas dan más.</p>
                        </div>

                        {/* Worked Full Year Toggle */}
                        <div className="flex items-center space-x-2 pt-2">
                            <input
                                type="checkbox"
                                id="workedFullYear"
                                checked={workedFullYear}
                                onChange={(e) => setWorkedFullYear(e.target.checked)}
                                className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                            />
                            <Label htmlFor="workedFullYear" className="font-medium text-gray-700 cursor-pointer">Trabajé todo el año completo</Label>
                        </div>

                        {/* Start Date (if not full year) */}
                        {!workedFullYear && (
                            <div className="space-y-3 animate-accordion-down">
                                <Label htmlFor="startDate" className="font-medium text-gray-700">Fecha de Inicio</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border-gray-200 focus:ring-accent focus:border-accent transition-all"
                                />
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-6 space-y-6">
                <Card className="bg-white border-2 border-accent/20 shadow-lg">
                    <CardHeader className="bg-accent/5 border-b border-accent/10">
                        <CardTitle className="text-center text-primary flex items-center justify-center gap-2">
                            <DollarSign className="h-6 w-6 text-accent" />
                            Tu Aguinaldo Estimado
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8 pb-8 text-center">
                        <div className="text-5xl font-bold text-primary mb-2">{formatCurrency(aguinaldoAmount)}</div>
                        <p className="text-sm text-muted-foreground">
                            Este monto es antes de impuestos (ISR).
                        </p>

                        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left text-sm space-y-2">
                            <div className="flex justify-between">
                                <span>Salario Diario:</span>
                                <span className="font-medium">{formatCurrency(salary / 30)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Días a pagar:</span>
                                <span className="font-medium">{workedFullYear ? daysAguinaldo : ((daysAguinaldo * (differenceInDays(new Date(new Date().getFullYear(), 11, 31), new Date(startDate)) + 1)) / 365).toFixed(2)} días</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="p-4">
                        <h4 className="font-bold text-blue-800 mb-2">¿Cuándo se paga?</h4>
                        <p className="text-sm text-blue-700">
                            Por ley, el aguinaldo debe pagarse antes del <strong>20 de diciembre</strong> de cada año.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
