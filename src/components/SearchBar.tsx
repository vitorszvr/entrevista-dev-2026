'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

function SearchBarContent({ className = '' }: { className?: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (term: string) => {
    if (pathname === '/') {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }
      replace(`/?${params.toString()}`);
      return;
    }

    if (term.length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    try {
      const res = await fetch('/api/products');
      const products: Product[] = await res.json();
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(term.toLowerCase()),
      );
      setResults(filtered.slice(0, 5));
      setIsOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`relative z-20 ${className}`}>
      <div className="bg-stone-200/40 border border-gray-200 hover:bg-stone-100 transition-colors flex items-center h-10 px-3 md:h-12 md:px-4">
        <Search className="w-4 h-4 text-gray-500 shrink-0" />

        <input
          type="text"
          placeholder="Buscar"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('q')?.toString()}
          className="flex-1 bg-transparent border-none outline-none font-mono text-xs md:text-sm text-emerald-700 ml-3 h-full placeholder:text-gray-400 w-full min-w-0"
          autoComplete="off"
          spellCheck={false}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </div>

      {pathname !== '/' && isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-sm overflow-hidden z-50">
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

export function SearchBar(props: { className?: string }) {
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
