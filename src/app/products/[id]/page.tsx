// src/app/products/[id]/page.tsx
"use client"; // Required for useCompare hook and potential client-side interactions

import { ProductsAPI } from '@/lib/api/products';
import { mockReviews } from '@/data/reviews';
import { useEffect, useState } from 'react';
import type { FinancialProduct } from '@/types';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import { Star, Tag, Users, Briefcase, Info, Share2, PlusCircle, MinusCircle, Check, ExternalLink, Copy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useCompare } from '@/contexts/CompareContext';
import { useToast } from '@/hooks/use-toast';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';


// This function would ideally be used for metadata generation in a server component context
// For client components, metadata is typically handled in layout.tsx or parent server components
// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const product = mockProducts.find(p => p.id === params.id);
//   if (!product) {
//     return { title: 'Product Not Found | Raisket' };
//   }
//   return {
//     title: `${product.name} | Raisket`,
//     description: product.description,
//   };
// }

export default function ProductDetailPage({ params }: { params: { id:string } }) {
  const [product, setProduct] = useState<FinancialProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const reviews = mockReviews.filter(r => r.productId === params.id);
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const fetchedProduct = await ProductsAPI.getById(params.id);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }

  if (!product) {
    notFound();
  }

  const isComparing = isInCompare(product.id);

  const handleCompareClick = () => {
    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Product link copied to clipboard.",
    });
  };
  
  const averageRating = product.averageRating || 0;

  return (
    <div className="space-y-8 lg:space-y-12">
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="p-0 relative">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover"
                priority
                data-ai-hint={product.aiHint || product.category.toLowerCase()}
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <Badge variant="secondary" className="text-sm py-1 px-3 bg-opacity-80 backdrop-blur-sm">
                  {product.segment === 'Personas' ? <Users className="h-4 w-4 mr-1.5" /> : <Briefcase className="h-4 w-4 mr-1.5" />}
                  {product.segment}
                </Badge>
                <Badge variant="default" className="text-sm py-1 px-3 bg-accent text-accent-foreground bg-opacity-90 backdrop-blur-sm">
                  <Tag className="h-4 w-4 mr-1.5" />
                  {product.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{product.tagline}</p>
              <div className="flex items-center mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-muted-foreground">{averageRating.toFixed(1)} ({product.reviewCount} reviews)</span>
              </div>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line mb-6">{product.longDescription || product.description}</p>
              
              {product.provider && (
                <p className="text-sm text-muted-foreground">Provider: <span className="font-semibold text-foreground">{product.provider}</span></p>
              )}
            </CardContent>
          </Card>

          {(product.features?.length > 0 || product.benefits?.length > 0) && (
             <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Features & Benefits</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                {product.features?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">Key Features</h3>
                    <ul className="list-disc list-inside space-y-1 text-foreground/80">
                      {product.features.map((feature, index) => (
                        <li key={`feature-${index}`} className="flex items-start">
                          <Check className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0"/> <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.benefits?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">Key Benefits</h3>
                    <ul className="list-disc list-inside space-y-1 text-foreground/80">
                      {product.benefits.map((benefit, index) => (
                         <li key={`benefit-${index}`} className="flex items-start">
                           <Check className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0"/> <span>{benefit}</span>
                         </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {product.detailsUrl && product.detailsUrl !== '#' && (
                 <Button size="lg" className="w-full bg-primary hover:bg-primary/90" asChild>
                  <Link href={product.detailsUrl} target="_blank" rel="noopener noreferrer">
                    Visit Provider <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" className="w-full" onClick={handleCompareClick}>
                {isComparing ? <MinusCircle className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {isComparing ? 'Remove from Compare' : 'Add to Compare'}
              </Button>
              <Button size="lg" variant="outline" className="w-full" onClick={handleShare}>
                <Copy className="mr-2 h-4 w-4" /> Share Product
              </Button>
            </CardContent>
          </Card>
          
          {(product.interestRate || product.loanTerm || product.fees || product.eligibility?.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">Product Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {product.interestRate && <p><strong>Interest Rate:</strong> {product.interestRate}</p>}
                {product.loanTerm && <p><strong>Term:</strong> {product.loanTerm}</p>}
                {product.maxLoanAmount && <p><strong>Max Amount:</strong> {product.maxLoanAmount}</p>}
                {product.coverageAmount && <p><strong>Coverage:</strong> {product.coverageAmount}</p>}
                {product.minInvestment && <p><strong>Min. Investment:</strong> {product.minInvestment}</p>}
                {product.fees && <p><strong>Fees:</strong> {product.fees}</p>}
                {product.eligibility && product.eligibility.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-1">Eligibility:</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-foreground/80">
                      {product.eligibility.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Separator />

      <div>
        <h2 className="font-headline text-2xl md:text-3xl font-semibold text-primary mb-6">Customer Reviews</h2>
        <div className="grid md:grid-cols-2 gap-6">
            <ReviewList reviews={reviews} />
            <ReviewForm productId={product.id} />
        </div>
      </div>
    </div>
  );
}

// Fallback for static generation if a product ID is not found
// export async function generateStaticParams() {
//   return mockProducts.map(product => ({
//     id: product.id,
//   }));
// }
