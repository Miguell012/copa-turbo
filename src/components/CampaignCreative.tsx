import type { CampaignFormData } from "@/lib/types";
import { BUSINESS_TYPE_LABELS } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";

interface CampaignCreativeProps {
  data: CampaignFormData;
  variant: "post" | "story" | "banner";
  showWatermark?: boolean;
}

export function getCampaignColors(data: CampaignFormData): string[] {
  return data.preferredColors?.length >= 3
    ? data.preferredColors
    : ["#002776", "#009739", "#FEDD00"];
}

export default function CampaignCreative({
  data,
  variant,
  showWatermark = false,
}: CampaignCreativeProps) {
  const [primary, secondary, accent] = getCampaignColors(data);

  const isStory = variant === "story";
  const isBanner = variant === "banner";

  const aspectClass = isStory
    ? "aspect-[9/16]"
    : isBanner
      ? "aspect-[2.5/1]"
      : "aspect-square";

  const padding = isBanner ? "p-5 sm:p-6" : "p-6 sm:p-8";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${aspectClass} ${padding} shadow-2xl`}
      style={{
        background: `linear-gradient(145deg, ${primary} 0%, ${secondary} 60%, ${primary} 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 20%, ${accent} 0%, transparent 45%)`,
        }}
      />

      <div className="absolute inset-0 bg-black/10" />

      <div className="relative flex h-full flex-col justify-between text-white">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {data.logo ? (
              <img
                src={data.logo}
                alt={data.businessName}
                className="h-12 w-12 rounded-full border-2 border-white/30 object-cover"
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full font-black"
                style={{
                  backgroundColor: accent,
                  color: primary,
                }}
              >
                {data.businessName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div>
              <p className="font-bold leading-tight">
                {data.businessName}
              </p>

              <p className="text-xs uppercase tracking-wide opacity-75">
                {BUSINESS_TYPE_LABELS[data.businessType]} • {data.city}
              </p>
            </div>
          </div>

          {!isBanner && (
            <span
              className="rounded-full px-3 py-1 text-xs font-bold uppercase"
              style={{
                backgroundColor: accent,
                color: primary,
              }}
            >
              Copa
            </span>
          )}
        </div>

        {/* Conteúdo principal */}
        <div className="my-6 text-center">
          <div className="mb-5 flex justify-center">
            <span className="rounded-full bg-red-500 px-4 py-1 text-xs font-bold uppercase text-white shadow-lg">
              🔴 Evento ao Vivo
            </span>
          </div>

          <h2
            className={`font-black uppercase ${
              isBanner
                ? "text-2xl"
                : "text-4xl sm:text-5xl"
            }`}
          >
            {data.mainTeam}
          </h2>

          <div
            className={`my-2 font-black ${
              isBanner
                ? "text-xl"
                : "text-3xl"
            }`}
            style={{ color: accent }}
          >
            VS
          </div>

          <h2
            className={`font-black uppercase ${
              isBanner
                ? "text-2xl"
                : "text-4xl sm:text-5xl"
            }`}
          >
            {data.opponent}
          </h2>

          {data.gameDateTime && (
            <p className="mt-4 text-sm font-medium opacity-80">
              {formatShortDate(data.gameDateTime)}
            </p>
          )}
        </div>

        {/* Promoção */}
        <div
          className="rounded-2xl border border-white/10 p-4 text-center backdrop-blur-md"
          style={{
            backgroundColor: "rgba(255,255,255,0.12)",
          }}
        >
          <p
            className={`font-extrabold ${
              isBanner
                ? "text-lg"
                : "text-2xl"
            }`}
            style={{ color: accent }}
          >
            {data.promotionName}
          </p>

          {data.promotionDescription && !isBanner && (
            <p className="mt-2 text-sm opacity-90">
              {data.promotionDescription}
            </p>
          )}
        </div>

        {!isBanner && (
          <p className="mt-4 text-center text-xs opacity-60">
            Gerado com Copa Turbo
          </p>
        )}
      </div>

      {showWatermark && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="-rotate-12 rounded-xl bg-black/50 px-8 py-3 text-xl font-black uppercase tracking-widest text-white/70 backdrop-blur-sm">
            PRÉVIA
          </span>
        </div>
      )}
    </div>
  );
}