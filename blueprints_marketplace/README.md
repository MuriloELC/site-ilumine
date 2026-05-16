# ILUMINE Rebuild Blueprints

Este pacote de blueprints consolida o comportamento atual do projeto `site_ilumine` para permitir uma reconstrucao do zero com mais qualidade, preservando os mesmos fluxos, rotas, estrutura funcional e regras de negocio.

## Objetivo

Reconstruir a ILUMINE como um e-commerce full-stack de materiais eletricos com:

- Loja publica com home, categorias, busca, ofertas, mais vendidos e pagina de produto.
- Carrinho persistido no navegador.
- Checkout em etapas: carrinho, endereco, pagamento Mercado Pago, confirmacao.
- Frete real via Correios.
- Busca de endereco por CEP via Google Geocoding.
- Autenticacao de cliente e historico de pedidos.
- Painel administrativo com dashboard, produtos, estoque e pedidos.
- Persistencia real em PostgreSQL via Prisma.
- Backend NestJS e frontend React com Vite.

## Invariantes de reconstrucao

Ao refazer do zero, preserve:

- Rotas frontend atuais:
  - `/`
  - `/produto/:slug`
  - `/cart`
  - `/checkout/result`
  - `/login`
  - `/register`
  - `/account`
  - `/admin`
- Contratos REST atuais, descritos em [04-contratos-api.md](04-contratos-api.md).
- Entidades principais: `User`, `Category`, `Product`, `ProductSpec`, `Order`, `OrderItem`, `WebhookEvent`.
- Estados: `USER`, `ADMIN`, `ACTIVE`, `INACTIVE`, `PENDING_PAYMENT`, `PAID`, `CANCELED`.
- Regra de estoque: o estoque so baixa quando o pedido vira `PAID`; cancelamento de pedido pago restaura estoque.
- Checkout com `checkoutToken` para consulta segura do status do pedido sem expor dados sensiveis.
- Conta admin seed: `admin@ilumine.com` com senha de desenvolvimento `Admin@123`.

## Como usar

1. Leia [01-produto-e-fluxos.md](01-produto-e-fluxos.md) para entender o produto e os fluxos.
2. Use [02-arquitetura-e-modulos.md](02-arquitetura-e-modulos.md) para desenhar a nova base tecnica.
3. Modele banco e regras por [03-dados-e-regras-de-negocio.md](03-dados-e-regras-de-negocio.md).
4. Implemente a API seguindo [04-contratos-api.md](04-contratos-api.md).
5. Recrie as telas por [05-frontend-ux-ui.md](05-frontend-ux-ui.md).
6. Trate pagamento, frete e CEP por [06-checkout-integracoes.md](06-checkout-integracoes.md).
7. Refaca admin, logs e operacao por [07-admin-e-operacao.md](07-admin-e-operacao.md).
8. Execute o plano incremental em [08-plano-rebuild-qualidade.md](08-plano-rebuild-qualidade.md).

## Fontes analisadas

- `README.md`
- `docker-compose.yml`
- `backend/package.json`
- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`
- `backend/src/**`
- `frontend/package.json`
- `frontend/src/**`
- `frontend/src/styles.css`

## Direcao de qualidade

O rebuild deve manter o mesmo produto, mas melhorar:

- Separacao por dominios e casos de uso.
- Tipagem compartilhada ou geracao de cliente API.
- Validacao consistente no frontend e backend.
- Tratamento de erros, loading, empty states e acessibilidade.
- Cobertura de testes unitarios, integracao e e2e.
- Observabilidade, logs estruturados e health checks.
- Seguranca de token, segredo JWT e assinatura de webhook.
- Layout responsivo mais consistente, sem textos quebrados ou caracteres corrompidos.
