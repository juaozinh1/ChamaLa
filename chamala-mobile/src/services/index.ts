import { USE_MOCKS } from '../config/env';
import { httpApi } from './httpApi';
import { mockApi } from './mockApi';
import type { Api } from './types';

/** Único ponto de acesso a dados do app. As telas só usam `api.xxx`. */
export const api: Api = USE_MOCKS ? mockApi : httpApi;
export { setUnauthorizedHandler } from './http';
export { tokenStorage } from './tokenStorage';
