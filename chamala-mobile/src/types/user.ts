export type UserRole = 'client' | 'professional';

/** unsubmitted = nunca enviou; pending = em análise; verified; rejected = recusada. */
export type VerificationStatus = 'unsubmitted' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  specialty?: string;
  /** Bairro/Cidade (cliente) ou área de atuação (profissional). */
  area?: string;
  avatarUrl?: string;
  verificationStatus?: VerificationStatus;
}

/** Campos editáveis em "Editar Perfil". */
export interface ProfileUpdate {
  name: string;
  phone: string;
  email: string;
  area?: string;
}

export interface Session {
  token: string;
  user: User;
}

export interface ClientSignUpInput {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface ProfessionalSignUpInput extends ClientSignUpInput {
  specialtyId: string;
  area: string;
}
