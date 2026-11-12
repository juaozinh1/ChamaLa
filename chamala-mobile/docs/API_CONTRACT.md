# Contrato da API (proposta do front-end)

> **Status: PROPOSTA.** O app está pronto e funciona com dados falsos. Estes endpoints são o que o app
> vai chamar quando `USE_MOCKS` for `false`. O time do back-end deve aceitar ou ajustar, e qualquer
> mudança é feita em **um único arquivo**: `src/services/httpApi.ts`. Os formatos de JSON seguem os
> tipos TypeScript de `src/types` (`domain.ts`, `user.ts`).

## Regras gerais

- **Base URL:** variável `EXPO_PUBLIC_API_URL` (ex.: `https://api.exemplo.com/api`).
- **Autenticação:** `Authorization: Bearer <token>`. O token é guardado com `expo-secure-store`.
  Resposta **401** em qualquer rota desloga o usuário.
- **Erros:** status 4xx/5xx com corpo `{ "message": "texto em português para o usuário" }`. O app mostra `message`.
- **Datas:** ISO 8601 com fuso (`2026-11-05T09:00:00.000Z`).
- **Dinheiro:** número em reais com 2 casas (`150.00`). *Decisão pendente:* centavos inteiros seriam mais seguros.
- **Respostas de pedido:** sempre o objeto `Order` completo e atualizado.
- **Escopo do usuário:** `GET /orders` devolve só os pedidos do usuário logado (cliente: os que fez; profissional: os recebidos).

## Autenticação e conta

| Método e rota | Corpo | Resposta |
|---|---|---|
| `POST /auth/login` | `{ email, password }` | `{ token, user }` |
| `POST /auth/register/client` | `{ name, phone, email, password }` | `{ token, user }` |
| `POST /auth/register/professional` | `{ name, phone, email, password, specialtyId, area }` | `{ token, user }` (com `verificationStatus: "unsubmitted"`) |
| `POST /auth/forgot-password` | `{ email }` | 204. Sempre responde sucesso, exista ou não o e-mail. O link vale 30 min. |
| `GET /me` | | `User` |
| `PATCH /me` | `{ name, phone, email, area? }` (`area` = bairro/cidade) | `User` |
| `POST /me/password` | `{ currentPassword, newPassword }` | 204. Se a senha atual estiver errada: 400 com `message` ("A senha atual está incorreta.") |
| `POST /me/avatar` | **multipart**: `avatar` (imagem) | `User` (com `avatarUrl`) |

`User`: `{ id, name, email, phone, role: "client" | "professional", specialty?, area?, avatarUrl?, verificationStatus? }`.

## Catálogo (cliente)

| Rota | Resposta |
|---|---|
| `GET /categories` | `Category[]` = `{ id, name, emoji, color }` |
| `GET /professionals?categoryId=&sort=nearest\|rating\|price&query=` | `ProfessionalSummary[]` |
| `GET /professionals/:id` | `ProfessionalDetail` (resumo + `jobsCount`, `area`, `services[]`, `acceptsQuotes`, `policy`) |
| `GET /professionals/:id/reviews` | `Review[]` = `{ id, authorName, rating, comment, createdAt }` |

`distanceKm` deve vir calculado para o usuário logado (o app ainda não envia localização).
`authorName` já vem no formato "Maria S." (primeiro nome + inicial).

## Pedidos

`Order` (campos principais): `id`, `code` (ex.: `A1F3`), `status`, `clientId/Name`, `professionalId/Name`, `specialty`,
`serviceTitle`, `description?`, `photos[]`, `scheduledAt`, `address`, `neighborhood`, `distanceKm`, `hours?`,
`price`, `discount`, `total`, `depositPaid`, `policy {freeCancelHours, penaltyPercent, depositPercent}`,
`contract {version, clientAcceptedAt?, professionalAcceptedAt?}`, `quote?`, `reschedule?`, `cancellation?`, `reviewed`, `notes?`.

**Status:** `quote_requested` → `quote_sent` → `confirmed`; ou `pending` → `confirmed`; depois `completed`. Finais: `cancelled`, `declined`.

