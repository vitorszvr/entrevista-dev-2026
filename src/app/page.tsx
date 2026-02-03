import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { SearchBar } from '@/components/SearchBar';
import productsData from '@/data/products.json';
import { HeroSection } from '@/components/HeroSection'; // Importar o novo componente

export default async function Home(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';

  const allProducts: Product[] = productsData;

  const products = allProducts.filter((product) => {
    const term = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Componente Hero isolado (Client Component) */}
      <HeroSection />

      <SearchBar className="mb-8 w-full" />

      <section className="border-b border-gray-200 mb-20">
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
              <p className="font-mono text-gray-400">
                Nenhum item encontrado para "{query}"
              </p>
            </div>
          )}
        </div>

        <div className="py-8 text-center bg-gray-50/30">
          <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
            Fim da lista • {products.length} produtos carregados
          </p>
        </div>
      </section>
    </div>
  );
}
