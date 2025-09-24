// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Briefcase, Users, Lightbulb, FileText, Scale, ShoppingCart, BookOpen, User, LogOut } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/individuals/all', label: 'Para Personas', icon: Users },
  { href: '/businesses/all', label: 'Para Empresas', icon: Briefcase },
  { href: '/recommendations', label: 'Recomendaciones', icon: Lightbulb },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/personalized-offer', label: 'Oferta Personalizada', icon: FileText },
  { href: '/compare', label: 'Comparar', icon: Scale, special: true },
];

export default function Header() {
  const { compareItems } = useCompare();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  const NavLinks = ({isMobile = false}: {isMobile?: boolean}) => (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) || (item.href.endsWith('/all') && pathname.startsWith(item.href.replace('/all', '')));
        if (item.special && item.label === 'Comparar') {
          return (
            <Link key={item.href} href={item.href} passHref legacyBehavior>
              <Button
                variant="ghost"
                className={cn(
                  "relative text-white hover:text-[#00d4aa] hover:bg-white/10 transition-all duration-200",
                  isMobile ? "justify-start w-full text-base py-3" : "text-sm",
                  isActive && "text-[#00d4aa] bg-white/10 font-semibold"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
                {compareItems.length > 0 && (
                  <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 bg-[#00d4aa] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {compareItems.length}
                  </span>
                )}
              </Button>
            </Link>
          );
        }
        return (
          <Link key={item.href} href={item.href} passHref legacyBehavior>
            <Button
              variant="ghost"
              className={cn(
                "text-white hover:text-[#00d4aa] hover:bg-white/10 transition-all duration-200",
                isMobile ? "justify-start w-full text-base py-3" : "text-sm",
                isActive && "text-[#00d4aa] bg-white/10 font-semibold"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="bg-[#1e293b] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-3xl font-headline font-bold text-white hover:text-[#00d4aa] transition-colors duration-200">
          Raisket
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex space-x-2 items-center">
            <NavLinks />
          </nav>

          {loading ? (
            <div className="animate-pulse bg-white/20 rounded-full h-8 w-20"></div>
          ) : user ? (
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">
                {user.user_metadata?.full_name || user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-white hover:text-[#00d4aa] hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild variant="default" size="sm" className="bg-[#00d4aa] hover:bg-[#00c49a] text-white">
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Link>
            </Button>
          )}
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:text-[#00d4aa] hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0 bg-[#1e293b] border-l-0">
              <div className="p-6 border-b border-white/10">
                 <Link href="/" className="text-2xl font-headline font-bold text-white">
                    Raisket
                  </Link>
              </div>
              <nav className="flex flex-col space-y-2 p-4">
                <NavLinks isMobile={true}/>

                <div className="border-t border-white/10 mt-4 pt-4">
                  {loading ? (
                    <div className="animate-pulse bg-white/20 rounded h-8"></div>
                  ) : user ? (
                    <div className="space-y-2">
                      <div className="text-white text-sm px-3 py-2">
                        {user.user_metadata?.full_name || user.email}
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:text-[#00d4aa] hover:bg-white/10"
                        onClick={signOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                      </Button>
                    </div>
                  ) : (
                    <Button asChild variant="default" className="w-full bg-[#00d4aa] hover:bg-[#00c49a] text-white">
                      <Link href="/login">
                        <User className="mr-2 h-4 w-4" />
                        Iniciar Sesión
                      </Link>
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
