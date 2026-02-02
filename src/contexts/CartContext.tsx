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
  hideToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const showToast = (message: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setToastMessage(message);

    timeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const hideToast = () => {
    setToastMessage(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Alterado: recebe options
  const addToCart = (product: Product, options?: { silent?: boolean }) => {
    setCart((prev) => {
      const itemExists = prev.find((item) => item.id === product.id);

      if (itemExists) {
        if (itemExists.quantity >= product.stock) {
          showToast(`Estoque máximo atingido para ${product.name}!`);
          return prev;
        }
        if (!options?.silent) {
          showToast(`+1 ${product.name} adicionado!`);
        }

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      if (!options?.silent) {
        showToast(`${product.name} adicionado ao setup!`);
      }

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
        hideToast,
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
