import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Crear Cuenta | Raisket',
  description: 'Crea tu cuenta en Raisket para acceder a herramientas financieras personalizadas.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to home link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </Link>
        </div>

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary">
            Raisket
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Tu plataforma de productos financieros
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Additional info */}
        <div className="mt-6 text-center">
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-sm mb-2">¿Por qué crear una cuenta?</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Guarda tus productos favoritos</li>
              <li>• Compara múltiples productos</li>
              <li>• Recibe recomendaciones personalizadas</li>
              <li>• Deja reseñas y calificaciones</li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            Al registrarte, aceptas nuestros{' '}
            <Link href="/legal/terms" className="text-primary hover:underline">
              Términos de Servicio
            </Link>{' '}
            y{' '}
            <Link href="/legal/privacy" className="text-primary hover:underline">
              Política de Privacidad
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}