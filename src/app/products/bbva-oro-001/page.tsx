"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Star, Shield, CreditCard, Users, Gift, Award, CheckCircle, Phone, Mail, MapPin, Clock, DollarSign, Percent, Calendar, FileText, Heart, Umbrella, Car, Plane } from 'lucide-react';

export default function ProductDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const product = {
    id: 'bbva-oro-001',
    name: 'Tarjeta de Crédito Oro BBVA',
    tagline: 'Más beneficios para tu estilo de vida.',
    description: 'Tarjeta clásica con beneficios premium, seguros incluidos y programa de recompensas mejorado para el día a día.',
    imageUrl: 'https://placehold.co/600x400/FFD700/000000?text=BBVA+Oro',
    provider: 'BBVA México',
    rating: 4.5,
    reviewCount: 1920,
    cat: '39.9%',
    creditLimit: 'Hasta $150,000 MXN'
  };

  const financialInfo = {
    interestRate: '39.9% anual',
    cat: '39.9%',
    annualFee: '$900 MXN (condonable con consumos mínimos)',
    creditLimit: 'Hasta $150,000 MXN',
    paymentTerm: '3-24 meses sin intereses'
  };

  const features = [
    'Límite de crédito más alto',
    'Seguro de vida por $200,000 MXN',
    'Seguro de accidentes personales',
    'BBVA Rewards programa mejorado',
    'Meses sin intereses extendidos',
    'Servicio al cliente preferencial',
    'Compras en línea seguras con 3D Secure'
  ];

  const benefits = [
    'Mayor poder de compra',
    'Protección integral',
    'Recompensas aceleradas',
    'Atención prioritaria',
    'Experiencias exclusivas'
  ];

  const commissions = [
    { concept: 'Anualidad', amount: '$900 MXN (condonable)' },
    { concept: 'Comisión por disposición en efectivo', amount: '4% mínimo $35 MXN' },
    { concept: 'Comisión por pago tardío', amount: '$400 MXN' },
    { concept: 'Comisión por exceso de límite', amount: '$400 MXN' },
    { concept: 'Reposición de tarjeta', amount: '$200 MXN' },
    { concept: 'Estado de cuenta adicional', amount: '$25 MXN' }
  ];

  const insurance = [
    { type: 'Seguro de vida', coverage: '$200,000 MXN' },
    { type: 'Seguro de accidentes personales', coverage: '$100,000 MXN' },
    { type: 'Protección de compras', coverage: 'Hasta $25,000 MXN por evento' },
    { type: 'Fraude en internet', coverage: '100% de cobertura' },
    { type: 'Extensión de garantía', coverage: 'Hasta 1 año adicional' }
  ];

  const requirements = [
    'Ingresos mínimos de $15,000 MXN mensuales',
    'Buen historial crediticio',
    'Edad entre 21 y 70 años',
    'Residencia en México',
    'Comprobantes de ingresos',
    'Identificación oficial vigente'
  ];

  const promotions = [
    { title: 'Anualidad condonable', description: 'Con $18,000 MXN en consumos anuales' },
    { title: 'Doble puntos BBVA Rewards', description: 'Los primeros 3 meses' },
    { title: 'Meses sin intereses preferencial', description: 'Hasta 24 MSI en tiendas departamentales' },
    { title: 'Seguro de vida gratis', description: '$200,000 MXN de cobertura incluida' }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const tabs = [
    { id: 'overview', label: 'Información General', icon: CreditCard },
    { id: 'benefits', label: 'Beneficios', icon: Gift },
    { id: 'commissions', label: 'Comisiones', icon: DollarSign },
    { id: 'insurance', label: 'Seguros', icon: Shield },
    { id: 'requirements', label: 'Requisitos', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-xl mb-4 text-primary-foreground/90">{product.tagline}</p>
              <div className="flex items-center mb-4">
                <div className="flex mr-4">
                  {renderStars(product.rating)}
                </div>
                <span className="text-primary-foreground/80">
                  {product.rating}/5 ({product.reviewCount.toLocaleString()} reseñas)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-primary-foreground/80">CAT Promedio</div>
                  <div className="text-2xl font-bold">{product.cat}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-primary-foreground/80">Límite de Crédito</div>
                  <div className="text-2xl font-bold">{product.creditLimit}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={250}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Información Financiera</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tasa de Interés:</span>
                        <span className="font-semibold">{financialInfo.interestRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CAT Promedio:</span>
                        <span className="font-semibold">{financialInfo.cat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Anualidad:</span>
                        <span className="font-semibold">{financialInfo.annualFee}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Límite de Crédito:</span>
                        <span className="font-semibold">{financialInfo.creditLimit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Meses sin Intereses:</span>
                        <span className="font-semibold">{financialInfo.paymentTerm}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Características Principales</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Beneficios Principales</h2>
                  <div className="grid gap-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-primary/10 rounded-lg">
                        <Award className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Promociones Vigentes</h2>
                  <div className="grid gap-4">
                    {promotions.map((promotion, index) => (
                      <div key={index} className="border border-primary rounded-lg p-4">
                        <h3 className="font-semibold text-primary mb-2">{promotion.title}</h3>
                        <p className="text-gray-700">{promotion.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'commissions' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Comisiones y Costos</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Concepto</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Costo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissions.map((commission, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4 text-gray-700">{commission.concept}</td>
                          <td className="py-3 px-4 font-semibold">{commission.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'insurance' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Seguros Incluidos</h2>
                <div className="grid gap-4">
                  {insurance.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                      <Shield className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.type}</h3>
                        <p className="text-gray-600">{item.coverage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requisitos de Elegibilidad</h2>
                <div className="grid gap-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Solicitar Tarjeta</h3>
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-4">
                Solicitar Ahora
              </button>
              <p className="text-sm text-gray-600 text-center">
                Proceso 100% digital • Respuesta inmediata
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Información de Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-gray-700">01 800 BBVA MX</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-gray-700">24/7 Atención al Cliente</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-gray-700">Sucursales en todo México</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-6">
              <h3 className="text-lg font-bold text-primary mb-2">Beneficios Oro</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Seguro de vida incluido</li>
                <li>• Programa Rewards mejorado</li>
                <li>• Servicio preferencial</li>
                <li>• Límites más altos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}