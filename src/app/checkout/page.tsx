"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import type { Campaign } from "@/lib/types";
import { getPlanById } from "@/lib/plans";
import {
  getCampaignById,
  getCheckoutData,
  markCampaignPaid,
} from "@/lib/storage";

export default function CheckoutPage() {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");

  useEffect(() => {
    const checkout = getCheckoutData();
    if (!checkout) {
      router.replace("/planos");
      return;
    }
    const found = getCampaignById(checkout.campaignId);
    if (!found) {
      router.replace("/criar");
      return;
    }
    setCampaign(found);
  }, [router]);

  const plan = campaign ? getPlanById(campaign.planId) : null;

  const handlePayment = async () => {
    if (!campaign) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    markCampaignPaid(campaign.id);
    setProcessing(false);
    router.push(`/sucesso?id=${campaign.id}`);
  };

  if (!campaign || !plan) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <p className="text-slate-500">Carregando checkout...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          <h1 className="text-2xl font-bold text-copa-blue">Checkout</h1>
          <p className="mt-1 text-sm text-slate-500">
            Pagamento simulado — nenhuma cobrança real será feita.
          </p>

          <div className="card mt-8">
            <h2 className="font-semibold text-copa-blue">Resumo do pedido</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Plano</span>
                <span className="font-medium text-slate-900">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Campanha</span>
                <span className="font-medium text-slate-900">{campaign.promotionName}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
                <span className="font-semibold text-copa-blue">Total</span>
                <span className="font-bold text-copa-blue">{plan.priceLabel}</span>
              </div>
            </div>
          </div>

          <div className="card mt-6">
            <h2 className="font-semibold text-copa-blue">Forma de pagamento</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                className={`rounded-xl border-2 p-4 text-sm font-semibold transition-all ${
                  paymentMethod === "pix"
                    ? "border-copa-green bg-copa-green/5 text-copa-blue"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                PIX
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`rounded-xl border-2 p-4 text-sm font-semibold transition-all ${
                  paymentMethod === "card"
                    ? "border-copa-green bg-copa-green/5 text-copa-blue"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Cartão
              </button>
            </div>

            {paymentMethod === "pix" ? (
              <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center">
                <div className="mx-auto h-32 w-32 rounded-lg bg-white p-2 shadow-inner">
                  <div className="flex h-full w-full items-center justify-center rounded bg-copa-blue/10 text-xs text-slate-400">
                    QR PIX simulado
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  Clique no botão abaixo para simular o pagamento confirmado.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <input className="input-field" placeholder="Número do cartão" disabled />
                <div className="grid grid-cols-2 gap-4">
                  <input className="input-field" placeholder="Validade" disabled />
                  <input className="input-field" placeholder="CVV" disabled />
                </div>
                <p className="text-xs text-slate-400">Campos desabilitados — checkout simulado.</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handlePayment}
            disabled={processing}
            className="btn-primary mt-8 w-full py-4 disabled:opacity-60"
          >
            {processing ? "Processando..." : `Confirmar pagamento de ${plan.priceLabel}`}
          </button>

          <Link
            href={`/preview?id=${campaign.id}`}
            className="mt-4 block text-center text-sm text-slate-500 hover:text-copa-blue"
          >
            ← Voltar para a prévia
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
