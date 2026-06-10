"use client";

import { useRef } from "react";
import type { Campaign, CampaignFormData } from "@/lib/types";
import { getPublicPromotionUrl } from "@/lib/utils";
import InstagramPostPreview from "./InstagramPostPreview";
import InstagramStoryPreview from "./InstagramStoryPreview";
import WhatsAppBannerPreview from "./WhatsAppBannerPreview";
import CampaignCreative from "./CampaignCreative";
import QRCodeGenerator from "./QRCodeGenerator";

interface CampaignPreviewProps {
  data: CampaignFormData | Campaign;
  slug?: string;
  showWatermark?: boolean;
}

// Renderiza o creative em tamanho real fora da tela e captura
async function downloadFullSize(
  data: CampaignFormData,
  variant: "post" | "story" | "banner",
  filename: string
) {
  const html2canvas = (await import("html2canvas")).default;

  // Renderiza no tamanho da prévia e escala para o tamanho final
  const previewSizes = {
    post:   { pw: 480,  ph: 480,  w: 1080, h: 1080 },
    story:  { pw: 380,  ph: 675,  w: 1080, h: 1920 },
    banner: { pw: 1080, ph: 432,  w: 1080, h: 432  },
  };
  const { pw, ph, w, h } = previewSizes[variant];
  const scale = w / pw;

  // Cria container fora da tela
  const container = document.createElement("div");
  // Para banner não fixamos altura — deixa o aspect-ratio definir
  const heightStyle = variant === "banner" ? "auto" : `${ph}px`;
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: -9999px;
    width: ${pw}px;
    height: ${heightStyle};
    z-index: -1;
    overflow: visible;
  `;
  document.body.appendChild(container);

  // Pré-carrega fontes
  await Promise.all([
    document.fonts.load("bold 48px 'Bebas Neue'"),
    document.fonts.load("bold 48px 'Nunito'"),
  ]).catch(() => {});

  // Importa React dinamicamente para renderizar o componente
  const { createRoot } = await import("react-dom/client");
  const React = await import("react");

  await new Promise<void>((resolve) => {
    const root = createRoot(container);
    root.render(
      React.createElement(CampaignCreative, {
        data,
        variant,
        showWatermark: false,
      })
    );
    // Aguarda render + fontes (mais tempo para fontes carregarem)
    setTimeout(resolve, 1500);
  });

  try {
    const actualHeight = variant === "banner" ? container.scrollHeight : ph;
    const canvas = await html2canvas(container, {
      useCORS: true,
      background: null, // Mudado de backgroundColor para background
      scale: scale,
      logging: false,
      width: pw,
      height: actualHeight,
    });
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } finally {
    document.body.removeChild(container);
  }
}

function DownloadButton({ data, variant, filename, label }: {
  data: CampaignFormData;
  variant: "post" | "story" | "banner";
  filename: string;
  label: string;
}) {
  const handleDownload = async () => {
    await downloadFullSize(data, variant, filename);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="flex items-center gap-2 rounded-xl border border-copa-blue/20 bg-copa-blue/5 px-4 py-2.5 text-sm font-bold text-copa-blue hover:bg-copa-blue/10 transition-all"
    >
      ⬇️ {label}
    </button>
  );
}

export default function CampaignPreview({
  data,
  slug,
  showWatermark = true,
}: CampaignPreviewProps) {
  const publicUrl =
    typeof window !== "undefined" && slug
      ? getPublicPromotionUrl(slug)
      : slug
        ? `/promocao/${slug}`
        : "#";

  const businessSlug = (data as CampaignFormData).businessName
    ?.toLowerCase().replace(/\s+/g, "-") ?? "campanha";

  const formData = data as CampaignFormData;

  return (
    <div className="space-y-10">
      {showWatermark && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Prévia com marca d&apos;água. Após o pagamento, os materiais ficam liberados sem marca.
        </div>
      )}

      {/* ── Post Instagram ──────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-copa-blue">Post para Instagram</h3>
          {!showWatermark && (
            <DownloadButton
              data={formData}
              variant="post"
              filename={`${businessSlug}-post-instagram.png`}
              label="Baixar Post (1080×1080)"
            />
          )}
        </div>
        <InstagramPostPreview data={formData} showWatermark={showWatermark} />
        {!showWatermark && (
          <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
            <p className="text-xs font-semibold text-slate-700 mb-1">📱 Como postar no Instagram:</p>
            <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
              <li>Clique em "Baixar Post" acima</li>
              <li>Abra o Instagram no celular</li>
              <li>Toque em + e selecione a imagem baixada</li>
              <li>Adicione a legenda e publique!</li>
            </ol>
          </div>
        )}
      </section>

      {/* ── Story Instagram ─────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-copa-blue">Story para Instagram</h3>
          {!showWatermark && (
            <DownloadButton
              data={formData}
              variant="story"
              filename={`${businessSlug}-story-instagram.png`}
              label="Baixar Story (1080×1920)"
            />
          )}
        </div>
        <div className="flex justify-center">
          <InstagramStoryPreview data={formData} showWatermark={showWatermark} />
        </div>
        {!showWatermark && (
          <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
            <p className="text-xs font-semibold text-slate-700 mb-1">📱 Como postar o Story:</p>
            <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
              <li>Clique em "Baixar Story" acima</li>
              <li>Abra o Instagram e toque no seu avatar</li>
              <li>Selecione a imagem baixada</li>
              <li>Publique no story!</li>
            </ol>
          </div>
        )}
      </section>

      {/* ── Banner WhatsApp ─────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-copa-blue">Banner para WhatsApp</h3>
          {!showWatermark && (
            <DownloadButton
              data={formData}
              variant="banner"
              filename={`${businessSlug}-banner-whatsapp.png`}
              label="Baixar Banner"
            />
          )}
        </div>
        <WhatsAppBannerPreview data={formData} showWatermark={showWatermark} />
        {!showWatermark && (
          <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
            <p className="text-xs font-semibold text-slate-700 mb-1">💬 Como usar no WhatsApp:</p>
            <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
              <li>Clique em "Baixar Banner" acima</li>
              <li>Envie a imagem nos grupos e contatos</li>
              <li>Ou use como foto de status!</li>
            </ol>
          </div>
        )}
      </section>

      {/* ── Link e QR Code ──────────────────────────────── */}
      {slug && (
        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-bold text-copa-blue">Link da promoção</h3>
            <div className="card">
              <p className="text-sm text-slate-600">Compartilhe este link com seus clientes:</p>
              <p className="mt-2 break-all rounded-lg bg-slate-50 p-3 text-sm font-mono text-copa-blue">
                {publicUrl}
              </p>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline mt-4 inline-block text-sm"
              >
                Abrir página pública
              </a>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold text-copa-blue">QR Code</h3>
            <div className="card flex justify-center">
              <QRCodeGenerator url={publicUrl} size={140} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}