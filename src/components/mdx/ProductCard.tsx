import { getProductBySlug } from '@/lib/financial-products';
import ProductCardNW from '@/components/products/ProductCardNW';
import { AlertTriangle } from 'lucide-react';

interface ProductCardProps {
    slug: string;
    variant?: 'default' | 'compact' | 'featured';
}

export async function ProductCard({ slug, variant = 'compact' }: ProductCardProps) {
    const product = await getProductBySlug(slug);

    if (!product) {
        return (
            <div className="my-6 p-4 border border-red-200 bg-red-50 rounded-lg flex items-center gap-3 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                <p>Producto no encontrado: <code className="text-xs bg-white px-1 py-0.5 rounded border border-red-100">{slug}</code></p>
            </div>
        );
    }

    return (
        <div className="my-8 not-prose">
            <ProductCardNW product={product} variant={variant} />
        </div>
    );
}
