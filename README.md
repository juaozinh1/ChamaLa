# ChamaLÁ — Conectando profissionais a quem precisa

Aplicativo mobile que conecta clientes a profissionais de serviços gerais, com perfis
verificados, busca por proximidade, avaliações e contrato padrão por pedido.

Roadmap completo: [docs/ROADMAP.md](docs/ROADMAP.md) ·
[documento online](https://claude.ai/artifact/KN951Y9nJSrGcNpc25ZUy2)

## Estrutura

```text
chamala/
├── chamala-mobile/    App React Native + Expo (cliente e profissional)
├── chamala-backend/   API REST Java 25 + Spring Boot 3 + PostGIS
├── chamala-admin/     Painel administrativo web (React + Vite + Tailwind)
├── docs/              Roadmap
├── docker-compose.yml PostgreSQL 16 + PostGIS 3.4 local
└── .github/workflows/ CI: lint, tipos, build e testes dos três projetos
```

## O que veio do repositório original (juaozinh1/ChamaLa)

O repositório tinha o app Expo configurado (`servico-ja-mobile`), sem telas. Foi aproveitado
como base do `chamala-mobile`:

- Dependências já instaladas que o roadmap usa: React Navigation (stack + abas), Axios,
  React Hook Form + Zod, expo-secure-store, expo-image-picker, expo-document-picker.
- Padronização: ESLint (config Expo) + Prettier (`.prettierrc`), `tsconfig` estrito,
  `.npmrc` com `legacy-peer-deps`.
- `app.json` em orientação retrato, ícones e splash.
- Tema (`src/theme`) e a estrutura de pastas `src/` planejada.
- Do README: funcionalidades, segurança/LGPD, fluxo de branches e checklist de etapas.

Mudanças feitas sobre essa base:

- Nome do projeto: ServiçoJá → ChamaLÁ (`package.json`, `app.json`, pacote
  `br.com.chamala.app`, tablet desativado no iOS).
- Cores do tema alinhadas ao protótipo do Figma; escalas de texto e alvo de toque de 44 pt.
- Navegação tipada com as 16 telas do Figma: `AuthStack`, `ClientTabs` (Início, Serviços,
  Pedidos, Perfil) e `ProTabs` (Painel, Solicitações, Verificação, Perfil).
- Telas provisórias que reproduzem os fluxos do protótipo; a de Acessibilidade já funciona.
- Cliente HTTP (`src/services/api.ts`) com token do SecureStore e tipos de domínio.

## O que já está pronto

| Parte | Situação | Verificado em 27/10/2026 |
| --- | --- | --- |
| chamala-mobile | Navegação completa, telas provisórias, tema, sessão simulada | `tsc`, `expo lint` e bundle Android sem erros |
| chamala-admin | Login, layout e rotas do painel | `npm run build` e `oxlint` sem erros |
| chamala-backend | Segurança inicial, `GET /api/v1/categories`, migrações Flyway das 12 tabelas + 8 categorias | Migrações rodadas em PostgreSQL 16 + PostGIS 3.4; código Java ainda não compilado (rode `mvn verify`) |

## Como rodar

Pré-requisitos: Node.js LTS, Java 25, Maven 3.9+, Docker Desktop, app Expo Go no celular.

```bash
# 1. Banco
docker compose up -d

# 2. API (http://localhost:8080/swagger-ui.html)
cd chamala-backend
mvn spring-boot:run

# 3. App mobile
cd chamala-mobile
npm install
copy .env.example .env      # no Windows; ajuste o IP se usar celular físico
npx expo start

# 4. Painel admin (http://localhost:5173)
cd chamala-admin
npm install
copy .env.example .env
npm run dev
```

No celular físico, troque `EXPO_PUBLIC_API_URL` pelo IP do computador na rede
(ex.: `http://192.168.0.10:8080`).

## Padronização e branches

- Prettier + ESLint no app (`npx prettier --write src`, `npx expo lint`); oxlint no painel.
- `master`: versão estável · `develop`: integração · `feature/nome-da-tarefa` a partir da `develop`.

## Fase 1 — especificação (entregue em 27/10/2026, aguardando aprovação)

Resumo em [docs/FASE-1.md](docs/FASE-1.md).

- Contrato da API: `chamala-backend/api/openapi.yaml` (documentação navegável em `docs/api/index.html`).
- Tipos TypeScript gerados do contrato: `src/types/api.ts` no app e no painel (`npm run api:types` para regerar).
- Telas novas no Figma: https://www.figma.com/design/9ZR33gdjklJZ88JHpqy2pL
- Termos de uso e contrato padrão v1 (rascunho para advogado): https://claude.ai/artifact/7FkssxCrEBKv5ajs9g6Lww

## Próximos passos

- [ ] Aprovar as telas novas e o contrato da API com o time.
- [ ] Revisão jurídica dos termos, principalmente o direito de arrependimento (CDC, art. 49).
- [ ] Rodar `mvn verify` e confirmar a versão do Spring Boot (3.5.6 no `pom.xml`).
- [ ] Começar a fase 2 (autenticação) a partir de `/auth/*` e `/me` do contrato.
