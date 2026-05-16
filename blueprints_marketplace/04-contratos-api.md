# Blueprint 04 - Contratos API

## Convencoes gerais

- Base local: `http://localhost:3000`.
- Formato: JSON.
- Auth: header `Authorization: Bearer <token>`.
- Erros atuais podem vir como texto ou JSON serializado. No rebuild, padronizar:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Mensagem clara",
  "details": []
}
```

## Autenticacao

### POST `/auth/register`

Request:

```json
{
  "name": "Cliente",
  "email": "cliente@email.com",
  "password": "123456"
}
```

Validacao:

- `name`: string.
- `email`: email valido, unico.
- `password`: string com minimo 6.

Response:

```json
{
  "token": "jwt",
  "user": {
    "id": 1,
    "name": "Cliente",
    "email": "cliente@email.com",
    "role": "USER"
  }
}
```

### POST `/auth/login`

Request:

```json
{
  "email": "cliente@email.com",
  "password": "123456"
}
```

Response igual ao register.

Erros:

- 401 `Invalid credentials`.

### GET `/auth/me`

Auth: obrigatorio.

Response:

```json
{
  "id": 1,
  "name": "Cliente",
  "email": "cliente@email.com",
  "role": "USER",
  "createdAt": "2026-03-18T00:00:00.000Z"
}
```

## Catalogo publico

### GET `/categories`

Response:

```json
[
  {
    "id": 1,
    "name": "Lamps",
    "slug": "lamps"
  }
]
```

Ordenacao: `name asc`.

### GET `/products`

Query:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `search` | string | Busca em nome, case-insensitive. |
| `category` | string | Slug da categoria. |
| `minPrice` | number | Preco minimo. |
| `maxPrice` | number | Preco maximo. |
| `bestSeller` | boolean | Filtra flag. |
| `specialOffer` | boolean | Filtra flag. |
| `limit` | int | Default 24, minimo 1. |
| `offset` | int | Default 0, minimo 0. |

Response:

```json
{
  "total": 9,
  "items": [
    {
      "id": 1,
      "name": "LED Bulb 12W E27",
      "slug": "led-bulb-12w-e27",
      "description": "High efficiency LED bulb ideal for homes and offices.",
      "imageUrl": "https://...",
      "price": "19.90",
      "listPrice": "29.90",
      "rating": "4.8",
      "stock": 120,
      "status": "ACTIVE",
      "isBestSeller": true,
      "isSpecialOffer": true,
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "Lamps",
        "slug": "lamps"
      },
      "specifications": [
        { "id": 1, "key": "Power", "value": "12W" }
      ]
    }
  ]
}
```

### GET `/products/:slug`

Response: produto completo com categoria e specs.

Erros:

- 404 se produto nao existir ou estiver inativo.

## Pedidos e checkout

### POST `/orders`

Auth: opcional.

Request:

```json
{
  "customerName": "Cliente",
  "customerEmail": "cliente@email.com",
  "shippingAddress": {
    "zipCode": "01001001",
    "street": "Rua Exemplo",
    "number": "123",
    "complement": "Apto 1",
    "district": "Centro",
    "city": "Sao Paulo",
    "state": "SP"
  },
  "items": [
    { "productId": 1, "quantity": 2 }
  ]
}
```

Validacao atual:

- `items`: array com minimo 1.
- `productId`: int.
- `quantity`: int minimo 1.
- `zipCode`: somente numeros.
- `number`: somente numeros.
- `street`, `district`, `city`, `state`: texto.
- `customerName` e `customerEmail` sao obrigatorios para convidado.

Response:

```json
{
  "id": 1,
  "checkoutToken": "uuid",
  "status": "PENDING_PAYMENT",
  "subtotal": "39.80",
  "shipping": "20.00",
  "total": "59.80",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 2,
      "unitPrice": "19.90",
      "product": {}
    }
  ]
}
```

### POST `/orders/shipping/simulate`

Request minimo:

```json
{
  "destinationZipCode": "01001001"
}
```

Campos opcionais:

- `originZipCode`
- `serviceCode`
- `weightGrams`
- `objectType`
- `lengthCm`
- `widthCm`
- `heightCm`
- `diameterCm`

Response:

```json
{
  "provider": "correios",
  "serviceCode": "03220",
  "originZipCode": "01001001",
  "destinationZipCode": "01001001",
  "shippingPrice": 20,
  "shippingPriceRaw": "20,00",
  "currency": "BRL",
  "raw": {}
}
```

### GET `/orders/address/lookup?zipCode=<CEP>`

Response:

```json
{
  "zipCode": "01001001",
  "city": "Sao Paulo",
  "state": "SP",
  "district": "Se",
  "street": "Praca da Se"
}
```

### GET `/orders/:id/status?token=<checkoutToken>&sync=true`

Auth: nao obrigatorio, protegido por `checkoutToken`.

Com `sync=true`, se o pedido estiver pendente, backend tenta buscar pagamento aprovado no Mercado Pago.

Response:

```json
{
  "id": 1,
  "status": "PAID",
  "total": "59.80",
  "subtotal": "39.80",
  "shipping": "20.00",
  "shippingZipCode": "01001001",
  "shippingStreet": "Rua Exemplo",
  "shippingNumber": "123",
  "shippingComplement": null,
  "shippingDistrict": "Centro",
  "shippingCity": "Sao Paulo",
  "shippingState": "SP",
  "createdAt": "2026-03-18T00:00:00.000Z",
  "updatedAt": "2026-03-18T00:00:00.000Z"
}
```

### GET `/orders/me`

Auth: obrigatorio.

Response: lista de pedidos do usuario, ordenada por `createdAt desc`, incluindo itens e produtos.

### POST `/checkout/mercadopago/preference`

Request:

```json
{
  "orderId": 1
}
```

Response:

```json
{
  "provider": "mercadopago",
  "orderId": 1,
  "preferenceId": "123",
  "checkoutUrl": "https://...",
  "initPoint": "https://...",
  "sandboxInitPoint": "https://..."
}
```

Regras:

- Pedido deve existir.
- Backend usa `MERCADO_PAGO_ACCESS_TOKEN`.
- `external_reference` deve ser o id do pedido.
- `metadata.orderId` e `metadata.checkoutToken` devem ser enviados.
- `notification_url` deve apontar para `/webhooks/mercadopago`.
- `back_urls` e `auto_return` so devem ser enviados se `FRONTEND_URL` for HTTPS publico.

## Webhook

### POST `/webhooks/mercadopago`

Request: payload Mercado Pago e query params variaveis.

Backend deve aceitar payment id de:

- `payload.data.id`
- `payload.resource`
- query `data.id`
- query `id`

Response:

```json
{
  "received": true,
  "idempotent": false,
  "paymentId": "123",
  "status": "approved"
}
```

Regras:

- Consultar pagamento no Mercado Pago.
- Criar evento unico `mp:payment:<paymentId>:status:<status>`.
- Se duplicado, retornar `idempotent: true`.
- Se status `approved`, marcar pedido como pago.
- Se falhar ao marcar pedido como pago, remover evento para permitir retry.

## Admin

Todos os endpoints exigem `ADMIN`.

### GET `/admin/dashboard`

Response:

```json
{
  "products": {
    "total": 9,
    "active": 9,
    "inactive": 0,
    "lowStock": 0
  },
  "orders": {
    "pending": 1,
    "paid": 2,
    "canceled": 0
  },
  "revenue": {
    "paidTotal": 1000
  }
}
```

### GET `/admin/products`

Query:

- `search`
- `status`
- `categoryId`
- `page` default 1
- `pageSize` default 20

Response:

```json
{
  "page": 1,
  "pageSize": 20,
  "total": 9,
  "items": []
}
```

### POST `/admin/products`

### PUT `/admin/products/:id`

Payload:

```json
{
  "name": "Produto",
  "slug": "produto",
  "description": "Descricao",
  "imageUrl": "https://...",
  "price": 10,
  "listPrice": 12,
  "rating": 4.5,
  "stock": 20,
  "categoryId": 1,
  "status": "ACTIVE",
  "isBestSeller": false,
  "isSpecialOffer": false,
  "specifications": [
    { "key": "Power", "value": "10W" }
  ]
}
```

### PATCH `/admin/products/:id/stock`

```json
{
  "stock": 30
}
```

### PATCH `/admin/products/:id/status`

```json
{
  "status": "INACTIVE"
}
```

### GET `/admin/orders`

Query:

- `status`
- `search`

Response: lista de pedidos com usuario, itens e produtos.

### GET `/admin/orders/:id`

Response: pedido completo.

### PATCH `/admin/orders/:id/status`

```json
{
  "status": "PAID"
}
```

Regras de estoque e status seguem [03-dados-e-regras-de-negocio.md](03-dados-e-regras-de-negocio.md).

