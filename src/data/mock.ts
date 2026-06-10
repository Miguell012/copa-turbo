import type { Campaign } from "@/lib/types";

export const MOCK_EXAMPLE_CAMPAIGNS = [
  {
    businessName: "Bar do Zé",
    businessType: "bar" as const,
    promotionName: "Chopp em dobro no intervalo",
    mainTeam: "Brasil",
    opponent: "Argentina",
    city: "São Paulo",
    colors: ["#002776", "#009739", "#FEDD00"],
  },
  {
    businessName: "Adega Central",
    businessType: "adega" as const,
    promotionName: "Vinho + petisco com 20% off",
    mainTeam: "Alemanha",
    opponent: "França",
    city: "Curitiba",
    colors: ["#009739", "#FEDD00", "#ffffff"],
  },
  {
    businessName: "Burger Copa",
    businessType: "hamburgueria" as const,
    promotionName: "Combo torcedor por R$ 29,90",
    mainTeam: "Espanha",
    opponent: "Itália",
    city: "Belo Horizonte",
    colors: ["#1a1a2e", "#009739", "#FEDD00"],
  },
];

export const FAQ_ITEMS = [
  {
    question: "Preciso saber design para usar o Copa Turbo?",
    answer:
      "Não. Você preenche os dados da promoção e do jogo, e o sistema monta post, story, banner, link e QR Code prontos para divulgar.",
  },
  {
    question: "Funciona para qualquer tipo de comércio?",
    answer:
      "Sim. O foco é bares, adegas, lanchonetes, hamburguerias e restaurantes, mas qualquer negócio pode criar campanhas para os dias de jogo.",
  },
  {
    question: "Como o cliente acessa minha promoção?",
    answer:
      "Você recebe um link público e um QR Code. O cliente abre a página, vê a promoção e a contagem regressiva para o jogo, e pode falar com você pelo WhatsApp.",
  },
  {
    question: "O pagamento é seguro?",
    answer:
      "Nesta versão inicial o checkout é simulado para você testar o fluxo completo. Em breve integraremos Mercado Pago.",
  },
  {
    question: "Posso criar várias campanhas?",
    answer:
      "Sim. Cada plano inclui um número de campanhas (ou ilimitadas no Pro por 30 dias). Você cria uma campanha por jogo ou promoção.",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Conte sobre sua promoção",
    description:
      "Informe o nome do negócio, a promoção, os times do jogo e o WhatsApp para contato.",
  },
  {
    step: 2,
    title: "Receba os materiais prontos",
    description:
      "Post, story, banner, link público e QR Code gerados automaticamente para divulgar.",
  },
  {
    step: 3,
    title: "Atraia clientes no dia do jogo",
    description:
      "Compartilhe nos stories, no WhatsApp e na porta do estabelecimento. Mais gente no dia do jogo.",
  },
];

export function createMockCampaign(): Campaign {
  return {
    id: "mock_demo",
    slug: "bar-do-ze-brasil-vs-argentina-demo",
    businessName: "Bar do Zé",
    businessType: "bar",
    promotionName: "Chopp em dobro no intervalo",
    promotionDescription:
      "Durante o intervalo do jogo, chopp 300ml em dobro. Válido para consumo no local.",
    mainTeam: "Brasil",
    opponent: "Argentina",
    gameDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    whatsapp: "11999998888",
    city: "São Paulo",
    preferredColors: ["#002776", "#009739", "#FEDD00"],
    createdAt: new Date().toISOString(),
    planId: "premium",
    paid: true,
  };
}
