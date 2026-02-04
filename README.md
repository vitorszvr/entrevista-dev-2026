# DEPLOY.store - Mini E-commerce

> Desafio Técnico - Desenvolvedor Frontend Júnior | Uncode

**Deploy:** [deploystore-iota.vercel.app](https://deploystore-iota.vercel.app/)

---

## 📋 Sobre o Projeto

DEPLOY.store é um mini e-commerce funcional desenvolvido como parte de um desafio técnico. O projeto simula uma loja online especializada em produtos para desenvolvedores, com funcionalidades completas de catálogo, carrinho de compras e sistema de cupons.

---

## 🎯 Por que Next.js?

Escolhi **Next.js** como framework principal pelos seguintes motivos:

### Vantagens Técnicas

- **SSR & SSG**: Renderização no servidor e geração estática de páginas para melhor SEO e performance
- **API Routes**: Permite criar endpoints de API no mesmo projeto, simplificando a arquitetura
- **File-based Routing**: Sistema de rotas intuitivo baseado na estrutura de pastas
- **Otimização de Imagens**: Componente `<Image>` nativo com lazy loading e otimização automática
- **TypeScript**: Suporte nativo e de primeira classe para TypeScript

### Adequação ao Desafio

- Atende perfeitamente aos requisitos de servidor/API (Next.js API Routes)
- Ecossistema maduro com excelente documentação
- Deploy simplificado na Vercel (plataforma dos próprios criadores do Next.js)
- Grande adoção no mercado, especialmente em e-commerce

---

## 📁 Estrutura de Pastas

```
src/
├── app/
│   ├── api/
│   │   └── products/          # API Routes
│   │       ├── route.ts       # GET /api/products
│   │       └── [id]/
│   │           └── route.ts   # GET /api/products/:id
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx       # Página de detalhes do produto
│   ├── globals.css            # Estilos globais + Tailwind
│   ├── layout.tsx             # Layout principal com providers
│   └── page.tsx               # Home com listagem de produtos
│
├── components/
│   ├── AddToCartButton.tsx    # Botão de adicionar ao carrinho
│   ├── CartSidebar.tsx        # Drawer do carrinho
│   ├── Chatbot.tsx            # Assistente IA (diferencial)
│   ├── Footer.tsx             # Rodapé
│   ├── Header.tsx             # Cabeçalho com carrinho
│   ├── HeroSection.tsx        # Seção hero da home
│   ├── ProductCard.tsx        # Card de produto
│   ├── PromoBanner.tsx        # Banner de promoção
│   ├── SearchBar.tsx          # Barra de busca e filtros
│   └── Toast.tsx              # Notificações
│
├── contexts/
│   └── CartContext.tsx        # Context API para estado do carrinho
│
├── data/
│   └── products.json          # Dados dos produtos
│
├── test/
│   ├── ProductCard.test.tsx   # Testes unitários
│   ├── cart.test.ts           # Testes de lógica
│   └── setup.ts               # Configuração do Vitest
│
└── types/
    └── index.ts               # Definições de tipos TypeScript
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+ instalado
- npm, yarn ou pnpm

### Instalação

```bash
# Clone o repositório
git clone [seu-repositorio]
cd [nome-do-projeto]

# Instale as dependências
npm install
# ou
yarn install
# ou
pnpm install

# Rode o projeto em modo desenvolvimento
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

O projeto estará disponível em `http://localhost:3000`

### Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa o linter
npm run test     # Executa testes unitários
npx playwright test  # Executa testes E2E
```

---

## 🌐 Deploy

O projeto está publicado em: [deploystore-iota.vercel.app](https://deploystore-iota.vercel.app/)

### Plataforma Utilizada

- **Vercel** - Deploy automático integrado com Git

### Processo de Deploy

1. Conectar repositório GitHub à Vercel
2. Configuração automática detectada (Next.js)
3. Deploy realizado a cada push na branch main
4. URL gerada automaticamente

---

## 💡 Decisões Técnicas

### 1. Gerenciamento de Estado

**Context API** foi escolhida para o estado do carrinho por:

- Nativa do React (sem dependências extras)
- Adequada para o escopo do projeto
- Evita prop drilling
- Suficiente para um estado global simples como carrinho

### 2. Estilização

**Tailwind CSS** pela:

- Produtividade no desenvolvimento
- Design system consistente via utility classes
- Responsividade mobile-first facilitada
- Bundle final otimizado (apenas classes utilizadas)
- Customização fácil via config

### 3. Persistência de Dados

- **localStorage** para persistir carrinho entre sessões
- Validação de dados com type guards antes de carregar do storage
- Tratamento de erros para evitar crashes com dados corrompidos

### 4. Cálculos Monetários

Implementação em **centavos** para evitar problemas de precisão com JavaScript:

```typescript
const toCents = (price: number) => Math.round(price * 100);
const totalCents = items.reduce(
  (acc, item) => acc + toCents(item.price) * item.quantity,
  0,
);
```

### 5. SEO e Performance

- **Metadata dinâmica** nas páginas de produto
- **generateStaticParams** para pré-renderizar todas as páginas de produtos
- Componente `<Image>` do Next.js com otimização automática
- Lazy loading de imagens

### 6. Responsividade

- **Mobile-first approach** em todos os componentes
- Breakpoints: 375px (mobile) e 1440px+ (desktop)
- Menu hambúrguer e adaptações de layout para telas pequenas

### 7. Acessibilidade (a11y)

- Labels ARIA em botões de ícone
- Roles semânticos (dialog, button)
- Navegação por teclado no carrinho
- Contraste adequado de cores

### 8. TypeScript

Tipagem forte em todo o projeto:

- Interfaces para Product e CartItem
- Type guards para validação em runtime
- Props tipadas em todos os componentes
- Endpoints da API tipados

---

## ✨ Diferenciais Implementados

### 🤖 Integração com IA - Chatbot Inteligente

Sistema de assistente virtual que:

- Analisa intenção do usuário (busca, filtro, recomendação)
- Sugere produtos baseado no contexto da conversa
- Mantém histórico de interação
- Oferece quick actions para navegação rápida
- Interface terminal-style alinhada com a identidade visual

**Tecnologias:**

- Análise de intenção via regex e matching de categorias
- Sistema de contexto conversacional
- Recomendações baseadas em similaridade

### 🧪 Testes

#### Testes Unitários (Vitest + Testing Library)

```bash
npm run test
```

- Teste do componente ProductCard
- Teste de lógica do carrinho
- Coverage de funções críticas

#### Testes E2E (Playwright)

```bash
npx playwright test
```

- Fluxo completo de compra
- Adição ao carrinho
- Aplicação de cupom
- Navegação entre páginas

### 🎨 Sistema de Cupons

- Cupom `PRIMEIRA10`: 10% de desconto
- Cupom `KIT15`: 15% de desconto (para kit promocional)
- Validação de cupons
- Remoção de cupom aplicado
- Recalculo automático do total

### 🔍 Busca e Filtros

- Busca em tempo real por nome, categoria e descrição
- Filtro por categoria
- Dropdown de resultados de busca (fora da home)
- Persistência de filtros na URL (query params)
- Limpeza de filtros sem scroll da página

### 🛒 Carrinho Avançado

- Controle de estoque em tempo real
- Limite de quantidade por produto
- Cálculo correto em centavos (evita problemas de arredondamento)
- Frete grátis
- Parcelamento em até 6x
- Animações de entrada/saída
- Toast notifications

### 📱 UX Aprimorada

- Hero section com call-to-action
- Banner de promoção fixo
- Toast de notificações
- Animações suaves
- Estados de loading
- Design terminal/developer-themed
- Safe area para dispositivos móveis (iPhone notch)

---

## 🎨 Design System

### Paleta de Cores

- **Principal:** Emerald (#10B981) - CTAs e destaques
- **Secundária:** Black (#000000) - Textos e bordas
- **Acento:** Orange/Red (#F3350C) - Hover states
- **Background:** Stone-50 (#FAFAF9)

### Tipografia

- **Mono:** Fonte monoespaçada para números, códigos e botões
- **Sans:** Inter para textos corridos

### Identidade Visual

- Tema "terminal/desenvolvedor"
- Cursor piscante nos títulos
- Comandos de terminal nas navegações
- Estética minimalista e funcional

---

## 📦 Dependências Principais

```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "tailwindcss": "^4",
  "typescript": "^5",
  "lucide-react": "^0.563.0" // Ícones
}
```

### DevDependencies

- Vitest + Testing Library (testes unitários)
- Playwright (testes E2E)
- ESLint + Prettier (qualidade de código)

---

## 🔄 Melhorias Futuras

- [ ] Integração com gateway de pagamento
- [ ] Sistema de autenticação de usuários
- [ ] Wishlist (lista de desejos)
- [ ] Comparação de produtos
- [ ] Reviews e ratings de usuários
- [ ] Histórico de pedidos
- [ ] Recomendações personalizadas com ML
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)
- [ ] Dark mode

---

## 👨‍💻 Autor

**Vitor S. Vieira**

Desenvolvido como parte do desafio técnico para a vaga de Desenvolvedor Frontend Júnior na Uncode.

---

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.
