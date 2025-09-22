"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar si ya está autenticado en localStorage
    const authStatus = localStorage.getItem('adminAuthenticated');
    const authTime = localStorage.getItem('adminAuthTime');

    // Verificar si la sesión no ha expirado (24 horas)
    if (authStatus === 'true' && authTime) {
      const timeDiff = Date.now() - parseInt(authTime);
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (timeDiff < twentyFourHours) {
        setIsAuthenticated(true);
      } else {
        // Sesión expirada
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthTime');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminAuthTime', Date.now().toString());
        toast({
          title: "Acceso concedido",
          description: "Bienvenido al panel de administración",
        });
      } else {
        toast({
          title: "Acceso denegado",
          description: data.error || "Contraseña incorrecta",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminAuthTime');
    setPassword('');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Panel de Administración</CardTitle>
            <CardDescription>
              Ingresa la contraseña para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Ingresar
              </Button>
            </form>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Desarrollo:</strong> Contraseña por defecto: admin123
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Panel de Administración</h1>
          <Button onClick={handleLogout} variant="outline">
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Contenido */}
      <main className="container mx-auto px-4">
        {children}
      </main>
    </div>
  );
}