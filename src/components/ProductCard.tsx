import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.price);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white h-full relative overflow-hidden hover:z-10"
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

          <div className="flex items-center justify-between pt-2">
            <p className="font-mono text-sm text-black font-medium tracking-tight">
              {formattedPrice}
            </p>

            <button className="text-[10px] font-mono font-bold bg-gray-100 hover:bg-[#f3350c] hover:text-white px-3 py-1 transition-colors uppercase tracking-wider">
              [ + ADD ]
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
