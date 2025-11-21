import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CompareContextProvider } from '@/contexts/CompareContext';
import SchemaScript from '@/lib/schema/SchemaScript';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema/generators';

export const metadata: Metadata = {
  title: {
    default: 'Raisket - Compara Productos Financieros en México',
    template: '%s | Raisket',
  },
  description: 'Compara y encuentra los mejores productos financieros en México: tarjetas de crédito sin anualidad, préstamos personales, inversiones y cuentas bancarias.',
  keywords: ['productos financieros', 'tarjetas de crédito', 'préstamos personales', 'inversiones', 'cuentas bancarias', 'México', 'comparador financiero'],
  authors: [{ name: 'Raisket' }],
  creator: 'Raisket',
  publisher: 'Raisket',
  metadataBase: new URL('https://raisket.mx'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://raisket.mx',
    title: 'Raisket - Compara Productos Financieros en México',
    description: 'Compara y encuentra los mejores productos financieros en México: tarjetas de crédito, préstamos, inversiones y cuentas bancarias.',
    siteName: 'Raisket',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Raisket - Compara Productos Financieros en México',
    description: 'Compara y encuentra los mejores productos financieros en México',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generar schemas globales
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />

        {/* Schema.org - Organization & WebSite */}
        <SchemaScript schema={[organizationSchema, websiteSchema]} />
      </head>
      <body className="font-body antialiased">
        <CompareContextProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </CompareContextProvider>
      </body>
    </html>
  );
}
