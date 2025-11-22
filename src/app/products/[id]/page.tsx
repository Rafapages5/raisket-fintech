import { getProductById, getReviewsByProductId } from '@/lib/products';
import { mockReviews } from '@/data/reviews';
import type { FinancialProduct } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/products/ProductDetailClient';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  try {
    const product = await getProductById(params.id);

    if (!product) {
      return {
        title: 'Product Not Found | Raisket',
        description: 'The requested product could not be found.'
      };
    }

    return {
      title: `${product.name} | Raisket`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [product.imageUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | Raisket',
      description: 'An error occurred while loading the product.'
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductById(params.id);
  const reviews = await getReviewsByProductId(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} reviews={reviews} />;
}