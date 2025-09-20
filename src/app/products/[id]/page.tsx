// src/app/products/[id]/page.tsx
import { getProductById } from '@/lib/products';
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
      title: 'Product Not Found | Raisket',
      description: 'The requested product could not be found.'
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  try {
    const product = await getProductById(params.id);

    if (!product) {
      notFound();
    }

    // For now, still using mock reviews - this could be expanded to use Supabase reviews
    const reviews = mockReviews.filter(r => r.productId === params.id);

    return <ProductDetailClient product={product} reviews={reviews} />;

  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}

// Note: We're not using generateStaticParams because we want dynamic routing
// If you want to pre-generate some popular products, you could uncomment and modify this:
// export async function generateStaticParams() {
//   try {
//     const featuredProducts = await getFeaturedProducts(20);
//     return featuredProducts.map(product => ({
//       id: product.id,
//     }));
//   } catch (error) {
//     console.error('Error generating static params:', error);
//     return [];
//   }
// }