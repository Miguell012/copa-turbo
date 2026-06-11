"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import CampaignPreview from "@/components/CampaignPreview";
import PublicPromotionPage from "@/components/PublicPromotionPage";
import type { Campaign } from "@/lib/types";
import { getCampaignById, getPreviewCampaignId, setCheckoutData } from "@/lib/storage";
import { getImages } from "@/lib/imageStorage";
import { getPlanById } from "@/lib/plans";

function PreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get("id") || getPreviewCampaignId();
    if (!id) { setLoading(false); return; }
    const found = getCampaignById(id);
    if (!found) { setLoading(false); return; }
    getImages(id).then((images) => {
      setCampaign({
        ...found,
        logo: images?.logo ?? found.logo,
        coverImage: images?.coverImage ?? (found as any).coverImage,
        galleryImages: images?.galleryImages ?? found.galleryImages,
      } as Campaign);
      setLoading(false);
    });
  }, [searchParams]);

  const handleCheckout = () => {
    if (!campaign) return;
    setCheckoutData({ planId: campaign.planId, campaignId: campaign.id });
    router.push("/checkout");
  };

  if (loading) return <p className="text-slate-500">Carregando prévia...</p>;

  if (!campaign) {
    return (
      <div className="card text-center">
        <p className="text-slate-600">Campanha não encontrada.</p>
        <Link href="/criar" className="btn-primary mt-4 inline-block">Criar nova campanha</Link>
      </div>
    );
  }

  const plan = getPlanById(campaign.planId);
  const planId = campaign.planId as "basico" | "premium" | "pro";

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-copa-blue">Prévia da sua campanha</h1>
          <p className="mt-1 text-slate-600">{campaign.businessName} — {campaign.promotionName}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/criar" className="btn-outline text-center text-sm">Editar dados</Link>
          <button type="button" onClick={handleCheckout} className="btn-primary">
            Liberar campanha — {plan?.priceLabel}
          </button>
        </div>
      </div>

      {/* Prévia da página pública */}
      <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="bg-slate-100 px-4 py-2 text-xs text-slate-500 font-medium">
          📱 Prévia da página pública
        </div>
        <div className="relative">
          <div className={!campaign.paid ? 'pointer-events-none select-none' : ''}>
            <PublicPromotionPage
              data={campaign}
              planId={planId}
              showWatermark={false}
            />
          </div>

          {!campaign.paid && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center z-40"
              style={{
                backdropFilter: 'blur(12px)',
                background: 'linear-gradient(180deg, rgba(0,20,60,0.55) 0%, rgba(0,20,60,0.85) 100%)',
              }}
            >
              <div className="text-center px-6 py-8 max-w-xs">
                <div className="text-5xl mb-4">🔒</div>
                <h2 className="text-2xl font-black text-white mb-2">Página bloqueada</h2>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  Finalize o pagamento para liberar sua página pública e compartilhar com seus clientes.
                </p>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-2xl font-black text-base transition-all"
                  style={{ background: '#FEDD00', color: '#002776' }}
                >
                  Desbloquear por {plan?.priceLabel}
                </button>
                <p className="text-white/40 text-xs mt-3">Pagamento único • Sem mensalidade</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <CampaignPreview
        data={campaign}
        slug={campaign.slug}
        showWatermark={!campaign.paid}
        planId={planId}
      />

      {!campaign.paid && (
        <div className="mt-12 card bg-copa-blue/5 text-center">
          <h3 className="font-bold text-copa-blue">Gostou da prévia?</h3>
          <p className="mt-2 text-sm text-slate-600">
            Finalize o pagamento para liberar todos os materiais sem marca d&apos;água.
          </p>
          <button type="button" onClick={handleCheckout} className="btn-primary mt-4">
            Ir para checkout — {plan?.priceLabel}
          </button>
        </div>
      )}
    </>
  );
}

export default function PreviewPage() {
  return (
    <AppShell>
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Suspense fallback={<p className="text-slate-500">Carregando prévia...</p>}>
            <PreviewContent />
          </Suspense>
        </div>
      </section>
    </AppShell>
  );
}
