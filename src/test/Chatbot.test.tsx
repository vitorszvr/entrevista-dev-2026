import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Chatbot } from '../components/Chatbot';
import { CartProvider } from '../contexts/CartContext';

window.HTMLElement.prototype.scrollIntoView = vi.fn();

const renderChatbot = () => {
  return render(
    <CartProvider>
      <Chatbot />
    </CartProvider>,
  );
};

describe('Componente Chatbot', () => {
  it('deve abrir a janela do chat ao clicar no botão do terminal', () => {
    renderChatbot();
    const botButton = screen.getByRole('button', { name: /abrir chat/i });
    fireEvent.click(botButton);

    expect(screen.getByText(/DEPLOY_OS/i)).toBeInTheDocument();
  });

  it('deve responder ao comando "todos" exibindo produtos', async () => {
    renderChatbot();
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }));

    const input = screen.getByPlaceholderText(/Digite comando/i);
    fireEvent.change(input, { target: { value: 'todos' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar comando/i }));

    await waitFor(
      () => {
        expect(screen.getByText(/LIST_ALL/i)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  it('deve filtrar por preço quando o usuário digita um valor', async () => {
    renderChatbot();
    fireEvent.click(screen.getByRole('button', { name: /abrir chat/i }));

    const input = screen.getByPlaceholderText(/Digite comando/i);
    fireEvent.change(input, { target: { value: 'até 50 reais' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar comando/i }));

    await waitFor(() => {
      expect(screen.getByText(/PRICE_QUERY/i)).toBeInTheDocument();
    });
  });
});
