import ProductDetailPage from '@/components/templates/ProductDetailPage';
import { Metadata } from 'next';
import { getProductBySlug } from '@/lib/financial-products';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: 'Producto no encontrado | Raisket',
        };
    }

    return {
        title: `${product.name} - Análisis, Opiniones y Beneficios 2025`,
        description: `Conoce todo sobre la ${product.name} de ${product.institution}. ${product.description?.slice(0, 120)}... Descubre si es para ti.`,
        alternates: {
            canonical: `/prestamos-personales/${slug}`,
        },
        openGraph: {
            title: `${product.name} - Opiniones y Análisis`,
            description: `Análisis completo de ${product.name}. Tasas, comisiones y beneficios explicados.`,
            images: product.institution_logo ? [product.institution_logo] : [],
        },
    };
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    return <ProductDetailPage category="personal_loan" slug={slug} />;
}
