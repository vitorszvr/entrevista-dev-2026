import { describe, it, expect } from 'vitest';

const calculateTotal = (items: { price: number; quantity: number }[]) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

describe('Lógica do Carrinho', () => {
  it('deve calcular o subtotal corretamente com múltiplos itens', () => {
    const cartItems = [
      { id: 1, price: 100, quantity: 2 }, // 200
      { id: 2, price: 50, quantity: 1 }, // 50
    ];

    const total = calculateTotal(cartItems);

    expect(total).toBe(250);
  });

  it('deve retornar zero quando o carrinho estiver vazio', () => {
    const total = calculateTotal([]);
    expect(total).toBe(0);
  });
});
