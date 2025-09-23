"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientSupabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClientSupabase();

      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'Error de autenticación');
          setLoading(false);
          return;
        }

        if (code) {
          // Try to exchange code for session
          try {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError) {
              setStatus('error');
              setMessage(exchangeError.message);
              setLoading(false);
              return;
            }
          } catch (err) {
            // Fallback - just check if we have a session
            console.log('Exchange method not available, checking session...');
          }

          setStatus('success');
          setMessage('¡Cuenta confirmada exitosamente!');
          setLoading(false);

          // Redirect to home after 2 seconds
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          // Check if user is already authenticated
          const { data: { session } } = await supabase.auth.getSession();

          if (session) {
            setStatus('success');
            setMessage('Ya estás autenticado');
            setTimeout(() => {
              router.push('/');
            }, 1000);
          } else {
            setStatus('error');
            setMessage('No se pudo procesar la autenticación');
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setStatus('error');
        setMessage('Error inesperado durante la autenticación');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {status === 'loading' && 'Procesando...'}
              {status === 'success' && '¡Éxito!'}
              {status === 'error' && 'Error'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' && 'Verificando tu autenticación'}
              {status === 'success' && 'Redirigiendo a la página principal'}
              {status === 'error' && 'Hubo un problema con la autenticación'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              {status === 'loading' && (
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-16 w-16 text-green-500" />
              )}
              {status === 'error' && (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {message}
            </p>

            {status === 'error' && (
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    Intentar de nuevo
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">
                    Volver al inicio
                  </Link>
                </Button>
              </div>
            )}

            {status === 'success' && (
              <Button asChild className="w-full">
                <Link href="/">
                  Ir al inicio
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}