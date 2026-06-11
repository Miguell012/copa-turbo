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
  if (name.length <= 4) return '3rem'
  if (name.length <= 6) return '2.4rem'
  if (name.length <= 9) return '1.9rem'
  return '1.4rem'
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

interface Props {
  data?: CampaignFormData
  promotionData?: PromotionData
  planId?: string
  showWatermark?: boolean
}

// ─── BÁSICO ──────────────────────────────────────────────────────────────────
function PageBasico({ d, watermark, whatsappUrl, mapsUrl, urgencyPct, countdown, showGallery, lightbox, setLightbox, minute, freeTables, interested }: any) {
  const { primary, accent, bg2 } = d.colors
  const bgGradient = `linear-gradient(165deg, ${primary} 0%, ${bg2}88 55%, #0d4a28 100%)`

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;900&display=swap');
        .pp{font-family:'Nunito',sans-serif}
        .pp-title{font-family:'Bebas Neue',sans-serif}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse-ring{0%,100%{box-shadow:0 0 0 0 rgba(220,50,50,.55)}50%{box-shadow:0 0 0 9px rgba(220,50,50,0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bar-fill{from{width:0}to{width:${urgencyPct}%}}
        .live-ring{animation:pulse-ring 1.6s ease-in-out infinite}
        .live-dot{animation:blink 1s step-end infinite}
        .bar-up{animation:fadeUp .5s ease both}
        .urgency-fill{animation:bar-fill 1.2s ease both}
      `}</style>
      <div className="pp min-h-screen text-white relative" style={{ background: bgGradient }}>
        {watermark && <WatermarkOverlay />}
        <div className="max-w-sm mx-auto pb-10 px-0">
          <div className="text-center px-6 pt-10 pb-5 bar-up">
            <LogoOrInitials d={d} size={80} radius="14px" accent={accent} primary={primary} />
            <div className="pp-title text-4xl tracking-widest leading-none mt-4">{d.barName}</div>
            <div className="mt-1.5 text-xs text-white/50 uppercase tracking-widest">{d.barType} • {d.city}</div>
          </div>
          <GameCard d={d} accent={accent} minute={minute} countdown={countdown} showScore={false} />
          <StatsRow interested={interested} freeTables={freeTables} rating={d.rating} accent={accent} />
          <UrgencyBar urgencyPct={urgencyPct} freeTables={freeTables} totalTables={d.totalTables} accent={accent} />
          <PromoCard promoName={d.promoName} promoDescription={d.promoDescription} accent={accent} />
          {showGallery && <Gallery images={d.galleryImages} onOpen={setLightbox} accent={accent} />}
          <InfoBlock d={d} mapsUrl={mapsUrl} />
          <CTAButtons whatsappUrl={whatsappUrl} mapsUrl={mapsUrl} accent={accent} primary={primary} proStyle={false} />
          <div className="text-center pt-8 pb-3 text-xs text-white/18 tracking-widest">Criado com Copa Turbo</div>
        </div>
        {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      </div>
    </>
  )
}

// ─── PREMIUM ─────────────────────────────────────────────────────────────────
function PagePremium({ d, watermark, whatsappUrl, mapsUrl, urgencyPct, countdown, showGallery, showCover, lightbox, setLightbox, minute, freeTables, interested }: any) {
  const { primary, accent, bg2 } = d.colors
  const darkBg = `${primary}f0`

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;900&display=swap');
        .pp{font-family:'Nunito',sans-serif}
        .pp-title{font-family:'Bebas Neue',sans-serif}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse-ring{0%,100%{box-shadow:0 0 0 0 rgba(220,50,50,.55)}50%{box-shadow:0 0 0 9px rgba(220,50,50,0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer-slide{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}  }
        @keyframes stripe-breathe{0%,100%{opacity:.22}50%{opacity:.32}}
        @keyframes float3d{0%,100%{transform:rotateY(-3deg) rotateX(1deg) translateY(0)}50%{transform:rotateY(-1deg) rotateX(.5deg) translateY(-5px)}}
        @keyframes bar-fill{from{width:0}to{width:${urgencyPct}%}}
        .live-ring{animation:pulse-ring 1.6s ease-in-out infinite}
        .live-dot{animation:blink 1s step-end infinite}
        .card-3d{animation:float3d 5s ease-in-out infinite;transform-style:preserve-3d}
        .shimmer-overlay{position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.07) 50%,transparent 65%);animation:shimmer-slide 3s ease-in-out infinite;pointer-events:none;z-index:10}
        .stripe-anim{animation:stripe-breathe 3s ease-in-out infinite}
        .urgency-fill{animation:bar-fill 1.2s ease both}
      `}</style>

      <div className="pp min-h-screen text-white relative" style={{ background: darkBg }}>
        {watermark && <WatermarkOverlay />}

        {/* Fundo diagonal animado */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div className="stripe-anim absolute inset-0" style={{ background: bg2, clipPath: 'polygon(65% 0,100% 0,100% 100%,35% 100%)', opacity: .22 }} />
          <div className="stripe-anim absolute inset-0" style={{ background: accent, clipPath: 'polygon(83% 0,100% 0,100% 100%,63% 100%)', opacity: .12, animationDelay: '.5s' }} />
        </div>

        <div className="relative max-w-sm mx-auto pb-10 px-0" style={{ zIndex: 1 }}>

          {/* Cover com perspectiva 3D */}
          <div style={{ perspective: '900px' }}>
            <div className="card-3d relative" style={{ boxShadow: '0 20px 60px rgba(0,0,0,.5)' }}>
              {showCover && d.coverImage ? (
                <div className="relative h-52 w-full overflow-hidden" style={{ borderRadius: '0 0 24px 24px' }}>
                  <img src={d.coverImage} alt={d.barName} className="h-full w-full object-cover" style={{ filter: 'brightness(.5)' }} />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 30%, ${primary}ee 100%)` }} />
                  <div className="shimmer-overlay" />
                </div>
              ) : (
                <div className="relative h-36 overflow-hidden" style={{ background: `linear-gradient(135deg, ${primary}, ${bg2}99)`, borderRadius: '0 0 24px 24px' }}>
                  <div className="shimmer-overlay" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, ${primary}dd 100%)` }} />
                </div>
              )}

              {/* Logo saindo da capa */}
              <div className="absolute" style={{ bottom: -20, left: 16 }}>
                {d.logo ? (
                  <img src={d.logo} alt={d.barName} style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', border: `3px solid ${primary}`, boxShadow: `0 4px 16px rgba(0,0,0,.4)` }} />
                ) : (
                  <div className="pp-title flex items-center justify-center text-2xl" style={{ width: 56, height: 56, borderRadius: 12, background: accent, color: primary, border: `3px solid ${primary}`, boxShadow: `0 4px 16px rgba(0,0,0,.4)` }}>
                    {d.barInitials}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="flex items-end justify-between px-4 pt-8 pb-4">
            <div>
              <div className="pp-title text-3xl tracking-widest leading-none">{d.barName}</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{d.barType} • {d.city}</div>
            </div>
            <div className="flex items-center gap-1 rounded-full px-3 py-1" style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}>
              <span className="text-xs font-black" style={{ color: accent }}>✓</span>
              <span className="text-xs font-bold" style={{ color: accent }}>Verificado</span>
            </div>
          </div>

          {/* Game card com borda accent */}
          <div className="mx-4 mb-3 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,.07)', border: `1px solid rgba(255,255,255,.13)`, borderTop: `3px solid ${accent}` }}>
            <GameCard d={d} accent={accent} minute={minute} countdown={countdown} showScore={false} noPadding />
          </div>

          {/* Promoção com botão WhatsApp inline */}
          <div className="mx-4 mb-3 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,.08)', borderTop: `2px solid ${accent}` }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-black text-lg leading-tight" style={{ color: accent }}>{d.promoName}</p>
                {d.promoDescription && (
                  <p className="mt-1 text-sm text-white/60 leading-relaxed">{d.promoDescription}</p>
                )}
              </div>
              {d.phone && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 44, height: 44, background: '#25d366', boxShadow: '0 4px 12px rgba(37,211,102,.4)' }}>
                  <WppIcon />
                </a>
              )}
            </div>
          </div>

          <StatsRow interested={interested} freeTables={freeTables} rating={d.rating} accent={accent} />
          <UrgencyBar urgencyPct={urgencyPct} freeTables={freeTables} totalTables={d.totalTables} accent={accent} />
          {showGallery && <Gallery images={d.galleryImages} onOpen={setLightbox} accent={accent} />}
          <InfoBlock d={d} mapsUrl={mapsUrl} />
          <CTAButtons whatsappUrl={whatsappUrl} mapsUrl={mapsUrl} accent={accent} primary={primary} proStyle={false} />
          <div className="text-center pt-8 pb-3 text-xs text-white/18 tracking-widest">Criado com Copa Turbo</div>
        </div>

        {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      </div>
    </>
  )
}

