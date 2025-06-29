// src/app/recommendations/page.tsx
"use client";

import { useState } from 'react';
import RecommendationForm from '@/components/forms/RecommendationForm';
import { generateFinancialProductRecommendations, FinancialProfile, FinancialProductRecommendations } from '@/ai/flows/generate-financial-product-recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, XCircle, ShoppingBag, Briefcase, BarChart3, ShieldCheck, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<FinancialProductRecommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FinancialProfile) => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const result = await generateFinancialProductRecommendations(data);
      setRecommendations(result);
    } catch (e) {
      console.error(e);
      setError("Failed to generate recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const ProductList = ({ title, products, icon: Icon }: { title: string; products: string[] | undefined; icon: React.ElementType }) => {
    if (!products || products.length === 0) {
      return null;
    }
    return (
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center space-x-3 pb-3">
          <Icon className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl font-semibold text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-foreground/80">
            {products.map((product, index) => (
              <li key={index}>{product}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };
  
  const LoadingSkeleton = () => (
    <div className="space-y-6 mt-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center space-x-3 pb-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );


  return (
    <div className="space-y-8">
      <RecommendationForm onSubmit={handleSubmit} isLoading={isLoading} />

      {isLoading && <LoadingSkeleton />}

      {error && (
        <Alert variant="destructive" className="mt-8">
          <XCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendations && !isLoading && (
        <Card className="mt-8 shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <CardTitle className="font-headline text-2xl text-primary">Your Personalized Recommendations</CardTitle>
            </div>
            <CardDescription>Based on your profile, here are some financial products that might suit your needs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <ProductList title="Credit Products" products={recommendations.creditProducts} icon={ShoppingBag} />
              <ProductList title="Financing Products" products={recommendations.financingProducts} icon={Briefcase}/>
              <ProductList title="Investment Products" products={recommendations.investmentProducts} icon={BarChart3} />
              <ProductList title="Insurance Products" products={recommendations.insuranceProducts} icon={ShieldCheck}/>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-primary mb-3 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2"/> AI Reasoning
              </h3>
              <p className="text-foreground/80 whitespace-pre-line bg-muted/50 p-4 rounded-md">{recommendations.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
