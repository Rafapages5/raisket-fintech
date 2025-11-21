// src/components/home/WhyRaisketSection.tsx

import { Shield, Scale, Brain, Users } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Independiente',
    description:
      'No vendemos productos de nadie. Nuestras recomendaciones están basadas únicamente en lo que es mejor para ti.',
  },
  {
    icon: Scale,
    title: 'Sin Conflictos de Interés',
    description:
      'A diferencia de los bancos, no ganamos comisión por venderte. Trabajamos para ti, no para las instituciones.',
  },
  {
    icon: Brain,
    title: 'Impulsado por IA',
    description:
      'Nuestros modelos de inteligencia artificial analizan cientos de productos para encontrar el ideal según tu perfil.',
  },
  {
    icon: Users,
    title: 'Comunidad Real',
    description:
      'Reseñas y calificaciones de usuarios reales de México. Sin opiniones falsas ni patrocinadas.',
  },
];

export default function WhyRaisketSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A365D] mb-4">
            ¿Por qué confiar en Raisket?
          </h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            Somos el primer comparador financiero verdaderamente independiente de México
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-xl hover:bg-[#F8FAFC] transition-colors"
            >
              <div className="w-14 h-14 bg-[#00D9A5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-7 w-7 text-[#00D9A5]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A365D] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#64748B]">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1A365D]">+50</span>
              <span>Productos comparados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1A365D]">+10,000</span>
              <span>Usuarios activos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1A365D]">4.8/5</span>
              <span>Calificación promedio</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#00D9A5]">100%</span>
              <span>Gratuito</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
