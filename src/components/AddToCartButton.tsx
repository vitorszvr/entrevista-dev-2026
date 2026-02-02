'use client';

import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, openCart } = useCart();

  const handleAddToCart = () => {
    // Adiciona silenciosamente (sem Toast)
    addToCart(product, { silent: true });

    // Abre o carrinho (Sidebar) imediatamente
    openCart();
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full bg-black hover:bg-[#f3350c] text-white font-mono font-bold py-5 transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-3 group cursor-pointer active:scale-[0.98]"
    >
      <span>[ Adicionar ao Setup ]</span>
    </button>
  );
}
