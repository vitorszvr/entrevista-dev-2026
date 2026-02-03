import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { SearchBar } from '@/components/SearchBar';
import productsData from '@/data/products.json';
import { HeroSection } from '@/components/HeroSection';

export default async function Home(props: {
  searchParams?: Promise<{ q?: string; category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const category = searchParams?.category || '';
  const allProducts: Product[] = productsData;
  const products = allProducts.filter((product) => {
    const term = query.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term);
    const matchesCategory = category ? product.category === category : true;

    return matchesSearch && matchesCategory;
  });
  const displayTitle = category && category !== 'Todos' ? category : 'CATÁLOGO';

  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSection />
      <SearchBar className="w-full mb-10 mt-6 md:mt-10" />
      <section className="border-b border-gray-200 mb-20">
        <div className="mb-6 flex items-baseline gap-3">
          <h2 className="font-mono text-lg md:text-2xl font-bold text-black uppercase leading-none tracking-tight">
            {displayTitle}
          </h2>
          <span className="font-mono text-xs md:text-sm text-gray-400 leading-none">
            // {products.length} {products.length === 1 ? 'item' : 'itens'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-t border-l border-gray-200">
          {products.map((product) => (
            <div
              key={product.id}
              className="border-r border-b border-gray-200 relative"
            >
              <ProductCard product={product} />
            </div>
          ))}

          {products.length === 0 && (
            <div className="col-span-full py-20 text-center border-r border-b border-gray-200">
              <p className="font-mono text-gray-400 mb-4">
                Nenhum item encontrado.
              </p>
              <a
                href="/"
                className="inline-block px-4 py-2 bg-black text-white text-xs font-mono hover:bg-emerald-600 transition-colors"
              >
                [ LIMPAR TUDO ]
              </a>
            </div>
          )}
        </div>
        <div className="py-8 text-center bg-gray-50/30">
          <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
            ~ Fim da lista ~
          </p>
        </div>
      </section>
    </div>
  );
}
