import Link from 'next/link';
import { getFinancialProducts, ProductCategory, getCategorySlug } from '@/lib/financial-products';
import { Check, X } from 'lucide-react';

interface ProductComparisonTableProps {
    category: ProductCategory;
    limit?: number;
    highlight_products?: string[]; // comma separated slugs
}

export async function ProductComparisonTable({ category, limit = 5, highlight_products }: ProductComparisonTableProps) {
    const products = await getFinancialProducts({ category, limit, orderBy: 'rating' });
    const categorySlug = getCategorySlug(category);

    return (
        <div className="my-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm not-prose">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-900">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Producto</th>
                            <th className="px-4 py-3 font-semibold">Tasa / CAT</th>
                            <th className="px-4 py-3 font-semibold">Beneficios</th>
                            <th className="px-4 py-3 font-semibold text-center">Calificación</th>
                            <th className="px-4 py-3 font-semibold"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50">
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        {product.institution_logo && (
                                            <img src={product.institution_logo} alt={product.institution} className="h-8 w-8 object-contain rounded" />
                                        )}
                                        <div>
                                            <div className="font-semibold text-gray-900">{product.name}</div>
                                            <div className="text-xs text-gray-500">{product.institution}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="font-medium text-gray-900">
                                        {product.main_rate_value || 'N/A'}
                                    </div>
                                    <div className="text-xs text-gray-500">{product.main_rate_label}</div>
                                </td>
                                <td className="px-4 py-4 max-w-xs">
                                    <ul className="space-y-1">
                                        {product.benefits.slice(0, 2).map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                                                <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                        ★ {product.rating}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <Link
                                        href={`/${categorySlug}/${product.slug}`}
                                        className="text-[#00D9A5] hover:text-[#00C294] font-medium text-xs hover:underline"
                                    >
                                        Ver detalles
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
