import { z } from 'zod';
import { onlyDigits } from './format';

const name = z.string().trim().min(3, 'Informe seu nome completo');
const email = z.string().trim().email('Informe um e-mail válido');
const password = z.string().min(8, 'A senha precisa ter no mínimo 8 caracteres');
const phone = z
  .string()
  .refine((v) => [10, 11].includes(onlyDigits(v).length), 'Informe um telefone válido com DDD');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe sua senha'),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const clientSignUpSchema = z.object({ name, phone, email, password });
export type ClientSignUpForm = z.infer<typeof clientSignUpSchema>;

export const professionalSignUpSchema = z.object({
  name,
  phone,
  email,
  password,
  specialtyId: z.string().min(1, 'Selecione sua especialidade'),
  area: z.string().trim().min(3, 'Informe sua área de atuação'),
});
export type ProfessionalSignUpForm = z.infer<typeof professionalSignUpSchema>;

export const editProfileSchema = z
  .object({
    name,
    phone,
    email,
    area: z.string().trim().refine((v) => v === '' || v.length >= 3, 'Informe o bairro e a cidade'),
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((v, ctx) => {
    // A senha só é alterada se pelo menos um dos três campos for preenchido.
    if (!v.currentPassword && !v.newPassword && !v.confirmPassword) return;
    if (!v.currentPassword) ctx.addIssue({ code: 'custom', path: ['currentPassword'], message: 'Informe sua senha atual' });
    if (v.newPassword.length < 8) ctx.addIssue({ code: 'custom', path: ['newPassword'], message: 'A nova senha precisa ter no mínimo 8 caracteres' });
    if (v.confirmPassword !== v.newPassword) ctx.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'As senhas não conferem' });
  });
export type EditProfileForm = z.infer<typeof editProfileSchema>;

export const serviceSchema = z.object({
  title: z.string().trim().min(3, 'Informe o nome do serviço'),
  price: z.string().refine((v) => {
    const n = Number(v.replace(/[^\d,]/g, '').replace(',', '.'));
    return Number.isFinite(n) && n > 0;
  }, 'Informe um valor maior que zero'),
});
export type ServiceForm = z.infer<typeof serviceSchema>;

export const addressSchema = z.object({
  label: z.string().trim().min(2, 'Dê um nome (ex.: Casa)'),
  line: z.string().trim().min(8, 'Informe o endereço completo'),
});
export type AddressForm = z.infer<typeof addressSchema>;

export const paymentSchema = z.object({
  holderName: z.string().trim().min(3, 'Informe o nome do titular'),
  pixKey: z.string().trim().min(5, 'Informe sua chave Pix'),
});
export type PaymentForm = z.infer<typeof paymentSchema>;
