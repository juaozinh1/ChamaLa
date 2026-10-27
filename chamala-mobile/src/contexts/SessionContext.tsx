import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Role } from '../types/domain';
import type { TextSize } from '../theme';

// Sessão provisória: até a fase 2 (autenticação), o login só escolhe o papel.
interface Session {
  role: Exclude<Role, 'ADMIN'> | null;
  textSize: TextSize;
  highContrast: boolean;
  signIn: (role: Exclude<Role, 'ADMIN'>) => void;
  signOut: () => void;
  setTextSize: (size: TextSize) => void;
  setHighContrast: (value: boolean) => void;
}

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Session['role']>(null);
  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [highContrast, setHighContrast] = useState(false);

  const value = useMemo<Session>(
    () => ({
      role,
      textSize,
      highContrast,
      signIn: setRole,
      signOut: () => setRole(null),
      setTextSize,
      setHighContrast,
    }),
    [role, textSize, highContrast],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession precisa estar dentro de <SessionProvider>');
  return ctx;
}
