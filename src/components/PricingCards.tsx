"use client";

import Link from "next/link";
import { PLANS } from "@/lib/plans";
import type { PlanId } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PricingCardsProps {
  selectedPlanId?: PlanId | null;
  onSelectPlan?: (planId: PlanId) => void;
  showCta?: boolean;
  compact?: boolean;
}

const PLAN_STYLES = {
  basico: {
    wrapper: "border-slate-200 bg-white",
    badge: "bg-slate-500 text-white",
    title: "text-copa-blue",
    price: "text-copa-blue",
    campaigns: "text-slate-500",
    check: "text-slate-400",
    featureText: "text-slate-600",
    divider: "border-slate-100",
    button: "bg-copa-blue text-white hover:bg-copa-blue-light",
    buttonSelected: "bg-copa-yellow text-copa-blue hover:bg-copa-yellow-dark",
    firstFeature: false,
  },
  premium: {
    wrapper: "border-copa-green ring-2 ring-copa-green/30 bg-white lg:scale-105",
    badge: "bg-copa-green text-white",
    title: "text-copa-blue",
    price: "text-copa-blue",
    campaigns: "text-copa-green font-semibold",
    check: "text-copa-green",
    featureText: "text-slate-700",
    divider: "border-copa-green/20",
    button: "bg-copa-yellow text-copa-blue hover:bg-copa-yellow-dark",
    buttonSelected: "bg-copa-yellow text-copa-blue hover:bg-copa-yellow-dark",
    firstFeature: false,
  },
  pro: {
    wrapper: "border-transparent bg-copa-blue text-white ring-2 ring-copa-blue/40",
    badge: "bg-copa-yellow text-copa-blue",
    title: "text-white",
    price: "text-copa-yellow",
    campaigns: "text-copa-yellow font-semibold",
    check: "text-copa-yellow",
    featureText: "text-white/90",
    divider: "border-white/10",
    button: "bg-copa-yellow text-copa-blue hover:brightness-110",
    buttonSelected: "bg-white text-copa-blue hover:bg-white/90",
    firstFeature: false,
  },
} as const;

export default function PricingCards({
  selectedPlanId,
  onSelectPlan,
  showCta = true,
  compact = false,
}: PricingCardsProps) {
  return (
    <div
      className={cn(
        "grid gap-6 items-start",
        compact ? "md:grid-cols-3" : "lg:grid-cols-3"
      )}
    >
      {PLANS.map((plan) => {
        const isSelected = selectedPlanId === plan.id;
        const styles = PLAN_STYLES[plan.id as keyof typeof PLAN_STYLES] ?? PLAN_STYLES.basico;
        const isPro = plan.id === "pro";

        return (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-2xl border p-6 shadow-card transition-all",
              styles.wrapper,
              isSelected && plan.id !== "pro" && "ring-2 ring-copa-blue"
            )}
          >
            {/* Badge */}
            {plan.badge && (
              <span
                className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-bold",
                  styles.badge
                )}
              >
                {plan.badge}
              </span>
            )}

            {/* Header */}
            <div>
              <h3 className={cn("text-lg font-bold", styles.title)}>{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className={cn("text-3xl font-black", styles.price)}>
                  {plan.priceLabel}
                </span>
              </div>
              <p className={cn("mt-1 text-sm", styles.campaigns)}>
                {plan.campaigns}
              </p>
            </div>

            {/* Divider */}
            <div className={cn("my-5 border-t", styles.divider)} />

            {/* Features */}
            <ul className="flex-1 space-y-3">
              {plan.features.map((feature, i) => {
                const isFirst = i === 0 && feature.startsWith("Tudo do");
                return (
                  <li
                    key={feature}
                    className={cn(
                      "flex items-start gap-2 text-sm",
                      isFirst ? cn(styles.featureText, "font-medium opacity-70 italic") : styles.featureText
                    )}
                  >
                    {isFirst ? (
                      <svg
                        className={cn("mt-0.5 h-4 w-4 shrink-0", styles.check)}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    ) : (
                      <svg
                        className={cn("mt-0.5 h-4 w-4 shrink-0", styles.check)}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {feature}
                  </li>
                );
              })}
            </ul>

            {/* CTA */}
            {onSelectPlan ? (
              <button
                type="button"
                onClick={() => onSelectPlan(plan.id)}
                className={cn(
                  "mt-6 w-full rounded-xl py-3 text-sm font-bold transition-all",
                  isSelected ? styles.buttonSelected : styles.button
                )}
              >
                {isSelected ? "✓ Plano selecionado" : isPro ? "Quero lotar meu bar →" : "Escolher plano"}
              </button>
            ) : showCta ? (
              <Link
                href={`/criar?plano=${plan.id}`}
                className={cn(
                  "mt-6 block w-full rounded-xl py-3 text-center text-sm font-bold transition-all",
                  styles.button
                )}
              >
                {isPro ? "Quero lotar meu bar →" : "Começar agora"}
              </Link>
            ) : null}

            {/* Pro extra note */}
            {isPro && (
              <p className="mt-3 text-center text-xs text-white/50">
                30 dias de campanhas ilimitadas
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
