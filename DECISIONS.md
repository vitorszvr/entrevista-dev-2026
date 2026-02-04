# Decisões Técnicas - DEPLOY.store

Este documento detalha as escolhas arquiteturais e técnicas do projeto.

---

## 🏗️ Arquitetura

### App Router (Next.js 13+)

Optei pelo App Router em vez do Pages Router por:

- **Server Components por padrão**: Melhor performance inicial
- **Layouts aninhados**: Compartilhamento de UI entre rotas
- **Loading states**: UI de carregamento declarativa
- **Streaming SSR**: Renderização progressiva
- **Colocation**: Componentes próximos às rotas que os usam

### API Routes no Next.js

Ao invés de criar um servidor Express/Fastify separado:

**Vantagens:**

- Mesma base de código (frontend + backend)
- Deploy unificado (uma única plataforma)
- Tipos TypeScript compartilhados
- Zero configuração de CORS
- Edge runtime disponível

**Implementação:**

```typescript
// src/app/api/products/route.ts
export async function GET() {
  const allProducts: Product[] = products;
  return NextResponse.json(allProducts);
}
```

---

## 🎨 Estilização

### Tailwind CSS 4.0

Escolhi Tailwind pela produtividade, mas com considerações importantes:

**Configuração:**

```javascript
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**Customizações:**

- Classes utilitárias personalizadas em `globals.css`
- Animações customizadas (blink, slideIn)
- Estilos de scrollbar personalizados
- Abordagem mobile-first em todos os componentes

**Por que não CSS-in-JS (styled-components, emotion)?**

- Tailwind gera CSS estático (melhor performance)
- Sem runtime JavaScript para estilos
- Autocomplete no editor
- Bundle menor em produção

---

## 🧠 Gerenciamento de Estado

### Context API vs Zustand/Redux

Escolhi **Context API** porque:

1. **Escopo do projeto**: Estado do carrinho é relativamente simples
2. **Zero dependências**: Nativo do React
3. **Adequado para a aplicação**: Um único contexto global
4. **Performance suficiente**: Re-renders controlados com useMemo

**Estrutura do CartContext:**

```typescript
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, options?: { silent?: boolean }) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  cartCount: number;
  isCartOpen: boolean;
  toastMessage: string | null;
  appliedCoupon: string | null;
  // ... mais métodos
}
```

**Se o projeto crescesse**, migraria para Zustand:

- Menos boilerplate
- Melhor performance com muitos consumidores
- DevTools integradas

---

## 💰 Precisão Monetária

### Por que calcular em centavos?

JavaScript tem problemas com aritmética de ponto flutuante:

```javascript
// ❌ ERRADO
0.1 +
  0.2(
    // = 0.30000000000004

    // ✅ CORRETO
    10 + 20,
  ) /
    100; // = 0.3
```

**Implementação:**

```typescript
const toCents = (price: number) => Math.round(price * 100);

const subtotalCents = cart.reduce((acc, item) => {
  return acc + toCents(item.price) * item.quantity;
}, 0);

const formatMoneyFromCents = (valueInCents: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInCents / 100);
```

**Benefícios:**

- Cálculos sempre exatos
- Sem erros de arredondamento
- Compatível com sistemas de pagamento (que trabalham em centavos)

---

## 🔍 Sistema de Busca e Filtros

### Estratégia de Implementação

**Na Home (página principal):**

- Filtros via query params (`?q=teclado&category=Perifericos`)
- Filtro server-side (renderização no servidor)
- Sem scroll ao aplicar filtros (`scroll={false}` no Link)

**Em outras páginas:**

- Busca client-side com fetch para `/api/products`
- Dropdown de resultados em tempo real
- Debounce implícito (sem biblioteca externa)

**Por que essa abordagem híbrida?**

- Home: SEO otimizado, URLs compartilháveis
- Outras páginas: UX mais rápida e responsiva

### Controle de Estado da Busca

```typescript
const [inputValue, setInputValue] = useState('');

