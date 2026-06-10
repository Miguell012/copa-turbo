"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import type { Campaign } from "@/lib/types";
import { getCampaigns } from "@/lib/storage";
import { getPlanById } from "@/lib/plans";
import { getPublicPromotionUrl } from "@/lib/utils";

function StatusBadge({ paid }: { paid: boolean }) {
  return paid ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-copa-green/10 px-2.5 py-1 text-xs font-bold text-copa-green">
      ✓ Ativa
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
      🔒 Bloqueada
    </span>
  );
}

function PlanBadge({ planId }: { planId: string }) {
  const colors: Record<string, string> = {
    basico: "bg-slate-100 text-slate-600",
    premium: "bg-copa-blue/10 text-copa-blue",
    pro: "bg-copa-yellow/20 text-amber-700",
  };
  const plan = getPlanById(planId);
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${colors[planId] ?? colors.basico}`}>
      {plan?.name ?? planId}
    </span>
  );
}

function deleteCampaign(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("copa-turbo-campaigns");
    const campaigns: Campaign[] = raw ? JSON.parse(raw) : [];
    const updated = campaigns.filter((c) => c.id !== id);
    localStorage.setItem("copa-turbo-campaigns", JSON.stringify(updated));
  } catch {}
}

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<"todas" | "ativas" | "bloqueadas">("todas");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setCampaigns(getCampaigns().sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que quer deletar essa campanha? Essa ação não pode ser desfeita.")) return;
    deleteCampaign(id);
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = campaigns.filter((c) => {
    if (filter === "ativas") return c.paid;
    if (filter === "bloqueadas") return !c.paid;
    return true;
  });

  const totalAtivas = campaigns.filter((c) => c.paid).length;
  const totalBloqueadas = campaigns.filter((c) => !c.paid).length;

  return (
    <AppShell>
      <section className="bg-slate-100 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-copa-blue">Minhas campanhas</h1>
              <p className="mt-1 text-slate-600">Gerencie todas as suas promoções em um só lugar.</p>
            </div>
            <Link href="/planos" className="btn-primary text-center">+ Nova campanha</Link>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { label: "Total", num: campaigns.length, color: "text-copa-blue" },
              { label: "Ativas", num: totalAtivas, color: "text-copa-green" },
              { label: "Bloqueadas", num: totalBloqueadas, color: "text-amber-600" },
            ].map((s) => (
              <div key={s.label} className="card text-center py-4">
                <div className={`text-3xl font-black ${s.color}`}>{s.num}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 pt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          {/* Filtros */}
          <div className="flex gap-2 mb-6">
            {(["todas", "ativas", "bloqueadas"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all capitalize ${
                  filter === f
                    ? "bg-copa-blue text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-copa-blue/30"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-5xl mb-4">📋</div>
              <h2 className="text-xl font-bold text-copa-blue mb-2">
                {campaigns.length === 0 ? "Nenhuma campanha ainda" : "Nenhuma campanha nesse filtro"}
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                {campaigns.length === 0
                  ? "Crie sua primeira campanha e comece a atrair clientes nos dias de jogo."
                  : "Tente mudar o filtro acima."}
              </p>
              {campaigns.length === 0 && (
                <Link href="/planos" className="btn-primary inline-block">Criar primeira campanha</Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((campaign) => {
                const publicUrl = typeof window !== "undefined"
                  ? getPublicPromotionUrl(campaign.slug)
                  : `/promocao/${campaign.slug}`;
                const gameDate = campaign.gameDateTime
                  ? new Date(campaign.gameDateTime).toLocaleString("pt-BR", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })
                  : null;
                const createdAt = new Date(campaign.createdAt).toLocaleDateString("pt-BR");

                return (
                  <div key={campaign.id} className="card flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Barra colorida do plano */}
                    <div
                      className="hidden sm:block h-12 w-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: campaign.planId === "pro"
                          ? "#FEDD00"
                          : campaign.planId === "premium"
                          ? "#002776"
                          : "#94a3b8",
                      }}
                    />

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-copa-blue text-lg truncate">{campaign.businessName}</h3>
                        <StatusBadge paid={campaign.paid} />
                        <PlanBadge planId={campaign.planId} />
                      </div>
                      <p className="text-sm text-slate-600 truncate">{campaign.promotionName}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                        <span>⚽ {campaign.mainTeam} x {campaign.opponent}</span>
                        {gameDate && <span>📅 {gameDate}</span>}
                        <span>📍 {campaign.city}</span>
                        <span>🗓 Criada em {createdAt}</span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                      <Link
                        href={`/preview?id=${campaign.id}`}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-copa-blue/30 hover:text-copa-blue transition-all"
                      >
                        👁 Prévia
                      </Link>

                      <Link
                        href={`/criar?editar=${campaign.id}`}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-copa-blue/30 hover:text-copa-blue transition-all"
                      >
                        ✏️ Editar
                      </Link>

                      {campaign.paid ? (
                        <>
                          <a
                            href={publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl border border-copa-green/30 bg-copa-green/5 px-3 py-2 text-xs font-semibold text-copa-green hover:bg-copa-green/10 transition-all"
                          >
                            🔗 Abrir
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(campaign.id, publicUrl)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold transition-all"
                            style={{
                              color: copiedId === campaign.id ? '#009739' : undefined,
                              borderColor: copiedId === campaign.id ? '#009739' : undefined,
                            }}
                          >
                            {copiedId === campaign.id ? '✓ Copiado!' : '📋 Copiar'}
                          </button>
                        </>
                      ) : (
                        <Link
                          href={`/preview?id=${campaign.id}`}
                          className="rounded-xl bg-copa-blue px-3 py-2 text-xs font-bold text-white hover:bg-copa-blue/90 transition-all"
                        >
                          💳 Desbloquear
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(campaign.id)}
                        className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-50 hover:border-red-300 transition-all"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
