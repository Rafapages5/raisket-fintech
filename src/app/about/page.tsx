// src/app/about/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Target, Handshake } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Raisket | Your Financial Marketplace",
  description: "Learn more about Raisket's mission to simplify financial product discovery for individuals and businesses.",
};

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 md:py-16 bg-gradient-to-br from-primary/10 via-background to-background rounded-xl shadow-lg">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
          About Raisket
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
          Empowering you to make informed financial decisions with clarity and confidence.
        </p>
      </section>

      <section className="container mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary text-center">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg text-foreground/80 leading-relaxed">
            <p>
              At Raisket, we believe that finding the right financial products shouldn't be complicated. Our mission is to create a transparent and user-friendly marketplace that connects individuals and businesses with tailored financial solutions. We strive to simplify the discovery process, provide clear comparisons, and leverage technology to offer personalized recommendations.
            </p>
            <p>
              Whether you're looking for a credit card, seeking financing for your business, planning investments, or securing insurance, Raisket is designed to be your trusted partner every step of the way.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-headline text-3xl text-primary mb-6">What We Do</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Raisket serves as a comprehensive platform where users can:
          </p>
          <ul className="space-y-3 text-foreground/80 list-disc list-inside">
            <li>Explore a wide range of financial products categorized for individual and business needs.</li>
            <li>Compare product features, benefits, and terms side-by-side.</li>
            <li>Read genuine user reviews and ratings to gain insights.</li>
            <li>Receive AI-powered personalized recommendations based on their unique financial profiles.</li>
            <li>Find tailored offers and connect with financial product providers.</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <Image
            src="https://placehold.co/500x350.png"
            alt="Team working on financial solutions"
            width={500}
            height={350}
            className="rounded-lg shadow-md"
            data-ai-hint="financial team collaboration"
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 bg-card rounded-xl shadow-lg">
        <h2 className="font-headline text-3xl text-primary text-center mb-10">Our Core Values</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
            <ShieldCheck className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-headline text-xl font-semibold text-primary mb-2">Trust & Transparency</h3>
            <p className="text-sm text-foreground/70">
              We prioritize providing clear, unbiased information to help you make confident choices.
            </p>
          </div>
          <div className="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
            <Target className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-headline text-xl font-semibold text-primary mb-2">User-Centricity</h3>
            <p className="text-sm text-foreground/70">
              Our platform is designed with your needs in mind, ensuring an intuitive and helpful experience.
            </p>
          </div>
          <div className="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
            <Handshake className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-headline text-xl font-semibold text-primary mb-2">Empowerment</h3>
            <p className="text-sm text-foreground/70">
              We aim to equip you with the tools and knowledge to take control of your financial future.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
