import { DEFAULT_POLICY, PROMO_DISCOUNT_PERCENT } from '../config/env';
import type {
  Address,
  Category,
  NotificationPrefs,
  Order,
  PaymentData,
  ProfessionalDetail,
  Review,
  User,
  UserRole,
} from '../types';
import { computeCancellation } from '../utils/cancellation';
import { round2, shortName } from '../utils/format';
import { tokenStorage } from './tokenStorage';
import type { Api } from './types';

// ---------------------------------------------------------------------------------------
// Back-end FALSO em memória. Os dados voltam ao início quando o app é recarregado.
// Contas de teste (senha 12345678):  cliente@teste.com  |  profissional@teste.com
// ---------------------------------------------------------------------------------------

const delay = (ms = 350) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const iso = (d: Date) => d.toISOString();
const nowIso = () => iso(new Date());
const hoursFromNow = (h: number) => iso(new Date(Date.now() + h * 36e5));
const dayAt = (offsetDays: number, hour: number, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return iso(d);
};
let seq = 1000;
const nextId = (prefix: string) => `${prefix}${++seq}`;
const orderCode = () => Math.random().toString(16).slice(2, 6).toUpperCase();
const neighborhoodOf = (address: string) => address.split(/\s[-–]\s/).pop() ?? address;

const categories: Category[] = [
  { id: 'limpeza', name: 'Limpeza', emoji: '🧹', color: '#EDF3FC' },
  { id: 'eletrica', name: 'Elétrica', emoji: '⚡', color: '#FDF9E4' },
  { id: 'hidraulica', name: 'Hidráulica', emoji: '🔧', color: '#E8F5EA' },
  { id: 'pintura', name: 'Pintura', emoji: '🎨', color: '#F9E6EC' },
  { id: 'montagem', name: 'Montagem', emoji: '🪑', color: '#EEE7EF' },
  { id: 'jardinagem', name: 'Jardinagem', emoji: '🌿', color: '#E8F5EA' },
  { id: 'reformas', name: 'Reformas', emoji: '🏠', color: '#FBF2DF' },
  { id: 'mudanca', name: 'Mudança', emoji: '📦', color: '#E6F3F1' },
];

// ----- usuários ---------------------------------------------------------------------------
const users: { user: User; password: string }[] = [
  {
    password: '12345678',
    user: { id: 'u_vinicius', name: 'Vinícius Silva', email: 'cliente@teste.com', phone: '(11) 98765-4321', role: 'client' },
  },
  {
    password: '12345678',
    user: {
      id: 'pro_carlos',
      name: 'Carlos Mendes',
      email: 'profissional@teste.com',
      phone: '(81) 99876-5432',
      role: 'professional',
      specialty: 'Limpeza',
      area: 'Camaragibe, Pernambuco',
      verificationStatus: 'unsubmitted',
    },
  },
];

// ----- profissionais ----------------------------------------------------------------------
type Seed = [id: string, name: string, cat: string, specialty: string, emoji: string, rating: number, count: number, km: number, rate: number, verified: boolean, services: [string, number, boolean?][], quotes: boolean];

