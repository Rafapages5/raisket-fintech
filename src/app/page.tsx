// src/app/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 md:py-16 bg-gradient-to-br from-primary/10 via-background to-background rounded-xl shadow-lg">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
          Bienvenido a Raisket
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
          Tu mercado de confianza para descubrir productos financieros adaptados a tus necesidades únicas. Ya seas un individuo planeando tu futuro o una empresa buscando crecer, Raisket te conecta con las soluciones correctas.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="#segments">Explorar Productos <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/recommendations">Obtener Recomendaciones</Link>
          </Button>
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

      <section className="py-12 bg-card rounded-xl shadow-lg">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-4">
              ¿Por qué elegir Raisket?
            </h2>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-accent mr-3 mt-1 shrink-0" />
                <span><strong>Soluciones Personalizadas:</strong> Recomendaciones y productos personalizados para tu perfil financiero específico.</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-accent mr-3 mt-1 shrink-0" />
                <span><strong>Comparaciones Transparentes:</strong> Compara fácilmente características, tasas y reseñas lado a lado.</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-accent mr-3 mt-1 shrink-0" />
                <span><strong>Proveedores Confiables:</strong> Accede a una selección curada de productos de instituciones financieras de renombre.</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-accent mr-3 mt-1 shrink-0" />
                <span><strong>Enfoque en el Usuario:</strong> Una plataforma intuitiva diseñada para navegación fácil y toma de decisiones informadas.</span>
              </li>
            </ul>
            <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90">
              <Link href="/about">Conoce Más Sobre Nosotros</Link>
            </Button>
          </div>
          <div className="hidden md:block">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Planificación financiera" 
              width={600} 
              height={400} 
              className="rounded-lg shadow-md"
              data-ai-hint="financial planning meeting"
            />
          </div>
        </div>
      </section>
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
