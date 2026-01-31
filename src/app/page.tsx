import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';

async function getProducts() {
  const res = await fetch('http://localhost:3000/api/products', {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Falha ao carregar');
  return res.json();
}

export default async function Home() {
  const products: Product[] = await getProducts();

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-4 border-gray-200">
        <div className="container mx-auto">
          <h1 className="font-mono font-bold text-sm text-emerald-600 mb-3 flex items-center gap-2">
            <span>~/loja $</span>
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl md:text-4xl font-light text-gray-400">
              cd
            </span>

            <div className="flex items-center">
              <h2 className="text-5xl md:text-6xl font-medium tracking-tighter text-black">
                ESSENCIAIS
              </h2>
              <span className="animate-terminal-blink bg-emerald-600 w-[4px] h-10 md:h-16 block ml-4 "></span>
            </div>
          </div>

          <p className="text-gray-500 max-w-none text-base leading-relaxed font-light lg:whitespace-nowrap">
            Curadoria de itens essenciais para o seu setup: do hardware de alta
            performance à caneca do café sagrado.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 border-t border-l border-gray-200">
          {products.map((product) => (
            <div
              key={product.id}
              className="border-r border-b border-gray-200 relative"
            >
              <ProductCard product={product} />
            </div>
          ))}
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
