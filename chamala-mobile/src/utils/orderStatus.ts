import type { BadgeStatus } from '../components';
import type { OrderStatus, UserRole } from '../types';

export const ACTIVE_STATUSES: OrderStatus[] = ['quote_requested', 'quote_sent', 'pending', 'confirmed'];

export const isActive = (status: OrderStatus) => ACTIVE_STATUSES.includes(status);

export function statusInfo(
  status: OrderStatus,
  role: UserRole,
): { label: string; badge: BadgeStatus } {
  switch (status) {
    case 'quote_requested':
      return { label: role === 'client' ? 'Orçamento solicitado' : 'Orçamento', badge: 'warning' };
    case 'quote_sent':
      return { label: role === 'client' ? 'Orçamento recebido' : 'Orçamento enviado', badge: 'warning' };
    case 'pending':
      return { label: 'Aguardando aceite', badge: 'warning' };
    case 'confirmed':
      return { label: 'Confirmado', badge: 'info' };
    case 'completed':
      return { label: 'Concluído', badge: 'success' };
    case 'cancelled':
      return { label: 'Cancelado', badge: 'danger' };
    case 'declined':
      return { label: 'Recusado', badge: 'danger' };
  }
}
