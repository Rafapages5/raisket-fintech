// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Briefcase, Users, Lightbulb, FileText, Scale, ShoppingCart } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/individuals/all', label: 'For Individuals', icon: Users },
  { href: '/businesses/all', label: 'For Businesses', icon: Briefcase },
  { href: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  { href: '/personalized-offer', label: 'Personalized Offer', icon: FileText },
  { href: '/compare', label: 'Compare Products', icon: Scale, special: true },
];

export default function Header() {
  const { compareItems } = useCompare();
  const pathname = usePathname();

  const NavLinks = ({isMobile = false}: {isMobile?: boolean}) => (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) || (item.href.endsWith('/all') && pathname.startsWith(item.href.replace('/all', '')));
        if (item.special && item.label === 'Compare Products') {
          return (
            <Link key={item.href} href={item.href} passHref legacyBehavior>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "justify-start w-full relative",
                  isMobile ? "text-base py-3" : "text-sm",
                  isActive && "font-semibold text-primary"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
                {compareItems.length > 0 && (
                  <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "justify-start w-full",
                isMobile ? "text-base py-3" : "text-sm",
                isActive && "font-semibold text-primary"
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
        <Link href="/" className="text-3xl font-headline font-bold text-primary hover:text-primary/80 transition-colors">
          Raisket
        </Link>
        <nav className="hidden md:flex space-x-2 items-center">
          <NavLinks />
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <div className="p-6 border-b">
                 <Link href="/" className="text-2xl font-headline font-bold text-primary">
                    Raisket
                  </Link>
              </div>
              <nav className="flex flex-col space-y-2 p-4">
                <NavLinks isMobile={true}/>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
