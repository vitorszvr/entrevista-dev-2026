import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-gray-200 py-10 mt-auto">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
          <span className="font-mono font-bold tracking-tighter text-lg text-black">
            DEPLOY<span className="text-gray-400 font-light">.store</span>
          </span>
        </div>

        <div className="flex-shrink-0 order-1 md:order-2 mb-4 md:mb-0">
          <div className="relative w-12 h-12 mx-auto">
            <Image
              src="/logo.svg"
              alt="DEPLOY Logo Central"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right order-3">
          <p className="font-mono text-[10px] text-emerald-600 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            Status: Operacional
          </p>
          <p className="font-mono text-[10px] text-gray-400 mt-2 uppercase">
            © 2026 DEPLOY INC. • Vitor S. Vieira
          </p>
        </div>
      </div>
    </footer>
  );
}