const proSeeds: Seed[] = [
  ['pro_carlos', 'Carlos Mendes', 'limpeza', 'Limpeza residencial', '👨', 4.9, 127, 1.2, 80, false, [['Limpeza completa', 160], ['Limpeza pós-obra', 150], ['Limpeza de estofados', 120], ['Higienização de colchão', 90, false]], true],
  ['pro_ana', 'Ana Paula Santos', 'limpeza', 'Limpeza pós-obra', '👩', 4.8, 89, 2.5, 70, true, [['Limpeza pós-obra', 280], ['Limpeza de vidros', 110]], true],
  ['pro_marcos', 'Marcos Ferreira', 'limpeza', 'Limpeza comercial', '👨', 4.7, 203, 3.1, 90, true, [['Limpeza de escritório', 220]], false],
  ['pro_juliana', 'Juliana Costa', 'limpeza', 'Organização e limpeza', '👩', 4.6, 55, 4.0, 65, false, [['Organização de armários', 140]], true],
  ['pro_rafael', 'Rafael Costa', 'eletrica', 'Instalações elétricas', '👨', 4.9, 64, 1.8, 95, true, [['Instalação de chuveiro', 150], ['Troca de tomada ou interruptor', 60], ['Instalação de luminária', 90]], true],
  ['pro_paulo', 'Paulo Henrique', 'eletrica', 'Reparos elétricos', '👨', 4.6, 41, 3.4, 85, false, [['Reparo de curto-circuito', 130]], true],
  ['pro_marta', 'Marta Lima', 'hidraulica', 'Encanamento e vazamentos', '👩', 4.8, 73, 2.1, 90, true, [['Troca de torneira', 80], ['Desentupimento de pia', 120]], true],
  ['pro_sergio', 'Sérgio Alves', 'hidraulica', 'Desentupimento', '👨', 4.5, 30, 5.0, 80, false, [['Desentupimento de ralo', 100]], false],
  ['pro_beto', 'Beto Nogueira', 'pintura', 'Pintura residencial', '👨', 4.7, 58, 2.9, 70, true, [['Pintura de quarto', 380]], true],
  ['pro_luciana', 'Luciana Prado', 'pintura', 'Pintura e texturas', '👩', 4.6, 39, 4.2, 75, false, [['Aplicação de textura', 320]], true],
  ['pro_diego', 'Diego Martins', 'montagem', 'Montagem de móveis', '👨', 4.8, 97, 1.5, 60, true, [['Montagem de guarda-roupa', 180], ['Montagem de estante', 90]], false],
  ['pro_teresa', 'Teresa Barros', 'jardinagem', 'Jardinagem e paisagismo', '👩', 4.7, 44, 3.8, 70, false, [['Poda e limpeza de jardim', 160]], true],
  ['pro_ivan', 'Ivan Cardoso', 'reformas', 'Pequenas reformas', '👨', 4.6, 36, 6.0, 100, false, [['Reforma de banheiro (orçamento)', 0]], true],
  ['pro_fabio', 'Fábio Rocha', 'mudanca', 'Fretes e mudanças', '👨', 4.5, 52, 4.4, 120, false, [['Frete pequeno', 150]], false],
];

const professionals: ProfessionalDetail[] = proSeeds.map(
  ([id, name, cat, specialty, emoji, rating, count, km, rate, verified, services, quotes]) => ({
    id,
    name,
    categoryId: cat,
    specialty,
    emoji,
    rating,
    reviewsCount: count,
    distanceKm: km,
    hourlyRate: rate,
    verified,
    jobsCount: count,
    area: 'Recife e região',
    services: services.map(([title, price, active], i) => ({ id: `${id}_s${i + 1}`, title, price, active: active ?? true })),
    acceptsQuotes: quotes,
    policy: { freeCancelHours: DEFAULT_POLICY.freeCancelHours, penaltyPercent: DEFAULT_POLICY.penaltyPercent, depositEnabled: false, depositPercent: 20 },
  }),
);
const carlos = professionals[0];
carlos.area = 'Camaragibe, Pernambuco';