| Método e rota | Corpo | Quem usa | Efeito |
|---|---|---|---|
| `GET /orders` / `GET /orders/:id` | | ambos | |
| `POST /orders` | `{ professionalId, serviceId?, scheduledAt, hours?, address, notes? }` | cliente | cria em `pending`; o back calcula valor, desconto e copia a política do profissional (snapshot) |
| `POST /orders/quote-requests` | `{ professionalId, description, photos[], scheduledAt, address }` | cliente | cria em `quote_requested` |
| `POST /orders/:id/accept` | | profissional | `pending` → `confirmed` |
| `POST /orders/:id/decline` | | profissional | → `declined` |
| `POST /orders/:id/complete` | | profissional | `confirmed` → `completed` |
| `POST /orders/:id/cancel` | `{ reason }` | ambos | → `cancelled`; o back **calcula e registra a multa** (`cancellation.fee`) |
| `POST /orders/:id/quote` | `{ price, validityDays, message? }` | profissional | `quote_requested` → `quote_sent` |
| `POST /orders/:id/quote/respond` | `{ accept }` | cliente | aceita → `confirmed`; recusa → `declined` |
| `POST /orders/:id/contract/accept` | | ambos | registra `clientAcceptedAt` ou `professionalAcceptedAt` |
| `POST /orders/:id/reschedule` | `{ scheduledAt, message? }` | ambos | cria proposta `pending` |
| `POST /orders/:id/reschedule/respond` | `{ accept }` | a outra parte | aceita: troca `scheduledAt` |
| `POST /orders/:id/review` | `{ rating (1-5), comment? }` | cliente | só para `completed`; marca `reviewed` |

**O que o back deve garantir** (o app só exibe): cálculo oficial da multa e do reembolso do sinal; regra de
quem pode cada ação; endereço completo oculto do profissional até o aceite (o app mostra só `neighborhood`
nesses casos, mas o dado não deveria nem trafegar); texto e PDF do contrato.

## Área do profissional (`/me/...`)

| Método e rota | Corpo | Resposta |
|---|---|---|
| `GET /me/dashboard` | | `{ monthEarnings, servicesCount, rating, available, verificationStatus, pending: Order[] }` |
| `PATCH /me/availability` | `{ available }` | |
| `GET /me/services` | | `{ services: ServiceOffering[], acceptsQuotes }` |
| `POST /me/services` / `PUT /me/services/:id` | `{ title, price, active }` | `ServiceOffering` |
| `DELETE /me/services/:id` | | |
| `PATCH /me/accepts-quotes` | `{ acceptsQuotes }` | |
| `GET /me/cancellation-policy` / `PUT` | `{ freeCancelHours, penaltyPercent, depositEnabled, depositPercent }` | `CancellationPolicy` |
| `GET /me/verification` | | `{ status: "unsubmitted"\|"pending"\|"verified"\|"rejected" }` |
| `POST /me/verification` | **multipart**: `selfie`, `docFront`, `docBack`, `certificate?`, `extraDoc?`, `workPhotos[]`, `description?` | `{ status: "pending" }` |
| `GET /me/reviews` | | `Review[]` recebidas |
| `GET` / `PUT /me/payment-data` | `{ holderName, pixKey }` | `PaymentData` |

## Conta (ambos)

| Rota | Corpo | Resposta |
|---|---|---|
| `GET /me/addresses` / `POST` | `{ label, line }` | `Address[]` / `Address` |
| `DELETE /me/addresses/:id` | | |
| `GET /me/notification-preferences` / `PUT` | `{ orders, messages, promotions }` | `NotificationPrefs` |
| `GET /me/reviews-given` | | `Review[]` (com `serviceTitle`, `professionalName`) |

## Pontos a decidir com o back-end

1. Dinheiro em reais decimais ou centavos inteiros.
2. Pagamento e sinal: o app mostra `depositPaid` mas **não tem integração de pagamento** (gateway, repasse, estorno).
3. Desconto de 20% do agendamento por hora (visto no Figma): regra e quando vale.
4. Notificações push (o app ainda não registra token de push).
5. Localização e cálculo de distância; paginação das listas (hoje o app carrega tudo).
6. Upload de fotos do orçamento (`photos[]` hoje leva URIs locais; deve virar upload e URLs).
