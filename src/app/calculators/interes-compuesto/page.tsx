import React from 'react';
import CompoundInterestCalculator from '@/components/calculators/CompoundInterestCalculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Calculadora de Interés Compuesto | Raisket',
    description: 'Calcula cuánto crecerá tu dinero con el poder del interés compuesto. Herramienta financiera gratuita para México.',
};

export default function CompoundInterestPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="mb-8 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-headline font-bold text-primary mb-4">Calculadora de Interés Compuesto</h1>
                    <p className="text-lg text-muted-foreground">
                        Descubre cómo pequeñas inversiones mensuales pueden convertirse en grandes sumas con el tiempo gracias al interés compuesto.
                    </p>
                </div>

                <CompoundInterestCalculator />

                <div className="mt-16 max-w-4xl mx-auto prose prose-lg">
                    <h2>¿Qué es el interés compuesto?</h2>
                    <p>
                        El interés compuesto es el interés que se calcula sobre el capital inicial más los intereses acumulados de períodos anteriores.
                        Básicamente, es "interés sobre interés". Esto hace que tu dinero crezca a un ritmo acelerado con el tiempo,
                        a diferencia del interés simple, que solo se calcula sobre el capital principal.
                    </p>

                    <h3>¿Cómo usar esta calculadora?</h3>
                    <ul>
                        <li><strong>Depósito Inicial:</strong> La cantidad de dinero con la que empiezas.</li>
                        <li><strong>Aportación Mensual:</strong> Cuánto dinero planeas añadir cada mes.</li>
                        <li><strong>Tasa de Interés:</strong> El rendimiento anual esperado (por ejemplo, CETES suele estar alrededor del 10-11%).</li>
                        <li><strong>Plazo:</strong> Cuántos años planeas dejar tu dinero invertido.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
