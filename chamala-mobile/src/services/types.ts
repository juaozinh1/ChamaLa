import type {
  Address,
  BookingInput,
  Category,
  CancellationPolicy,
  ClientSignUpInput,
  Dashboard,
  NotificationPrefs,
  Order,
  PaymentData,
  ProfessionalDetail,
  ProfessionalSignUpInput,
  ProfessionalSort,
  ProfessionalSummary,
  QuoteInput,
  QuoteRequestInput,
  RescheduleInput,
  Review,
  ReviewInput,
  ServiceOffering,
  Session,
  User,
  VerificationPayload,
  VerificationStatus,
} from '../types';

/**
 * Contrato único entre o app e o back-end.
 * `mockApi.ts` e `httpApi.ts` implementam esta mesma interface; trocar entre eles é só
 * mudar USE_MOCKS em `src/config/env.ts`. Os endpoints do `httpApi.ts` são uma PROPOSTA
 * (ver docs/API_CONTRACT.md) e devem ser alinhados com o back.
 */
export interface Api {
  auth: {
    login(email: string, password: string): Promise<Session>;
    registerClient(input: ClientSignUpInput): Promise<Session>;
    registerProfessional(input: ProfessionalSignUpInput): Promise<Session>;
    forgotPassword(email: string): Promise<void>;
    /** Dados do usuário logado (usado para restaurar a sessão). */
    me(): Promise<User>;
    updateProfile(patch: Pick<User, 'name' | 'phone' | 'email'>): Promise<User>;
  };
  catalog: {
    categories(): Promise<Category[]>;
    professionals(params: {
      categoryId?: string;
      sort?: ProfessionalSort;
      query?: string;
    }): Promise<ProfessionalSummary[]>;
    professional(id: string): Promise<ProfessionalDetail>;
    professionalReviews(id: string): Promise<Review[]>;
  };
  orders: {
    /** Pedidos do usuário logado (cliente: os que fez; profissional: os recebidos). */
    list(): Promise<Order[]>;
    get(id: string): Promise<Order>;
    createBooking(input: BookingInput): Promise<Order>;
    createQuoteRequest(input: QuoteRequestInput): Promise<Order>;
    accept(id: string): Promise<Order>;
    decline(id: string): Promise<Order>;
    complete(id: string): Promise<Order>;
    cancel(id: string, reason: string): Promise<Order>;
    sendQuote(id: string, input: QuoteInput): Promise<Order>;
    respondQuote(id: string, accept: boolean): Promise<Order>;
    acceptContract(id: string): Promise<Order>;
    proposeReschedule(id: string, input: RescheduleInput): Promise<Order>;
    respondReschedule(id: string, accept: boolean): Promise<Order>;
    review(id: string, input: ReviewInput): Promise<Order>;
  };
  professional: {
    dashboard(): Promise<Dashboard>;
    setAvailability(available: boolean): Promise<void>;
    services(): Promise<{ services: ServiceOffering[]; acceptsQuotes: boolean }>;
    saveService(service: Omit<ServiceOffering, 'id'> & { id?: string }): Promise<ServiceOffering>;
    deleteService(id: string): Promise<void>;
    setAcceptsQuotes(value: boolean): Promise<void>;
    policy(): Promise<CancellationPolicy>;
    savePolicy(policy: CancellationPolicy): Promise<CancellationPolicy>;
    verificationStatus(): Promise<VerificationStatus>;
    submitVerification(payload: VerificationPayload): Promise<VerificationStatus>;
    reviewsReceived(): Promise<Review[]>;
    paymentData(): Promise<PaymentData>;
    savePaymentData(data: PaymentData): Promise<PaymentData>;
  };
  account: {
    addresses(): Promise<Address[]>;
    addAddress(input: Omit<Address, 'id'>): Promise<Address>;
    removeAddress(id: string): Promise<void>;
    notificationPrefs(): Promise<NotificationPrefs>;
    saveNotificationPrefs(prefs: NotificationPrefs): Promise<NotificationPrefs>;
    reviewsGiven(): Promise<Review[]>;
  };
}
