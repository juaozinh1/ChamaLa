// Tipos de domínio alinhados ao modelo de dados do roadmap.
export type Role = 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';

export type VerificationStatus = 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type RequestType = 'FIXED' | 'QUOTE';

export type RequestStatus =
  | 'PENDING'
  | 'QUOTE_REQUESTED'
  | 'QUOTED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELED'
  | 'REJECTED'
  | 'QUOTE_DECLINED';

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface ProfessionalSummary {
  id: string;
  name: string;
  primaryCategory: string;
  ratingAvg: number;
  ratingCount: number;
  distanceKm: number; // sempre arredondada pela API (RNF05)
  verified: boolean;
  available: boolean;
}

export interface ProfessionalService {
  id: string;
  title: string;
  categoryId: number;
  priceCents: number;
}

export interface CancellationPolicy {
  cancelMinHours: number;
  cancelFeePct: number; // 10 a 20
  depositPct: number; // 0 = sem sinal
}

export interface ServiceRequest {
  id: string;
  type: RequestType;
  status: RequestStatus;
  professionalName: string;
  serviceTitle: string;
  scheduledDate: string; // ISO yyyy-mm-dd
  timeSlot: string; // HH:mm
  priceCents: number | null;
}
