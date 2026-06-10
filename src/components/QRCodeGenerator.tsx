"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  className?: string;
  showLabel?: boolean;
}

export default function QRCodeGenerator({
  url,
  size = 160,
  className = "",
  showLabel = true,
}: QRCodeGeneratorProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="rounded-2xl bg-white p-4 shadow-card">
        <QRCodeSVG
          value={url}
          size={size}
          level="M"
          includeMargin
          fgColor="#002776"
          bgColor="#ffffff"
        />
      </div>
      {showLabel && (
        <p className="mt-3 max-w-[200px] text-center text-xs text-slate-500 break-all">
          Escaneie para ver a promoção
        </p>
      )}
    </div>
  );
}
