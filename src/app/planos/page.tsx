"use client";

import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import PricingCards from "@/components/PricingCards";
import type { PlanId } from "@/lib/types";
import { setSelectedPlan } from "@/lib/storage";

export default function PlanosPage() {
  const router = useRouter();

  const handleSelectPlan = (planId: PlanId) => {
    setSelectedPlan(planId);
    router.push("/criar");
  };

  return (
    <AppShell>
      <section className="bg-copa-blue py-12 text-white sm:py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">Escolha o plano ideal</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Planos simples para você criar promoções nos dias de jogo. Sem mensalidade
            escondida — pague e use suas campanhas.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <PricingCards onSelectPlan={handleSelectPlan} showCta={false} />
          <p className="mt-10 text-center text-sm text-slate-500">
            Pagamento simulado nesta versão. Integração com Mercado Pago em breve.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
