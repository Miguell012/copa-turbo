'use client'

import { useEffect, useState } from 'react'
import type { CampaignFormData } from '@/lib/types'
import { getDraft } from '@/lib/storage'

interface PromotionData {
  barName: string
  barInitials: string
  barType: string
  city: string
  address: string
  phone: string
  logo?: string
  coverImage?: string
  game: {
    team1: string
    team2: string
    date: string
    score1: number
    score2: number
    minute: number
    isLive: boolean
  }
  totalTables: number
  freeTables: number
  interested: number
  rating: number
  promoName: string
  promoDescription: string
  colors: { primary: string; accent: string; bg2: string }
  galleryImages?: string[]
}

function formatGameDate(iso: string): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long',
      year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch { return iso }
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
}

function teamFontSize(name: string): string {
  if (name.length <= 4) return '3.2rem'
  if (name.length <= 6) return '2.6rem'
  if (name.length <= 9) return '2rem'
  return '1.5rem'
}

function adaptFormData(form: CampaignFormData): PromotionData {
  const primary = form.preferredColors?.[0] ?? '#002776'
  const accent  = form.preferredColors?.[1] ?? '#FEDD00'
  const bg2     = form.preferredColors?.[2] ?? '#009739'

  return {
    barName: form.businessName || 'Meu Negócio',
    barInitials: getInitials(form.businessName || 'MN'),
    barType: form.businessType || 'bar',
    city: form.city || '',
    address: (form as any).address || '',
    phone: form.whatsapp?.replace(/\D/g, '') || '',
    logo: form.logo,
    coverImage: (form as any).coverImage,
    game: {
      team1: form.mainTeam || 'Time A',
      team2: form.opponent || 'Time B',
      date: formatGameDate(form.gameDateTime),
      score1: 0, score2: 0, minute: 0, isLive: false,
    },
    totalTables: 12,
    freeTables: 4,
    interested: Math.floor(Math.random() * 80) + 60,
    rating: 4.9,
    promoName: form.promotionName || 'Promoção especial',
    promoDescription: form.promotionDescription || '',
    colors: { primary, accent, bg2 },
    galleryImages: form.galleryImages,
  }
}

const DEFAULT_DATA: PromotionData = {
  barName: 'Bar do Periquito',
  barInitials: 'BP',
  barType: 'Bar',
  city: 'Taubaté',
  address: 'Rua das Palmeiras, 42 — Centro',
  phone: '5512992611119',
  game: {
    team1: 'Brasil', team2: 'Argentina',
    date: 'sábado, 7 de junho de 2026 às 16:00',
    score1: 2, score2: 1, minute: 67, isLive: true,
  },
  totalTables: 12,
  freeTables: 3,
  interested: 142,
  rating: 4.9,
  promoName: 'Chopp em dobro no intervalo',
  promoDescription: 'Durante o intervalo, chopp 300ml em dobro por apenas R$ 12. Válido somente no local.',
  colors: { primary: '#002776', accent: '#FEDD00', bg2: '#009739' },
}

// ─── Plano define o que aparece na página ────────────────────────────────────
// basico:  sem galeria, sem capa, com marca d'água
// premium: com galeria, sem capa, com marca d'água
// pro:     com galeria, com capa, sem marca d'água, selo verificado

interface Props {
  data?: CampaignFormData
  promotionData?: PromotionData
  planId?: string        // 'basico' | 'premium' | 'pro'
  showWatermark?: boolean
}

