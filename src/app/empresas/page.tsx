import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, CreditCard, Banknote, Landmark, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getFinancialProducts } from '@/lib/financial-products';
import ProductCardNW from '@/components/products/ProductCardNW';

export const metadata: Metadata = {
    title: 'Soluciones Financieras para Empresas | Raisket',
    description: 'Encuentra las mejores tarjetas de crédito empresariales, préstamos PyME y cuentas de negocios. Compara y elige la mejor opción para tu empresa.',
};

export const revalidate = 3600;

export default async function BusinessPage() {
    const businessProducts = await getFinancialProducts({
        target_audience: 'business',
        limit: 10
    });

    const creditCards = businessProducts.filter(p => p.category === 'credit_card');
    const loans = businessProducts.filter(p => p.category === 'personal_loan'); // Assuming loans map here for now
    const accounts = businessProducts.filter(p => p.category === 'banking');

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-[#1A365D] text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
                            <Briefcase className="h-5 w-5 text-[#00D9A5]" />
                            <span className="font-medium text-[#00D9A5]">Raisket Empresas</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Impulsa tu negocio con las mejores herramientas financieras
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Compara tarjetas corporativas, créditos PyME y cuentas empresariales.
                            Encuentra la liquidez y el control que tu empresa necesita.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 space-y-16">

                {/* Business Credit Cards */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <CreditCard className="h-6 w-6 text-blue-700" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Tarjetas Empresariales</h2>
                        </div>
                        <Link href="/empresas/tarjetas" className="text-[#00D9A5] font-medium hover:underline flex items-center gap-1">
                            Ver todas <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {creditCards.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {creditCards.slice(0, 3).map(product => (
                                <ProductCardNW key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                            <p className="text-gray-500">Próximamente agregaremos tarjetas empresariales.</p>
                        </div>
                    )}
                </section>

                {/* Business Loans */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Banknote className="h-6 w-6 text-green-700" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Crédito PyME</h2>
                        </div>
                        <Link href="/empresas/credito-pyme" className="text-[#00D9A5] font-medium hover:underline flex items-center gap-1">
                            Ver todos <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {loans.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loans.slice(0, 3).map(product => (
                                <ProductCardNW key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                            <p className="text-gray-500">Próximamente agregaremos créditos PyME.</p>
                        </div>
                    )}
                </section>

                {/* Business Accounts */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Landmark className="h-6 w-6 text-purple-700" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Cuentas Negocios</h2>
                        </div>
                        <Link href="/empresas/cuentas" className="text-[#00D9A5] font-medium hover:underline flex items-center gap-1">
                            Ver todas <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {accounts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {accounts.slice(0, 3).map(product => (
                                <ProductCardNW key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                            <p className="text-gray-500">Próximamente agregaremos cuentas empresariales.</p>
                        </div>
                    )}
                </section>

                {/* Why Raisket Business */}
                <section className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-sm">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">¿Por qué usar Raisket Empresas?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Comparación Imparcial</h3>
                            <p className="text-gray-600">Analizamos todas las opciones del mercado sin sesgos para que elijas lo mejor para tu negocio.</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Banknote className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Ahorro Real</h3>
                            <p className="text-gray-600">Encuentra las tasas más bajas y las comisiones más justas para maximizar tu rentabilidad.</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Especializado en PyMEs</h3>
                            <p className="text-gray-600">Entendemos los retos de las empresas mexicanas y buscamos soluciones a tu medida.</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
