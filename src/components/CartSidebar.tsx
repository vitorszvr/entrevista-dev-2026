'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
  Tag,
  Truck,
  ArrowRight,
} from 'lucide-react';
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
    cartCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  useEffect(() => {
    if (appliedCoupon) {
      setCouponInput(appliedCoupon);
    } else {
      setCouponInput('');
    }
  }, [appliedCoupon]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const discount = useMemo(() => {
    if (appliedCoupon === 'PRIMEIRA10') return subtotal * 0.1;
    if (appliedCoupon === 'KIT15') return subtotal * 0.15;
    return 0;
  }, [subtotal, appliedCoupon]);

  const shipping = 0;
  const total = subtotal - discount + shipping;
  const installmentValue = total / 6;

  const formatMoney = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const handleApplyCoupon = () => {
    applyCoupon(couponInput);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex justify-end transition-all duration-300 ${
        isCartOpen ? 'pointer-events-auto' : 'pointer-events-none delay-300'
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
      />

      <div
        className={`relative w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="font-mono font-bold text-lg tracking-tight">
              SEU SETUP <span className="text-gray-400">({cartCount})</span>
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
                      <h3 className="font-medium text-sm text-gray-900 leading-tight mb-2 line-clamp-2">
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
                          >
                            <Plus className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono text-sm font-medium">
                        {formatMoney(item.price * item.quantity)}
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
          <div className="border-t border-gray-200 bg-gray-50/50 p-6 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cupom de desconto"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-emerald-600 font-mono uppercase"
                  disabled={!!appliedCoupon}
                />
              </div>
              {appliedCoupon ? (
                <button
                  onClick={removeCoupon}
                  className="px-4 py-2 bg-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-300 transition-colors"
                >
                  Remover
                </button>
              ) : (
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-emerald-600 transition-colors"
                >
                  Aplicar
                </button>
              )}
            </div>

            <div className="space-y-2 pt-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartCount} itens)</span>
                <span className="font-mono">{formatMoney(subtotal)}</span>
              </div>

              <div className="flex justify-between text-emerald-600">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3 h-3" />
                  Frete
                </span>
                <span className="font-mono font-medium">Grátis</span>
              </div>

              {/* MUDANÇA AQUI: Removi animate-pulse, bg-emerald-50, px e rounded */}
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600">
                  <span>Desconto ({appliedCoupon})</span>
                  <span className="font-mono">- {formatMoney(discount)}</span>
                </div>
              )}

              <div className="flex justify-between items-end pt-3 border-t border-gray-200 mt-3">
                <span className="font-bold text-gray-900 uppercase">Total</span>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-emerald-600 leading-none">
                    {formatMoney(total)}
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium mt-1">
                    ou em até 6x de {formatMoney(installmentValue)} sem juros
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-black text-white font-mono font-bold py-4 hover:bg-[#f3350c] transition-colors uppercase tracking-widest text-sm cursor-pointer flex items-center justify-center gap-2 group mt-2">
              <span>[ Finalizar Compra ]</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
