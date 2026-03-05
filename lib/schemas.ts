import { z } from "zod";

const phoneRegex = /^\+?[78][\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

export const step1Schema = z.object({
  senderName: z.string().min(2, "Минимум 2 символа"),
  senderPhone: z.string().regex(phoneRegex, "Неверный формат телефона"),
  departureCity: z.string().min(1, "Укажите город"),
});

export const step2Schema = z.object({
  recipientName: z.string().min(1, "Укажите имя получателя"),
  destinationCity: z.string().min(1, "Укажите город назначения"),
  cargoType: z.enum(["documents", "fragile", "ordinary"]),
  weightKg: z
    .number()
    .min(0.1, "Минимум 0.1 кг")
    .max(30, "Максимум 30 кг"),
});

export const step3Schema = z.object({
  agreedToTerms: z.literal(true, { message: "Необходимо согласие с условиями" }),
});

export type Step1Input = z.infer<typeof step1Schema>;
export type Step2Input = z.infer<typeof step2Schema>;
