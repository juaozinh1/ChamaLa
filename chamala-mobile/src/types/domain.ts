import type { UserRole, VerificationStatus } from './user';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export type ProfessionalSort = 'nearest' | 'rating' | 'price';

export interface ServiceOffering {
  id: string;
  title: string;
  price: number;
  active: boolean;
}

export interface CancellationPolicy {
  freeCancelHours: number;
  penaltyPercent: number;
  depositEnabled: boolean;
  depositPercent: number;
}

export interface ProfessionalSummary {
  id: string;
  name: string;
  specialty: string;
  categoryId: string;
  emoji: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  hourlyRate: number;
  verified: boolean;
}

export interface ProfessionalDetail extends ProfessionalSummary {
  jobsCount: number;
  area: string;
  services: ServiceOffering[];
  acceptsQuotes: boolean;
  policy: CancellationPolicy;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  serviceTitle?: string;
  professionalName?: string;
}

export interface Address {
  id: string;
  label: string;
  line: string;
}

export interface NotificationPrefs {
  orders: boolean;
  messages: boolean;
  promotions: boolean;
}

export interface PaymentData {
  holderName: string;
  pixKey: string;
}

export type OrderStatus =
  | 'quote_requested' // cliente pediu orçamento
  | 'quote_sent' // profissional respondeu com valor
  | 'pending' // aguardando o profissional aceitar
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'declined';

export interface Order {
  id: string;
  code: string;
  status: OrderStatus;
  clientId: string;
  clientName: string;
  professionalId: string;
  professionalName: string;
  specialty: string;
  serviceTitle: string;
  description?: string;
  photos: string[];
  scheduledAt: string; // ISO
  address: string;
  neighborhood: string;
  distanceKm: number;
  hours?: number;
  price: number; // valor bruto
  discount: number;
  total: number; // price - discount
  depositPaid: number;
  policy: { freeCancelHours: number; penaltyPercent: number; depositPercent: number };
  contract: { version: string; clientAcceptedAt?: string; professionalAcceptedAt?: string };
  quote?: { validityDays: number; message?: string; sentAt: string };
  reschedule?: {
    proposedBy: UserRole;
    scheduledAt: string;
    message?: string;
    status: 'pending' | 'accepted' | 'declined';
  };
  cancellation?: { by: UserRole; reason: string; fee: number; at: string };
  reviewed: boolean;
  notes?: string;
  createdAt: string;
}

export interface Dashboard {
  monthEarnings: number;
  servicesCount: number;
  rating: number;
  available: boolean;
  verificationStatus: VerificationStatus;
  pending: Order[];
}

export interface BookingInput {
  professionalId: string;
  serviceId?: string;
  scheduledAt: string;
  hours?: number;
  address: string;
  notes?: string;
}

export interface QuoteRequestInput {
  professionalId: string;
  description: string;
  photos: string[];
  scheduledAt: string;
  address: string;
}

export interface QuoteInput {
  price: number;
  validityDays: number;
  message?: string;
}

export interface RescheduleInput {
  scheduledAt: string;
  message?: string;
}

export interface ReviewInput {
  rating: number;
  comment?: string;
}

export interface LocalFile {
  uri: string;
  name: string;
  mimeType?: string;
}

export interface VerificationPayload {
  selfie: LocalFile;
  docFront: LocalFile;
  docBack: LocalFile;
  certificate?: LocalFile;
  extraDoc?: LocalFile;
  workPhotos: LocalFile[];
  description?: string;
}