export default function PublicPromotionPage({ data, promotionData, planId = 'basico', showWatermark }: Props) {
  const [resolved, setResolved] = useState<PromotionData | null>(
    promotionData ?? (data ? adaptFormData(data) : null)
  )

  useEffect(() => {
    if (resolved) return
    const draft = getDraft()
    if (draft && Object.keys(draft).length > 0) {
      setResolved(adaptFormData(draft as CampaignFormData))
    } else {
      setResolved(DEFAULT_DATA)
    }
  }, []) // eslint-disable-line

  const d = resolved ?? DEFAULT_DATA
  const { primary, accent, bg2 } = d.colors

  // Permissões por plano
  const isPremiumOrPro = planId === 'premium' || planId === 'pro'
  const isPro          = planId === 'pro'
  const watermark      = showWatermark !== undefined ? showWatermark : !isPro

  const showGallery    = isPremiumOrPro && d.galleryImages && d.galleryImages.length > 0
  const showCover      = isPro && !!d.coverImage
  const showVerified   = isPro

  const [interested, setInterested] = useState(d.interested)
  const [freeTables, setFreeTables] = useState(d.freeTables)
  const [minute, setMinute] = useState(d.game.minute)

  useEffect(() => {
    setInterested(d.interested)
    setFreeTables(d.freeTables)
    setMinute(d.game.minute)
  }, [resolved]) // eslint-disable-line

  useEffect(() => {
    if (!d.game.isLive) return
    const t1 = setInterval(() => setMinute((m) => (m < 90 ? m + 1 : m)), 60_000)
    const t2 = setInterval(() => setInterested((n) => n + Math.floor(Math.random() * 3)), 8_000)
    const t3 = setInterval(() => {
      if (Math.random() > 0.65) setFreeTables((t) => Math.max(0, t - 1))
    }, 15_000)
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3) }
  }, [d.game.isLive])

  const [lightbox, setLightbox] = useState<string | null>(null)

  // Contador regressivo para o jogo
  const [countdown, setCountdown] = useState<{ d: number; h: number; m: number; s: number } | null>(null)

  useEffect(() => {
    if (d.game.isLive) return
    const gameDate = data?.gameDateTime ? new Date(data.gameDateTime) : null
    if (!gameDate || isNaN(gameDate.getTime())) return
    const tick = () => {
      const diff = gameDate.getTime() - Date.now()
      if (diff <= 0) { setCountdown(null); return }
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [d.game.isLive, data?.gameDateTime]) // eslint-disable-line

  const urgencyPct = Math.round(((d.totalTables - freeTables) / d.totalTables) * 100)
  const whatsappMsg = encodeURIComponent(
    `Olá! Vi a promoção "${d.promoName}" para o jogo ${d.game.team1} x ${d.game.team2} no ${d.barName} e quero saber mais!`
  )
  const whatsappUrl = `https://wa.me/${d.phone}?text=${whatsappMsg}`
  const mapsQuery = d.address
    ? `${d.address}, ${d.city}, SP, Brasil`
    : `${d.barName}, ${d.city}, SP, Brasil`
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`
  const bgGradient = `linear-gradient(165deg, ${primary} 0%, ${bg2}88 55%, #0d4a28 100%)`

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;900&display=swap');
        .pp { font-family: 'Nunito', sans-serif; }
        .pp-title { font-family: 'Bebas Neue', sans-serif; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse-ring {
          0%,100%{ box-shadow: 0 0 0 0 rgba(220,50,50,0.55) }
          50%{ box-shadow: 0 0 0 9px rgba(220,50,50,0) }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px) }
          to   { opacity:1; transform:translateY(0) }
        }
        .live-ring { animation: pulse-ring 1.6s ease-in-out infinite; }
        .live-dot  { animation: blink 1s step-end infinite; }
        .bar-up    { animation: fadeUp .5s ease both; }
        .bar-up-2  { animation: fadeUp .5s .1s ease both; }
        .bar-up-3  { animation: fadeUp .5s .2s ease both; }
        .urgency-fill { transition: width 1.2s ease; }
        .wpp-btn:active { transform: scale(.97); }
      `}</style>

      <div className="pp min-h-screen text-white relative" style={{ background: bgGradient }}>

        {/* ── Marca d'água ─────────────────────────────── */}
        {watermark && (
          <div
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            style={{ transform: 'rotate(-35deg)' }}
          >
            <div
              className="pp-title text-6xl tracking-widest text-white select-none"
              style={{ opacity: 0.07, whiteSpace: 'nowrap' }}
            >
              PRÉVIA • COPA TURBO • PRÉVIA • COPA TURBO
            </div>
          </div>
        )}

        {/* ── Cover image (só Pro) ─────────────────────── */}
        {showCover ? (
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={d.coverImage}
              alt={d.barName}
              className="h-full w-full object-cover"
              style={{ filter: 'brightness(0.55)' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(to bottom, transparent 40%, ${primary}cc 100%)` }}
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              {d.logo ? (
                <img
                  src={d.logo}
                  alt={d.barName}
                  className="h-20 w-20 rounded-2xl object-cover"
                  style={{ boxShadow: `0 0 0 4px ${accent}`, border: `3px solid ${primary}` }}
                />
              ) : (
                <div
                  className="pp-title h-20 w-20 rounded-2xl flex items-center justify-center text-4xl"
                  style={{ background: accent, color: primary, boxShadow: `0 0 0 4px ${primary}`, border: `3px solid ${primary}` }}
                >
                  {d.barInitials}
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="max-w-sm mx-auto pb-10 px-0">

          {/* ── Header ──────────────────────────────────── */}
          <div className={`text-center px-6 ${showCover ? 'pt-14' : 'pt-10'} pb-5 bar-up`}>
            {!showCover && (
              d.logo ? (
                <img
                  src={d.logo}
                  alt={d.barName}
                  className="h-20 w-20 rounded-2xl object-cover mx-auto mb-4"
                  style={{ boxShadow: `0 0 0 4px ${accent}55` }}
                />
              ) : (
                <div
                  className="pp-title h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl"
                  style={{ background: accent, color: primary, boxShadow: `0 0 0 4px ${accent}40` }}
                >
                  {d.barInitials}
                </div>
              )
            )}
            <div className="flex items-center justify-center gap-2">
              <div className="pp-title text-4xl tracking-widest leading-none">{d.barName}</div>
              {/* Selo verificado só no Pro */}
              {showVerified && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: accent, color: primary }}
                  title="Estabelecimento verificado"
                >
                  ✓ Pro
                </span>
              )}
            </div>
            <div className="mt-1.5 text-xs text-white/50 uppercase tracking-widest">
              {d.barType} • {d.city}
            </div>
          </div>

          {/* ── Jogo card ───────────────────────────────── */}
          <div
            className="mx-4 mb-3 rounded-3xl overflow-hidden bar-up-2"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)' }}
          >
            <div className="flex justify-center pt-5 pb-3">
              {d.game.isLive ? (
                <span
                  className="live-ring inline-flex items-center gap-2 text-white text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full"
                  style={{ background: '#dd2222' }}
                >
                  <span className="live-dot w-2 h-2 bg-white rounded-full" />
                  AO VIVO
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-2 text-white/80 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.12)' }}
                >
                  📅 EM BREVE
                </span>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 px-4 pb-2">
              <span
                className="pp-title tracking-widest flex-1 text-right leading-none"
                style={{ fontSize: teamFontSize(d.game.team1) }}
              >
                {d.game.team1.toUpperCase()}
              </span>
              <span
                className="pp-title text-xl px-3 py-1 rounded-xl leading-none flex-shrink-0"
                style={{ color: accent, background: `${accent}18` }}
              >
                VS
              </span>
              <span
                className="pp-title tracking-widest flex-1 text-left leading-none"
                style={{ fontSize: teamFontSize(d.game.team2) }}
              >
                {d.game.team2.toUpperCase()}
              </span>
            </div>

            {d.game.date && (
              <div className="text-center text-xs text-white/45 pb-3 px-4">{d.game.date}</div>
            )}

            {/* Contador regressivo — só quando não está ao vivo */}
            {!d.game.isLive && countdown && (
              <div className="mx-4 mb-4 pb-2">
                <div className="text-center text-xs text-white/40 uppercase tracking-widest mb-2">
                  ⏳ Começa em
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: countdown.d, label: 'Dias' },
                    { val: countdown.h, label: 'Horas' },
                    { val: countdown.m, label: 'Min' },
                    { val: countdown.s, label: 'Seg' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl py-2 text-center"
                      style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
                    >
                      <div className="pp-title text-2xl leading-none" style={{ color: accent }}>
                        {String(item.val).padStart(2, '0')}
                      </div>
                      <div className="text-xs text-white/40 mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {d.game.isLive && (
              <div
                className="mx-4 mb-4 rounded-2xl py-4 flex items-center justify-center gap-6"
                style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
              >
                <div className="text-center">
                  <div className="pp-title text-6xl leading-none" style={{ color: accent }}>{d.game.score1}</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mt-1">{d.game.team1}</div>
                </div>
                <div className="pp-title text-3xl text-white/20">:</div>
                <div className="text-center">
                  <div className="pp-title text-6xl leading-none" style={{ color: accent }}>{d.game.score2}</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mt-1">{d.game.team2}</div>
                </div>
              </div>
            )}

            {d.game.isLive && (
              <div className="flex justify-center pb-4">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-xl"
                  style={{ color: accent, background: `${accent}18` }}
                >
                  ⏱ {minute < 90 ? `${minute}'` : 'Encerrado'}
                </span>
              </div>
            )}
          </div>

          {/* ── Social proof ────────────────────────────── */}
          <div className="mx-4 mb-3 grid grid-cols-3 gap-2 bar-up-3">
            {[
              { num: interested, label: 'Interessados', icon: '👥' },
              { num: freeTables, label: 'Mesas livres', icon: '🪑' },
              { num: `${d.rating}★`, label: 'Avaliação', icon: '⭐' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <div className="text-lg mb-0.5">{s.icon}</div>
                <div className="pp-title text-2xl leading-none" style={{ color: accent }}>{s.num}</div>
                <div className="text-xs text-white/45 mt-1 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Urgência ────────────────────────────────── */}
          <div
            className="mx-4 mb-3 rounded-2xl p-4"
            style={{ background: `${accent}10`, border: `1px solid ${accent}35` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black" style={{ color: accent }}>🔥 Quase lotado!</span>
              <span className="text-xs text-white/50">{freeTables} de {d.totalTables} mesas</span>
            </div>
            <div className="rounded-full h-2.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="urgency-fill h-full rounded-full"
                style={{ width: `${urgencyPct}%`, background: `linear-gradient(90deg, ${accent}, #ff7c00)` }}
              />
            </div>
            <div className="text-xs text-white/55 mt-2">
              ⚡ Apenas <strong className="text-white">{freeTables} mesas</strong> disponíveis — garanta a sua!
            </div>
          </div>

          {/* ── Promoção em destaque ─────────────────────── */}
          <div className="mx-4 mb-1 text-xs text-white/35 uppercase tracking-widest font-bold">
            🏆 Promoção do jogo
          </div>
          <div
            className="mx-4 mb-3 mt-2 rounded-2xl p-5"
            style={{ background: `linear-gradient(135deg, ${accent}22, ${accent}08)`, border: `1.5px solid ${accent}45` }}
          >
            <div className="pp-title text-2xl leading-tight mb-2" style={{ color: accent }}>
              {d.promoName}
            </div>
            {d.promoDescription && (
              <p className="text-sm text-white/75 leading-relaxed">{d.promoDescription}</p>
            )}
          </div>

          {/* ── Galeria (Premium e Pro) ───────────────────── */}
          {showGallery && (
            <>
              <div className="mx-4 mb-1 text-xs text-white/35 uppercase tracking-widest font-bold">
                📸 Fotos do local
              </div>
              <div className="mx-4 mb-3 mt-2 grid grid-cols-3 gap-1.5">
                {d.galleryImages!.slice(0, 6).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Foto ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ border: '1px solid rgba(255,255,255,0.10)' }}
                    onClick={() => setLightbox(src)}
                  />
                ))}
              </div>
            </>
          )}

          {/* ── Lightbox ─────────────────────────────────── */}
          {lightbox && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.92)' }}
              onClick={() => setLightbox(null)}
            >
              <img
                src={lightbox}
                alt="Foto ampliada"
                className="max-w-full max-h-full rounded-2xl object-contain"
                style={{ maxHeight: '90vh', maxWidth: '90vw' }}
              />
              <button
                className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-bold"
                onClick={() => setLightbox(null)}
              >
                ×
              </button>
            </div>
          )}

          {/* ── Informações do local ─────────────────────── */}
          <div className="mx-4 mb-1 text-xs text-white/35 uppercase tracking-widest font-bold">
            📍 Onde estamos
          </div>
          <div
            className="mx-4 mb-4 mt-2 rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            {(d.address || d.city) && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
              >
                <span className="text-lg mt-0.5 flex-shrink-0">📍</span>
                <div>
                  {d.address && <div className="text-sm text-white/90 font-semibold">{d.address}</div>}
                  <div className="text-xs text-white/50 mt-0.5">{d.city}</div>
                </div>
                <span className="ml-auto text-white/30 text-xs self-center">→</span>
              </a>
            )}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 16px' }} />
            {d.phone && (
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="text-lg flex-shrink-0">📞</span>
                <span className="text-sm text-white/75">{d.phone}</span>
              </div>
            )}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 16px' }} />
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="text-lg flex-shrink-0">🕐</span>
              <span className="text-sm text-white/75">Aberto durante toda a transmissão</span>
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 16px' }} />
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="text-lg flex-shrink-0">📶</span>
              <span className="text-sm text-white/75">Wi-Fi gratuito</span>
            </div>
          </div>

          {/* ── CTAs ─────────────────────────────────────── */}
          <div className="mx-4 flex flex-col gap-3">
            {d.phone && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wpp-btn flex items-center justify-center gap-3 font-black text-base py-4 rounded-2xl transition-all"
                style={{ background: '#25d366', boxShadow: '0 6px 24px rgba(37,211,102,0.4)', color: '#fff' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Reservar pelo WhatsApp
              </a>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-white/65 font-semibold text-sm py-3.5 rounded-2xl transition-all hover:bg-white/5"
              style={{ border: '1px solid rgba(255,255,255,0.14)' }}
            >
              🗺️ Como chegar
            </a>
          </div>

          <div className="text-center pt-8 pb-3 text-xs text-white/18 tracking-widest">
            Criado com Copa Turbo
          </div>
        </div>
      </div>
    </>
  )
}
