"use client";

import type { FormData } from "@/lib/types";
import { CARGO_LABELS } from "@/lib/types";

type Props = {
  data: FormData;
  agreedToTerms: boolean;
  onAgreedChange: (value: boolean) => void;
  errorAgreed?: string;
};

export function Step3Confirm({ data, agreedToTerms, onAgreedChange, errorAgreed }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-accent)]/30 p-4 text-sm">
        <h3 className="mb-3 font-semibold text-foreground">Отправитель</h3>
        <p><span className="text-[var(--color-muted)]">Имя:</span> {data.senderName}</p>
        <p><span className="text-[var(--color-muted)]">Телефон:</span> {data.senderPhone}</p>
        <p><span className="text-[var(--color-muted)]">Город отправления:</span> {data.departureCity}</p>
      </div>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-accent)]/30 p-4 text-sm">
        <h3 className="mb-3 font-semibold text-foreground">Получатель и посылка</h3>
        <p><span className="text-[var(--color-muted)]">Имя получателя:</span> {data.recipientName}</p>
        <p><span className="text-[var(--color-muted)]">Город назначения:</span> {data.destinationCity}</p>
        <p><span className="text-[var(--color-muted)]">Тип груза:</span> {CARGO_LABELS[data.cargoType]}</p>
        <p><span className="text-[var(--color-muted)]">Вес:</span> {data.weightKg} кг</p>
      </div>
      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => onAgreedChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[var(--color-border)] text-primary focus:ring-primary"
          />
          <span className="text-sm">
            Я согласен с условиями доставки и обработки персональных данных
          </span>
        </label>
        {errorAgreed && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errorAgreed}
          </p>
        )}
      </div>
    </div>
  );
}
