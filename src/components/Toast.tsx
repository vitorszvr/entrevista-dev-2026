'use client';

import { useCart } from '@/contexts/CartContext';
import { Check, X, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Toast() {
  const { toastMessage, hideToast, toastType } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [toastMessage]);

  if (!toastMessage && !isVisible) return null;
  const isError = toastType === 'error';

  return (
    <div
      className={`fixed top-24 z-[70] transition-all duration-300 transform 
        left-4 right-4 max-w-md mx-auto
        md:left-auto md:right-8 md:mx-0 md:w-auto
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
      `}
    >
      <div
        className={`
        bg-black text-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] border-l-4 flex items-center gap-3
        ${isError ? 'border-red-500' : 'border-emerald-500'} 
      `}
      >
        <div
          className={`
          p-1 rounded-full shrink-0
          ${isError ? 'bg-red-500/20' : 'bg-emerald-500/20'}
        `}
        >
          {isError ? (
            <AlertCircle
              className={`w-4 h-4 ${isError ? 'text-red-500' : 'text-emerald-500'}`}
            />
          ) : (
            <Check className="w-4 h-4 text-emerald-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`
            font-mono text-xs font-bold uppercase tracking-wider mb-0.5
            ${isError ? 'text-red-500' : 'text-emerald-500'}
          `}
          >
            {isError ? 'Limite' : 'Sucesso'}
          </p>
          <p className="text-sm font-medium leading-tight truncate">
            {toastMessage}
          </p>
        </div>

        <button
          onClick={hideToast}
          className="text-gray-500 hover:text-white transition-colors ml-2 cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
