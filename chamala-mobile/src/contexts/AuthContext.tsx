import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setUnauthorizedHandler, tokenStorage } from '../services';
import type {
  ClientSignUpInput,
  LocalFile,
  ProfessionalSignUpInput,
  ProfileUpdate,
  Session,
  User,
  VerificationStatus,
} from '../types';

type AuthContextValue = {
  user: User | null;
  /** true enquanto o app tenta restaurar a sessão guardada. */
  isLoading: boolean;
  /** Após "Criar Conta + Fazer Verificação agora", o profissional abre direto na verificação. */
  startVerification: boolean;
  clearStartVerification: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUpClient: (input: ClientSignUpInput) => Promise<void>;
  signUpProfessional: (input: ProfessionalSignUpInput, opts?: { startVerification?: boolean }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (patch: ProfileUpdate) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateAvatar: (file: LocalFile) => Promise<void>;
  setVerificationStatus: (status: VerificationStatus) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startVerification, setStartVerification] = useState(false);

  const signOut = useCallback(async () => {
    await tokenStorage.clear();
    setStartVerification(false);
    setUser(null);
  }, []);

  // Restaura a sessão ao abrir o app.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = await tokenStorage.get();
        if (token) {
          const me = await api.auth.me();
          if (active) setUser(me);
        }
      } catch {
        await tokenStorage.clear();
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Sessão expirada (401): volta para o login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      void signOut();
    });
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const startSession = useCallback(async (session: Session) => {
    await tokenStorage.set(session.token);
    setUser(session.user);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      startVerification,
      clearStartVerification: () => setStartVerification(false),
      signIn: async (email, password) => startSession(await api.auth.login(email, password)),
      signUpClient: async (input) => startSession(await api.auth.registerClient(input)),
      signUpProfessional: async (input, opts) => {
        const session = await api.auth.registerProfessional(input);
        setStartVerification(Boolean(opts?.startVerification));
        await startSession(session);
      },
      signOut,
      updateProfile: async (patch) => setUser(await api.auth.updateProfile(patch)),
      changePassword: (currentPassword, newPassword) => api.auth.changePassword(currentPassword, newPassword),
      updateAvatar: async (file) => setUser(await api.auth.updateAvatar(file)),
      setVerificationStatus: (status) =>
        setUser((current) => (current ? { ...current, verificationStatus: status } : current)),
    }),
    [user, isLoading, startVerification, startSession, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  return ctx;
}

/** Usuário logado (use apenas em telas que só existem depois do login). */
export function useCurrentUser(): User {
  const { user } = useAuth();
  if (!user) throw new Error('Nenhum usuário logado.');
  return user;
}