// ─── PRO ─────────────────────────────────────────────────────────────────────
function PagePro({ d, watermark, whatsappUrl, mapsUrl, urgencyPct, countdown, showGallery, showCover, lightbox, setLightbox, minute, freeTables, interested }: any) {
  const { primary, accent } = d.colors
  const darkBg = '#06060f'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;900&display=swap');
        .pp{font-family:'Nunito',sans-serif}
        .pp-title{font-family:'Bebas Neue',sans-serif}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse-ring{0%,100%{box-shadow:0 0 0 0 rgba(220,50,50,.55)}50%{box-shadow:0 0 0 9px rgba(220,50,50,0)}}
        @keyframes rise{0%{transform:translateY(100%) scale(0);opacity:0}10%{opacity:.5}90%{opacity:.15}100%{transform:translateY(-30px) scale(1);opacity:0}}
        @keyframes rotate-light{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes expand-ring{0%{transform:scale(.8);opacity:.7}100%{transform:scale(1.3);opacity:0}}
        @keyframes logo-pulse{0%,100%{box-shadow:0 0 0 2px rgba(253,221,0,.3),0 6px 16px rgba(0,0,0,.5)}50%{box-shadow:0 0 0 5px rgba(253,221,0,.15),0 6px 24px rgba(253,221,0,.2)}}
        @keyframes badge-glow{0%,100%{box-shadow:0 0 0 0 rgba(253,221,0,0)}50%{box-shadow:0 0 10px 2px rgba(253,221,0,.15)}}
        @keyframes btn-glow{0%,100%{box-shadow:0 4px 16px rgba(253,221,0,.2)}50%{box-shadow:0 4px 28px rgba(253,221,0,.45)}}
        @keyframes bar-fill{from{width:0}to{width:${urgencyPct}%}}
        @keyframes float-pro{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes shimmer-pro{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .live-ring{animation:pulse-ring 1.6s ease-in-out infinite}
        .live-dot{animation:blink 1s step-end infinite}
        .pro-logo-anim{animation:logo-pulse 2.5s ease-in-out infinite}
        .pro-badge-anim{animation:badge-glow 2.5s ease-in-out infinite}
        .pro-btn-anim{animation:btn-glow 2s ease-in-out infinite}
        .urgency-fill{animation:bar-fill 1.2s ease both}
        .pro-float{animation:float-pro 4s ease-in-out infinite}
        .pro-shimmer{position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(253,221,0,.05) 50%,transparent 65%);animation:shimmer-pro 4s ease-in-out infinite;pointer-events:none}
        .fadeUp{animation:fadeUp .5s ease both}
      `}</style>

      <div className="pp min-h-screen text-white relative" style={{ background: darkBg }}>
        {watermark && <WatermarkOverlay />}

        {/* Luz giratória de fundo */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `conic-gradient(from 0deg at 50% 25%, transparent 0deg, ${accent}06 60deg, transparent 120deg)`,
            animation: 'rotate-light 8s linear infinite',
          }} />
        </div>

        {/* Partículas */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: Math.random() * 3 + 1.5,
              height: Math.random() * 3 + 1.5,
              borderRadius: '50%',
              background: accent,
              left: `${Math.random() * 100}%`,
              bottom: 0,
              animation: `rise ${Math.random() * 4 + 3}s ${Math.random() * 6}s linear infinite`,
              opacity: Math.random() * 0.5 + 0.2,
            }} />
          ))}
        </div>

        <div className="relative max-w-sm mx-auto pb-10 px-0" style={{ zIndex: 1 }}>

          {/* Cover premium escura */}
          <div className="relative overflow-hidden" style={{ height: showCover && d.coverImage ? 220 : 120, borderRadius: '0 0 28px 28px' }}>
            {showCover && d.coverImage ? (
              <img src={d.coverImage} alt={d.barName} className="w-full h-full object-cover" style={{ filter: 'brightness(.35)' }} />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 60% 40%, ${accent}12 0%, transparent 65%)` }} />
            )}
            {/* Anéis expansivos */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', border: `1px solid ${accent}18`, animation: 'expand-ring 3s ease-out infinite' }} />
            <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', border: `1px solid ${accent}09`, animation: 'expand-ring 3s .6s ease-out infinite' }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, ${darkBg}cc 100%)` }} />
            {/* Logo pulsante */}
            <div className="absolute pro-logo-anim" style={{ bottom: -22, left: 16 }}>
              {d.logo ? (
                <img src={d.logo} alt={d.barName} style={{ width: 60, height: 60, borderRadius: 14, objectFit: 'cover', border: `3px solid ${darkBg}` }} />
              ) : (
                <div className="pp-title flex items-center justify-center text-2xl" style={{ width: 60, height: 60, borderRadius: 14, background: `linear-gradient(135deg, ${accent}, #f59e0b)`, color: darkBg, border: `3px solid ${darkBg}` }}>
                  {d.barInitials}
                </div>
              )}
            </div>
          </div>

          {/* Header */}
          <div className="flex items-end justify-between px-4 pt-9 pb-3 fadeUp">
            <div>
              <div className="pp-title text-3xl tracking-widest leading-none">{d.barName}</div>
              <div className="text-xs uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,.3)' }}>{d.barType} • {d.city}</div>
            </div>
            <div className="pro-badge-anim flex items-center gap-1 rounded-full px-3 py-1.5" style={{ background: `${accent}15`, border: `1px solid ${accent}40` }}>
              <span className="text-xs font-black" style={{ color: accent }}>✓</span>
              <span className="text-xs font-bold" style={{ color: accent }}>Pro Verificado</span>
            </div>
          </div>

          {/* Placar ao vivo — destaque máximo */}
          <div className="mx-4 mb-3 rounded-2xl overflow-hidden relative pro-float fadeUp" style={{ background: `${accent}08`, border: `1px solid ${accent}20`, animationDelay: '.1s' }}>
            <div className="pro-shimmer" />
            <div className="p-4">
              {d.game.isLive ? (
                <>
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center flex-1">
                      <div className="pp-title leading-none" style={{ fontSize: teamFontSize(d.game.team1), color: '#fff' }}>{d.game.team1.toUpperCase()}</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2 rounded-xl px-4 py-2" style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
                        <span className="pp-title text-5xl leading-none" style={{ color: accent }}>{d.game.score1}</span>
                        <span className="pp-title text-3xl" style={{ color: 'rgba(255,255,255,.2)' }}>:</span>
                        <span className="pp-title text-5xl leading-none" style={{ color: accent }}>{d.game.score2}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="live-dot w-2 h-2 rounded-full" style={{ background: '#dc2222' }} />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,.5)' }}>
                          {minute < 90 ? `${minute}'` : 'Encerrado'}
                        </span>
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="pp-title leading-none" style={{ fontSize: teamFontSize(d.game.team2), color: '#fff' }}>{d.game.team2.toUpperCase()}</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-4 mb-3">
                    <div className="pp-title text-4xl leading-none text-white">{d.game.team1.toUpperCase()}</div>
                    <div className="pp-title text-2xl" style={{ color: accent }}>×</div>
                    <div className="pp-title text-4xl leading-none text-white">{d.game.team2.toUpperCase()}</div>
                  </div>
                  {countdown && (
                    <div className="grid grid-cols-4 gap-2">
                      {[{ val: countdown.d, label: 'Dias' }, { val: countdown.h, label: 'Horas' }, { val: countdown.m, label: 'Min' }, { val: countdown.s, label: 'Seg' }].map((item) => (
                        <div key={item.label} className="rounded-xl py-2 text-center" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
                          <div className="pp-title text-3xl leading-none" style={{ color: accent }}>{String(item.val).padStart(2, '0')}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,.35)' }}>{item.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {d.game.date && <div className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,.35)' }}>{d.game.date}</div>}
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mx-4 mb-3 grid grid-cols-3 gap-2 fadeUp" style={{ animationDelay: '.15s' }}>
            {[{ num: interested, label: 'Interessados', icon: '👥' }, { num: freeTables, label: 'Mesas livres', icon: '🪑' }, { num: `${d.rating}★`, label: 'Avaliação', icon: '⭐' }].map((s) => (
              <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,.05)', border: 'rgba(255,255,255,.08) 1px solid' }}>
                <div className="text-base mb-0.5">{s.icon}</div>
                <div className="pp-title text-2xl leading-none" style={{ color: accent }}>{s.num}</div>
                <div className="text-xs mt-1 leading-tight" style={{ color: 'rgba(255,255,255,.4)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Urgência */}
          <div className="mx-4 mb-3 rounded-2xl p-4 fadeUp" style={{ background: `${accent}0e`, border: `1px solid ${accent}30`, animationDelay: '.2s' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black" style={{ color: accent }}>🔥 Quase lotado!</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,.45)' }}>{freeTables} de {d.totalTables} mesas</span>
            </div>
            <div className="rounded-full h-2.5 overflow-hidden" style={{ background: 'rgba(255,255,255,.08)' }}>
              <div className="urgency-fill h-full rounded-full" style={{ background: `linear-gradient(90deg, ${accent}, #f59e0b)` }} />
            </div>
            <div className="text-xs mt-2" style={{ color: 'rgba(255,255,255,.5)' }}>
              ⚡ Apenas <strong className="text-white">{freeTables} mesas</strong> disponíveis
            </div>
          </div>

          {/* Promoção */}
          <div className="mx-4 mb-1 text-xs uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,.3)' }}>🏆 Promoção do jogo</div>
          <div className="mx-4 mb-3 mt-2 rounded-2xl p-5 fadeUp" style={{ background: `linear-gradient(135deg, ${accent}20, ${accent}06)`, border: `1.5px solid ${accent}40`, animationDelay: '.25s' }}>
            <div className="pp-title text-2xl leading-tight mb-2" style={{ color: accent }}>{d.promoName}</div>
            {d.promoDescription && <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,.7)' }}>{d.promoDescription}</p>}
          </div>

          {/* Galeria */}
          {showGallery && (
            <>
              <div className="mx-4 mb-1 text-xs uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,.3)' }}>📸 Fotos do local</div>
              <div className="mx-4 mb-3 mt-2 grid grid-cols-3 gap-1.5">
                {d.galleryImages!.slice(0, 6).map((src: string, i: number) => (
                  <img key={i} src={src} alt={`Foto ${i + 1}`} onClick={() => setLightbox(src)}
                    className="w-full aspect-square object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ border: `1px solid ${accent}25` }} />
                ))}
              </div>
            </>
          )}

          <InfoBlock d={d} mapsUrl={mapsUrl} proStyle />
          <CTAButtons whatsappUrl={whatsappUrl} mapsUrl={mapsUrl} accent={accent} primary={darkBg} proStyle />
          <div className="text-center pt-8 pb-3 text-xs tracking-widest" style={{ color: 'rgba(255,255,255,.15)' }}>Criado com Copa Turbo</div>
        </div>

        {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      </div>
    </>
  )
}

// ─── Componentes reutilizáveis ────────────────────────────────────────────────

function LogoOrInitials({ d, size, radius, accent, primary }: any) {
  if (d.logo) return (
    <img src={d.logo} alt={d.barName} style={{ width: size, height: size, borderRadius: radius, objectFit: 'cover', margin: '0 auto', display: 'block', boxShadow: `0 0 0 4px ${accent}40` }} />
  )
  return (
    <div className="pp-title flex items-center justify-center mx-auto" style={{ width: size, height: size, borderRadius: radius, background: accent, color: primary, fontSize: size * 0.35 }}>
      {d.barInitials}
    </div>
  )
}

function GameCard({ d, accent, minute, countdown, showScore, noPadding }: any) {
  const p = noPadding ? 'p-3' : 'mx-4 mb-3 p-4'
  return (
    <div className={p}>
      <div className="flex justify-center mb-3">
        {d.game.isLive ? (
          <span className="live-ring inline-flex items-center gap-2 text-white text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full" style={{ background: '#dd2222' }}>
            <span className="live-dot w-2 h-2 bg-white rounded-full" />
            AO VIVO
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-white/70 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,.1)' }}>
            📅 EM BREVE
          </span>
        )}
      </div>
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="pp-title flex-1 text-right text-white leading-none" style={{ fontSize: teamFontSize(d.game.team1) }}>{d.game.team1.toUpperCase()}</span>
        <span className="pp-title text-xl px-2 py-1 rounded-xl leading-none flex-shrink-0" style={{ color: accent, background: `${accent}18` }}>VS</span>
        <span className="pp-title flex-1 text-left text-white leading-none" style={{ fontSize: teamFontSize(d.game.team2) }}>{d.game.team2.toUpperCase()}</span>
      </div>
      {d.game.date && <div className="text-center text-xs text-white/40 mb-2">{d.game.date}</div>}
      {!d.game.isLive && countdown && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {[{ val: countdown.d, label: 'Dias' }, { val: countdown.h, label: 'Horas' }, { val: countdown.m, label: 'Min' }, { val: countdown.s, label: 'Seg' }].map((item) => (
            <div key={item.label} className="rounded-xl py-2 text-center" style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
              <div className="pp-title text-2xl leading-none" style={{ color: accent }}>{String(item.val).padStart(2, '0')}</div>
              <div className="text-xs text-white/40 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatsRow({ interested, freeTables, rating, accent }: any) {
  return (
    <div className="mx-4 mb-3 grid grid-cols-3 gap-2">
      {[{ num: interested, label: 'Interessados', icon: '👥' }, { num: freeTables, label: 'Mesas livres', icon: '🪑' }, { num: `${rating}★`, label: 'Avaliação', icon: '⭐' }].map((s) => (
        <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)' }}>
          <div className="text-lg mb-0.5">{s.icon}</div>
          <div className="pp-title text-2xl leading-none" style={{ color: accent }}>{s.num}</div>
          <div className="text-xs text-white/45 mt-1 leading-tight">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

function UrgencyBar({ urgencyPct, freeTables, totalTables, accent }: any) {
  return (
    <div className="mx-4 mb-3 rounded-2xl p-4" style={{ background: `${accent}10`, border: `1px solid ${accent}35` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-black" style={{ color: accent }}>🔥 Quase lotado!</span>
        <span className="text-xs text-white/50">{freeTables} de {totalTables} mesas</span>
      </div>
      <div className="rounded-full h-2.5 overflow-hidden" style={{ background: 'rgba(255,255,255,.1)' }}>
        <div className="urgency-fill h-full rounded-full" style={{ background: `linear-gradient(90deg, ${accent}, #ff7c00)` }} />
      </div>
      <div className="text-xs text-white/55 mt-2">⚡ Apenas <strong className="text-white">{freeTables} mesas</strong> disponíveis</div>
    </div>
  )
}

function PromoCard({ promoName, promoDescription, accent }: any) {
  return (
    <>
      <div className="mx-4 mb-1 text-xs text-white/35 uppercase tracking-widest font-bold">🏆 Promoção do jogo</div>
      <div className="mx-4 mb-3 mt-2 rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${accent}22, ${accent}08)`, border: `1.5px solid ${accent}45` }}>
        <div className="pp-title text-2xl leading-tight mb-2" style={{ color: accent }}>{promoName}</div>
        {promoDescription && <p className="text-sm text-white/75 leading-relaxed">{promoDescription}</p>}
      </div>
    </>
  )
}

function Gallery({ images, onOpen, accent }: any) {
  return (
    <>
      <div className="mx-4 mb-1 text-xs text-white/35 uppercase tracking-widest font-bold">📸 Fotos do local</div>
      <div className="mx-4 mb-3 mt-2 grid grid-cols-3 gap-1.5">
        {images.slice(0, 6).map((src: string, i: number) => (
          <img key={i} src={src} alt={`Foto ${i + 1}`} onClick={() => onOpen(src)}
            className="w-full aspect-square object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
            style={{ border: '1px solid rgba(255,255,255,.10)' }} />
        ))}
      </div>
    </>
  )
}

function InfoBlock({ d, mapsUrl, proStyle }: any) {
  const rowStyle = proStyle
    ? { borderBottom: '1px solid rgba(255,255,255,.06)' }
    : { borderBottom: '1px solid rgba(255,255,255,.07)' }
  return (
    <>
      <div className="mx-4 mb-1 text-xs text-white/35 uppercase tracking-widest font-bold">📍 Onde estamos</div>
      <div className="mx-4 mb-4 mt-2 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)' }}>
        {(d.address || d.city) && (
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors" style={rowStyle}>
            <span className="text-lg mt-0.5 flex-shrink-0">📍</span>
            <div>
              {d.address && <div className="text-sm text-white/90 font-semibold">{d.address}</div>}
              <div className="text-xs text-white/50 mt-0.5">{d.city}</div>
            </div>
            <span className="ml-auto text-white/30 text-xs self-center">→</span>
          </a>
        )}
        {d.phone && (
          <div className="flex items-center gap-3 px-4 py-3.5" style={rowStyle}>
            <span className="text-lg flex-shrink-0">📞</span>
            <span className="text-sm text-white/75">{d.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-3 px-4 py-3.5" style={rowStyle}>
          <span className="text-lg flex-shrink-0">🕐</span>
          <span className="text-sm text-white/75">Aberto durante toda a transmissão</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <span className="text-lg flex-shrink-0">📶</span>
          <span className="text-sm text-white/75">Wi-Fi gratuito</span>
        </div>
      </div>
    </>
  )
}

function CTAButtons({ whatsappUrl, mapsUrl, accent, primary, proStyle }: any) {
  return (
    <div className="mx-4 flex flex-col gap-3">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
        className={`pro-btn-anim flex items-center justify-center gap-3 font-black text-base py-4 rounded-2xl transition-all ${proStyle ? 'pro-btn-anim' : ''}`}
        style={proStyle
          ? { background: `linear-gradient(90deg, ${accent}, #f59e0b)`, color: primary }
          : { background: '#25d366', boxShadow: '0 6px 24px rgba(37,211,102,.4)', color: '#fff' }}>
        <WppIcon />
        Reservar pelo WhatsApp
      </a>
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-white/65 font-semibold text-sm py-3.5 rounded-2xl transition-all hover:bg-white/5"
        style={{ border: '1px solid rgba(255,255,255,.14)' }}>
        🗺️ Como chegar
      </a>
    </div>
  )
}

function WppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function WatermarkOverlay() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50" style={{ transform: 'rotate(-35deg)' }}>
      <div className="pp-title text-6xl tracking-widest text-white select-none" style={{ opacity: 0.07, whiteSpace: 'nowrap' }}>
        PRÉVIA • COPA TURBO • PRÉVIA • COPA TURBO
      </div>
    </div>
  )
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,.92)' }} onClick={onClose}>
      <img src={src} alt="Foto ampliada" className="max-w-full max-h-full rounded-2xl object-contain" style={{ maxHeight: '90vh', maxWidth: '90vw' }} />
      <button className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-bold" onClick={onClose}>×</button>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
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
  }, [])

  const d = resolved ?? DEFAULT_DATA
  const { accent } = d.colors

  const isPremiumOrPro = planId === 'premium' || planId === 'pro'
  const isPro = planId === 'pro'
  const watermark = showWatermark !== undefined ? showWatermark : !isPro

  const showGallery = isPremiumOrPro && !!d.galleryImages && d.galleryImages.length > 0
  const showCover = isPro && !!d.coverImage

  const [interested, setInterested] = useState(d.interested)
  const [freeTables, setFreeTables] = useState(d.freeTables)
  const [minute, setMinute] = useState(d.game.minute)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<{ d: number; h: number; m: number; s: number } | null>(null)

  useEffect(() => { setInterested(d.interested); setFreeTables(d.freeTables); setMinute(d.game.minute) }, [resolved])

  useEffect(() => {
    if (!d.game.isLive) return
    const t1 = setInterval(() => setMinute((m) => (m < 90 ? m + 1 : m)), 60_000)
    const t2 = setInterval(() => setInterested((n) => n + Math.floor(Math.random() * 3)), 8_000)
    const t3 = setInterval(() => { if (Math.random() > .65) setFreeTables((t) => Math.max(0, t - 1)) }, 15_000)
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3) }
  }, [d.game.isLive])

  useEffect(() => {
    if (d.game.isLive) return
    const gameDate = data?.gameDateTime ? new Date(data.gameDateTime) : null
    if (!gameDate || isNaN(gameDate.getTime())) return
    const tick = () => {
      const diff = gameDate.getTime() - Date.now()
      if (diff <= 0) { setCountdown(null); return }
      setCountdown({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) })
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [d.game.isLive, data?.gameDateTime])

  const urgencyPct = Math.round(((d.totalTables - freeTables) / d.totalTables) * 100)
  const whatsappMsg = encodeURIComponent(`Olá! Vi a promoção "${d.promoName}" para o jogo ${d.game.team1} x ${d.game.team2} no ${d.barName} e quero saber mais!`)
  const whatsappUrl = `https://wa.me/${d.phone}?text=${whatsappMsg}`
  const mapsQuery = d.address ? `${d.address}, ${d.city}, SP, Brasil` : `${d.barName}, ${d.city}, SP, Brasil`
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`

  const shared = { d, watermark, whatsappUrl, mapsUrl, urgencyPct, countdown, showGallery, showCover, lightbox, setLightbox, minute, freeTables, interested }

  if (isPro) return <PagePro {...shared} />
  if (planId === 'premium') return <PagePremium {...shared} />
  return <PageBasico {...shared} />
}
