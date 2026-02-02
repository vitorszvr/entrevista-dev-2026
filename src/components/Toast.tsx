'use client';

import { useCart } from '@/contexts/CartContext';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Toast() {
  const { toastMessage, hideToast } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [toastMessage]);

  if (!toastMessage && !isVisible) return null;

  return (
    <div
      className={`fixed top-24 right-4 md:right-8 z-[70] transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className="bg-black text-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] border-l-4 border-emerald-500 flex items-center gap-3 min-w-[300px]">
        <div className="bg-emerald-500/20 p-1 rounded-full">
          <Check className="w-4 h-4 text-emerald-500" />
        </div>

        <div className="flex-1">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-500 mb-0.5">
            Sucesso
          </p>
          <p className="text-sm font-medium leading-tight">{toastMessage}</p>
        </div>

        <button
          onClick={hideToast}
          className="text-gray-500 hover:text-white transition-colors ml-2 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
