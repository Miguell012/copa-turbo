'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PublicPromotionPage from '@/components/PublicPromotionPage'
import { getCampaignBySlug, setCheckoutData } from '@/lib/storage'
import { getImages } from '@/lib/imageStorage'
import { getPlanById } from '@/lib/plans'
import type { Campaign } from '@/lib/types'

export default function PromocaoPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(undefined)

  useEffect(() => {
    if (!slug) return
    const found = getCampaignBySlug(slug)
    if (!found) { setCampaign(null); return }

    getImages(found.id).then((images) => {
      setCampaign({
        ...found,
        logo: images?.logo ?? found.logo,
        coverImage: images?.coverImage ?? (found as any).coverImage,
        galleryImages: images?.galleryImages ?? found.galleryImages,
      } as Campaign)
    })
  }, [slug])

  if (campaign === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Carregando...</p>
      </div>
    )
  }

  if (campaign === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Campanha não encontrada.</p>
      </div>
    )
  }

  // Se não está paga, mostra página bloqueada
  if (!campaign.paid) {
    const plan = getPlanById(campaign.planId)

    const handleCheckout = () => {
      setCheckoutData({ planId: campaign.planId, campaignId: campaign.id })
      router.push('/checkout')
    }

    return (
      <div className="relative min-h-screen">
        {/* Página borrada ao fundo */}
        <div className="pointer-events-none select-none" style={{ filter: 'blur(8px)', opacity: 0.4 }}>
          <PublicPromotionPage
            data={campaign}
            planId={campaign.planId}
            showWatermark={false}
          />
        </div>

        {/* Overlay de bloqueio */}
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,15,50,0.75)' }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-8 text-center"
            style={{ background: 'linear-gradient(160deg, #002776 0%, #003d99 100%)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
          >
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-black text-white mb-2">
              Campanha bloqueada
            </h1>
            <p className="text-white/60 text-sm mb-2 leading-relaxed">
              <strong className="text-white">{campaign.businessName}</strong>
            </p>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              Esta página ainda não foi liberada. Finalize o pagamento para acessar.
            </p>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-4 rounded-2xl font-black text-base mb-3 transition-all hover:opacity-90"
              style={{ background: '#FEDD00', color: '#002776' }}
            >
              Desbloquear — {plan?.priceLabel}
            </button>

            <p className="text-white/30 text-xs">
              Pagamento único • Sem mensalidade
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Campanha paga — mostra normalmente
  return (
    <PublicPromotionPage
      data={campaign}
      planId={campaign.planId}
      showWatermark={false}
    />
  )
}
