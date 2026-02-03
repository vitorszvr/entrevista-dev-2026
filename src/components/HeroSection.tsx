'use client';

import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import productsData from '@/data/products.json';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const { addToCart, openCart, showToast, applyCoupon } = useCart();

  const KIT_ITEMS = [1, 2];

  const handleBuyKit = (e: React.MouseEvent) => {
    e.stopPropagation();

    const shirt = productsData.find((p) => p.id === KIT_ITEMS[0]);
    const mug = productsData.find((p) => p.id === KIT_ITEMS[1]);

    if (shirt && mug) {
      addToCart(shirt, { silent: true });
      addToCart(mug, { silent: true });
      applyCoupon('KIT15');
      openCart();
    }
  };

  return (
    <section className="pt-2 md:pt-8 pb-8 md:pb-12 border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="flex flex-col">
          <h1 className="font-mono font-bold text-sm text-emerald-600 mb-1 md:mb-3 flex items-center gap-2">
            <span>~/loja $</span>
          </h1>
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <span className="text-3xl md:text-4xl font-light text-gray-400">
              cd
            </span>

            <div className="flex items-center relative">
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-black">
                ESSENCIAIS
              </h2>
              <span className="animate-terminal-blink bg-emerald-600 w-[4px] h-10 md:h-20 block ml-2 md:ml-4 "></span>
            </div>
          </div>

          <div className="md:border-l-2 md:border-emerald-500 md:pl-6 md:py-1 max-w-md transition-all">
            <h3 className="hidden md:block font-mono text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              README.md
            </h3>
            <p className="text-gray-600 text-sm md:text-lg leading-relaxed text-justify">
              Curadoria de itens essenciais para o seu setup
              <span className="hidden md:inline">
                : do hardware de alta performance à caneca do café sagrado.
              </span>
            </p>
          </div>
        </div>
        <div
          onClick={handleBuyKit}
          className="relative group cursor-pointer w-full"
        >
          <div className="relative w-full aspect-video md:aspect-square lg:aspect-[4/3] bg-gray-200 rounded-none overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300">
            <Image
              src="/kit.png"
              alt="Kit Dev Starter no Setup"
              fill
              className="object-cover object-right lg:object-center transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
          </div>
          <div
            className="
            relative z-20 bg-stone-50 p-6 border border-gray-200
            transition-transform duration-300 hover:translate-x-1 hover:-translate-y-1
            mt-0 w-full shadow-sm
            lg:absolute lg:bottom-12 lg:-left-12 lg:w-[320px] lg:mt-0 lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          "
          >
            <div className="flex justify-between items-start mb-4">
              <span className="inline-block px-2 py-1 bg-emerald-600 text-white text-[12px] font-mono uppercase tracking-widest">
                15% OFF
              </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 leading-none mb-2">
              DEV STARTER PACK
            </h3>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              O kit de sobrevivência essencial: Camiseta Developer 100% Algodão
              + Caneca Code.
            </p>

            <button className="w-full bg-black text-white py-3 font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#f3350c] transition-colors flex items-center justify-center gap-3">
              <span>[ COMPRAR ]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
