# Blueprint 08 - Plano de Rebuild e Qualidade

## Estrategia

Reconstruir do zero em fatias verticais, sempre mantendo uma parte utilizavel. A ordem abaixo reduz risco porque primeiro fixa dados e API, depois loja, checkout, integracoes e admin.

## Fase 0 - Decisoes de base

Manter:

- Monorepo com `backend/` e `frontend/`.
- NestJS, React, Vite, Prisma e PostgreSQL.
- Rotas e contratos descritos nos blueprints.

Melhorar:

- Padrao de pastas por dominio.
- Validacao e erros padronizados.
- Guardas de auth/admin.
- Tipos compartilhados ou gerados.
- Testes desde o inicio.

Entregaveis:

- Estrutura nova criada.
- Scripts `dev`, `build`, `lint`, `test`.
- Docker Compose PostgreSQL.
- `.env.example` completo sem segredos reais.

## Fase 1 - Banco e seed

1. Criar Prisma schema com entidades atuais.
2. Criar migrations.
3. Criar seed de categorias, produtos e admin.
4. Adicionar indices recomendados.
5. Criar testes de repositorio/casos de uso criticos quando possivel.

Criterios:

- `prisma migrate deploy` funciona.
- `prisma seed` e idempotente.
- Admin existe apos seed.
- Produtos aparecem com specs e categoria.

## Fase 2 - Backend publico

Implementar:

- `GET /categories`
- `GET /products`
- `GET /products/:slug`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Qualidade:

- DTOs com validacao.
- Services sem logica pesada em controllers.
- Erros padronizados.
- Testes unitarios para filtros e auth.

Criterios:

- Busca/filtro funcionam.
- Produto inativo nao aparece.
- Email duplicado retorna conflito.
- Token invalido retorna 401.

## Fase 3 - Frontend catalogo e auth

Implementar:

- App router.
- Header.
- Home.
- ProductCard.
- Produto.
- Auth provider.
- Login.
- Register.
- Account basico.

Qualidade:

- Layout responsivo.
- Estados loading/erro/vazio.
- Textos pt-BR.
- Sem caracteres corrompidos.

Criterios:

- Usuario consegue navegar, filtrar, buscar e abrir produto.
- Cadastro/login persistem sessao.
- Logout limpa sessao.

## Fase 4 - Carrinho e pedido

Implementar:

- Cart provider.
- Carrinho em `/cart`.
- Quantidade/remocao/limpar.
- DTO de criacao de pedido.
- `POST /orders`.
- `GET /orders/me`.
- `GET /orders/:id/status`.

Qualidade:

- Revalidar estoque/preco no backend.
- Agrupar itens duplicados.
- Criar pedido sem baixar estoque.
- `checkoutToken` unico.

Criterios:

- Convidado precisa informar nome/email.
- Usuario logado compra com dados da conta.
- Pedido criado fica `PENDING_PAYMENT`.
- Historico exibe pedidos do usuario.

## Fase 5 - Frete e endereco

Implementar:

- `POST /orders/shipping/simulate`.
- `GET /orders/address/lookup`.
- UI do step endereco.
- Mensagens de falha de integracao.

Qualidade:

- Servicos externos isolados.
- Timeout.
- Testes com mocks.

Criterios:

- CEP invalido falha antes de chamar provider.
- Frete calculado entra no total.
- Endereco preenche campos disponiveis.
- Pedido usa frete recalculado no backend.

## Fase 6 - Mercado Pago

Implementar:

- `POST /checkout/mercadopago/preference`.
- Wallet no frontend.
- `/checkout/result`.
- `POST /webhooks/mercadopago`.
- Sincronizacao manual com `sync=true`.

Qualidade:

- Webhook idempotente.
- Assinatura validada.
- Estoque baixado uma vez.
- Logs de eventos.

Criterios:

- Preference criada para pedido pendente.
- Pagamento aprovado marca `PAID`.
- Webhook duplicado nao duplica baixa.
- Resultado do pagamento orienta usuario corretamente.

## Fase 7 - Admin

Implementar:

- Guards admin.
- Dashboard.
- Produtos.
- Estoque/status.
- Pedidos/status.

Qualidade:

- Paginacao.
- Confirmacoes para acoes destrutivas.
- Formulario com validacao.
- Feedback por acao.

Criterios:

- Admin gerencia produto.
- Produto inativo some da loja.
- Admin muda status de pedido.
- Estoque respeita transicoes.

## Fase 8 - Hardening

Adicionar:

- Testes e2e para jornada compra.
- Testes de webhook.
- Testes de admin.
- Health check.
- Logs estruturados.
- CI.
- Auditoria de dependencias.
- Revisao de acessibilidade.
- Revisao visual mobile/desktop.

## Matriz de testes

### Unitarios backend

- AuthService: register/login/token.
- ProductsService: filtros.
- OrdersService: create, estoque, status.
- ShippingService: parse de preco Correios.
- WebhooksService: idempotencia e approved.
- AdminService: dashboard e status.

### Integracao backend

- Rotas publicas.
- Auth e admin guards.
- Criacao de pedido com banco real de teste.
- Webhook com mock Mercado Pago.

### Frontend

- Header busca e categoria.
- ProductCard adiciona ao carrinho.
- Cart wizard.
- Formularios de login/cadastro.
- Admin tabs.

### E2E

- Visitante compra ate pedido pendente.
- Webhook aprovado confirma pedido.
- Usuario logado ve pedido na conta.
- Admin marca pedido como pago.
- Admin cancela pedido pago e estoque volta.

## Definition of Done

Um modulo so esta pronto quando:

- Mantem contrato atual.
- Tem validacao backend.
- Tem estados de loading, erro e vazio no frontend.
- Tem teste unitario para regras relevantes.
- Tem ao menos um teste de integracao ou e2e quando toca checkout, pagamento, estoque ou admin.
- Nao expoe segredo no frontend.
- Build backend e frontend passam.
- Fluxo principal foi testado manualmente.

## Backlog de melhorias futuras

Sem quebrar o escopo atual, deixar preparado para:

- Cupom de desconto.
- Multiplas opcoes de frete.
- Historico de eventos do pedido.
- Estoque reservado por tempo limitado.
- Imagens de produto multiplas.
- Upload de imagem no admin.
- Recuperacao de senha.
- Email transacional.
- Dashboard com periodo e graficos.

## Sequencia curta para execucao

1. Banco + seed.
2. API catalogo + auth.
3. Frontend catalogo + auth.
4. Carrinho + pedido.
5. Frete + endereco.
6. Mercado Pago + webhook.
7. Admin.
8. Testes, acessibilidade, logs e deploy.
