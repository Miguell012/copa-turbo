import type { CampaignFormData } from "@/lib/types";
import CampaignCreative from "./CampaignCreative";

interface WhatsAppBannerPreviewProps {
  data: CampaignFormData;
  showWatermark?: boolean;
  planId?: "basico" | "premium" | "pro";
}

export default function WhatsAppBannerPreview({
  data,
  showWatermark = false,
  planId = "basico",
}: WhatsAppBannerPreviewProps) {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-card">
        <CampaignCreative
          data={data}
          variant="banner"
          showWatermark={showWatermark}
          planId={planId}
        />
      </div>
      <p className="mt-2 text-center text-xs font-medium text-slate-500">
        Banner WhatsApp · ideal para status e grupos
      </p>
    </div>
  );
}
