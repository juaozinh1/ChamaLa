import type { Order } from '../types';
import { formatCurrency, round2 } from './format';

/**
 * Cláusulas do contrato exibidas no app. TEXTO PROVISÓRIO: o texto oficial (e o PDF) deve vir do
 * back-end / jurídico. A versão do contrato fica em order.contract.version.
 */
export function contractClauses(order: Order): string[] {
  const { freeCancelHours, penaltyPercent, depositPercent } = order.policy;
  const deposit = depositPercent > 0 ? round2((order.total * depositPercent) / 100) : 0;
  return [
    'O profissional se compromete a realizar o serviço descrito na data e horário combinados.',
    `O cliente pode cancelar sem custo até ${freeCancelHours} horas antes. Depois disso, é devida multa de ${penaltyPercent}% do valor.`,
    'Reagendamentos dependem do aceite da outra parte e não geram multa.',
    `O valor combinado é de ${formatCurrency(order.total)}${deposit > 0 ? `, com sinal de ${depositPercent}% (${formatCurrency(deposit)}) no agendamento` : ', sem sinal'}.`,
    'O profissional deve comparecer com os materiais e as ferramentas combinados pelo aplicativo.',
    'Divergências devem ser comunicadas pelo aplicativo. O aceite de cada parte fica registrado com data e hora.',
  ];
}
