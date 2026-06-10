import type { CampaignFormData } from "@/lib/types";
import CampaignCreative from "./CampaignCreative";

interface InstagramStoryPreviewProps {
  data: CampaignFormData;
  showWatermark?: boolean;
}

export default function InstagramStoryPreview({
  data,
  showWatermark = false,
}: InstagramStoryPreviewProps) {
  return (
    <div className="mx-auto max-w-[200px]">
      <div className="overflow-hidden rounded-3xl border-4 border-slate-800 bg-slate-900 shadow-xl">
        <div className="relative aspect-[9/16] download-target">
          <CampaignCreative data={data} variant="story" showWatermark={showWatermark} />
          <div className="absolute left-0 right-0 top-0 flex items-center gap-2 p-3">
            <div className="h-1 flex-1 rounded-full bg-white/40">
              <div className="h-1 w-1/3 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-xs font-medium text-slate-500">
        Story Instagram · 1080×1920
      </p>
    </div>
  );
}
