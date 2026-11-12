# Front-end MVP: como rodar e o que falta

## Rodar

```bash
npx expo install @expo/vector-icons react-native-safe-area-context react-native-screens \
  @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  @hookform/resolvers expo-status-bar expo-secure-store expo-image-picker expo-document-picker
npm install axios react-hook-form zod
npx expo start -c
```

O app abre em **modo de testes** (`USE_MOCKS = true`): tudo funciona sem back-end, com dados em memória
(voltam ao início ao recarregar). Contas de teste, senha `12345678`:

- **Cliente:** `cliente@teste.com`
- **Profissional:** `profissional@teste.com`
- Também dá para criar contas novas pelos cadastros.

## Ligar ao back-end

1. Copie `.env.example` para `.env` e defina `EXPO_PUBLIC_API_URL` e `EXPO_PUBLIC_USE_MOCKS=false`.
2. Ajuste os endpoints em `src/services/httpApi.ts` conforme o contrato combinado (`docs/API_CONTRACT.md`).
3. Nenhuma tela precisa mudar: elas só usam `api.xxx` (`src/services/index.ts`).

## Como escrever estilos (alto contraste)

As cores trocam em tempo real entre a paleta normal e a de **alto contraste** (tela Acessibilidade). Por isso
**nenhum arquivo de tela ou componente lê `colors` direto do tema**. O padrão é:

```tsx
import { spacing, typography } from '../theme';            // espaçamentos e tipografia continuam estáticos
import { makeStyles, useColors } from '../theme/dynamic';

export function MeuComponente() {
  const styles = useStyles();      // estilos que acompanham a paleta
  const colors = useColors();      // para cores usadas fora de estilo (ex.: cor de um ícone)
  return <View style={styles.box}><Ionicons color={colors.primary} /></View>;
}

const useStyles = makeStyles((colors) => ({ box: { backgroundColor: colors.surface } }));
```

(Não importe `colors` de `../theme` em telas e componentes: use o parâmetro de `makeStyles` e o `useColors()`.)
Os dois modos têm os mesmos nomes de cor em `src/theme/index.ts` (`colors` e `highContrastColors`). Texto: use o
`Text` de `src/components` (ele aplica o tamanho escolhido na tela Acessibilidade).

## Telas (36 telas)

**Autenticação:** Boas-vindas, Login, Recuperar senha, Cadastro de cliente, Cadastro de profissional (etapa 1),
Verificação (etapa 2), Verificação enviada.
**Cliente (abas Início, Serviços, Pedidos, Perfil):** Categorias, Lista de profissionais, Perfil do profissional,
Agendar serviço, Pedir orçamento, Meus pedidos, Perfil, Endereços salvos.
**Profissional (abas Painel, Solicitações, Verificação, Perfil):** Painel, Solicitações, Status da verificação,
Meu perfil, Meus serviços (+ formulário), Cancelamento e sinal, Responder orçamento, Serviços realizados, Dados de pagamento.
**Compartilhadas:** Detalhe do pedido, Contrato, Cancelar pedido (folha), Propor nova data, Avaliar serviço,
Avaliações, Editar perfil, Notificações, Acessibilidade (tamanho do texto funciona), Ajuda e Privacidade.

## Telas que NÃO estavam no Figma (propostas minhas, confirmar com o design)

Login, Cadastro de cliente, aba Início, aba Solicitações, aba Verificação (acompanhamento), Endereços,
Notificações, Acessibilidade, Ajuda/Privacidade, Editar perfil, Dados de pagamento, Serviço (formulário),
e as ações "Aceitar/Recusar orçamento" do cliente, "Marcar como concluído" e aceitar/recusar nova data
(necessárias para o fluxo funcionar).

## Provisório, trocar antes de publicar

- `SUPPORT_EMAIL` e `SUPPORT_WHATSAPP` em `src/config/env.ts` são **placeholders**.
- Texto do contrato (`src/utils/contract.ts`), política de privacidade e FAQ (`InfoScreen`): redação provisória, precisa do jurídico.
- Botão "Baixar PDF" só mostra um aviso (o PDF vem do back-end).
- Logo e ícones são placeholders de baixa resolução; nome do app (ChamaLÁ ou ServiçoJá) ainda em definição (`APP_NAME`).
- Não há pagamento, push, mapa/localização nem upload real de fotos de orçamento (ver contrato, "Pontos a decidir").

## Regras assumidas a partir do Figma

- Desconto de 20% só no agendamento **por hora** (resumo do Figma); serviços de preço fixo não têm desconto.
- Multa de cancelamento: grátis até X horas antes; depois, Y% do valor (X e Y vêm da política do profissional, padrão 24 h e 15%).
- Multa só se aplica a pedidos **confirmados** e quando quem cancela é o **cliente**.
- Profissional só vê o bairro (não o endereço completo) até o pedido ser confirmado.
