"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign, Percent, Calendar, CreditCard } from 'lucide-react';

export default function LoanCalculator() {
    const [loanAmount, setLoanAmount] = useState<number>(200000);
    const [interestRate, setInterestRate] = useState<number>(12); // 12% annual
    const [loanTerm, setLoanTerm] = useState<number>(5); // Years

    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalPayment, setTotalPayment] = useState<number>(0);

    useEffect(() => {
        calculateLoan();
    }, [loanAmount, interestRate, loanTerm]);

    const calculateLoan = () => {
        const principal = loanAmount;
        const calculatedInterest = interestRate / 100 / 12;
        const calculatedPayments = loanTerm * 12;

        // Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
        const x = Math.pow(1 + calculatedInterest, calculatedPayments);
        const monthly = (principal * x * calculatedInterest) / (x - 1);

        if (isFinite(monthly)) {
            const total = monthly * calculatedPayments;
            const interest = total - principal;

            setMonthlyPayment(monthly);
            setTotalPayment(total);
            setTotalInterest(interest);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const data = [
        { name: 'Capital', value: loanAmount },
        { name: 'Interés Total', value: totalInterest },
    ];

    const COLORS = ['#1A365D', '#00D9A5']; // Primary Blue, Accent Green

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Inputs Section */}
            <div className="lg:col-span-5 space-y-6">
                <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-headline text-primary">Detalles del Préstamo</CardTitle>
                        <CardDescription>Ingresa los datos de tu crédito</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Loan Amount */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label htmlFor="loanAmount" className="font-medium text-gray-700">Monto del Préstamo</Label>
                                <span className="text-primary font-bold">{formatCurrency(loanAmount)}</span>
                            </div>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="loanAmount"
                                    type="number"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    className="pl-9 border-gray-200 focus:ring-accent focus:border-accent transition-all"
                                />
                            </div>
                            <Slider
                                value={[loanAmount]}
                                min={1000}
                                max={5000000}
                                step={1000}
                                onValueChange={(val) => setLoanAmount(val[0])}
                                className="py-2"
                            />
                        </div>

                        {/* Interest Rate */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label htmlFor="interestRate" className="font-medium text-gray-700">Tasa de Interés Anual (%)</Label>
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
                                max={100}
                                step={0.5}
                                onValueChange={(val) => setInterestRate(val[0])}
                                className="py-2"
                            />
                        </div>

                        {/* Loan Term */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label htmlFor="loanTerm" className="font-medium text-gray-700">Plazo (Años)</Label>
                                <span className="text-primary font-bold">{loanTerm} años</span>
                            </div>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="loanTerm"
                                    type="number"
                                    value={loanTerm}
                                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                                    className="pl-9 border-gray-200 focus:ring-accent focus:border-accent transition-all"
                                />
                            </div>
                            <Slider
                                value={[loanTerm]}
                                min={1}
                                max={30}
                                step={1}
                                onValueChange={(val) => setLoanTerm(val[0])}
                                className="py-2"
                            />
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-7 space-y-6">
                <Card className="bg-primary text-white shadow-lg border-none">
                    <CardContent className="pt-8 pb-8 text-center">
                        <p className="text-blue-100 font-medium uppercase tracking-wide mb-2">Tu Pago Mensual Estimado</p>
                        <div className="text-5xl font-bold mb-2">{formatCurrency(monthlyPayment)}</div>
                        <p className="text-sm text-blue-200">*Cálculo estimado, no incluye seguros ni comisiones extra.</p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-none shadow-md bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-headline">Desglose de Pagos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-gray-600">Capital Prestado</span>
                                    <span className="font-bold text-primary">{formatCurrency(loanAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-gray-600">Interés Total</span>
                                    <span className="font-bold text-accent">{formatCurrency(totalInterest)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-bold text-gray-800">Total a Pagar</span>
                                    <span className="font-bold text-xl text-gray-800">{formatCurrency(totalPayment)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white flex flex-col items-center justify-center p-4">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
