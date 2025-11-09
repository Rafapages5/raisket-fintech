// src/app/about/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Scale, Award, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Raisket - El Primer Asesor Financiero Independiente de México",
  description: "Raisket es el primer asesor financiero independiente de México impulsado por IA. Trabajamos para ti, no para los bancos. Sin conflictos de interés.",
};

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-background rounded-xl shadow-lg">
        <div className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold mb-6">
          🏆 Asesores Financieros Independientes
        </div>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
          El Primer Asesor Financiero<br />
          <span className="text-accent">Independiente</span> de México<br />
          <span className="text-foreground/70 text-3xl md:text-4xl">Impulsado por IA</span>
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 max-w-4xl mx-auto font-semibold mb-4">
          Trabajamos para ti, no para los bancos
        </p>
        <p className="text-base md:text-lg text-foreground/70 max-w-3xl mx-auto">
          Sin conflictos de interés. Sin comisiones ocultas. Solo asesoría honesta basada en tus necesidades reales.
        </p>
      </section>

      <section className="container mx-auto px-4">
        <Card className="shadow-xl border-2 border-accent/20">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary text-center mb-4">
              Nuestra Misión: Romper el Conflicto de Interés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base md:text-lg text-foreground/80 leading-relaxed">
            <div className="bg-destructive/5 border-l-4 border-destructive p-6 rounded-r-lg">
              <h3 className="font-semibold text-xl text-destructive mb-3">El Problema que Nadie Te Cuenta:</h3>
              <p className="mb-3">
                Los asesores financieros tradicionales, bancos y fintechs tienen un <strong>conflicto de interés fundamental</strong>:
                solo te ofrecen los productos de su empresa, sin importar si realmente te benefician.
              </p>
              <p>
                Ganan comisión por venderte, no por ayudarte. Ocultan información sobre alternativas mejores.
                <strong> Este sistema está roto y diseñado para beneficiar a las instituciones, no a ti.</strong>
              </p>
            </div>

            <div className="bg-accent/5 border-l-4 border-accent p-6 rounded-r-lg">
              <h3 className="font-semibold text-xl text-accent mb-3">Nuestra Solución: Independencia Total</h3>
              <p className="mb-3">
                <strong>Raisket es el primer asesor financiero independiente de México impulsado por IA.</strong>
                No vendemos productos de ninguna institución. No recibimos comisiones por recomendaciones.
              </p>
              <p className="mb-3">
                Nuestra única lealtad es contigo. Te mostramos <strong>TODAS las opciones del mercado</strong> y te
                ayudamos a elegir la mejor según tus necesidades reales, no las que más le convengan a un banco.
              </p>
              <p>
                Creemos que la asesoría financiera debe ser transparente, ética y regulada. Por eso estamos en proceso
                de <strong>registro ante la CNBV</strong> como asesores financieros independientes.
              </p>
            </div>

            <div className="text-center pt-4">
              <p className="text-xl font-semibold text-primary mb-2">
                Raisket trabaja para ti, no para los bancos.
              </p>
              <p className="text-foreground/70">
                Esta es nuestra promesa y nuestro diferenciador fundamental.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="py-16 bg-card rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl text-primary text-center mb-12">
            Por Qué Somos Diferentes
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-destructive mb-2">Asesores Tradicionales</h3>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>✗ Solo productos de su institución</li>
                    <li>✗ Ganan comisión por venderte</li>
                    <li>✗ Sesgo hacia productos que les benefician</li>
                    <li>✗ Información limitada y parcial</li>
                    <li>✗ Sin educación real, solo ventas</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-accent mb-2">Raisket Independiente</h3>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>✓ <strong>Todos los productos del mercado mexicano</strong></li>
                    <li>✓ <strong>Sin comisiones</strong> - Pagas por asesoría, no por productos</li>
                    <li>✓ <strong>Recomendaciones basadas en tus necesidades</strong></li>
                    <li>✓ <strong>Transparencia total</strong> - Comparador gratuito</li>
                    <li>✓ <strong>Educación financiera personalizada con IA</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-accent/30">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                  <Scale className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl text-primary">Independencia Total</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground/70">
                No vendemos productos de ninguna institución financiera. No hay conflicto de interés. Tu beneficio es nuestro único objetivo.
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl text-primary">Ética de Expertos</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground/70">
                Nuestros modelos de IA están entrenados con los estándares éticos de los mejores asesores financieros independientes de México.
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                  <ShieldCheck className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl text-primary">Regulación CNBV</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground/70">
                En proceso de registro ante la CNBV como asesores financieros independientes, garantizando cumplimiento regulatorio y protección al cliente.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="font-headline text-3xl md:text-4xl text-primary text-center mb-12">
          Cómo Funciona Raisket
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-accent/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <CardTitle className="text-center text-primary text-xl">1. Comparador Gratuito</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-foreground/70">
              <p className="mb-3">Accede a todos los productos financieros de México en un solo lugar.</p>
              <p className="text-sm">
                <strong>100% gratuito.</strong> Compara, lee reseñas y toma decisiones informadas sin costo alguno.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎓</span>
              </div>
              <CardTitle className="text-center text-primary text-xl">2. Educación con IA</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-foreground/70">
              <p className="mb-3">Aprende finanzas personalizadas según tu perfil: emprendedor, profesionista o empresa.</p>
              <p className="text-sm">
                <strong>Contenido adaptado</strong> sobre ETFs, fondos, PPR, deuda inteligente y más.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <CardTitle className="text-center text-primary text-xl">3. Asesoría Integral</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-foreground/70">
              <p className="mb-3">Recibe asesoría financiera independiente y personalizada impulsada por IA.</p>
              <p className="text-sm">
                <strong>$10-15 USD/mes.</strong> Transparente, sin conflictos de interés.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl p-8 md:p-12 text-center">
          <h3 className="font-headline text-2xl md:text-3xl text-primary mb-4">
            ¿Listo para tomar el control de tus finanzas?
          </h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
            Únete a los mexicanos que están tomando decisiones financieras inteligentes con asesoría independiente y transparente.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link href="/recommendations">Obtener Asesoría Gratuita</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/pricing">Ver Planes y Precios</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
