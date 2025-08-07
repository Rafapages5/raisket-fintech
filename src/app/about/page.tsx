// src/app/about/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Target, Handshake } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Raisket - Tu Mercado Financiero",
  description: "Conoce más sobre la misión de Raisket de simplificar el descubrimiento de productos financieros para personas y empresas.",
};

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 md:py-16 bg-gradient-to-br from-primary/10 via-background to-background rounded-xl shadow-lg">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
          Sobre Raisket
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
          Te empoderamos para tomar decisiones financieras informadas con claridad y confianza.
        </p>
      </section>

      <section className="container mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary text-center">Nuestra Misión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg text-foreground/80 leading-relaxed">
            <p>
              En Raisket, creemos que encontrar los productos financieros adecuados no debería ser complicado. Nuestra misión es crear un mercado transparente y fácil de usar que conecte a personas y empresas con soluciones financieras personalizadas. Nos esforzamos por simplificar el proceso de descubrimiento, proporcionar comparaciones claras y aprovechar la tecnología para ofrecer recomendaciones personalizadas.
            </p>
            <p>
              Ya sea que estés buscando una tarjeta de crédito, necesites financiamiento para tu negocio, planees inversiones o asegures tu patrimonio, Raisket está diseñado para ser tu socio de confianza en cada paso del camino.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-headline text-3xl text-primary mb-6">Lo Que Hacemos</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Raisket sirve como una plataforma integral donde los usuarios pueden:
          </p>
          <ul className="space-y-3 text-foreground/80 list-disc list-inside">
            <li>Explorar una amplia gama de productos financieros categorizados para necesidades personales y empresariales.</li>
            <li>Comparar características, beneficios y términos de productos lado a lado.</li>
            <li>Leer reseñas y calificaciones genuinas de usuarios para obtener información valiosa.</li>
            <li>Recibir recomendaciones personalizadas impulsadas por IA basadas en sus perfiles financieros únicos.</li>
            <li>Encontrar ofertas personalizadas y conectarse con proveedores de productos financieros.</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <Image
            src="https://placehold.co/500x350.png"
            alt="Equipo trabajando en soluciones financieras"
            width={500}
            height={350}
            className="rounded-lg shadow-md"
            data-ai-hint="financial team collaboration"
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 bg-card rounded-xl shadow-lg">
        <h2 className="font-headline text-3xl text-primary text-center mb-10">Nuestros Valores Fundamentales</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
            <ShieldCheck className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-headline text-xl font-semibold text-primary mb-2">Confianza y Transparencia</h3>
            <p className="text-sm text-foreground/70">
              Priorizamos proporcionar información clara e imparcial para ayudarte a tomar decisiones con confianza.
            </p>
          </div>
          <div className="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
            <Target className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-headline text-xl font-semibold text-primary mb-2">Centrado en el Usuario</h3>
            <p className="text-sm text-foreground/70">
              Nuestra plataforma está diseñada pensando en tus necesidades, asegurando una experiencia intuitiva y útil.
            </p>
          </div>
          <div className="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
            <Handshake className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-headline text-xl font-semibold text-primary mb-2">Empoderamiento</h3>
            <p className="text-sm text-foreground/70">
              Nuestro objetivo es equiparte con las herramientas y el conocimiento para tomar control de tu futuro financiero.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