useEffect(() => {
  setInputValue(searchParams.get('q') || '');
}, [searchParams]);
```

**Problema resolvido:**

- Sincronização entre URL e input
- Limpar input ao clicar em "Limpar Tudo"
- Manter valor ao navegar entre páginas

---

## 🛒 Lógica do Carrinho

### Validação de Estoque

```typescript
const handleAddToCart = (product: Product) => {
  setCart((prev) => {
    const itemExists = prev.find((item) => item.id === product.id);

    if (itemExists && itemExists.quantity >= product.stock) {
      showToast('Estoque máximo atingido!', 'error');
      return prev; // Não adiciona
    }

    // ... continua
  });
};
```

**Considerações:**

- Validação no frontend (UX)
- Em produção: também validar no backend
- Estoque em tempo real via API

### Persistência no localStorage

```typescript
// Carregar do localStorage (com validação)
useEffect(() => {
  const savedCart = localStorage.getItem('deploy-cart');
  if (savedCart) {
    try {
      const parsed = JSON.parse(savedCart);
      if (Array.isArray(parsed) && parsed.every(isValidCartItem)) {
        setCart(parsed);
      } else {
        localStorage.removeItem('deploy-cart'); // Dados inválidos
      }
    } catch {
      localStorage.removeItem('deploy-cart'); // JSON corrompido
    }
  }
}, []);

// Salvar no localStorage
useEffect(() => {
  localStorage.setItem('deploy-cart', JSON.stringify(cart));
}, [cart]);
```

**Type Guards:**

```typescript
export function isValidCartItem(data: unknown): data is CartItem {
  return (
    isValidProduct(data) && typeof (data as CartItem).quantity === 'number'
  );
}
```

---

## 🤖 Sistema de IA - Chatbot

### Análise de Intenção

Implementei um sistema simples de NLU (Natural Language Understanding):

```typescript
const analyzeIntent = (text: string) => {
  const lowerText = text.toLowerCase();

  // Detecção de filtro de preço
  const priceMatch = lowerText.match(/(\d+)\s*(?:a|e|até)?\s*(\d+)?/);
  const hasCurrencyTerms = ['real', 'preço', 'barato'].some((t) =>
    lowerText.includes(t),
  );

  if (priceMatch && hasCurrencyTerms) {
    return { type: 'price_filter', min: val1, max: val2 };
  }

  // Detecção de categoria
  const foundCategory = availableCategories.find((cat) =>
    lowerText.includes(cat),
  );

  if (foundCategory) {
    return { type: 'category_search', category: foundCategory };
  }

  // ... outros padrões
};
```

**Padrões Reconhecidos:**

1. **Listar tudo**: "todos", "catálogo", "lista"
2. **Filtro de preço**: "até 100 reais", "entre 50 e 200"
3. **Categoria**: "teclado", "mouse", "monitor"
4. **Recomendação**: "melhor", "recomenda", "sugere"
5. **Busca geral**: Qualquer termo que não se encaixa acima

### Contexto Conversacional

```typescript
interface ConversationContext {
  lastCategory?: string;
  viewedProducts: number[];
}
```

Permite continuidade:

```
Usuário: "teclados"
Bot: [Mostra teclados] "Ver mais?"
Usuário: "sim"
Bot: [Mostra mais teclados do contexto anterior]
```

---

## 🎯 SEO e Performance

### Metadata Dinâmica

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = products.find((p) => p.id === Number(params.id));

  return {
    title: `${product.name} | DEPLOY.store`,
    description: product.description,
  };
}
```

**Benefícios:**

- Meta tags específicas por produto
- Melhores resultados nos mecanismos de busca
- Prévias ricas ao compartilhar links

### Static Site Generation (SSG)

```typescript
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}
```

**O que isso faz:**

- Pré-renderiza todas as 10 páginas de produtos no build
- HTML estático servido instantaneamente
- Melhor Core Web Vitals (LCP, FID, CLS)

### Otimização de Imagens

```tsx
<Image
  src={product.image}
  alt={product.name}
  fill
  className="object-contain"
  priority // Para imagens above-the-fold
  sizes="(max-width: 1024px) 100vw, 50vw"
/>
```

**Recursos automáticos:**

