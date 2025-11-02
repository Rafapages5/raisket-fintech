// src/app/chat/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles, TrendingUp, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
          <MessageCircle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Asistente Financiero con IA
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          Tu asesor financiero personal disponible 24/7. Obtén recomendaciones personalizadas,
          análisis de productos y consejos profesionales impulsados por inteligencia artificial.
        </p>
        <div className="inline-flex items-center gap-2 bg-[#00d4aa]/10 text-[#00d4aa] px-4 py-2 rounded-full font-semibold">
          <Sparkles className="w-4 h-4" />
          3 Preguntas Gratuitas
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Chat Inteligente</CardTitle>
            <CardDescription>
              Conversa naturalmente sobre tus finanzas y obtén respuestas instantáneas
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Recomendaciones</CardTitle>
            <CardDescription>
              Recibe sugerencias personalizadas de productos financieros según tu perfil
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Asesoría Regulada</CardTitle>
            <CardDescription>
              Información basada en normativas financieras mexicanas vigentes
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Para Todos</CardTitle>
            <CardDescription>
              Soluciones tanto para personas como para empresas
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-primary/5 via-background to-background border-primary/20">
        <CardContent className="p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Comienza tu Consulta Gratuita
            </h2>
            <p className="text-muted-foreground mb-8">
              Prueba nuestro asistente con 3 preguntas gratuitas.
              Sin tarjeta de crédito requerida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat-demo">
                <Button size="lg" className="w-full sm:w-auto">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Empezar Ahora (Gratis)
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Ver Planes Premium
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How it Works */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          ¿Cómo Funciona?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Haz tu Pregunta</h3>
            <p className="text-muted-foreground">
              Escribe tu consulta sobre productos financieros, inversiones o cualquier tema relacionado
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">IA Analiza</h3>
            <p className="text-muted-foreground">
              Nuestro asistente procesa tu consulta y busca la mejor información actualizada
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Recibe Respuesta</h3>
            <p className="text-muted-foreground">
              Obtén recomendaciones personalizadas y consejos profesionales al instante
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Teaser */}
      <div className="mt-16 text-center">
        <p className="text-muted-foreground">
          ¿Tienes dudas? Visita nuestro{' '}
          <Link href="/blog" className="text-primary hover:underline">
            blog
          </Link>
          {' '}para más información sobre finanzas personales
        </p>
      </div>
    </div>
  );
}
