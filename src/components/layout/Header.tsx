// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  CreditCard,
  Banknote,
  TrendingUp,
  Building2,
  MessageCircle,
  BookOpen,
  LogIn,
  ChevronDown,
  Search,
  X,
  Calculator,
} from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from '@/components/auth/UserMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Categorías principales estilo NerdWallet
const categories = [
  { name: 'Tarjetas de Crédito', href: '/tarjetas-credito', icon: CreditCard, description: 'Compara las mejores tarjetas' },
  { name: 'Préstamos', href: '/prestamos-personales', icon: Banknote, description: 'Encuentra tu préstamo ideal' },
  { name: 'Inversiones', href: '/inversiones', icon: TrendingUp, description: 'CETES, fondos y más' },
  { name: 'Cuentas', href: '/cuentas-bancarias', icon: Building2, description: 'Cuentas sin comisiones' },
];

const calculators = [
  { name: 'Interés Compuesto', href: '/calculators/interes-compuesto', icon: TrendingUp, description: 'Calcula tus rendimientos' },
  { name: 'Préstamos', href: '/calculators/prestamos', icon: Banknote, description: 'Calcula tus pagos mensuales' },
  { name: 'Aguinaldo', href: '/calculators/aguinaldo', icon: Calculator, description: 'Calcula cuánto te corresponde' },
];

const navItems = [
  { href: '/chat', label: 'Asistente IA', icon: MessageCircle },
  { href: '/educacion', label: 'Educación', icon: BookOpen },
];

