"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getOrderById } from "@/lib/storage";
import type { Order } from "@/lib/types";
import { CARGO_LABELS } from "@/lib/types";

export default function OrderDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [order, setOrder] = useState<Order | null>(null);
  const [mounted, setMounted] = useState(false);

  const load = useCallback(() => {
    setOrder(getOrderById(id) ?? null);
  }, [id]);

  useEffect(() => {
    setMounted(true);
    load();
  }, [load, mounted]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Загрузка</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-xl px-4">
          <p className="text-[var(--color-muted)]">Заявка не найдена.</p>
          <Link href="/orders" className="mt-4 inline-block font-medium text-primary hover:underline">
             К списку заявок
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-xl">
        <Link
          href="/orders"
          className="mb-6 inline-block text-sm font-medium text-primary hover:underline"
        >
           К списку заявок
        </Link>
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Заявка на доставку</h1>

        <div className="space-y-5">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-[var(--shadow-card)]">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Отправитель
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-[var(--color-muted)]">Имя</dt>
                <dd className="font-medium text-foreground">{order.senderName}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">Телефон</dt>
                <dd className="font-medium text-foreground">{order.senderPhone}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">Город отправления</dt>
                <dd className="font-medium text-foreground">{order.departureCity}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-[var(--shadow-card)]">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Получатель
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-[var(--color-muted)]">Имя получателя</dt>
                <dd className="font-medium text-foreground">{order.recipientName}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">Город назначения</dt>
                <dd className="font-medium text-foreground">{order.destinationCity}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-[var(--shadow-card)]">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Посылка
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-[var(--color-muted)]">Тип груза</dt>
                <dd className="font-medium text-foreground">{CARGO_LABELS[order.cargoType]}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">Вес, кг</dt>
                <dd className="font-medium text-foreground">{order.weightKg}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
