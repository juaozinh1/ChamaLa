# ChamaLÁ — Roadmap (resumo)

Documento completo, com diagramas e tabelas sempre atualizados:
https://claude.ai/artifact/KN951Y9nJSrGcNpc25ZUy2

## Decisões

- App mobile: React Native + Expo + TypeScript, só celular em retrato.
- Painel admin: plataforma web separada (React + Vite + Tailwind).
- API: Java 25 + Spring Boot 3, JWT, servindo app e painel.
- Banco: PostgreSQL + PostGIS (Docker local; Supabase Free na nuvem).
- Hospedagem gratuita: Render (API), Cloudflare Pages (painel), EAS Build (app).
- Preço fixo por serviço + pedido de orçamento.
- Cancelamento: antecedência mínima e multa de 10% a 20% definidas pelo profissional;
  sinal opcional; reagendamento combinado entre as partes; contrato padrão no aceite.
- Sem pagamento online no MVP (multa e sinal ficam registrados no contrato).

## Fases (cerca de 19 semanas)

| Fase | Entrega | Critério de saída |
| --- | --- | --- |
| 0 · Fundação (1 sem.) | Repos, Docker Compose, lint, CI, tokens do Figma | App, API e painel sobem local |
| 1 · Especificação (1–2 sem.) | Telas que faltam no Figma, modelo + Flyway v1, OpenAPI, termos v1 | Especificação aprovada |
| 2 · Autenticação (2 sem.) | Login, cadastro, JWT + refresh, perfil, acessibilidade | Login nos dois papéis |
| 3 · Profissional (2–3 sem.) | Cadastro, documentos, serviços com preço, política | Perfil completo salvo |
| 4 · Busca (2 sem.) | Home, categorias, busca PostGIS, perfil público | Busca abaixo de 500 ms |
| 5 · Pedidos e orçamentos (3 sem.) | Agendar, orçamento, aceitar/recusar/concluir | Os dois fluxos ponta a ponta |
| 6 · Contrato e cancelamento (2 sem.) | Contrato + PDF, multa, sinal, reagendamento | Multa correta nos testes |
| 7 · Confiança e painel web (3 sem.) | Avaliações, denúncias, painel de verificação e suspensão | Admin aprova um perfil |
| 8 · Lançamento (2 sem.) | Testes, LGPD, revisão jurídica, deploy, beta Android | MVP publicado |

## Situação desta pasta (27/10/2026)

Fase 0 praticamente concluída: veja "O que já está pronto" no README.
