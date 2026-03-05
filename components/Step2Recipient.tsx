"use client";

import type { RecipientStep } from "@/lib/types";
import type { CargoType } from "@/lib/types";
import { CARGO_LABELS } from "@/lib/types";

type Props = {
  data: RecipientStep;
  onChange: (data: RecipientStep) => void;
  errors: Partial<Record<keyof RecipientStep, string>>;
};

const CARGO_OPTIONS: CargoType[] = ["documents", "fragile", "ordinary"];

export function Step2Recipient({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="recipientName" className="mb-1 block text-sm font-medium">
          Имя получателя *
        </label>
        <input
          id="recipientName"
          type="text"
          value={data.recipientName}
          onChange={(e) => onChange({ ...data, recipientName: e.target.value.trim() })}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 text-foreground transition placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Пётр Петров"
          autoComplete="name"
        />
        {errors.recipientName && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.recipientName}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="destinationCity" className="mb-1 block text-sm font-medium">
          Город назначения *
        </label>
        <input
          id="destinationCity"
          type="text"
          value={data.destinationCity}
          onChange={(e) => onChange({ ...data, destinationCity: e.target.value.trim() })}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 text-foreground transition placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Санкт-Петербург"
          autoComplete="address-level2"
        />
        {errors.destinationCity && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.destinationCity}
          </p>
        )}
      </div>
      <div>
        <span className="mb-2 block text-sm font-medium">Тип груза *</span>
        <div className="flex flex-wrap gap-3">
          {CARGO_OPTIONS.map((type) => (
            <label key={type} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="cargoType"
                value={type}
                checked={data.cargoType === type}
                onChange={() => onChange({ ...data, cargoType: type })}
                className="h-4 w-4 border-[var(--color-border)] text-primary focus:ring-primary"
              />
              <span className="text-sm">{CARGO_LABELS[type]}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="weightKg" className="mb-1 block text-sm font-medium">
          Вес, кг (0.1–30) *
        </label>
        <input
          id="weightKg"
          type="number"
          min={0.1}
          max={30}
          step={0.1}
          value={data.weightKg === 0 ? "" : data.weightKg}
          onChange={(e) => {
            const v = e.target.value ? parseFloat(e.target.value) : 0;
            onChange({ ...data, weightKg: isNaN(v) ? 0 : v });
          }}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 text-foreground transition placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="5.5"
        />
        {errors.weightKg && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.weightKg}
          </p>
        )}
      </div>
    </div>
  );
}
