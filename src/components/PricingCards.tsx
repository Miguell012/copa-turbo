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

export default function PricingCards({
  selectedPlanId,
  onSelectPlan,
  showCta = true,
  compact = false,
}: PricingCardsProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        compact ? "md:grid-cols-3" : "lg:grid-cols-3"
      )}
    >
      {PLANS.map((plan) => {
        const isSelected = selectedPlanId === plan.id;
        const isHighlighted = plan.highlighted;

        return (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-white p-6 shadow-card transition-all",
              isHighlighted
                ? "border-copa-green ring-2 ring-copa-green/30 lg:scale-105"
                : "border-slate-200",
              isSelected && "ring-2 ring-copa-blue"
            )}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-copa-green px-4 py-1 text-xs font-bold text-white">
                {plan.badge}
              </span>
            )}

            <h3 className="text-lg font-bold text-copa-blue">{plan.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-black text-copa-blue">
                {plan.priceLabel}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-copa-green">
              {plan.campaigns}
            </p>

            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-copa-green"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {onSelectPlan ? (
              <button
                type="button"
                onClick={() => onSelectPlan(plan.id)}
                className={cn(
                  "mt-6 w-full rounded-xl py-3 text-sm font-bold transition-all",
                  isSelected || isHighlighted
                    ? "bg-copa-yellow text-copa-blue hover:bg-copa-yellow-dark"
                    : "bg-copa-blue text-white hover:bg-copa-blue-light"
                )}
              >
                {isSelected ? "Plano selecionado" : "Escolher plano"}
              </button>
            ) : showCta ? (
              <Link
                href={`/criar?plano=${plan.id}`}
                className={cn(
                  "mt-6 block w-full rounded-xl py-3 text-center text-sm font-bold transition-all",
                  isHighlighted
                    ? "bg-copa-yellow text-copa-blue hover:bg-copa-yellow-dark"
                    : "bg-copa-blue text-white hover:bg-copa-blue-light"
                )}
              >
                Começar agora
              </Link>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
