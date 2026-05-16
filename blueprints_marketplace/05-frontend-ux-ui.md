# Blueprint 05 - Frontend, UX e UI

## Objetivo do frontend

Recriar a experiencia atual em React mantendo rotas e fluxo, mas com melhor design system, componentes reutilizaveis, acessibilidade, validacao e tratamento de estado.

## Rotas e paginas

### `/`

Componentes:

- Header global.
- Hero.
- Beneficios.
- Categorias.
- Ofertas Especiais.
- Mais Vendidos.
- Todos os Produtos.

Dados:

- `GET /categories`
- `GET /products` com query atual.
- `GET /products?specialOffer=true&limit=8`
- `GET /products?bestSeller=true&limit=8`

Estados:

- Loading inicial.
- Erro de carregamento.
- Lista vazia para busca/filtro sem resultado.
- Categoria ativa.

### `/produto/:slug`

Dados:

- `GET /products/:slug`

Componentes:

- Breadcrumb/link voltar.
- Galeria/imagem principal.
- Nome, rating, preco, desconto, parcelamento.
- Controle de quantidade.
- Acoes: adicionar ao carrinho, comprar agora.
- Beneficios curtos.
- Tabela de especificacoes.

Estados:

- Loading.
- Produto nao encontrado.
- Limite por estoque.

### `/cart`

Wizard:

1. Carrinho.
2. Endereco.
3. Pagamento.
4. Pedido realizado.

Componentes:

- Stepper.
- Lista de itens.
- Resumo de pedido.
- Simulador de frete.
- Formulario de endereco.
- Card de revisao.
- Payment box Mercado Pago.
- Bloco de sucesso.

Estados:

- Carrinho vazio.
- Frete nao calculado.
- Erro Correios.
- CEP buscando/endereco preenchido.
- Preference indisponivel.
- Pagamento pendente, pago ou cancelado.

### `/checkout/result`

Responsabilidade:

- Ler `orderId` e `token`.
- Chamar status com `sync=true`.
- Exibir resultado.

### `/login` e `/register`

Melhoria:

- Padronizar idioma pt-BR.
- Mostrar mensagens amigaveis.
- Desabilitar submit durante request.
- Redirecionar admin para `/admin` se fizer sentido, mantendo `/account` como padrao para cliente.

### `/account`

Responsabilidade:

- Gate de usuario logado.
- Dados do usuario.
- Logout.
- Historico de pedidos.

Melhoria:

- Cards/tabela com status traduzido.
- Link para voltar a comprar.
- Empty state claro.

### `/admin`

Abas:

- Dashboard.
- Produtos e Estoque.
- Pedidos.

Melhoria:

- Filtros visiveis.
- Paginacao.
- Confirmacao antes de cancelar pedido.
- Feedback por acao.
- Formulario mais robusto para specs.

## Componentes base recomendados

Criar componentes pequenos e consistentes:

- `Button`
- `IconButton`
- `Input`
- `TextArea`
- `Select`
- `Checkbox`
- `Tabs`
- `Stepper`
- `Alert`
- `EmptyState`
- `LoadingBlock`
- `ProductCard`
- `Price`
- `StatusBadge`
- `OrderSummary`
- `QuantityStepper`
- `FormField`

## Estado local e server state

### Carrinho

Preservar:

- `localStorage` key `ilumine-cart`.
- Funcoes: adicionar, remover, atualizar quantidade, limpar, total de itens.

Melhorar:

- Validar dados carregados do storage.
- Reconciliar produtos com backend antes de criar pedido.
- Bloquear quantidade maior que estoque atualizado.
- Mostrar aviso quando preco/estoque mudar.

### Auth

Preservar:

- `localStorage` keys `ilumine-token` e `ilumine-user`.
- Hidratacao por `GET /auth/me`.

Melhorar:

- Limpar sessao em 401.
- Evitar assumir usuario do storage sem validar.
- Criar guard visual para admin.

### Requests

Melhorar:

- Usar camada unica para requests.
- Parsear erro do backend.
- Ter estados `loading`, `error`, `success`.
- Cancelar requests ao trocar filtro rapido.

## Design system

Base visual atual:

- Header escuro.
- Fundo cinza claro.
- Superficies claras.
- Acento marrom/cobre.
- Cards arredondados.
- Grid responsivo.

Direcao para rebuild:

- Manter identidade ILUMINE, mas usar tokens mais consistentes.
- Usar contraste AA.
- Evitar UI dominada por um unico tom.
- Substituir caracteres quebrados por icones reais.
- Cards com radius ate 8px, salvo se o design system definir outro padrao.
- Formularios densos e claros no admin.
- Home pode ser visualmente mais rica, mas sem virar landing page sem produto.

Tokens sugeridos:

```css
:root {
  --color-bg: #f2f3f5;
  --color-surface: #ffffff;
  --color-header: #1e2229;
  --color-text: #20242b;
  --color-muted: #68717e;
  --color-border: #d8dce2;
  --color-accent: #b17344;
  --color-accent-strong: #8f5835;
  --color-success: #247a55;
  --color-warning: #8a6a23;
  --color-danger: #a23f4f;
  --radius-sm: 6px;
  --radius-md: 8px;
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 8%);
}
```

## Acessibilidade

Obrigatorio:

- Inputs com label visivel.
- Botoes com texto claro ou `aria-label` quando forem apenas icones.
- Foco visivel.
- `aria-live` para mensagens de checkout/pagamento.
- Imagens com alt real.
- Erros de campo associados ao input.
- Stepper com estado atual compreensivel.
- Nao depender apenas de cor para status.

## Responsividade

Breakpoints preservados em espirito:

- Desktop: header em 3 areas, grids de 4 produtos e 6 categorias.
- Tablet: header quebra, grids reduzem.
- Mobile: uma coluna, itens do carrinho empilhados, formulario de checkout em uma coluna.

Melhoria:

- Garantir que textos longos de produto nao quebrem layout.
- Evitar cards com alturas imprevisiveis em grids.
- Manter botoes tocaveis com altura minima adequada.

## Textos e idioma

Padronizar em pt-BR:

- `Sign In` -> `Entrar`
- `Create account` -> `Criar conta`
- `My Account` -> `Minha conta`
- `Loading orders...` -> `Carregando pedidos...`
- `No orders yet.` -> `Voce ainda nao tem pedidos.`

## Qualidade visual a corrigir

Problemas atuais observados:

- Alguns icones aparecem como `?`, `~`, `o`, `[]` ou caracteres quebrados.
- README e UI possuem sinais de encoding quebrado.
- Login/cadastro/conta misturam ingles e portugues.
- Mensagens de erro exibem texto cru do backend.
- Admin tem formulario grande em uma unica tela, sem validacao de campo refinada.

Meta:

- Manter as mesmas paginas e a mesma jornada, mas com acabamento de produto pronto para uso.

