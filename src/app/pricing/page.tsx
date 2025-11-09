// src/app/pricing/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Users, Building2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precios | Raisket - Modelo Transparente de Asesoría Financiera",
  description: "Modelo de negocio transparente: Comparador gratuito, Educación gratuita, Asesoría integral desde $10 USD/mes. Sin comisiones ocultas.",
};

export default function PricingPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-background rounded-xl shadow-lg">
        <div className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold mb-6">
          💎 Modelo de Negocio Transparente
        </div>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
          Sin Comisiones Ocultas,<br />
          <span className="text-accent">Solo Transparencia</span>
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-4xl mx-auto mb-4">
          A diferencia de bancos y asesores tradicionales, <strong>tú pagas por asesoría, no por productos</strong>
        </p>
        <p className="text-base md:text-lg text-foreground/70 max-w-3xl mx-auto">
          Nuestro modelo elimina el conflicto de interés: ganamos cuando tú te beneficias, no cuando comprás un producto específico.
        </p>
      </section>

      {/* Free vs Paid Comparison */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-4">
            ¿Qué es Gratis y Qué es de Pago?
          </h2>
          <p className="text-lg text-foreground/70">
            Nuestra promesa de transparencia empieza aquí
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-accent/30 shadow-xl">
            <CardHeader className="bg-accent/5">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl text-accent text-center">100% Gratuito Para Siempre</CardTitle>
              <CardDescription className="text-center text-base">
                Sin tarjeta de crédito. Sin trucos.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Comparador de Productos Financieros</p>
                    <p className="text-sm text-foreground/70">Compara todos los productos de México: tarjetas, créditos, inversiones, seguros</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Reseñas y Calificaciones</p>
                    <p className="text-sm text-foreground/70">Lee y deja reseñas honestas (solo necesitas registrarte con tu correo)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Contenido Educativo</p>
                    <p className="text-sm text-foreground/70">Artículos, guías y recursos sobre finanzas personales y empresariales</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Chat AI Básico</p>
                    <p className="text-sm text-foreground/70">Preguntas generales sobre finanzas y productos</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6">
                <Button asChild className="w-full bg-accent hover:bg-accent/90">
                  <Link href="/individuals/all">Explorar Comparador Gratis</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/30 shadow-xl">
            <CardHeader className="bg-primary/5">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary text-center">Asesoría Integral (De Pago)</CardTitle>
              <CardDescription className="text-center text-base">
                Para quienes buscan asesoría personalizada
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Asesoría Financiera Personalizada con IA</p>
                    <p className="text-sm text-foreground/70">Análisis profundo de tu situación financiera y recomendaciones a tu medida</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Educación Financiera Adaptada a tu Perfil</p>
                    <p className="text-sm text-foreground/70">Contenido personalizado para emprendedores, profesionistas o empresas</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Planificación Financiera Integral</p>
                    <p className="text-sm text-foreground/70">Presupuestos, estrategias de ahorro, optimización de deudas, plan de inversión</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Herramientas Avanzadas</p>
                    <p className="text-sm text-foreground/70">Excel templates, calculadoras de ROI, flujos de efectivo (empresas)</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6">
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href="#planes">Ver Planes de Asesoría <ChevronRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="planes" className="container mx-auto px-4 py-16 bg-card rounded-xl shadow-lg">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-4">
            Planes de Asesoría Integral
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Modelo transparente. Sin permanencia. Cancela cuando quieras.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Plan Personas */}
          <Card className="border-2 border-accent hover:shadow-2xl transition-all duration-300 relative">
            <div className="absolute top-0 right-0 bg-accent text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
              Más Popular
            </div>
            <CardHeader className="text-center pt-8">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="text-3xl text-primary mb-2">Plan Personas</CardTitle>
              <CardDescription className="text-base">
                Para individuos y profesionistas
              </CardDescription>
              <div className="mt-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-accent">$10</span>
                  <span className="text-2xl text-foreground/70">USD</span>
                </div>
                <p className="text-sm text-foreground/60 mt-2">por mes</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="font-semibold text-foreground border-b pb-2">Todo lo Gratuito +</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Asesoría financiera personalizada con IA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Análisis de tu situación financiera actual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Plan de ahorro e inversión personalizado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Estrategias de optimización de deudas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Educación sobre CETES, ETFs, fondos, PPR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Calculadoras de ROI para certificaciones/posgrados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Soporte prioritario vía chat</span>
                  </li>
                </ul>
              </div>
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90">
                <Link href="/recommendations">Comenzar Ahora</Link>
              </Button>
              <p className="text-xs text-center text-foreground/60">
                Sin permanencia. Cancela cuando quieras.
              </p>
            </CardContent>
          </Card>

          {/* Plan Empresas */}
          <Card className="border-2 border-primary hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pt-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl text-primary mb-2">Plan Empresas</CardTitle>
              <CardDescription className="text-base">
                Para negocios y emprendedores
              </CardDescription>
              <div className="mt-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-primary">$15</span>
                  <span className="text-2xl text-foreground/70">USD</span>
                </div>
                <p className="text-sm text-foreground/60 mt-2">por mes</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="font-semibold text-foreground border-b pb-2">Todo del Plan Personas +</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Asesoría financiera empresarial completa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Análisis de flujo de efectivo y capital de trabajo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Estrategias de financiamiento empresarial</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Uso inteligente de deuda para crecimiento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Templates de Excel: Flujos, P&L, Balance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Evaluación de proyectos de inversión (VPN, TIR)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">Soporte prioritario empresarial</span>
                  </li>
                </ul>
              </div>
              <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90">
                <Link href="/recommendations">Comenzar Ahora</Link>
              </Button>
              <p className="text-xs text-center text-foreground/60">
                Sin permanencia. Cancela cuando quieras.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Our Pricing Model */}
      <section className="container mx-auto px-4">
        <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-2 border-accent/20 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary text-center mb-4">
              ¿Por Qué Este Modelo de Precios?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-destructive flex items-center gap-2">
                  <X className="h-6 w-6" />
                  El Modelo Tradicional (Roto)
                </h3>
                <div className="space-y-3 text-foreground/80">
                  <p className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span><strong>Asesores ganan comisión</strong> por venderte productos específicos</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>Te recomiendan lo que <strong>les conviene a ellos</strong>, no a ti</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>Ocultan comisiones y costos en los productos</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>Conflicto de interés total: ellos vs tú</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-accent flex items-center gap-2">
                  <Check className="h-6 w-6" />
                  El Modelo Raisket (Alineado)
                </h3>
                <div className="space-y-3 text-foreground/80">
                  <p className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span><strong>Pagas por asesoría</strong>, no por productos</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Te recomendamos lo que <strong>realmente te conviene</strong></span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Transparencia total: ves todos los costos</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Incentivos alineados: ganamos cuando tú ganas</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-accent/20">
              <p className="text-center text-lg text-foreground/80">
                <strong className="text-primary">$10-15 USD al mes</strong> es menos de lo que pagas por un café diario,
                pero puede <strong className="text-accent">ahorrarte miles de dólares</strong> al tomar mejores decisiones financieras.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4">
        <h2 className="font-headline text-3xl md:text-4xl text-primary text-center mb-12">
          Preguntas Frecuentes
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-primary">¿Por qué debería pagar si hay contenido gratuito?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/70">
              El comparador y contenido educativo básico son gratuitos para siempre. Pagas solo si quieres asesoría personalizada profunda,
              análisis de tu situación específica y recomendaciones a tu medida. La diferencia es como leer un libro de medicina vs consultar a un doctor.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-primary">¿Realmente no ganan comisiones por productos?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/70">
              Correcto. No vendemos productos ni recibimos comisiones de ninguna institución financiera. Nuestro único ingreso son las suscripciones.
              Esto elimina el conflicto de interés y garantiza que nuestras recomendaciones sean 100% para tu beneficio.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-primary">¿Hay permanencia o contratos largos?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/70">
              No. Pagas mes a mes y puedes cancelar cuando quieras sin penalización. Creemos en ganarnos tu confianza cada mes
              con el valor que te aportamos, no con contratos atrapantes.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-primary">¿Qué pasa si no me gusta después de pagar?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/70">
              Ofrecemos garantía de satisfacción en los primeros 7 días. Si no estás satisfecho, te devolvemos tu dinero sin preguntas.
              Queremos clientes contentos, no atrapados.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-primary">¿Están regulados por la CNBV?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/70">
              Estamos en proceso de registro ante la CNBV como asesores financieros independientes. Mientras tanto, operamos
              bajo los más altos estándares éticos de la industria y transparencia total.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-primary">¿Puedo cambiar de plan después?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/70">
              Sí, puedes cambiar entre Plan Personas y Plan Empresas en cualquier momento.
              El cambio se refleja en tu siguiente ciclo de facturación.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 text-center shadow-xl">
          <h2 className="font-headline text-3xl md:text-4xl text-primary mb-4">
            ¿Listo para Tomar Mejores Decisiones Financieras?
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
            Únete a Raisket y accede a asesoría financiera independiente, transparente y diseñada para tu beneficio.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link href="/recommendations">Comenzar Gratis</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/about">Conocer Más Sobre Raisket</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
