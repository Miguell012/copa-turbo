import type { Campaign, CampaignFormData, CheckoutData, PlanId } from "./types";
import { generateCampaignSlug, generateId } from "./utils";

const CAMPAIGNS_KEY = "copa-turbo-campaigns";
const DRAFT_KEY = "copa-turbo-draft";
const SELECTED_PLAN_KEY = "copa-turbo-selected-plan";
const CHECKOUT_KEY = "copa-turbo-checkout";
const PREVIEW_CAMPAIGN_KEY = "copa-turbo-preview-campaign";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// Remove imagens base64 antes de salvar no localStorage (evita QuotaExceededError)
function stripImages<T extends Partial<CampaignFormData>>(data: T): T {
  const { logo, coverImage, galleryImages, ...rest } = data as any;
  return rest as T;
}

export function getCampaigns(): Campaign[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    return raw ? (JSON.parse(raw) as Campaign[]) : [];
  } catch {
    return [];
  }
}

export function getCampaignBySlug(slug: string): Campaign | undefined {
  return getCampaigns().find((c) => c.slug === slug);
}

export function getCampaignById(id: string): Campaign | undefined {
  return getCampaigns().find((c) => c.id === id);
}

export function saveCampaign(
  formData: CampaignFormData,
  planId: PlanId,
  paid = false
): Campaign {
  // Mantém as imagens no objeto retornado (usado na sessão atual)
  // mas salva sem imagens no localStorage
  const campaign: Campaign = {
    ...formData,
    id: generateId(),
    slug: generateCampaignSlug(formData),
    createdAt: new Date().toISOString(),
    planId,
    paid,
  };
  const campaignToStore = stripImages(campaign);
  const campaigns = getCampaigns();
  campaigns.push(campaignToStore as Campaign);
  if (isBrowser()) {
    try {
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
    } catch (e) {
      console.warn("localStorage cheio, limpando campanhas antigas...");
      localStorage.removeItem(CAMPAIGNS_KEY);
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify([campaignToStore]));
    }
  }
  return campaign; // retorna com imagens para usar na prévia
}

export function markCampaignPaid(id: string): Campaign | undefined {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  campaigns[index] = { ...campaigns[index], paid: true };
  if (isBrowser()) {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  }
  return campaigns[index];
}

export function saveDraft(formData: Partial<CampaignFormData>): void {
  if (!isBrowser()) return;
  try {
    // Salva sem imagens para não lotar o storage
    localStorage.setItem(DRAFT_KEY, JSON.stringify(stripImages(formData)));
  } catch (e) {
    console.warn("Erro ao salvar rascunho:", e);
  }
}

export function getDraft(): Partial<CampaignFormData> | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<CampaignFormData>) : null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(DRAFT_KEY);
}

export function setSelectedPlan(planId: PlanId): void {
  if (!isBrowser()) return;
  localStorage.setItem(SELECTED_PLAN_KEY, planId);
}

export function getSelectedPlan(): PlanId | null {
  if (!isBrowser()) return null;
  const stored = localStorage.getItem(SELECTED_PLAN_KEY);
  if (!stored) return null;
  if (stored === "mais-vendido") return "premium";
  return stored as PlanId;
}

export function setCheckoutData(data: CheckoutData): void {
  if (!isBrowser()) return;
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(data));
}

export function getCheckoutData(): CheckoutData | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(CHECKOUT_KEY);
    return raw ? (JSON.parse(raw) as CheckoutData) : null;
  } catch {
    return null;
  }
}

export function clearCheckoutData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(CHECKOUT_KEY);
}

export function setPreviewCampaignId(id: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(PREVIEW_CAMPAIGN_KEY, id);
}

export function getPreviewCampaignId(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(PREVIEW_CAMPAIGN_KEY);
}