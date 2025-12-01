import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheck,
  Scale,
  Award,
  CheckCircle,
  XCircle,
  BarChart3,
  Users,
  Zap,
  Globe,
  Database,
  Brain,
  Lock,
  TrendingUp,
  Target,
  Search,
  MessageSquare,
  LayoutDashboard,
  CreditCard,
  Smartphone,
  Briefcase,
  GraduationCap,
  Server,
  Cloud,
  Building2
} from "lucide-react";
import FounderImage from "@/components/about/FounderImage";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Raisket - El Primer Asesor Financiero con IA de México",
  description: "Raisket democratiza el acceso a educación y asesoría financiera de calidad a través de inteligencia artificial.",
};

export default function AboutPage() {
  return (
    <div className="space-y-0">

      {/* Header / Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary via-primary/90 to-secondary text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6 leading-tight">
            El Primer Asesor Financiero<br />
            <span className="text-accent">Independiente</span> de México
          </h1>
          <p className="text-xl md:text-2xl font-semibold mb-4 text-accent/90">
            Impulsado por IA
          </p>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            Democratizando el acceso a educación y asesoría financiera de calidad a través de inteligencia artificial.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-bold shadow-lg transition-transform hover:-translate-y-1">
            <Link href="/">Conoce Nuestra Plataforma</Link>
          </Button>
        </div>
      </section>

      {/* Business Description */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-6">¿Qué es Raisket?</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Raisket es la <strong>primer plataforma que combina 3 cosas que nunca han existido juntas:</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Card 1 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Database className="w-12 h-12 text-accent mb-4" />
                <CardTitle className="text-xl text-primary">Base de Datos Viva</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-4 text-gray-700">TODOS los productos financieros de México en un solo lugar</p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent shrink-0 mt-1" /> Comparaciones lado a lado</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent shrink-0 mt-1" /> Filtros por institución</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent shrink-0 mt-1" /> Calificación comunitaria</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent shrink-0 mt-1" /> <span className="font-bold text-accent">Si está regulado, está aquí</span></li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Brain className="w-12 h-12 text-accent mb-4" />
                <CardTitle className="text-xl text-primary">IA Especializada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-4 text-gray-700">Tu asesor financiero personal 24/7</p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent shrink-0 mt-1" /> Perfilamiento completo</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent shrink-0 mt-1" /> Análisis de contratos</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent shrink-0 mt-1" /> Recomendaciones a medida</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent shrink-0 mt-1" /> <span className="font-bold text-accent">Asesor experto en tu bolsillo</span></li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Award className="w-12 h-12 text-accent mb-4" />
                <CardTitle className="text-xl text-primary">Contenido de Calidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-4 text-gray-700">100% enfocado en decisiones financieras</p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent shrink-0 mt-1" /> Guías accionables</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent shrink-0 mt-1" /> Casos reales mexicanos</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent shrink-0 mt-1" /> Análisis de tendencias</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent shrink-0 mt-1" /> <span className="font-bold text-accent">Tu destino antes de decidir</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Problem Statement */}
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-5xl mx-auto mb-16 border-l-4 border-accent">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">El Problema que Resolvemos</h3>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                Raisket <strong>no es solo un comparador</strong> de productos financieros. Estamos construyendo el
                <strong> primer asesor financiero con IA verdaderamente personalizado para México</strong>, que entiende
                el contexto único de cada usuario y recomienda productos basándose en <strong>datos propietarios que
                  ningún competidor tiene</strong>.
              </p>
              <p>
                La diferencia entre un chatbot básico y un asesor financiero confiable está en nuestra capacidad de
                combinar <strong>inteligencia contextual</strong>, <strong>conocimiento propietario</strong>, y
                <strong> memoria personalizada</strong> para crear una experiencia que mejora con cada interacción.
              </p>
            </div>
          </div>

          {/* Market Opportunity (TAM/SAM & Validation) */}
          <div className="mt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-10 text-center">Oportunidad de Mercado</h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* TAM/SAM */}
              <Card className="border-none shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <Target className="w-6 h-6 text-accent" /> Tamaño del Mercado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-100 text-primary px-3 py-1 rounded-full text-xs font-bold">TAM</span>
                      <h4 className="font-bold text-gray-900">Total Addressable Market</h4>
                    </div>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full"><Users className="w-4 h-4 text-primary" /></div>
                        <span className="font-medium">53M Mexicanos con cuenta bancaria</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full"><Building2 className="w-4 h-4 text-primary" /></div>
                        <span className="font-medium">4.9M Empresas registradas en México</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-teal-100 text-accent px-3 py-1 rounded-full text-xs font-bold">SAM</span>
                      <h4 className="font-bold text-gray-900">Serviceable Available Market</h4>
                    </div>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full"><Search className="w-4 h-4 text-accent" /></div>
                        <span className="font-medium">16M Personas buscan productos/año</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full"><Briefcase className="w-4 h-4 text-accent" /></div>
                        <span className="font-medium">1.2M PyMEs buscan financiamiento/año</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Validation */}
              <Card className="border-none shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-accent" /> Validación de Mercado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 italic font-medium text-center">
                    "Un mercado con déficit estructural y alta demanda insatisfecha"
                  </p>

                  <div className="space-y-6">
                    <div className="bg-red-50 p-5 rounded-xl border-l-4 border-red-400">
                      <div className="flex justify-between items-end mb-2">
                        <div className="text-center">
                          <span className="block text-2xl font-bold text-gray-700">7,500</span>
                          <span className="text-xs text-gray-500 uppercase font-bold">Asesores Actuales</span>
                        </div>
                        <div className="text-red-400 font-bold text-xl">VS</div>
                        <div className="text-center">
                          <span className="block text-2xl font-bold text-red-600">35,000</span>
                          <span className="text-xs text-red-400 uppercase font-bold">Déficit Real</span>
                        </div>
                      </div>
                      <p className="text-xs text-center text-gray-500 mt-2">Déficit masivo de asesores certificados</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">Información financiera confusa</span>
                          <span className="font-bold text-primary">64%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '64%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">Temor a perder dinero</span>
                          <span className="font-bold text-primary">61%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '61%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">Busca aprender activamente</span>
                          <span className="font-bold text-accent">55%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div className="bg-accent h-2.5 rounded-full" style={{ width: '55%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary text-center mb-6">Nuestro Equipo</h2>
          <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-16">
            Un equipo con profunda experiencia en finanzas tradicionales, tecnología y emprendimiento.
          </p>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* Rafael Zamudio */}
            <Card className="overflow-hidden hover:shadow-lg transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <FounderImage />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Rafael Rivas</h3>
                <div className="text-accent font-bold mb-6">Founder & CEO</div>
                <div className="text-left space-y-4 text-sm text-gray-600 mb-6">
                  <p>
                    <strong>Expertise Financiero:</strong> 8+ años en finanzas bursátiles incluyendo mesa de tesorería de ISSSTE. Experiencia en gestión de portafolios y asesor financiero
                  </p>
                  <p>
                    <strong>Visión Tecnológica:</strong> Pionero en IA financiera en México. Desarrollando sistemas RAG avanzados.
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
                  Licenciatura en Finanzas y Banca, Certificacion Bloomberg Market Concepts (BMC) | En proceso CNBV
                </div>
              </CardContent>
            </Card>

            {/* Team Expansion */}
            <Card className="overflow-hidden hover:shadow-lg transition-all border-dashed border-2 border-gray-200">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-xl font-bold">
                  TEAM
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Expansión del Equipo</h3>
                <div className="text-accent font-bold mb-6">En Búsqueda Activa</div>
                <div className="text-left space-y-4 text-sm text-gray-600 mb-6">
                  <p><strong>Perfiles que buscamos:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>CTO (Fintech & Scalable Systems)</li>

                    <li>Product Designer</li>
                    <li>Compliance Officer (CNBV)</li>
                  </ul>
                  <p className="mt-4"><strong>Fase actual:</strong> Pre-seed. Contratación inmediata post-fundraising Q1 2025.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 max-w-3xl mx-auto text-center bg-gray-50 p-8 rounded-xl">
            <h3 className="text-xl font-bold text-primary mb-3">Advisors & Partners</h3>
            <p className="text-gray-600">
              Contamos con el apoyo de expertos en regulación financiera, especialistas en IA/ML, y mentores fintech. En conversaciones con VCs mexicanos.
            </p>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary text-center mb-16">Nuestra Plataforma</h2>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-10 text-white shadow-xl min-h-[400px] flex flex-col justify-center text-center">
              <h3 className="text-3xl font-bold mb-6">🤖 AI-Powered Platform</h3>
              <p className="text-lg mb-6">Sistema RAG multi-modelo que combina:</p>
              <ul className="space-y-3 text-left max-w-xs mx-auto mb-8">
                <li className="flex items-center gap-2"><Zap className="w-5 h-5 text-accent" /> Claude Sonnet 4.5 (Razonamiento)</li>
                <li className="flex items-center gap-2"><Zap className="w-5 h-5 text-accent" /> GPT-4o (Generación)</li>
                <li className="flex items-center gap-2"><Zap className="w-5 h-5 text-accent" /> Gemini 2.0 Flash (Velocidad)</li>
                <li className="flex items-center gap-2"><Database className="w-5 h-5 text-accent" /> Vector DB con productos MX</li>
              </ul>
              <p className="text-sm opacity-80 border-t border-white/20 pt-4 inline-block mx-auto">
                [Demo interactiva disponible en Q1 2025]
              </p>
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-primary">Características Principales</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="mt-1"><Search className="w-6 h-6 text-accent" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Comparador de Productos Financieros</h4>
                    <p className="text-sm text-gray-600">Base de datos completa de tarjetas, seguros y créditos. Comparación lado a lado.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1"><MessageSquare className="w-6 h-6 text-accent" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Asesor Financiero con IA</h4>
                    <p className="text-sm text-gray-600">Chatbot que entiende contexto mexicano y explica conceptos complejos.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1"><GraduationCap className="w-6 h-6 text-accent" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Educación Financiera Personalizada</h4>
                    <p className="text-sm text-gray-600">Cursos adaptativos desde básico hasta avanzado.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1"><LayoutDashboard className="w-6 h-6 text-accent" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Dashboard de Finanzas Personales</h4>
                    <p className="text-sm text-gray-600">Visualización de salud financiera y tracking de metas.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Roadmap */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-center text-2xl font-bold text-primary mb-10">Etapas de Desarrollo</h3>
            <div className="space-y-6">
              {/* Phase 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">✓ Completado</span>
                  <h4 className="font-bold text-lg text-gray-900">Fase 1: Research & Validation (Q3-Q4 2024)</h4>
                </div>
                <p className="text-sm text-gray-600 pl-4">Investigación de mercado, validación con 50+ entrevistas, diseño de arquitectura y prototipo.</p>
              </div>

              {/* Phase 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">⚡ En Progreso</span>
                  <h4 className="font-bold text-lg text-gray-900">Fase 2: MVP Development (Q4 2024 - Q1 2025)</h4>
                </div>
                <p className="text-sm text-gray-600 pl-4">Desarrollo plataforma web, sistema RAG, base de datos de productos, auth y beta testing.</p>
              </div>

              {/* Phase 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">📋 Planeado</span>
                  <h4 className="font-bold text-lg text-gray-900">Fase 3: Launch & Scale (Q2 2025)</h4>
                </div>
                <p className="text-sm text-gray-600 pl-4">Lanzamiento público, programa de afiliados, marketing, certificación CNBV y expansión.</p>
              </div>

              {/* Phase 4 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">🚀 Futuro</span>
                  <h4 className="font-bold text-lg text-gray-900">Fase 4: Product Expansion (Q3-Q4 2025)</h4>
                </div>
                <p className="text-sm text-gray-600 pl-4">App móvil, asesoría humana 1-on-1, robo-advisor y expansión LATAM.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary text-center mb-6">Stack Tecnológico</h2>
          <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-16">
            Arquitectura moderna y escalable diseñada para manejar millones de usuarios.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg text-primary">🎨 Frontend</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p><strong>Next.js 15</strong>, React 19, TypeScript</p>
                <p>Tailwind CSS, Shadcn UI</p>
                <p>Zustand, React Query</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg text-primary">⚙️ Backend</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>Next.js API Routes, tRPC</p>
                <p>Clerk / NextAuth</p>
                <p>PostgreSQL (Supabase), Prisma</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg text-primary">🤖 AI/ML Stack (actual)</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>Claude Sonnet 4.5, GPT-4o, Gemini 2.0</p>
                <p>OpenAI Embeddings</p>
                <p>Pinecone / Qdrant</p>
                <p>LangChain, Vercel AI SDK</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg text-primary">☁️ Infrastructure</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>Vercel (Frontend)</p>
                <p>Google Cloud Platform</p>
                <p>Cloudflare</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg text-primary">📊 Data & Analytics</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>Google Analytics 4, Mixpanel</p>
                <p>Airbyte, Metabase</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg text-primary">🔒 Security</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>AES-256 Encryption</p>
                <p>CNBV Compliance</p>
                <p>Automated Backups</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Google Cloud Section (Special) */}
      <section className="py-20 text-white bg-gradient-to-br from-[#4285f4] to-[#34a853]">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">¿Por qué Google Cloud y cómo usaremos los créditos?</h2>

          <div className="max-w-5xl mx-auto">
            <p className="text-xl text-center mb-12 opacity-90">
              La diferencia entre un chatbot básico y un asesor financiero confiable está en <strong>tres capacidades críticas</strong> que solo una infraestructura enterprise puede proporcionar:
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
                <h3 className="text-2xl font-bold mb-4">🧠 Inteligencia Contextual</h3>
                <p className="font-bold mb-4">Vertex AI + Gemini</p>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>✓ Múltiples modelos especializados</li>
                  <li>✓ Experiencia premium</li>
                  <li className="mt-4 font-semibold">Costo: $500-800 USD/mes</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
                <h3 className="text-2xl font-bold mb-4">🔍 Conocimiento Propietario</h3>
                <p className="font-bold mb-4">RAG + Vertex AI Search</p>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>✓ IA conectada con nuestra DB</li>
                  <li>✓ Calificaciones Raisket</li>
                  <li className="mt-4 font-semibold">Costo: $300-500 USD/mes</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
                <h3 className="text-2xl font-bold mb-4">💾 Memoria</h3>
                <p className="font-bold mb-4">Firestore + Memorystore</p>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>✓ Recordamos cada interacción</li>
                  <li>✓ Perfil financiero completo</li>
                  <li className="mt-4 font-semibold">Costo: $200-400 USD/mes</li>
                </ul>
              </div>
            </div>

            <div className="bg-white text-gray-800 p-10 rounded-2xl shadow-xl mb-12">
              <h3 className="text-2xl font-bold text-[#4285f4] text-center mb-8">Desglose de $2,000 USD de créditos</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border-l-4 border-[#4285f4] pl-6">
                  <h4 className="font-bold text-lg text-[#4285f4] mb-2">Mes 1-2: MVP + Pruebas (~$1,200)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Configuración arquitectura agentes IA</li>
                    <li>Integración RAG</li>
                    <li>Testing 50-100 usuarios</li>
                  </ul>
                </div>
                <div className="border-l-4 border-[#34a853] pl-6">
                  <h4 className="font-bold text-lg text-[#34a853] mb-2">Mes 3: Validación (~$800)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Escalar a 500 usuarios</li>
                    <li>Métricas para fundraising</li>
                    <li>Optimizar costos</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
              <p className="text-lg font-semibold italic">
                "Los $2,000 USD de créditos nos permiten construir tecnología nivel Goldman Sachs para México, sin quemar capital crítico."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary text-center mb-12">Modelo de Negocio</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader><CardTitle className="text-lg text-primary">💰 Streams de Ingresos</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-2">
                  <li><strong>Afiliados (60%):</strong> Comisiones por referidos</li>
                  <li><strong>Suscripción (25%):</strong> $199 MXN/mes</li>
                  <li><strong>Asesoría (10%):</strong> Consultas 1-on-1</li>
                  <li><strong>API B2B (5%):</strong> Motor de recomendaciones</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg text-primary">📈 Proyecciones</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-2">
                  <li><strong>Año 1:</strong> $300K USD</li>
                  <li><strong>Año 2:</strong> $1.2M USD</li>
                  <li><strong>LTV:</strong> $180 USD</li>
                  <li><strong>Margen:</strong> 70%+</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg text-primary">🎯 Go-to-Market</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-2">
                  <li><strong>Content:</strong> Blog, YouTube, TikTok</li>
                  <li><strong>SEO:</strong> High-intent keywords</li>
                  <li><strong>Partnerships:</strong> Co-marketing</li>
                  <li><strong>Paid:</strong> Google/Meta Ads</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary text-center mb-12">Ventaja Competitiva</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="border-l-4 border-accent">
              <CardHeader><CardTitle className="text-xl text-primary">🏆 ¿Por qué Raisket va a ganar?</CardTitle></CardHeader>
              <CardContent className="text-gray-600 space-y-2">
                <p>• <strong>First-mover:</strong> Primeros en combinar IA + Expertise Financiero en MX.</p>
                <p>• <strong>Independencia:</strong> No vendemos productos propios, solo recomendamos lo mejor.</p>
                <p>• <strong>Producto Superior:</strong> RAG system 10x más preciso que Chat genérico.</p>
                <p>• <strong>Barrera de Entrada:</strong> Certificación CNBV y Base de Datos propietaria.</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-lg text-destructive">Competencia Directa</CardTitle></CardHeader>
                <CardContent className="text-sm text-gray-600">
                  <p><strong>Bancos:</strong> Lentos, conflicto de interés.</p>
                  <p><strong>Fintechs:</strong> Venden solo sus productos.</p>
                  <p><strong>Comparadores:</strong> Sin IA, sin personalización.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg text-accent">Nuestra Diferencia</CardTitle></CardHeader>
                <CardContent className="text-sm text-gray-600">
                  <p>Somos el único producto que combina <strong>neutralidad + IA + educación + comparación</strong> en una sola plataforma.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Traction */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary text-center mb-12">Traction & Métricas</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-primary">Pre-Launch</div>
              <div className="text-xs text-gray-500">Stage</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-xs text-gray-500">Entrevistas</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-primary">100+</div>
              <div className="text-xs text-gray-500">Waitlist</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-primary">Q2 2025</div>
              <div className="text-xs text-gray-500">Launch</div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-primary mb-4">Fundraising Status</h3>
            <p className="text-lg font-semibold mb-2">Currently Raising: $250K USD Pre-Seed</p>
            <p className="text-gray-600 text-sm">
              En conversaciones con VCs (ALLVP, 500 Latam). Fondos para desarrollo de producto, equipo core y marketing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">¿Quieres Saber Más?</h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Estamos construyendo el futuro de la educación y asesoría financiera en México.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full px-8">
              <a href="mailto:info@raisket.mx">Contacto para Inversión</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8">
              <a href="mailto:info@raisket.mx">Únete al Waitlist</a>
            </Button>
          </div>
          <div className="mt-12 pt-8 border-t border-white/20 text-sm opacity-70">
            <p>Contacto: info@raisket.mx | Ciudad de México, México</p>
          </div>
        </div>
      </section>
    </div>
  );
}
