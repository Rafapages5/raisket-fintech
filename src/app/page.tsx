// src/app/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 md:py-16 bg-gradient-to-br from-primary/10 via-background to-background rounded-xl shadow-lg">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
          Welcome to Raisket
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
          Your trusted marketplace for discovering financial products tailored to your unique needs. Whether you're an individual planning your future or a business aiming for growth, Raisket connects you with the right solutions.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="#segments">Explore Products <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/recommendations">Get Recommendations</Link>
          </Button>
        </div>
      </section>

      <section id="segments" className="py-12">
        <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center text-foreground mb-10">
          Find Financial Products For...
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/individuals/all" className="group">
            <Card className="hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl text-primary group-hover:text-accent transition-colors">Individuals</CardTitle>
                <CardDescription className="text-foreground/70">
                  Personal credit cards, loans, investments, and insurance to help you achieve your financial goals.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center mt-auto">
                 <Button variant="ghost" className="text-accent group-hover:underline">
                  Explore Personal Products <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/businesses/all" className="group">
            <Card className="hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl text-primary group-hover:text-accent transition-colors">Businesses</CardTitle>
                <CardDescription className="text-foreground/70">
                  Business financing, corporate cards, investment solutions, and commercial insurance to grow and protect your enterprise.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center mt-auto">
                <Button variant="ghost" className="text-accent group-hover:underline">
                  Discover Business Solutions <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      <section className="py-12 bg-card rounded-xl shadow-lg">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-4">
              Why Choose Raisket?
            </h2>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-accent mr-3 mt-1 shrink-0" />
                <span><strong>Tailored Solutions:</strong> Personalized recommendations and products for your specific financial profile.</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-accent mr-3 mt-1 shrink-0" />
                <span><strong>Transparent Comparisons:</strong> Easily compare features, rates, and reviews side-by-side.</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-accent mr-3 mt-1 shrink-0" />
                <span><strong>Trusted Providers:</strong> Access a curated selection of products from reputable financial institutions.</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-accent mr-3 mt-1 shrink-0" />
                <span><strong>User-Focused:</strong> An intuitive platform designed for easy navigation and informed decision-making.</span>
              </li>
            </ul>
            <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90">
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
          <div className="hidden md:block">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Financial planning" 
              width={600} 
              height={400} 
              className="rounded-lg shadow-md"
              data-ai-hint="financial planning meeting"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// Custom CheckCircleIcon for this page
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
