// src/components/layout/Footer.tsx
import { Copyright } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="bg-[
#1e293b] border-t border-border/50 text-center py-6 mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground flex items-center justify-center">
          <Copyright className="h-4 w-4 mr-1.5" /> {new Date().getFullYear()} Raisket. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Your trusted marketplace for financial products.
        </p>
      </div>
    </footer>
  );
}
