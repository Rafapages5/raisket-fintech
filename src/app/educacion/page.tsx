// src/app/educacion/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, TrendingUp, Building2, Lightbulb, BookOpen, Calculator, PiggyBank, CreditCard, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Educación Financiera | Raisket - Aprende Finanzas Personalizadas con IA",
  description: "Educación financiera personalizada según tu perfil: emprendedor, profesionista o empresa. Aprende sobre ETFs, fondos, PPR, deuda inteligente y más.",
};

export default function EducacionPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-background rounded-xl shadow-lg">
        <div className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold mb-6">
          🎓 Educación Financiera con IA
        </div>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
          Aprende Finanzas<br />
          <span className="text-accent">Adaptadas a Ti</span>
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-4xl mx-auto mb-4">
          No todas las personas tienen las mismas necesidades financieras
        </p>
        <p className="text-base md:text-lg text-foreground/70 max-w-3xl mx-auto">
          Nuestra educación financiera se <strong>personaliza según tu perfil</strong>: emprendedor, profesionista o empresa.
          Aprende lo que realmente necesitas saber.
        </p>
      </section>

      {/* Profile Selector */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-4">
            Elige Tu Perfil
          </h2>
          <p className="text-lg text-foreground/70">
            Contenido diseñado específicamente para tus necesidades
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Emprendedor */}
          <Card className="border-2 border-accent/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="text-2xl text-primary">👨‍💼 Emprendedor</CardTitle>
              <CardDescription className="text-base">
                Haz crecer tu negocio con finanzas inteligentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground/70 text-center">
                Aprenderás a usar deuda inteligentemente para crecer, gestionar flujo de efectivo y tomar decisiones financieras estratégicas.
              </p>
              <Button asChild className="w-full bg-accent hover:bg-accent/90">
                <Link href="#emprendedor">Ver Contenido</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Profesionista */}
          <Card className="border-2 border-primary/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">💼 Profesionista</CardTitle>
              <CardDescription className="text-base">
                Invierte en ti y haz crecer tu patrimonio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground/70 text-center">
                Aprende a apalancarte para certificaciones y posgrados, calcular ROI de tu educación y construir riqueza a largo plazo.
              </p>
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="#profesionista">Ver Contenido</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Empresa */}
          <Card className="border-2 border-accent/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="text-2xl text-primary">🏢 Empresa</CardTitle>
              <CardDescription className="text-base">
                Herramientas para gestión financiera empresarial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground/70 text-center">
                Accede a templates de Excel, aprende análisis financiero, flujos de efectivo y estrategias de financiamiento.
              </p>
              <Button asChild className="w-full bg-accent hover:bg-accent/90">
                <Link href="#empresa">Ver Contenido</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Emprendedor Section */}
      <section id="emprendedor" className="py-16 bg-card rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-accent" />
            </div>
            <h2 className="font-headline text-3xl md:text-4xl text-primary mb-4">
              Educación para Emprendedores
            </h2>
            <p className="text-lg text-foreground/70">
              Usa tu dinero como herramienta de crecimiento, no como problema
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-accent" />
                  <CardTitle className="text-xl">Deuda Inteligente para Crecer</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/70">
                <p><strong>Aprende:</strong></p>
                <ul className="space-y-2 ml-4">
                  <li>• Cuándo es bueno endeudarse y cuándo no</li>
                  <li>• Cómo usar crédito para inventario, equipo o expansión</li>
                  <li>• Diferencia entre deuda productiva vs deuda mala</li>
                  <li>• Cálculo del costo real de financiamiento</li>
                  <li>• Estrategias para negociar mejores tasas</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-accent" />
                  <CardTitle className="text-xl">Flujo de Efectivo Práctico</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/70">
                <p><strong>Herramientas incluidas:</strong></p>
                <ul className="space-y-2 ml-4">
                  <li>• Template de Excel para flujo de efectivo mensual</li>
                  <li>• Cómo predecir necesidades de capital de trabajo</li>
                  <li>• Gestión de cuentas por cobrar y pagar</li>
                  <li>• Identificar cuellos de botella financieros</li>
                  <li>• Proyecciones simples pero efectivas</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-accent" />
                  <CardTitle className="text-xl">Inversión en tu Negocio</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/70">
                <p><strong>Toma decisiones basadas en números:</strong></p>
                <ul className="space-y-2 ml-4">
                  <li>• Cómo evaluar si vale la pena una inversión</li>
                  <li>• Cálculo de ROI esperado de proyectos</li>
                  <li>• Punto de equilibrio de nuevos productos</li>
                  <li>• Cuándo reinvertir utilidades vs repartir</li>
                  <li>• Diversificación de riesgos empresariales</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <PiggyBank className="h-6 w-6 text-accent" />
                  <CardTitle className="text-xl">Separación Persona-Negocio</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/70">
                <p><strong>Error común de emprendedores:</strong></p>
                <ul className="space-y-2 ml-4">
                  <li>• Por qué mezclar finanzas personales y de negocio mata empresas</li>
                  <li>• Cómo establecer un sueldo para ti</li>
                  <li>• Cuenta de ahorro de emergencia empresarial</li>
                  <li>• Proteger tu patrimonio personal</li>
                  <li>• Planeación fiscal básica</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Profesionista Section */}
      <section id="profesionista" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-headline text-3xl md:text-4xl text-primary mb-4">
              Educación para Profesionistas
            </h2>
            <p className="text-lg text-foreground/70">
              Invierte en tu carrera y construye riqueza a largo plazo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Apalancamiento para Educación</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/70">
                <p><strong>Invierte en ti mismo inteligentemente:</strong></p>
                <ul className="space-y-2 ml-4">
                  <li>• Cómo calcular el ROI real de un posgrado o certificación</li>
                  <li>• Cuándo vale la pena endeudarse por educación</li>
                  <li>• Comparar opciones de financiamiento educativo</li>
                  <li>• Estrategias para pagar deuda estudiantil rápido</li>
                  <li>• Valor presente neto de aumentos salariales esperados</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Inversiones para Principiantes</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/70">
                <p><strong>Comienza a construir riqueza:</strong></p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>CETES:</strong> Qué son y cómo invertir (lo más seguro en México)</li>
                  <li>• <strong>ETFs:</strong> Diversificación fácil y barata</li>
                  <li>• <strong>Fondos de inversión:</strong> Cuándo convienen vs ETFs</li>
                  <li>• <strong>PPR:</strong> Ahorro para el retiro con beneficios fiscales</li>
                  <li>• <strong>Cuentas productivas:</strong> Mejor que guardar en el banco</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Presupuesto Personal Efectivo</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/70">
                <p><strong>Toma control de tu dinero:</strong></p>
                <ul className="space-y-2 ml-4">
                  <li>• Método 50/30/20 adaptado a México</li>
                  <li>• Cómo rastrear gastos sin volverte loco</li>
                  <li>• Apps y herramientas recomendadas</li>
                  <li>• Fondo de emergencia: cuánto necesitas</li>
                  <li>• Automatización de ahorro e inversión</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Optimización de Deudas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/70">
                <p><strong>Sal de deudas rápido:</strong></p>
                <ul className="space-y-2 ml-4">
                  <li>• Método avalancha vs bola de nieve</li>
                  <li>• Cuándo vale la pena consolidar deudas</li>
                  <li>• Negociación con bancos: cómo hacerlo bien</li>
                  <li>• Evitar meses sin intereses que te cuestan más</li>
                  <li>• Uso estratégico de tarjetas de crédito</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Empresa Section */}
      <section id="empresa" className="py-16 bg-card rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-accent" />
            </div>
            <h2 className="font-headline text-3xl md:text-4xl text-primary mb-4">
              Educación para Empresas
            </h2>
            <p className="text-lg text-foreground/70">
              Herramientas prácticas para gestión financiera empresarial
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-accent" />
                  <CardTitle className="text-xl">Templates de Excel Empresariales</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/70">
                <p><strong>Herramientas descargables:</strong></p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Flujo de Efectivo:</strong> Proyección mensual y semanal</li>
                  <li>• <strong>P&L (Estado de Resultados):</strong> Ganancias y pérdidas</li>
                  <li>• <strong>Balance General:</strong> Activos, pasivos y capital</li>
                  <li>• <strong>Dashboard Financiero:</strong> KPIs en tiempo real</li>
                  <li>• <strong>Punto de Equilibrio:</strong> Cuánto necesitas vender</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-accent" />
                  <CardTitle className="text-xl">Análisis Financiero Práctico</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/70">
                <p><strong>Toma decisiones con datos:</strong></p>
                <ul className="space-y-2 ml-4">
                  <li>• Ratios financieros clave para tu industria</li>
                  <li>• Análisis de márgenes y rentabilidad</li>
                  <li>• Ciclo de conversión de efectivo</li>
                  <li>• Capital de trabajo: cómo optimizarlo</li>
                  <li>• Benchmarking contra competidores</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-accent" />
                  <CardTitle className="text-xl">Evaluación de Proyectos</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/70">
                <p><strong>Invierte en los proyectos correctos:</strong></p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>VPN (Valor Presente Neto):</strong> Vale la pena el proyecto?</li>
                  <li>• <strong>TIR (Tasa Interna de Retorno):</strong> Qué rendimiento esperar</li>
                  <li>• <strong>Periodo de recuperación:</strong> Cuándo recuperas la inversión</li>
                  <li>• Análisis de sensibilidad: qué pasa si...</li>
                  <li>• Decisiones de CAPEX vs OPEX</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-accent" />
                  <CardTitle className="text-xl">Financiamiento Empresarial</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/70">
                <p><strong>Opciones de financiamiento en México:</strong></p>
                <ul className="space-y-2 ml-4">
                  <li>• Crédito bancario tradicional vs fintech</li>
                  <li>• Factoraje: convierte cuentas por cobrar en efectivo</li>
                  <li>• Arrendamiento financiero vs compra</li>
                  <li>• Fondos de inversión y capital privado</li>
                  <li>• Programas gubernamentales (NAFIN, etc.)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Universal Topics */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl text-primary mb-4">
            Temas Universales para Todos
          </h2>
          <p className="text-lg text-foreground/70">
            Conocimiento esencial sin importar tu perfil
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-accent/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BookOpen className="h-10 w-10 text-accent mx-auto mb-3" />
              <CardTitle className="text-lg">Productos Financieros de México</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/70">
              Guía completa de todos los productos disponibles: ventajas, desventajas y cuándo conviene cada uno.
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <PiggyBank className="h-10 w-10 text-accent mx-auto mb-3" />
              <CardTitle className="text-lg">Educación sobre Inversión</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/70">
              Desde lo básico (CETES) hasta ETFs y fondos. Aprende a hacer que tu dinero trabaje para ti.
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Calculator className="h-10 w-10 text-accent mx-auto mb-3" />
              <CardTitle className="text-lg">Herramientas y Calculadoras</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/70">
              Calculadoras de ROI, interés compuesto, pago de deudas y más. Todo gratis.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 text-center shadow-xl">
          <h2 className="font-headline text-3xl md:text-4xl text-primary mb-4">
            ¿Listo para Aprender Finanzas de Verdad?
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
            Accede a contenido educativo gratuito o suscríbete para educación personalizada con IA según tu perfil y necesidades.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link href="/blog">Ver Contenido Gratis</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/pricing">Ver Planes de Educación</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
