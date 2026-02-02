'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

/* Adicionei a prop className para podermos estilizar de fora */
export function SearchBar({ className = '' }: { className?: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    replace(`/?${params.toString()}`);
  };

  return (
    /* Removi o 'mb-4' fixo e adicionei a prop className */
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
        />
      </div>
    </div>
  );
}
