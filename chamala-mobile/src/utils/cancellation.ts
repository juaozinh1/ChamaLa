import type { Order } from '../types';
import { round2 } from './format';

/** Calcula multa e reembolso de um cancelamento, com base na política do pedido. */
export function computeCancellation(
  order: Pick<Order, 'scheduledAt' | 'total' | 'policy' | 'depositPaid'>,
  now: Date = new Date(),
) {
  const startsAt = new Date(order.scheduledAt).getTime();
  const hoursLeft = (startsAt - now.getTime()) / 36e5;
  const free = hoursLeft >= order.policy.freeCancelHours;
  const fee = free ? 0 : round2((order.total * order.policy.penaltyPercent) / 100);
  const refund = Math.max(round2(order.depositPaid - fee), 0);
  const freeUntil = new Date(startsAt - order.policy.freeCancelHours * 36e5);
  return { hoursLeft, free, fee, refund, freeUntil };
}
