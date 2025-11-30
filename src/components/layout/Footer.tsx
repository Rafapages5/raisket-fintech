// src/components/layout/Footer.tsx
import { Copyright } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1e293b] border-t border-border/50 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-headline font-bold text-white mb-3">Raisket</h3>
            <p className="text-sm text-muted-foreground/80">
              El primer asesor financiero <strong className="text-[#00d4aa]">independiente</strong> de México impulsado por IA.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">
              Trabajamos para ti, no para los bancos.
            </p>
          </div>

          {/* Productos */}
          <div>
            <h4 className="text-white font-semibold mb-3">Productos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground/70 hover:text-[#00d4aa] transition-colors">
                  Para Personas
                </Link>
              </li>
              <li>
                <Link href="/empresas" className="text-muted-foreground/70 hover:text-[#00d4aa] transition-colors">
                  Para Empresas
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-muted-foreground/70 hover:text-[#00d4aa] transition-colors">
                  Comparador
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-white font-semibold mb-3">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground/70 hover:text-[#00d4aa] transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground/70 hover:text-[#00d4aa] transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/educacion" className="text-muted-foreground/70 hover:text-[#00d4aa] transition-colors">
                  Educación Financiera
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-white font-semibold mb-3">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground/70 hover:text-[#00d4aa] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-muted-foreground/70 hover:text-[#00d4aa] transition-colors">
                  Recomendaciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-muted-foreground/50 max-w-2xl mx-auto mb-4">
            Raisket puede recibir compensación de algunos enlaces de afiliados. Esto no afecta nuestras evaluaciones ni el orden de los productos. Nuestra prioridad es tu bienestar financiero.
          </p>
          <p className="text-sm text-muted-foreground/70 flex items-center justify-center mb-2">
            <Copyright className="h-4 w-4 mr-1.5" /> {new Date().getFullYear()} Raisket. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Asesoría financiera independiente y transparente. En proceso de registro ante la CNBV.
          </p>
        </div>
      </div>
    </footer>
  );
}