const daysAgo = (n: number) => iso(new Date(Date.now() - n * 864e5));
const reviewsByPro: Record<string, Review[]> = {
  pro_carlos: [
    { id: 'rv1', authorName: 'Maria S.', rating: 5, comment: 'Ótimo trabalho! Pontual e muito caprichoso.', createdAt: daysAgo(20) },
    { id: 'rv2', authorName: 'João P.', rating: 5, comment: 'Serviço excelente, recomendo!', createdAt: daysAgo(25) },
    { id: 'rv3', authorName: 'Camila R.', rating: 4, comment: 'Muito bom, só atrasou um pouco.', createdAt: daysAgo(40) },
  ],
};
const defaultReviews = (): Review[] => [
  { id: 'rvx1', authorName: 'Ana L.', rating: 5, comment: 'Atendimento rápido e educado.', createdAt: daysAgo(12) },
  { id: 'rvx2', authorName: 'Pedro M.', rating: 4, comment: 'Resolveu o problema, voltarei a contratar.', createdAt: daysAgo(30) },
];
const reviewsGivenByClient: Review[] = [
  { id: 'rg1', authorName: 'Vinícius S.', rating: 5, comment: 'Tudo perfeito, recomendo.', createdAt: daysAgo(60), serviceTitle: 'Limpeza de estofados', professionalName: 'Ana Paula Santos' },
];

// ----- pedidos ----------------------------------------------------------------------------
const basePolicy = { freeCancelHours: 24, penaltyPercent: 15, depositPercent: 0 };

function makeOrder(p: Partial<Order> & Pick<Order, 'status' | 'clientId' | 'clientName' | 'professionalId' | 'professionalName' | 'serviceTitle' | 'scheduledAt' | 'address'>): Order {
  const price = p.price ?? 0;
  const discount = p.discount ?? 0;
  return {
    id: nextId('o'),
    code: orderCode(),
    specialty: '',
    photos: [],
    neighborhood: neighborhoodOf(p.address),
    distanceKm: 2,
    price,
    discount,
    total: round2(price - discount),
    depositPaid: 0,
    policy: { ...basePolicy },
    contract: { version: '2026-11-v1', clientAcceptedAt: nowIso(), professionalAcceptedAt: nowIso() },
    reviewed: false,
    createdAt: nowIso(),
    ...p,
  };
}

