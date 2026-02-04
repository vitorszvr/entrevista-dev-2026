'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Image as ImageIcon } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { SearchBar } from './SearchBar';
import { Suspense } from 'react';

export function Header() {
  const { cartCount, openCart, toggleLocalImages, showLocalImages } = useCart();
  const pathname = usePathname();

  const showSearch = pathname !== '/';
  const isProductPage = pathname.startsWith('/products/');

  return (
    <header className="sticky top-0 z-50 w-full bg-stone-50 border-b border-gray-200 h-16">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 h-full flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 transition-opacity group cursor-pointer shrink-0"
        >
          <div className="relative w-6 h-6 md:w-8 md:h-8">
            <Image
              src="/logo.svg"
              alt="DEPLOY Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg md:text-xl font-mono font-bold tracking-tighter text-black group-hover:text-emerald-600 transition-colors mt-1">
            DEPLOY
            <span className="text-gray-400 font-light hidden sm:inline">
              .store
            </span>
          </span>
        </Link>

        {showSearch && (
          <div className="flex-1 max-w-md mx-auto fade-in hidden md:block">
            <Suspense
              fallback={
                <div className="w-full h-10 bg-gray-100 rounded animate-pulse" />
              }
            >
              <SearchBar className="w-full" showFilter={!isProductPage} />
            </Suspense>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLocalImages}
            className={`
              flex items-center gap-2 px-2 py-1.5 border rounded-sm transition-all text-[10px] font-mono font-bold uppercase tracking-wider
              ${
                showLocalImages
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-stone-100 border-gray-200 text-gray-500 hover:bg-stone-200'
              }
            `}
            title="Alternar: Imagens do JSON vs Imagens Locais (public/ID.png)"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">
              {showLocalImages ? 'IMG: LOCAL' : 'IMG: REMOTE'}
            </span>
          </button>

          <button
            onClick={openCart}
            className="relative flex items-center gap-2 hover:opacity-70 transition-opacity p-2 -mr-2 cursor-pointer"
            aria-label="Abrir carrinho"
          >
            <span className="text-xs font-mono font-medium hidden sm:block text-black">
              CARRINHO [<span className="text-emerald-600">{cartCount}</span>]
            </span>

            <div className="relative">
              <ShoppingBag className="w-6 h-6 text-black" strokeWidth={1.5} />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-bold font-mono w-4 h-4 flex items-center justify-center rounded-full sm:hidden">
                  {cartCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="md:hidden border-t border-gray-200 bg-stone-50 px-4 py-2">
          <SearchBar className="w-full" showFilter={!isProductPage} />
        </div>
      )}
    </header>
  );
}
