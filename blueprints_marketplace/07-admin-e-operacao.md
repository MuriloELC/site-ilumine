# Blueprint 07 - Admin e Operacao

## Admin

O painel `/admin` e parte essencial da estrutura atual. Ele deve continuar sendo uma unica area com abas, protegida por usuario `ADMIN`.

## Acesso

Regras:

- Usuario precisa estar autenticado.
- `user.role` precisa ser `ADMIN`.
- Sem token ou sem role admin: mostrar tela de acesso negado com link para login.
- Backend deve validar admin em todos os endpoints `/admin/*`, sem confiar no frontend.

## Dashboard

Endpoint:

```text
GET /admin/dashboard
```

KPIs atuais:

- Produtos totais.
- Produtos ativos.
- Produtos inativos.
- Produtos com estoque baixo (`stock <= 10`).
- Pedidos pendentes.
- Pedidos pagos.
- Pedidos cancelados.
- Receita paga total.

UI:

- Cards simples.
- Atualizar apos mudancas de produto/pedido.

Melhorias:

- Mostrar periodo da receita.
- Separar receita bruta de frete se necessario.
- Adicionar link rapido de "ver estoque baixo".

## Produtos e estoque

Endpoints:

- `GET /admin/products`
- `POST /admin/products`
- `PUT /admin/products/:id`
- `PATCH /admin/products/:id/stock`
- `PATCH /admin/products/:id/status`

Formulario atual:

- Nome.
- Slug.
- Descricao.
- URL da imagem.
- Preco de venda.
- Preco de lista.
- Rating.
- Estoque.
- Categoria.
- Status.
- Flag mais vendido.
- Flag oferta especial.
- Especificacoes em texto, uma por linha no formato `Chave: Valor`.

Melhorias:

- Gerar slug automaticamente a partir do nome, com edicao manual.
- Validar URL de imagem.
- Validar `listPrice >= price` quando houver desconto.
- Validar `rating` entre 0 e 5.
- Transformar especificacoes em lista editavel, nao textarea livre.
- Adicionar busca, filtro por categoria/status e paginacao na UI.
- Confirmar ativar/inativar se houver pedido recente, se aplicavel.

## Pedidos

Endpoints:

- `GET /admin/orders`
- `GET /admin/orders/:id`
- `PATCH /admin/orders/:id/status`

Lista atual mostra:

- Numero do pedido.
- Cliente e email.
- Data.
- Itens com quantidade.
- Total.
- Status.
- Acoes: marcar como pago, cancelar.

Regras:

- `PENDING_PAYMENT -> PAID`: baixa estoque.
- `PENDING_PAYMENT -> CANCELED`: nao mexe em estoque.
- `PAID -> CANCELED`: restaura estoque.
- `CANCELED -> PAID`: proibido.

Melhorias:

- Confirmacao antes de cancelar pedido pago.
- Exibir endereco de entrega.
- Exibir subtotal, frete e total.
- Filtros por status e busca por cliente/email.
- Paginacao.
- Historico de eventos do pedido em uma evolucao futura.

## Logs

Atual:

- `FileLoggerService` grava em `backend/logs/app-YYYY-MM-DD.log`.
- Retencao automatica de 3 dias.
- Logs HTTP: metodo, URL, status e duracao.
- Logs de erros e exceptions.

Rebuild:

- Manter log local simples.
- Adicionar `requestId`.
- Formatar logs em JSON em producao.
- Separar logs de negocio relevantes:
  - pedido criado.
  - preference criada.
  - webhook processado.
  - estoque baixado/restaurado.
  - erro em integracao externa.

## Configuracao local

Banco:

```bash
docker compose up -d
```

Backend:

```bash
cd backend
copy .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

Frontend:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Portas:

- Backend: `http://localhost:3000`.
- Frontend: `http://localhost:5174`.
- PostgreSQL: `localhost:5432`.

## Deploy e ambientes

Separar ambientes:

- `local`
- `staging`
- `production`

Obrigatorio:

- `JWT_SECRET` forte e diferente por ambiente.
- URLs publicas HTTPS para `FRONTEND_URL` e `BACKEND_URL` em producao.
- Mercado Pago com credenciais do ambiente correto.
- Webhook publico configurado no Mercado Pago.
- CORS restrito ao frontend correto.
- Migrations aplicadas antes de subir nova versao.

## Operacao minima

Adicionar no rebuild:

- Endpoint `/health`.
- Script `npm run lint`.
- Script `npm run test`.
- Script `npm run test:e2e` ou equivalente.
- CI com build frontend, build backend e testes.
- Check para impedir commit de `.env`.

## Checklist de prontidao

- Admin consegue logar.
- Dashboard carrega.
- Produto pode ser criado, editado, inativado e reativado.
- Produto inativo nao aparece no catalogo publico.
- Pedido aparece no admin apos checkout.
- Marcar como pago baixa estoque.
- Cancelar pago restaura estoque.
- Logs registram requests e webhooks.
- Webhook Mercado Pago funciona em HTTPS publico.

