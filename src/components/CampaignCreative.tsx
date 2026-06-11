import type { CampaignFormData } from "@/lib/types";
import { BUSINESS_TYPE_LABELS } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";

interface CampaignCreativeProps {
  data: CampaignFormData;
  variant: "post" | "story" | "banner";
  showWatermark?: boolean;
  planId?: "basico" | "premium" | "pro";
}

export function getCampaignColors(data: CampaignFormData): string[] {
  return data.preferredColors?.length >= 3
    ? data.preferredColors
    : ["#002776", "#009739", "#FEDD00"];
}

function Initials({
  name,
  accent,
  primary,
  size = 40,
  radius = "50%",
}: {
  name: string;
  accent: string;
  primary: string;
  size?: number;
  radius?: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: accent,
        color: primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        fontSize: size * 0.3,
        flexShrink: 0,
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function Logo({
  data,
  size = 40,
  radius = "50%",
  accent,
  primary,
  border,
}: {
  data: CampaignFormData;
  size?: number;
  radius?: string;
  accent: string;
  primary: string;
  border?: string;
}) {
  if (data.logo) {
    return (
      <img
        src={data.logo}
        alt={data.businessName}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          objectFit: "cover",
          border: border ?? `2px solid ${accent}55`,
          flexShrink: 0,
        }}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }
  return (
    <Initials
      name={data.businessName}
      accent={accent}
      primary={primary}
      size={size}
      radius={radius}
    />
  );
}

// ─── Tamanho de fonte adaptado ao nome do time ───────────────────────────────
function teamFontSize(name: string, base: number): number {
  if (name.length <= 3) return base;
  if (name.length <= 5) return base * 0.85;
  if (name.length <= 8) return base * 0.68;
  return base * 0.54;
}

// ─── TEMPLATE BÁSICO ─────────────────────────────────────────────────────────
function TemplateBasico({
  data,
  variant,
  showWatermark,
}: {
  data: CampaignFormData;
  variant: "post" | "story" | "banner";
  showWatermark: boolean;
}) {
  const [primary, secondary, accent] = getCampaignColors(data);
  const isBanner = variant === "banner";
  const isStory = variant === "story";

  const aspectClass = isStory
    ? "aspect-[9/16]"
    : isBanner
      ? "aspect-[2.5/1]"
      : "aspect-square";

  const padding = isBanner ? "p-5 sm:p-6" : "p-6 sm:p-8";
  const teamBase = isBanner ? 28 : isStory ? 72 : 56;

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

      <div className="relative flex h-full flex-col items-center justify-between text-white">
        {/* Header */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo data={data} size={40} accent={accent} primary={primary} />
            <div>
              <p className="text-sm font-bold leading-tight">{data.businessName}</p>
              <p className="text-[10px] uppercase tracking-widest opacity-65">
                {BUSINESS_TYPE_LABELS[data.businessType]} • {data.city}
              </p>
            </div>
          </div>
          {!isBanner && (
            <span
              className="rounded-full px-3 py-1 text-xs font-black uppercase"
              style={{ backgroundColor: accent, color: primary }}
            >
              Copa
            </span>
          )}
        </div>

        {/* Jogo */}
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
            <span className="h-2 w-2 rounded-full bg-white" />
            Evento ao Vivo
          </span>
          <h2
            className="font-black uppercase leading-none"
            style={{ fontSize: teamFontSize(data.mainTeam, teamBase) }}
          >
            {data.mainTeam}
          </h2>
          <div
            className="my-2 font-black tracking-widest"
            style={{ color: accent, fontSize: isBanner ? 20 : 30 }}
          >
            VS
          </div>
          <h2
            className="font-black uppercase leading-none"
            style={{ fontSize: teamFontSize(data.opponent, teamBase) }}
          >
            {data.opponent}
          </h2>
          {data.gameDateTime && (
            <p className="mt-3 text-sm font-medium opacity-75">
              {formatShortDate(data.gameDateTime)}
            </p>
          )}
        </div>

        {/* Promoção */}
        <div
          className="w-full rounded-2xl border border-white/10 p-4 text-center"
          style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
        >
          <p
            className="font-extrabold"
            style={{ color: accent, fontSize: isBanner ? 18 : 22 }}
          >
            {data.promotionName}
          </p>
          {data.promotionDescription && !isBanner && (
            <p className="mt-1 text-sm opacity-80">{data.promotionDescription}</p>
          )}
        </div>

        {!isBanner && (
          <p className="mt-3 text-center text-xs opacity-50">Gerado com Copa Turbo</p>
        )}
      </div>

      {showWatermark && <WatermarkOverlay />}
    </div>
  );
}

// ─── TEMPLATE PREMIUM ────────────────────────────────────────────────────────
function TemplatePremium({
  data,
  variant,
  showWatermark,
}: {
  data: CampaignFormData;
  variant: "post" | "story" | "banner";
  showWatermark: boolean;
}) {
  const [primary, secondary, accent] = getCampaignColors(data);
  const isBanner = variant === "banner";
  const isStory = variant === "story";

  const aspectClass = isStory
    ? "aspect-[9/16]"
    : isBanner
      ? "aspect-[2.5/1]"
      : "aspect-square";

  const padding = isBanner ? "p-5 sm:p-6" : "p-6 sm:p-8";
  const teamBase = isBanner ? 26 : isStory ? 68 : 52;
  const darkBg = `${primary}f2`;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${aspectClass} ${padding} shadow-2xl`}
      style={{ background: darkBg }}
    >
      {/* Diagonal color stripes */}
      <div
        className="absolute inset-0"
        style={{
          background: `${secondary}`,
          clipPath: "polygon(65% 0, 100% 0, 100% 100%, 35% 100%)",
          opacity: 0.22,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: accent,
          clipPath: "polygon(82% 0, 100% 0, 100% 100%, 62% 100%)",
          opacity: 0.15,
        }}
      />
      <div className="absolute inset-0 bg-black/15" />

      <div className="relative flex h-full flex-col justify-between text-white">
        {/* Header */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo
              data={data}
              size={44}
              radius="10px"
              accent={accent}
              primary={primary}
              border={`2px solid ${accent}55`}
            />
            <div>
              <p className="text-sm font-bold leading-tight">{data.businessName}</p>
              <p className="text-[10px] uppercase tracking-widest opacity-50">
                {BUSINESS_TYPE_LABELS[data.businessType]} • {data.city}
              </p>
            </div>
          </div>
          <div
            className="rounded px-2 py-1 text-[9px] font-black uppercase tracking-wider"
            style={{
              background: `${accent}18`,
              color: accent,
              border: `1px solid ${accent}30`,
            }}
          >
            Copa
          </div>
        </div>

        {/* Jogo */}
        <div className={`flex flex-col ${isBanner ? "items-center" : "items-start"} gap-1`}>
          <span
            className="inline-flex items-center gap-2 rounded px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.75)" }}
          >
            ⚽ Evento ao Vivo
          </span>
          <div className={`flex ${isBanner ? "items-center gap-3" : "flex-col gap-0"}`}>
            <h2
              className="font-black uppercase leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: teamFontSize(data.mainTeam, teamBase) }}
            >
              {data.mainTeam}
            </h2>
            <span
              className="font-black tracking-widest"
              style={{ color: accent, fontSize: isBanner ? 18 : 22, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.15em" }}
            >
              VS
            </span>
            <h2
              className="font-black uppercase leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: teamFontSize(data.opponent, teamBase) }}
            >
              {data.opponent}
            </h2>
          </div>
          {data.gameDateTime && (
            <p className="text-xs opacity-40">{formatShortDate(data.gameDateTime)}</p>
          )}
        </div>

        {/* Promoção com botão WhatsApp */}
        <div
          className="w-full rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.08)",
            borderTop: `2px solid ${accent}`,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p
                className="font-black leading-tight truncate"
                style={{ color: accent, fontSize: isBanner ? 15 : 18 }}
              >
                {data.promotionName}
              </p>
              {data.promotionDescription && !isBanner && (
                <p className="mt-1 text-xs opacity-60 line-clamp-2">
                  {data.promotionDescription}
                </p>
              )}
            </div>
            {data.whatsapp && !isBanner && (
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: "#25d366" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {showWatermark && <WatermarkOverlay />}
    </div>
  );
}

// ─── TEMPLATE PRO ────────────────────────────────────────────────────────────
function TemplatePro({
  data,
  variant,
  showWatermark,
}: {
  data: CampaignFormData;
  variant: "post" | "story" | "banner";
  showWatermark: boolean;
}) {
  const [primary, , accent] = getCampaignColors(data);
  const isBanner = variant === "banner";
  const isStory = variant === "story";

  const aspectClass = isStory
    ? "aspect-[9/16]"
    : isBanner
      ? "aspect-[2.5/1]"
      : "aspect-square";

  const padding = isBanner ? "p-5 sm:p-6" : "p-6 sm:p-8";
  const teamBase = isBanner ? 24 : isStory ? 64 : 48;

  // Fundo escuro premium — ignora a cor primária do usuário propositalmente
  const darkBg = "#0a0a1a";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${aspectClass} ${padding} shadow-2xl`}
      style={{ background: darkBg }}
    >
      {/* Círculos decorativos sutis */}
      <div
        className="absolute"
        style={{
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: `${accent}08`,
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: -30,
          left: -30,
          width: 110,
          height: 110,
          borderRadius: "50%",
          background: `${primary}10`,
          pointerEvents: "none",
        }}
      />

      <div className="relative flex h-full flex-col justify-between text-white">
        {/* Header com selo verificado */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo
              data={data}
              size={44}
              radius="10px"
              accent={accent}
              primary={darkBg}
              border={`3px solid ${accent}40`}
            />
            <div>
              <p className="text-sm font-bold leading-tight">{data.businessName}</p>
              <p className="text-[10px] uppercase tracking-widest opacity-35">
                {BUSINESS_TYPE_LABELS[data.businessType]} • {data.city}
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-1 rounded-full px-2.5 py-1"
            style={{
              background: `${accent}15`,
              border: `1px solid ${accent}35`,
            }}
          >
            <span className="text-[10px] font-black" style={{ color: accent }}>✓</span>
            <span className="text-[9px] font-bold" style={{ color: accent }}>Verificado</span>
          </div>
        </div>

        {/* Placar ao vivo em destaque */}
        <div className="flex flex-col items-center gap-2">
          {!isBanner && (
            <div
              className="rounded-2xl px-4 py-3 w-full"
              style={{
                background: `${accent}08`,
                border: `1px solid ${accent}20`,
              }}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1 text-center">
                  <p
                    className="font-black uppercase leading-none"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: teamFontSize(data.mainTeam, teamBase),
                    }}
                  >
                    {data.mainTeam}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-black leading-none"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: teamBase * 1.1, color: accent }}
                    >
                      0
                    </span>
                    <span className="text-2xl opacity-20">:</span>
                    <span
                      className="font-black leading-none"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: teamBase * 1.1, color: accent }}
                    >
                      0
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">
                      Ao Vivo
                    </span>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <p
                    className="font-black uppercase leading-none"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: teamFontSize(data.opponent, teamBase),
                    }}
                  >
                    {data.opponent}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isBanner && (
            <div className="flex items-center gap-3">
              <h2
                className="font-black uppercase leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: teamFontSize(data.mainTeam, teamBase) }}
              >
                {data.mainTeam}
              </h2>
              <span style={{ color: accent, fontSize: 20, fontFamily: "'Bebas Neue', sans-serif" }}>×</span>
              <h2
                className="font-black uppercase leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: teamFontSize(data.opponent, teamBase) }}
              >
                {data.opponent}
              </h2>
            </div>
          )}

          {data.gameDateTime && (
            <p className="text-[10px] opacity-35">{formatShortDate(data.gameDateTime)}</p>
          )}
        </div>

        {/* Promoção + stats */}
        <div className="space-y-2">
          <div
            className="w-full rounded-2xl p-4"
            style={{
              background: `linear-gradient(135deg, ${accent}18, ${accent}06)`,
              border: `1.5px solid ${accent}30`,
            }}
          >
            <p
              className="font-black leading-tight"
              style={{ color: accent, fontSize: isBanner ? 15 : 18 }}
            >
              {data.promotionName}
            </p>
            {data.promotionDescription && !isBanner && (
              <p className="mt-1 text-xs line-clamp-2" style={{ color: "rgba(255,255,255,0.55)" }}>
                {data.promotionDescription}
              </p>
            )}
          </div>

          {!isBanner && (
            <div className="flex items-center justify-between px-1">
              <div className="flex gap-4">
                {[
                  { val: "142", label: "interessados" },
                  { val: "4.9★", label: "avaliação" },
                  { val: "3", label: "mesas livres" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-xs font-black" style={{ color: accent }}>{s.val}</p>
                    <p className="text-[8px] opacity-30">{s.label}</p>
                  </div>
                ))}
              </div>
              <span
                className="rounded px-2 py-0.5 text-[8px] font-bold"
                style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}
              >
                sem marca d'água
              </span>
            </div>
          )}
        </div>
      </div>

      {showWatermark && <WatermarkOverlay />}
    </div>
  );
}

// ─── Marca d'água ─────────────────────────────────────────────────────────────
function WatermarkOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="-rotate-12 rounded-xl bg-black/50 px-8 py-3 text-xl font-black uppercase tracking-widest text-white/70">
        PRÉVIA
      </span>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function CampaignCreative({
  data,
  variant,
  showWatermark = false,
  planId = "basico",
}: CampaignCreativeProps) {
  if (planId === "pro") {
    return (
      <TemplatePro data={data} variant={variant} showWatermark={showWatermark} />
    );
  }

  if (planId === "premium") {
    return (
      <TemplatePremium data={data} variant={variant} showWatermark={showWatermark} />
    );
  }

  return (
    <TemplateBasico data={data} variant={variant} showWatermark={showWatermark} />
  );
}
