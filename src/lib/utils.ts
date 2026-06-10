import type { CampaignFormData } from "./types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateCampaignSlug(data: CampaignFormData): string {
  const base = slugify(
    `${data.businessName}-${data.mainTeam}-vs-${data.opponent}`
  );
  const suffix = Date.now().toString(36);
  return `${base}-${suffix}`;
}

export function generateId(): string {
  return `camp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatGameDate(dateTime: string): string {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(dateTime: string): string {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatWhatsAppLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/55${digits}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

export function getPublicPromotionUrl(slug: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/promocao/${slug}`;
  }
  return `/promocao/${slug}`;
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
