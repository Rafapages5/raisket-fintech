import Link from 'next/link';
import { ArrowRight, TrendingUp, Clock, Share2, Bookmark } from 'lucide-react';

// Mock Data for News
const FEATURED_NEWS = {
    id: '1',
    title: 'El Peso Mexicano se Fortalece: Análisis de Cierre de Mercado',
    summary: 'La moneda mexicana registra su mejor desempeño en 3 meses frente al dólar, impulsada por datos de inflación y remesas récord.',
    category: 'Mercados',
    author: 'Raisket Financial',
    date: 'Hace 2 horas',
    image: 'https://placehold.co/1200x600/1a1a1a/ffffff?text=Peso+Mexicano+Rally',
    slug: 'peso-mexicano-fortalece-cierre-mercado'
};

const LATEST_NEWS = [
    {
        id: '2',
        title: 'Nu México alcanza 5 millones de clientes: ¿Qué sigue?',
        category: 'Fintech',
        date: 'Hace 4 horas',
        image: 'https://placehold.co/800x400/820AD1/ffffff?text=Nu+Mexico',
        slug: 'nu-mexico-5-millones'
    },
    {
        id: '3',
        title: 'Cetes vs. SOFIPOS: ¿Dónde invertir en 2025?',
        category: 'Inversiones',
        date: 'Hace 6 horas',
        image: 'https://placehold.co/800x400/004d40/ffffff?text=Cetes+vs+Sofipos',
        slug: 'cetes-vs-sofipos-2025'
    },
    {
        id: '4',
        title: 'Reforma Fiscal: 5 Puntos Clave para Empresarios',
        category: 'Fiscal',
        date: 'Hace 8 horas',
        image: 'https://placehold.co/800x400/263238/ffffff?text=Reforma+Fiscal',
        slug: 'reforma-fiscal-puntos-clave'
    }
];

export default function NewsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header / Ticker */}
            <div className="bg-muted/30 border-b border-border py-2 overflow-hidden">
                <div className="container mx-auto px-4 flex items-center gap-4 text-xs font-medium text-muted-foreground">
                    <span className="text-primary flex items-center gap-1 uppercase tracking-wider">
                        <TrendingUp className="w-3 h-3" /> Mercados
                    </span>
                    <div className="flex gap-6 animate-marquee whitespace-nowrap">
                        <span>USD/MXN $17.05 (-0.2%)</span>
                        <span>IPC 54,200 (+1.1%)</span>
                        <span>CETES 28D 11.05% (=)</span>
                        <span>S&P 500 4,800 (+0.5%)</span>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Main Content Column */}
                    <div className="lg:w-2/3 space-y-12">

                        {/* Hero Article */}
                        <section className="group cursor-pointer">
                            <Link href={`/news/${FEATURED_NEWS.slug}`}>
                                <div className="relative overflow-hidden rounded-xl aspect-video mb-4">
                                    <img
                                        src={FEATURED_NEWS.image}
                                        alt={FEATURED_NEWS.title}
                                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                                        {FEATURED_NEWS.category}
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
                                    {FEATURED_NEWS.title}
                                </h1>
                                <p className="text-lg text-muted-foreground mb-4 line-clamp-2">
                                    {FEATURED_NEWS.summary}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">{FEATURED_NEWS.author}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {FEATURED_NEWS.date}</span>
                                </div>
                            </Link>
                        </section>

                        {/* Latest News Grid */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                Últimas Noticias
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                {LATEST_NEWS.map((news) => (
                                    <Link key={news.id} href={`/news/${news.slug}`} className="group">
                                        <div className="relative overflow-hidden rounded-lg aspect-[3/2] mb-3">
                                            <img
                                                src={news.image}
                                                alt={news.title}
                                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-primary uppercase">{news.category}</span>
                                            <span className="text-xs text-muted-foreground">• {news.date}</span>
                                        </div>
                                        <h3 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors">
                                            {news.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-1/3 space-y-8">

                        {/* Newsletter */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-2">Raisket Daily</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Las noticias financieras más importantes, directo a tu correo cada mañana.
                            </p>
                            <div className="space-y-2">
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                                    Suscribirse
                                </button>
                            </div>
                        </div>

                        {/* Trending Topics */}
                        <div>
                            <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Tendencias</h3>
                            <ul className="space-y-4">
                                {['#Bitcoin', '#Cetes', '#Nu', '#SAT', '#Dolar'].map((tag, i) => (
                                    <li key={i} className="flex items-center justify-between group cursor-pointer">
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{tag}</span>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </aside>

                </div>
            </main>
        </div>
    );
}