const orders: Order[] = [
  makeOrder({ id: 'o1', code: 'A1F3', status: 'confirmed', clientId: 'u_vinicius', clientName: 'Vinícius Silva', professionalId: 'pro_rafael', professionalName: 'Rafael Costa', specialty: 'Elétrica', serviceTitle: 'Instalação de chuveiro', scheduledAt: dayAt(2, 9), address: 'Rua da Aurora, 120 – Boa Vista', price: 150, distanceKm: 1.8 }),
  makeOrder({ id: 'o2', code: 'B7C2', status: 'confirmed', clientId: 'u_vinicius', clientName: 'Vinícius Silva', professionalId: 'pro_carlos', professionalName: 'Carlos Mendes', specialty: 'Limpeza', serviceTitle: 'Limpeza residencial', scheduledAt: hoursFromNow(6), address: 'Rua das Flores, 123 - Camaragibe', price: 160, hours: 2, distanceKm: 1.2, contract: { version: '2026-11-v1', clientAcceptedAt: nowIso() } }),
  makeOrder({ id: 'o3', code: 'C9D4', status: 'completed', clientId: 'u_vinicius', clientName: 'Vinícius Silva', professionalId: 'pro_rafael', professionalName: 'Rafael Costa', specialty: 'Elétrica', serviceTitle: 'Instalação de chuveiro', scheduledAt: daysAgo(5), address: 'Rua da Aurora, 120 – Boa Vista', price: 150 }),
  makeOrder({ id: 'o4', code: 'D3E8', status: 'quote_sent', clientId: 'u_vinicius', clientName: 'Vinícius Silva', professionalId: 'pro_marta', professionalName: 'Marta Lima', specialty: 'Hidráulica', serviceTitle: 'Orçamento: vazamento embaixo da pia', description: 'Vazamento embaixo da pia da cozinha, o cano parece rachado.', scheduledAt: dayAt(3, 14), address: 'Rua do Hospício, 45 – Boa Vista', price: 180, quote: { validityDays: 7, message: 'Inclui troca do sifão e do cano.', sentAt: nowIso() }, contract: { version: '2026-11-v1', professionalAcceptedAt: nowIso() } }),
  // pedidos recebidos pelo profissional de teste (Carlos Mendes)
  makeOrder({ id: 'r1', code: 'E4A1', status: 'pending', clientId: 'u_maria', clientName: 'Maria Souza', professionalId: 'pro_carlos', professionalName: 'Carlos Mendes', specialty: 'Limpeza', serviceTitle: 'Limpeza residencial', scheduledAt: dayAt(1, 9), address: 'Rua das Palmeiras, 45 - Camaragibe', price: 80, hours: 1, contract: { version: '2026-11-v1', clientAcceptedAt: nowIso() } }),
  makeOrder({ id: 'r2', code: 'F2B6', status: 'pending', clientId: 'u_joao', clientName: 'João Ferreira', professionalId: 'pro_carlos', professionalName: 'Carlos Mendes', specialty: 'Limpeza', serviceTitle: 'Limpeza pós-obra', scheduledAt: dayAt(2, 13), address: 'Av. Getúlio Vargas, 800 - Olinda', price: 150, contract: { version: '2026-11-v1', clientAcceptedAt: nowIso() } }),
  makeOrder({ id: 'q1', code: 'G8C5', status: 'quote_requested', clientId: 'u_ana', clientName: 'Ana S.', professionalId: 'pro_carlos', professionalName: 'Carlos Mendes', specialty: 'Limpeza', serviceTitle: 'Orçamento: limpeza completa', description: 'Limpeza completa de apartamento de 2 quartos após reforma, com retirada de pó fino.', photos: [], scheduledAt: dayAt(3, 14), address: 'Rua do Hospício, 45 – Boa Vista', contract: { version: '2026-11-v1', clientAcceptedAt: nowIso() } }),
];
const nowDate = new Date();
for (let i = 1; i <= 8; i++) {
  orders.push(
    makeOrder({ id: `c${i}`, code: orderCode(), status: 'completed', clientId: `u_old${i}`, clientName: `Cliente ${i}`, professionalId: 'pro_carlos', professionalName: 'Carlos Mendes', specialty: 'Limpeza', serviceTitle: 'Limpeza residencial', scheduledAt: iso(new Date(nowDate.getFullYear(), nowDate.getMonth(), i, 10)), address: 'Camaragibe', price: 80, reviewed: true }),
  );
}

const addresses: Address[] = [{ id: 'a1', label: 'Casa', line: 'Rua das Flores, 123 - Camaragibe' }];
let notificationPrefs: NotificationPrefs = { orders: true, messages: true, promotions: false };
let payment: PaymentData = { holderName: 'Carlos Mendes', pixKey: '' };
let available = true;
let acceptsQuotesOverride: boolean | null = null;

// ----- sessão -----------------------------------------------------------------------------
let currentUserId: string | null = null;
const TOKEN_PREFIX = 'mock-token:';

function current(): User {
  const found = users.find((u) => u.user.id === currentUserId);
  if (!found) throw new Error('Sessão expirada. Entre novamente.');
  return found.user;
}
const role = (): UserRole => current().role;
const myPro = () => professionals.find((p) => p.id === current().id);

const findOrder = (id: string): Order => {
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error('Pedido não encontrado.');
  return order;
};
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const emptySession = (user: User) => ({ token: `${TOKEN_PREFIX}${user.id}`, user: clone(user) });

function createUser(input: { name: string; email: string; phone: string; password: string }, userRole: UserRole): User {
  if (users.some((u) => u.user.email.toLowerCase() === input.email.trim().toLowerCase())) {
    throw new Error('Este e-mail já está cadastrado.');
  }
  const user: User = {
    id: nextId(userRole === 'client' ? 'u_' : 'pro_'),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone,
    role: userRole,
  };
  users.push({ user, password: input.password });
  currentUserId = user.id;
  return user;
}

