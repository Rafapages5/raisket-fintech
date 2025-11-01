/**
 * Página de demostración del Chat de Raisket AI
 *
 * Esta es una página de ejemplo para probar el componente ChatInterface.
 * Puedes acceder a esta página en: /chat-demo
 */

import { ChatInterface } from '@/components/chat';

export const metadata = {
  title: 'Demo - Chat con Raisket AI',
  description: 'Prueba el chat inteligente de Raisket para asesoría financiera personalizada'
};

export default function ChatDemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Chat con Raisket AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tu asesor financiero inteligente. Pregunta sobre presupuestos, inversiones,
            deudas y más.
          </p>
        </div>

        {/* Chat Component */}
        <ChatInterface />

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Análisis de Presupuesto
            </h3>
            <p className="text-sm text-gray-600">
              Obtén recomendaciones personalizadas usando la regla 50/30/20
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Estrategia de Deudas
            </h3>
            <p className="text-sm text-gray-600">
              Recibe planes de pago optimizados con método avalancha o bola de nieve
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Recomendaciones de Inversión
            </h3>
            <p className="text-sm text-gray-600">
              Portafolios personalizados según tu perfil de riesgo y objetivos
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span>ℹ️</span>
            ¿Cómo funciona?
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>
                <strong>RAG Inteligente:</strong> Busca información relevante en nuestra base
                de conocimiento financiero
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>
                <strong>IA Contextual:</strong> Usa Claude AI con conocimiento especializado
                del mercado mexicano
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>
                <strong>100% Privado:</strong> Tus conversaciones son privadas y no se comparten
              </span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