- WebP/AVIF quando suportado
- Lazy loading (exceto com `priority`)
- Responsividade automática
- Placeholder blur (opcional)

---

## 📱 Responsividade

### Mobile-First Approach

Todos os estilos base são para mobile, com breakpoints para desktop:

```tsx
<div className="
  text-sm          // Mobile: 14px
  md:text-base     // Desktop: 16px

  p-4              // Mobile: padding 16px
  md:p-6           // Desktop: padding 24px

  grid-cols-2      // Mobile: 2 colunas
  lg:grid-cols-5   // Desktop: 5 colunas
">
```

### Safe Areas (iOS notch)

```css
.fixed.bottom-6 {
  margin-bottom: env(safe-area-inset-bottom);
}
```

Garante que botões flutuantes não fiquem sob o notch do iPhone.

### Drawer vs Modal

**Carrinho:**

- Mobile: Full screen overlay
- Desktop: Sidebar à direita (max-width: 28rem)

```tsx
className={`
  fixed inset-0        // Mobile: tela inteira
  md:right-6           // Desktop: afastado da borda
  md:w-[380px]         // Desktop: largura fixa
`}
```

---

## 🧪 Testes

### Vitest (Testes Unitários)

**Por que Vitest?**

- Compatível com Vite/Next.js
- Mais rápido que Jest
- API similar ao Jest (fácil migração)
- Suporte nativo a ESM

**Exemplo de teste:**

```typescript
describe('ProductCard Component', () => {
  it('deve adicionar ao carrinho ao clicar no botão', () => {
    render(<ProductCard product={dummyProduct} />);

    const addButton = screen.getByText(/ADD/i);
    fireEvent.click(addButton);

    expect(mockAddToCart).toHaveBeenCalledWith(dummyProduct);
  });
});
```

### Playwright (Testes E2E)

**Configuração:**

```typescript
export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

**Teste de fluxo completo:**

```typescript
test('Fluxo completo de compra (E2E)', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Adiciona produtos
  await page.getByRole('button', { name: '[ ADD ] +' }).first().click();

  // Abre carrinho
  await page.getByRole('button', { name: 'Abrir carrinho' }).click();

  // Aplica cupom
  await page.getByPlaceholder('Cupom de desconto').fill('PRIMEIRA10');
  await page.getByRole('button', { name: 'Aplicar' }).click();

  // Verifica desconto aplicado
  await expect(page.getByText('Desconto (PRIMEIRA10)')).toBeVisible();
});
```

---

## 🔒 TypeScript

### Benefícios da Tipagem Forte

**1. Autocomplete no editor:**

```typescript
const { addToCart, cartCount } = useCart();
//      ^ IDE sugere todos os métodos disponíveis
```

**2. Detecção de erros em tempo de desenvolvimento:**

```typescript
addToCart(product.name); // ❌ Erro: esperado Product, recebeu string
addToCart(product); // ✅ Correto
```

**3. Refatoração segura:**

- Renomear propriedades atualiza todos os usos
- Mudanças de interface detectadas instantaneamente

**4. Documentação viva:**

```typescript
interface Product {
  id: number;
  name: string;
  price: number; // Sempre em reais (não centavos)
  description: string;
  image: string;
  category: string;
  stock: number; // Quantidade disponível
}
```

### Type Guards para Runtime Safety

```typescript
export function isValidProduct(data: unknown): data is Product {
  if (typeof data !== 'object' || data === null) return false;

  const p = data as Product;
  return (
    typeof p.id === 'number' &&
    typeof p.name === 'string' &&
    typeof p.price === 'number'
    // ... validações
  );
}
```

Usado para validar dados do localStorage ou APIs externas.

---

## 🎨 Sistema de Design

### Design Tokens (via Tailwind)

**Cores:**

```javascript
colors: {
  emerald: { 600: '#10B981' },  // CTA principal
  stone: { 50: '#FAFAF9' },     // Background
  gray: { /* escala completa */ },
}
```

**Espaçamento:**

- Escala de 4px (4, 8, 12, 16, 24, 32...)
- Consistência em padding/margin

**Tipografia:**

```typescript
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  mono: ['Courier New', 'monospace'],
}
```

### Animações Customizadas

```css
@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

