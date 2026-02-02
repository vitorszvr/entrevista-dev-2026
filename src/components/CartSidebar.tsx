'use client';

import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

export function CartSidebar() {
  const {
    cart,
    removeFromCart,
    addToCart,
    decreaseQuantity,
    isCartOpen,
    closeCart,
  } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(total);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={closeCart}
      />

      <div className="relative w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col animate-slide-in">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="font-mono font-bold text-lg tracking-tight">
              SEU SETUP
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <ShoppingBag className="w-12 h-12 mb-4 text-gray-300" />
              <p className="font-mono text-sm text-gray-400">
                Carrinho vazio...
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const isMaxStock = item.quantity >= item.stock;

              return (
                <div key={item.id} className="flex gap-4 group">
                  <div className="relative w-20 h-20 bg-stone-50 border border-gray-200 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-sm text-gray-900 leading-tight mb-2">
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-sm bg-stone-50">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="p-1 hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>

                          <span className="font-mono text-xs w-8 text-center text-gray-900">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => addToCart(item)}
                            disabled={isMaxStock}
                            className={`p-1 transition-colors cursor-pointer ${
                              isMaxStock
                                ? 'opacity-30 cursor-not-allowed'
                                : 'hover:bg-gray-200'
                            }`}
                            title={isMaxStock ? 'Estoque máximo atingido' : ''}
                          >
                            <Plus className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono text-sm font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-stone-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-500 font-mono uppercase">
                Total
              </span>
              <span className="text-xl font-bold font-mono text-emerald-600">
                {formattedTotal}
              </span>
            </div>
            <button className="w-full bg-black text-white font-mono font-bold py-4 hover:bg-[#f3350c] transition-colors uppercase tracking-widest text-sm cursor-pointer">
              [ Finalizar Compra ]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
