"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getAllOrders, deleteOrder } from "@/lib/storage";
import type { Order, CargoType } from "@/lib/types";
import { CARGO_LABELS } from "@/lib/types";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filterCargo, setFilterCargo] = useState<CargoType | "">("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const load = useCallback(() => {
    setOrders(getAllOrders());
  }, []);

  useEffect(() => {
    setMounted(true);
    load();
  }, [load, mounted]);

  const filtered = orders.filter((order) => {
    const matchSearch =
      !search ||
      order.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      order.destinationCity.toLowerCase().includes(search.toLowerCase());
    const matchCargo = !filterCargo || order.cargoType === filterCargo;
    return matchSearch && matchCargo;
  });

  const handleDelete = (id: string) => {
    deleteOrder(id);
    setDeleteId(null);
    load();
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
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">История заявок</h1>
          <Link
            href="/"
            className="btn-new-order inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Новая заявка
          </Link>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <input
            type="search"
            placeholder="Поиск: имя получателя или город назначения"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 text-foreground placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <select
            value={filterCargo}
            onChange={(e) => setFilterCargo((e.target.value || "") as CargoType | "")}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Все типы груза</option>
            <option value="documents">{CARGO_LABELS.documents}</option>
            <option value="fragile">{CARGO_LABELS.fragile}</option>
            <option value="ordinary">{CARGO_LABELS.ordinary}</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center text-[var(--color-muted)] shadow-[var(--shadow-card)]">
            {orders.length === 0
              ? "Заявок пока нет. Оформите первую на главной странице."
              : "По вашему запросу ничего не найдено."}
          </div>
        ) : (
          <ul className="space-y-4">
            {filtered.map((order) => (
              <li key={order.id}>
                <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)] hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between">
                  <Link href={`/orders/${order.id}`} className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">
                      {order.departureCity} → {order.destinationCity}
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {order.senderName} · {CARGO_LABELS[order.cargoType]}
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteId(order.id);
                    }}
                    className="self-start rounded-xl border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:self-center dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Удалить заявку?"
        description="Эту заявку нельзя будет восстановить."
        confirmLabel="Удалить"
        danger
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
