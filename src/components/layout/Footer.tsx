// src/components/layout/Footer.tsx
import { Copyright } from 'lucide-react';

export default function PieDePagina() {
  return (
    <footer className="bg-[#1e293b] border-t border-border/50 text-center py-6 mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground flex items-center justify-center">
          <Copyright className="h-4 w-4 mr-1.5" /> {new Date().getFullYear()} Raisket. Todos los derechos reservados.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Tu mercado de confianza para productos financieros.
        </p>
      </div>
    </footer>
  );
}
