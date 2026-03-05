export type CargoType = "documents" | "fragile" | "ordinary";

export interface SenderStep {
  senderName: string;
  senderPhone: string;
  departureCity: string;
}

export interface RecipientStep {
  recipientName: string;
  destinationCity: string;
  cargoType: CargoType;
  weightKg: number;
}

export interface FormData extends SenderStep, RecipientStep {
  agreedToTerms: boolean;
}

export type OrderStatus = "new" | "in_transit" | "delivered" | "cancelled";

export interface Order extends FormData {
  id: string;
  status: OrderStatus;
  createdAt: string; // ISO date
}

export const CARGO_LABELS: Record<CargoType, string> = {
  documents: "Документы",
  fragile: "Хрупкое",
  ordinary: "Обычное",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Новая",
  in_transit: "В пути",
  delivered: "Доставлена",
  cancelled: "Отменена",
};
