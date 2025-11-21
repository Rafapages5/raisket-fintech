// src/components/layout/HeaderNerdWallet.tsx
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  Search,
  CreditCard,
  Banknote,
  TrendingUp,
  Building2,
  ChevronDown,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const categories = [
  {
    name: 'Tarjetas de Crédito',
    href: '/tarjetas-credito',
    icon: CreditCard,
    description: 'Compara las mejores tarjetas',
  },
  {
    name: 'Préstamos Personales',
    href: '/prestamos-personales',
    icon: Banknote,
    description: 'Encuentra tu préstamo ideal',
  },
  {
    name: 'Inversiones',
    href: '/inversiones',
    icon: TrendingUp,
    description: 'CETES, fondos y más',
  },
  {
    name: 'Cuentas Bancarias',
    href: '/cuentas-bancarias',
    icon: Building2,
    description: 'Cuentas sin comisiones',
  },
];

export default function HeaderNerdWallet() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-[#1A365D] shadow-lg">
      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:text-[#00D9A5] transition-colors"
          >
            Raisket
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Products Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#00D9A5] hover:bg-white/10"
                >
                  Productos
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[400px] p-4 bg-white"
              >
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.href} asChild>
                      <Link
                        href={category.href}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <category.icon className="h-6 w-6 text-[#00D9A5] mt-0.5" />
                        <div>
                          <div className="font-medium text-[#1A365D]">
                            {category.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {category.description}
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Direct Links */}
            {categories.map((category) => (
              <Link key={category.href} href={category.href}>
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#00D9A5] hover:bg-white/10 text-sm"
                >
                  {category.name}
                </Button>
              </Link>
            ))}

            <Link href="/educacion">
              <Button
                variant="ghost"
                className="text-white hover:text-[#00D9A5] hover:bg-white/10 text-sm"
              >
                Educación
              </Button>
            </Link>
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

            {/* Login Button - Desktop */}
            <Link href="/login" className="hidden md:block">
              <Button
                variant="outline"
                className="border-[#00D9A5] text-[#00D9A5] hover:bg-[#00D9A5] hover:text-white"
              >
                Iniciar sesión
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-[#1A365D] border-none p-0"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="p-4 border-b border-white/10">
                    <Link href="/" className="text-xl font-bold text-white">
                      Raisket
                    </Link>
                  </div>

                  {/* Mobile Nav */}
                  <nav className="flex-1 p-4 space-y-2">
                    {categories.map((category) => (
                      <Link key={category.href} href={category.href}>
                        <div className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/10 transition-colors">
                          <category.icon className="h-5 w-5 text-[#00D9A5]" />
                          <span>{category.name}</span>
                        </div>
                      </Link>
                    ))}
                    <div className="pt-4 border-t border-white/10">
                      <Link href="/educacion">
                        <div className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/10">
                          Educación Financiera
                        </div>
                      </Link>
                    </div>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="p-4 border-t border-white/10">
                    <Link href="/login">
                      <Button className="w-full bg-[#00D9A5] hover:bg-[#00C294] text-white">
                        <User className="mr-2 h-4 w-4" />
                        Iniciar sesión
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsSearchOpen(false)}>
          <div
            className="bg-white p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Quick Links */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Búsquedas populares:</span>
                {['Tarjeta sin anualidad', 'CETES', 'Préstamo rápido', 'Cuenta con rendimiento'].map(
                  (term) => (
                    <button
                      key={term}
                      className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-[#00D9A5]/10 hover:text-[#00D9A5] transition-colors"
                      onClick={() => setSearchQuery(term)}
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
