import type { Order } from "./types";

const STORAGE_KEY = "delivery_orders";

function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function setOrders(orders: Order[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function getAllOrders(): Order[] {
  return getOrders();
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === order.id);
  if (idx >= 0) orders[idx] = order;
  else orders.push(order);
  setOrders(orders);
}

export function deleteOrder(id: string): void {
  setOrders(getOrders().filter((o) => o.id !== id));
}

export function createOrderId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
