export function PromoBanner() {
  return (
    <div className="bg-black px-4 py-3 text-white">
      <p className="text-center text-sm font-medium">
        Ganhe <span className="font-bold">10% de desconto</span> na primeira
        compra com o cupom:
        <span className="ml-2 rounded bg-white/20 px-2 py-0.5 font-mono text-xs font-bold tracking-wide text-white">
          PRIMEIRA10
        </span>
      </p>
    </div>
  );
}