export default function Header() {
  const { compareItems } = useCompare();
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <header className="bg-[#1A365D] shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-white hover:text-[#00D9A5] transition-colors">
              Raisket
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* Best Products Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-[#00D9A5] hover:bg-white/10">
                    Mejores Productos <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[600px] p-6 bg-white">
                  {/* Guías populares */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Rankings y Comparativas</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <DropdownMenuItem asChild>
                        <Link href="/tarjetas-de-credito/mejores/sin-anualidad" className="flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-50 cursor-pointer text-sm">
                          <span className="text-emerald-600">→</span>
                          <span className="text-gray-700">Tarjetas sin anualidad</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/tarjetas-de-credito/mejores/cashback" className="flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-50 cursor-pointer text-sm">
                          <span className="text-emerald-600">→</span>
                          <span className="text-gray-700">Tarjetas con cashback</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/prestamos-personales/mejores/sin-aval" className="flex items-center gap-2 p-2 rounded-lg hover:bg-cyan-50 cursor-pointer text-sm">
                          <span className="text-cyan-600">→</span>
                          <span className="text-gray-700">Préstamos sin aval</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/prestamos-personales/mejores/aprobacion-rapida" className="flex items-center gap-2 p-2 rounded-lg hover:bg-cyan-50 cursor-pointer text-sm">
                          <span className="text-cyan-600">→</span>
                          <span className="text-gray-700">Préstamos rápidos</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/inversiones/mejores/bajo-riesgo" className="flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 cursor-pointer text-sm">
                          <span className="text-purple-600">→</span>
                          <span className="text-gray-700">Inversiones bajo riesgo</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/cuentas-bancarias/mejores/sin-comisiones" className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 cursor-pointer text-sm">
                          <span className="text-blue-600">→</span>
                          <span className="text-gray-700">Cuentas sin comisiones</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Calculators Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-[#00D9A5] hover:bg-white/10">
                    Calculadoras <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[300px] p-4 bg-white">
                  <div className="grid gap-2">
                    {calculators.map((calc) => (
                      <DropdownMenuItem key={calc.href} asChild>
                        <Link href={calc.href} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <calc.icon className="h-5 w-5 text-[#00D9A5] mt-0.5" />
                          <div>
                            <div className="font-medium text-[#1A365D]">{calc.name}</div>
                            <div className="text-xs text-gray-500">{calc.description}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Category Links */}
              {categories.map((category) => (
                <Link key={category.href} href={category.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "text-white hover:text-[#00D9A5] hover:bg-white/10 text-sm",
                      pathname.startsWith(category.href) && "text-[#00D9A5] bg-white/10"
                    )}
                  >
                    {category.name}
                  </Button>
                </Link>
              ))}

              {/* Other Nav Items */}
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "text-white hover:text-[#00D9A5] hover:bg-white/10 text-sm",
                      pathname.startsWith(item.href) && "text-[#00D9A5] bg-white/10"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-[#00D9A5] hover:bg-white/10"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Auth */}
              <div className="hidden md:block">
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                ) : user ? (
                  <UserMenu />
                ) : (
                  <Link href="/login">
                    <Button variant="outline" className="border-[#00D9A5] text-[#00D9A5] hover:bg-[#00D9A5] hover:text-white">
                      Iniciar sesión
                    </Button>
                  </Link>
                )}
              </div>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-[#1A365D] border-none p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-white/10">
                      <Link href="/" className="text-xl font-bold text-white">Raisket</Link>
                    </div>
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Rankings y Comparativas</h4>
                        <Link href="/tarjetas-de-credito/mejores/sin-anualidad">
                          <div className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/10">
                            <span className="text-[#00D9A5]">→</span>
                            <span>Tarjetas sin anualidad</span>
                          </div>
                        </Link>
                        <Link href="/tarjetas-de-credito/mejores/cashback">
                          <div className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/10">
                            <span className="text-[#00D9A5]">→</span>
                            <span>Tarjetas con cashback</span>
                          </div>
                        </Link>
                        <Link href="/prestamos-personales/mejores/sin-aval">
                          <div className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/10">
                            <span className="text-[#00D9A5]">→</span>
                            <span>Préstamos sin aval</span>
                          </div>
                        </Link>
                        <Link href="/prestamos-personales/mejores/aprobacion-rapida">
                          <div className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/10">
                            <span className="text-[#00D9A5]">→</span>
                            <span>Préstamos rápidos</span>
                          </div>
                        </Link>
                        <Link href="/inversiones/mejores/bajo-riesgo">
                          <div className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/10">
                            <span className="text-[#00D9A5]">→</span>
                            <span>Inversiones bajo riesgo</span>
                          </div>
                        </Link>
                        <Link href="/cuentas-bancarias/mejores/sin-comisiones">
                          <div className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/10">
                            <span className="text-[#00D9A5]">→</span>
                            <span>Cuentas sin comisiones</span>
                          </div>
                        </Link>
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Categorías</h4>
                        {categories.map((category) => (
                          <Link key={category.href} href={category.href}>
                            <div className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/10 transition-colors">
                              <category.icon className="h-5 w-5 text-[#00D9A5]" />
                              <span>{category.name}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Calculadoras</h4>
                        {calculators.map((calc) => (
                          <Link key={calc.href} href={calc.href}>
                            <div className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/10">
                              <calc.icon className="h-5 w-5 text-[#00D9A5]" />
                              <span>{calc.name}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        {navItems.map((item) => (
                          <Link key={item.href} href={item.href}>
                            <div className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/10">
                              <item.icon className="h-5 w-5 text-[#00D9A5]" />
                              <span>{item.label}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </nav>
                    <div className="p-4 border-t border-white/10">
                      {loading ? (
                        <div className="w-full h-10 rounded bg-white/10 animate-pulse" />
                      ) : user ? (
                        <UserMenu />
                      ) : (
                        <Link href="/login">
                          <Button className="w-full bg-[#00D9A5] hover:bg-[#00C294] text-white">
                            <LogIn className="mr-2 h-4 w-4" /> Iniciar sesión
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="container mx-auto">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar tarjetas, préstamos, inversiones..."
                    className="w-full pl-12 pr-4 py-3 text-lg border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D9A5] focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Búsquedas populares:</span>
                {['Tarjeta sin anualidad', 'CETES', 'Préstamo rápido', 'Cuenta con rendimiento'].map((term) => (
                  <button
                    key={term}
                    className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-[#00D9A5]/10 hover:text-[#00D9A5] transition-colors"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
