import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export const buildWhatsAppUrl = generateWhatsAppUrl;

export function generateWhatsAppUrl(
  phone: string,
  message: string
): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function generateOrderMessage(
  productName: string,
  color?: string,
  gauge?: string,
  length?: number
): string {
  return `Hello, I would like to order:

Product: ${productName}${color ? `\nColor: ${color}` : ""}${gauge ? `\nGauge: ${gauge}` : ""}${length ? `\nLength: ${length}m` : ""}

Quantity: 

Please provide pricing and delivery details.`;
}
