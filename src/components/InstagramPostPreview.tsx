import type { CampaignFormData } from "@/lib/types";
import CampaignCreative from "./CampaignCreative";

interface InstagramPostPreviewProps {
  data: CampaignFormData;
  showFrame?: boolean;
  showWatermark?: boolean;
}

export default function InstagramPostPreview({
  data,
  showFrame = true,
  showWatermark = false,
}: InstagramPostPreviewProps) {
  const content = <CampaignCreative data={data} variant="post" showWatermark={showWatermark} />;

  if (!showFrame) return content;

  return (
    <div className="mx-auto max-w-[320px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-copa-green to-copa-blue" />
          <div>
            <p className="text-xs font-semibold text-slate-900">
              {data.businessName.toLowerCase().replace(/\s/g, "_")}
            </p>
            <p className="text-[10px] text-slate-400">Patrocinado · Copa Turbo</p>
          </div>
        </div>
        {content}
        <div className="mt-3 flex gap-4 text-slate-400">
          <span className="text-lg">♥</span>
          <span className="text-lg">💬</span>
          <span className="text-lg">↗</span>
        </div>
        <p className="mt-2 text-xs text-slate-600">
          <span className="font-semibold">{data.businessName}</span>{" "}
          {data.promotionName} — {data.mainTeam} x {data.opponent} ⚽
        </p>
      </div>
      <p className="mt-2 text-center text-xs font-medium text-slate-500">
        Post Instagram · 1080×1080
      </p>
    </div>
  );
}
