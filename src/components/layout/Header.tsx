"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  Menu,
  CreditCard,
  Banknote,
  TrendingUp,
  Landmark,
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Shield
} from 'lucide-react';
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

// Icon mapping
const iconMap: { [key: string]: any } = {
  "credit-card": CreditCard,
  "banknote": Banknote,
  "trending-up": TrendingUp,
  "landmark": Landmark,
  "shield": Shield,
};

const menuData = [
  {
    label: "Tarjetas de Crédito",
    icon: "credit-card",
    featured: [
      { name: "Sin Anualidad", url: "/tarjetas/sin-anualidad" },
      { name: "Con Cashback", url: "/tarjetas/cashback" },
      { name: "Para Estudiantes", url: "/tarjetas/estudiantes" },
      { name: "Todas las tarjetas", url: "/tarjetas" }
    ]
  },
  {
    label: "Préstamos",
    icon: "banknote",
    featured: [
      { name: "Personales", url: "/prestamos/personales" },
      { name: "Rápidos / Apps", url: "/prestamos/rapidos" },
      { name: "Tasas Bajas", url: "/prestamos/tasas-bajas" }
    ]
  },
  {
    label: "Inversiones",
    icon: "trending-up",
    featured: [
      { name: "Cetes y Gobierno", url: "/inversiones/cetes" },
      { name: "Pagarés Bancarios", url: "/inversiones/pagares" },
      { name: "Bolsa / Fondos", url: "/inversiones/bolsa" }
    ]
  },
  {
    label: "Cuentas",
    icon: "landmark",
    featured: [
      { name: "Alto Rendimiento", url: "/cuentas/rendimiento" },
      { name: "Nómina", url: "/cuentas/nomina" },
      { name: "Digitales", url: "/cuentas/digitales" }
    ]
  }
];

export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State for mobile accordion
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (label: string) => {
    setOpenCategory(openCategory === label ? null : label);
  };

  return (
    <>
      <header className="bg-[#1A365D] shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white hover:text-[#00D9A5] transition-colors">Raisket</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {menuData.map((category) => {
                const Icon = iconMap[category.icon] || CreditCard;
                return (
                  <DropdownMenu key={category.label}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="flex items-center gap-1 text-[15px] font-medium text-white hover:text-[#00D9A5] transition-colors py-2 group"
                      >
                        {category.label}
                        <ChevronDown className="h-4 w-4 text-gray-300 group-hover:text-[#00D9A5] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[280px] p-2 bg-white border-gray-100 shadow-xl rounded-xl animate-in fade-in-0 zoom-in-95">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Explorar {category.label}
                      </div>
                      {category.featured.map((item) => (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link
                            href={item.url}
                            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 cursor-pointer group/item focus:bg-gray-50"
                          >
                            <span className="text-gray-700 font-medium group-hover/item:text-[#00D9A5] transition-colors">
                              {item.name}
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover/item:text-[#00D9A5] opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem asChild>
                        <Link
                          href={category.featured[category.featured.length - 1].url.split('/').slice(0, -1).join('/') || '#'}
                          className="flex items-center gap-2 w-full p-3 mt-1 border-t border-gray-50 text-[#00D9A5] font-medium hover:bg-[#00D9A5]/5 rounded-b-lg justify-center"
                        >
                          Ver todo en {category.label}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
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
                  <div className="flex items-center gap-3">
                    <Link href="/login" className="text-sm font-medium text-white hover:text-[#00D9A5]">
                      Log in
                    </Link>
                    <Link href="/register">
                      <Button className="bg-[#00D9A5] hover:bg-[#00C294] text-white font-bold px-6 rounded-full shadow-md hover:shadow-lg transition-all">
                        Únete
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Trigger */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 -mr-2">
                    <Menu className="h-7 w-7" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] p-0 bg-white border-r border-gray-100">
                  <div className="flex flex-col h-full">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                      <Link href="/" className="text-2xl font-bold text-[#1A365D]">Raisket</Link>
                      <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                    </div>

                    <div className="flex-1 overflow-y-auto py-2">
                      {menuData.map((category) => {
                        const Icon = iconMap[category.icon] || CreditCard;
                        const isOpen = openCategory === category.label;

                        return (
                          <div key={category.label} className="border-b border-gray-50 last:border-0">
                            <button
                              onClick={() => toggleCategory(category.label)}
                              className={cn(
                                "flex items-center justify-between w-full p-4 text-left transition-colors",
                                isOpen ? "bg-gray-50 text-[#00D9A5]" : "text-gray-700 hover:bg-gray-50"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className={cn("h-5 w-5", isOpen ? "text-[#00D9A5]" : "text-gray-400")} />
                                <span className="font-semibold text-[15px]">{category.label}</span>
                              </div>
                              <ChevronRight className={cn("h-5 w-5 text-gray-400 transition-transform duration-200", isOpen && "rotate-90 text-[#00D9A5]")} />
                            </button>

                            <div
                              className={cn(
                                "overflow-hidden transition-all duration-300 ease-in-out bg-gray-50/50",
                                isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                              )}
                            >
                              <div className="py-2 px-4 space-y-1">
                                {category.featured.map((item) => (
                                  <Link
                                    key={item.name}
                                    href={item.url}
                                    className="block py-2.5 pl-9 pr-4 text-sm font-medium text-gray-600 hover:text-[#00D9A5] rounded-lg hover:bg-white transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                                <Link
                                  href={category.featured[category.featured.length - 1].url.split('/').slice(0, -1).join('/') || '#'}
                                  className="block py-2.5 pl-9 pr-4 text-sm font-bold text-[#00D9A5] hover:underline"
                                >
                                  Ver todo en {category.label}
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-5 border-t border-gray-100 space-y-4 bg-gray-50/50">
                      {user ? (
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-white border border-gray-100 shadow-sm">
                          <div className="h-10 w-10 rounded-full bg-[#00D9A5]/10 flex items-center justify-center text-[#00D9A5] font-bold">
                            {user.email?.[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                            <p className="text-xs text-gray-500">Miembro</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <Link href="/login" className="w-full">
                            <Button variant="outline" className="w-full border-gray-200 hover:border-[#00D9A5] hover:text-[#00D9A5]">
                              Log in
                            </Button>
                          </Link>
                          <Link href="/register" className="w-full">
                            <Button className="w-full bg-[#00D9A5] hover:bg-[#00C294] text-white">
                              Únete
                            </Button>
                          </Link>
                        </div>
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
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white p-4 shadow-2xl animate-in slide-in-from-top-10 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="container mx-auto max-w-3xl">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#00D9A5] transition-colors" />
                  <input
                    type="text"
                    placeholder="Busca tarjetas, préstamos, inversiones..."
                    className="w-full pl-12 pr-4 py-4 text-lg bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-[#00D9A5] transition-all placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tendencias</p>
                <div className="flex flex-wrap gap-2">
                  {['Tarjeta sin anualidad', 'Mejores CETES', 'Préstamos rápidos', 'Cuenta de nómina'].map((term) => (
                    <button
                      key={term}
                      className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-[#00D9A5] hover:text-white transition-all duration-200 font-medium"
                      onClick={() => setSearchQuery(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
