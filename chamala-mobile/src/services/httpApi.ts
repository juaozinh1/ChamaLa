import type { Api } from './types';
import { http } from './http';

// Implementação real (Axios). Endpoints e formatos são uma PROPOSTA: alinhar com o back.
// Veja docs/API_CONTRACT.md. Respostas esperadas: o JSON já no formato dos tipos em src/types.
const get = async <T>(url: string, params?: object) => (await http.get<T>(url, { params })).data;
const post = async <T>(url: string, body?: unknown) => (await http.post<T>(url, body)).data;
const put = async <T>(url: string, body?: unknown) => (await http.put<T>(url, body)).data;
const patch = async <T>(url: string, body?: unknown) => (await http.patch<T>(url, body)).data;
const del = async (url: string) => {
  await http.delete(url);
};

function toFormData(payload: Record<string, unknown>): FormData {
  const form = new FormData();
  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'object' && 'uri' in (value as object)) {
      const f = value as { uri: string; name: string; mimeType?: string };
      // React Native aceita este formato de arquivo no FormData.
      form.append(key, { uri: f.uri, name: f.name, type: f.mimeType ?? 'application/octet-stream' } as unknown as Blob);
    } else {
      form.append(key, String(value));
    }
  };
  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => append(key, item));
    else append(key, value);
  });
  return form;
}

export const httpApi: Api = {
  auth: {
    login: (email, password) => post('/auth/login', { email, password }),
    registerClient: (input) => post('/auth/register/client', input),
    registerProfessional: (input) => post('/auth/register/professional', input),
    forgotPassword: async (email) => {
      await post('/auth/forgot-password', { email });
    },
    me: () => get('/me'),
    updateProfile: (patchData) => patch('/me', patchData),
  },
  catalog: {
    categories: () => get('/categories'),
    professionals: (params) => get('/professionals', params),
    professional: (id) => get(`/professionals/${id}`),
    professionalReviews: (id) => get(`/professionals/${id}/reviews`),
  },
  orders: {
    list: () => get('/orders'),
    get: (id) => get(`/orders/${id}`),
    createBooking: (input) => post('/orders', input),
    createQuoteRequest: (input) => post('/orders/quote-requests', input),
    accept: (id) => post(`/orders/${id}/accept`),
    decline: (id) => post(`/orders/${id}/decline`),
    complete: (id) => post(`/orders/${id}/complete`),
    cancel: (id, reason) => post(`/orders/${id}/cancel`, { reason }),
    sendQuote: (id, input) => post(`/orders/${id}/quote`, input),
    respondQuote: (id, accept) => post(`/orders/${id}/quote/respond`, { accept }),
    acceptContract: (id) => post(`/orders/${id}/contract/accept`),
    proposeReschedule: (id, input) => post(`/orders/${id}/reschedule`, input),
    respondReschedule: (id, accept) => post(`/orders/${id}/reschedule/respond`, { accept }),
    review: (id, input) => post(`/orders/${id}/review`, input),
  },
  professional: {
    dashboard: () => get('/me/dashboard'),
    setAvailability: async (available) => {
      await patch('/me/availability', { available });
    },
    services: () => get('/me/services'),
    saveService: (service) =>
      service.id ? put(`/me/services/${service.id}`, service) : post('/me/services', service),
    deleteService: (id) => del(`/me/services/${id}`),
    setAcceptsQuotes: async (value) => {
      await patch('/me/accepts-quotes', { acceptsQuotes: value });
    },
    policy: () => get('/me/cancellation-policy'),
    savePolicy: (policy) => put('/me/cancellation-policy', policy),
    verificationStatus: async () => (await get<{ status: never }>('/me/verification')).status,
    submitVerification: async (payload) => {
      const { data } = await http.post<{ status: never }>('/me/verification', toFormData({ ...payload }), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.status;
    },
    reviewsReceived: () => get('/me/reviews'),
    paymentData: () => get('/me/payment-data'),
    savePaymentData: (data) => put('/me/payment-data', data),
  },
  account: {
    addresses: () => get('/me/addresses'),
    addAddress: (input) => post('/me/addresses', input),
    removeAddress: (id) => del(`/me/addresses/${id}`),
    notificationPrefs: () => get('/me/notification-preferences'),
    saveNotificationPrefs: (prefs) => put('/me/notification-preferences', prefs),
    reviewsGiven: () => get('/me/reviews-given'),
  },
};
