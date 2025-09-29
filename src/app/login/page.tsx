"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthButton from '@/components/auth/AuthButton';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00d4aa]"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Bienvenido a Raisket
            </CardTitle>
            <CardDescription className="text-gray-600">
              Inicia sesión para acceder a productos financieros personalizados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AuthButton
              variant="outline"
              className="w-full h-12 text-base border-gray-300 hover:bg-gray-50 text-gray-700"
            />

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Al iniciar sesión, aceptas nuestros{' '}
                <Link href="/terms" className="text-[#00d4aa] hover:underline">
                  Términos de Servicio
                </Link>{' '}
                y{' '}
                <Link href="/privacy" className="text-[#00d4aa] hover:underline">
                  Política de Privacidad
                </Link>
              </p>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-[#00d4aa] transition-colors"
              >
                ← Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}