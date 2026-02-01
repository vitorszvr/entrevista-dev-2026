'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export function Header() {
  const { cartCount, openCart } = useCart();

  return (
    /* MUDANÇA: bg-stone-50 */
    <header className="sticky top-0 z-50 w-full bg-stone-50 border-b border-gray-200">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity group cursor-pointer"
        >
          <div className="relative w-8 h-8">
            <Image
              src="/logo.svg"
              alt="DEPLOY Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <span className="text-xl font-mono font-bold tracking-tighter text-black group-hover:text-emerald-600 transition-colors mt-1">
            DEPLOY<span className="text-gray-400 font-light">.store</span>
          </span>
        </Link>

        <button
          onClick={openCart}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity p-2 -mr-2 cursor-pointer"
          aria-label="Abrir carrinho"
        >
          <span className="text-xs font-mono font-medium hidden sm:block">
            CART [{cartCount}]
          </span>
          <ShoppingBag className="w-5 h-5 text-black" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
