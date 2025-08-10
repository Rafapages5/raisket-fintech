// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Briefcase, Users, Lightbulb, FileText, Scale, ShoppingCart } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const elementosNavegacion = [
  { href: '/individuals/all', etiqueta: 'Para Personas', icono: Users },
  { href: '/businesses/all', etiqueta: 'Para Empresas', icono: Briefcase },
  { href: '/recommendations', etiqueta: 'Recomendaciones', icono: Lightbulb },
  { href: '/personalized-offer', etiqueta: 'Oferta Personalizada', icono: FileText },
  { href: '/compare', etiqueta: 'Comparar', icono: Scale, especial: true },
];

export default function Encabezado() {
  const { elementosComparar } = useCompare();
  const rutaActual = usePathname();

  const EnlacesNavegacion = ({esMobil = false}: {esMobil?: boolean}) => (
    <>
      {elementosNavegacion.map((elemento) => {
        const estaActivo = rutaActual === elemento.href || (elemento.href !== '/' && rutaActual.startsWith(elemento.href)) || (elemento.href.endsWith('/all') && rutaActual.startsWith(elemento.href.replace('/all', '')));
        if (elemento.especial && elemento.etiqueta === 'Comparar') {
          return (
            <Link key={elemento.href} href={elemento.href} passHref legacyBehavior>
              <Button
                variant="ghost"
                className={cn(
                  "relative text-white hover:text-[#00d4aa] hover:bg-white/10 transition-all duration-200",
                  esMobil ? "justify-start w-full text-base py-3" : "text-sm",
                  estaActivo && "text-[#00d4aa] bg-white/10 font-semibold"
                )}
                aria-current={estaActivo ? "page" : undefined}
              >
                <elemento.icono className="mr-2 h-4 w-4" />
                {elemento.etiqueta}
                {elementosComparar.length > 0 && (
                  <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 bg-[#00d4aa] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {elementosComparar.length}
                  </span>
                )}
              </Button>
            </Link>
          );
        }
        return (
          <Link key={elemento.href} href={elemento.href} passHref legacyBehavior>
            <Button
              variant="ghost"
              className={cn(
                "text-white hover:text-[#00d4aa] hover:bg-white/10 transition-all duration-200",
                esMobil ? "justify-start w-full text-base py-3" : "text-sm",
                estaActivo && "text-[#00d4aa] bg-white/10 font-semibold"
              )}
              aria-current={estaActivo ? "page" : undefined}
            >
              <elemento.icono className="mr-2 h-4 w-4" />
              {elemento.etiqueta}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="bg-[#1e293b] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-3xl font-headline font-bold text-white hover:text-[#00d4aa] transition-colors duration-200">
          Raisket
        </Link>
        <nav className="hidden md:flex space-x-2 items-center">
          <EnlacesNavegacion />
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:text-[#00d4aa] hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0 bg-[#1e293b] border-l-0">
              <div className="p-6 border-b border-white/10">
                 <Link href="/" className="text-2xl font-headline font-bold text-white">
                    Raisket
                  </Link>
              </div>
              <nav className="flex flex-col space-y-2 p-4">
                <EnlacesNavegacion esMobil={true}/>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