.animate-terminal-blink {
  animation: blink 1s infinite;
}
```

Usado no cursor piscante dos títulos principais.

---

## 🚀 Performance

### Métricas Alvo (Core Web Vitals)

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Otimizações Aplicadas

1. **Code Splitting Automático** (Next.js)
   - Cada rota = bundle separado
   - Carregamento sob demanda

2. **Suspense Boundaries**

   ```tsx
   <Suspense fallback={<ProductSkeleton />}>
     <ProductList />
   </Suspense>
   ```

3. **Memoização**

   ```typescript
   const subtotalCents = useMemo(() => {
     return cart.reduce(/* ... */);
   }, [cart]);
   ```

4. **Debounce Implícito**
   - setTimeout para busca em tempo real
   - Evita requests excessivos

---

## 🔐 Segurança

### Considerações Implementadas

1. **XSS Prevention**
   - React escapa JSX automaticamente
   - Não usar `dangerouslySetInnerHTML`

2. **Type Safety**
   - Validação de entrada do localStorage
   - Type guards para dados externos

3. **Validação Client-Side**
   - Estoque máximo
   - Cupons válidos
   - Inputs sanitizados

### O que faltaria em produção:

- [ ] Validação server-side de estoque
- [ ] Rate limiting na API
- [ ] CSRF tokens
- [ ] Content Security Policy (CSP)
- [ ] Sanitização de inputs de busca

---

## 📊 Acessibilidade (a11y)

### Práticas Implementadas

**1. ARIA Labels:**

```tsx
<button onClick={openCart} aria-label="Abrir carrinho">
  <ShoppingBag />
</button>
```

**2. Roles Semânticos:**

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-label="Carrinho de compras"
>
```

**3. Navegação por Teclado:**

- Todos os botões são `<button>` (não `<div onClick>`)
- Links são `<Link>` ou `<a>`
- Foco visível em elementos interativos

**4. Contraste de Cores:**

- Texto preto (#000) em fundo claro (stone-50)
- Botões com contraste mínimo 4.5:1

**5. Estados de Loading:**

```tsx
{
  isTyping && <p>Carregando...</p>;
}
```

---

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Componente UI  │ ──────┐
└─────────────────┘       │
       │                  │
       │ useCart()        │ setState
       ▼                  │
┌─────────────────┐       │
│  CartContext    │◄──────┘
└─────────────────┘
       │
       │ useEffect
       ▼
┌─────────────────┐
│  localStorage   │
└─────────────────┘
```

---

## 📝 Convenções de Código

### Nomenclatura

- **Componentes**: PascalCase (`ProductCard.tsx`)
- **Funções**: camelCase (`addToCart`)
- **Constantes**: UPPER_SNAKE_CASE (`CATEGORIES`)
- **Arquivos**: kebab-case quando apropriado

### Estrutura de Componentes

```tsx
// 1. Imports
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

// 2. Types/Interfaces
interface Props {
  product: Product;
}

// 3. Component
export function ProductCard({ product }: Props) {
  // 3.1. Hooks
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  // 3.2. Handlers
  const handleClick = () => {
    addToCart(product);
  };

  // 3.3. Render
  return <div>{/* JSX */}</div>;
}
```

### Git Commits (Conventional Commits)

```
feat: adiciona sistema de cupons de desconto
fix: corrige cálculo do total em centavos
docs: atualiza README com instruções de deploy
refactor: move lógica de cálculo para utils
test: adiciona testes E2E do fluxo de compra
```

---

## 🎓 Aprendizados

### Desafios Encontrados

1. **Precisão monetária em JavaScript**
   - Solução: Cálculos em centavos

2. **Sincronização de estado entre URL e input**
   - Solução: useEffect com searchParams como dependência

3. **Overflow do body ao abrir modais**
   - Solução: `document.body.style.overflow = 'hidden'`

4. **Safe areas em Mobile**
   - Solução: `env(safe-area-inset-bottom)`
