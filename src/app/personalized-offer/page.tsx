// src/app/personalized-offer/page.tsx
"use client";

import { useState } from 'react';
import LeadGenerationForm from '@/components/forms/LeadGenerationForm';
import { generateLandingPageOffer, GenerateLandingPageOfferInput, GenerateLandingPageOfferOutput } from '@/ai/flows/generate-landing-page-prompt';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ExternalLink, Gift, Copy } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

export default function PersonalizedOfferPage() {
  const [offer, setOffer] = useState<GenerateLandingPageOfferOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: GenerateLandingPageOfferInput) => {
    setIsLoading(true);
    setError(null);
    setOffer(null);
    try {
      const result = await generateLandingPageOffer(data);
      setOffer(result);
    } catch (e) {
      console.error(e);
      setError("Failed to generate a personalized offer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReferralLink = () => {
    if (offer?.referralLink) {
      navigator.clipboard.writeText(offer.referralLink);
      toast({
        title: "Referral Link Copied!",
        description: "The offer link has been copied to your clipboard.",
      });
    }
  };
  
  const LoadingSkeleton = () => (
     <Card className="mt-8 shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-3/4" />
          </div>
           <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 w-full sm:w-1/2" />
            <Skeleton className="h-10 w-full sm:w-1/2" />
          </div>
        </CardContent>
      </Card>
  );

  return (
    <div className="space-y-8">
      <LeadGenerationForm onSubmit={handleSubmit} isLoading={isLoading} />

      {isLoading && <LoadingSkeleton />}

      {error && (
        <Alert variant="destructive" className="mt-8">
          <XCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {offer && !isLoading && (
        <Card className="mt-8 shadow-xl">
          <CardHeader>
             <div className="flex items-center space-x-3 mb-2">
              <Gift className="h-8 w-8 text-green-500" />
              <CardTitle className="font-headline text-2xl text-primary">Your Personalized Offer</CardTitle>
            </div>
            <CardDescription>We've found an offer that might be a great fit for you!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">Offer Details:</h3>
              <p className="text-foreground/80 whitespace-pre-line bg-muted/50 p-4 rounded-md">{offer.offerDetails}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">Referral Link:</h3>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                <Input type="text" value={offer.referralLink} readOnly className="flex-grow bg-muted/30" />
                <Button onClick={handleCopyReferralLink} variant="outline" className="shrink-0">
                  <Copy className="mr-2 h-4 w-4" /> Copy Link
                </Button>
              </div>
              <Button asChild className="w-full mt-3 bg-accent hover:bg-accent/90 text-accent-foreground sm:w-auto">
                <Link href={offer.referralLink} target="_blank" rel="noopener noreferrer">
                  Go to Offer <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This link will take you to the provider's website with referral information for tracking.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
