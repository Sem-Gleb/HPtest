"use client";

import type { SenderStep } from "@/lib/types";

type Props = {
  data: SenderStep;
  onChange: (data: SenderStep) => void;
  errors: Partial<Record<keyof SenderStep, string>>;
};

export function Step1Sender({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="senderName" className="mb-1 block text-sm font-medium">
          Имя отправителя *
        </label>
        <input
          id="senderName"
          type="text"
          value={data.senderName}
          onChange={(e) => onChange({ ...data, senderName: e.target.value.trim() })}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 text-foreground transition placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Иван Иванов"
          minLength={2}
          autoComplete="name"
        />
        {errors.senderName && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.senderName}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="senderPhone" className="mb-1 block text-sm font-medium">
          Телефон *
        </label>
        <input
          id="senderPhone"
          type="tel"
          value={data.senderPhone}
          onChange={(e) => onChange({ ...data, senderPhone: e.target.value })}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 text-foreground transition placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="+7 (999) 123-45-67"
          autoComplete="tel"
        />
        {errors.senderPhone && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.senderPhone}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="departureCity" className="mb-1 block text-sm font-medium">
          Город отправления *
        </label>
        <input
          id="departureCity"
          type="text"
          value={data.departureCity}
          onChange={(e) => onChange({ ...data, departureCity: e.target.value.trim() })}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 text-foreground transition placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Москва"
          autoComplete="address-level2"
        />
        {errors.departureCity && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.departureCity}
          </p>
        )}
      </div>
    </div>
  );
}