function applyPolicySnapshot(order: Order, proId: string) {
  const pro = professionals.find((p) => p.id === proId);
  if (!pro) return;
  order.policy = {
    freeCancelHours: pro.policy.freeCancelHours,
    penaltyPercent: pro.policy.penaltyPercent,
    depositPercent: pro.policy.depositEnabled ? pro.policy.depositPercent : 0,
  };
}

export const mockApi: Api = {
  auth: {
    async login(email, password) {
      await delay();
      const found = users.find((u) => u.user.email.toLowerCase() === email.trim().toLowerCase());
      if (!found || found.password !== password) throw new Error('E-mail ou senha incorretos.');
      currentUserId = found.user.id;
      return emptySession(found.user);
    },
    async registerClient(input) {
      await delay();
      return emptySession(createUser(input, 'client'));
    },
    async registerProfessional(input) {
      await delay();
      const category = categories.find((c) => c.id === input.specialtyId);
      const user = createUser(input, 'professional');
      user.specialty = category?.name;
      user.area = input.area.trim();
      user.verificationStatus = 'unsubmitted';
      professionals.push({
        id: user.id, name: user.name, categoryId: input.specialtyId, specialty: category?.name ?? 'Serviços gerais',
        emoji: '🧑', rating: 0, reviewsCount: 0, distanceKm: 3, hourlyRate: 60, verified: false, jobsCount: 0,
        area: user.area, services: [], acceptsQuotes: true,
        policy: { freeCancelHours: 24, penaltyPercent: 15, depositEnabled: false, depositPercent: 20 },
      });
      return emptySession(user);
    },
    async forgotPassword() {
      await delay();
    },
    async me() {
      await delay(150);
      const token = await tokenStorage.get();
      const id = token?.startsWith(TOKEN_PREFIX) ? token.slice(TOKEN_PREFIX.length) : null;
      const found = users.find((u) => u.user.id === id);
      if (!found) throw new Error('Sessão expirada. Entre novamente.');
      currentUserId = found.user.id;
      return clone(found.user);
    },
    async updateProfile(patch) {
      await delay();
      const user = current();
      Object.assign(user, { name: patch.name.trim(), phone: patch.phone, email: patch.email.trim().toLowerCase() });
      const pro = myPro();
      if (pro) pro.name = user.name;
      return clone(user);
    },
  },

  catalog: {
    async categories() {
      await delay(200);
      return clone(categories);
    },
    async professionals({ categoryId, sort = 'nearest', query }) {
      await delay(250);
      let list = professionals.filter((p) => (categoryId ? p.categoryId === categoryId : true));
      if (query) list = list.filter((p) => `${p.name} ${p.specialty}`.toLowerCase().includes(query.toLowerCase()));
      const sorted = [...list].sort((a, b) =>
        sort === 'rating' ? b.rating - a.rating : sort === 'price' ? a.hourlyRate - b.hourlyRate : a.distanceKm - b.distanceKm,
      );
      return clone(sorted);
    },
    async professional(id) {
      await delay(250);
      const pro = professionals.find((p) => p.id === id);
      if (!pro) throw new Error('Profissional não encontrado.');
      return clone(pro);
    },
    async professionalReviews(id) {
      await delay(200);
      return clone(reviewsByPro[id] ?? defaultReviews());
    },
  },

  orders: {
    async list() {
      await delay(300);
      const me = current();
      const mine = orders.filter((o) => (me.role === 'client' ? o.clientId === me.id : o.professionalId === me.id));
      return clone(mine);
    },
    async get(id) {
      await delay(200);
      return clone(findOrder(id));
    },
    async createBooking(input) {
      await delay();
      const me = current();
      const pro = professionals.find((p) => p.id === input.professionalId);
      if (!pro) throw new Error('Profissional não encontrado.');
      const service = pro.services.find((s) => s.id === input.serviceId);
      const hours = service ? undefined : input.hours ?? 2;
      const price = service ? service.price : round2(pro.hourlyRate * (hours ?? 2));
      const discount = service ? 0 : round2((price * PROMO_DISCOUNT_PERCENT) / 100);
      const order = makeOrder({
        status: 'pending', clientId: me.id, clientName: me.name, professionalId: pro.id, professionalName: pro.name,
        specialty: pro.specialty, serviceTitle: service?.title ?? pro.specialty, scheduledAt: input.scheduledAt,
        address: input.address, notes: input.notes, price, discount, hours, distanceKm: pro.distanceKm,
        contract: { version: '2026-11-v1', clientAcceptedAt: nowIso() },
      });
      applyPolicySnapshot(order, pro.id);
      orders.unshift(order);
      return clone(order);
    },
    async createQuoteRequest(input) {
      await delay();
      const me = current();
      const pro = professionals.find((p) => p.id === input.professionalId);
      if (!pro) throw new Error('Profissional não encontrado.');
      const order = makeOrder({
        status: 'quote_requested', clientId: me.id, clientName: me.name, professionalId: pro.id, professionalName: pro.name,
        specialty: pro.specialty, serviceTitle: 'Orçamento', description: input.description, photos: input.photos,
        scheduledAt: input.scheduledAt, address: input.address, distanceKm: pro.distanceKm,
        contract: { version: '2026-11-v1', clientAcceptedAt: nowIso() },
      });
      applyPolicySnapshot(order, pro.id);
      orders.unshift(order);
      return clone(order);
    },
    async accept(id) {
      await delay();
      const order = findOrder(id);
      order.status = 'confirmed';
      order.contract.professionalAcceptedAt = nowIso();
      return clone(order);
    },
    async decline(id) {
      await delay();
      const order = findOrder(id);
      order.status = 'declined';
      return clone(order);
    },
    async complete(id) {
      await delay();
      const order = findOrder(id);
      order.status = 'completed';
      return clone(order);
    },
    async cancel(id, reason) {
      await delay();
      const order = findOrder(id);
      const by = role();
      const fee = by === 'client' ? computeCancellation(order).fee : 0;
      order.status = 'cancelled';
      order.cancellation = { by, reason, fee, at: nowIso() };
      return clone(order);
    },
    async sendQuote(id, input) {
      await delay();
      const order = findOrder(id);
      order.status = 'quote_sent';
      order.price = round2(input.price);
      order.total = order.price;
      order.quote = { validityDays: input.validityDays, message: input.message, sentAt: nowIso() };
      order.contract.professionalAcceptedAt = nowIso();
      return clone(order);
    },
    async respondQuote(id, accept) {
      await delay();
      const order = findOrder(id);
      if (accept) {
        order.status = 'confirmed';
        order.contract.clientAcceptedAt = nowIso();
      } else {
        order.status = 'declined';
      }
      return clone(order);
    },
    async acceptContract(id) {
      await delay();
      const order = findOrder(id);
      if (role() === 'client') order.contract.clientAcceptedAt = nowIso();
      else order.contract.professionalAcceptedAt = nowIso();
      return clone(order);
    },
    async proposeReschedule(id, input) {
      await delay();
      const order = findOrder(id);
      order.reschedule = { proposedBy: role(), scheduledAt: input.scheduledAt, message: input.message, status: 'pending' };
      return clone(order);
    },
    async respondReschedule(id, accept) {
      await delay();
      const order = findOrder(id);
      if (order.reschedule) {
        if (accept) order.scheduledAt = order.reschedule.scheduledAt;
        order.reschedule.status = accept ? 'accepted' : 'declined';
      }
      return clone(order);
    },
    async review(id, input) {
      await delay();
      const order = findOrder(id);
      order.reviewed = true;
      const review: Review = {
        id: nextId('rv'), authorName: shortName(order.clientName), rating: input.rating,
        comment: input.comment ?? '', createdAt: nowIso(), serviceTitle: order.serviceTitle, professionalName: order.professionalName,
      };
      (reviewsByPro[order.professionalId] ??= defaultReviews()).unshift(review);
      reviewsGivenByClient.unshift({ ...review, authorName: shortName(order.clientName) });
      const pro = professionals.find((p) => p.id === order.professionalId);
      if (pro) {
        pro.rating = Math.round(((pro.rating * pro.reviewsCount + input.rating) / (pro.reviewsCount + 1)) * 10) / 10;
        pro.reviewsCount += 1;
      }
      return clone(order);
    },
  },

  professional: {
    async dashboard() {
      await delay(300);
      const me = current();
      const pro = myPro();
      const now = new Date();
      const mine = orders.filter((o) => o.professionalId === me.id);
      const doneThisMonth = mine.filter((o) => {
        const d = new Date(o.scheduledAt);
        return o.status === 'completed' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      return clone({
        monthEarnings: round2(doneThisMonth.reduce((sum, o) => sum + o.total, 0)),
        servicesCount: doneThisMonth.length,
        rating: pro?.rating ?? 0,
        available,
        verificationStatus: me.verificationStatus ?? 'unsubmitted',
        pending: mine.filter((o) => o.status === 'pending' || o.status === 'quote_requested'),
      });
    },
    async setAvailability(value) {
      await delay(150);
      available = value;
    },
    async services() {
      await delay(200);
      const pro = myPro();
      return clone({ services: pro?.services ?? [], acceptsQuotes: acceptsQuotesOverride ?? pro?.acceptsQuotes ?? true });
    },
    async saveService(service) {
      await delay();
      const pro = myPro();
      if (!pro) throw new Error('Perfil profissional não encontrado.');
      const existing = service.id ? pro.services.find((s) => s.id === service.id) : undefined;
      if (existing) {
        Object.assign(existing, { title: service.title, price: service.price, active: service.active });
        return clone(existing);
      }
      const created = { id: nextId(`${pro.id}_s`), title: service.title, price: service.price, active: service.active };
      pro.services.push(created);
      return clone(created);
    },
    async deleteService(id) {
      await delay();
      const pro = myPro();
      if (pro) pro.services = pro.services.filter((s) => s.id !== id);
    },
    async setAcceptsQuotes(value) {
      await delay(150);
      acceptsQuotesOverride = value;
      const pro = myPro();
      if (pro) pro.acceptsQuotes = value;
    },
    async policy() {
      await delay(200);
      return clone((myPro() ?? carlos).policy);
    },
    async savePolicy(policy) {
      await delay();
      const pro = myPro() ?? carlos;
      pro.policy = { ...policy };
      return clone(pro.policy);
    },
    async verificationStatus() {
      await delay(200);
      return current().verificationStatus ?? 'unsubmitted';
    },
    async submitVerification() {
      await delay(900);
      const me = current();
      me.verificationStatus = 'pending';
      return 'pending';
    },
    async reviewsReceived() {
      await delay(200);
      return clone(reviewsByPro[current().id] ?? []);
    },
    async paymentData() {
      await delay(200);
      return clone({ ...payment, holderName: payment.holderName || current().name });
    },
    async savePaymentData(data) {
      await delay();
      payment = { ...data };
      return clone(payment);
    },
  },

  account: {
    async addresses() {
      await delay(200);
      return clone(addresses);
    },
    async addAddress(input) {
      await delay();
      const created = { id: nextId('a'), ...input };
      addresses.push(created);
      return clone(created);
    },
    async removeAddress(id) {
      await delay(150);
      const index = addresses.findIndex((a) => a.id === id);
      if (index >= 0) addresses.splice(index, 1);
    },
    async notificationPrefs() {
      await delay(150);
      return { ...notificationPrefs };
    },
    async saveNotificationPrefs(prefs) {
      await delay(150);
      notificationPrefs = { ...prefs };
      return { ...notificationPrefs };
    },
    async reviewsGiven() {
      await delay(200);
      return clone(reviewsGivenByClient);
    },
  },
};
