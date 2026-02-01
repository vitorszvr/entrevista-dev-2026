import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import products from '@/data/products.json';
import { Metadata } from 'next';

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = products.find((p) => p.id === Number(params.id));

  if (!product) {
    return { title: 'Produto não encontrado' };
  }

  return {
    title: `${product.name} | DEPLOY.store`,
    description: product.description,
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const product = products.find((p) => p.id === Number(params.id));

  if (!product) return notFound();

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.price);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="py-8 md:py-12">
        <h1 className="font-mono text-sm md:text-base flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="text-emerald-600 font-bold hover:underline transition-all"
          >
            ~/loja/ESSENCIAIS
          </Link>

          <span className="text-gray-400">cat</span>

          <span className="text-black font-medium">'{product.name}'</span>

          <span className="animate-terminal-blink bg-emerald-600 w-2 h-4 md:h-5 block ml-1"></span>
        </h1>
      </div>

      <section className="border-t border-b border-gray-200 grid grid-cols-1 lg:grid-cols-2 bg-white">
        <div className="relative aspect-square lg:aspect-auto lg:h-[600px] border-b lg:border-b-0 lg:border-r border-gray-200 p-8 md:p-12 flex items-center justify-center bg-gray-50/30">
          <div className="relative w-full h-full max-w-md max-h-md">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="flex justify-between items-start mb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-1">
              {product.category}
            </span>
            <span className="font-mono text-xs text-gray-400">
              ID: {product.id.toString().padStart(4, '0')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black mb-4 leading-tight">
            {product.name}
          </h2>

          <div className="text-3xl font-mono font-medium text-black mb-8">
            {formattedPrice}
          </div>

          <p className="text-gray-600 leading-relaxed mb-10 border-l-2 border-gray-200 pl-4">
            {product.description}
          </p>

          <div className="mb-10 space-y-3 font-mono text-xs md:text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">STATUS</span>
              <span className="text-emerald-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                DISPONÍVEL ({product.stock})
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">ENTREGA</span>
              <span className="text-black">IMEDIATA</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">GARANTIA</span>
              <span className="text-black">12 MESES</span>
            </div>
          </div>

          <button className="w-full bg-black hover:bg-[#f3350c] text-white font-mono font-bold py-5 transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-3 group">
            <span>[ Adicionar ao Setup ]</span>
          </button>
        </div>
      </section>

      <div className="py-8 text-center md:text-left">
        <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">
          root@deploy:~/products/{product.id}# _
        </p>
      </div>
    </div>
  );
}
