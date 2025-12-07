import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, CheckCircle2, Info, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    getProductBySlug,
    categoryLabels,
    ProductCategory
} from '@/lib/financial-products';
import SchemaScript from '@/lib/schema/SchemaScript';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/schema/generators';

// Forzar renderizado dinámico ya que depende de slug
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface PageProps {
    params: {
        category: string;
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const product = await getProductBySlug(params.slug);

    if (!product) {
        return {
            title: 'Producto no encontrado | Raisket',
        };
    }

    return {
        title: `${product.name} - Análisis, Opiniones y Beneficios 2025`,
        description: `Conoce todo sobre la ${product.name} de ${product.institution}. ${product.description?.slice(0, 120)}... Descubre si es para ti.`,
        alternates: {
            canonical: `/productos/${params.category}/${params.slug}`,
        },
        openGraph: {
            title: `${product.name} - Opiniones y Análisis`,
            description: `Análisis completo de ${product.name}. Tasas, comisiones y beneficios explicados.`,
            images: product.institution_logo ? [product.institution_logo] : [],
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    // Validar categoría (opcional, pero buena práctica)
    const validCategories = Object.keys(categoryLabels);
    if (!validCategories.includes(params.category)) {
        notFound();
    }

    const product = await getProductBySlug(params.slug);

    if (!product) {
        notFound();
    }

    // Generar Schemas
    const productSchema = generateProductSchema(product);
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Inicio', url: 'https://raisket.mx' },
        { name: categoryLabels[product.category], url: `https://raisket.mx/comparadores/${params.category === 'credit_card' ? 'tarjetas-credito' : params.category === 'personal_loan' ? 'prestamos-personales' : params.category === 'investment' ? 'inversiones' : 'cuentas-bancarias'}` },
        { name: product.name },
    ]);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <SchemaScript schema={[productSchema, breadcrumbSchema]} />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center text-sm text-[#64748B] flex-wrap">
                        <Link href="/" className="hover:text-[#00D9A5]">Inicio</Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <Link
                            href={`/comparadores/${product.category === 'credit_card' ? 'tarjetas-credito' :
                                    product.category === 'personal_loan' ? 'prestamos-personales' :
                                        product.category === 'investment' ? 'inversiones' :
                                            'cuentas-bancarias'
                                }`}
                            className="hover:text-[#00D9A5]"
                        >
                            {categoryLabels[product.category]}
                        </Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <span className="text-[#1A365D] font-medium truncate max-w-[200px]">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Header / Hero */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-full md:w-48 flex-shrink-0 flex justify-center">
                                    {product.institution_logo ? (
                                        <div className="relative w-40 h-24 md:w-48 md:h-32">
                                            {/* Note area for image: using standard img for simplicity if remote patterns not set, 
                           but prefer Next Image if possible. Assuming logo is a URL.
                        */}
                                            <img
                                                src={product.institution_logo}
                                                alt={`Logo ${product.institution}`}
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                            Sin Logo
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                            {categoryLabels[product.category]}
                                        </Badge>
                                        {product.is_featured && (
                                            <Badge className="bg-[#F59E0B] hover:bg-[#D97706]">Recomendado</Badge>
                                        )}
                                    </div>

                                    <h1 className="text-3xl md:text-4xl font-bold text-[#1A365D] mb-2">
                                        {product.name}
                                    </h1>
                                    <p className="text-lg text-[#64748B] mb-4">
                                        de {product.institution}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-[#64748B] mb-6">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-[#F59E0B] fill-current" />
                                            <span className="font-medium text-[#1A365D]">{product.rating}</span>
                                            <span>({product.review_count} reseñas)</span>
                                        </div>
                                        {product.main_rate_value && (
                                            <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                                                {product.main_rate_label}: {product.main_rate_value}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {product.apply_url && (
                                            <a href={product.apply_url} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                                                <Button size="lg" className="w-full bg-[#00D9A5] hover:bg-[#00C294] text-white font-bold h-12">
                                                    Solicitar ahora <ExternalLink className="ml-2 h-4 w-4" />
                                                </Button>
                                            </a>
                                        )}
                                        {/* Boton secundario o mas info si existiera */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description & Details */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-6">
                                <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                                    <h2 className="text-xl font-bold text-[#1A365D] mb-4">Análisis del Producto</h2>
                                    <div className="prose prose-slate max-w-none text-[#334155]">
                                        <p>{product.description || 'No hay descripción disponible para este producto.'}</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                                    <h2 className="text-xl font-bold text-[#1A365D] mb-4">Beneficios Principales</h2>
                                    <ul className="space-y-3">
                                        {product.benefits.length > 0 ? product.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-[#00D9A5] mt-0.5 flex-shrink-0" />
                                                <span className="text-[#334155]">{benefit}</span>
                                            </li>
                                        )) : (
                                            <p className="text-gray-500 italic">No se han listado beneficios específicos.</p>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="md:col-span-1 space-y-6">
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="font-semibold text-[#1A365D] mb-4 flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        Detalles Rápidos
                                    </h3>
                                    <div className="space-y-4 text-sm">
                                        {product.meta_data.annuity !== undefined && (
                                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                                <span className="text-gray-500">Anualidad</span>
                                                <span className="font-medium text-gray-900">
                                                    {typeof product.meta_data.annuity === 'number'
                                                        ? `$${product.meta_data.annuity}`
                                                        : product.meta_data.annuity}
                                                </span>
                                            </div>
                                        )}
                                        {product.meta_data.opening_fee !== undefined && (
                                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                                <span className="text-gray-500">Apertura</span>
                                                <span className="font-medium text-gray-900">{product.meta_data.opening_fee}</span>
                                            </div>
                                        )}
                                        {product.meta_data.min_income !== undefined && (
                                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                                <span className="text-gray-500">Ingreso Mín.</span>
                                                <span className="font-medium text-gray-900">${product.meta_data.min_income}</span>
                                            </div>
                                        )}
                                        <div className="pt-2">
                                            <span className="text-xs text-gray-400 block mb-1">Categoría</span>
                                            <Badge variant="outline">{categoryLabels[product.category]}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
