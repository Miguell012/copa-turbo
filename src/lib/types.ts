export type BusinessType =
  | "bar"
  | "adega"
  | "lanchonete"
  | "hamburgueria"
  | "restaurante"
  | "outro";

export type PlanId = "basico" | "premium" | "pro";

export interface CampaignFormData {
  businessName: string;
  businessType: BusinessType;
  promotionName: string;
  promotionDescription: string;
  mainTeam: string;
  opponent: string;
  gameDateTime: string;
  whatsapp: string;
  city: string;
  preferredColors: string[];
  logo?: string;
  address?: string;
coverImage?: string;
  galleryImages?: string[]; // ✨ ADICIONADO: Permite salvar as fotos no formulário
}

export interface Campaign extends CampaignFormData {
  id: string;
  slug: string;
  createdAt: string;
  planId: PlanId;
  paid: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  priceLabel: string;
  campaigns: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export interface CheckoutData {
  planId: PlanId;
  campaignId: string;
}

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  bar: "Bar",
  adega: "Adega",
  lanchonete: "Lanchonete",
  hamburgueria: "Hamburgueria",
  restaurante: "Restaurante",
  outro: "Outro",
};

export const COLOR_PRESETS = [
  { id: "copa-classic", label: "Copa Clássico", colors: ["#002776", "#009739", "#FEDD00"] },
  { id: "verde-amarelo", label: "Verde & Amarelo", colors: ["#009739", "#FEDD00", "#ffffff"] },
  { id: "azul-branco", label: "Azul & Branco", colors: ["#002776", "#ffffff", "#FEDD00"] },
  { id: "noturno", label: "Noturno", colors: ["#1a1a2e", "#009739", "#FEDD00"] },
] as const;