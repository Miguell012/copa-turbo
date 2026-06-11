"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import CampaignPreview from "@/components/CampaignPreview";
import type { Campaign } from "@/lib/types";
import { getCampaignById } from "@/lib/storage";
import { getImages } from "@/lib/imageStorage";
import { getPublicPromotionUrl } from "@/lib/utils";

function SucessoContent() {
  const searchParams = useSearchParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    const found = getCampaignById(id);
    if (!found) return;
    getImages(id).then((images) => {
      setCampaign({
        ...found,
        logo: images?.logo ?? found.logo,
        coverImage: images?.coverImage ?? (found as any).coverImage,
        galleryImages: images?.galleryImages ?? found.galleryImages,
      } as Campaign);
    });
  }, [searchParams]);

  if (!campaign) {
    return (
      <div className="card text-center">
        <p className="text-slate-600">Campanha não encontrada.</p>
        <Link href="/criar" className="btn-primary mt-4 inline-block">Criar campanha</Link>
      </div>
    );
  }

  const publicUrl = typeof window !== "undefined"
    ? getPublicPromotionUrl(campaign.slug)
    : `/promocao/${campaign.slug}`;

  const whatsappShareMsg = encodeURIComponent(
    `🍺 *${campaign.businessName}* tem promoção especial no jogo ${campaign.mainTeam} x ${campaign.opponent}!\n\n🎉 ${campaign.promotionName}\n\n👉 Veja todos os detalhes: ${publicUrl}`
  );
  const whatsappShareUrl = `https://wa.me/?text=${whatsappShareMsg}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Celebração */}
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-copa-green text-4xl text-white shadow-lg">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-bold text-copa-blue">Campanha liberada!</h1>
        <p className="mt-2 text-slate-600">
          Sua promoção está pronta para atrair clientes no dia do jogo.
        </p>
      </div>

      {/* Link + compartilhar */}
      <div className="card mt-8">
        <h2 className="font-bold text-copa-blue mb-3">🔗 Link público da promoção</h2>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
          <p className="flex-1 break-all text-sm font-mono text-copa-blue truncate">
            {publicUrl}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
            style={{
              background: copied ? '#009739' : '#002776',
              color: '#fff',
            }}
          >
            {copied ? '✓ Copiado!' : 'Copiar'}
          </button>
        </div>

        {/* Botões de ação */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-copa-blue/20 bg-copa-blue/5 px-4 py-3 text-sm font-bold text-copa-blue hover:bg-copa-blue/10 transition-all"
          >
            👁 Abrir página
          </a>

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: '#25d366', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Compartilhar no WhatsApp
          </a>

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:border-copa-blue/30 hover:text-copa-blue transition-all"
          >
            📋 Ver minhas campanhas
          </Link>
        </div>
      </div>

      {/* Dica de como compartilhar */}
      <div className="mt-4 rounded-xl bg-copa-green/5 border border-copa-green/20 px-4 py-3">
        <p className="text-sm text-copa-green font-medium">
          💡 <strong>Dica:</strong> Compartilhe o link no grupo do bairro, status do WhatsApp e redes sociais para atrair mais clientes!
        </p>
      </div>

      {/* Materiais */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-copa-blue">Seus materiais</h2>
        <CampaignPreview
          data={campaign}
          slug={campaign.slug}
          showWatermark={false}
          planId={campaign.planId as "basico" | "premium" | "pro"}
        />
      </div>

      {/* Criar outra */}
      <div className="mt-10 card bg-copa-blue/5 text-center">
        <h3 className="font-bold text-copa-blue">Tem mais jogos chegando?</h3>
        <p className="mt-2 text-sm text-slate-600">
          Crie uma campanha para cada jogo e maximize seu faturamento na Copa.
        </p>
        <Link href="/planos" className="btn-primary mt-4 inline-block">
          Criar outra campanha
        </Link>
      </div>
    </>
  );
}

export default function SucessoPage() {
  return (
    <AppShell>
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Suspense fallback={<p className="text-slate-500">Carregando...</p>}>
            <SucessoContent />
          </Suspense>
        </div>
      </section>
    </AppShell>
  );
}
