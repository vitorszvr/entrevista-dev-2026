import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from '../components/ProductCard';

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

const mockAddToCart = vi.fn();

vi.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
  }),
}));

const dummyProduct = {
  id: 999,
  name: 'Produto de Teste Unitário',
  price: 199.9,
  image: '/teste.jpg',
  category: 'Testes',
  description: 'Este é um produto simulado.',
  stock: 5,
  rating: 5,
  reviews: 0,
};

describe('ProductCard Component', () => {
  it('deve renderizar as informações do produto corretamente', () => {
    render(<ProductCard product={dummyProduct} />);

    expect(screen.getByText('Produto de Teste Unitário')).toBeInTheDocument();

    expect(screen.getByText(/199,90/)).toBeInTheDocument();
  });

  it('deve adicionar ao carrinho ao clicar no botão', () => {
    render(<ProductCard product={dummyProduct} />);

    const addButton = screen.getByText(/ADD/i);

    fireEvent.click(addButton);

    expect(mockAddToCart).toHaveBeenCalledWith(dummyProduct);
  });
});
