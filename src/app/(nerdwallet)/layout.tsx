// src/app/(nerdwallet)/layout.tsx
import HeaderNerdWallet from '@/components/layout/HeaderNerdWallet';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://raisket.mx'),
};

export default function NerdWalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderNerdWallet />
      <main>{children}</main>
      <Footer />
    </>
  );
}
