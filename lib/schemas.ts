import { z } from "zod";

export const loginSchema = z.object({ email: z.string().email("Informe um e-mail válido"), password: z.string().min(8, "A senha deve ter ao menos 8 caracteres") });
export const registerSchema = loginSchema.extend({ name: z.string().min(2, "Informe seu nome") });
export const appointmentSchema = z.object({ barberId: z.string().min(1), serviceId: z.string().min(1), startsAt: z.coerce.date().refine((date) => date > new Date(), "Escolha um horário futuro") });
