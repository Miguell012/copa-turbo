import type { Plan } from "./types";

export const PLANS: Plan[] = [
  {
    id: "basico",
    name: "Plano Básico",
    price: 9.9,
    priceLabel: "R$ 9,90",
    campaigns: "2 campanhas",
    features: [
      "Post pronto para Instagram",
      "Story vertical para Stories",
      "Banner otimizado para WhatsApp",
      "Link público da promoção",
      "QR Code para imprimir na porta",
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
      "Tudo do Básico",
      "Página da promoção com galeria de fotos",
      "Link personalizado do estabelecimento",
      "Botão de WhatsApp com mensagem pré-pronta",
      "Contagem regressiva ao vivo até o jogo",
      "Geração prioritária (fila expressa)",
    ],
  },
  {
    id: "pro",
    name: "Plano Pro",
    price: 29.9,
    priceLabel: "R$ 29,90",
    campaigns: "Campanhas ilimitadas por 30 dias",
    badge: "Melhor custo-benefício",
    features: [
      "Tudo do Premium",
      "Campanhas ilimitadas durante 30 dias",
      "Foto de capa do estabelecimento",
      "Selo ✓ Verificado na página pública",
      "Materiais sem marca d'água",
      "Templates premium exclusivos",
      "Destaque na listagem Copa Turbo",
      "Suporte prioritário por WhatsApp",
    ],
  },
];

export function getPlanById(id: string): Plan | undefined {
  const normalized = id === "mais-vendido" ? "premium" : id;
  return PLANS.find((p) => p.id === normalized);
}