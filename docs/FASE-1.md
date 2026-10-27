# Fase 1 — Especificação

Entregue em 27/10/2026. Critério de saída: especificação aprovada pelo time e termos revisados por advogado.

| Entrega | Situação | Onde está |
| --- | --- | --- |
| Telas que faltavam no protótipo | 10 telas do app + 4 do painel, aguardando aprovação | [Figma — ChamaLÁ — Fase 1: telas novas](https://www.figma.com/design/9ZR33gdjklJZ88JHpqy2pL) |
| Modelo de dados + Flyway v1 | Pronto; migrações rodadas em PostgreSQL 16 + PostGIS 3.4 | `chamala-backend/src/main/resources/db/migration` |
| Contrato OpenAPI v1 | 44 rotas, 54 operações; Redocly sem erros nem avisos | `chamala-backend/api/openapi.yaml`, `docs/api/index.html` |
| Termos de uso + contrato padrão v1 | Rascunho para revisão jurídica | [Documento online](https://claude.ai/artifact/7FkssxCrEBKv5ajs9g6Lww) |

## Telas novas (Figma)

App mobile (390 × 844): 01 Recuperar senha · 02 Avaliar serviço · 03 Detalhe do pedido ·
04 Meus serviços · 05 Política de cancelamento · 06 Pedir orçamento · 07 Responder orçamento ·
08 Contrato · 09 Cancelar pedido (folha com multa) · 10 Propor nova data.

Painel admin (1280 × 800): A Fila de verificação · B Análise de verificação · C Denúncias · D Pedido (mediação).

O arquivo usa os componentes Button, TextField, ScreenHeader e StatusBadge e 15 variáveis de cor
com os mesmos valores de `chamala-mobile/src/theme`.

## Ponto de atenção

O direito de arrependimento do CDC (art. 49) dá 7 dias para desistir sem custo em contratações
feitas fora do estabelecimento. O rascunho dos termos assume que não há multa nesse período;
se o advogado confirmar, a simulação de cancelamento precisa considerar a data do aceite do contrato.
