import React from 'react';
import AguinaldoCalculator from '@/components/calculators/AguinaldoCalculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Calculadora de Aguinaldo México 2025 | Raisket',
    description: 'Calcula cuánto te toca de aguinaldo este año. Herramienta gratuita y actualizada a la Ley Federal del Trabajo.',
};

export default function AguinaldoPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="mb-8 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-headline font-bold text-primary mb-4">Calculadora de Aguinaldo</h1>
                    <p className="text-lg text-muted-foreground">
                        Conoce cuánto dinero te corresponde recibir antes del 20 de diciembre según la Ley Federal del Trabajo.
                    </p>
                </div>

                <AguinaldoCalculator />

                <div className="mt-16 max-w-4xl mx-auto prose prose-lg">
                    <h2>¿Qué es el Aguinaldo?</h2>
                    <p>
                        El aguinaldo es un derecho de los trabajadores establecido en la Ley Federal del Trabajo.
                        Todas las personas trabajadoras tendrán derecho a recibir, cada año, un aguinaldo que deberá pagarse antes del día 20 de diciembre,
                        equivalente a por lo menos <strong>15 días de salario</strong>.
                    </p>

                    <h3>Preguntas Frecuentes</h3>

                    <h4>¿Quiénes tienen derecho al aguinaldo?</h4>
                    <p>
                        Todos los trabajadores, ya sean de base, confianza, planta, sindicalizados, contratados por obra o tiempo determinado, eventuales, entre otros.
                    </p>

                    <h4>¿Qué pasa si no trabajé todo el año?</h4>
                    <p>
                        Tienes derecho a que se te pague la parte proporcional del tiempo que trabajaste, independientemente de que ya no labores en la empresa.
                    </p>

                    <h4>¿El aguinaldo paga impuestos?</h4>
                    <p>
                        Sí, pero hay una exención. Si tu aguinaldo es inferior a 30 veces la UMA (Unidad de Medida y Actualización), no pagas ISR por ese monto.
                        Lo que exceda de esa cantidad sí grava impuestos.
                    </p>
                </div>
            </div>
        </div>
    );
}
