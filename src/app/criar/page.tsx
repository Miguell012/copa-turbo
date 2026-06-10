"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import CampaignForm from "@/components/CampaignForm";
import PublicPromotionPage from "@/components/PublicPromotionPage";
import type { CampaignFormData, PlanId } from "@/lib/types";
import { getPlanById } from "@/lib/plans";
import {
  getSelectedPlan,
  saveCampaign,
  setPreviewCampaignId,
  setSelectedPlan,
} from "@/lib/storage";
import { saveImages } from "@/lib/imageStorage";

function CriarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [planId, setPlanId] = useState<PlanId | null>(null);
  const [liveData, setLiveData] = useState<CampaignFormData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fromUrl = searchParams.get("plano") as PlanId | null;
    const stored = getSelectedPlan();
    const id = fromUrl || stored;
    if (id && getPlanById(id)) {
      setPlanId(id);
      setSelectedPlan(id);
    }
  }, [searchParams]);

  const handleSubmit = async (data: CampaignFormData) => {
    if (!planId) {
      router.push("/planos");
      return;
    }
    const campaign = saveCampaign(data, planId, false);
    await saveImages(campaign.id, {
      logo: data.logo,
      coverImage: (data as any).coverImage,
      galleryImages: data.galleryImages,
    });
    setPreviewCampaignId(campaign.id);
    router.push(`/preview?id=${campaign.id}`);
  };

  const plan = planId ? getPlanById(planId) : null;

  if (!planId) {
    return (
      <div className="card mx-auto max-w-lg text-center">
        <h2 className="text-xl font-bold text-copa-blue">Escolha um plano primeiro</h2>
        <p className="mt-2 text-slate-600">
          Para criar sua campanha, selecione o plano que melhor combina com seu negócio.
        </p>
        <Link href="/planos" className="btn-primary mt-6 inline-block">
          Ver planos
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Banner do plano */}
      <div className="mb-8 rounded-xl border border-copa-green/30 bg-copa-green/5 px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-slate-700">
          Plano selecionado:{" "}
          <strong className="text-copa-blue">{plan?.name}</strong> — {plan?.priceLabel}
        </p>
        <Link href="/planos" className="text-xs font-medium text-copa-green hover:underline">
          Trocar plano
        </Link>
      </div>

      {/* Layout: formulário + preview ao vivo */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">

        {/* Coluna esquerda: formulário */}
        <div>
          <CampaignForm
            onSubmit={handleSubmit}
            onFormChange={(data) => setLiveData(data)}
          />
        </div>

        {/* Coluna direita: preview ao vivo */}
        <div className="lg:sticky lg:top-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">
              👁 Preview ao vivo
            </span>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-copa-blue hover:underline lg:hidden"
            >
              {showPreview ? 'Ocultar' : 'Ver preview'}
            </button>
          </div>

          <div className={`${showPreview ? 'block' : 'hidden'} lg:block`}>
            {liveData ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <PublicPromotionPage
                  data={liveData}
                  planId={planId}
                  showWatermark={false}
                />
              </div>
            ) : (
              <div
                className="rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-10"
                style={{ minHeight: 320 }}
              >
                <div className="text-5xl mb-4">✏️</div>
                <p className="text-slate-400 text-sm font-medium">
                  Comece a preencher o formulário para ver o preview da sua campanha aqui.
                </p>
              </div>
            )}
          </div>

          {/* Indicador mobile */}
          {!showPreview && (
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="lg:hidden w-full mt-2 py-3 rounded-xl border-2 border-dashed border-copa-blue/30 text-copa-blue text-sm font-medium hover:bg-copa-blue/5 transition-colors"
            >
              👁 Ver preview da campanha
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default function CriarPage() {
  return (
    <AppShell>
      <section className="bg-slate-100 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-copa-blue">Criar campanha</h1>
          <p className="mt-2 text-slate-600">
            Preencha os dados e veja o preview ao vivo da sua campanha.
          </p>
        </div>
      </section>
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8">
          <Suspense fallback={<p className="text-slate-500">Carregando...</p>}>
            <CriarContent />
          </Suspense>
        </div>
      </section>
    </AppShell>
  );
}
