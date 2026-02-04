'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, Filter, Check } from 'lucide-react';
import { useState, Suspense, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

const CATEGORIES = [
  'Todos',
  'Vestuario',
  'Acessorios',
  'Perifericos',
  'Audio',
  'Ergonomia',
  'Monitores',
];

interface SearchBarProps {
  className?: string;
  showFilter?: boolean;
}

function SearchBarContent({
  className = '',
  showFilter = true,
}: SearchBarProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Estado para controlar o texto do input
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

  const [results, setResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const currentCategory = searchParams.get('category') || 'Todos';

  // 2. Sincroniza o input com a URL.
  // Se você clicar em "Limpar Tudo", a URL muda, e isso limpa o input.
  useEffect(() => {
    setInputValue(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (term: string) => {
    // Atualiza o visual imediatamente
    setInputValue(term);

    if (pathname === '/') {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }
      replace(`/?${params.toString()}`, { scroll: false });
      return;
    }

    if (term.length === 0) {
      setResults([]);
      setIsSearchOpen(false);
      return;
    }

    try {
      const res = await fetch('/api/products');
      const products: Product[] = await res.json();
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(term.toLowerCase()),
      );
      setResults(filtered.slice(0, 5));
      setIsSearchOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategorySelect = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'Todos') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    replace(`/?${params.toString()}`, { scroll: false });
    setIsFilterOpen(false);
  };

  return (
    <div className={`relative z-20 ${className}`} ref={dropdownRef}>
      <div className="bg-stone-200/40 border border-gray-200 hover:bg-stone-100 transition-colors flex items-center h-10 md:h-12 relative">
        <div className="pl-3 md:pl-4 shrink-0">
          <Search className="w-4 h-4 text-gray-500" />
        </div>

        <input
          type="text"
          placeholder={
            showFilter && currentCategory !== 'Todos'
              ? `Buscar em ${currentCategory}`
              : 'Buscar'
          }
          // 3. Input agora é controlado pelo state
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none font-mono text-xs md:text-sm text-emerald-700 px-3 h-full placeholder:text-gray-400 w-full min-w-0"
          autoComplete="off"
          spellCheck={false}
          onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
        />
        {showFilter && (
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`
              h-full px-3 md:px-5 border-l border-gray-200 flex items-center justify-center gap-2 cursor-pointer transition-colors
              ${isFilterOpen || currentCategory !== 'Todos' ? 'bg-stone-200/50 text-emerald-700' : 'hover:bg-stone-200/40 text-gray-500'}
            `}
            title="Filtrar"
          >
            <span className="font-mono text-[10px] font-bold uppercase hidden md:block">
              {currentCategory !== 'Todos' ? currentCategory : 'Filtros'}
            </span>
            <Filter className="w-4 h-4" />
          </button>
        )}
      </div>
      {showFilter && isFilterOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                Categorias
              </span>
            </div>
            {CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`
                    w-full text-left px-4 py-2 text-xs font-mono font-medium hover:bg-stone-50 transition-colors flex items-center justify-between
                    ${isActive ? 'text-emerald-700 bg-emerald-50/40' : 'text-gray-700'}
                  `}
                >
                  {cat}
                  {isActive && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {pathname !== '/' && isSearchOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-sm overflow-hidden z-40">
          <ul>
            {results.map((product) => (
              <li
                key={product.id}
                className="border-b border-gray-50 last:border-0"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-stone-50 transition-colors"
                >
                  <div className="relative w-10 h-10 shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex justify-between items-center w-full min-w-0">
                    <span className="text-sm font-medium text-gray-900 truncate pr-4">
                      {product.name}
                    </span>
                    <span className="text-xs font-mono text-emerald-700 bg-stone-200/40 px-2 py-1 rounded shrink-0">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(product.price)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SearchBar(props: SearchBarProps) {
  return (
    <Suspense
      fallback={
        <div
          className={`h-10 md:h-12 bg-stone-200/40 border border-gray-200 ${props.className || ''}`}
        />
      }
    >
      <SearchBarContent {...props} />
    </Suspense>
  );
}
