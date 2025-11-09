// src/app/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, ArrowRight, XCircle as XCircleIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProducts } from '@/lib/products';
import ProductList from '@/components/products/ProductList';

export default async function HomePage() {
  // Get featured products from Supabase
  let featuredProducts: any[] = [];
  try {
    featuredProducts = await getFeaturedProducts(6);
  } catch (error) {
    console.error('Error loading featured products:', error);
  }

  return (
    <div className="space-y-12">
      <section className="text-center py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-background rounded-xl shadow-lg">
        <div className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold mb-6">
          🤖 Impulsado por Inteligencia Artificial
        </div>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
          El Primer Asesor Financiero<br />
          <span className="text-accent">Independiente</span> de México
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-4xl mx-auto mb-4">
          <strong>Raisket trabaja para ti, no para los bancos.</strong>
        </p>
        <p className="text-base md:text-lg text-foreground/70 max-w-3xl mx-auto mb-8">
          Sin conflictos de interés. Sin comisiones ocultas. Solo recomendaciones honestas basadas en tus necesidades reales, impulsadas por IA y la ética de los mejores asesores financieros independientes de México.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="#problema">Conoce el Problema <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/recommendations">Obtener Asesoría Gratuita</Link>
          </Button>
        </div>
        <p className="text-sm text-foreground/60">
          ✓ Comparador gratuito &nbsp;·&nbsp; ✓ Educación personalizada &nbsp;·&nbsp; ✓ Asesoría independiente
        </p>
      </section>

      <section id="problema" className="py-16 bg-destructive/5 rounded-xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-foreground mb-4">
              El Problema Financiero en México es Real
            </h2>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              Y nadie te lo dice con claridad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-xl text-destructive flex items-center gap-2">
                  <XCircleIcon className="h-6 w-6" />
                  Gasto Sin Control
                </CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/80">
                La gente gasta con crédito sin control, acumulando deudas que no pueden pagar. El promedio de mexicanos no entiende las tasas de interés ni las comisiones.
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-xl text-destructive flex items-center gap-2">
                  <XCircleIcon className="h-6 w-6" />
                  No Hay Ahorro
                </CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/80">
                Solo 1 de cada 4 mexicanos ahorra regularmente. La mayoría vive al día sin un plan financiero, sin conocer opciones como CETES, ETFs o fondos de inversión.
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-xl text-destructive flex items-center gap-2">
                  <XCircleIcon className="h-6 w-6" />
                  Desconocimiento Total
                </CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/80">
                Los bancos y fintechs no educan, solo venden. La gente desconoce a fondo lo que realmente ofrecen y terminan con productos que no les convienen.
              </CardContent>
            </Card>
          </div>

          <div className="bg-card rounded-lg p-8 shadow-lg border-2 border-accent/20">
            <h3 className="font-headline text-2xl md:text-3xl font-semibold text-primary mb-4 text-center">
              ⚠️ El Conflicto de Interés que Nadie Te Cuenta
            </h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl font-semibold text-destructive mb-3">Asesores Tradicionales y Bancos:</h4>
                <ul className="space-y-3 text-foreground/80">
                  <li className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                    <span>Solo te ofrecen los productos de <strong>su empresa</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                    <span>Ganan comisión por venderte, <strong>no por ayudarte</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                    <span>No les importa si realmente te benefician</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                    <span>Ocultan información sobre alternativas mejores</span>
                  </li>
                </ul>
              </div>
              <div className="bg-accent/10 rounded-lg p-6 border-2 border-accent">
                <h4 className="text-xl font-semibold text-accent mb-3">Raisket es Diferente:</h4>
                <ul className="space-y-3 text-foreground/80">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span><strong>Independiente:</strong> No vendemos productos de nadie</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span><strong>Transparente:</strong> Te mostramos TODAS las opciones del mercado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span><strong>Ético:</strong> Trabajamos para ti, no para los bancos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span><strong>Regulado:</strong> En proceso de registro ante la CNBV</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="segments" className="py-12">
        <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center text-foreground mb-10">
          Encuentra Productos Financieros Para...
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/individuals/all" className="group">
            <Card className="hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl text-primary group-hover:text-accent transition-colors">Personas</CardTitle>
                <CardDescription className="text-foreground/70">
                  Tarjetas de crédito personales, préstamos, inversiones y seguros para ayudarte a alcanzar tus metas financieras.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center mt-auto">
                 <Button variant="ghost" className="text-accent group-hover:underline">
                  Explorar Productos Personales <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/businesses/all" className="group">
            <Card className="hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl text-primary group-hover:text-accent transition-colors">Empresas</CardTitle>
                <CardDescription className="text-foreground/70">
                  Financiamiento empresarial, tarjetas corporativas, soluciones de inversión y seguros comerciales para hacer crecer y proteger tu empresa.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center mt-auto">
                <Button variant="ghost" className="text-accent group-hover:underline">
                  Descubrir Soluciones Empresariales <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      <section className="py-16 bg-card rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-4">
              Somos Tres Cosas en Una
            </h2>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              Tu solución financiera completa e independiente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <Card className="border-accent/30 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle className="text-2xl text-primary">1. Comparador Gratuito</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground/80">
                  <strong>Todos los productos financieros de México</strong> en un solo lugar:
                </p>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>Tarjetas de crédito y débito</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>Créditos personales y empresariales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>Inversiones y fondos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>Seguros de todo tipo</span>
                  </li>
                </ul>
                <p className="text-sm text-foreground/80 pt-2">
                  ✓ <strong>100% gratuito</strong> para consultar y comparar<br />
                  ✓ Regístrate con tu correo para dejar reseñas<br />
                  ✓ Calificaciones en tiempo real de usuarios reales
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/30 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">🎓</span>
                </div>
                <CardTitle className="text-2xl text-primary">2. Educación con IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground/80">
                  <strong>Personalizada según tu perfil:</strong>
                </p>
                <div className="space-y-3 text-sm">
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <p className="font-semibold text-foreground">👨‍💼 Emprendedor</p>
                    <p className="text-foreground/70">Usa deuda inteligentemente para crecer tu negocio</p>
                  </div>
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <p className="font-semibold text-foreground">💼 Profesionista</p>
                    <p className="text-foreground/70">Apalancamiento para certificaciones, posgrados y ROI</p>
                  </div>
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <p className="font-semibold text-foreground">🏢 Empresa</p>
                    <p className="text-foreground/70">Herramientas prácticas: flujos de efectivo, análisis financiero</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 pt-2">
                  Aprende sobre <strong>ETFs, fondos de inversión, PPR, cuentas productivas</strong> y cuándo conviene cada opción.
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/30 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">🤝</span>
                </div>
                <CardTitle className="text-2xl text-primary">3. Asesoría Integral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground/80">
                  <strong>Independiente y regulada:</strong>
                </p>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>Modelos de IA entrenados con la <strong>ética de los mejores asesores</strong> financieros independientes de México</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>En proceso de registro ante la <strong>CNBV</strong> como asesores financieros independientes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>Asesoría integral personalizada a tu medida</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>Sin sesgos hacia productos específicos</span>
                  </li>
                </ul>
                <div className="bg-accent/10 p-3 rounded-lg mt-4">
                  <p className="text-sm font-semibold text-foreground">💰 Modelo Transparente:</p>
                  <p className="text-xs text-foreground/70 mt-1">
                    Personas: $10 USD/mes<br />
                    Empresas: $15 USD/mes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-8 border-t border-border/50">
            <p className="text-xl font-semibold text-primary mb-4">
              Raisket es tu aliado financiero
            </p>
            <p className="text-foreground/80 max-w-2xl mx-auto mb-6">
              Te ayudamos a tomar decisiones informadas y a usar tu dinero para crear oportunidades reales.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/about">Conoce Más Sobre Nosotros</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10">
                <Link href="/pricing">Ver Precios</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-12">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center text-foreground mb-10">
            Productos Destacados
          </h2>
          <ProductList products={featuredProducts} />
          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline">
              <Link href="/individuals/all">Ver Todos los Productos <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

// Custom CheckCircleIcon for this page
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
