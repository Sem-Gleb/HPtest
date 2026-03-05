"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/Stepper";
import { Step1Sender } from "@/components/Step1Sender";
import { Step2Recipient } from "@/components/Step2Recipient";
import { Step3Confirm } from "@/components/Step3Confirm";
import type { FormData, Order } from "@/lib/types";
import { step1Schema, step2Schema, step3Schema } from "@/lib/schemas";
import { createOrderId, saveOrder } from "@/lib/storage";

const FORM_DRAFT_KEY = "delivery_form_draft";
const STEPS = ["Отправитель", "Получатель и посылка", "Подтверждение"];

const defaultForm: FormData = {
  senderName: "",
  senderPhone: "",
  departureCity: "",
  recipientName: "",
  destinationCity: "",
  cargoType: "ordinary",
  weightKg: 0,
  agreedToTerms: false,
};

function loadDraft(): FormData {
  if (typeof window === "undefined") return defaultForm;
  try {
    const raw = localStorage.getItem(FORM_DRAFT_KEY);
    if (!raw) return defaultForm;
    const parsed = JSON.parse(raw) as FormData;
    return { ...defaultForm, ...parsed };
  } catch {
    return defaultForm;
  }
}

function saveDraft(data: FormData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(data));
}

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setForm(loadDraft());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveDraft(form);
  }, [mounted, form]);

  const setSender = useCallback((data: Pick<FormData, "senderName" | "senderPhone" | "departureCity">) => {
    setForm((prev) => ({ ...prev, ...data }));
    setErrors((e) => ({ ...e, senderName: undefined, senderPhone: undefined, departureCity: undefined }));
  }, []);

  const setRecipient = useCallback((data: Pick<FormData, "recipientName" | "destinationCity" | "cargoType" | "weightKg">) => {
    setForm((prev) => ({ ...prev, ...data }));
    setErrors((e) => ({
      ...e,
      recipientName: undefined,
      destinationCity: undefined,
      weightKg: undefined,
    }));
  }, []);

  const validateStep1 = (): boolean => {
    const result = step1Schema.safeParse({
      senderName: form.senderName,
      senderPhone: form.senderPhone,
      departureCity: form.departureCity,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      (result.error as { issues: Array<{ path: (string | number)[]; message: string }> }).issues.forEach((err) => {
        const path = err.path[0] as string;
        if (path) fieldErrors[path] = err.message;
      });
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      return false;
    }
    setErrors((prev) => ({ ...prev, senderName: undefined, senderPhone: undefined, departureCity: undefined }));
    return true;
  };

  const validateStep2 = (): boolean => {
    const dep = form.departureCity.trim().toLowerCase();
    const dest = form.destinationCity.trim().toLowerCase();
    if (dep && dest && dep === dest) {
      setErrors((prev) => ({ ...prev, destinationCity: "Город назначения не может совпадать с городом отправления" }));
      return false;
    }
    const result = step2Schema.safeParse({
      recipientName: form.recipientName,
      destinationCity: form.destinationCity,
      cargoType: form.cargoType,
      weightKg: form.weightKg,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      (result.error as { issues: Array<{ path: (string | number)[]; message: string }> }).issues.forEach((err) => {
        const path = err.path[0] as string;
        if (path) fieldErrors[path] = err.message;
      });
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      return false;
    }
    setErrors((prev) => ({
      ...prev,
      recipientName: undefined,
      destinationCity: undefined,
      weightKg: undefined,
    }));
    return true;
  };

  const validateStep3 = (): boolean => {
    if (!form.agreedToTerms) {
      setErrors((prev) => ({ ...prev, agreedToTerms: "Необходимо согласие с условиями" }));
      return false;
    }
    const result = step3Schema.safeParse({ agreedToTerms: form.agreedToTerms });
    if (!result.success) {
      setErrors((prev) => ({ ...prev, agreedToTerms: "Необходимо согласие с условиями" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, agreedToTerms: undefined }));
    return true;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 3) setStep((s) => s + 1);
  };

  const goBack = () => {
    setErrors({});
    if (step > 1) setStep((s) => s - 1);
  };

  const submit = () => {
    if (!validateStep3()) return;
    const order: Order = {
      ...form,
      id: createOrderId(),
      status: "new",
      createdAt: new Date().toISOString(),
    };
    saveOrder(order);
    localStorage.removeItem(FORM_DRAFT_KEY);
    setForm(defaultForm);
    setStep(1);
    router.push("/orders");
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Оформление заявки на доставку
        </h1>
        <p className="mb-8 text-[var(--color-muted)]">Заполните данные в три шага</p>

        <Stepper currentStep={step} steps={STEPS} />

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          {step === 1 && (
            <Step1Sender
              data={{
                senderName: form.senderName,
                senderPhone: form.senderPhone,
                departureCity: form.departureCity,
              }}
              onChange={setSender}
              errors={errors}
            />
          )}
          {step === 2 && (
            <Step2Recipient
              data={{
                recipientName: form.recipientName,
                destinationCity: form.destinationCity,
                cargoType: form.cargoType,
                weightKg: form.weightKg,
              }}
              onChange={setRecipient}
              errors={errors}
            />
          )}
          {step === 3 && (
            <Step3Confirm
              data={form}
              agreedToTerms={form.agreedToTerms}
              onAgreedChange={(v) => setForm((prev) => ({ ...prev, agreedToTerms: v }))}
              errorAgreed={errors.agreedToTerms}
            />
          )}

          <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--color-border)] pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-[var(--color-border)]/30"
              >
                Назад
              </button>
            ) : null}
            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Далее
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Отправить
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
