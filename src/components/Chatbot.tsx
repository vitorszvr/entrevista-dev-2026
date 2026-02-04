'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  Send,
  Bot,
  Terminal,
  ArrowRight,
  CornerDownLeft,
} from 'lucide-react';
import productsData from '@/data/products.json';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { ProductImage } from './ProductImage';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  relatedProducts?: Product[];
  quickActions?: QuickAction[];
  timestamp: Date;
}

interface QuickAction {
  label: string;
  action: string;
}

interface ConversationContext {
  lastCategory?: string;
  viewedProducts: number[];
}

export function Chatbot() {
  const { isCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      setIsOpen(false);
    }
  }, [isCartOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (isOpen && window.innerWidth < 768) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const allProducts: Product[] = productsData as Product[];

  const availableCategories = useMemo(() => {
    const cats = new Set(allProducts.map((p) => p.category.toLowerCase()));
    return Array.from(cats);
  }, [allProducts]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content:
        'SYSTEM_READY... Olá! Sou o assistente da DEPLOY. Digite o que procura ou escolha uma opção rápida:',
      quickActions: [
        { label: '[ VER TODOS ]', action: 'todos' },
        { label: '[ TECLADOS ]', action: 'teclado' },
        { label: '[ MOUSES ]', action: 'mouse' },
      ],
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ConversationContext>({
    viewedProducts: [],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current && window.innerWidth >= 768) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, isTyping, isOpen]);

  const analyzeIntent = (text: string) => {
    const lowerText = text.toLowerCase();

    if (
      ['todos', 'tudo', 'lista', 'catalogo', 'populares', 'ver todos'].some(
        (t) => lowerText.includes(t),
      )
    ) {
      return { type: 'show_all' };
    }

    const priceMatch = lowerText.match(
      /(?:entre|de|faixa de)?\s*(\d+)\s*(?:a|e|até|-)?\s*(\d+)?/,
    );
    const hasCurrencyTerms = [
      'real',
      'reais',
      'custo',
      'preço',
      'valor',
      'barato',
      'caro',
      'até',
      'menos',
    ].some((t) => lowerText.includes(t));

    if (priceMatch && hasCurrencyTerms) {
      const val1 = parseInt(priceMatch[1]);
      const val2 = priceMatch[2] ? parseInt(priceMatch[2]) : null;
      if (val2) return { type: 'price_filter', min: val1, max: val2 };
      if (
        lowerText.includes('menos') ||
        lowerText.includes('até') ||
        lowerText.includes('abaixo')
      ) {
        return { type: 'price_filter', min: 0, max: val1 };
      }
      if (lowerText.includes('mais') || lowerText.includes('acima')) {
        return { type: 'price_filter', min: val1, max: 10000 };
      }
    }

    if (
      ['recomend', 'sugest', 'melhor', 'indica'].some((t) =>
        lowerText.includes(t),
      )
    ) {
      return { type: 'recommendation' };
    }

    const foundCategory = availableCategories.find((cat) =>
      lowerText.includes(cat),
    );
    if (foundCategory) {
      return { type: 'category_search', category: foundCategory };
    }

    return { type: 'general_search' };
  };

  const generateResponse = (
    text: string,
    currentContext: ConversationContext,
  ) => {
    const lowerText = text.toLowerCase();
    const intent = analyzeIntent(text);

    let foundProducts = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerText) ||
        p.category.toLowerCase().includes(lowerText) ||
        p.description.toLowerCase().includes(lowerText),
    );

    if (intent.type === 'show_all') {
      const topProducts = allProducts.slice(0, 4);
      return {
        text: `// LIST_ALL: Exibindo ${allProducts.length} itens do catálogo. Destaques:`,
        products: topProducts,
        actions: [{ label: '[ FILTRAR POR PREÇO ]', action: 'até 100 reais' }],
      };
    }

    if (
      (lowerText === 'sim' || lowerText.includes('ver mais')) &&
      currentContext.lastCategory
    ) {
      intent.type = 'category_search';
      Object.assign(intent, { category: currentContext.lastCategory });
    }

    if (intent.type === 'price_filter') {
      const { min, max } = intent as { min: number; max: number };
      foundProducts = allProducts.filter(
        (p) => p.price >= min && p.price <= max,
      );

      if (foundProducts.length > 0) {
        return {
          text: `// PRICE_QUERY: ${foundProducts.length} itens entre R$ ${min} e R$ ${max}:`,
          products: foundProducts.slice(0, 4),
          actions: [{ label: '[ MENOR PREÇO ]', action: 'ordenar barato' }],
        };
      }
      return {
        text: `// ERROR_404: Nenhum produto nessa faixa (R$ ${min} - R$ ${max}). Tente outro valor.`,
        products: [],
        actions: [{ label: '[ VER TUDO ]', action: 'todos' }],
      };
    }

    if (intent.type === 'recommendation') {
      const topRated = [...allProducts]
        .sort((a, b) => ((b as any).rating || 0) - ((a as any).rating || 0))
        .slice(0, 3);

      return {
        text: '// RECOMENDATION_ENGINE: Itens com melhores avaliações carregados.',
        products: topRated,
        actions: [{ label: '[ VER MAIS VENDIDOS ]', action: 'todos' }],
      };
    }

    if (intent.type === 'category_search' && 'category' in intent) {
      const cat = (intent as any).category;
      const catProducts = allProducts.filter(
        (p) =>
          p.category.toLowerCase().includes(cat) ||
          p.name.toLowerCase().includes(cat),
      );

      if (catProducts.length > 0) {
        return {
          text: `cd /loja/${cat} \n// Listando itens relacionados:`,
          products: catProducts.slice(0, 4),
          meta: { setCategory: cat },
          actions: [
            { label: `[ + ${cat.toUpperCase()} ]`, action: `mais ${cat}` },
          ],
        };
      }
    }

    if (foundProducts.length > 0) {
      return {
        text: `// SEARCH_RESULT: Encontrei estes itens para "${text}":`,
        products: foundProducts.slice(0, 4),
      };
    }

    const randomSuggestions = [...allProducts]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return {
      text: `ERR_NO_MATCH: "${text}" não retornou resultados. \n// Talvez você goste disto:`,
      products: randomSuggestions,
      actions: [{ label: '[ LISTAR TUDO ]', action: 'todos' }],
    };
  };

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text, context);

      if (response.meta?.setCategory) {
        setContext((prev) => ({
          ...prev,
          lastCategory: response.meta.setCategory,
        }));
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.text,
        relatedProducts: response.products,
        quickActions: response.actions,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-59 md:hidden transition-opacity duration-300 backdrop-blur-sm
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
      />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-60 w-14 h-14 flex items-center justify-center 
          border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] 
          transition-all duration-200 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none
          rounded-none 
          mb-[env(safe-area-inset-bottom)] 
          ${isCartOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          ${
            isOpen
              ? 'bg-red-600 hover:bg-red-700 text-white border-red-800'
              : 'bg-black text-white border-black'
          }
        `}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Terminal className="w-6 h-6" />}
      </button>

      <div
        className={`fixed 
        bottom-[calc(6rem+env(safe-area-inset-bottom))] left-4 right-4 
        md:bottom-24 md:left-auto md:right-6 md:w-95
        w-[calc(100vw-32px)] md:max-w-125
        bg-stone-50 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
        rounded-none overflow-hidden z-60 transition-all duration-300 origin-bottom-right flex flex-col
        ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}
        `}
        style={{ height: 'min(600px, 75dvh)' }}
      >
        <div className="bg-black p-4 flex items-center justify-between border-b-2 border-black shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 flex items-center justify-center rounded-none border border-emerald-400">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-mono font-bold text-sm tracking-widest">
                DEPLOY_OS{' '}
                <span className="text-emerald-500 text-[10px]">IA</span>
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 animate-pulse rounded-none"></span>
                <span className="text-xs text-stone-400 font-mono uppercase">
                  Online
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-stone-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-stone-100/50 scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 max-w-[90%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">
                {msg.role === 'user' ? 'USER' : 'SYSTEM'}
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>

              <div
                className={`p-4 text-xs md:text-sm font-mono leading-relaxed border rounded-none shadow-sm
                  ${
                    msg.role === 'user'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 border-l-4 border-l-emerald-500'
                  }
                `}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.quickActions && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(action.action)}
                      className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-200 border border-stone-300 text-black hover:bg-black hover:text-emerald-400 hover:border-black transition-all rounded-none"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              {msg.relatedProducts && msg.relatedProducts.length > 0 && (
                <div className="flex flex-col gap-2 w-full mt-2">
                  {msg.relatedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex gap-3 p-2 bg-white border border-gray-300 hover:border-emerald-600 transition-all rounded-none group cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="w-12 h-12 bg-gray-100 shrink-0 relative border border-gray-100">
                        <ProductImage
                          product={product}
                          fill
                          className="object-contain p-1"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-xs font-bold text-black font-mono truncate group-hover:text-emerald-600 transition-colors uppercase">
                          {product.name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-black font-mono font-bold">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(product.price)}
                          </p>
                          <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-emerald-600 -rotate-45 group-hover:rotate-0 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start self-start">
              <div className="bg-stone-200 px-3 py-2 border border-gray-300 rounded-none">
                <span className="font-mono text-xs animate-pulse">
                  PROCESSANDO...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-white border-t-2 border-black shrink-0">
          <div className="relative flex items-center gap-2">
            <span className="text-emerald-600 font-bold font-mono text-lg">
              {'>'}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite comando..."
              className="flex-1 bg-transparent border-none outline-none text-base md:text-sm py-2 text-black font-mono placeholder:text-gray-400 uppercase"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="p-2 bg-black text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-none"
            >
              {inputValue.trim() ? (
                <Send className="w-4 h-4" />
              ) : (
                <CornerDownLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
