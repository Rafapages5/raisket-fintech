import Link from 'next/link';
import { ArrowLeft, Share2, Bookmark, Clock, Calendar } from 'lucide-react';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    await params; // Wait for params (conceptually, though not strictly needed if unused yet, but good practice per Next 15)
    // Actually we don't use slug here yet (mock data), but typings must match.
    // However, if we don't await, Next 15 dev server might warn or error if we access props later.
    // Since mock data is static, we just fix the signature.
    // Mock Data - In a real app, fetch based on params.slug
    const article = {
        title: 'El Peso Mexicano se Fortalece: Análisis de Cierre de Mercado',
        subtitle: 'La moneda mexicana registra su mejor desempeño en 3 meses frente al dólar, impulsada por datos de inflación y remesas récord.',
        author: 'Raisket Financial',
        date: '24 Nov 2025',
        readTime: '5 min lectura',
        image: 'https://placehold.co/1200x600/1a1a1a/ffffff?text=Peso+Mexicano+Rally',
        content: `
      <p class="mb-6 text-lg leading-relaxed">
        El peso mexicano cerró la jornada de este martes con una apreciación significativa frente al dólar estadounidense, cotizando en niveles no vistos desde hace tres meses. Este movimiento se da en un contexto de debilidad generalizada del billete verde y datos económicos locales que superaron las expectativas de los analistas.
      </p>
      <h2 class="text-2xl font-bold mb-4 mt-8">Factores Clave</h2>
      <p class="mb-6 leading-relaxed">
        Entre los principales catalizadores de este repunte se encuentran las cifras récord de remesas reportadas por el Banco de México, que continúan brindando un soporte fundamental a la divisa. Además, el diferencial de tasas de interés entre México y Estados Unidos sigue siendo atractivo para los inversionistas globales, manteniendo el "carry trade" como una estrategia rentable.
      </p>
      <blockquote class="border-l-4 border-primary pl-6 py-2 my-8 italic text-xl text-muted-foreground bg-muted/20 rounded-r-lg">
        "La resiliencia del peso mexicano continúa sorprendiendo al mercado, demostrando que los fundamentales macroeconómicos del país siguen siendo sólidos a pesar de la volatilidad global."
      </blockquote>
      <h2 class="text-2xl font-bold mb-4 mt-8">Perspectivas para el Cierre de Año</h2>
      <p class="mb-6 leading-relaxed">
        Analistas de Raisket Financial sugieren que, si bien la volatilidad podría aumentar hacia el cierre del año debido a factores estacionales y geopolíticos, la tendencia estructural del peso se mantiene constructiva. Se recomienda a los importadores aprovechar estos niveles para coberturas, mientras que los exportadores deberían mantener cautela.
      </p>
    `
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">

            {/* Navigation Bar */}
            <nav className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/news" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Volver a Noticias
                    </Link>
                    <div className="flex gap-4">
                        <button className="p-2 hover:bg-muted rounded-full transition-colors">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-full transition-colors">
                            <Bookmark className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            <article className="container mx-auto px-4 max-w-4xl mt-12">

                {/* Header */}
                <header className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase text-xs tracking-wider">Mercados</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                        {article.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        {article.subtitle}
                    </p>
                </header>

                {/* Featured Image */}
                <div className="rounded-2xl overflow-hidden mb-12 shadow-2xl">
                    <img src={article.image} alt={article.title} className="w-full object-cover aspect-[21/9]" />
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Text */}
                    <div className="lg:col-span-8 lg:col-start-3">
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Author Bio */}
                        <div className="mt-16 pt-8 border-t border-border flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                                R
                            </div>
                            <div>
                                <p className="font-bold text-lg">{article.author}</p>
                                <p className="text-sm text-muted-foreground">Equipo de Análisis Financiero</p>
                            </div>
                        </div>
                    </div>

                </div>

            </article>
        </div>
    );
}
