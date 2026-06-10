import type { Plan } from "./types";
 
export const PLANS: Plan[] = [
  {
    id: "basico",
    name: "Plano Básico",
    price: 9.9,
    priceLabel: "R$ 9,90",
    campaigns: "2 campanhas",
    features: [
      "Post Instagram",
      "Story",
      "Banner WhatsApp",
      "Link da promoção simples",
      "QR Code",
    ],
  },
  {
    id: "premium",
    name: "Plano Premium",
    price: 19.9,
    priceLabel: "R$ 19,90",
    campaigns: "5 campanhas",
    highlighted: true,
    badge: "Mais vendido",
    features: [
      "Post Instagram",
      "Story",
      "Banner WhatsApp",
      "Link da promoção completo",
      "QR Code",
      "Galeria de fotos na página",
      "Prioridade na geração",
    ],
  },
  {
    id: "pro",
    name: "Plano Pro",
    price: 29.9,
    priceLabel: "R$ 29,90",
    campaigns: "Campanhas ilimitadas por 30 dias",
    features: [
      "Post Instagram",
      "Story",
      "Banner WhatsApp",
      "Link da promoção premium",
      "QR Code",
      "Galeria de fotos na página",
      "Foto de capa do estabelecimento",
      "Selo verificado na página",
      "Sem marca d'água",
      "Templates premium",
    ],
  },
];
 
export function getPlanById(id: string): Plan | undefined {
  const normalized = id === "mais-vendido" ? "premium" : id;
  return PLANS.find((p) => p.id === normalized);
}