import React from 'react';
import LoanCalculator from '@/components/calculators/LoanCalculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Calculadora de Préstamos | Raisket',
    description: 'Calcula tu pago mensual y el costo total de tu préstamo personal, automotriz o hipotecario.',
};

export default function LoanPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="mb-8 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-headline font-bold text-primary mb-4">Calculadora de Préstamos</h1>
                    <p className="text-lg text-muted-foreground">
                        Estima tus pagos mensuales y visualiza cuánto pagarás realmente de intereses antes de solicitar un crédito.
                    </p>
                </div>

                <LoanCalculator />

                <div className="mt-16 max-w-4xl mx-auto prose prose-lg">
                    <h2>¿Cómo funciona un préstamo?</h2>
                    <p>
                        Cuando solicitas un préstamo, te comprometes a devolver la cantidad prestada (el capital) más un costo por el uso de ese dinero (el interés) durante un periodo determinado.
                    </p>

                    <h3>Conceptos clave</h3>
                    <ul>
                        <li><strong>Capital:</strong> El dinero que recibes del banco o financiera.</li>
                        <li><strong>Tasa de Interés:</strong> El porcentaje que cobra la institución por prestarte el dinero. Busca siempre el CAT (Costo Anual Total) para comparar mejor.</li>
                        <li><strong>Plazo:</strong> El tiempo que tienes para pagar. A mayor plazo, pagos mensuales más pequeños, pero pagarás más intereses en total.</li>
                    </ul>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 not-prose mt-8">
                        <h4 className="text-blue-800 font-bold text-lg mb-2">Consejo Raisket</h4>
                        <p className="text-blue-700">
                            Si puedes permitirte pagar una mensualidad más alta, elige un plazo más corto. Esto reducirá significativamente la cantidad total de intereses que pagarás.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
