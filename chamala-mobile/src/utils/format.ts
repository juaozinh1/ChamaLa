// Formatação pt-BR feita à mão (sem Intl) para não depender do suporte do motor JS.

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** 1234.5 -> "R$ 1.234,50" */
export function formatCurrency(value: number): string {
  const [int, dec] = round2(Math.abs(value)).toFixed(2).split('.');
  const withDots = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${value < 0 ? '-' : ''}R$ ${withDots},${dec}`;
}

/** Aceita "R$ 1.234,50", "180" ou "180,5" e devolve o número (ou NaN). */
export function parseCurrency(text: string): number {
  const cleaned = text.replace(/[^\d,]/g, '').replace(',', '.');
  return cleaned ? Number(cleaned) : NaN;
}

export const onlyDigits = (text: string): string => text.replace(/\D/g, '');

/** "11987654321" -> "(11) 98765-4321" (aceita fixo de 10 dígitos). */
export function maskPhone(text: string): string {
  const d = onlyDigits(text).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const pad = (n: number) => String(n).padStart(2, '0');
const toDate = (value: string | Date) => (value instanceof Date ? value : new Date(value));

export const formatDate = (v: string | Date) => {
  const d = toDate(v);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};
export const formatDayMonth = (v: string | Date) => {
  const d = toDate(v);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
};
export const formatTime = (v: string | Date) => {
  const d = toDate(v);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
/** "Qui, 05/11/2026" */
export const formatWeekdayDate = (v: string | Date) =>
  `${WEEKDAYS[toDate(v).getDay()]}, ${formatDate(v)}`;
/** "Sex, 06/11" */
export const formatWeekdayDay = (v: string | Date) =>
  `${WEEKDAYS[toDate(v).getDay()]}, ${formatDayMonth(v)}`;
/** "Sex 06/11" (chips) */
export const formatChipDay = (v: string | Date) =>
  `${WEEKDAYS[toDate(v).getDay()]} ${formatDayMonth(v)}`;
/** "25/09 às 09:00" */
export const formatDateTime = (v: string | Date) => `${formatDayMonth(v)} às ${formatTime(v)}`;
/** "Sex, 06/11 · 14:00" */
export const formatWeekdayDateTime = (v: string | Date) =>
  `${formatWeekdayDay(v)} · ${formatTime(v)}`;
/** "Qua, 04/11 às 09:00" */
export const formatWeekdayDayAt = (v: string | Date) =>
  `${formatWeekdayDay(v).replace(',', '').toLowerCase()} às ${formatTime(v)}`;

export const startOfDay = (v: string | Date) => {
  const d = new Date(toDate(v));
  d.setHours(0, 0, 0, 0);
  return d;
};

export const addDays = (v: string | Date, days: number) => {
  const d = new Date(toDate(v));
  d.setDate(d.getDate() + days);
  return d;
};

export const isSameDay = (a: string | Date, b: string | Date) =>
  startOfDay(a).getTime() === startOfDay(b).getTime();

/** Junta um dia e um horário "HH:mm" e devolve ISO. */
export function combineDateTime(day: string | Date, time: string): string {
  const [h, m] = time.split(':').map(Number);
  const d = startOfDay(day);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export function hoursUntil(iso: string, now: Date = new Date()): number {
  return (new Date(iso).getTime() - now.getTime()) / 36e5;
}

/** "Faltam 6 horas", "Faltam 2 dias" */
export function formatTimeLeft(hours: number): string {
  if (hours <= 0) return 'O horário do serviço já passou';
  if (hours < 1) return `Faltam ${Math.max(1, Math.round(hours * 60))} minutos`;
  if (hours < 48) {
    const h = Math.floor(hours);
    return `Faltam ${h} ${h === 1 ? 'hora' : 'horas'}`;
  }
  const days = Math.floor(hours / 24);
  return `Faltam ${days} dias`;
}

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? '';

/** "Maria Souza" -> "Maria S." */
export function shortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1].charAt(0)}.` : parts[0];
}

export const pluralize = (n: number, one: string, many: string) => (n === 1 ? one : many);
