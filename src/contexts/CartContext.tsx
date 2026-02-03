'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from 'react';
import { Product, CartItem } from '@/types';

// 1. Adicionar toastType na interface
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, options?: { silent?: boolean }) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toastMessage: string | null;
  toastType: 'success' | 'error'; // <--- NOVO
  hideToast: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void; // <--- ATUALIZADO
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // 2. Novo estado para controlar o tipo (cor/ícone)
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('deploy-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('deploy-cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Atualizar função showToast para receber o tipo
  const showToast = (
    message: string,
    type: 'success' | 'error' = 'success',
  ) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToastMessage(message);
    setToastType(type); // Salva o tipo
    timeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      // Opcional: resetar para success depois
      setTimeout(() => setToastType('success'), 300);
    }, 3000);
  };

  const hideToast = () => {
    setToastMessage(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const applyCoupon = (code: string) => {
    const validCoupons = ['PRIMEIRA10', 'KIT15'];
    if (validCoupons.includes(code.toUpperCase())) {
      setAppliedCoupon(code.toUpperCase());
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addToCart = (product: Product, options?: { silent?: boolean }) => {
    setCart((prev) => {
      const itemExists = prev.find((item) => item.id === product.id);

      if (itemExists) {
        if (itemExists.quantity >= product.stock) {
          // 4. AQUI MUDAMOS: Dispara toast de ERRO se atingir limite
          showToast(`Estoque máximo atingido!`, 'error');
          return prev;
        }
        if (!options?.silent) showToast(`+1 ${product.name} adicionado!`);

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      if (!options?.silent) showToast(`${product.name} adicionado ao setup!`);

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        cartCount,
        isCartOpen,
        openCart,
        closeCart,
        toastMessage,
        toastType, // Exporta o tipo
        hideToast,
        showToast,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
