'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-stone-50 h-full relative overflow-hidden hover:z-10"
    >
      <div className="absolute inset-0 border border-transparent group-hover:border-gray-200 transition-colors duration-200 pointer-events-none z-20" />

      <div className="relative p-4 flex flex-col h-full">
        <div className="relative aspect-square w-full mb-4 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        <div className="mt-auto space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
            {product.category}
          </span>

          <h3 className="text-sm font-semibold text-gray-900 leading-snug">
            {product.name}
          </h3>

          <div className="flex flex-wrap items-center justify-between pt-2 gap-2">
            <p className="font-mono text-sm text-black font-medium tracking-tight">
              {formattedPrice}
            </p>

            <button
              onClick={handleAddToCart}
              className="cursor-pointer text-[10px] font-mono font-bold bg-stone-200/50 hover:bg-[#f3350c] hover:text-white px-3 py-1 transition-colors uppercase tracking-wider z-30 relative shrink-0"
            >
              [ + ADD ]
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
