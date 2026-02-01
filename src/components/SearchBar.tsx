'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

export function SearchBar() {
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
    <div className="w-full mb-4 relative z-20">
      <div className="bg-stone-200/40 border border-gray-200 transition-colors flex items-center h-12 px-4">
        <Search className="w-4 h-4 text-gray-500 shrink-0" />

        <input
          type="text"
          placeholder="Buscar"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('q')?.toString()}
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-emerald-700 ml-3 h-full placeholder:text-gray-600/80"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
