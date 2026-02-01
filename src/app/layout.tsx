import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PromoBanner } from '@/components/PromoBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DEPLOY.store - E-commerce',
  description: 'Loja de desenvolvedores para desenvolvedores',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 flex flex-col min-h-screen`}
      >
        <PromoBanner />
        <Header />
        <main className="flex-grow container mx-auto px-6 sm:px-8 lg:px-12 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
